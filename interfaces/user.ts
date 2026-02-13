// User Interface - MongoDB Schema
export interface User {
  _id: string;
  discordId?: string;
  guestDeviceId?: string;
  username: string;
  discriminator: string;
  avatar: string;
  email?: string;
  
  // Profile
  displayName?: string;
  bio?: string;
  joinedAt: Date;
  lastSeenAt: Date;
  
  // Stats (aggregated)
  totalGamesPlayed: number;
  totalTimePlayedMs: number;
  totalXP: number;
  level: number;
  currentDailyStreak: number;
  longestDailyStreak: number;
  lastDailyChallengeDate?: string; // YYYY-MM-DD
  
  // Preferences
  preferences: {
    volume: number;
    notifications: boolean;
    publicProfile: boolean;
    theme: 'dark' | 'light';
    keyboardShortcuts?: Array<{
      action: string;
      key: string;
      label: string;
      description: string;
    }>;
  };
  
  // Achievements & Badges
  achievements: string[]; // Achievement IDs
  badges: string[]; // Badge IDs
  
  // Meta
  createdAt: Date;
  updatedAt: Date;
}

// Game Stats per User per Game
export interface GameStats {
  _id: string;
  userId: string;
  game: GameType;
  
  // Performance
  gamesPlayed: number;
  bestScore: number;
  averageScore: number;
  totalTimePlayedMs: number;
  
  // Progress
  firstPlayedAt: Date;
  lastPlayedAt: Date;
  currentStreak: number; // Days in a row
  longestStreak: number;
  
  // Recent games (last 10)
  recentScores: number[];
  recentDates: Date[];
  
  // Trends
  improvementRate: number; // Percentage
  consistencyScore: number; // 0-100
  
  // Meta
  updatedAt: Date;
}

// Game Types
export type GameType = 
  | 'thermite'
  | 'lockpick'
  | 'pincracker'
  | 'laundromat'
  | 'roof-running'
  | 'repair-kit'
  | 'word-memory'
  | 'chopping';

// Daily Challenge
export interface DailyChallenge {
  _id: string;
  date: string; // YYYY-MM-DD
  game: GameType;
  
  // Challenge parameters
  preset: 'easy' | 'medium' | 'hard' | 'extreme';
  targetScore: number;
  targetTime?: number; // milliseconds
  specialCondition?: string;
  
  // Rewards
  xpReward: number;
  badgeReward?: string;
  
  // Metadata
  createdAt: Date;
}

// User Challenge Progress
export interface UserChallengeProgress {
  _id: string;
  userId: string;
  challengeId: string;
  date: string; // YYYY-MM-DD
  
  completed: boolean;
  completedAt?: Date;
  
  attempts: number;
  bestAttempt: {
    score: number;
    time: number;
    mistakes: number;
  };
  
  xpEarned: number;
  badgeEarned?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// Achievement Definition
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'performance' | 'consistency' | 'volume' | 'special' | 'challenge';
  
  // Unlock conditions
  condition: {
    type: string; // 'score', 'streak', 'games_played', etc.
    game?: GameType;
    threshold: number;
  };
  
  xpReward: number;
}

// User Session
export interface UserSession {
  user: {
    id: string;
    discordId?: string;
    username: string;
    discriminator: string;
    avatar: string;
    displayName?: string;
    level: number;
    xp: number;
    currentDailyStreak: number;
    preferences?: {
      volume: number;
      notifications: boolean;
      publicProfile: boolean;
      theme: 'dark' | 'light';
      keyboardShortcuts?: Array<{
        action: string;
        key: string;
        label: string;
        description: string;
      }>;
    };
  };
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// Discord OAuth Response
export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email?: string;
  verified?: boolean;
  locale?: string;
  mfa_enabled?: boolean;
}

// Discord Token Response
export interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}
