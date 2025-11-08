'use client';

import { useEffect, useState } from 'react';
import { Trophy, Zap, Flame, Calendar, Clock, TrendingUp, Award, Gamepad2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getGameName, getGameIcon } from '../../utils/gameIcons';

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
    bestScore: number;
    averageScore: number;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
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

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-2">
                {user.displayName || user.username}
              </h1>
              <p className="text-gray-400 text-lg mb-4">@{user.username}</p>
              
              {/* Stats Grid */}
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

              <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {formatDate(user.joinedAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-[#54FFA4]" />
                  {user.totalXP.toLocaleString()} XP
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Statistics */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#54FFA4]" />
            Game Statistics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameStats.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400">
                No games played yet
              </div>
            ) : (
              gameStats.map((stat) => (
                <div
                  key={stat.game}
                  className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-xl p-6 hover:border-[#54FFA4]/60 transition-all"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex items-center justify-center">{getGameIcon(stat.game, 'md')}</span>
                    <h3 className="text-lg font-bold text-white">{getGameName(stat.game)}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Best Score</span>
                      <span className="text-[#54FFA4] font-bold text-lg">{stat.bestScore.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Average Score</span>
                      <span className="text-white font-medium">{Math.round(stat.averageScore).toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Games Played</span>
                      <span className="text-white font-medium">{stat.gamesPlayed}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Playtime</span>
                      <span className="text-white font-medium">{formatTime(stat.totalTimePlayedMs)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Last Played</span>
                      <span className="text-white font-medium text-xs">{formatDate(stat.lastPlayedAt)}</span>
                    </div>
                  </div>
                </div>
              ))
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
                {challengeHistory.map((challenge, index) => (
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
