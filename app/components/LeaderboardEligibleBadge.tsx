'use client';

import { useUser } from '../contexts/UserContext';
import { Trophy, CheckCircle } from 'lucide-react';
import { isStandardPreset, getPresetDescription } from '../utils/gamePresets';
import { useState, useEffect } from 'react';

interface LeaderboardEligibleBadgeProps {
  game: string;
  gameSettings: Record<string, any>;
  className?: string;
}

export default function LeaderboardEligibleBadge({ 
  game, 
  gameSettings,
  className = '' 
}: LeaderboardEligibleBadgeProps) {
  const { isLoggedIn } = useUser();
  const [isEligible, setIsEligible] = useState(false);

  useEffect(() => {
    setIsEligible(isStandardPreset(game, gameSettings));
  }, [game, gameSettings]);

  // Don't show if not logged in or not eligible
  if (!isLoggedIn || !isEligible) {
    return null;
  }

  const presetDesc = getPresetDescription(game);

  return (
    <div className={`
      fixed top-4 left-1/2 -translate-x-1/2 z-50
      bg-gradient-to-r from-yellow-500/90 to-amber-500/90
      backdrop-blur-sm
      border-2 border-yellow-400
      rounded-full
      px-4 py-2
      flex items-center gap-2
      shadow-lg shadow-yellow-500/20
      animate-fade-in
      ${className}
    `}>
      <Trophy className="w-4 h-4 text-yellow-900" />
      <span className="text-sm font-bold text-yellow-900">
        Leaderboard Mode
      </span>
      <CheckCircle className="w-4 h-4 text-yellow-900" />
    </div>
  );
}
