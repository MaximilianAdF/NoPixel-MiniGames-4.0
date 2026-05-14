'use client';

import { useCallback, useEffect, useRef, useState, type FC } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import classNames from 'classnames';
import { timerBeepPlayer } from '@/public/audio/AudioManager';
import usePersistantState from '@/app/utils/usePersistentState';
import { useDailyChallenge } from '@/app/utils/useDailyChallenge';
import { trackGameStart, trackGameRetry } from '@/app/utils/gtm';
import { useUser } from '@/app/contexts/UserContext';
import { NPSettingsRange } from '@/app/components/NPSettings';
import NPButton from '@/app/components/NPButton';
import GameStatsTracker from '@/app/components/GameStatsTracker';
import { useGameHost } from '@/app/game/useGameHost';
import GameShell from '@/app/game/GameShell';
import type { GameMode, GameResult } from '@/app/game/types';
import { presets } from './utils';
import { thermiteEngine } from './engine';
import { ThermiteSquare } from './ThermiteGrid';
import backgroundImg from '@/public/images/thermite/background.svg';
import './style.css';

const Thermite: FC = () => {
  const { isChallengeMode, challengeData, isLoading: isChallengeLoading } = useDailyChallenge();
  const searchParams = useSearchParams();
  const isCompetitive = searchParams?.get('competitive') === 'true';
  const { user } = useUser();

  const [savedPreset, setSavedPreset, presetHydrated] = usePersistantState('np-thermite-preset', 0);
  const [savedTimer, setSavedTimer, timerHydrated] = usePersistantState(
    'np-thermite-timer',
    presets[0].timer,
  );
  const [savedTargetScore, setSavedTargetScore, targetScoreHydrated] = usePersistantState(
    'np-thermite-targetScore',
    presets[0].targetScore,
  );
  const [savedRows, setSavedRows, rowsHydrated] = usePersistantState(
    'np-thermite-rows',
    presets[0].rows,
  );
  const [savedColumns, setSavedColumns, columnsHydrated] = usePersistantState(
    'np-thermite-columns',
    presets[0].columns,
  );
  const settingsHydrated =
    presetHydrated && timerHydrated && targetScoreHydrated && rowsHydrated && columnsHydrated;

  const activeTargetScore =
    isChallengeMode && challengeData
      ? challengeData.targetScore || presets[0].targetScore
      : isCompetitive
        ? presets[0].targetScore
        : savedTargetScore;
  const activeTimer =
    isChallengeMode && challengeData
      ? challengeData.targetTime
        ? Math.floor(challengeData.targetTime / 1000)
        : presets[0].timer
      : isCompetitive
        ? presets[0].timer
        : savedTimer;
  const activeRows =
    isChallengeMode && challengeData
      ? challengeData.rows || presets[0].rows
      : isCompetitive
        ? presets[0].rows
        : savedRows;
  const activeColumns =
    isChallengeMode && challengeData
      ? challengeData.columns || presets[0].columns
      : isCompetitive
        ? presets[0].columns
        : savedColumns;

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
    engine: thermiteEngine,
    config: { rows: activeRows, columns: activeColumns, targetScore: activeTargetScore },
    durationMs: activeTimer * 1000,
    mode,
    ready: settingsHydrated && (!isChallengeMode || challengeData != null),
    onTick: () => timerBeepPlayer.play(),
    onResult: (gameResult) => {
      lastResultRef.current = gameResult;
    },
  });

  const prevTotalCombosRef = useRef(0);
  const [showComboNotice, setShowComboNotice] = useState(false);

  // Preload sound effects.
  useEffect(() => {
    timerBeepPlayer.whenReady();
  }, []);

  // Fire start (and retry, when following a finished round) analytics once per round.
  useEffect(() => {
    if (runId === 0) return;
    if (lastResultRef.current) {
      trackGameRetry({
        game_name: 'thermite',
        previous_result: lastResultRef.current.won ? 'win' : 'loss',
        previous_score: lastResultRef.current.score,
      });
      lastResultRef.current = null;
    }
    const count = parseInt(sessionStorage.getItem('game_count') || '0', 10) + 1;
    sessionStorage.setItem('game_count', count.toString());
    trackGameStart({
      game_name: 'thermite',
      is_logged_in: !!userRef.current,
      user_level: userRef.current?.level || 0,
      session_game_count: count,
    });
  }, [runId]);

  // Show the combo notice whenever the engine registers a new combo.
  useEffect(() => {
    if (state.totalCombos > prevTotalCombosRef.current) setShowComboNotice(true);
    prevTotalCombosRef.current = state.totalCombos;
  }, [state.totalCombos]);

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      submitInput({ type: 'click', coord: [row, col], timestamp: Date.now() });
    },
    [submitInput],
  );

  const [settingsPreset, setSettingsPreset] = useState(savedPreset);
  const [settingsTimer, setSettingsTimer] = useState(savedTimer);
  const [settingsTargetScore, setSettingsTargetScore] = useState(savedTargetScore);
  const [settingsRows, setSettingsRows] = useState(savedRows);
  const [settingsColumns, setSettingsColumns] = useState(savedColumns);

  useEffect(() => {
    setSettingsPreset(savedPreset);
    setSettingsTimer(savedTimer);
    setSettingsTargetScore(savedTargetScore);
    setSettingsRows(savedRows);
    setSettingsColumns(savedColumns);
  }, [savedPreset, savedTimer, savedTargetScore, savedRows, savedColumns]);

  const applyPreset = (index: number) => {
    setSettingsPreset(index);
    setSettingsTimer(presets[index].timer);
    setSettingsTargetScore(presets[index].targetScore);
    setSettingsRows(presets[index].rows);
    setSettingsColumns(presets[index].columns);
  };

  const settings = {
    handleSave: () => {
      setSavedPreset(settingsPreset);
      setSavedTimer(settingsTimer);
      setSavedTargetScore(settingsTargetScore);
      setSavedRows(settingsRows);
      setSavedColumns(settingsColumns);
    },
    handleReset: () => {
      const preset = presets[savedPreset];
      setSettingsPreset(savedPreset);
      setSettingsTimer(preset.timer);
      setSettingsTargetScore(preset.targetScore);
      setSettingsRows(preset.rows);
      setSettingsColumns(preset.columns);
      setSavedTimer(preset.timer);
      setSavedTargetScore(preset.targetScore);
      setSavedRows(preset.rows);
      setSavedColumns(preset.columns);
    },
    children: (
      <>
        <div className="w-full flex items-center gap-2 *:flex-1">
          <NPSettingsRange
            title="Target score"
            value={settingsTargetScore}
            setValue={setSettingsTargetScore}
            min={10}
            max={75}
          />
          <NPSettingsRange
            title="Timer"
            value={settingsTimer}
            setValue={setSettingsTimer}
            min={10}
            max={180}
          />
        </div>
        <div className="w-full flex items-center gap-2 *:flex-1">
          <NPSettingsRange
            title="Rows"
            value={settingsRows}
            setValue={setSettingsRows}
            min={5}
            max={9}
          />
          <NPSettingsRange
            title="Columns"
            value={settingsColumns}
            setValue={setSettingsColumns}
            min={5}
            max={9}
          />
        </div>
        <div>
          <p className="w-full px-8 text-[rgb(94_93_93)] text-xl">Presets</p>
          <div className="w-full flex items-center gap-2 px-8 *:flex-1">
            {presets.map((preset, index) => (
              <NPButton
                key={preset.label}
                label={preset.label}
                color="green"
                disabled={settingsPreset === index}
                onClick={() => applyPreset(index)}
              >
                {preset.label}
              </NPButton>
            ))}
          </div>
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

  return (
    <>
      <GameStatsTracker
        game="thermite"
        gameStatus={legacyStatus}
        score={result ? result.score : state.score}
        elapsedMs={result?.elapsedMs ?? 0}
        targetScore={activeTargetScore}
        wonStatus={3}
        lostStatus={2}
        gameSettings={{
          timer: activeTimer,
          targetScore: activeTargetScore,
          rows: activeRows,
          columns: activeColumns,
        }}
      />
      <GameShell
        title="Mazer"
        description="Decrypt the required number of bytes"
        phase={phase}
        result={result}
        durationMs={activeTimer * 1000}
        runId={runId}
        statusMessage={result ? (result.won ? 'Success!' : 'Failed!') : ''}
        score={result ? result.score : state.score}
        targetScore={state.targetScore}
        settings={isChallengeMode ? undefined : settings}
      >
        <div
          className={classNames(
            'thermite min-w-[calc(100vw-60px)] sm:min-w-[550px] md:min-w-[600px]',
            phase === 'idle' && 'blur',
          )}
          style={{
            maxWidth: `calc(calc(calc(calc(calc(100vh - 236px) - ${4 * (state.rows - 1)}px) / ${state.rows}) * ${state.columns}) + ${2 * (state.columns - 1)}px)`,
            width: '100%',
            gridTemplateRows: `repeat(${state.rows}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${state.columns}, minmax(0, 1fr))`,
          }}
        >
          {state.board.map((boardRow, rowIndex) =>
            boardRow.map((square, columnIndex) => (
              <ThermiteSquare
                key={`${rowIndex}_${columnIndex}`}
                square={square}
                row={rowIndex}
                col={columnIndex}
                outOfMoves={state.outOfMoves}
                animateHighlight={phase === 'playing'}
                onSquareClick={handleSquareClick}
              />
            )),
          )}
          <div className="notice">
            <span
              style={{ animationName: showComboNotice ? 'notice' : 'none' }}
              onAnimationEnd={() => setShowComboNotice(false)}
            >
              CRC Bypassed!
            </span>
          </div>
          <Image src={backgroundImg} alt="" fill />
        </div>
      </GameShell>
    </>
  );
};

export default Thermite;
