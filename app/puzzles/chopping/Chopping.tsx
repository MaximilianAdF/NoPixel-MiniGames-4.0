'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type FC, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { successPlayer, checkBeepPlayer, timerBeepPlayer } from '@/public/audio/AudioManager';
import usePersistantState from '@/app/utils/usePersistentState';
import { useKeyDown } from '@/app/utils/useKeyDown';
import { useDailyChallenge } from '@/app/utils/useDailyChallenge';
import { useMobileGameViewport } from '@/app/utils/useMobileGameViewport';
import { trackGameStart, trackGameRetry } from '@/app/utils/gtm';
import { useUser } from '@/app/contexts/UserContext';
import { NPSettingsRange } from '@/app/components/NPSettings';
import GameStatsTracker from '@/app/components/GameStatsTracker';
import { useGameHost } from '@/app/game/useGameHost';
import GameShell from '@/app/game/GameShell';
import type { GameMode, GamePhase, GameResult } from '@/app/game/types';
import { seededRandom } from '@/lib/lobby/seededRandom';
import { useReplayedState } from '@/app/utils/useReplayedState';
import { choppingEngine, type ChoppingState } from './engine';
import { GridRow, defaultGridCols } from './ChoppingGrid';
import '../../../public/Chopping/Chopping.css';

const ALLOWED_KEYS = ['Q', 'q', 'W', 'w', 'E', 'e', 'R', 'r', 'A', 'a', 'S', 's', 'D', 'd'];
const defaultNumLetters = 15;
const defaultDuration = 7;

interface ChoppingViewProps {
  state: ChoppingState;
  phase: GamePhase;
  result: GameResult | null;
  runId: number;
  durationMs: number;
  hideTimer?: boolean;
  // Splitscreen layouts (1v1) drop the touch-friendly min-width so two boards
  // can sit side by side without overflowing.
  compact?: boolean;
  // Interactive-only: refs/handlers that wire the grid wrapper into mobile keyboard
  // activation. Spectator views omit these.
  wrapperRef?: React.Ref<HTMLDivElement>;
  onInteraction?: () => void;
  // Interactive-only: hidden mobile input rendered inside the GameShell.
  mobileInput?: ReactNode;
  settings?: React.ComponentProps<typeof GameShell>['settings'];
}

// Presentational shell + grid. Driven by external state so both the interactive
// host (useGameHost) and the 1v1 spectator (useReplayedState) can render it.
const ChoppingView: FC<ChoppingViewProps> = ({
  state,
  phase,
  result,
  runId,
  durationMs,
  hideTimer,
  compact,
  wrapperRef,
  onInteraction,
  mobileInput,
  settings,
}) => (
  <GameShell
    title="Alphabet"
    description="Tap the letters in order"
    phase={phase}
    result={result}
    durationMs={durationMs}
    runId={runId}
    statusMessage={result ? (result.won ? 'Success!' : 'Failed!') : ''}
    hideTimer={hideTimer}
    settings={settings}
  >
    {mobileInput}
    <div
      ref={wrapperRef}
      className={`${compact ? '' : 'min-w-[calc(100vw-60px)] sm:min-w-[550px] md:min-w-[600px] '}w-full max-w-full flex-1 min-h-0 rounded-lg bg-[rgba(0,28,49,0.3)] flex items-center justify-center text-white p-1 sm:p-4 mx-auto`}
      onTouchStartCapture={onInteraction}
      onPointerDownCapture={onInteraction}
      style={{ scrollMarginTop: '15vh', overflow: 'visible' }}
    >
      <div className="game-grid" style={{ height: '100%', width: '100%' }}>
        {Array.from({ length: Math.ceil(state.board.length / defaultGridCols) }).map(
          (_, rowIndex) => (
            <GridRow
              key={rowIndex}
              rowIndex={rowIndex}
              board={state.board}
              stateBoard={state.stateBoard}
              activeIndex={state.activeIndex}
              numLetters={state.board.length}
              gridCols={defaultGridCols}
            />
          ),
        )}
      </div>
    </div>
  </GameShell>
);

interface ChoppingProps {
  // 1v1 match mode: defaults override saved prefs, engine seeds from this value, no auto-restart.
  seed?: number;
  // Fires when the match ends (win or loss) so the lobby can move on to the outcome view.
  onMatchEnd?: (result: GameResult) => void;
  // Fires for every accepted key. The lobby streams these to the opponent so their
  // spectator view can replay this game in real time.
  onInput?: (input: string) => void;
}

const Chopping: FC<ChoppingProps> = ({ seed, onMatchEnd, onInput }) => {
  const isMatch = seed !== undefined;
  const { isChallengeMode, challengeData, isLoading: isChallengeLoading, isCompleted } = useDailyChallenge();
  const searchParams = useSearchParams();
  const isCompetitive = searchParams?.get('competitive') === 'true';
  const { user } = useUser();

  const rng = useMemo(
    () => (isMatch ? seededRandom(seed!) : undefined),
    [isMatch, seed],
  );

  const [savedTimer, setSavedTimer, timerHydrated] = usePersistantState(
    'chopping-timer',
    defaultDuration,
  );
  const [savedNumLetters, setSavedNumLetters, lettersHydrated] = usePersistantState(
    'chopping-num-letters',
    defaultNumLetters,
  );
  const settingsHydrated = timerHydrated && lettersHydrated;

  const activeNumLetters = isMatch
    ? defaultNumLetters
    : isChallengeMode && challengeData
      ? challengeData.numLetters || defaultNumLetters
      : isCompetitive
        ? defaultNumLetters
        : savedNumLetters;
  const activeTimer = isMatch
    ? defaultDuration
    : isChallengeMode && challengeData
      ? challengeData.targetTime
        ? Math.floor(challengeData.targetTime / 1000)
        : defaultDuration
      : isCompetitive
        ? defaultDuration
        : savedTimer;

  const mode: GameMode = isMatch
    ? 'competitive'
    : isChallengeMode && !isCompleted
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
    engine: choppingEngine,
    config: { numLetters: activeNumLetters },
    durationMs: activeTimer * 1000,
    mode,
    rng,
    ready: isMatch || (settingsHydrated && (!isChallengeMode || challengeData != null)),
    onTick: () => timerBeepPlayer.play(),
    onResult: (gameResult) => {
      lastResultRef.current = gameResult;
      if (isMatch) onMatchEnd?.(gameResult);
    },
    onInput,
    noTimer: isMatch,
  });

  const outerContainerRef = useRef<HTMLDivElement>(null);
  const gameWrapperRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const skipNextInputRef = useRef(false);
  const prevActiveIndexRef = useRef(0);

  const mobile = useMobileGameViewport({
    isPlaying: phase === 'playing',
    outerRef: outerContainerRef,
    wrapperRef: gameWrapperRef,
    inputRef: mobileInputRef,
  });

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
        game_name: 'chopping',
        previous_result: lastResultRef.current.won ? 'win' : 'loss',
        previous_score: lastResultRef.current.score,
      });
      lastResultRef.current = null;
    }
    const count = parseInt(sessionStorage.getItem('game_count') || '0', 10) + 1;
    sessionStorage.setItem('game_count', count.toString());
    trackGameStart({
      game_name: 'chopping',
      is_logged_in: !!userRef.current,
      user_level: userRef.current?.level || 0,
      session_game_count: count,
    });
  }, [runId]);

  // Key-press beep when a letter is completed correctly (desktop only).
  useEffect(() => {
    const advanced = state.activeIndex > prevActiveIndexRef.current;
    prevActiveIndexRef.current = state.activeIndex;
    if (advanced && !mobile.isMobile) checkBeepPlayer.play();
  }, [state.activeIndex, mobile.isMobile]);

  // Success sound on a win (desktop only).
  useEffect(() => {
    if (phase === 'won' && !mobile.isMobile) successPlayer.play();
  }, [phase, mobile.isMobile]);

  const handleKey = useCallback(
    (key?: string) => {
      if (key && document.activeElement?.tagName !== 'INPUT') {
        submitInput(key);
      }
    },
    [submitInput],
  );
  useKeyDown(handleKey, ALLOWED_KEYS, true);

  const handleMobileKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (phase !== 'playing') return;
    const { key } = e;
    if (key.length === 1) {
      skipNextInputRef.current = true;
      e.preventDefault();
      mobile.dismissHint();
      submitInput(key.toUpperCase());
      if (mobileInputRef.current) mobileInputRef.current.value = '';
      return;
    }
    if (key === 'Backspace') {
      skipNextInputRef.current = true;
      e.preventDefault();
      if (mobileInputRef.current) mobileInputRef.current.value = '';
    }
  };

  const handleMobileInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    if (skipNextInputRef.current) {
      skipNextInputRef.current = false;
      input.value = '';
      return;
    }
    const key = input.value.slice(-1);
    if (key && phase === 'playing') {
      mobile.dismissHint();
      submitInput(key.toUpperCase());
      input.value = '';
      mobile.focusInput();
    }
  };

  const [settingsNumLetters, setSettingsNumLetters] = useState(defaultNumLetters);
  const [settingsDuration, setSettingsDuration] = useState(defaultDuration);

  useEffect(() => {
    setSettingsNumLetters(savedNumLetters);
    setSettingsDuration(savedTimer);
  }, [savedNumLetters, savedTimer]);

  const settings = {
    handleSave: () => {
      setSavedNumLetters(settingsNumLetters);
      setSavedTimer(settingsDuration);
    },
    handleReset: () => {
      setSettingsNumLetters(defaultNumLetters);
      setSettingsDuration(defaultDuration);
      setSavedNumLetters(defaultNumLetters);
      setSavedTimer(defaultDuration);
    },
    children: (
      <div className="flex flex-col items-center">
        <NPSettingsRange
          title="Number of letters"
          min={13}
          max={18}
          value={settingsNumLetters}
          setValue={setSettingsNumLetters}
        />
        <NPSettingsRange
          title="Timer"
          min={5}
          max={30}
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
          game="chopping"
          gameStatus={legacyStatus}
          score={result ? result.score : state.activeIndex}
          elapsedMs={result?.elapsedMs ?? 0}
          targetScore={activeNumLetters}
          wonStatus={3}
          lostStatus={2}
          gameSettings={{ letters: activeNumLetters, timer: activeTimer }}
        />
      )}
      <div ref={outerContainerRef} className="flex flex-col gap-4">
        {mobile.isMobile && mobile.showHint && (
          <div className="rounded-xl border border-spring-green-500/40 bg-mirage-900/70 px-4 py-3 text-center text-xs font-medium text-spring-green-100 shadow-lg shadow-mirage-950/40">
            Tap the puzzle, then type the letters to play.
          </div>
        )}
        <ChoppingView
          state={state}
          phase={phase}
          result={result}
          runId={runId}
          durationMs={activeTimer * 1000}
          compact={isMatch}
          hideTimer={isMatch}
          wrapperRef={gameWrapperRef}
          onInteraction={mobile.handleInteraction}
          settings={isMatch || isChallengeMode ? undefined : settings}
          mobileInput={
            mobile.isMobile && phase === 'playing' ? (
              <input
                ref={mobileInputRef}
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="characters"
                className="opacity-0"
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '1px',
                  height: '1px',
                  background: 'transparent',
                }}
                onInput={handleMobileInput}
                onKeyDown={handleMobileKeyDown}
                onFocus={() => mobile.focusInput()}
                onBlur={(e) => {
                  if (phase === 'playing') {
                    e.preventDefault();
                    e.target.focus();
                  }
                }}
                aria-label="Type letters here"
              />
            ) : null
          }
        />
      </div>
    </>
  );
};

interface ChoppingSpectatorProps {
  seed: number;
  inputs: string[];
}

// Replays a 1v1 opponent's chopping game from streamed inputs. No interaction,
// no timer — purely a live mirror of what the opponent sees.
export const ChoppingSpectator: FC<ChoppingSpectatorProps> = ({ seed, inputs }) => {
  const config = useMemo(() => ({ numLetters: defaultNumLetters }), []);
  const { state, outcome } = useReplayedState(choppingEngine, config, seed, inputs);

  const phase: GamePhase = outcome === 'won' ? 'won' : outcome === 'lost' ? 'lost' : 'playing';
  const result: GameResult | null =
    outcome === 'playing'
      ? null
      : { won: outcome === 'won', score: state.activeIndex, elapsedMs: 0 };

  return (
    <ChoppingView
      state={state}
      phase={phase}
      result={result}
      runId={1}
      durationMs={defaultDuration * 1000}
      compact
      hideTimer
    />
  );
};

export default Chopping;
