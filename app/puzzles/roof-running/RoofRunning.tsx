'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type FC } from 'react';
import { useSearchParams } from 'next/navigation';
import classNames from 'classnames';
import { timerBeepPlayer } from '@/public/audio/AudioManager';
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
import { roofRunningEngine, type RoofRunningInput, type RoofRunningState } from './engine';
import { RoofTile } from './RoofRunningGrid';

const defaultRows = 8;
const defaultColumns = 11;
const defaultDuration = 25;

interface RoofRunningViewProps {
  state: RoofRunningState;
  phase: GamePhase;
  result: GameResult | null;
  runId: number;
  durationMs: number;
  hideTimer?: boolean;
  compact?: boolean;
  // Interactive-only. When omitted, the board renders non-interactively.
  onTileClick?: (index: number) => void;
  settings?: React.ComponentProps<typeof GameShell>['settings'];
}

const noop = () => {};

// Presentational shell + grid. Driven by external state so the interactive
// host (useGameHost) and the spectator (useReplayedState) can both render it.
const RoofRunningView: FC<RoofRunningViewProps> = ({
  state,
  phase,
  result,
  runId,
  durationMs,
  hideTimer,
  compact,
  onTileClick,
  settings,
}) => (
  <GameShell
    title="Same Game"
    description="Click on matching groups of blocks"
    phase={phase}
    result={result}
    durationMs={durationMs}
    runId={runId}
    statusMessage={result ? (result.won ? 'Success!' : 'Failed!') : ''}
    hideTimer={hideTimer}
    settings={settings}
  >
    <div
      className={classNames(
        `
          grid
          gap-x-0.5 gap-y-1
          mx-auto
          *:aspect-square
          data-[color=red]:*:bg-gradient-to-b
          data-[color=red]:*:from-[#f30308]
          data-[color=red]:*:to-[#92393b]
          data-[color=red]:*:[box-shadow:0px_5px_0px_#5c2829]
          data-[color=green]:*:bg-gradient-to-b
          data-[color=green]:*:from-[#8ab357]
          data-[color=green]:*:to-[#668a3d]
          data-[color=green]:*:[box-shadow:0px_5px_0px_#48612f]
          data-[color=blue]:*:bg-gradient-to-b
          data-[color=blue]:*:from-[#5490b2]
          data-[color=blue]:*:to-[#3a7494]
          data-[color=blue]:*:[box-shadow:0px_5px_0px_#345066]
          *:overflow-hidden
          *:*:size-full
          *:*:opacity-50
          *:*:overflow-visible
          *:data-[color=empty]:*:hidden
        `,
        !compact && 'min-w-[calc(100vw-60px)] sm:min-w-[550px] md:min-w-[600px]',
        phase === 'idle' && 'blur',
        !onTileClick && 'pointer-events-none',
      )}
      style={{
        maxWidth: `calc(calc(calc(calc(calc(100vh - 208px) - ${4 * (state.rows - 1)}px) / ${state.rows}) * ${state.columns}) + ${2 * (state.columns - 1)}px)`,
        width: '100%',
        gridTemplateRows: `repeat(${state.rows}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${state.columns}, minmax(0, 1fr))`,
      }}
    >
      {state.board.map((color, index) => (
        <RoofTile key={index} index={index} color={color} onTileClick={onTileClick ?? noop} />
      ))}
    </div>
  </GameShell>
);

interface RoofRunningProps {
  // 1v1 match mode: defaults override saved prefs, engine seeds from this value, no auto-restart.
  seed?: number;
  // Fires when the match ends so the lobby can move on to the outcome view.
  onMatchEnd?: (result: GameResult) => void;
  // Streams each click to the lobby for the opponent's spectator replay.
  onInput?: (input: RoofRunningInput) => void;
}

const RoofRunning: FC<RoofRunningProps> = ({ seed, onMatchEnd, onInput }) => {
  const isMatch = seed !== undefined;
  const { isChallengeMode, challengeData, isLoading: isChallengeLoading, isCompleted } = useDailyChallenge();
  const searchParams = useSearchParams();
  const isCompetitive = searchParams?.get('competitive') === 'true';
  const { user } = useUser();

  const [savedRows, setSavedRows, rowsHydrated] = usePersistantState(
    'np-roofrunning-rows',
    defaultRows,
  );
  const [savedColumns, setSavedColumns, columnsHydrated] = usePersistantState(
    'np-roofrunning-columns',
    defaultColumns,
  );
  const [savedTimer, setSavedTimer, timerHydrated] = usePersistantState(
    'np-roofrunning-timer',
    defaultDuration,
  );
  const settingsHydrated = rowsHydrated && columnsHydrated && timerHydrated;

  const activeRows = isMatch
    ? defaultRows
    : isChallengeMode && challengeData
      ? challengeData.rows || defaultRows
      : isCompetitive
        ? defaultRows
        : savedRows;
  const activeColumns = isMatch
    ? defaultColumns
    : isChallengeMode && challengeData
      ? challengeData.columns || defaultColumns
      : isCompetitive
        ? defaultColumns
        : savedColumns;
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
    engine: roofRunningEngine,
    config: { rows: activeRows, columns: activeColumns },
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

  // Preload sound effects.
  useEffect(() => {
    timerBeepPlayer.whenReady();
  }, []);

  // Fire start (and retry, when following a finished round) analytics once per round.
  useEffect(() => {
    if (runId === 0) return;
    if (lastResultRef.current) {
      trackGameRetry({
        game_name: 'roof-running',
        previous_result: lastResultRef.current.won ? 'win' : 'loss',
        previous_score: lastResultRef.current.score,
      });
      lastResultRef.current = null;
    }
    const count = parseInt(sessionStorage.getItem('game_count') || '0', 10) + 1;
    sessionStorage.setItem('game_count', count.toString());
    trackGameStart({
      game_name: 'roof-running',
      is_logged_in: !!userRef.current,
      user_level: userRef.current?.level || 0,
      session_game_count: count,
    });
  }, [runId]);

  const handleTileClick = useCallback(
    (index: number) => submitInput({ type: 'click', index }),
    [submitInput],
  );

  const [settingsRows, setSettingsRows] = useState(defaultRows);
  const [settingsColumns, setSettingsColumns] = useState(defaultColumns);
  const [settingsTimer, setSettingsTimer] = useState(defaultDuration);

  useEffect(() => {
    setSettingsRows(savedRows);
    setSettingsColumns(savedColumns);
    setSettingsTimer(savedTimer);
  }, [savedRows, savedColumns, savedTimer]);

  const settings = {
    handleSave: () => {
      setSavedRows(settingsRows);
      setSavedColumns(settingsColumns);
      setSavedTimer(settingsTimer);
    },
    handleReset: () => {
      setSettingsRows(defaultRows);
      setSettingsColumns(defaultColumns);
      setSettingsTimer(defaultDuration);
      setSavedRows(defaultRows);
      setSavedColumns(defaultColumns);
      setSavedTimer(defaultDuration);
    },
    children: (
      <div className="flex flex-col items-center">
        <div className="flex w-full gap-2 *:flex-1 flex-row">
          <NPSettingsRange
            title="Rows"
            value={settingsRows}
            setValue={setSettingsRows}
            min={5}
            max={10}
          />
          <NPSettingsRange
            title="Columns"
            value={settingsColumns}
            setValue={setSettingsColumns}
            min={5}
            max={15}
          />
        </div>
        <div className="flex items-center justify-center aspect-[15/10] w-[50%] mt-6 h-auto">
          <div
            className="
              [outline:2px_solid_rgb(94_93_93)]
              bg-radient-circle-c
              from-[rgb(22_40_52/0.651)] to-[rgb(22_40_52)]
              *:whitespace-nowrap
              *:absolute
              *:text-base
              *:text-[rgb(84_255_164)]
              *:[text-shadow:0_0_2.1px_rgb(127_255_191)]
            "
            style={{
              height: `${(100 / 10) * settingsRows}%`,
              width: `${(100 / 15) * settingsColumns}%`,
            }}
          >
            <div className="left-1/2 -translate-y-full -translate-x-1/2">Columns</div>
            <div className="[writing-mode:vertical-lr] top-1/2 -translate-x-full -rotate-180">
              Rows
            </div>
          </div>
        </div>
        <div className="flex w-full gap-2 *:flex-1 flex-col sm:flex-row">
          <NPSettingsRange
            title="Timer"
            value={settingsTimer}
            setValue={setSettingsTimer}
            min={5}
            max={100}
          />
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
          game="roof-running"
          gameStatus={legacyStatus}
          score={result ? result.score : state.board.filter((v) => v === 'empty').length}
          elapsedMs={result?.elapsedMs ?? 0}
          targetScore={activeRows * activeColumns}
          wonStatus={3}
          lostStatus={2}
          gameSettings={{ rows: activeRows, columns: activeColumns, timer: activeTimer }}
        />
      )}
      <RoofRunningView
        state={state}
        phase={phase}
        result={result}
        runId={runId}
        durationMs={activeTimer * 1000}
        hideTimer={isMatch}
        compact={isMatch}
        onTileClick={handleTileClick}
        settings={isMatch || isChallengeMode ? undefined : settings}
      />
    </>
  );
};

interface RoofRunningSpectatorProps {
  seed: number;
  inputs: RoofRunningInput[];
}

// Replays a 1v1 opponent's roof-running game from streamed tile clicks.
export const RoofRunningSpectator: FC<RoofRunningSpectatorProps> = ({ seed, inputs }) => {
  const config = useMemo(() => ({ rows: defaultRows, columns: defaultColumns }), []);
  const { state, outcome } = useReplayedState(roofRunningEngine, config, seed, inputs);

  const phase: GamePhase = outcome === 'won' ? 'won' : outcome === 'lost' ? 'lost' : 'playing';
  const result: GameResult | null =
    outcome === 'playing'
      ? null
      : {
          won: outcome === 'won',
          score: state.board.filter((v) => v === 'empty').length,
          elapsedMs: 0,
        };

  return (
    <RoofRunningView
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

export const RoofRunningSummary: FC<RoofRunningSpectatorProps> = ({ seed, inputs }) => {
  const config = useMemo(() => ({ rows: defaultRows, columns: defaultColumns }), []);
  const { state, outcome } = useReplayedState(roofRunningEngine, config, seed, inputs);
  const cleared = state.board.filter((v) => v === 'empty').length;
  const total = state.board.length;
  return (
    <OpponentSummary
      title="Same Game"
      metricLabel="Cleared"
      metricValue={`${cleared} / ${total}`}
      progress={{ current: cleared, total }}
      outcome={outcome}
    />
  );
};

export default RoofRunning;
