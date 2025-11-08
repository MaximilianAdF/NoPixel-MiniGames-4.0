'use client';

import { Trophy } from 'lucide-react';
import { STANDARD_PRESETS } from '../utils/gamePresets';

interface CompetitivePlayButtonProps {
  game: string;
  onClick: () => void;
  className?: string;
}

export default function CompetitivePlayButton({ 
  game, 
  onClick,
  className = '' 
}: CompetitivePlayButtonProps) {
  const preset = STANDARD_PRESETS[game];
  
  // Don't show button if game has no standard preset
  if (!preset) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className={`
        group
        flex items-center gap-2
        px-4 py-2
        bg-gradient-to-r from-yellow-500 to-amber-500
        hover:from-yellow-600 hover:to-amber-600
        text-yellow-950
        font-bold
        rounded-lg
        shadow-lg shadow-yellow-500/30
        hover:shadow-yellow-500/50
        transition-all
        border-2 border-yellow-400
        ${className}
      `}
    >
      <Trophy className="w-4 h-4 group-hover:scale-110 transition-transform" />
      <span>Play Competitively</span>
    </button>
  );
}
