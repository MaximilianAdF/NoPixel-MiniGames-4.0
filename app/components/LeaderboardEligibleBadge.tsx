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
      fixed top-20 right-4 z-40
      bg-gradient-to-br from-yellow-500/20 to-amber-600/20
      backdrop-blur-sm
      border border-yellow-500/50
      rounded-lg
      px-3 py-1.5
      flex items-center gap-2
      shadow-md
      animate-fade-in
      ${className}
    `}>
      <Trophy className="w-3.5 h-3.5 text-yellow-400" />
      <span className="text-xs font-semibold text-yellow-300">
        Leaderboard Eligible
      </span>
    </div>
  );
}
