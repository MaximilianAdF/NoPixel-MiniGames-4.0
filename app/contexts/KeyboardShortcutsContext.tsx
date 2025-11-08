'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { useUser } from './UserContext';

export type ShortcutAction = 'openNav' | 'openGuide' | 'toggleProfile' | 'closeMenu';

export interface KeyboardShortcut {
  action: ShortcutAction;
  key: string;
  label: string;
  description: string;
}

interface KeyboardShortcutsContextType {
  shortcuts: KeyboardShortcut[];
  updateShortcut: (action: ShortcutAction, newKey: string) => void;
  resetToDefaults: () => void;
  registerHandler: (action: ShortcutAction, handler: () => void) => void;
  unregisterHandler: (action: ShortcutAction) => void;
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | undefined>(undefined);

const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  {
    action: 'openNav',
    key: 'n',
    label: 'Toggle Navigation Menu',
    description: 'Opens or closes the navigation sidebar',
  },
  {
    action: 'openGuide',
    key: 'g',
    label: 'Toggle Minigame Guide',
    description: 'Opens or closes the game instructions panel',
  },
  {
    action: 'toggleProfile',
    key: 'p',
    label: 'Toggle Profile Dropdown',
    description: 'Opens or closes the profile dropdown menu',
  },
  {
    action: 'closeMenu',
    key: 'Escape',
    label: 'Close Menu/Guide',
    description: 'Closes any open menu, guide panel, or dropdown',
  },
];

export function KeyboardShortcutsProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn } = useUser();
  const [isClient, setIsClient] = useState(false);
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>(DEFAULT_SHORTCUTS);
  const [handlers, setHandlers] = useState<Map<ShortcutAction, Array<() => void>>>(new Map());
  const [hasLoadedUserPrefs, setHasLoadedUserPrefs] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mark as client and load shortcuts from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('keyboardShortcuts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Merge saved shortcuts with defaults to add any new shortcuts
        const merged = DEFAULT_SHORTCUTS.map(defaultShortcut => {
          const savedShortcut = parsed.find((s: KeyboardShortcut) => s.action === defaultShortcut.action);
          if (savedShortcut) {
            // Use saved key but update label/description from defaults
            return {
              action: defaultShortcut.action,
              key: savedShortcut.key, // Keep user's custom key
              label: defaultShortcut.label,
              description: defaultShortcut.description,
            };
          }
          // New shortcut not in saved list, use default
          return defaultShortcut;
        });
        
        setShortcuts(merged);
        // Save merged version
        localStorage.setItem('keyboardShortcuts', JSON.stringify(merged));
      } catch (e) {
        console.error('Failed to load keyboard shortcuts:', e);
      }
    }
  }, []);

  // Load from database when user logs in
  useEffect(() => {
    if (user && isLoggedIn && !hasLoadedUserPrefs && isClient) {
      if (user.preferences?.keyboardShortcuts) {
        const dbShortcuts = user.preferences.keyboardShortcuts;
        // Merge database shortcuts with defaults to add any new shortcuts
        const merged = DEFAULT_SHORTCUTS.map(defaultShortcut => {
          const dbShortcut = dbShortcuts.find(s => s.action === defaultShortcut.action);
          if (dbShortcut) {
            // Use saved key but update label/description from defaults
            return {
              action: defaultShortcut.action,
              key: dbShortcut.key, // Keep user's custom key
              label: defaultShortcut.label,
              description: defaultShortcut.description,
            };
          }
          // New shortcut not in database, use default
          return defaultShortcut;
        });
        
        setShortcuts(merged);
        localStorage.setItem('keyboardShortcuts', JSON.stringify(merged));
      }
      setHasLoadedUserPrefs(true);
    }
  }, [user, isLoggedIn, hasLoadedUserPrefs, isClient]);

  // Save shortcuts to localStorage and database whenever they change
  useEffect(() => {
    if (isClient && hasLoadedUserPrefs) {
      // Save to localStorage immediately
      localStorage.setItem('keyboardShortcuts', JSON.stringify(shortcuts));
      
      // Debounce database save to reduce API calls
      if (isLoggedIn && user) {
        // Clear any existing timeout
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        
        // Set new timeout to save after 2 seconds of no changes
        saveTimeoutRef.current = setTimeout(() => {
          fetch('/api/user/preferences', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keyboardShortcuts: shortcuts }),
          }).catch(err => console.error('Failed to save shortcuts to database:', err));
        }, 2000);
      }
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [shortcuts, isClient, isLoggedIn, user, hasLoadedUserPrefs]);

  const updateShortcut = useCallback((action: ShortcutAction, newKey: string) => {
    setShortcuts(prev => 
      prev.map(shortcut => 
        shortcut.action === action 
          ? { ...shortcut, key: newKey }
          : shortcut
      )
    );
  }, []);

  const resetToDefaults = useCallback(() => {
    setShortcuts(DEFAULT_SHORTCUTS);
  }, []);

  const registerHandler = useCallback((action: ShortcutAction, handler: () => void) => {
    setHandlers(prev => {
      const newMap = new Map(prev);
      const existingHandlers = newMap.get(action) || [];
      newMap.set(action, [...existingHandlers, handler]);
      return newMap;
    });
  }, []);

  const unregisterHandler = useCallback((action: ShortcutAction) => {
    setHandlers(prev => {
      const newMap = new Map(prev);
      newMap.delete(action);
      return newMap;
    });
  }, []);

  // Global keyboard event listener
  useEffect(() => {
    if (!isClient) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Still allow Escape to work
        if (event.key !== 'Escape') {
          return;
        }
      }

      // Find matching shortcut
      const shortcut = shortcuts.find(s => {
        const key = s.key.toLowerCase();
        const pressedKey = event.key.toLowerCase();
        return key === pressedKey;
      });

      if (shortcut) {
        const handlerArray = handlers.get(shortcut.action);
        if (handlerArray && handlerArray.length > 0) {
          event.preventDefault();
          // Call all registered handlers for this action
          handlerArray.forEach(handler => handler());
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, handlers, isClient]);

  return (
    <KeyboardShortcutsContext.Provider
      value={{
        shortcuts,
        updateShortcut,
        resetToDefaults,
        registerHandler,
        unregisterHandler,
      }}
    >
      {children}
    </KeyboardShortcutsContext.Provider>
  );
}

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutsContext);
  if (context === undefined) {
    throw new Error('useKeyboardShortcuts must be used within a KeyboardShortcutsProvider');
  }
  return context;
}
