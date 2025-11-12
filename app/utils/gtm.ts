/**
 * Google Tag Manager Event Utilities
 * 
 * Helper functions to send custom events to GTM/GA4
 */

// Type definitions for common events
export interface GameStartEvent {
  game_name: string;
  is_logged_in: boolean;
  user_level?: number;
  session_game_count?: number;
}

export interface GameCompleteEvent {
  game_name: string;
  result: 'win' | 'loss';
  score: number;
  time: number;
  is_standard_preset: boolean;
  is_logged_in: boolean;
}

export interface GameRetryEvent {
  game_name: string;
  previous_result: 'win' | 'loss';
  previous_score: number;
}

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

export interface LoginAttemptEvent {
  method: 'discord' | 'guest';
  page?: string;
}

export interface LoginSuccessEvent {
  method: 'discord' | 'guest';
  user_level?: number;
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
 * Track when a user starts a game
 */
export function trackGameStart(data: GameStartEvent) {
  pushToDataLayer({
    event: 'game_start',
    ...data,
  });
}

/**
 * Track when a user completes a game
 */
export function trackGameComplete(data: GameCompleteEvent) {
  pushToDataLayer({
    event: 'game_complete',
    ...data,
  });
}

/**
 * Track when a user retries a game
 */
export function trackGameRetry(data: GameRetryEvent) {
  pushToDataLayer({
    event: 'game_retry',
    ...data,
  });
}

/**
 * Track when a user plays a game (legacy - use trackGameComplete instead)
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
 * Track when a user attempts to login
 */
export function trackLoginAttempt(data: LoginAttemptEvent) {
  pushToDataLayer({
    event: 'login_attempt',
    ...data,
  });
}

/**
 * Track when a user successfully logs in
 */
export function trackLoginSuccess(data: LoginSuccessEvent) {
  pushToDataLayer({
    event: 'login_success',
    ...data,
  });
}

/**
 * Track when a user logs in (legacy - use trackLoginSuccess instead)
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
