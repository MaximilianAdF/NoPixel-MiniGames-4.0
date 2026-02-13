'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Zap, ArrowRight, Loader2, Clock, Target, Trophy } from 'lucide-react';
import { getGameIcon, getGameName } from '../utils/gameIcons';
import { useUser } from '../contexts/UserContext';

interface DailyChallenge {
  id: string;
  game: string;
  targetScore: number;
  targetTime: number;
  xpReward: number;
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
}

export default function DailyChallengeHero() {
  const { dailyChallengeStatus, isLoggedIn } = useUser();
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeUntilNext, setTimeUntilNext] = useState({ hours: '00', minutes: '00', seconds: '00' });

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

  // Helper to get the primary details
  const getChallengeDetails = () => {
    if (!challenge) return [];
    
    const details: { label: string; value: string; icon: any }[] = [];
    
    let mainDetail = '';
    switch (challenge.game) {
      case 'thermite':
      case 'roof-running':
        mainDetail = `${challenge.rows}×${challenge.columns}`;
        details.push({ label: 'GRID', value: mainDetail, icon: Target });
        break;
      case 'laundromat':
      case 'lockpick':
        details.push({ label: 'LEVELS', value: challenge.levels?.toString() || '0', icon: Target });
        break;
      case 'word-memory':
        details.push({ label: 'WORDS', value: challenge.words?.toString() || '0', icon: Target });
        break;
      case 'pincracker':
        details.push({ label: 'PIN', value: `${challenge.pinLength} Digits`, icon: Target });
        break;
      case 'chopping':
        details.push({ label: 'CHOP', value: `${challenge.numLetters}`, icon: Target });
        break;
      default:
        details.push({ label: 'TARGET', value: challenge.targetScore.toString(), icon: Trophy });
    }
    
    details.push({ 
      label: 'TIME', 
      value: `${Math.floor(challenge.targetTime / 1000)}s`, 
      icon: Clock 
    });

    details.push({ 
      label: 'REWARD', 
      value: `+${challenge.xpReward} XP`, 
      icon: Zap 
    });
    
    return details;
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto h-32 bg-mirage-900/40 rounded-lg border border-spring-green-500/10 animate-pulse flex items-center justify-center mb-12">
        <Loader2 className="w-6 h-6 text-spring-green-400 animate-spin" />
      </div>
    );
  }

  if (!challenge || (isLoggedIn && dailyChallengeStatus?.completed)) {
    return null;
  }

  const details = getChallengeDetails();

  return (
    <div className="w-full max-w-4xl mx-auto mb-12 animate-fade-in-up group">
      <Link 
        href={`/puzzles/${challenge.game}?challengeId=${challenge.id}&from=hero`}
        className="block relative overflow-hidden rounded-lg bg-gradient-to-br from-mirage-900/60 via-mirage-900/40 to-mirage-800/60 border border-spring-green-500/30 hover:border-spring-green-400/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-spring-green-500/10"
      >
        {/* Technical Corner Brackets */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-spring-green-500/40 group-hover:border-spring-green-400/80 transition-colors duration-300" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-spring-green-500/40 group-hover:border-spring-green-400/80 transition-colors duration-300" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-spring-green-500/40 group-hover:border-spring-green-400/80 transition-colors duration-300" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-spring-green-500/40 group-hover:border-spring-green-400/80 transition-colors duration-300" />

        {/* Top Technical Bar */}
        <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-spring-green-500/30 to-transparent group-hover:via-spring-green-400/50 transition-colors duration-300" />
        
        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6 flex-1 min-w-0">
            {/* Holographic Icon Container */}
            <div className="relative shrink-0 w-20 h-20 flex items-center justify-center bg-mirage-950/50 rounded-xl border border-spring-green-500/20 text-spring-green-400 group-hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-spring-green-500/5 blur-xl rounded-full group-hover:bg-spring-green-500/10 transition-colors" />
              {getGameIcon(challenge.game, 'xl')}
            </div>

            <div className="flex flex-col gap-2 min-w-0 w-full">
              <div className="flex items-center gap-3">
                <span className="bg-spring-green-500 text-mirage-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">
                  PRIORITY TARGET
                </span>
                <span className="text-spring-green-400/60 font-mono text-[10px] tracking-widest hidden sm:block">
                  SYS_RECOVERY_IN_PROGRESS
                </span>
                <div className="flex-1" />
                <div className="flex items-center gap-2 text-xs font-mono text-spring-green-400">
                  <Clock className="w-3 h-3 animate-pulse" />
                  <span>{timeUntilNext.hours}:{timeUntilNext.minutes}:{timeUntilNext.seconds}</span>
                </div>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-none tracking-tight truncate group-hover:text-spring-green-300 transition-colors flex items-center gap-3">
                <span className="text-spring-green-500 font-mono opacity-50">#</span>
                {getGameName(challenge.game).toUpperCase()}
              </h2>

              <div className="flex flex-wrap items-center gap-4 mt-2">
                {details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-500 font-mono uppercase">{detail.label}</span>
                    <span className="text-sm font-mono text-white font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-4 shrink-0">
            {/* Stats Module */}
            {challenge.stats && (
              <div className="grid grid-cols-3 gap-4 p-3 bg-mirage-950/40 rounded-lg border border-white/5 font-mono text-right min-w-[240px]">
                <div>
                  <div className="text-[9px] text-gray-500 uppercase">Users</div>
                  <div className="text-sm text-white font-bold">{challenge.stats.uniquePlayers}</div>
                </div>
                <div>
                  <div className="text-[9px] text-gray-500 uppercase">Tries</div>
                  <div className="text-sm text-white font-bold">{challenge.stats.totalAttempts}</div>
                </div>
                <div>
                  <div className="text-[9px] text-spring-green-500 uppercase">Wins</div>
                  <div className="text-sm text-spring-green-400 font-bold">{challenge.stats.totalCompletions}</div>
                </div>
              </div>
            )}

            {/* Launch Action */}
            <div className="flex items-center gap-4 group/btn w-full md:w-auto">
              <span className="hidden lg:block text-xs font-bold text-spring-green-400 animate-pulse tracking-tighter uppercase">
                Initialize Hack sequence
              </span>
              <div className="relative flex-1 md:flex-none h-12 px-8 bg-spring-green-500 text-mirage-950 rounded font-black flex items-center justify-center gap-2 group-hover:bg-spring-green-400 transition-colors shadow-[0_0_20px_rgba(9,222,110,0.3)]">
                LAUNCH
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-spring-green-500/20 to-transparent" />
      </Link>
    </div>
  );
}