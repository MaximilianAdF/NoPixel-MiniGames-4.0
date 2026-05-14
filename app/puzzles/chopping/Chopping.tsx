'use client';

import { useCallback, useEffect, useRef, useState, type FC } from 'react';
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
import type { GameMode, GameResult } from '@/app/game/types';
import { choppingEngine } from './engine';
import { GridRow, defaultGridCols } from './ChoppingGrid';
import '../../../public/Chopping/Chopping.css';

const ALLOWED_KEYS = ['Q', 'q', 'W', 'w', 'E', 'e', 'R', 'r', 'A', 'a', 'S', 's', 'D', 'd'];
const defaultNumLetters = 15;
const defaultDuration = 7;

const Chopping: FC = () => {
  const { isChallengeMode, challengeData, isLoading: isChallengeLoading, isCompleted } = useDailyChallenge();
  const searchParams = useSearchParams();
  const isCompetitive = searchParams?.get('competitive') === 'true';
  const { user } = useUser();

  const [savedTimer, setSavedTimer, timerHydrated] = usePersistantState(
    'chopping-timer',
    defaultDuration,
  );
  const [savedNumLetters, setSavedNumLetters, lettersHydrated] = usePersistantState(
    'chopping-num-letters',
    defaultNumLetters,
  );
  const settingsHydrated = timerHydrated && lettersHydrated;

  const activeNumLetters =
    isChallengeMode && challengeData
      ? challengeData.numLetters || defaultNumLetters
      : isCompetitive
        ? defaultNumLetters
        : savedNumLetters;
  const activeTimer =
    isChallengeMode && challengeData
      ? challengeData.targetTime
        ? Math.floor(challengeData.targetTime / 1000)
        : defaultDuration
      : isCompetitive
        ? defaultDuration
        : savedTimer;

  const mode: GameMode = isChallengeMode && !isCompleted
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
    ready: settingsHydrated && (!isChallengeMode || challengeData != null),
    onTick: () => timerBeepPlayer.play(),
    onResult: (gameResult) => {
      lastResultRef.current = gameResult;
    },
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
      <div ref={outerContainerRef} className="flex flex-col gap-4">
        {mobile.isMobile && mobile.showHint && (
          <div className="rounded-xl border border-spring-green-500/40 bg-mirage-900/70 px-4 py-3 text-center text-xs font-medium text-spring-green-100 shadow-lg shadow-mirage-950/40">
            Tap the puzzle, then type the letters to play.
          </div>
        )}
        <GameShell
          title="Alphabet"
          description="Tap the letters in order"
          phase={phase}
          result={result}
          durationMs={activeTimer * 1000}
          runId={runId}
          statusMessage={result ? (result.won ? 'Success!' : 'Failed!') : ''}
          settings={isChallengeMode ? undefined : settings}
        >
          {mobile.isMobile && phase === 'playing' && (
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
          )}
          <div
            ref={gameWrapperRef}
            className="min-w-[calc(100vw-60px)] sm:min-w-[550px] md:min-w-[600px] w-full max-w-full flex-1 min-h-0 rounded-lg bg-[rgba(0,28,49,0.3)] flex items-center justify-center text-white p-1 sm:p-4 mx-auto"
            onTouchStartCapture={mobile.handleInteraction}
            onPointerDownCapture={mobile.handleInteraction}
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
      </div>
    </>
  );
};

export default Chopping;
