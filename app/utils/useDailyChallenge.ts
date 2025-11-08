'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ChallengeData {
  id: string;
  targetScore: number;
  targetTime: number;
  rows?: number;
  columns?: number;
  levels?: number;
  words?: number;
  numLetters?: number;
  pinLength?: number;
}

// Global cache to prevent multiple components from fetching the same challenge data
let challengeCache: { data: ChallengeData | null; timestamp: number; id: string | null } = {
  data: null,
  timestamp: 0,
  id: null,
};

const CACHE_DURATION = 60000; // 1 minute cache
let pendingFetch: Promise<any> | null = null;

export function useDailyChallenge() {
  const searchParams = useSearchParams();
  const challengeId = searchParams?.get('challengeId');
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (challengeId) {
      const now = Date.now();
      
      // Check if we have cached data for this challenge ID
      if (
        challengeCache.id === challengeId &&
        challengeCache.data &&
        now - challengeCache.timestamp < CACHE_DURATION
      ) {
        // Use cached data
        setChallengeData(challengeCache.data);
        return;
      }

      // If there's already a pending fetch, wait for it
      if (pendingFetch) {
        setIsLoading(true);
        pendingFetch
          .then(() => {
            if (challengeCache.id === challengeId) {
              setChallengeData(challengeCache.data);
            }
          })
          .finally(() => setIsLoading(false));
        return;
      }

      // Start new fetch
      setIsLoading(true);
      pendingFetch = fetch('/api/challenges/today')
        .then(res => res.json())
        .then(data => {
          if (data.id === challengeId) {
            // Update cache
            challengeCache = {
              data: data,
              timestamp: Date.now(),
              id: challengeId,
            };
            setChallengeData(data);
          }
        })
        .catch(console.error)
        .finally(() => {
          setIsLoading(false);
          pendingFetch = null;
        });
    }
  }, [challengeId]);

  return {
    isChallengeMode: !!challengeId,
    challengeData,
    isLoading,
  };
}
