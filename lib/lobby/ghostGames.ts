import type { GameType } from '@/interfaces/user';

// Client-safe ghost config — no DB imports, so it can be used from client
// components (the lobby picker, the match client) without pulling server-only
// Node modules into the bundle.
//
// Games whose replay is verified deterministic for ghost racing. All seven
// 1v1 games are enabled: each engine is bit-reproducible from (seed, inputs)
// — confirmed by scripts/determinism-spike.ts (7/7 deterministic) — and each
// game's match-mode config matches the config its Spectator rebuilds for
// replay, so a recorded run reproduces faithfully. repair-kit is excluded
// from 1v1 entirely (real-time mechanic), so it isn't here.
// Gates both harvesting and racing; never add a game without verifying both
// determinism AND match/spectator config parity.
export const GHOST_ENABLED_GAMES: GameType[] = [
  'chopping',
  'thermite',
  'lockpick',
  'laundromat',
  'pincracker',
  'roof-running',
  'word-memory',
];

export function isGhostEnabled(game: GameType): boolean {
  return GHOST_ENABLED_GAMES.includes(game);
}
