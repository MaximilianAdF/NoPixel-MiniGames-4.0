export type GameOutcome = 'playing' | 'won' | 'lost';

// Host-side lifecycle; 'won'/'lost' are transient results, 'ended' is the terminal stopped state.
export type GamePhase = 'idle' | 'playing' | 'won' | 'lost' | 'ended';

export type GameMode = 'practice' | 'daily-challenge' | 'competitive';

export interface GameResult {
  won: boolean;
  score: number;
  elapsedMs: number;
}

// A pure, framework-agnostic minigame: state transitions only, no timers, audio or React.
export interface GameEngine<State, Config, Input> {
  init(config: Config, rng: () => number): State;
  applyInput(state: State, input: Input): { state: State; outcome: GameOutcome };
  getScore(state: State, outcome: GameOutcome): number;
}
