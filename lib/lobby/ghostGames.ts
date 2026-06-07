import type { GameType } from '@/interfaces/user';

// Client-safe ghost config — no DB imports, so it can be used from client
// components (the lobby picker, the match client) without pulling server-only
// Node modules into the bundle.
//
// Games whose replay is verified deterministic for ghost racing. Launch is
// Chopping-only (fast/continuous → best ghost feel, determinism-checked via
// scripts/ghost-replay-harness.ts). Add a game here only after its harness
// case passes. Gates both harvesting and racing so an unverified game can
// never produce or surface a raceable ghost.
export const GHOST_ENABLED_GAMES: GameType[] = ['chopping'];

export function isGhostEnabled(game: GameType): boolean {
  return GHOST_ENABLED_GAMES.includes(game);
}
