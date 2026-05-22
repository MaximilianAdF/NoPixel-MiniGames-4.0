// Preset quick-reactions shipped over the Ably lobby channel. Each emote
// has an animated WebP from Google's Noto Animated Emoji set and a static
// Fluent UI 3D PNG fallback (used when Noto doesn't cover a particular
// face). Wire format stores the stable `id`.
export interface EmoteDef {
  id: string;
  // Unicode glyph — also handy as alt text / lookup key.
  unicode: string;
  // Animated WebP from Google Noto Animated Emoji (Google Fonts CDN).
  animatedUrl: string;
  // Static Fluent UI 3D PNG, used as <img> onError fallback.
  staticUrl: string;
  // Short label used as tooltip / aria-label on the button.
  label: string;
}

function notoAnimated(codepoint: string, size: 32 | 64 | 128 | 256 | 512 = 256): string {
  return `https://fonts.gstatic.com/s/e/notoemoji/latest/${codepoint}/${size}.webp`;
}

function fluentStatic(name: string): string {
  const filename = `${name.toLowerCase().replace(/ /g, '_')}_3d.png`;
  return `https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/${encodeURIComponent(name)}/3D/${filename}`;
}

export const EMOTES: EmoteDef[] = [
  {
    id: 'laugh',
    unicode: '😆',
    animatedUrl: notoAnimated('1f606'),
    staticUrl: fluentStatic('Grinning squinting face'),
    label: 'LOL',
  },
  {
    id: 'cry',
    unicode: '😭',
    animatedUrl: notoAnimated('1f62d'),
    staticUrl: fluentStatic('Loudly crying face'),
    label: 'Cry',
  },
  {
    id: 'clown',
    unicode: '🤡',
    animatedUrl: notoAnimated('1f921'),
    staticUrl: fluentStatic('Clown face'),
    label: 'Clown',
  },
  {
    id: 'angry',
    unicode: '😡',
    animatedUrl: notoAnimated('1f621'),
    staticUrl: fluentStatic('Pouting face'),
    label: 'Mad',
  },
  {
    id: 'rip',
    unicode: '💀',
    animatedUrl: notoAnimated('1f480'),
    staticUrl: fluentStatic('Skull'),
    label: 'RIP',
  },
];

export const EMOTE_BY_ID: Record<string, EmoteDef> = Object.fromEntries(
  EMOTES.map((e) => [e.id, e]),
);

// Client-side throttle so a user can't flood the channel with emotes.
export const EMOTE_THROTTLE_MS = 1500;
// How long an emote bubble stays visible. Matches the CSS animation length.
export const EMOTE_DURATION_MS = 3000;
