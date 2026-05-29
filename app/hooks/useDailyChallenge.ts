'use client';

import { useEffect, useState } from 'react';

export interface DailyChallenge {
  id: string;
  game: string;
  targetScore: number;
  targetTime: number;
  xpReward: number;
  rows?: number;
  columns?: number;
  levels?: number;
  words?: number;
  numLetters?: number;
  pinLength?: number;
  stats?: {
    totalAttempts: number;
    totalCompletions: number;
    uniquePlayers: number;
  };
}

// Shared fetcher for today's challenge so multiple consumers (the hero
// card + the layout decider) don't each fire their own request.
export function useDailyChallenge() {
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/challenges/today');
        if (!res.ok) return;
        const data = (await res.json()) as DailyChallenge | null;
        if (!cancelled && data && data.id) setChallenge(data);
      } catch {
        // Silent fail — banner just stays hidden.
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { challenge, loading };
}
