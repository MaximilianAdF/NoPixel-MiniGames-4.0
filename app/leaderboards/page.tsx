'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Trophy, Medal, Award, Flame, Zap, TrendingUp, Gamepad2, ChevronDown, ChevronRight, User, Play, Info } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '../contexts/UserContext';
import { getGameIcon } from '../utils/gameIcons';
import { getPresetDescription } from '../utils/gamePresets';
import Icon from '@mdi/react';
import { mdiFuse, mdiWashingMachine } from '@mdi/js';
import { Blocks, Brain, Key, Wrench, Keyboard, Fingerprint } from 'lucide-react';

type LeaderboardType = 'level' | 'streak' | 'thermite' | 'lockpick' | 'pincracker' | 'laundromat' | 'roof-running' | 'word-memory' | 'chopping';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  value: number;
  secondaryValue?: number;
  verified?: boolean;
}

const leaderboardCategories = {
  general: [
    { id: 'level', name: 'Player Level', icon: Zap, description: 'Top players by XP and level' },
    { id: 'streak', name: 'Daily Streak', icon: Flame, description: 'Longest consecutive challenge streaks' },
  ],
  minigames: [
    { id: 'thermite', name: 'Thermite', iconType: 'mdi', iconPath: mdiFuse, description: 'Fastest completion time' },
    { id: 'lockpick', name: 'Lockpick', iconType: 'lucide', IconComponent: Key, description: 'Fastest completion time' },
    { id: 'pincracker', name: 'PinCracker', iconType: 'lucide', IconComponent: Fingerprint, description: 'Fastest completion time' },
    { id: 'laundromat', name: 'Laundromat', iconType: 'mdi', iconPath: mdiWashingMachine, description: 'Fastest completion time' },
    { id: 'roof-running', name: 'Roof Running', iconType: 'lucide', IconComponent: Blocks, description: 'Fastest completion time' },
    { id: 'word-memory', name: 'Word Memory', iconType: 'lucide', IconComponent: Brain, description: 'Most words remembered' },
    { id: 'chopping', name: 'Chopping', iconType: 'lucide', IconComponent: Keyboard, description: 'Fastest completion time' },
  ],
};

export default function LeaderboardsPage() {
  const { user } = useUser();
  const [activeLeaderboard, setActiveLeaderboard] = useState<LeaderboardType>('level');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['general']));
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const hasFetchedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const requestIdRef = useRef(0);

  const fetchLeaderboard = useCallback(async () => {
    // Prevent duplicate fetches
    if (hasFetchedRef.current) {
      hasFetchedRef.current = false;
      return;
    }
    hasFetchedRef.current = true;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    // Generate unique request ID to track this specific request
    const currentRequestId = ++requestIdRef.current;

    // Don't clear old data - let new data replace it smoothly
    // This prevents flickering when switching categories
    
    // Only show skeleton on initial load
    if (isInitialLoad) {
      setLoading(true);
    }
    
    try {
      const response = await fetch(`/api/stats/leaderboard?type=${activeLeaderboard}&limit=10&page=${currentPage}`, {
        signal: abortControllerRef.current.signal,
      });
      if (response.ok) {
        const data = await response.json();
        
        // Check if this is still the latest request
        if (currentRequestId !== requestIdRef.current) {
          // A newer request has been made, discard this data
          return;
        }
        
        // Update pagination info
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
        }
        
        // Update leaderboard immediately for snappy feel
        setLeaderboard(data.entries || []);
        
        // If user is logged in, fetch their rank
        if (user?.id) {
          const userEntry = (data.entries || []).find((entry: LeaderboardEntry) => entry.userId === user.id);
          
          if (userEntry) {
            // User is in top 10
            setUserRank(null); // User is already visible
          } else {
            // User not in top 10, fetch their specific rank
            try {
              const userRankResponse = await fetch(`/api/stats/leaderboard?type=${activeLeaderboard}&userId=${user.id}`, {
                signal: abortControllerRef.current.signal,
              });
              if (userRankResponse.ok) {
                const userRankData = await userRankResponse.json();
                if (userRankData.entry) {
                  setUserRank(userRankData.entry);
                } else {
                  setUserRank(null);
                }
              }
            } catch (error) {
              console.error('Failed to fetch user rank:', error);
              setUserRank(null);
            }
          }
        } else {
          setUserRank(null);
        }
      }
    } catch (error) {
      // Ignore abort errors - they're expected when switching categories
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('Failed to fetch leaderboard:', error);
      setLeaderboard([]);
      setUserRank(null);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
      // Reset the ref after a short delay to allow new fetches
      setTimeout(() => {
        hasFetchedRef.current = false;
      }, 100);
    }
  }, [activeLeaderboard, currentPage, user?.id, isInitialLoad]);

  // Fetch leaderboard when dependencies change (with debouncing)
  useEffect(() => {
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // For initial load, fetch immediately
    if (isInitialLoad) {
      fetchLeaderboard();
      return;
    }
    
    // For category/page changes, debounce by 100ms (fast but prevents spam)
    debounceTimerRef.current = setTimeout(() => {
      fetchLeaderboard();
    }, 100);
    
    // Cleanup on unmount or dependency change
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLeaderboard, currentPage, user?.id]);

  const handleLeaderboardChange = (newLeaderboard: LeaderboardType) => {
    setActiveLeaderboard(newLeaderboard);
    setCurrentPage(1); // Reset to first page when changing leaderboards
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="text-gray-400 font-bold">#{rank}</span>;
  };

  // Format leaderboard value based on game type
  const formatLeaderboardValue = (value: number) => {
    // Time-based games (all except word-memory)
    const timeBasedGames = ['thermite', 'lockpick', 'laundromat', 'pincracker', 'chopping', 'roof-running'];
    
    if (timeBasedGames.includes(activeLeaderboard)) {
      // Convert ms to seconds with 2 decimal places
      const seconds = (value / 1000).toFixed(2);
      return `${seconds}s`;
    }
    
    // Score-based (word-memory) or level/streak
    return value.toLocaleString();
  };

  const activeOption = [...leaderboardCategories.general, ...leaderboardCategories.minigames].find(opt => opt.id === activeLeaderboard);

  // No skeleton - just show the page immediately
  // if (isInitialLoad && loading) {
  //   return null;
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-2">Leaderboards</h1>
          <p className="text-gray-400">Compete with players worldwide</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in-up-delay-1">
          
          {/* Sidebar - Category Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-2xl overflow-hidden shadow-2xl sticky top-4">
              
              {/* General Category */}
              <div>
                <button
                  onClick={() => toggleCategory('general')}
                  className="w-full px-6 py-4 bg-[#0F1B21]/50 border-b-2 border-[#54FFA4]/30 flex items-center justify-between text-white font-bold hover:bg-[#0F1B21]/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-[#54FFA4]" />
                    <span>General</span>
                  </div>
                  {expandedCategories.has('general') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                
                {expandedCategories.has('general') && (
                  <div className="divide-y divide-[#54FFA4]/20">
                    {leaderboardCategories.general.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleLeaderboardChange(option.id as LeaderboardType)}
                          className={`w-full px-6 py-3 flex items-center gap-3 transition-all ${
                            activeLeaderboard === option.id
                              ? 'bg-gradient-to-r from-[#54FFA4]/20 to-[#45e894]/20 border-l-4 border-[#54FFA4] text-white'
                              : 'text-gray-300 hover:bg-[#0F1B21]/30'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${activeLeaderboard === option.id ? 'text-[#54FFA4]' : 'text-gray-400'}`} />
                          <span className="text-sm font-medium">{option.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Minigames Category */}
              <div>
                <button
                  onClick={() => toggleCategory('minigames')}
                  className="w-full px-6 py-4 bg-[#0F1B21]/50 border-b-2 border-[#54FFA4]/30 flex items-center justify-between text-white font-bold hover:bg-[#0F1B21]/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Gamepad2 className="w-5 h-5 text-[#54FFA4]" />
                    <span>Minigames</span>
                  </div>
                  {expandedCategories.has('minigames') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                
                {expandedCategories.has('minigames') && (
                  <div className="divide-y divide-[#54FFA4]/20">
                    {leaderboardCategories.minigames.map((option) => {
                      const renderIcon = () => {
                        if (option.iconType === 'mdi' && option.iconPath) {
                          return <Icon path={option.iconPath} size={0.6} />;
                        }
                        if (option.iconType === 'lucide' && option.IconComponent) {
                          const LucideIcon = option.IconComponent;
                          return <LucideIcon className="w-4 h-4" />;
                        }
                        return null;
                      };
                      
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleLeaderboardChange(option.id as LeaderboardType)}
                          className={`w-full px-6 py-3 flex items-center gap-3 transition-all ${
                            activeLeaderboard === option.id
                              ? 'bg-gradient-to-r from-[#54FFA4]/20 to-[#45e894]/20 border-l-4 border-[#54FFA4] text-white'
                              : 'text-gray-300 hover:bg-[#0F1B21]/30'
                          }`}
                        >
                          <div className={`${activeLeaderboard === option.id ? 'text-[#54FFA4]' : 'text-gray-400'}`}>
                            {renderIcon()}
                          </div>
                          <span className="text-sm font-medium">{option.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Main Content - Leaderboard Table */}
          <div className="lg:col-span-3">
            
            {/* Active Leaderboard Header */}
            <div className="mb-4 bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {activeOption && (
                      <>
                        {'icon' in activeOption ? (
                          <activeOption.icon className="w-8 h-8 text-[#54FFA4]" />
                        ) : activeOption.iconType === 'mdi' && activeOption.iconPath ? (
                          <Icon path={activeOption.iconPath} size={1.2} className="text-[#54FFA4]" />
                        ) : activeOption.iconType === 'lucide' && activeOption.IconComponent ? (
                          <activeOption.IconComponent className="w-8 h-8 text-[#54FFA4]" />
                        ) : null}
                      </>
                    )}
                    <h2 className="text-3xl font-bold text-white">{activeOption?.name}</h2>
                    <button
                      onClick={() => setShowInfoModal(true)}
                      className="p-2 hover:bg-[#54FFA4]/10 rounded-lg transition-colors group"
                      title="View info"
                    >
                      <Info className="w-5 h-5 text-gray-400 group-hover:text-[#54FFA4] transition-colors" />
                    </button>
                  </div>
                  <p className="text-gray-400">{activeOption?.description}</p>
                </div>
                
                {/* Play Competitively Button (for minigames only) */}
                {!['level', 'streak'].includes(activeLeaderboard) && (
                  <Link
                    href={`/puzzles/${activeLeaderboard}?competitive=true`}
                    className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-[#54FFA4] text-[#0F1B21] rounded-lg font-semibold hover:bg-[#45e894] transition-all shadow-lg hover:shadow-[#54FFA4]/20 hover:-translate-y-0.5"
                  >
                    <Play className="w-4 h-4" />
                    Play Competitively
                  </Link>
                )}
                
                {/* Play Daily Challenge Button (for streak leaderboard) */}
                {activeLeaderboard === 'streak' && (
                  <Link
                    href="/daily-challenge"
                    className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/20 hover:-translate-y-0.5"
                  >
                    <Flame className="w-4 h-4" />
                    Play Daily Challenge
                  </Link>
                )}
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-2xl overflow-hidden shadow-2xl">
              {/* Table Header */}
              <div className="bg-[#0F1B21]/50 border-b-2 border-[#54FFA4]/30 px-6 py-4">
                <div className="grid grid-cols-12 gap-4 font-bold text-gray-300">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-6 md:col-span-5">Player</div>
                  <div className="col-span-3 md:col-span-3 text-right">
                    {activeLeaderboard === 'level' 
                      ? 'Level' 
                      : activeLeaderboard === 'streak' 
                      ? 'Streak' 
                      : activeLeaderboard === 'word-memory'
                      ? 'Words'
                      : 'Time'}
                  </div>
                  <div className="hidden md:block md:col-span-3 text-right">
                    {activeLeaderboard === 'level' ? 'Total XP' : activeLeaderboard === 'streak' ? 'Best Streak' : 'Games Played'}
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div 
                className="divide-y-2 divide-[#54FFA4]/20"
              >
                {leaderboard.length === 0 && loading ? (
                  // Show skeleton rows only on initial load (when there's no data yet)
                  Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="px-6 py-4 animate-pulse">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-1">
                          <div className="w-8 h-8 bg-[#54FFA4]/10 rounded"></div>
                        </div>
                        <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#54FFA4]/10 rounded-full"></div>
                          <div className="space-y-1 flex-1">
                            <div className="h-6 bg-[#54FFA4]/10 rounded w-3/4"></div>
                            <div className="h-5 bg-[#54FFA4]/10 rounded w-1/2"></div>
                          </div>
                        </div>
                        <div className="col-span-3 md:col-span-3">
                          <div className="h-7 bg-[#54FFA4]/10 rounded w-16 ml-auto"></div>
                        </div>
                        <div className="hidden md:block md:col-span-3">
                          <div className="h-6 bg-[#54FFA4]/10 rounded w-20 ml-auto"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : leaderboard.length === 0 ? (
                  <div className="px-6 py-12 text-center text-gray-400">
                    No data available yet. Be the first to play!
                  </div>
                ) : (
                  <>
                    {leaderboard.slice(0, 10).map((entry, index) => (
                      <Link
                        key={`${entry.userId}-${activeLeaderboard}`}
                        href={`/profile/${entry.userId}`}
                        className={`block px-6 py-4 hover:bg-[#0F1B21]/60 transition-colors duration-150 cursor-pointer ${
                          entry.rank <= 3 ? 'bg-[#0F1B21]/30' : index % 2 === 0 ? 'bg-[#0F1B21]/10' : 'bg-[#0F1B21]/5'
                        } ${entry.userId === user?.id ? '!bg-[#54FFA4]/5 border-l-4 border-[#54FFA4]' : ''}`}
                      >
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* Rank */}
                          <div className="col-span-1">
                            {getRankIcon(entry.rank)}
                          </div>

                          {/* Player */}
                          <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#54FFA4] to-[#45e894] flex items-center justify-center text-[#0F1B21] font-bold overflow-hidden">
                              {entry.avatar ? (
                                <Image src={entry.avatar} alt={entry.displayName || entry.username} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                              ) : (
                                entry.username.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="text-white font-medium flex items-center gap-2 hover:text-[#54FFA4] transition-colors">
                                {entry.displayName || entry.username}
                                {entry.verified && (
                                  <span className="text-[#54FFA4]" title="Verified Discord User">✓</span>
                                )}
                                {entry.userId === user?.id && (
                                  <span className="text-xs bg-[#54FFA4]/20 text-[#54FFA4] px-2 py-0.5 rounded-full font-semibold">You</span>
                                )}
                              </div>
                              <div className="text-gray-400 text-sm">@{entry.username}</div>
                            </div>
                          </div>

                          {/* Score/Level/Streak */}
                          <div className="col-span-3 md:col-span-3 text-right">
                            <div className="text-[#54FFA4] font-bold text-xl flex items-center justify-end gap-1">
                              {formatLeaderboardValue(entry.value)}
                              {activeLeaderboard === 'streak' && <Flame className="w-5 h-5 text-orange-500" />}
                            </div>
                          </div>

                          {/* Secondary Value */}
                          <div className="hidden md:block md:col-span-3 text-right text-gray-400">
                            {entry.secondaryValue?.toLocaleString() || 'N/A'}
                          </div>
                        </div>
                      </Link>
                    ))}
                    
                    {/* User's Rank (if not in top 10) */}
                    {userRank && (
                      <>
                        <div className="px-6 py-3 bg-[#0F1B21]/30">
                          <div className="text-center text-gray-400 text-sm font-medium">• • •</div>
                        </div>
                        <Link
                          href={`/profile/${userRank.userId}`}
                          className="block px-6 py-4 bg-[#54FFA4]/10 border-l-4 border-[#54FFA4] hover:bg-[#54FFA4]/15 transition-colors cursor-pointer"
                        >
                          <div className="grid grid-cols-12 gap-4 items-center">
                            {/* Rank */}
                            <div className="col-span-1">
                              <div className="flex items-center gap-1">
                                <User className="w-5 h-5 text-[#54FFA4]" />
                                <span className="text-gray-300 font-bold text-sm">#{userRank.rank}</span>
                              </div>
                            </div>

                            {/* Player */}
                            <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#54FFA4] to-[#45e894] flex items-center justify-center text-[#0F1B21] font-bold overflow-hidden">
                                {userRank.avatar ? (
                                  <Image src={userRank.avatar} alt={userRank.displayName || userRank.username} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                                ) : (
                                  userRank.username.charAt(0).toUpperCase()
                                )}
                              </div>
                              <div>
                                <div className="text-white font-medium flex items-center gap-2 hover:text-[#54FFA4] transition-colors">
                                  {userRank.displayName || userRank.username}
                                  {userRank.verified && (
                                    <span className="text-[#54FFA4]" title="Verified Discord User">✓</span>
                                  )}
                                  <span className="text-xs bg-[#54FFA4]/20 text-[#54FFA4] px-2 py-0.5 rounded-full font-semibold">You</span>
                                </div>
                                <div className="text-gray-400 text-sm">@{userRank.username}</div>
                              </div>
                            </div>

                            {/* Score/Level/Streak */}
                            <div className="col-span-3 md:col-span-3 text-right">
                              <div className="text-[#54FFA4] font-bold text-xl flex items-center justify-end gap-1">
                                {formatLeaderboardValue(userRank.value)}
                                {activeLeaderboard === 'streak' && <Flame className="w-5 h-5 text-orange-500" />}
                              </div>
                            </div>

                            {/* Secondary Value */}
                            <div className="hidden md:block md:col-span-3 text-right text-gray-400">
                              {userRank.secondaryValue?.toLocaleString() || 'N/A'}
                            </div>
                          </div>
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === 1
                      ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                      : 'bg-[#0F1B21]/80 border border-[#54FFA4]/30 text-gray-300 hover:text-[#54FFA4] hover:border-[#54FFA4] hover:shadow-lg'
                  }`}
                >
                  Previous
                </button>
                
                <div className="text-gray-300 font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === totalPages
                      ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                      : 'bg-[#0F1B21]/80 border border-[#54FFA4]/30 text-gray-300 hover:text-[#54FFA4] hover:border-[#54FFA4] hover:shadow-lg'
                  }`}
                >
                  Next
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Info Modal */}
        {showInfoModal && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowInfoModal(false)}
          >
            <div 
              className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b-2 border-[#54FFA4]/30 bg-[#0F1B21]/50 sticky top-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {activeOption && (
                      <>
                        {'icon' in activeOption ? (
                          <activeOption.icon className="w-6 h-6 text-[#54FFA4]" />
                        ) : activeOption.iconType === 'mdi' && activeOption.iconPath ? (
                          <Icon path={activeOption.iconPath} size={1} className="text-[#54FFA4]" />
                        ) : activeOption.iconType === 'lucide' && activeOption.IconComponent ? (
                          <activeOption.IconComponent className="w-6 h-6 text-[#54FFA4]" />
                        ) : null}
                      </>
                    )}
                    <h3 className="text-2xl font-bold text-white">{activeOption?.name} Info</h3>
                  </div>
                  <button
                    onClick={() => setShowInfoModal(false)}
                    className="p-2 hover:bg-[#54FFA4]/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Competitive Requirements for minigames */}
                {!['level', 'streak'].includes(activeLeaderboard) && (
                  <div>
                    <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-[#54FFA4]" />
                      Competitive Requirements
                    </h4>
                    <p className="text-gray-300 mb-3">
                      To qualify for this leaderboard, you must {activeLeaderboard === 'word-memory' ? 'use the standard timer' : 'play with standard preset settings'}:
                    </p>
                    <div className="bg-[#0F1B21]/50 border border-[#54FFA4]/30 rounded-lg p-4">
                      <div className="text-[#54FFA4] font-mono text-sm">
                        {getPresetDescription(activeLeaderboard)}
                      </div>
                      {activeLeaderboard === 'word-memory' && (
                        <div className="text-gray-400 text-xs mt-2">
                          * Word count is adjustable, but timer must be 25s
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* How Rankings Work */}
                <div>
                  <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    How Rankings Work
                  </h4>
                  <ul className="space-y-3 text-gray-300">
                    {activeLeaderboard === 'level' && (
                      <li className="flex items-start gap-3">
                        <span className="text-[#54FFA4] mt-0.5 flex-shrink-0">•</span>
                        <span>Rankings based on total XP and player level. Play any game to earn XP and climb the ranks!</span>
                      </li>
                    )}
                    {activeLeaderboard === 'streak' && (
                      <li className="flex items-start gap-3">
                        <span className="text-[#54FFA4] mt-0.5 flex-shrink-0">•</span>
                        <span>Rankings based on consecutive daily challenge completions. Complete the daily challenge every day to maintain your streak!</span>
                      </li>
                    )}
                    {!['level', 'streak'].includes(activeLeaderboard) && (
                      <>
                        <li className="flex items-start gap-3">
                          <span className="text-[#54FFA4] mt-0.5 flex-shrink-0">•</span>
                          <span>Rankings based on your {activeLeaderboard === 'word-memory' ? 'highest score' : 'fastest completion time'} using standard settings</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#54FFA4] mt-0.5 flex-shrink-0">•</span>
                          <span>Only games played with competitive settings count toward the leaderboard</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#54FFA4] mt-0.5 flex-shrink-0">•</span>
                          <span>Your personal best is automatically tracked and updated</span>
                        </li>
                      </>
                    )}
                    <li className="flex items-start gap-3">
                      <span className="text-[#54FFA4] mt-0.5 flex-shrink-0">•</span>
                      <span>Click on any player to view their full profile and statistics</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#54FFA4] mt-0.5 flex-shrink-0">•</span>
                      <span>Leaderboards update in real-time as you play</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
