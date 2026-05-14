import type { GameType } from '@/interfaces/user';

export const GAME_TYPES: readonly GameType[] = [
  'thermite',
  'lockpick',
  'pincracker',
  'laundromat',
  'roof-running',
  'repair-kit',
  'word-memory',
  'chopping',
];

export function isGameType(value: unknown): value is GameType {
  return typeof value === 'string' && (GAME_TYPES as readonly string[]).includes(value);
}

// Finite, non-negative, and under an absolute ceiling — rejects NaN/Infinity, negatives, and aggregate-poisoning values.
export function isSaneNumber(value: unknown, max = 10_000_000): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= max;
}

// Field ranges keyed by the names each puzzle sends to /api/stats/record-game (the in-game settings UI min/max).
const SETTINGS_BOUNDS: Partial<Record<GameType, Record<string, [number, number]>>> = {
  thermite: { timer: [10, 180], targetScore: [10, 75], rows: [5, 9], columns: [5, 9] },
  chopping: { letters: [13, 18], timer: [5, 30] },
  pincracker: { pinLength: [2, 6], duration: [5, 30] },
  'roof-running': { rows: [5, 10], columns: [5, 15], timer: [5, 100] },
  'word-memory': { numWords: [20, 100], duration: [20, 50] },
  lockpick: { levels: [2, 10], timer: [5, 100] },
  laundromat: { levels: [2, 10], timer: [5, 100] },
};

// Rejects a gameSettings payload whose known fields fall outside the UI's allowed ranges; unknown/absent keys pass.
export function validateGameSettings(
  game: GameType,
  settings: Record<string, unknown> | undefined,
): { ok: true } | { ok: false; error: string } {
  if (!settings) return { ok: true };
  const bounds = SETTINGS_BOUNDS[game];
  if (!bounds) return { ok: true };
  for (const field of Object.keys(bounds)) {
    const value = settings[field];
    if (value === undefined) continue;
    const [min, max] = bounds[field];
    if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
      return { ok: false, error: `Invalid ${game} setting: ${field}` };
    }
  }
  return { ok: true };
}
