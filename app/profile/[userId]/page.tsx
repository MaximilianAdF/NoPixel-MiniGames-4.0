'use client';

import { useEffect, useState } from 'react';
import { Trophy, Zap, Flame, Calendar, Clock, TrendingUp, Award, Gamepad2, ArrowLeft, ChevronRight, ListTodo, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getGameName, getGameIcon, getGameTailwindGradient } from '../../utils/gameIcons';

interface UserProfile {
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
    level: number;
    totalXP: number;
    totalGamesPlayed: number;
    totalTimePlayedMs: number;
    currentDailyStreak: number;
    longestDailyStreak: number;
    joinedAt: string;
  };
  gameStats: {
    game: string;
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;
    bestScore: number;
    bestTime: number;
    bestScoreOverall: number;
    bestTimeOverall: number;
    averageScore: number;
    averageTime: number;
    totalTimePlayedMs: number;
    currentStreak: number;
    longestStreak: number;
    lastPlayedAt: string;
  }[];
  challengeHistory: {
    date: string;
    completed: boolean;
    attempts: number;
    bestScore: number;
    xpEarned: number;
  }[];
}

export default function PublicProfilePage({ params }: { params: { userId: string } }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.userId]);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/stats/user/${params.userId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('User not found');
        } else {
          setError('Failed to load profile');
        }
        return;
      }
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21]">
        {/* Empty div with same background to prevent flash */}
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error || 'Profile not found'}</div>
          <Link href="/leaderboards" className="text-[#54FFA4] hover:underline">
            Back to Leaderboards
          </Link>
        </div>
      </div>
    );
  }

  const { user, gameStats, challengeHistory } = profile;

  // Calculate XP progress
  const calculateXPForLevel = (level: number): number => {
    if (level === 1) return 0;
    return Math.pow(level - 1, 3) * 25;
  };

  const xpForCurrentLevel = calculateXPForLevel(user.level);
  const xpForNextLevel = calculateXPForLevel(user.level + 1);
  const xpProgress = user.totalXP - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const xpPercentage = (xpProgress / xpNeeded) * 100;
  
  const totalHoursPlayed = Math.floor(user.totalTimePlayedMs / 1000 / 60 / 60);

  const completedChallenges = challengeHistory.filter(c => c.completed).length;
  const challengeCompletionRate = challengeHistory.length > 0 
    ? Math.round((completedChallenges / challengeHistory.length) * 100) 
    : 0;

  // Import game utilities
  const TIME_BASED_GAMES = ['thermite', 'lockpick', 'pincracker', 'laundromat', 'roof-running', 'chopping'];
  const SCORE_BASED_GAMES = ['word-memory'];
  const LEADERBOARD_GAMES = [...TIME_BASED_GAMES, ...SCORE_BASED_GAMES];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Button */}
        <Link
          href="/leaderboards"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#54FFA4] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Leaderboards
        </Link>

        {/* Profile Header */}
        <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-2xl p-8 mb-6 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            
            {/* Avatar with Level Badge */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#54FFA4] to-[#45e894] p-1">
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.displayName || user.username} width={128} height={128} className="w-full h-full object-cover rounded-full" unoptimized />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#0F1B21] flex items-center justify-center text-[#54FFA4] text-4xl font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {/* Level Badge */}
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-[#54FFA4] to-[#45e894] text-[#0F1B21] px-4 py-1 rounded-full font-bold text-lg border-4 border-[#0F1B21]">
                Lv. {user.level}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-2">
                {user.displayName || user.username}
              </h1>
              <p className="text-gray-400 mb-4">
                Member since {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>

              {/* XP Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Level {user.level}</span>
                  <span>{xpProgress.toLocaleString()} / {xpNeeded.toLocaleString()} XP</span>
                  <span>Level {user.level + 1}</span>
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
                  <div className="flex items-center gap-2 text-[#54FFA4] mb-1">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-medium">Level</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{user.level}</div>
                </div>
                
                <div className="bg-[#0F1B21]/50 rounded-lg p-3 border border-blue-500/20">
                  <div className="flex items-center gap-2 text-blue-400 mb-1">
                    <Gamepad2 className="w-4 h-4" />
                    <span className="text-xs font-medium">Games</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{user.totalGamesPlayed}</div>
                </div>
                
                <div className="bg-[#0F1B21]/50 rounded-lg p-3 border border-purple-500/20">
                  <div className="flex items-center gap-2 text-purple-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium">Played</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{formatTime(user.totalTimePlayedMs)}</div>
                </div>
                
                <div className="bg-[#0F1B21]/50 rounded-lg p-3 border border-orange-500/20">
                  <div className="flex items-center gap-2 text-orange-400 mb-1">
                    <Flame className="w-4 h-4" />
                    <span className="text-xs font-medium">Streak</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{user.currentDailyStreak}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Challenge Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-orange-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Current Streak</div>
                <div className="text-3xl font-bold text-white">{user.currentDailyStreak} days</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-orange-400 text-sm">
              <span>Daily Challenge Streak</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Longest Streak</div>
                <div className="text-3xl font-bold text-white">{user.longestDailyStreak} days</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-yellow-400 text-sm">
              <span>Personal Best Record</span>
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
              {completedChallenges} of {challengeHistory.length} completed
            </div>
          </div>
        </div>

        {/* Game Statistics Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-[#54FFA4]" />
            Game Statistics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {gameStats.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 text-lg">No games played yet</p>
                <p className="text-gray-500 text-sm mt-2">Start playing to see your stats!</p>
              </div>
            ) : (
              gameStats
                .filter(gameStat => LEADERBOARD_GAMES.includes(gameStat.game))
                .map((gameStat) => {
                const isTimeBased = TIME_BASED_GAMES.includes(gameStat.game);
                
                return (
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
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">
                          {isTimeBased ? 'Best Time' : 'Best Score'}
                        </span>
                        <span className="text-[#54FFA4] font-bold">
                          {isTimeBased 
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
                          {isTimeBased 
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
                );
              })
            )}
          </div>
        </div>

        {/* Recent Challenge History */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-[#54FFA4]" />
            Recent Challenges
          </h2>
          
          <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-2xl overflow-hidden shadow-2xl">
            {challengeHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No daily challenges completed yet
              </div>
            ) : (
              <div className="divide-y-2 divide-[#54FFA4]/20">
                {challengeHistory.slice(0, 5).map((challenge, index) => (
                  <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-[#0F1B21]/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        challenge.completed
                          ? 'bg-gradient-to-br from-[#54FFA4] to-[#45e894]'
                          : 'bg-gradient-to-br from-gray-600 to-gray-700'
                      }`}>
                        {challenge.completed ? (
                          <Trophy className="w-6 h-6 text-[#0F1B21]" />
                        ) : (
                          <span className="text-white text-lg">✗</span>
                        )}
                      </div>
                      
                      <div>
                        <div className="text-white font-medium">{formatDate(challenge.date)}</div>
                        <div className="text-gray-400 text-sm">
                          {challenge.attempts} attempt{challenge.attempts !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-[#54FFA4] font-bold text-lg">
                        {challenge.bestScore?.toLocaleString() || 0}
                      </div>
                      <div className="text-gray-400 text-sm">
                        +{challenge.xpEarned || 0} XP
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
