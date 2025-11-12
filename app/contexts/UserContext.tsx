'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { UserSession } from '@/interfaces/user';
import { trackLoginSuccess } from '../utils/gtm';

interface DailyChallengeStatus {
  completed: boolean;
  challengeId?: string;
}

interface UserContextType {
  user: UserSession['user'] | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  hasInitialized: boolean;
  dailyChallengeStatus: DailyChallengeStatus | null;
  login: (returnTo?: string) => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  refreshDailyChallengeStatus: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [dailyChallengeStatus, setDailyChallengeStatus] = useState<DailyChallengeStatus | null>(null);
  const lastSessionFetchRef = useRef<number>(0);
  const sessionFetchingRef = useRef<boolean>(false);
  const challengeFetchingRef = useRef<boolean>(false);
  const loginSuccessTrackedRef = useRef<boolean>(false);
  const SESSION_CACHE_DURATION = 30000; // 30 seconds cache

  // Fetch session on mount
  useEffect(() => {
    fetchSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch daily challenge status when user logs in
  useEffect(() => {
    if (user && !challengeFetchingRef.current) {
      fetchDailyChallengeStatus();
    }
  }, [user]);

  const fetchSession = async () => {
    try {
      // Prevent concurrent fetches
      if (sessionFetchingRef.current) {
        return;
      }
      
      // Check if we fetched recently (within cache duration)
      const now = Date.now();
      if (now - lastSessionFetchRef.current < SESSION_CACHE_DURATION) {
        // Use cached data, just update loading state
        setIsLoading(false);
        setHasInitialized(true);
        return;
      }

      sessionFetchingRef.current = true;
      setIsLoading(true);
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      
      const wasLoggedOut = !user;
      
      if (data.user) {
        setUser(data.user);
        
        // Track login success only on first login (not on refreshes)
        if (wasLoggedOut && !loginSuccessTrackedRef.current) {
          loginSuccessTrackedRef.current = true;
          trackLoginSuccess({
            method: 'discord',
            user_level: data.user.level || 0,
          });
        }
      } else {
        setUser(null);
        // Reset tracking flag when user logs out
        loginSuccessTrackedRef.current = false;
      }
      
      lastSessionFetchRef.current = now;
    } catch (error) {
      console.error('Failed to fetch session:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
      setHasInitialized(true);
      sessionFetchingRef.current = false;
    }
  };

  const fetchDailyChallengeStatus = async () => {
    try {
      // Prevent concurrent fetches
      if (challengeFetchingRef.current) {
        return;
      }
      
      challengeFetchingRef.current = true;
      const response = await fetch('/api/challenges/today');
      if (response.ok) {
        const data = await response.json();
        setDailyChallengeStatus({
          completed: data.userProgress?.completed || false,
          challengeId: data.id,
        });
      }
    } catch (error) {
      console.error('Failed to fetch daily challenge status:', error);
    } finally {
      challengeFetchingRef.current = false;
    }
  };

  const login = (returnTo?: string) => {
    const url = returnTo 
      ? `/api/auth/discord/login?returnTo=${encodeURIComponent(returnTo)}`
      : '/api/auth/discord/login';
    window.location.href = url;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const refreshSession = async () => {
    await fetchSession();
  };

  const refreshDailyChallengeStatus = async () => {
    await fetchDailyChallengeStatus();
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn: !!user,
        hasInitialized,
        dailyChallengeStatus,
        login,
        logout,
        refreshSession,
        refreshDailyChallengeStatus,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
