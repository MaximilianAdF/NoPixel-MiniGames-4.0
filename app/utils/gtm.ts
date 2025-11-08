/**
 * Google Tag Manager Event Utilities
 * 
 * Helper functions to send custom events to GTM/GA4
 */

// Type definitions for common events
export interface GamePlayEvent {
  game_name: string;
  game_result: 'win' | 'loss';
  score?: number;
  time?: number;
  difficulty?: string;
}

export interface LeaderboardViewEvent {
  category: string;
  page?: number;
}

export interface ChallengeCompleteEvent {
  challenge_id: string;
  completion_time: number;
  stars?: number;
}

export interface UserLoginEvent {
  method: 'discord' | 'guest';
  user_id?: string;
}

export interface SettingsChangeEvent {
  setting_name: string;
  setting_value: string | number | boolean;
}

// Main GTM push function
function pushToDataLayer(data: Record<string, any>) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data);
  }
}

/**
 * Track when a user plays a game
 */
export function trackGamePlay(data: GamePlayEvent) {
  pushToDataLayer({
    event: 'game_play',
    ...data,
  });
}

/**
 * Track when a user views a leaderboard
 */
export function trackLeaderboardView(data: LeaderboardViewEvent) {
  pushToDataLayer({
    event: 'leaderboard_view',
    ...data,
  });
}

/**
 * Track when a user completes a daily challenge
 */
export function trackChallengeComplete(data: ChallengeCompleteEvent) {
  pushToDataLayer({
    event: 'challenge_complete',
    ...data,
  });
}

/**
 * Track when a user logs in
 */
export function trackUserLogin(data: UserLoginEvent) {
  pushToDataLayer({
    event: 'user_login',
    ...data,
  });
}

/**
 * Track when a user changes settings
 */
export function trackSettingsChange(data: SettingsChangeEvent) {
  pushToDataLayer({
    event: 'settings_change',
    ...data,
  });
}

/**
 * Track custom events
 */
export function trackCustomEvent(eventName: string, eventData?: Record<string, any>) {
  pushToDataLayer({
    event: eventName,
    ...eventData,
  });
}

/**
 * Track page view (usually automatic, but can be used for SPA navigation)
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
  pushToDataLayer({
    event: 'page_view',
    page_path: pagePath,
    page_title: pageTitle || document.title,
  });
}

// Declare global window.dataLayer type
declare global {
  interface Window {
    dataLayer?: Array<Record<string, any>>;
  }
}
