'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameEngine, GameMode, GamePhase, GameResult } from './types';

const AUTO_RESTART_MS = 3000;

interface UseGameHostArgs<State, Config, Input> {
  engine: GameEngine<State, Config, Input>;
  config: Config;
  durationMs: number;
  mode: GameMode;
  ready?: boolean;
  rng?: () => number;
  onTick?: () => void;
  onResult?: (result: GameResult) => void;
  // Fires for every accepted input. 1v1 streams these to the opponent so they
  // can replay the same engine in their spectator view.
  onInput?: (input: Input) => void;
}

export interface GameHost<State, Input> {
  phase: GamePhase;
  state: State;
  result: GameResult | null;
  runId: number;
  submitInput: (input: Input) => void;
  restart: () => void;
}

// Owns one minigame's lifecycle: the phase machine, countdown, and mode-based restart policy.
export function useGameHost<State, Config, Input>({
  engine,
  config,
  durationMs,
  mode,
  ready = true,
  rng = Math.random,
  onTick,
  onResult,
  onInput,
}: UseGameHostArgs<State, Config, Input>): GameHost<State, Input> {
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [state, setState] = useState<State>(() => engine.init(config, rng));
  const [result, setResult] = useState<GameResult | null>(null);
  const [runId, setRunId] = useState(0);

  const stateRef = useRef(state);
  const phaseRef = useRef(phase);
  const startTimeRef = useRef(0);
  const configRef = useRef(config);
  const rngRef = useRef(rng);
  const onTickRef = useRef(onTick);
  const onResultRef = useRef(onResult);
  const onInputRef = useRef(onInput);

  // Mirror latest props into refs so the callbacks below stay referentially stable.
  useEffect(() => {
    phaseRef.current = phase;
    configRef.current = config;
    rngRef.current = rng;
    onTickRef.current = onTick;
    onResultRef.current = onResult;
    onInputRef.current = onInput;
  });

  const endGame = useCallback(
    (won: boolean) => {
      if (phaseRef.current !== 'playing') return;
      const gameResult: GameResult = {
        won,
        score: engine.getScore(stateRef.current, won ? 'won' : 'lost'),
        elapsedMs: Date.now() - startTimeRef.current,
      };
      setResult(gameResult);
      setPhase(won ? 'won' : 'lost');
      onResultRef.current?.(gameResult);
    },
    [engine],
  );

  const start = useCallback(() => {
    const initial = engine.init(configRef.current, rngRef.current);
    stateRef.current = initial;
    setState(initial);
    setResult(null);
    setPhase('playing');
    setRunId((id) => id + 1);
  }, [engine]);

  const submitInput = useCallback(
    (input: Input) => {
      if (phaseRef.current !== 'playing') return;
      onInputRef.current?.(input);
      const { state: next, outcome } = engine.applyInput(stateRef.current, input);
      stateRef.current = next;
      setState(next);
      if (outcome === 'won') endGame(true);
      else if (outcome === 'lost') endGame(false);
    },
    [engine, endGame],
  );

  // Start, and restart whenever the game becomes ready or its config changes.
  const configKey = JSON.stringify(config);
  useEffect(() => {
    if (ready) start();
  }, [ready, configKey, durationMs, start]);

  // Countdown: per-second tick and expiry, scoped to a single playing run.
  useEffect(() => {
    if (phase !== 'playing') return;
    startTimeRef.current = Date.now();
    const expiry = setTimeout(() => endGame(false), durationMs);
    const tick = setInterval(() => onTickRef.current?.(), 1000);
    return () => {
      clearTimeout(expiry);
      clearInterval(tick);
    };
  }, [runId, phase, durationMs, endGame]);

  // After a result: practice and failed daily challenges loop; won challenges and competitive runs end terminally.
  useEffect(() => {
    if (phase !== 'won' && phase !== 'lost') return;
    const timer = setTimeout(() => {
      const retry = mode === 'practice' || (mode === 'daily-challenge' && phase === 'lost');
      if (retry) start();
      else setPhase('ended');
    }, AUTO_RESTART_MS);
    return () => clearTimeout(timer);
  }, [mode, phase, start]);

  return { phase, state, result, runId, submitInput, restart: start };
}
