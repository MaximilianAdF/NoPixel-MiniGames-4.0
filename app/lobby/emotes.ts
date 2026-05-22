// Preset quick-reactions shipped over the Ably lobby channel as
// EmoteMessage.emote strings. Kept short + readable; rendered as floating
// bubbles next to the sender's avatar on every other client.
export const EMOTES = [
  'GG',
  'WP',
  'GL',
  'Nice!',
  'Again?',
  'Oops',
  '?',
  '!',
] as const;

export type Emote = (typeof EMOTES)[number];

// Client-side throttle so a user can't flood the channel with emotes.
export const EMOTE_THROTTLE_MS = 1500;
// How long an emote bubble stays visible. Matches the CSS animation length.
export const EMOTE_DURATION_MS = 3000;
