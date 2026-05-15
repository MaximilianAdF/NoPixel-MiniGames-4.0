import type { GameType } from '@/interfaces/user';

// Host announces a new match. Both clients init the same engine with seededRandom(seed),
// so the games are bit-identical. MVP uses each game's default config; per-match custom
// settings can ride along here later.
export interface MatchStartMessage {
  type: 'match:start';
  game: GameType;
  seed: number;
  startedAt: number;
}

// A player reports their match outcome — the opponent uses this to render
// "they finished, you have X seconds" or "they won/lost".
export interface MatchResultMessage {
  type: 'match:result';
  won: boolean;
  score: number;
  elapsedMs: number;
}

// A streamed input event. The opponent replays these through the engine to
// render a live spectator view of the player's game.
export interface MatchInputMessage {
  type: 'match:input';
  input: unknown;
}

export type LobbyMessage = MatchStartMessage | MatchResultMessage | MatchInputMessage;
