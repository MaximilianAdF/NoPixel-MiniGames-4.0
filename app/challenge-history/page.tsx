'use client';

import { useEffect, useState, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import Link from 'next/link';
import ErrorBoundary from '../components/ErrorBoundary';
import { Calendar, Trophy, Clock, CheckCircle, XCircle, Award, ListTodo } from 'lucide-react';

interface ChallengeHistoryItem {
  challengeId: string;
  date: string;
  game: string;
  completed: boolean;
  attempts: number;
  bestScore: number;
  xpEarned: number;
  completedAt?: string;
  // Challenge parameters
  targetScore?: number;
  targetTime?: number;
  rows?: number;
  columns?: number;
  levels?: number;
  words?: number;
  maxRounds?: number;
  pinLength?: number;
  numLetters?: number;
  description?: string;
}

export default function ChallengeHistoryPage() {
  const { user, isLoggedIn, isLoading, hasInitialized, login } = useUser();
  const [history, setHistory] = useState<ChallengeHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = useRef(false);

  // Fetch history when authentication is ready
  useEffect(() => {
    if (!hasInitialized) {
      return;
    }

    if (!isLoggedIn) {
      setHistory([]);
      setLoading(false);
      hasFetchedRef.current = false;
      return;
    }

    if (hasFetchedRef.current) {
      return;
    }

    hasFetchedRef.current = true;
    setLoading(true);
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasInitialized, isLoggedIn]);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/challenges/history');
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setHistory(data.history || []);
    } catch (error) {
      console.error('Failed to fetch challenge history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Wait until auth state is resolved - show nothing while loading to prevent flash
  if (!hasInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21]">
        {/* Empty div with same background to prevent flash */}
      </div>
    );
  }

  // If not logged in, show prompt - but with same background to prevent flash
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#1a2930]/80 border border-[#54FFA4]/30 rounded-2xl p-8 text-center shadow-2xl opacity-0 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <h1 className="text-2xl font-bold text-white mb-3">Login required</h1>
          <p className="text-gray-300 mb-6">
            Sign in with Discord to view your daily challenge history and progress.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => login('/challenge-history')}
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21]">
        {/* Empty div with same background to prevent flash */}
      </div>
    );
  }

  const totalChallenges = history.length;
  const completedChallenges = history.filter(h => h.completed).length;
  const totalXP = history.reduce((sum, h) => sum + (h.xpEarned || 0), 0);
  const completionRate = totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0;

  // Format challenge parameters for display
  const formatChallengeParams = (item: ChallengeHistoryItem) => {
    const params: string[] = [];
    
    switch (item.game) {
      case 'thermite':
        if (item.targetScore) params.push(`${item.targetScore} score`);
        if (item.targetTime) params.push(`${Math.floor(item.targetTime / 1000)}s`);
        break;
      case 'roof-running':
        if (item.rows && item.columns) {
          const totalTiles = item.rows * item.columns;
          params.push(`Clear ${totalTiles} tiles`);
        }
        if (item.targetTime) params.push(`${Math.floor(item.targetTime / 1000)}s`);
        break;
      case 'laundromat':
        if (item.levels) params.push(`${item.levels} levels`);
        if (item.targetTime) params.push(`${Math.floor(item.targetTime / 1000)}s`);
        break;
      case 'word-memory':
        if (item.words) params.push(`${item.words} words`);
        if (item.targetTime) params.push(`${Math.floor(item.targetTime / 1000)}s`);
        break;
      case 'pincracker':
        if (item.pinLength) params.push(`${item.pinLength}-digit PIN`);
        if (item.targetTime) params.push(`${Math.floor(item.targetTime / 1000)}s`);
        break;
      case 'chopping':
        if (item.numLetters) params.push(`${item.numLetters} letters`);
        if (item.targetTime) params.push(`${Math.floor(item.targetTime / 1000)}s`);
        break;
      case 'lockpick':
        if (item.levels) params.push(`${item.levels} levels`);
        if (item.targetTime) params.push(`${Math.floor(item.targetTime / 1000)}s`);
        break;
    }
    
    return params.join(' · ');
  };

  // Format best score with game-specific context
  const formatBestScore = (item: ChallengeHistoryItem) => {
    switch (item.game) {
      case 'laundromat':
      case 'lockpick':
        // Score is 0-indexed level, so add 1 to show actual levels completed
        return `${item.bestScore + 1}`;
      case 'thermite':
        return `${item.bestScore}`;
      case 'roof-running':
        return `${item.bestScore} tiles`;
      case 'word-memory':
        return `${item.bestScore} words`;
      case 'pincracker':
        return `${item.bestScore}/${item.pinLength || '?'} pins`;
      case 'chopping':
        return `${item.bestScore} trees`;
      default:
        return `${item.bestScore}`;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-2">Daily Challenge History</h1>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Track your progress and achievements</span>
                </div>
              </div>
              <Link
                href="/daily-challenge"
                className="px-6 py-3 bg-[#54FFA4] text-[#0F1B21] rounded-lg font-semibold hover:bg-[#45e094] transition-all shadow-lg hover:shadow-[#54FFA4]/20 hover:-translate-y-0.5 self-start"
              >
                Today&apos;s Challenge
              </Link>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in-up-delay-1">
            <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-[#54FFA4]" />
                <span className="text-gray-400 text-sm">Total Challenges</span>
              </div>
              <div className="text-3xl font-bold text-white">{totalChallenges}</div>
            </div>

            <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-gray-400 text-sm">Completed</span>
              </div>
              <div className="text-3xl font-bold text-white">{completedChallenges}</div>
            </div>

            <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-2">
                <ListTodo className="w-6 h-6 text-green-400" />
                <span className="text-gray-400 text-sm">Completion Rate</span>
              </div>
              <div className="text-3xl font-bold text-white">{completionRate}%</div>
            </div>

            <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-6 h-6 text-[#54FFA4]" />
                <span className="text-gray-400 text-sm">Total XP Earned</span>
              </div>
              <div className="text-3xl font-bold text-white">{totalXP.toLocaleString()}</div>
            </div>
          </div>

          {/* History Table */}
          <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up-delay-2">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0F1B21]/50 border-b-2 border-[#54FFA4]/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Game</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Attempts</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Best Score</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">XP Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#54FFA4]/20">
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No challenge history yet. Complete your first daily challenge!
                      </td>
                    </tr>
                  ) : (
                    history.map((item, index) => (
                      <tr 
                        key={index} 
                        className={`hover:bg-[#0F1B21]/60 transition-colors ${
                          index % 2 === 0 ? 'bg-[#0F1B21]/5' : 'bg-[#0F1B21]'
                        }`}
                      >
                        <td className="px-6 py-4 text-white">
                          {new Date(item.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-[#54FFA4] font-semibold capitalize">
                              {item.game.replace('-', ' ')}
                            </div>
                            {formatChallengeParams(item) && (
                              <div className="text-xs text-gray-400 mt-1">
                                {formatChallengeParams(item)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {item.completed ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                              <CheckCircle className="w-4 h-4" />
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
                              <XCircle className="w-4 h-4" />
                              Incomplete
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-white">{item.attempts}</td>
                        <td className="px-6 py-4 text-white font-semibold">{formatBestScore(item)}</td>
                        <td className="px-6 py-4">
                          <span className="text-[#54FFA4] font-bold">
                            +{item.xpEarned || 0} XP
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
