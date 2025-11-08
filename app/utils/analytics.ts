/**
 * Analytics tracking for minigame events
 * Tracks game starts, completions, failures, and popularity
 */

export interface GameEvent {
  game: string;
  event: 'start' | 'complete' | 'fail' | 'quit';
  score?: number;
  timeMs?: number;
  difficulty?: string;
  userId?: string;
}

/**
 * Track a game event
 * Sends event to analytics API endpoint
 */
export async function trackGameEvent(event: GameEvent): Promise<void> {
  try {
    // Don't track in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event);
      return;
    }

    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...event,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      }),
    });
  } catch (error) {
    // Silently fail - analytics shouldn't break the app
    console.error('[Analytics] Failed to track event:', error);
  }
}

/**
 * Track page view
 */
export async function trackPageView(page: string): Promise<void> {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Page view:', page);
      return;
    }

    await fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page,
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
    });
  } catch (error) {
    console.error('[Analytics] Failed to track page view:', error);
  }
}

/**
 * Get game popularity stats
 * Returns play counts for all games
 */
export async function getGamePopularity(): Promise<Record<string, number>> {
  try {
    const response = await fetch('/api/analytics/popularity');
    if (!response.ok) throw new Error('Failed to fetch popularity');
    return await response.json();
  } catch (error) {
    console.error('[Analytics] Failed to get popularity:', error);
    return {};
  }
}
