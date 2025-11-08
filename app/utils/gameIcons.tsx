import Icon from '@mdi/react';
import { mdiFuse, mdiWashingMachine } from '@mdi/js';
import { Blocks, Brain, Key, Wrench, Keyboard, Fingerprint } from 'lucide-react';

export type GameType = 'thermite' | 'lockpick' | 'pincracker' | 'laundromat' | 'roof-running' | 'repair-kit' | 'word-memory' | 'chopping';

interface GameConfig {
  name: string;
  iconType: 'mdi' | 'lucide' | 'fa';
  iconPath?: string; // For MDI icons
  IconComponent?: any; // For Lucide icons
  faClass?: string; // For Font Awesome icons
  color: string;
  gradientFrom: string;
  gradientTo: string;
  tailwindGradient: string;
}

export const gameConfigs: Record<GameType, GameConfig> = {
  thermite: {
    name: 'Thermite',
    iconType: 'mdi',
    iconPath: mdiFuse,
    color: 'text-orange-400',
    gradientFrom: '#FF6B35',
    gradientTo: '#F7931E',
    tailwindGradient: 'from-orange-500 to-red-600',
  },
  'roof-running': {
    name: 'Roof Running',
    iconType: 'lucide',
    IconComponent: Blocks,
    color: 'text-purple-400',
    gradientFrom: '#9C27B0',
    gradientTo: '#BA68C8',
    tailwindGradient: 'from-purple-500 to-pink-500',
  },
  laundromat: {
    name: 'Laundromat',
    iconType: 'mdi',
    iconPath: mdiWashingMachine,
    color: 'text-cyan-400',
    gradientFrom: '#00BCD4',
    gradientTo: '#26C6DA',
    tailwindGradient: 'from-cyan-500 to-blue-400',
  },
  lockpick: {
    name: 'Lockpick',
    iconType: 'lucide',
    IconComponent: Key,
    color: 'text-yellow-400',
    gradientFrom: '#FFC107',
    gradientTo: '#FFD54F',
    tailwindGradient: 'from-yellow-500 to-orange-500',
  },
  'repair-kit': {
    name: 'Repair Kit',
    iconType: 'lucide',
    IconComponent: Wrench,
    color: 'text-red-400',
    gradientFrom: '#F44336',
    gradientTo: '#EF5350',
    tailwindGradient: 'from-red-500 to-pink-500',
  },
  'word-memory': {
    name: 'Word Memory',
    iconType: 'lucide',
    IconComponent: Brain,
    color: 'text-pink-400',
    gradientFrom: '#E91E63',
    gradientTo: '#F06292',
    tailwindGradient: 'from-pink-500 to-rose-500',
  },
  chopping: {
    name: 'Chopping',
    iconType: 'lucide',
    IconComponent: Keyboard,
    color: 'text-green-400',
    gradientFrom: '#4CAF50',
    gradientTo: '#66BB6A',
    tailwindGradient: 'from-green-500 to-emerald-500',
  },
  pincracker: {
    name: 'Pin Cracker',
    iconType: 'lucide',
    IconComponent: Fingerprint,
    color: 'text-blue-400',
    gradientFrom: '#2196F3',
    gradientTo: '#42A5F5',
    tailwindGradient: 'from-blue-500 to-cyan-500',
  },
};

// Helper function to get game icon
export const getGameIcon = (game: string, size: 'sm' | 'md' | 'lg' | 'xl' = 'md') => {
  const config = gameConfigs[game as GameType];
  if (!config) return null;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  };

  const sizeMap = {
    sm: 0.75,
    md: 1,
    lg: 1.25,
    xl: 1.5
  };

  // Render based on icon type
  if (config.iconType === 'mdi' && config.iconPath) {
    return <Icon path={config.iconPath} size={sizeMap[size]} />;
  }

  if (config.iconType === 'lucide' && config.IconComponent) {
    const LucideIcon = config.IconComponent;
    return <LucideIcon className={sizeClasses[size]} />;
  }

  if (config.iconType === 'fa' && config.faClass) {
    // Font Awesome icons with proper sizing
    const faSizeClass = {
      sm: 'fa-sm',
      md: 'fa-lg',
      lg: 'fa-xl',
      xl: 'fa-2xl'
    };
    return <i className={`${config.faClass} ${faSizeClass[size]}`}></i>;
  }

  return null;
};

// Helper to get game name
export const getGameName = (game: string): string => {
  return gameConfigs[game as GameType]?.name || game;
};

// Helper to get game color
export const getGameColor = (game: string): string => {
  return gameConfigs[game as GameType]?.color || 'text-[#54FFA4]';
};

// Helper to get game gradient (hex colors)
export const getGameGradient = (game: string): { from: string; to: string } => {
  const config = gameConfigs[game as GameType];
  return config ? { from: config.gradientFrom, to: config.gradientTo } : { from: '#54FFA4', to: '#45e894' };
};

// Helper to get Tailwind gradient classes
export const getGameTailwindGradient = (game: string): string => {
  return gameConfigs[game as GameType]?.tailwindGradient || 'from-[#54FFA4] to-[#45e894]';
};
