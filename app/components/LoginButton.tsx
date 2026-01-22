'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { User, LogOut, Settings, ChevronDown, Flame, Zap, Trophy, Link as LinkIcon } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useGuide } from '../contexts/GuideContext';
import { useMediaQuery } from '../utils/useMediaQuery';
import { useKeyboardShortcuts } from '../contexts/KeyboardShortcutsContext';
import { trackLoginAttempt } from '../utils/gtm';

// Discord logo as SVG component
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

export default function LoginButton() {
  const { user, isLoggedIn, isLoading, login, logout } = useUser();
  const { isOpen: guideIsOpen, width: guideWidth } = useGuide();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { registerHandler, unregisterHandler } = useKeyboardShortcuts();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  // Check if user is a guest (has no discordId)
  const isGuest = isLoggedIn && user && !user.discordId;
  
  // Refs for keyboard shortcuts and focus management
  const dropdownOpenRef = useRef(dropdownOpen);
  const firstDropdownItemRef = useRef<HTMLAnchorElement>(null);
  
  useEffect(() => {
    dropdownOpenRef.current = dropdownOpen;
  }, [dropdownOpen]);

  // Track mount state to prevent flash
  useEffect(() => {
    // Mount immediately to prevent CLS
    setMounted(true);
  }, []);

  // Check if current page has a guide (puzzle pages only)
  const isPuzzlePage = pathname?.startsWith('/puzzles/');
  
  // Calculate right position based on guide state AND page type
  // Only adjust position if guide is open AND we're on a puzzle page
  const rightPosition = !isMobile && guideIsOpen && isPuzzlePage ? `${guideWidth + 16}px` : '16px';

  // Register keyboard shortcuts for profile dropdown
  useEffect(() => {
    if (isLoggedIn) {
      // Register toggle handler (P key)
      registerHandler('toggleProfile', () => {
        setDropdownOpen(prev => {
          const newState = !prev;
          // Focus first dropdown item when opening
          if (newState) {
            setTimeout(() => firstDropdownItemRef.current?.focus(), 100);
          }
          return newState;
        });
      });

      // Register close handler (ESC key)
      registerHandler('closeMenu', () => {
        setDropdownOpen(false);
      });

      return () => {
        unregisterHandler('toggleProfile');
        unregisterHandler('closeMenu');
      };
    }
  }, [isLoggedIn, registerHandler, unregisterHandler]);

  // Focus first dropdown item when dropdown opens
  useEffect(() => {
    if (dropdownOpen) {
      setTimeout(() => firstDropdownItemRef.current?.focus(), 100);
    }
  }, [dropdownOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-menu')) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleLogin = () => {
    const returnTo = pathname || '/';
    
    // Track login attempt
    trackLoginAttempt({
      method: 'discord',
      page: returnTo,
    });
    
    login(returnTo);
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
  };

  // Don't show anything while loading OR before mount to prevent flash
  // Show a placeholder skeleton to prevent CLS
  if (isLoading || !mounted) {
    return (
      <div 
        className="fixed top-4 z-50 transition-all duration-300 ease-in-out" 
        style={{ right: '16px' }}
      >
        {/* Skeleton placeholder matching Discord login button dimensions */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5865F2]/20 border border-[#5865F2]/30">
          {/* Discord icon placeholder */}
          <div className="w-5 h-5 rounded bg-[#5865F2]/30 animate-pulse" />
          {/* Text placeholder - hidden on mobile like the real button */}
          <div className="hidden sm:block w-[130px] h-5 rounded bg-[#5865F2]/30 animate-pulse" />
          {/* Mobile text placeholder */}
          <div className="sm:hidden w-[40px] h-5 rounded bg-[#5865F2]/30 animate-pulse" />
        </div>
      </div>
    );
  }

  if (isLoggedIn && user) {
    return (
      <div 
        className="fixed top-4 z-50 user-menu transition-all duration-300 ease-in-out flex flex-col items-end gap-2" 
        style={{ right: rightPosition }}
      >
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`
              flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 shadow-lg border-2
              ${isGuest 
                ? 'bg-[#1a2930] border-slate-600/50 hover:border-slate-400 text-gray-300' 
                : 'bg-gradient-to-br from-[#0F1B21] to-[#1a2930] border-[#54FFA4]/30 hover:border-[#54FFA4] text-white'
              }
            `}
          >
            {/* Avatar */}
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center font-bold overflow-hidden
              ${isGuest ? 'bg-slate-700 text-gray-400' : 'bg-gradient-to-br from-[#54FFA4] to-[#45e894] text-[#0F1B21]'}
            `}>
              {user.avatar ? (
                <Image src={user.avatar} alt={user.displayName || user.username} width={32} height={32} className="w-full h-full rounded-full object-cover" unoptimized />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>

            {/* Username */}
            <span className="font-medium hidden sm:block">
              {isGuest ? `Guest #${user.discriminator}` : (user.displayName || user.username)}
            </span>

            {/* Dropdown Arrow */}
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''} ${isGuest ? 'text-gray-400' : 'text-[#54FFA4]'}`} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-xl shadow-2xl overflow-hidden z-50">
              {/* User Info Header */}
              <div className={`px-5 py-4 border-b-2 ${isGuest ? 'border-slate-700/50 bg-slate-800/20' : 'border-[#54FFA4]/20 bg-[#54FFA4]/5'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-white font-bold text-lg">
                      {isGuest ? 'Guest User' : (user.displayName || user.username)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {isGuest ? 'Stats not permanently saved' : 'Verified Agent'}
                    </div>
                  </div>
                  {isGuest ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                      UNSAVED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#54FFA4]/20 text-[#54FFA4] border border-[#54FFA4]/30">
                      VERIFIED
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-3 text-sm mt-3">
                  <div className="flex items-center gap-1.5 bg-[#0F1B21] px-2.5 py-1 rounded-md border border-white/10">
                    <Zap className="w-3.5 h-3.5 text-[#54FFA4]" />
                    <span className="text-white font-semibold">Lv {user.level}</span>
                  </div>
                  <Link
                    href="/daily-challenge"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-1.5 bg-[#0F1B21] px-2.5 py-1 rounded-md border border-white/10 hover:border-orange-500/50 transition-colors"
                  >
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span className="text-white font-semibold">{user.currentDailyStreak}</span>
                  </Link>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2 space-y-1">
                {/* Guest CTA - Mobile/Tablet fallback or extra prominence */}
                {isGuest && (
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogin();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 bg-[#5865F2]/10 hover:bg-[#5865F2] text-[#5865F2] hover:text-white font-bold rounded-lg transition-all mb-2 group border border-[#5865F2]/20"
                  >
                    <div className="bg-[#5865F2] text-white p-1 rounded group-hover:bg-white group-hover:text-[#5865F2] transition-colors">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm">Link Discord</div>
                      <div className="text-[10px] opacity-80 font-normal">Save your progress forever</div>
                    </div>
                  </button>
                )}

                <Link
                  ref={firstDropdownItemRef}
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-[#1a2930] hover:text-white rounded-lg transition-colors"
                >
                  <User className="w-4 h-4 text-[#54FFA4]" />
                  <span>View Profile</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-[#1a2930] hover:text-white rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span>Settings</span>
                </Link>

                <div className="h-px bg-white/10 my-1 mx-2" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isGuest ? 'Delete Guest Data' : 'Logout'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Guest: Prominent Login Button */}
        {isGuest && (
          <button
            onClick={handleLogin}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5865F2] text-white font-bold text-sm transition-all duration-300 shadow-lg border-2 border-transparent hover:border-white"
          >
            <DiscordIcon className="w-4 h-4" />
            <span>Login to Save</span>
          </button>
        )}
      </div>
    );
  }

  // Logged Out - Show Discord Login (Fallback if guest logic fails)
  return (
    <button
      onClick={handleLogin}
      className="fixed top-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
      style={{ right: rightPosition }}
    >
      <DiscordIcon className="w-5 h-5" />
      <span className="hidden sm:inline">Login with Discord</span>
      <span className="sm:hidden">Login</span>
    </button>
  );
}
