'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from '../utils/useMediaQuery';
import { useUser } from '../contexts/UserContext';
import { useKeyboardShortcuts } from '../contexts/KeyboardShortcutsContext';
import { gameConfigs, getGameIcon, GameType } from '../utils/gameIcons';
import {
  X,
  Home,
  Trophy,
  HelpCircle,
  Info,
  Code,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Menu,
  Volume2,
  VolumeX,
  Gamepad2,
  Settings,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  FileText,
  Shield,
} from 'lucide-react';

export default function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [minigamesExpanded, setMinigamesExpanded] = useState(false);
  const { user } = useUser();
  const { registerHandler, unregisterHandler } = useKeyboardShortcuts();
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  
  // Volume state - initialized to 100 for both server and client initially
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(100);
  const [hasLoadedUserPrefs, setHasLoadedUserPrefs] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Daily Challenge state
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState({ hours: '00', minutes: '00' });
  
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Mark as client-side after mount to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
    
    // Load from localStorage on client
    const savedVolume = localStorage.getItem('gameVolume');
    const savedMuted = localStorage.getItem('gameMuted');
    const savedPrevVolume = localStorage.getItem('gamePreviousVolume');
    
    if (savedVolume) setVolume(parseInt(savedVolume));
    if (savedMuted) setIsMuted(savedMuted === 'true');
    if (savedPrevVolume) setPreviousVolume(parseInt(savedPrevVolume));
  }, []);

  // Sync with user preferences from database when user logs in (only once)
  useEffect(() => {
    if (user && !hasLoadedUserPrefs && isClient) {
      // Check if user has a saved preference in the database
      if (user.preferences?.volume !== undefined) {
        const dbVolume = user.preferences.volume;
        const localVolume = localStorage.getItem('gameVolume');
        
        // Only use DB value if localStorage doesn't have a value
        // This prevents overwriting recent localStorage changes
        if (!localVolume) {
          setVolume(dbVolume);
          localStorage.setItem('gameVolume', dbVolume.toString());
        }
        // If localStorage has a different value, that takes precedence
        // (user may have adjusted it before login completed)
      }
      
      // Mark as loaded to allow future saves
      setHasLoadedUserPrefs(true);
    }
  }, [user, hasLoadedUserPrefs, isClient]);

  // Fetch daily challenge status
  useEffect(() => {
    const fetchChallengeStatus = async () => {
      try {
        const response = await fetch('/api/challenges/today');
        if (response.ok) {
          const data = await response.json();
          setChallengeCompleted(data?.userProgress?.completed || false);
        }
      } catch (error) {
        // Silently fail - not critical for nav menu
      }
    };

    if (user) {
      fetchChallengeStatus();
    }
  }, [user]);

  // Update countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setUTCHours(24, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeUntilNext({
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0')
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Register keyboard shortcuts for navigation menu
  useEffect(() => {
    // Register handler to toggle navigation menu
    registerHandler('openNav', () => {
      setIsOpen(prev => {
        const newState = !prev;
        // Focus first link when opening
        if (newState) {
          setTimeout(() => firstLinkRef.current?.focus(), 100);
        }
        return newState;
      });
      if (isOpen) {
        setMinigamesExpanded(false);
      }
    });

    // Register handler to close menu
    registerHandler('closeMenu', () => {
      if (isOpen) {
        setIsOpen(false);
        setMinigamesExpanded(false);
      }
    });

    // Cleanup
    return () => {
      unregisterHandler('openNav');
      unregisterHandler('closeMenu');
    };
  }, [isOpen, registerHandler, unregisterHandler]);

  // Focus first link when menu opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstLinkRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // ESC key to close navbar (now handled by keyboard shortcuts context)
  // Keeping this for backward compatibility but shortcuts will handle it
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setMinigamesExpanded(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Update localStorage and database whenever volume changes (with debouncing for API calls)
  useEffect(() => {
    // Skip if not on client yet
    if (!isClient) return;
    
    // Skip if we're still loading user preferences
    if (!hasLoadedUserPrefs && user?.preferences?.volume !== undefined) {
      return;
    }
    
    // Always update localStorage immediately for instant feedback
    localStorage.setItem('gameVolume', volume.toString());
    localStorage.setItem('gameMuted', isMuted.toString());
    localStorage.setItem('gamePreviousVolume', previousVolume.toString());
    
    // Dispatch custom event so games can listen for volume changes
    window.dispatchEvent(new CustomEvent('volumeChange', { 
      detail: { volume: isMuted ? 0 : volume / 100 } 
    }));

    // Debounce database save: only save after user stops adjusting for 2 seconds
    if (user && hasLoadedUserPrefs) {
      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Set new timeout to save after 2 seconds of no changes (reduced API calls)
      saveTimeoutRef.current = setTimeout(() => {
        fetch('/api/user/preferences', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ volume }),
        }).catch(err => console.error('Failed to save volume preference:', err));
      }, 2000);
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [volume, isMuted, previousVolume, user, hasLoadedUserPrefs, isClient]);

  // Handle mute/unmute toggle
  const toggleMute = () => {
    if (isMuted) {
      // Unmuting - restore previous volume
      setVolume(previousVolume);
      setIsMuted(false);
    } else {
      // Muting - save current volume and set to 0
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const minigames = [
    { name: gameConfigs.thermite.name, path: '/puzzles/thermite', gameKey: 'thermite' as GameType, color: gameConfigs.thermite.color },
    { name: gameConfigs['roof-running'].name, path: '/puzzles/roof-running', gameKey: 'roof-running' as GameType, color: gameConfigs['roof-running'].color },
    { name: gameConfigs.laundromat.name, path: '/puzzles/laundromat', gameKey: 'laundromat' as GameType, color: gameConfigs.laundromat.color },
    { name: gameConfigs.lockpick.name, path: '/puzzles/lockpick', gameKey: 'lockpick' as GameType, color: gameConfigs.lockpick.color },
    { name: gameConfigs['repair-kit'].name, path: '/puzzles/repair-kit', gameKey: 'repair-kit' as GameType, color: gameConfigs['repair-kit'].color },
    { name: gameConfigs['word-memory'].name, path: '/puzzles/word-memory', gameKey: 'word-memory' as GameType, color: gameConfigs['word-memory'].color },
    { name: gameConfigs.chopping.name, path: '/puzzles/chopping', gameKey: 'chopping' as GameType, color: gameConfigs.chopping.color },
    { name: gameConfigs.pincracker.name, path: '/puzzles/pincracker', gameKey: 'pincracker' as GameType, color: gameConfigs.pincracker.color },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
    setMinigamesExpanded(false);
  };

  return (
    <>
      {/* Toggle Button - Hidden when menu is open on mobile */}
      {isMobile ? (
        // Mobile: Hamburger in top-left
        !isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="fixed top-4 left-4 z-[60] p-2 rounded-lg bg-gradient-to-br from-[#0F1B21] to-[#1a2930] border-2 border-[#54FFA4]/30 hover:border-[#54FFA4] transition-all duration-300 shadow-lg"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6 text-[#54FFA4]" />
          </button>
        )
      ) : (
        // Desktop: Hamburger button on left side
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            fixed top-1/2 -translate-y-1/2 left-0
            w-12 h-24
            bg-gradient-to-br from-[#0F1B21] to-[#1a2930]
            border-2 border-[#54FFA4]/30
            rounded-r-lg
            flex items-center justify-center
            hover:border-[#54FFA4]/60
            transition-all duration-300
            z-30
            group
          `}
          aria-label={isOpen ? "Hide navigation" : "Show navigation"}
        >
          {isOpen ? (
            <ChevronLeft className="w-6 h-6 text-[#54FFA4] group-hover:scale-110 transition-transform" />
          ) : (
            <Menu className="w-6 h-6 text-[#54FFA4] group-hover:scale-110 transition-transform" />
          )}
        </button>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Panel */}
      <div
        className={`fixed top-0 left-0 h-full ${isMobile ? 'w-full' : 'w-80'} bg-gradient-to-br from-[#0F1B21]/95 to-[#1a2930]/95 backdrop-blur-sm ${isMobile ? '' : 'border-r-2 border-[#54FFA4]/30'} z-[56] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        {/* Header - Fixed at top */}
        <div className="flex-shrink-0 p-6 border-b-2 border-[#54FFA4]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-[#54FFA4]">NP</div>
              <div className="text-white font-semibold">NoPixel 4.0</div>
            </div>
            {/* Close button for mobile */}
            {isMobile && (
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-[#1a2930] transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="w-6 h-6 text-[#54FFA4]" />
              </button>
            )}
          </div>
          <div className="text-sm text-gray-400 mt-1">Practice Simulator</div>
        </div>

        {/* Navigation Links - Scrollable */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {/* Main Section */}
          <div className="space-y-1">
            {/* Home */}
            <Link
              ref={firstLinkRef}
              href="/"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                pathname === '/'
                  ? 'bg-[#54FFA4]/20 text-[#54FFA4] border border-[#54FFA4]/50'
                  : 'text-gray-300 hover:bg-[#1a2930] hover:text-white'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </Link>

            {/* Leaderboards */}
            <Link
              href="/leaderboards"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                pathname === '/leaderboards'
                  ? 'bg-[#54FFA4]/20 text-[#54FFA4] border border-[#54FFA4]/50'
                  : 'text-gray-300 hover:bg-[#1a2930] hover:text-white'
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span className="font-medium">Leaderboards</span>
            </Link>

            {/* Daily Challenge */}
            <Link
              href="/daily-challenge"
              onClick={handleLinkClick}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                pathname === '/daily-challenge'
                  ? 'bg-[#54FFA4]/20 text-[#54FFA4] border border-[#54FFA4]/50'
                  : 'text-gray-300 hover:bg-[#1a2930] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {challengeCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : (
                  <Calendar className="w-5 h-5" />
                )}
                <span className="font-medium">Daily Challenge</span>
              </div>
              {!challengeCompleted && user && (
                <div className="flex items-center gap-1 text-xs font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{timeUntilNext.hours}h {timeUntilNext.minutes}m</span>
                </div>
              )}
            </Link>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#54FFA4]/20 my-4" />

          {/* Games Section */}
          <div className="space-y-1">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Games
            </div>
            
            {/* Minigames - Collapsible */}
            <div>
              <button
                onClick={() => setMinigamesExpanded(!minigamesExpanded)}
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-[#1a2930] hover:text-white transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <Gamepad2 className="w-5 h-5" />
                  <span className="font-medium">All Games</span>
                </div>
                {minigamesExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {/* Submenu */}
              {minigamesExpanded && (
                <div className="ml-4 mt-1 space-y-1">
                  {minigames.map((game) => {
                    return (
                      <Link
                        key={game.path}
                        href={game.path}
                        onClick={handleLinkClick}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                          pathname === game.path
                            ? 'bg-[#54FFA4]/20 text-[#54FFA4]'
                            : 'text-gray-400 hover:bg-[#1a2930] hover:text-white'
                        }`}
                      >
                        <span className="flex items-center justify-center w-5 h-5">
                          {getGameIcon(game.gameKey, 'sm')}
                        </span>
                        <span>{game.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#54FFA4]/20 my-4" />

          {/* Info Section */}
          <div className="space-y-1">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Information
            </div>

            {/* FAQ */}
            <Link
              href="/faq"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                pathname === '/faq'
                  ? 'bg-[#54FFA4]/20 text-[#54FFA4] border border-[#54FFA4]/50'
                  : 'text-gray-300 hover:bg-[#1a2930] hover:text-white'
              }`}
            >
              <HelpCircle className="w-5 h-5" />
              <span className="font-medium">FAQ</span>
            </Link>

            {/* About */}
            <Link
              href="/about"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                pathname === '/about'
                  ? 'bg-[#54FFA4]/20 text-[#54FFA4] border border-[#54FFA4]/50'
                  : 'text-gray-300 hover:bg-[#1a2930] hover:text-white'
              }`}
            >
              <Info className="w-5 h-5" />
              <span className="font-medium">About</span>
            </Link>

            {/* Open Source */}
            <Link
              href="/open-source"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                pathname === '/open-source'
                  ? 'bg-[#54FFA4]/20 text-[#54FFA4] border border-[#54FFA4]/50'
                  : 'text-gray-300 hover:bg-[#1a2930] hover:text-white'
              }`}
            >
              <Code className="w-5 h-5" />
              <span className="font-medium">Open Source</span>
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                pathname === '/contact'
                  ? 'bg-[#54FFA4]/20 text-[#54FFA4] border border-[#54FFA4]/50'
                  : 'text-gray-300 hover:bg-[#1a2930] hover:text-white'
              }`}
            >
              <Mail className="w-5 h-5" />
              <span className="font-medium">Contact</span>
            </Link>
          </div>

          {/* Legal Section */}
          <div className="space-y-1">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Legal
            </div>

            {/* Privacy Policy */}
            <Link
              href="/privacy"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                pathname === '/privacy'
                  ? 'bg-[#54FFA4]/20 text-[#54FFA4] border border-[#54FFA4]/50'
                  : 'text-gray-300 hover:bg-[#1a2930] hover:text-white'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="font-medium">Privacy Policy</span>
            </Link>

            {/* Terms of Service */}
            <Link
              href="/terms"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                pathname === '/terms'
                  ? 'bg-[#54FFA4]/20 text-[#54FFA4] border border-[#54FFA4]/50'
                  : 'text-gray-300 hover:bg-[#1a2930] hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">Terms of Service</span>
            </Link>
          </div>
          </nav>

          {/* Audio Controls Section - Fixed at bottom */}
          <div className="flex-shrink-0 border-t-2 border-[#54FFA4]/30 bg-gradient-to-br from-[#0F1B21] to-[#1a2930]">
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2" suppressHydrationWarning>
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-red-400" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-[#54FFA4]" />
                  )}
                  <span className="text-sm font-medium text-white">Audio</span>
                </div>
                <button
                  onClick={toggleMute}
                  className="px-3 py-1.5 rounded-lg bg-[#1a2930] hover:bg-[#54FFA4]/20 text-white text-sm transition-colors border border-[#54FFA4]/30"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  suppressHydrationWarning
                >
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => {
                    const newVolume = parseInt(e.target.value);
                    setVolume(newVolume);
                    // Update mute state based on slider position
                    if (newVolume === 0 && !isMuted) {
                      setPreviousVolume(volume); // Save current before going to 0
                      setIsMuted(true);
                    } else if (newVolume > 0 && isMuted) {
                      setIsMuted(false);
                    }
                    // Update CSS variable for gradient
                    e.currentTarget.style.setProperty('--slider-value', `${newVolume}%`);
                  }}
                  className="flex-1 h-2 rounded-lg appearance-none cursor-pointer slider-track"
                  style={{ '--slider-value': `${volume}%` } as React.CSSProperties}
                />
                <span className="text-sm font-mono text-[#54FFA4] w-12 text-right" suppressHydrationWarning>
                  {volume}%
                </span>
              </div>
            </div>
          </div>
      </div>
    </>
  );
}
