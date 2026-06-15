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

// 1v1 lobby + match events.
export interface LobbyCreatedEvent {
  lobby_code: string;
}

export interface LobbyJoinedEvent {
  lobby_code: string;
}

export interface MatchStartedEvent {
  lobby_code: string;
  game_type: string;
  focus_mode: boolean;
}

export interface MatchCompletedEvent {
  lobby_code: string;
  game_type: string;
  reason: 'finished' | 'timeout';
  has_winner: boolean;
  duration_ms: number;
}

export interface MatchForfeitedEvent {
  lobby_code: string;
  game_type: string;
  duration_ms: number;
}

export interface MatchTimedOutEvent {
  lobby_code: string;
  game_type: string;
}

// Async ghost-race events (solo player racing a recorded run).
export interface GhostRecordedEvent {
  game_type: string;
  // The recorded run's completion time, ms.
  duration_ms: number;
  // Where the run came from ('match' winner harvest, or 'solo' later).
  source: string;
}

export interface GhostRaceStartedEvent {
  game_type: string;
  ghost_id: string;
  // The ghost's time the player is chasing, ms.
  ghost_time_ms: number;
}

export interface GhostRaceCompletedEvent {
  game_type: string;
  ghost_id: string;
  // 'won' = beat the ghost's time; 'lost' = ghost finished first / DNF.
  result: 'won' | 'lost';
  // The player's own time when they finished, ms (0 if they didn't finish).
  player_time_ms: number;
  ghost_time_ms: number;
}

// Main GTM push function
function pushToDataLayer(data: Record<string, any>) {
  if (typeof window === 'undefined') return;
  window.dataLayer?.push(data);
  // GTM isn't forwarding these custom events to GA4, so also send them straight
  // to GA4 via gtag (loaded by GoogleAnalytics). page_view stays GTM-owned to
  // avoid double-counting.
  const { event, ...params } = data;
  const w = window as any;
  if (event && event !== 'page_view' && typeof w.gtag === 'function') {
    w.gtag('event', event, params);
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
 * Track when a 1v1 lobby is created (host clicks Create).
 */
export function trackLobbyCreated(data: LobbyCreatedEvent) {
  pushToDataLayer({ event: 'lobby_created', ...data });
}

/**
 * Track when a user joins an existing 1v1 lobby via code.
 */
export function trackLobbyJoined(data: LobbyJoinedEvent) {
  pushToDataLayer({ event: 'lobby_joined', ...data });
}

/**
 * Track when a 1v1 match starts (host clicks a game button).
 */
export function trackMatchStarted(data: MatchStartedEvent) {
  pushToDataLayer({ event: 'match_started', ...data });
}

/**
 * Track when a 1v1 match completes (canonical outcome derived by host).
 */
export function trackMatchCompleted(data: MatchCompletedEvent) {
  pushToDataLayer({ event: 'match_completed', ...data });
}

/**
 * Track when a player forfeits a 1v1 match.
 */
export function trackMatchForfeited(data: MatchForfeitedEvent) {
  pushToDataLayer({ event: 'match_forfeited', ...data });
}

/**
 * Track when a 1v1 match hits its max duration without resolution.
 */
export function trackMatchTimedOut(data: MatchTimedOutEvent) {
  pushToDataLayer({ event: 'match_timed_out', ...data });
}

/**
 * Track when a winning 1v1 run is harvested as a raceable ghost.
 */
export function trackGhostRecorded(data: GhostRecordedEvent) {
  pushToDataLayer({ event: 'ghost_recorded', ...data });
}

/**
 * Track when a player starts a solo ghost race.
 */
export function trackGhostRaceStarted(data: GhostRaceStartedEvent) {
  pushToDataLayer({ event: 'ghost_race_started', ...data });
}

/**
 * Track when a ghost race finishes (player beat the ghost or not).
 */
export function trackGhostRaceCompleted(data: GhostRaceCompletedEvent) {
  pushToDataLayer({ event: 'ghost_race_completed', ...data });
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
