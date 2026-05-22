import type { GameType } from '@/interfaces/user';

// Host announces a new match. Both clients init the same engine with seededRandom(seed),
// so the games are bit-identical. MVP uses each game's default config; per-match custom
// settings can ride along here later.
export interface MatchStartMessage {
  type: 'match:start';
  game: GameType;
  seed: number;
  startedAt: number;
  // Wall-clock moment in the host's Date.now() frame at which both clients
  // should unblock the game. Both sides compare against their own Date.now()
  // — same wall-clock fire if clocks are NTP-synced (the typical case).
  goAt: number;
  // Focus mode: hide the opponent's mirrored board, render only a compact
  // progress summary on the opponent's half of the splitscreen.
  focusMode: boolean;
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

// Match max-duration was hit. Fired by whichever client's local timer trips
// first; the receiver sets matchExpired locally too so both converge on a
// draw outcome without UI flicker.
export interface MatchTimeoutMessage {
  type: 'match:timeout';
}

// Canonical outcome — the host is the arbiter, derives the winner once it
// has all the info (both results / forfeit / timeout) and broadcasts so
// both ends render the same result without per-client derivation flicker.
// winnerClientId === null is a draw.
export interface MatchOutcomeMessage {
  type: 'match:outcome';
  winnerClientId: string | null;
  reason: 'finished' | 'timeout';
}

// Quick reaction sent in lobby / during / after a match. Renders as a brief
// floating bubble near the sender's avatar on every other client.
export interface EmoteMessage {
  type: 'emote';
  emote: string;
  fromClientId: string;
}

// Non-host hints to the host which game they want to play. The host's
// "Start a match" grid highlights the suggested game.
export interface SuggestGameMessage {
  type: 'suggest';
  game: GameType;
  fromClientId: string;
}

export type LobbyMessage =
  | MatchStartMessage
  | MatchResultMessage
  | MatchInputMessage
  | MatchTimeoutMessage
  | MatchOutcomeMessage
  | EmoteMessage
  | SuggestGameMessage;
