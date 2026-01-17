'use client';

import { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import Link from 'next/link';
import { Calendar, Clock, Trophy, Zap, Target, TrendingUp, Users, CheckCircle2, RotateCcw, BarChart3, ArrowLeft } from 'lucide-react';
import { gameConfigs, getGameIcon, getGameName, getGameGradient } from '../utils/gameIcons';

interface DailyChallenge {
  id: string;
  date: string;
  game: string;
  description: string;
  targetScore: number;
  targetTime: number;
  xpReward: number;
  // Game-specific settings
  rows?: number;
  columns?: number;
  levels?: number;
  words?: number;
  numLetters?: number;
  pinLength?: number;
  stats?: {
    totalAttempts: number;
    totalCompletions: number;
    uniquePlayers: number;
  };
  userProgress?: {
    completed: boolean;
    attempts: number;
    bestScore: number;
  };
}

// Calculate the actual XP reward with difficulty multiplier
function calculateActualXP(challenge: DailyChallenge): number {
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
  let difficultyMultiplier = 1.0;
  
  switch (challenge.game) {
    case 'thermite': {
      const scoreFactor = (challenge.targetScore || 24) / 24;
      const timeFactor = 50 / (challenge.targetTime / 1000);
      difficultyMultiplier = (scoreFactor + timeFactor) / 2;
      break;
    }
    case 'roof-running': {
      const tileFactor = ((challenge.rows || 8) * (challenge.columns || 11)) / 88;
      const timeFactor = 27 / (challenge.targetTime / 1000);
      difficultyMultiplier = (tileFactor + timeFactor) / 2;
      break;
    }
    case 'laundromat': {
      const levelFactor = (challenge.levels || 5) / 5;
      const timeFactor = 60 / (challenge.targetTime / 1000);
      difficultyMultiplier = (levelFactor + timeFactor) / 2;
      break;
    }
    case 'lockpick': {
      const levelFactor = (challenge.levels || 4) / 4;
      const timeFactor = 80 / (challenge.targetTime / 1000);
      difficultyMultiplier = (levelFactor + timeFactor) / 2;
      break;
    }
    case 'word-memory': {
      const wordFactor = (challenge.words || 25) / 25;
      const timeFactor = 25 / (challenge.targetTime / 1000);
      difficultyMultiplier = (wordFactor + timeFactor) / 2;
      break;
    }
    case 'pincracker': {
      const pinFactor = (challenge.pinLength || 4) / 4;
      const timeFactor = 20 / (challenge.targetTime / 1000);
      difficultyMultiplier = (pinFactor + timeFactor) / 2;
      break;
    }
    case 'chopping': {
      const letterFactor = ((challenge.numLetters || 15) / 15);
      const timeFactor = 60 / (challenge.targetTime / 1000);
      difficultyMultiplier = (letterFactor + timeFactor) / 2;
      break;
    }
  }
  
  // Apply multiplier and round up to nearest 100, with minimum of base XP
  // This matches the backend calculation in /api/challenges/complete/route.ts
  const rawXP = baseXP * difficultyMultiplier;
  return Math.max(baseXP, Math.ceil(rawXP / 100) * 100);
}

export default function DailyChallengeClient() {
  const { isLoggedIn, isLoading } = useUser();
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeUntilNext, setTimeUntilNext] = useState({ hours: '00', minutes: '00', seconds: '00' });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setShowSuccessMessage(true);
      window.history.replaceState({}, '', '/daily-challenge');
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, []);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch('/api/challenges/today');
        if (response.ok) {
          const data = await response.json();
          if (data && data.id) {
            setChallenge(data);
          }
        }
      } catch (error) {
        console.error('Error fetching challenge:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setUTCHours(24, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeUntilNext({
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading || loading) {
    return (
      <div className="py-8 px-4">
        {/* Empty div to prevent flash */}
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white text-xl">No challenge available</div>
      </div>
    );
  }

  // Helper function to get game-specific challenge details
  // Only show relevant parameters for each game type
  const getGameSpecificDetails = () => {
    const details: { label: string; value: string; icon?: any }[] = [];
    
    switch (challenge.game) {
      case 'thermite':
        // Thermite: Grid Size (fixed 6×6), Target Score, Time Limit
        if (challenge.rows && challenge.columns) {
          details.push({ label: 'Grid Size', value: `${challenge.rows}×${challenge.columns}`, icon: Target });
        }
        details.push({ label: 'Target Score', value: challenge.targetScore.toLocaleString(), icon: Trophy });
        details.push({ label: 'Time Limit', value: `${Math.floor(challenge.targetTime / 1000)}s`, icon: Clock });
        break;
        
      case 'roof-running':
        // Roof Running: Grid Size, Time Limit (no target score needed)
        if (challenge.rows && challenge.columns) {
          details.push({ label: 'Grid Size', value: `${challenge.rows}×${challenge.columns}`, icon: Target });
        }
        details.push({ label: 'Time Limit', value: `${Math.floor(challenge.targetTime / 1000)}s`, icon: Clock });
        break;
        
      case 'laundromat':
      case 'lockpick':
        // Laundromat/Lockpick: Levels, Time Limit (no target score)
        if (challenge.levels) {
          details.push({ label: 'Levels', value: `${challenge.levels}`, icon: Target });
        }
        details.push({ label: 'Time Limit', value: `${Math.floor(challenge.targetTime / 1000)}s`, icon: Clock });
        break;
        
      case 'word-memory':
        // Word Memory: Words, Time Limit (no target score)
        if (challenge.words) {
          details.push({ label: 'Words', value: `${challenge.words}`, icon: Target });
        }
        details.push({ label: 'Time Limit', value: `${Math.floor(challenge.targetTime / 1000)}s`, icon: Clock });
        break;
        
      case 'pincracker':
        // PinCracker: PIN Length, Time Limit (no target score)
        if (challenge.pinLength) {
          details.push({ label: 'PIN Length', value: `${challenge.pinLength} digits`, icon: Target });
        }
        details.push({ label: 'Time Limit', value: `${Math.floor(challenge.targetTime / 1000)}s`, icon: Clock });
        break;
        
      case 'chopping':
        // Chopping: Letters, Time Limit (no target score)
        if (challenge.numLetters) {
          details.push({ label: 'Letters', value: `${challenge.numLetters}`, icon: Target });
        }
        details.push({ label: 'Time Limit', value: `${Math.floor(challenge.targetTime / 1000)}s`, icon: Clock });
        break;
        
      default:
        // Fallback for any unknown games
        details.push({ label: 'Target Score', value: challenge.targetScore.toLocaleString(), icon: Trophy });
        details.push({ label: 'Time Limit', value: `${Math.floor(challenge.targetTime / 1000)}s`, icon: Clock });
        break;
    }
    
    return details;
  };

  const gameSpecificDetails = getGameSpecificDetails();


  const completed = challenge.userProgress?.completed || false;
  const attempts = challenge.userProgress?.attempts || 0;
  const gameGradient = getGameGradient(challenge.game);
  const successRate = challenge.stats && challenge.stats.uniquePlayers > 0 
    ? Math.round((challenge.stats.totalCompletions / challenge.stats.uniquePlayers) * 100) 
    : 0;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      
      {showSuccessMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-[slideDown_0.3s_ease-out]">
          <div className="bg-gradient-to-r from-[#54FFA4] to-[#45e894] text-[#0F1B21] px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 border-2 border-[#54FFA4]">
            <Trophy className="w-5 h-5" />
            <span className="font-bold">Challenge Completed!</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-300 hover:text-[#54FFA4] transition-colors mb-6 group animate-fade-in"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <div className="mb-8 animate-fade-in">
          {/* Title Row with Timer */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">Daily Challenge</h1>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(challenge.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
            
            {/* Countdown Timer - Right Aligned */}
            <div className="text-left lg:text-right">
              <div className="text-sm text-[#54FFA4] mb-2 font-semibold">Next Challenge In</div>
              <div className="flex gap-2 font-mono">
                <div className="bg-[#0F1B21] px-4 py-2 rounded-lg border-2 border-[#54FFA4]/30 shadow-lg">
                  <span className="text-2xl font-bold text-[#54FFA4]">{timeUntilNext.hours}</span>
                  <span className="text-xs text-gray-400 ml-1">h</span>
                </div>
                <div className="bg-[#0F1B21] px-4 py-2 rounded-lg border-2 border-[#54FFA4]/30 shadow-lg">
                  <span className="text-2xl font-bold text-[#54FFA4]">{timeUntilNext.minutes}</span>
                  <span className="text-xs text-gray-400 ml-1">m</span>
                </div>
                <div className="bg-[#0F1B21] px-4 py-2 rounded-lg border-2 border-[#54FFA4]/30 shadow-lg">
                  <span className="text-2xl font-bold text-[#54FFA4]">{timeUntilNext.seconds}</span>
                  <span className="text-xs text-gray-400 ml-1">s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fade-in-up-delay-1">
          
          <div className="lg:col-span-2 bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 relative border-b-2 border-[#54FFA4]/20 bg-[#0F1B21]/30">
              <div className="flex items-start justify-between flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl flex items-center justify-center">{getGameIcon(challenge.game, 'xl')}</span>
                    <h2 className="text-3xl font-bold text-white">{getGameName(challenge.game)}</h2>
                  </div>
                </div>
                {completed && (
                  <div className="bg-gradient-to-r from-[#54FFA4] to-[#45e894] text-[#0F1B21] px-4 py-2 rounded-lg font-bold flex items-center gap-2 self-start border-2 border-[#54FFA4]">
                    <CheckCircle2 className="w-5 h-5" />
                    Completed
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t-2 border-[#54FFA4]/20 bg-[#0F1B21]/30">
              <h3 className="text-sm font-semibold text-[#54FFA4] uppercase tracking-wider mb-4">Requirements</h3>
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${gameSpecificDetails.length === 2 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4`}>
                {/* Game-specific details */}
                {gameSpecificDetails.map((detail, index) => {
                  const IconComponent = detail.icon || Target;
                  return (
                    <div key={index} className="bg-[#0F1B21] p-4 rounded-lg border-2 border-[#54FFA4]/30 hover:border-[#54FFA4]/50 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <IconComponent className="w-5 h-5 text-[#54FFA4]" />
                        <span className="text-sm text-gray-400">{detail.label}</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{detail.value}</div>
                    </div>
                  );
                })}
                
                {/* XP Reward - Always shown */}
                <div className="bg-[#0F1B21] p-4 rounded-lg border-2 border-[#54FFA4]/30 hover:border-[#54FFA4]/50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-[#54FFA4]" />
                    <span className="text-sm text-gray-400">XP Reward</span>
                  </div>
                  <div className="text-2xl font-bold text-white">+{calculateActualXP(challenge)}</div>
                </div>
              </div>
            </div>

            {attempts > 0 && (
              <div className="p-6 border-t-2 border-[#54FFA4]/20 bg-[#0F1B21]/30">
                <h3 className="text-sm font-semibold text-[#54FFA4] uppercase tracking-wider mb-4">Your Progress</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Attempts</div>
                    <div className="text-3xl font-bold text-white">{attempts}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">
                      {challenge.game === 'laundromat' || challenge.game === 'lockpick'
                        ? 'Most Levels'
                        : challenge.game === 'word-memory'
                        ? 'Most Words'
                        : challenge.game === 'chopping'
                        ? 'Most Letters'
                        : 'Best Score'}
                    </div>
                    <div className="text-3xl font-bold text-[#54FFA4]">
                      {(challenge.game === 'laundromat' || challenge.game === 'lockpick')
                        ? ((challenge.userProgress?.bestScore || 0) + 1).toLocaleString()
                        : (challenge.userProgress?.bestScore || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Spacer to push button to bottom */}
            <div className="flex-grow"></div>

            <div className="p-6 mt-auto">
              <Link 
                href={`/puzzles/${challenge.game}?challengeId=${challenge.id}&from=daily-challenge`}
                className="block w-full text-center px-6 py-4 bg-[#54FFA4] text-[#0F1B21] rounded-xl font-bold text-lg transition-all duration-200 hover:brightness-110 hover:shadow-lg hover:shadow-[#54FFA4]/20 hover:-translate-y-0.5"
              >
                {completed ? 'Play Again' : 'Start Challenge'}
              </Link>
            </div>
          </div>

          <div className="space-y-6 animate-fade-in-up-delay-2">
            
            {challenge.stats && (
              <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-sm font-semibold text-[#54FFA4] uppercase tracking-wider mb-4">Community Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">Players</span>
                    </div>
                    <span className="text-xl font-bold text-white">{challenge.stats.uniquePlayers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">Attempts</span>
                    </div>
                    <span className="text-xl font-bold text-white">{challenge.stats.totalAttempts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">Completions</span>
                    </div>
                    <span className="text-xl font-bold text-white">{challenge.stats.totalCompletions}</span>
                  </div>
                  <div className="pt-4 border-t-2 border-[#54FFA4]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-5 h-5 text-gray-400" />
                      <div className="text-sm text-gray-400">Success Rate</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 bg-[#0F1B21] rounded-full overflow-hidden border-2 border-[#54FFA4]/30">
                        <div 
                          className="h-full bg-gradient-to-r from-[#54FFA4] to-[#45e894] transition-all duration-500"
                          style={{ width: `${successRate}%` }}
                        ></div>
                      </div>
                      <span className="text-xl font-bold text-[#54FFA4]">{successRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-sm font-semibold text-[#54FFA4] uppercase tracking-wider mb-3">How It Works</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#54FFA4] mt-1">•</span>
                  <span>New challenge available daily at 00:00 UTC</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#54FFA4] mt-1">•</span>
                  <span>Complete within the time limit to earn XP</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#54FFA4] mt-1">•</span>
                  <span>Track your progress and compete globally</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#54FFA4] mt-1">•</span>
                  <span>You can attempt the challenge multiple times</span>
                </li>
              </ul>
            </div>
            
            {/* View History Button */}
            <Link
              href="/challenge-history"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1a2930] text-[#54FFA4] border-2 border-[#54FFA4]/30 rounded-lg font-semibold hover:border-[#54FFA4]/50 hover:bg-[#0F1B21] transition-colors shadow-lg"
            >
              <Clock className="w-5 h-5" />
              View Challenge History
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
