/** The existing daily challenge reward schedule. */
export function calculateChallengeXP(challenge: Record<string, any>): number {
  // Calculate XP with difficulty multiplier
  // Base XP values by game
  const baseXPMap: Record<string, number> = {
    'thermite': 1000,
    'roof-running': 800,
    'laundromat': 700,
    'lockpick': 400,
    'word-memory': 600,
    'pincracker': 500,
    'chopping': 400,
  };

  const baseXP = baseXPMap[challenge.game] || challenge.xpReward || 100;

  // Calculate difficulty multiplier based on challenge settings vs defaults
  let difficultyMultiplier = 1.0;

  switch (challenge.game) {
    case 'thermite': {
      // Default: 24 score, 50s
      const scoreFactor = (challenge.targetScore || 24) / 24;
      const timeFactor = 50 / (challenge.targetTime / 1000);
      difficultyMultiplier = (scoreFactor + timeFactor) / 2;
      break;
    }
    case 'roof-running': {
      // Default: 8x11 = 88 tiles, 27s
      const tileFactor = ((challenge.rows || 8) * (challenge.columns || 11)) / 88;
      const timeFactor = 27 / (challenge.targetTime / 1000);
      difficultyMultiplier = (tileFactor + timeFactor) / 2;
      break;
    }
    case 'laundromat': {
      // Default: 5 levels, 60s
      const levelFactor = (challenge.levels || 5) / 5;
      const timeFactor = 60 / (challenge.targetTime / 1000);
      difficultyMultiplier = (levelFactor + timeFactor) / 2;
      break;
    }
    case 'lockpick': {
      // Default: 4 levels, 80s
      const levelFactor = (challenge.levels || 4) / 4;
      const timeFactor = 80 / (challenge.targetTime / 1000);
      difficultyMultiplier = (levelFactor + timeFactor) / 2;
      break;
    }
    case 'word-memory': {
      // Default: 25 words, 25s
      const wordFactor = (challenge.words || 25) / 25;
      const timeFactor = 25 / (challenge.targetTime / 1000);
      difficultyMultiplier = (wordFactor + timeFactor) / 2;
      break;
    }
    case 'pincracker': {
      // Default: 4 digits, 20s
      const pinFactor = (challenge.pinLength || 4) / 4;
      const timeFactor = 20 / (challenge.targetTime / 1000);
      difficultyMultiplier = (pinFactor + timeFactor) / 2;
      break;
    }
    case 'chopping': {
      // Default: 15 letters, 7s
      const letterFactor = (challenge.numLetters || 15) / 15;
      const timeFactor = 7 / (challenge.targetTime / 1000);
      difficultyMultiplier = (letterFactor + timeFactor) / 2;
      break;
    }
  }

  // Apply multiplier and round up to nearest 100, with minimum of base XP
  const rawXP = baseXP * difficultyMultiplier;
  const xpEarned = Math.max(baseXP, Math.ceil(rawXP / 100) * 100);

  return xpEarned;
}
