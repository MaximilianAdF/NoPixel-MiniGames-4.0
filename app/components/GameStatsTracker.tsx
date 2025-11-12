'use client';

import { useEffect, useRef, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Zap, Trophy, Flame } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { trackGameEvent } from '../utils/analytics';
import { trackGameComplete } from '../utils/gtm';
import { isStandardPreset } from '../utils/gamePresets';

interface GameStatsTrackerProps {
  game: string;
  gameStatus: number; // 0 = not started, 1 = playing, 2 = won/lost (depends on wonStatus), 3 = won/lost, 4 = reset
  score: number;
  elapsedMs: number;
  targetScore?: number;
  wonStatus?: number; // Which status number means won (default: 2)
  lostStatus?: number; // Which status number means lost (default: 3)
  gameSettings?: Record<string, any>; // Current game difficulty settings
}

interface StatsResponse {
  success: boolean;
  xpEarned: number;
  leveledUp: boolean;
  newLevel?: number;
  stats: {
    bestScore: number;
    averageScore: number;
    gamesPlayed: number;
  };
}

export default function GameStatsTracker({
  game,
  gameStatus,
  score,
  elapsedMs,
  targetScore,
  wonStatus = 2,
  lostStatus = 3,
  gameSettings,
}: GameStatsTrackerProps) {
  const { user, isLoggedIn, refreshSession, refreshDailyChallengeStatus, dailyChallengeStatus } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const challengeId = searchParams?.get('challengeId');
  const [showXPNotification, setShowXPNotification] = useState(false);
  const [showLevelUpNotification, setShowLevelUpNotification] = useState(false);
  const [showChallengeCompleteDialog, setShowChallengeCompleteDialog] = useState(false);
  const [challengeCompleteData, setChallengeCompleteData] = useState<any>(null);
  const [xpEarned, setXPEarned] = useState(0);
  const [newLevel, setNewLevel] = useState(0);
  const lastSavedGame = useRef<string>('');
  
  // Check if user has already completed today's challenge
  const alreadyCompletedChallenge = challengeId && dailyChallengeStatus?.challengeId === challengeId && dailyChallengeStatus?.completed;

  useEffect(() => {
    // Only process when game ends (won or lost)
    if (gameStatus !== wonStatus && gameStatus !== lostStatus) {
      return;
    }

    const won = gameStatus === wonStatus;
    
    // Create a unique identifier for this game completion
    const gameId = `${game}-${Date.now()}-${score}`;
    
    // Prevent duplicate tracking
    if (lastSavedGame.current === gameId) {
      return;
    }

    lastSavedGame.current = gameId;
    
    // Track game completion in GA4 (always, regardless of login status)
    trackGameComplete({
      game_name: game,
      result: won ? 'win' : 'loss',
      score: score,
      time: elapsedMs / 1000, // Convert to seconds
      is_standard_preset: isStandardPreset(game, gameSettings || {}),
      is_logged_in: isLoggedIn,
    });
    
    // Track analytics event
    trackGameEvent({
      game,
      event: won ? 'complete' : 'fail',
      score,
      timeMs: elapsedMs,
      userId: user?.id,
    });
    
    // Save stats only if logged in
    if (isLoggedIn) {
      saveGameStats(won);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStatus, isLoggedIn, wonStatus, lostStatus]);

  const saveGameStats = async (won: boolean) => {
    try {
      // If this is a daily challenge
      if (challengeId) {
        // If already completed, don't save stats or give rewards
        if (alreadyCompletedChallenge) {
          console.log('Challenge already completed - no rewards given');
          return; // Just return, let user keep playing without rewards
        }
        
        // Submit challenge completion attempt
        const challengeResponse = await fetch('/api/challenges/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            challengeId,
            score,
            timeMs: elapsedMs,
            mistakes: 0,
          }),
        });

        if (challengeResponse.ok) {
          const data = await challengeResponse.json();
          console.log('Daily challenge attempt submitted:', data);
          
          // Refresh user session to update level, XP, and streak in the UI
          await refreshSession();
          
          // Refresh daily challenge status to update completion state
          await refreshDailyChallengeStatus();
          
          // If challenge was just completed for the first time (earned XP)
          if (data.completed && data.xpEarned && data.xpEarned > 0) {
            // Store the challenge completion data
            setChallengeCompleteData(data);
            
            // Show the completion dialog
            setShowChallengeCompleteDialog(true);
            
            // Don't redirect immediately - let user see the dialog
            // Dialog will have a button to go back to challenge page
          }
        }
        return; // Don't save regular stats for daily challenges
      }

      // Save regular game stats (only when NOT a daily challenge)
      const response = await fetch('/api/stats/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          game,
          score,
          timePlayedMs: elapsedMs,
          won,
          targetScore,
          mistakes: 0, // Games can track this if needed
          gameSettings, // Pass difficulty settings for XP calculation
        }),
      });

      if (response.ok) {
        const data: StatsResponse = await response.json();
        
        // Refresh user session to update level and XP in the UI
        await refreshSession();
        
        // Show XP notification
        setXPEarned(data.xpEarned);
        setShowXPNotification(true);
        setTimeout(() => setShowXPNotification(false), 3000);

        // Show level up notification if applicable
        if (data.leveledUp && data.newLevel) {
          setNewLevel(data.newLevel);
          setShowLevelUpNotification(true);
          // Don't auto-dismiss - let user click to dismiss
        }
      }
    } catch (error) {
      console.error('Failed to save game stats:', error);
    }
  };

  const dismissLevelUp = () => {
    setShowLevelUpNotification(false);
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      {/* Challenge Complete Dialog - Stops game interaction */}
      {showChallengeCompleteDialog && challengeCompleteData && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center animate-fade-in"
          onClick={(e) => {
            // Prevent clicks from reaching the game behind
            e.stopPropagation();
          }}
        >
          <div 
            className="bg-gradient-to-br from-[#0F1B21] to-[#1a2930] border-4 border-[#54FFA4] rounded-2xl p-8 shadow-2xl text-center min-w-[350px] max-w-[500px] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <Trophy className="w-16 h-16 mx-auto text-yellow-400 animate-bounce" />
            </div>
            <div className="text-[#54FFA4] text-3xl font-bold mb-2">CHALLENGE COMPLETE!</div>
            <div className="text-white text-xl mb-6">Daily Challenge Conquered!</div>
            
            <div className="bg-[#0F1B21]/50 rounded-lg p-6 mb-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">XP Earned:</span>
                <span className="text-[#54FFA4] text-2xl font-bold">+{challengeCompleteData.xpEarned} XP</span>
              </div>
              
              {challengeCompleteData.streakUpdated && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Daily Streak:</span>
                  <span className="text-yellow-400 text-xl font-bold flex items-center justify-end gap-2">
                    {challengeCompleteData.newStreak}
                    <Flame className="w-5 h-5 text-orange-500" />
                  </span>
                </div>
              )}
              
              {challengeCompleteData.leveledUp && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">New Level:</span>
                  <span className="text-[#54FFA4] text-xl font-bold flex items-center justify-end gap-2">
                    {challengeCompleteData.newLevel}
                    <Zap className="w-5 h-5 text-[#54FFA4]" />
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">
                  {game === 'laundromat' || game === 'lockpick'
                    ? 'Levels Completed:'
                    : game === 'thermite'
                    ? 'Score:'
                    : game === 'word-memory'
                    ? 'Words Remembered:'
                    : game === 'roof-running'
                    ? 'Score:'
                    : game === 'pincracker'
                    ? 'Score:'
                    : game === 'chopping'
                    ? 'Trees Chopped:'
                    : 'Your Score:'}
                </span>
                <span className="text-white text-lg font-semibold">
                  {(game === 'laundromat' || game === 'lockpick') 
                    ? challengeCompleteData.bestScore + 1  // Add 1 for 0-indexed levels
                    : challengeCompleteData.bestScore
                  }
                </span>
              </div>
            </div>
            
            <button
              onClick={() => {
                setShowChallengeCompleteDialog(false);
                router.push('/daily-challenge');
              }}
              className="w-full bg-gradient-to-r from-[#54FFA4] to-[#45e894] text-[#0F1B21] font-bold py-3 px-6 rounded-lg hover:from-[#45e894] hover:to-[#54FFA4] transition-all duration-300 transform hover:scale-105"
            >
              Back to Daily Challenges
            </button>
          </div>
        </div>
      )}

      {/* XP Earned Notification */}
      {showXPNotification && xpEarned > 0 && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <div className="bg-gradient-to-r from-[#54FFA4]/90 to-[#45e894]/90 backdrop-blur-sm text-[#0F1B21] px-6 py-3 rounded-lg shadow-2xl border-2 border-[#54FFA4] flex items-center gap-3">
            <Zap className="w-5 h-5" />
            <div>
              <div className="font-bold">+{xpEarned} XP</div>
              <div className="text-xs opacity-80">Keep it up!</div>
            </div>
          </div>
        </div>
      )}

      {/* Level Up Notification */}
      {showLevelUpNotification && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in"
          onClick={dismissLevelUp}
        >
          <div 
            className="bg-gradient-to-br from-[#0F1B21] to-[#1a2930] border-4 border-[#54FFA4] rounded-2xl p-8 shadow-2xl text-center min-w-[300px] animate-scale-in cursor-pointer hover:scale-105 transition-transform"
            onClick={dismissLevelUp}
          >
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <div className="text-[#54FFA4] text-2xl font-bold mb-2">LEVEL UP!</div>
            <div className="text-white text-4xl font-bold mb-2">Level {newLevel}</div>
            <div className="text-gray-400 mb-4">You&apos;re getting better!</div>
            <div className="text-gray-500 text-sm">Click anywhere to dismiss</div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </>
  );
}
