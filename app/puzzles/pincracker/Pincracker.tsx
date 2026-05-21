'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type FC, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { checkBeepPlayer, successPlayer, timerBeepPlayer } from '@/public/audio/AudioManager';
import usePersistantState from '@/app/utils/usePersistentState';
import { useKeyDown } from '@/app/utils/useKeyDown';
import { useDailyChallenge } from '@/app/utils/useDailyChallenge';
import { useMobileGameViewport } from '@/app/utils/useMobileGameViewport';
import { trackGameStart, trackGameRetry } from '@/app/utils/gtm';
import { useUser } from '@/app/contexts/UserContext';
import { NPSettingsRange } from '@/app/components/NPSettings';
import NPButton from '@/app/components/NPButton';
import GameStatsTracker from '@/app/components/GameStatsTracker';
import { useGameHost } from '@/app/game/useGameHost';
import GameShell from '@/app/game/GameShell';
import type { GameMode, GamePhase, GameResult } from '@/app/game/types';
import { useReplayedState } from '@/app/utils/useReplayedState';
import type { Digit } from './utils';
import { pincrackerEngine, type PincrackerInput, type PincrackerState } from './engine';
import { PinColumn } from './PincrackerGrid';

const ALLOWED_KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Enter'];
const REVEAL_STEP_MS = 250;
const defaultDuration = 20;
const defaultPinLength = 4;

interface PincrackerViewProps {
  state: PincrackerState;
  phase: GamePhase;
  result: GameResult | null;
  runId: number;
  durationMs: number;
  hideTimer?: boolean;
  compact?: boolean;
  // Interactive-only. When omitted, no Crack button is rendered and the grid
  // is non-interactive.
  onCrack?: () => void;
  // Interactive-only: optional hidden mobile input rendered inside the GameShell.
  mobileInput?: ReactNode;
  wrapperRef?: React.Ref<HTMLDivElement>;
  onInteraction?: () => void;
  // Optional hooks for the staggered reveal animation. onRevealStep fires per
  // step (interactive uses it for the beep); onRevealComplete fires after the
  // walk completes (interactive uses it to submit the 'finish' input).
  onRevealStep?: () => void;
  onRevealComplete?: () => void;
  settings?: React.ComponentProps<typeof GameShell>['settings'];
}

// Presentational shell + grid. Owns the staggered pin-reveal animation so
// both the interactive host and the spectator see the same walking reveal
// when state.revealing flips true.
const PincrackerView: FC<PincrackerViewProps> = ({
  state,
  phase,
  result,
  runId,
  durationMs,
  hideTimer,
  compact,
  onCrack,
  mobileInput,
  wrapperRef,
  onInteraction,
  onRevealStep,
  onRevealComplete,
  settings,
}) => {
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    if (!state.revealing) {
      setRevealedCount(0);
      return;
    }
    const total = state.pin.length;
    let count = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    let finishTimer: ReturnType<typeof setTimeout> | undefined;
    const step = () => {
      count += 1;
      setRevealedCount(count);
      onRevealStep?.();
      if (count >= total) {
        if (interval) clearInterval(interval);
        finishTimer = setTimeout(() => onRevealComplete?.(), REVEAL_STEP_MS);
      }
    };
    step();
    interval = setInterval(step, REVEAL_STEP_MS);
    return () => {
      if (interval) clearInterval(interval);
      if (finishTimer) clearTimeout(finishTimer);
    };
  }, [state.revealing, state.pin.length, onRevealStep, onRevealComplete]);

  const buttons = onCrack
    ? [
        [
          {
            label: 'Crack',
            color: 'green' as const,
            callback: onCrack,
            disabled: phase !== 'playing',
          },
        ],
      ]
    : [];

  return (
    <GameShell
      title="PinCracker"
      description="Decode digits of the pin code"
      phase={phase}
      result={result}
      durationMs={durationMs}
      runId={runId}
      statusMessage={result ? (result.won ? 'Success!' : 'Failed!') : ''}
      buttons={buttons}
      hideTimer={hideTimer}
      settings={settings}
    >
      {mobileInput}
      <div
        ref={wrapperRef}
        className={`h-56 sm:h-60 md:h-64 ${
          compact ? '' : 'min-w-[calc(100vw-60px)] sm:min-w-[550px] md:min-w-[600px] '
        }w-full max-w-full rounded-lg bg-[rgba(0,28,49,0.3)] flex items-center justify-between text-white text-6xl sm:text-7xl md:text-8xl px-3 sm:px-5 md:px-6 mx-auto ${
          !onCrack ? 'pointer-events-none' : ''
        }`}
        onTouchStartCapture={onInteraction}
        onPointerDownCapture={onInteraction}
        style={{ scrollMarginTop: '15vh' }}
      >
        {state.guess.map((digit, index) => (
          <PinColumn
            key={index}
            digit={digit}
            feedback={state.feedback ? state.feedback[index] : null}
            isRevealed={state.feedback != null && (!state.revealing || index < revealedCount)}
            isFlashing={state.revealing && index === revealedCount - 1}
          />
        ))}
      </div>
    </GameShell>
  );
};

interface PincrackerProps {
  // 1v1 match mode: defaults override saved prefs, engine seeds from this value, no auto-restart.
  seed?: number;
  // Fires when the match ends so the lobby can move on to the outcome view.
  onMatchEnd?: (result: GameResult) => void;
  // Streams each input to the lobby for the opponent's spectator replay.
  onInput?: (input: PincrackerInput) => void;
}

const Pincracker: FC<PincrackerProps> = ({ seed, onMatchEnd, onInput }) => {
  const isMatch = seed !== undefined;
  const { isChallengeMode, challengeData, isLoading: isChallengeLoading, isCompleted } = useDailyChallenge();
  const searchParams = useSearchParams();
  const isCompetitive = searchParams?.get('competitive') === 'true';
  const { user } = useUser();

  const [savedTimer, setSavedTimer, timerHydrated] = usePersistantState(
    'pincracker-timer',
    defaultDuration,
  );
  const [savedPinLength, setSavedPinLength, pinLengthHydrated] = usePersistantState(
    'pincracker-pin-length',
    defaultPinLength,
  );
  const settingsHydrated = timerHydrated && pinLengthHydrated;

  const activePinLength = isMatch
    ? defaultPinLength
    : isChallengeMode && challengeData
      ? challengeData.pinLength || defaultPinLength
      : isCompetitive
        ? 4
        : savedPinLength;
  const activeTimer = isMatch
    ? defaultDuration
    : isChallengeMode && challengeData
      ? challengeData.targetTime
        ? Math.floor(challengeData.targetTime / 1000)
        : defaultDuration
      : isCompetitive
        ? 24
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
    engine: pincrackerEngine,
    config: { pinLength: activePinLength },
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

  const outerContainerRef = useRef<HTMLDivElement>(null);
  const gameWrapperRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const mobile = useMobileGameViewport({
    isPlaying: phase === 'playing',
    outerRef: outerContainerRef,
    wrapperRef: gameWrapperRef,
    inputRef: mobileInputRef,
  });

  const [autoClear, setAutoClear] = useState(true);
  const autoClearRef = useRef(autoClear);
  useEffect(() => {
    autoClearRef.current = autoClear;
  }, [autoClear]);

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
        game_name: 'pincracker',
        previous_result: lastResultRef.current.won ? 'win' : 'loss',
        previous_score: lastResultRef.current.score,
      });
      lastResultRef.current = null;
    }
    const count = parseInt(sessionStorage.getItem('game_count') || '0', 10) + 1;
    sessionStorage.setItem('game_count', count.toString());
    trackGameStart({
      game_name: 'pincracker',
      is_logged_in: !!userRef.current,
      user_level: userRef.current?.level || 0,
      session_game_count: count,
    });
  }, [runId]);

  // Success sound on a win.
  useEffect(() => {
    if (phase === 'won') successPlayer.play();
  }, [phase]);

  const handleRevealComplete = useCallback(
    () => submitInput({ type: 'finish', autoClear: autoClearRef.current }),
    [submitInput],
  );
  const handleRevealStep = useCallback(() => checkBeepPlayer.play(), []);

  const submitKey = useCallback(
    (key: string) => {
      if (key === 'Enter') {
        submitInput({ type: 'crack' });
      } else if (key === 'Backspace') {
        submitInput({ type: 'backspace' });
      } else {
        submitInput({ type: 'digit', value: key as Digit });
      }
      mobile.focusInput();
    },
    [submitInput, mobile.focusInput],
  );

  const handleKey = useCallback(
    (key?: string) => {
      if (key && document.activeElement?.tagName !== 'INPUT') submitKey(key);
    },
    [submitKey],
  );
  useKeyDown(handleKey, ALLOWED_KEYS, true);

  const handleMobileInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const key = input.value.slice(-1);
    if (!key || phase !== 'playing') {
      if (!key) input.value = '';
      return;
    }
    mobile.dismissHint();
    submitKey(key);
    input.value = '';
  };

  const handleMobileKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (phase !== 'playing') return;
    if (e.key === 'Backspace') {
      mobile.dismissHint();
      submitKey('Backspace');
    } else if (e.key === 'Enter') {
      mobile.dismissHint();
      submitKey('Enter');
    }
  };

  const [settingsPinLength, setSettingsPinLength] = useState(defaultPinLength);
  const [settingsDuration, setSettingsDuration] = useState(defaultDuration);

  useEffect(() => {
    setSettingsPinLength(savedPinLength);
    setSettingsDuration(savedTimer);
  }, [savedPinLength, savedTimer]);

  const settings = {
    handleSave: () => {
      setSavedPinLength(settingsPinLength);
      setSavedTimer(settingsDuration);
    },
    handleReset: () => {
      setSettingsPinLength(defaultPinLength);
      setSettingsDuration(defaultDuration);
      setSavedPinLength(defaultPinLength);
      setSavedTimer(defaultDuration);
    },
    children: (
      <div className="flex flex-col items-center">
        <NPSettingsRange
          title="Pin Length"
          min={2}
          max={6}
          value={settingsPinLength}
          setValue={setSettingsPinLength}
        />
        <NPSettingsRange
          title="Timer"
          min={5}
          max={30}
          value={settingsDuration}
          setValue={setSettingsDuration}
        />
        <div className="py-4 flex items-center flex-col">
          <NPButton
            label="Auto Clear"
            color={autoClear ? 'green' : 'red'}
            onClick={() => setAutoClear(!autoClear)}
          >
            Auto Clear
          </NPButton>
          <p className="text-xs sm:text-base text-[rgb(142_142_142)]">
            Automatic removal of digits after each guess
          </p>
        </div>
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
          game="pincracker"
          gameStatus={legacyStatus}
          score={result ? result.score : state.activeIndex}
          elapsedMs={result?.elapsedMs ?? 0}
          targetScore={activePinLength}
          wonStatus={3}
          lostStatus={2}
          gameSettings={{ pinLength: activePinLength, duration: activeTimer }}
        />
      )}
      <div ref={outerContainerRef} className="flex flex-col gap-4">
        {mobile.isMobile && mobile.showHint && (
          <div className="rounded-xl border border-spring-green-500/40 bg-mirage-900/70 px-4 py-3 text-center text-xs font-medium text-spring-green-100 shadow-lg shadow-mirage-950/40">
            Tap the puzzle, then start typing to enter the code.
          </div>
        )}
        <PincrackerView
          state={state}
          phase={phase}
          result={result}
          runId={runId}
          durationMs={activeTimer * 1000}
          hideTimer={isMatch}
          compact={isMatch}
          onCrack={() => submitKey('Enter')}
          onRevealStep={handleRevealStep}
          onRevealComplete={handleRevealComplete}
          wrapperRef={gameWrapperRef}
          onInteraction={mobile.handleInteraction}
          settings={isMatch || isChallengeMode ? undefined : settings}
          mobileInput={
            mobile.isMobile && phase === 'playing' ? (
              <input
                ref={mobileInputRef}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
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
                aria-label="Enter PIN digits"
              />
            ) : null
          }
        />
      </div>
    </>
  );
};

interface PincrackerSpectatorProps {
  seed: number;
  inputs: PincrackerInput[];
}

// Replays a 1v1 opponent's pincracker game from streamed digit/crack/finish
// inputs. The View handles the reveal animation locally — no host callbacks
// are needed since the 'finish' input also arrives via replay.
export const PincrackerSpectator: FC<PincrackerSpectatorProps> = ({ seed, inputs }) => {
  const config = useMemo(() => ({ pinLength: defaultPinLength }), []);
  const { state, outcome } = useReplayedState(pincrackerEngine, config, seed, inputs);

  const phase: GamePhase = outcome === 'won' ? 'won' : outcome === 'lost' ? 'lost' : 'playing';
  const result: GameResult | null =
    outcome === 'playing'
      ? null
      : { won: outcome === 'won', score: state.activeIndex, elapsedMs: 0 };

  return (
    <PincrackerView
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

export default Pincracker;
