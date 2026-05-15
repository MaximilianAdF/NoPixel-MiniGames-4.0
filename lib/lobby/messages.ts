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

export type LobbyMessage = MatchStartMessage | MatchResultMessage;
