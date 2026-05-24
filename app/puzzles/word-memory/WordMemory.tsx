'use client';

import { useEffect, useMemo, useRef, useState, type FC } from 'react';
import { useSearchParams } from 'next/navigation';
import { successPlayer, checkBeepPlayer, timerBeepPlayer } from '@/public/audio/AudioManager';
import usePersistantState from '@/app/utils/usePersistentState';
import { useDailyChallenge } from '@/app/utils/useDailyChallenge';
import { trackGameStart, trackGameRetry } from '@/app/utils/gtm';
import { useUser } from '@/app/contexts/UserContext';
import { NPSettingsRange } from '@/app/components/NPSettings';
import GameStatsTracker from '@/app/components/GameStatsTracker';
import { useGameHost } from '@/app/game/useGameHost';
import GameShell from '@/app/game/GameShell';
import type { GameMode, GamePhase, GameResult } from '@/app/game/types';
import { useReplayedState } from '@/app/utils/useReplayedState';
import OpponentSummary from '@/app/lobby/OpponentSummary';
import { wordMemoryEngine, type WordMemoryInput, type WordMemoryState } from './engine';

const defaultNumWords = 25;
const defaultDuration = 25;

interface WordMemoryViewProps {
  state: WordMemoryState;
  phase: GamePhase;
  result: GameResult | null;
  runId: number;
  durationMs: number;
  hideTimer?: boolean;
  compact?: boolean;
  // Interactive-only. When omitted, no buttons are rendered.
  onAnswer?: (answer: 'seen' | 'new') => void;
  // 1v1 spectator: per-button counters that pulse on each opponent press.
  pulseKeys?: { seen?: number; new?: number };
  settings?: React.ComponentProps<typeof GameShell>['settings'];
}

// Presentational shell + current word + Seen/New buttons. Driven by external
// state so the interactive host (useGameHost) and the spectator (useReplayedState)
// can both render it.
const WordMemoryView: FC<WordMemoryViewProps> = ({
  state,
  phase,
  result,
  runId,
  durationMs,
  hideTimer,
  compact,
  onAnswer,
  pulseKeys,
  settings,
}) => {
  const currentWord = state.sequence[state.round];
  // Render Seen/New on both sides so the splitscreen shells stay the same
  // height; just disable them on the spectator side.
  const noop = () => {};
  const buttons = [
    [
      {
        label: 'Seen',
        color: 'purple' as const,
        callback: onAnswer ? () => onAnswer('seen') : noop,
        disabled: !onAnswer || phase !== 'playing',
        pulseKey: pulseKeys?.seen,
      },
      {
        label: 'New',
        color: 'green' as const,
        callback: onAnswer ? () => onAnswer('new') : noop,
        disabled: !onAnswer || phase !== 'playing',
        pulseKey: pulseKeys?.new,
      },
    ],
  ];

  return (
    <GameShell
      title="Word Memory"
      description="Memorize the words seen"
      minHeight="min-h-[280px]"
      phase={phase}
      result={result}
      durationMs={durationMs}
      runId={runId}
      statusMessage={result ? (result.won ? 'Succeeded!' : 'Failed!') : ''}
      buttons={buttons}
      hideTimer={hideTimer}
      settings={settings}
    >
      <div
        className={`flex w-full flex-col flex-1 ${
          compact ? '' : 'min-w-[calc(100vw-60px)] sm:min-w-[550px] md:min-w-[600px] '
        }max-w-full rounded-lg bg-[rgba(0,28,49,0.3)] text-white`}
      >
        <p className="pt-4 text-center text-2xl">
          {state.round}/{state.numWords}
        </p>
        <div className="flex flex-1 items-center justify-center text-5xl">
          <p>{currentWord}</p>
        </div>
      </div>
    </GameShell>
  );
};

interface WordMemoryProps {
  // 1v1 match mode: defaults override saved prefs, engine seeds from this value, no auto-restart.
  seed?: number;
  // Fires when the match ends so the lobby can move on to the outcome view.
  onMatchEnd?: (result: GameResult) => void;
  // Streams each answer to the lobby for the opponent's spectator replay.
  onInput?: (input: WordMemoryInput) => void;
}

const WordMemory: FC<WordMemoryProps> = ({ seed, onMatchEnd, onInput }) => {
  const isMatch = seed !== undefined;
  const { isChallengeMode, challengeData, isLoading: isChallengeLoading, isCompleted, initialIsCompleted } = useDailyChallenge();
  const searchParams = useSearchParams();
  const isCompetitive = searchParams?.get('competitive') === 'true';
  const { user } = useUser();

  const [savedNumWords, setSavedNumWords, numWordsHydrated] = usePersistantState(
    'word-memory-num-words',
    defaultNumWords,
  );
  const [savedTimer, setSavedTimer, timerHydrated] = usePersistantState(
    'word-memory-timer',
    defaultDuration,
  );
  const settingsHydrated = numWordsHydrated && timerHydrated;

  const activeNumWords = isMatch
    ? defaultNumWords
    : isChallengeMode && challengeData
      ? challengeData.words || defaultNumWords
      : isCompetitive
        ? 25
        : savedNumWords;
  const activeTimer = isMatch
    ? defaultDuration
    : isChallengeMode && challengeData
      ? challengeData.targetTime
        ? Math.floor(challengeData.targetTime / 1000)
        : defaultDuration
      : isCompetitive
        ? 25
        : savedTimer;

  const mode: GameMode = isMatch
    ? 'competitive'
    : isChallengeMode && !initialIsCompleted
      ? 'daily-challenge'
      : isCompetitive
        ? 'competitive'
        : 'practice';

  const lastResultRef = useRef<GameResult | null>(null);
  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const { phase, state, result, runId, submitInput } = useGameHost({
    engine: wordMemoryEngine,
    config: { numWords: activeNumWords },
    durationMs: activeTimer * 1000,
    mode,
    seed: isMatch ? seed : undefined,
    ready: isMatch || (settingsHydrated && (!isChallengeMode || challengeData != null)),
    onTick: () => timerBeepPlayer.play(),
    onResult: (gameResult) => {
      lastResultRef.current = gameResult;
      if (isMatch) onMatchEnd?.(gameResult);
    },
    onInput,
    noTimer: isMatch,
  });

  const prevRoundRef = useRef(0);

  // Preload sound effects.
  useEffect(() => {
    checkBeepPlayer.whenReady();
    successPlayer.whenReady();
    timerBeepPlayer.whenReady();
  }, []);

  // Fire start (and retry, when following a finished round) analytics once per round.
  useEffect(() => {
    if (runId === 0) return;
    if (lastResultRef.current) {
      trackGameRetry({
        game_name: 'word-memory',
        previous_result: lastResultRef.current.won ? 'win' : 'loss',
        previous_score: lastResultRef.current.score,
      });
      lastResultRef.current = null;
    }
    const count = parseInt(sessionStorage.getItem('game_count') || '0', 10) + 1;
    sessionStorage.setItem('game_count', count.toString());
    trackGameStart({
      game_name: 'word-memory',
      is_logged_in: !!userRef.current,
      user_level: userRef.current?.level || 0,
      session_game_count: count,
    });
  }, [runId]);

  // Beep on each correct answer that advances the round.
  useEffect(() => {
    const advanced = state.round > prevRoundRef.current;
    prevRoundRef.current = state.round;
    if (advanced) checkBeepPlayer.play();
  }, [state.round]);

  // Success sound on a win.
  useEffect(() => {
    if (phase === 'won') successPlayer.play();
  }, [phase]);

  const [settingsNumWords, setSettingsNumWords] = useState(defaultNumWords);
  const [settingsDuration, setSettingsDuration] = useState(defaultDuration);

  useEffect(() => {
    setSettingsNumWords(savedNumWords);
    setSettingsDuration(savedTimer);
  }, [savedNumWords, savedTimer]);

  const settings = {
    handleSave: () => {
      setSavedNumWords(settingsNumWords);
      setSavedTimer(settingsDuration);
    },
    handleReset: () => {
      setSettingsNumWords(defaultNumWords);
      setSettingsDuration(defaultDuration);
      setSavedNumWords(defaultNumWords);
      setSavedTimer(defaultDuration);
    },
    children: (
      <div className="flex flex-col items-center">
        <NPSettingsRange
          title="Number of Words"
          min={20}
          max={100}
          value={settingsNumWords}
          setValue={setSettingsNumWords}
        />
        <NPSettingsRange
          title="Timer (seconds)"
          min={20}
          max={50}
          value={settingsDuration}
          setValue={setSettingsDuration}
        />
      </div>
    ),
  };

  if (isChallengeLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#54FFA4]"></div>
      </div>
    );
  }

  const legacyStatus =
    phase === 'won' ? 3 : phase === 'lost' ? 2 : phase === 'ended' ? (result?.won ? 3 : 2) : 1;

  return (
    <>
      {!isMatch && (
        <GameStatsTracker
          game="word-memory"
          gameStatus={legacyStatus}
          score={result ? result.score : state.round}
          elapsedMs={result?.elapsedMs ?? 0}
          wonStatus={3}
          lostStatus={2}
          gameSettings={{ numWords: activeNumWords, duration: activeTimer }}
        />
      )}
      <WordMemoryView
        state={state}
        phase={phase}
        result={result}
        runId={runId}
        durationMs={activeTimer * 1000}
        hideTimer={isMatch}
        compact={isMatch}
        onAnswer={(answer) => submitInput({ type: answer })}
        settings={isMatch || isChallengeMode ? undefined : settings}
      />
    </>
  );
};

interface WordMemorySpectatorProps {
  seed: number;
  inputs: WordMemoryInput[];
}

// Replays a 1v1 opponent's word-memory game from streamed Seen/New answers.
export const WordMemorySpectator: FC<WordMemorySpectatorProps> = ({ seed, inputs }) => {
  const config = useMemo(() => ({ numWords: defaultNumWords }), []);
  const { state, outcome } = useReplayedState(wordMemoryEngine, config, seed, inputs);

  const pulseKeys = useMemo(() => {
    const seen = inputs.filter((i) => i.type === 'seen').length;
    const fresh = inputs.filter((i) => i.type === 'new').length;
    return { seen: seen || undefined, new: fresh || undefined };
  }, [inputs]);

  const phase: GamePhase = outcome === 'won' ? 'won' : outcome === 'lost' ? 'lost' : 'playing';
  const result: GameResult | null =
    outcome === 'playing'
      ? null
      : { won: outcome === 'won', score: state.round, elapsedMs: 0 };

  return (
    <WordMemoryView
      state={state}
      phase={phase}
      result={result}
      runId={1}
      durationMs={defaultDuration * 1000}
      compact
      hideTimer
      pulseKeys={pulseKeys}
    />
  );
};

export const WordMemorySummary: FC<WordMemorySpectatorProps> = ({ seed, inputs }) => {
  const config = useMemo(() => ({ numWords: defaultNumWords }), []);
  const { state, outcome } = useReplayedState(wordMemoryEngine, config, seed, inputs);
  return (
    <OpponentSummary
      title="Word Memory"
      metricLabel="Round"
      metricValue={`${state.round} / ${state.numWords}`}
      progress={{ current: state.round, total: state.numWords }}
      outcome={outcome}
    />
  );
};

export default WordMemory;
