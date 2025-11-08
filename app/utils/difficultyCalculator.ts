/**
 * Calculate XP multiplier based on game difficulty settings
 * Returns a multiplier between 0.5x (easiest) and 2.5x (hardest)
 */

interface BaseGameSettings {
  timer?: number;
  targetScore?: number;
}

interface ThermiteSettings extends BaseGameSettings {
  rows?: number;
  columns?: number;
}

interface ChoppingSettings extends BaseGameSettings {
  numLetters?: number;
  duration?: number;
}

interface RoofRunningSettings extends BaseGameSettings {
  rows?: number;
  columns?: number;
}

interface WordMemorySettings extends BaseGameSettings {
  numWords?: number;
  duration?: number;
}

interface PinCrackerSettings extends BaseGameSettings {
  pinLength?: number;
  duration?: number;
}

interface LockpickSettings extends BaseGameSettings {
  lockDifficulty?: number;
  duration?: number;
}

interface RepairKitSettings extends BaseGameSettings {
  itemsAmount?: number;
  timer?: number;
}

interface LaundrySettings extends BaseGameSettings {
  numPhrases?: number;
  targetMatches?: number;
  duration?: number;
}

type GameSettings = 
  | ThermiteSettings 
  | ChoppingSettings 
  | RoofRunningSettings 
  | WordMemorySettings 
  | PinCrackerSettings
  | LockpickSettings
  | RepairKitSettings
  | LaundrySettings;

// Default settings for each game (normal difficulty)
// Based on the actual default values in each puzzle component
const DEFAULT_SETTINGS: Record<string, GameSettings> = {
  thermite: {
    timer: 60,  // presets[0].timer (Maze Bank - Sewer)
    targetScore: 24,  // presets[0].targetScore
    rows: 6,  // presets[0].rows (Note: rows & columns don't affect difficulty per user)
    columns: 6,  // presets[0].columns
  },
  chopping: {
    numLetters: 15,  // defaultNumLetters
    duration: 7,  // defaultDuration (in seconds)
  },
  'roof-running': {
    rows: 8,  // defaultRows
    columns: 11,  // defaultColumns
    timer: 25,  // defaultDuration (in seconds)
  },
  'word-memory': {
    numWords: 25,  // defaultWords
    duration: 25,  // defaultDuration (in seconds)
  },
  pincracker: {
    pinLength: 4,  // defaultPinLength
    duration: 20,  // defaultDuration (in seconds)
  },
  lockpick: {
    lockDifficulty: 5,  // Placeholder - lockpick doesn't have settings yet
    duration: 30,
  },
  'repair-kit': {
    itemsAmount: 3,  // Always same XP per user - doesn't have difficulty settings
    timer: 45,
  },
  laundromat: {
    numPhrases: 5,  // maxLevels from Laundromat.tsx
    targetMatches: 4,
    duration: 12,  // countdownDuration (in seconds)
  },
};

/**
 * Calculate difficulty multiplier for a game based on its settings
 * @param game - The game name (e.g., 'thermite', 'chopping')
 * @param settings - The current game settings
 * @returns XP multiplier (0.5 - 2.5)
 */
export function calculateDifficultyMultiplier(
  game: string,
  settings: GameSettings
): number {
  const defaults = DEFAULT_SETTINGS[game];
  
  if (!defaults) {
    // Unknown game, return 1x multiplier
    return 1.0;
  }

  let difficultyScore = 0;
  let factorCount = 0;

  // Helper to compare a setting (lower is harder for timer/duration, higher is harder for other settings)
  const addFactor = (
    current: number | undefined,
    defaultValue: number | undefined,
    isTimer: boolean = false
  ) => {
    if (current === undefined || defaultValue === undefined) return;
    
    const ratio = current / defaultValue;
    
    // For timers/duration: shorter = harder (ratio < 1 = harder)
    // For other settings: higher = harder (ratio > 1 = harder)
    const difficulty = isTimer ? (1 / ratio) : ratio;
    
    difficultyScore += difficulty;
    factorCount++;
  };

  // Game-specific difficulty calculations
  switch (game) {
    case 'thermite': {
      const s = settings as ThermiteSettings;
      const d = defaults as ThermiteSettings;
      addFactor(s.timer, d.timer, true);
      addFactor(s.targetScore, d.targetScore);
      // Note: rows & columns don't affect difficulty per user specification
      break;
    }
    
    case 'chopping': {
      const s = settings as ChoppingSettings;
      const d = defaults as ChoppingSettings;
      addFactor(s.numLetters, d.numLetters);
      addFactor(s.duration, d.duration, true);
      break;
    }
    
    case 'roof-running': {
      const s = settings as RoofRunningSettings;
      const d = defaults as RoofRunningSettings;
      addFactor(s.rows, d.rows);
      addFactor(s.columns, d.columns);
      addFactor(s.timer, d.timer, true);
      break;
    }
    
    case 'word-memory': {
      const s = settings as WordMemorySettings;
      const d = defaults as WordMemorySettings;
      addFactor(s.numWords, d.numWords);
      addFactor(s.duration, d.duration, true);
      break;
    }
    
    case 'pincracker': {
      const s = settings as PinCrackerSettings;
      const d = defaults as PinCrackerSettings;
      addFactor(s.pinLength, d.pinLength);
      addFactor(s.duration, d.duration, true);
      break;
    }
    
    case 'lockpick': {
      const s = settings as LockpickSettings;
      const d = defaults as LockpickSettings;
      addFactor(s.lockDifficulty, d.lockDifficulty);
      addFactor(s.duration, d.duration, true);
      break;
    }
    
    case 'repair-kit': {
      // Repair Kit always gives same XP per user specification
      // No difficulty factors to add
      break;
    }
    
    case 'laundromat': {
      const s = settings as LaundrySettings;
      const d = defaults as LaundrySettings;
      addFactor(s.numPhrases, d.numPhrases);
      addFactor(s.duration, d.duration, true);
      break;
    }
  }

  if (factorCount === 0) {
    return 1.0; // No factors to compare, use default multiplier
  }

  // Average the difficulty factors
  const avgDifficulty = difficultyScore / factorCount;
  
  // Map difficulty to XP multiplier with EXPONENTIAL scaling to discourage easy mode farming
  // We want to heavily penalize easier settings and reward harder settings
  // 
  // avgDifficulty of 1.0 = normal (1.0x multiplier)
  // avgDifficulty of 0.8 = slightly easy (0.5x multiplier) - 50% penalty
  // avgDifficulty of 0.6 = easy (0.2x multiplier) - 80% penalty
  // avgDifficulty of 0.5 = very easy (0.1x multiplier) - 90% penalty
  // avgDifficulty of 0.4 or less = extremely easy (0.05x multiplier) - 95% penalty
  // 
  // avgDifficulty of 1.2 = slightly hard (1.3x multiplier) - 30% bonus
  // avgDifficulty of 1.5 = hard (1.8x multiplier) - 80% bonus
  // avgDifficulty of 2.0 = very hard (2.5x multiplier) - 150% bonus
  // avgDifficulty of 2.5+ = extreme (3.0x multiplier) - 200% bonus
  
  let multiplier: number;
  
  if (avgDifficulty < 1.0) {
    // EXPONENTIAL penalty for easier settings
    // Use cubic function to heavily penalize easy mode
    // Formula: (difficulty)^3 for difficulty < 1.0
    multiplier = Math.pow(avgDifficulty, 3);
    
    // Ensure minimum of 0.05x (5% XP for extremely easy settings)
    multiplier = Math.max(0.05, multiplier);
  } else {
    // Progressive rewards for harder settings
    // Formula: 1.0 + (difficulty - 1.0) * 1.5 for difficulty >= 1.0
    // This gives more generous rewards for increasing difficulty
    multiplier = 1.0 + (avgDifficulty - 1.0) * 1.5;
    
    // Cap at 3.0x for extremely hard settings
    multiplier = Math.min(3.0, multiplier);
  }
  
  // Round to 2 decimal places
  return Math.round(multiplier * 100) / 100;
}

/**
 * Calculate XP earned with difficulty multiplier applied
 * @param baseXP - Base XP amount for completing the game
 * @param game - The game name
 * @param settings - The current game settings
 * @returns Final XP amount
 */
export function calculateXPWithDifficulty(
  baseXP: number,
  game: string,
  settings: GameSettings
): number {
  const multiplier = calculateDifficultyMultiplier(game, settings);
  return Math.round(baseXP * multiplier);
}
