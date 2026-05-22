// Preset quick-reactions shipped over the Ably lobby channel. Stored by `id`
// (stable wire format) and rendered as the matching emoji. Sounds live in
// `emoteSounds.ts` and are keyed by the same id.
export interface EmoteDef {
  id: string;
  emoji: string;
  // Short label used as tooltip / aria-label on the button.
  label: string;
}

export const EMOTES: EmoteDef[] = [
  { id: 'gg', emoji: '🤝', label: 'GG' },
  { id: 'wp', emoji: '🔥', label: 'WP' },
  { id: 'nice', emoji: '👏', label: 'Nice!' },
  { id: 'laugh', emoji: '😂', label: 'LOL' },
  { id: 'cry', emoji: '😭', label: 'Cry' },
  { id: 'clown', emoji: '🤡', label: 'Clown' },
  { id: 'angry', emoji: '😤', label: 'Mad' },
  { id: 'rip', emoji: '💀', label: 'RIP' },
];

export const EMOTE_BY_ID: Record<string, EmoteDef> = Object.fromEntries(
  EMOTES.map((e) => [e.id, e]),
);

// Client-side throttle so a user can't flood the channel with emotes.
export const EMOTE_THROTTLE_MS = 1500;
// How long an emote bubble stays visible. Matches the CSS animation length.
export const EMOTE_DURATION_MS = 3000;
