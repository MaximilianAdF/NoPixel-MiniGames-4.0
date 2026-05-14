'use client';

import { useCallback, useEffect, useRef, useState, type FC } from 'react';
import classNames from 'classnames';
import { checkBeepPlayer, successPlayer, timerBeepPlayer } from '@/public/audio/AudioManager';
import usePersistantState from '@/app/utils/usePersistentState';
import { useKeyDown } from '@/app/utils/useKeyDown';
import { useDailyChallenge } from '@/app/utils/useDailyChallenge';
import { trackGameStart, trackGameRetry } from '@/app/utils/gtm';
import { useUser } from '@/app/contexts/UserContext';
import { NPSettingsRange } from '@/app/components/NPSettings';
import GameStatsTracker from './GameStatsTracker';
import { useGameHost } from '@/app/game/useGameHost';
import GameShell from '@/app/game/GameShell';
import type { GameMode, GameResult } from '@/app/game/types';
import { lockpickEngine, degInterval, positions } from './lockpickEngine';
import { LockpickRing } from './LockpickRing';

interface NPLockpickProps {
  countdownDuration: number;
  maxLevels: number;
  title: string;
  gameId?: string;
  isCompetitive?: boolean;
}

const ROTATE_LEFT_KEYS = ['ArrowLeft', 'a', 'A'];
const ROTATE_RIGHT_KEYS = ['ArrowRight', 'd', 'D'];
const UNLOCK_KEYS = ['Enter', ' '];

const NPLockpick: FC<NPLockpickProps> = ({
  countdownDuration,
  maxLevels,
  title,
  gameId = 'lockpick',
  isCompetitive = false,
}) => {
  const { isChallengeMode, challengeData, isLoading: isChallengeLoading } = useDailyChallenge();
  const { user } = useUser();

  const [savedLevels, setSavedLevels, levelsHydrated] = usePersistantState(
    `np-lockpick-${title}-levels`,
    maxLevels,
  );
  const [savedTimer, setSavedTimer, timerHydrated] = usePersistantState(
    `np-lockpick-${title}-timer`,
    countdownDuration,
  );
  const settingsHydrated = levelsHydrated && timerHydrated;

  const activeLevels =
    isChallengeMode && challengeData
      ? challengeData.levels || maxLevels
      : isCompetitive
        ? maxLevels
        : savedLevels;
  const activeTimer =
    isChallengeMode && challengeData
      ? challengeData.targetTime
        ? Math.floor(challengeData.targetTime / 1000)
        : countdownDuration
      : isCompetitive
        ? countdownDuration
        : savedTimer;

  const mode: GameMode = isChallengeMode
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
    engine: lockpickEngine,
    config: { levels: activeLevels },
    durationMs: activeTimer * 1000,
    mode,
    ready: settingsHydrated && (!isChallengeMode || challengeData != null),
    onTick: () => timerBeepPlayer.play(),
    onResult: (gameResult) => {
      lastResultRef.current = gameResult;
    },
  });

  const prevLevelRef = useRef(0);

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
        game_name: gameId,
        previous_result: lastResultRef.current.won ? 'win' : 'loss',
        previous_score: lastResultRef.current.score,
      });
      lastResultRef.current = null;
    }
    const count = parseInt(sessionStorage.getItem('game_count') || '0', 10) + 1;
    sessionStorage.setItem('game_count', count.toString());
    trackGameStart({
      game_name: gameId,
      is_logged_in: !!userRef.current,
      user_level: userRef.current?.level || 0,
      session_game_count: count,
    });
  }, [runId, gameId]);

  // Success sound on each cleared ring.
  useEffect(() => {
    if (state.level > prevLevelRef.current) successPlayer.play();
    prevLevelRef.current = state.level;
  }, [state.level]);

  // Success on a win; fail beep on a failed unlock (not on a timer expiry).
  useEffect(() => {
    if (phase === 'won') successPlayer.play();
    else if (phase === 'lost' && state.failedUnlock) checkBeepPlayer.play();
  }, [phase, state.failedUnlock]);

  const rotateLeft = useCallback(
    () => submitInput({ type: 'rotate', direction: -1 }),
    [submitInput],
  );
  const rotateRight = useCallback(
    () => submitInput({ type: 'rotate', direction: 1 }),
    [submitInput],
  );
  const unlock = useCallback(() => submitInput({ type: 'unlock' }), [submitInput]);

  useKeyDown(rotateLeft, ROTATE_LEFT_KEYS, true);
  useKeyDown(rotateRight, ROTATE_RIGHT_KEYS, true);
  useKeyDown(unlock, UNLOCK_KEYS, true);

  const [settingsLevels, setSettingsLevels] = useState(savedLevels);
  const [settingsTimer, setSettingsTimer] = useState(savedTimer);

  useEffect(() => {
    setSettingsLevels(savedLevels);
    setSettingsTimer(savedTimer);
  }, [savedLevels, savedTimer]);

  const settings = {
    handleSave: () => {
      setSavedLevels(settingsLevels);
      setSavedTimer(settingsTimer);
    },
    handleReset: () => {
      setSettingsLevels(maxLevels);
      setSettingsTimer(countdownDuration);
      setSavedLevels(maxLevels);
      setSavedTimer(countdownDuration);
    },
    children: (
      <>
        <div className="flex w-full gap-2 *:flex-1 flex-col sm:flex-row">
          <NPSettingsRange
            title="Levels"
            value={settingsLevels}
            setValue={setSettingsLevels}
            min={2}
            max={10}
          />
          <NPSettingsRange
            title="Timer"
            value={settingsTimer}
            setValue={setSettingsTimer}
            min={5}
            max={100}
          />
        </div>
      </>
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

  const svgSize = 50 * (state.rings.length * 2 + 1);

  return (
    <>
      <GameStatsTracker
        game={gameId as any}
        gameStatus={legacyStatus}
        score={result ? result.score : state.level}
        elapsedMs={result?.elapsedMs ?? 0}
        targetScore={activeLevels}
        wonStatus={3}
        lostStatus={2}
        gameSettings={{ levels: activeLevels, timer: activeTimer }}
      />
      <GameShell
        title={title}
        description="Unlock each lock"
        phase={phase}
        result={result}
        durationMs={activeTimer * 1000}
        runId={runId}
        statusMessage={
          result
            ? result.won
              ? 'The lock was picked successfully.'
              : 'The lockpick bent out of shape.'
            : ''
        }
        buttons={[
          [
            {
              label: 'Rotate Left',
              color: 'purple',
              callback: rotateLeft,
              disabled: phase !== 'playing',
            },
            {
              label: 'Rotate Right',
              color: 'purple',
              callback: rotateRight,
              disabled: phase !== 'playing',
            },
          ],
          [{ label: 'Unlock', color: 'green', callback: unlock, disabled: phase !== 'playing' }],
        ]}
        settings={isChallengeMode ? undefined : settings}
      >
        <div
          className={classNames(
            'w-full max-w-full min-w-[calc(100vw-60px)] sm:min-w-[550px] md:min-w-[600px] rounded-lg bg-[rgba(0,28,49,0.3)] flex items-center justify-center',
            phase === 'idle' && 'blur',
          )}
        >
          <div
            className="aspect-square flex items-center justify-center relative"
            style={{ width: '100%', maxWidth: `calc(100vh - 298px)` }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              className="
                size-full aspect-square
                *:origin-center
                data-[stroke=gray]:*:stroke-[rgb(173_173_173)]
                data-[stroke=fail]:*:stroke-[rgb(255_84_84)]
                data-[stroke=win]:*:stroke-[rgb(48_221_189/0.816)]
                *:*:origin-center
                data-[stroke=blue]:*:*:stroke-[rgb(46_134_213)]
                data-[stroke=yellow]:*:*:stroke-[rgb(239_181_17)]
                data-[stroke=red]:*:*:stroke-[rgb(202_39_97)]
                data-[stroke=fail]:*:*:stroke-[rgb(255_84_84)]
                data-[stroke=win]:*:*:stroke-[rgb(48_221_189/0.816)]
                data-[fill=blue]:*:*:fill-[rgb(46_134_213)]
                data-[fill=yellow]:*:*:fill-[rgb(239_181_17)]
                data-[fill=red]:*:*:fill-[rgb(202_39_97)]
                data-[fill=fail]:*:*:fill-[rgb(255_84_84)]
                data-[fill=win]:*:*:fill-[rgb(48_221_189/0.816)]
              "
              viewBox={`0 0 ${svgSize} ${svgSize}`}
            >
              <g className="*:stroke-[1.2px] *:origin-center *:stroke-[rgb(142_142_142)]">
                {[...Array(positions / 2)].map((_, index) => (
                  <line
                    key={index}
                    x1={35}
                    x2={svgSize - 35}
                    y1={svgSize / 2}
                    y2={svgSize / 2}
                    transform={`rotate(${index * degInterval})`}
                  />
                ))}
              </g>
              {state.rings.map((ring, ringIndex) => (
                <LockpickRing
                  key={ringIndex}
                  ring={ring}
                  ringIndex={ringIndex}
                  level={state.level}
                  status={legacyStatus}
                />
              ))}
            </svg>
          </div>
        </div>
      </GameShell>
    </>
  );
};

export default NPLockpick;
