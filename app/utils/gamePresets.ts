/**
 * Standard game presets for leaderboard eligibility
 * Only games played with these exact settings will be eligible for leaderboards
 */

export interface GamePreset {
  timer?: number;
  targetScore?: number;
  rows?: number;
  columns?: number;
  levels?: number;
  words?: number;
  letters?: number;
  pinLength?: number;
}

export const STANDARD_PRESETS: Record<string, GamePreset> = {
  thermite: {
    timer: 60,
    targetScore: 24,
    rows: 6,
    columns: 6,
  },
  'roof-running': {
    timer: 25,
    columns: 11,
    rows: 8,
  },
  laundromat: {
    timer: 12,
    levels: 5,
  },
  lockpick: {
    timer: 20,
    levels: 4,
  },
  'word-memory': {
    timer: 25,
    words: 25, // Words are adjustable, but timer must be standard
  },
  chopping: {
    timer: 7,
    letters: 15,
  },
  pincracker: {
    timer: 24,
    pinLength: 4,
  },
};

/**
 * Check if game settings match standard preset for leaderboard eligibility
 * For word-memory: only timer needs to match (words can be adjusted)
 */
export function isStandardPreset(game: string, settings: Record<string, any>): boolean {
  const preset = STANDARD_PRESETS[game];
  if (!preset) {
    return false;
  }

  // Special case for word-memory: only timer must match, words can vary
  if (game === 'word-memory') {
    // Timer must match exactly (convert to seconds if needed)
    const timerSeconds = settings.timer || settings.duration || 0;
    return timerSeconds === preset.timer;
  }

  // For all other games, all preset values must match exactly
  for (const [key, value] of Object.entries(preset)) {
    // Convert timer/duration to consistent format
    const settingKey = key === 'timer' ? (settings.timer !== undefined ? 'timer' : 'duration') : key;
    
    if (settings[settingKey] !== value) {
      return false;
    }
  }

  return true;
}

/**
 * Get display-friendly preset description for a game
 */
export function getPresetDescription(game: string): string {
  const preset = STANDARD_PRESETS[game];
  if (!preset) return '';

  const parts: string[] = [];

  if (preset.rows && preset.columns) {
    parts.push(`${preset.rows}×${preset.columns} grid`);
  }
  if (preset.levels) {
    parts.push(`${preset.levels} levels`);
  }
  if (preset.words) {
    parts.push(`${preset.words}+ words`);
  }
  if (preset.letters) {
    parts.push(`${preset.letters} letters`);
  }
  if (preset.pinLength) {
    parts.push(`${preset.pinLength}-digit PIN`);
  }
  if (preset.targetScore) {
    parts.push(`${preset.targetScore} score`);
  }
  if (preset.timer) {
    parts.push(`${preset.timer}s timer`);
  }

  return parts.join(' · ');
}

/**
 * Games that use time-based leaderboards (fastest wins)
 */
export const TIME_BASED_GAMES = [
  'thermite',
  'roof-running',
  'laundromat',
  'lockpick',
  'pincracker',
  'chopping',
];

/**
 * Games that use score-based leaderboards (highest wins)
 */
export const SCORE_BASED_GAMES = [
  'word-memory',
];
