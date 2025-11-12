'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';
import Link from 'next/link';
import Image from 'next/image';
import ErrorBoundary from '../components/ErrorBoundary';
import { getGameName, getGameTailwindGradient, getGameIcon } from '../utils/gameIcons';
import { TIME_BASED_GAMES, SCORE_BASED_GAMES } from '../utils/gamePresets';
import { ArrowLeft } from 'lucide-react';
import { 
  Trophy, 
  Flame, 
  Clock, 
  Award,
  Target,
  Zap,
  Star,
  Medal,
  ChevronRight,
  ListTodo,
  TrendingUp
} from 'lucide-react';

interface GameStat {
  game: string;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  // Leaderboard-eligible stats (standard preset only)
  bestScore?: number;
  bestTime?: number;
  // Overall stats (all plays)
  bestScoreOverall?: number;
  bestTimeOverall?: number;
  averageScore?: number;
  averageTime?: number;
  totalTimePlayedMs: number;
  currentStreak: number;
  longestStreak: number;
  lastPlayedAt: string;
}

interface UserStats {
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    level: number;
    totalXP: number;
    totalGamesPlayed: number;
    totalTimePlayedMs: number;
    currentDailyStreak: number;
    longestDailyStreak: number;
    joinedAt: string;
  };
  gameStats: GameStat[];
  challengeHistory: Array<{
    date: string;
    completed: boolean;
    attempts: number;
    bestScore: number;
    xpEarned: number;
  }>;
}

interface LeaderboardRanks {
  level?: number;
  streak?: number;
  games?: { [key: string]: number };
}

// Get all games that have leaderboards (only games with standard presets)
const LEADERBOARD_GAMES = [...TIME_BASED_GAMES, ...SCORE_BASED_GAMES];

export default function ProfilePage() {
  const { user, isLoggedIn, isLoading, hasInitialized, login } = useUser();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [ranks, setRanks] = useState<LeaderboardRanks>({});
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = useRef(false);

  const fetchLeaderboardRanks = useCallback(async (userId: string, gameStats: GameStat[]) => {
    try {
      const rankData: LeaderboardRanks = { games: {} };

      // Only fetch ranks for games that have leaderboards
      const leaderboardGameStats = gameStats.filter(gs => LEADERBOARD_GAMES.includes(gs.game));

      // Fetch all ranks in parallel for better performance
      const [levelResponse, streakResponse, ...gameResponses] = await Promise.all([
        fetch(`/api/stats/leaderboard?type=level&userId=${userId}`),
        fetch(`/api/stats/leaderboard?type=streak&userId=${userId}`),
        ...leaderboardGameStats.map(gameStat => 
          fetch(`/api/stats/leaderboard?type=${gameStat.game}&userId=${userId}`)
        )
      ]);

      // Process level rank
      if (levelResponse.ok) {
        const levelData = await levelResponse.json();
        if (levelData.entry) {
          rankData.level = levelData.entry.rank;
        }
      }

      // Process streak rank
      if (streakResponse.ok) {
        const streakData = await streakResponse.json();
        if (streakData.entry) {
          rankData.streak = streakData.entry.rank;
        }
      }

      // Process game-specific ranks
      for (let i = 0; i < leaderboardGameStats.length; i++) {
        const gameResponse = gameResponses[i];
        if (gameResponse.ok) {
          const gameData = await gameResponse.json();
          if (gameData.entry) {
            rankData.games![leaderboardGameStats[i].game] = gameData.entry.rank;
          }
        }
      }

      setRanks(rankData);
    } catch (error) {
      console.error('Failed to fetch leaderboard ranks:', error);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/stats/user');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        // Fetch leaderboard ranks after stats are loaded
        fetchLeaderboardRanks(data.user.id, data.gameStats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchLeaderboardRanks]);

  // Fetch stats when authentication is ready
  useEffect(() => {
    if (!hasInitialized) {
      return;
    }

    if (!isLoggedIn) {
      setStats(null);
      setLoading(false);
      hasFetchedRef.current = false;
      return;
    }

    if (hasFetchedRef.current) {
      return;
    }

    hasFetchedRef.current = true;
    setLoading(true);
    fetchStats();
  }, [hasInitialized, isLoggedIn, fetchStats]);

  // Wait until auth state is resolved - show nothing while loading to prevent flash
  if (!hasInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21]">
        {/* Empty div with same background to prevent flash */}
      </div>
    );
  }

  // Show loading state for stats (not login prompt)
  if (loading && isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21]">
        {/* Empty div with same background to prevent flash */}
      </div>
    );
  }

  // If not logged in, show access prompt - but with same background to prevent flash
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#1a2930]/80 border border-[#54FFA4]/30 rounded-2xl p-8 text-center shadow-2xl opacity-0 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <h1 className="text-2xl font-bold text-white mb-3">Login required</h1>
          <p className="text-gray-300 mb-6">
            You need to be logged in to view your profile. Sign in with Discord to continue.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => login('/profile')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#54FFA4] text-[#0F1B21] font-semibold hover:bg-[#45e094] transition-colors w-full sm:w-auto"
            >
              Login with Discord
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-[#54FFA4]/40 text-gray-200 hover:bg-[#0F1B21]/70 transition-colors w-full sm:w-auto"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] flex items-center justify-center">
        <div className="text-white text-xl">Failed to load profile</div>
      </div>
    );
  }

  const xpForCurrentLevel = calculateXPForLevel(stats.user.level);
  const xpForNextLevel = calculateXPForLevel(stats.user.level + 1);
  const xpProgress = stats.user.totalXP - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const xpPercentage = (xpProgress / xpNeeded) * 100;

  const totalHoursPlayed = Math.floor(stats.user.totalTimePlayedMs / 1000 / 60 / 60);

  const completedChallenges = stats.challengeHistory.filter(c => c.completed).length;
  const challengeCompletionRate = stats.challengeHistory.length > 0 
    ? Math.round((completedChallenges / stats.challengeHistory.length) * 100) 
    : 0;

  // Format rank for display with colors based on position
  const formatRank = (rank?: number, leaderboardType?: string) => {
    if (!rank) return null;
    
    let bgGradient = 'bg-gradient-to-r from-gray-700/50 to-gray-600/50';
    let textColor = 'text-gray-300';
    let borderColor = 'border-gray-600/30';
    let icon = <TrendingUp className="w-3.5 h-3.5" />;
    let shadowClass = 'shadow-sm';
    
    if (rank === 1) {
      bgGradient = 'bg-gradient-to-r from-yellow-500/30 to-yellow-600/30';
      textColor = 'text-yellow-400';
      borderColor = 'border-yellow-500/60';
      icon = <Trophy className="w-3.5 h-3.5" />;
      shadowClass = 'shadow-lg shadow-yellow-500/20';
    } else if (rank === 2) {
      bgGradient = 'bg-gradient-to-r from-gray-300/25 to-gray-400/25';
      textColor = 'text-gray-200';
      borderColor = 'border-gray-400/50';
      icon = <Medal className="w-3.5 h-3.5" />;
      shadowClass = 'shadow-lg shadow-gray-400/10';
    } else if (rank === 3) {
      bgGradient = 'bg-gradient-to-r from-orange-600/25 to-orange-700/25';
      textColor = 'text-orange-400';
      borderColor = 'border-orange-600/50';
      icon = <Award className="w-3.5 h-3.5" />;
      shadowClass = 'shadow-lg shadow-orange-600/10';
    } else if (rank <= 10) {
      bgGradient = 'bg-gradient-to-r from-[#54FFA4]/15 to-[#45e894]/15';
      textColor = 'text-[#54FFA4]';
      borderColor = 'border-[#54FFA4]/40';
      icon = <Star className="w-3.5 h-3.5" />;
      shadowClass = 'shadow-md shadow-[#54FFA4]/10';
    } else if (rank <= 50) {
      bgGradient = 'bg-gradient-to-r from-blue-500/15 to-blue-600/15';
      textColor = 'text-blue-400';
      borderColor = 'border-blue-500/40';
      icon = <TrendingUp className="w-3.5 h-3.5" />;
      shadowClass = 'shadow-md shadow-blue-500/10';
    }
    
    const rankBadge = (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border-2 ${bgGradient} ${borderColor} ${textColor} ${shadowClass} text-xs font-bold transition-all hover:scale-110 hover:brightness-110 cursor-pointer animate-in fade-in duration-300`}>
        {icon}
        <span className="font-mono">#{rank}</span>
      </div>
    );

    // If leaderboardType provided, wrap in Link
    if (leaderboardType) {
      return (
        <Link href={`/leaderboards?type=${leaderboardType}`} className="inline-block">
          {rankBadge}
        </Link>
      );
    }

    return rankBadge;
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] py-8 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-300 hover:text-[#54FFA4] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>
        
        <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-2xl p-8 shadow-2xl animate-fade-in">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#54FFA4] to-[#45e894] p-1">
                {stats.user.avatar ? (
                  <Image 
                    src={stats.user.avatar} 
                    alt={stats.user.displayName || stats.user.username}
                    width={128}
                    height={128}
                    className="w-full h-full rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#0F1B21] flex items-center justify-center text-[#54FFA4] text-4xl font-bold">
                    {stats.user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {/* Level Badge */}
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-[#54FFA4] to-[#45e894] text-[#0F1B21] px-4 py-1 rounded-full font-bold text-lg border-4 border-[#0F1B21]">
                Lv. {stats.user.level}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-2">
                {stats.user.displayName || stats.user.username}
              </h1>
              <p className="text-gray-400 mb-4">
                Member since {new Date(stats.user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>

              {/* XP Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Level {stats.user.level}</span>
                  <span>{xpProgress.toLocaleString()} / {xpNeeded.toLocaleString()} XP</span>
                  <span>Level {stats.user.level + 1}</span>
                </div>
                <div className="w-full h-4 bg-[#0F1B21] rounded-full overflow-hidden border-2 border-[#54FFA4]/30">
                  <div 
                    className="h-full bg-gradient-to-r from-[#54FFA4] to-[#45e894] transition-all duration-500"
                    style={{ width: `${Math.min(xpPercentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0F1B21]/50 rounded-lg p-3 border border-[#54FFA4]/20">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-[#54FFA4]">
                      <Zap className="w-4 h-4" />
                      <span className="text-xs font-medium">Level</span>
                    </div>
                    {formatRank(ranks.level, 'level')}
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {stats.user.level}
                  </div>
                </div>

                <div className="bg-[#0F1B21]/50 rounded-lg p-3 border border-blue-500/20">
                  <div className="flex items-center gap-2 text-blue-400 mb-1">
                    <Trophy className="w-4 h-4" />
                    <span className="text-xs font-medium">Games</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {stats.user.totalGamesPlayed}
                  </div>
                </div>

                <div className="bg-[#0F1B21]/50 rounded-lg p-3 border border-purple-500/20">
                  <div className="flex items-center gap-2 text-purple-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium">Played</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {totalHoursPlayed}h
                  </div>
                </div>

                <div className="bg-[#0F1B21]/50 rounded-lg p-3 border border-orange-500/20">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-orange-400">
                      <Flame className="w-4 h-4" />
                      <span className="text-xs font-medium">Streak</span>
                    </div>
                    {formatRank(ranks.streak, 'streak')}
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {stats.user.currentDailyStreak}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Challenge Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up-delay-1">
          <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-orange-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Current Streak</div>
                <div className="text-3xl font-bold text-white">{stats.user.currentDailyStreak} days</div>
              </div>
            </div>
            <Link 
              href="/daily-challenge"
              className="flex items-center justify-between text-orange-400 hover:text-orange-300 transition-colors"
            >
              <span className="text-sm">View Today&apos;s Challenge</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Longest Streak</div>
                <div className="text-3xl font-bold text-white">{stats.user.longestDailyStreak} days</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Keep it up to beat your record!
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-green-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <ListTodo className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Completion Rate</div>
                <div className="text-3xl font-bold text-white">{challengeCompletionRate}%</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {completedChallenges} of {stats.challengeHistory.length} completed
            </div>
          </div>
        </div>

        {/* Game Statistics Grid */}
        <div className="animate-fade-in-up-delay-2">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-[#54FFA4]" />
            Game Statistics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.gameStats.filter(gs => LEADERBOARD_GAMES.includes(gs.game)).length === 0 ? (
              <div className="col-span-full text-center py-12 bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/20 rounded-xl">
                <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No games played yet</p>
                <p className="text-gray-500 text-sm mt-2">Start playing to see your stats!</p>
              </div>
            ) : (
              stats.gameStats
                .filter(gameStat => LEADERBOARD_GAMES.includes(gameStat.game))
                .map((gameStat) => (
                <div 
                  key={gameStat.game}
                  className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-xl p-6 hover:border-[#54FFA4]/60 transition-all duration-300 hover:transform hover:scale-105"
                >
                  {/* Game Header */}
                  <div className="mb-4">
                    <div className={`h-2 w-full bg-gradient-to-r ${getGameTailwindGradient(gameStat.game)} rounded-full mb-3`} />
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center">{getGameIcon(gameStat.game, 'md')}</span>
                        <h3 className="text-xl font-bold text-white">{getGameName(gameStat.game)}</h3>
                      </div>
                      {formatRank(ranks.games?.[gameStat.game], gameStat.game)}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">
                        {TIME_BASED_GAMES.includes(gameStat.game) ? 'Best Time' : 'Best Score'}
                      </span>
                      <span className="text-[#54FFA4] font-bold">
                        {TIME_BASED_GAMES.includes(gameStat.game) 
                          ? ((gameStat.bestTimeOverall || gameStat.bestTime) && (gameStat.bestTimeOverall || gameStat.bestTime)! > 0
                              ? `${((gameStat.bestTimeOverall || gameStat.bestTime)! / 1000).toFixed(2)}s`
                              : 'N/A')
                          : ((gameStat.bestScoreOverall || gameStat.bestScore) && (gameStat.bestScoreOverall || gameStat.bestScore)! > 0
                              ? (gameStat.bestScoreOverall || gameStat.bestScore)!.toLocaleString()
                              : 'N/A')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Average</span>
                      <span className="text-white font-medium">
                        {TIME_BASED_GAMES.includes(gameStat.game) 
                          ? (gameStat.averageTime && gameStat.averageTime > 0
                              ? `${(gameStat.averageTime / 1000).toFixed(2)}s`
                              : 'N/A')
                          : (gameStat.averageScore && gameStat.averageScore > 0
                              ? gameStat.averageScore.toLocaleString()
                              : 'N/A')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Games Played</span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="text-emerald-400">{gameStat.gamesWon}</span>
                        <span className="text-gray-500">|</span>
                        <span className="text-red-400">{gameStat.gamesLost}</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Time Played</span>
                      <span className="text-white font-medium">
                        {Math.floor(gameStat.totalTimePlayedMs / 1000 / 60)}m
                      </span>
                    </div>
                  </div>

                  {/* Play Button */}
                  <Link 
                    href={`/puzzles/${gameStat.game}`}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#54FFA4] to-[#45e894] text-[#0F1B21] rounded-lg font-bold hover:opacity-90 transition-opacity"
                  >
                    Play Now
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
    </ErrorBoundary>
  );
}

function calculateXPForLevel(level: number): number {
  // This must match the inverse of the server's formula in /app/api/stats/save/route.ts
  // Server formula: level = floor(cbrt(xp / 25)) + 1
  // Inverse: xp = (level - 1)³ * 25
  if (level === 1) return 0;
  return Math.pow(level - 1, 3) * 25;
}
