// Preset quick-reactions shipped over the Ably lobby channel. Each emote
// has THREE rendering URLs: the animated WebP (for the floating bubble /
// inline chip), a static PNG of the same Noto face (for the always-
// visible picker bar — running five animated 512px WebPs at once was
// enough to crash some browsers), and a Fluent UI 3D PNG fallback used
// via <img onError> if Noto 404s.
export interface EmoteDef {
  id: string;
  // Unicode glyph — also handy as alt text / lookup key.
  unicode: string;
  // Animated WebP from Google Noto Animated Emoji. Used in the floating
  // bubble / inline chip when an emote actually fires.
  animatedUrl: string;
  // Static PNG from the same Noto set, used in the always-visible emote
  // picker bar so it doesn't decode five animated WebPs at all times.
  staticUrl: string;
  // Static Fluent UI 3D PNG, used as <img> onError fallback if Noto 404s.
  fallbackUrl: string;
  // Short label used as tooltip / aria-label on the button.
  label: string;
  // How long the emote bubble stays visible. Sized to end just after the
  // WebP's last visible motion (and before the loop would restart), so
  // the bubble fades on cue and the sound effect runs for this same span.
  loopMs: number;
}

// Google only publishes the animated WebP at the 512 size on this CDN;
// other sizes return HTML 404. The 512 PNG is the static counterpart.
function notoAnimated(codepoint: string): string {
  return `https://fonts.gstatic.com/s/e/notoemoji/latest/${codepoint}/512.webp`;
}

function notoStatic(codepoint: string): string {
  return `https://fonts.gstatic.com/s/e/notoemoji/latest/${codepoint}/512.png`;
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
    staticUrl: notoStatic('1f606'),
    fallbackUrl: fluentStatic('Grinning squinting face'),
    label: 'LOL',
    loopMs: 2500,
  },
  {
    id: 'cry',
    unicode: '😭',
    animatedUrl: notoAnimated('1f62d'),
    staticUrl: notoStatic('1f62d'),
    fallbackUrl: fluentStatic('Loudly crying face'),
    label: 'Cry',
    loopMs: 1600,
  },
  {
    id: 'clown',
    unicode: '🤡',
    animatedUrl: notoAnimated('1f921'),
    staticUrl: notoStatic('1f921'),
    fallbackUrl: fluentStatic('Clown face'),
    label: 'Clown',
    loopMs: 1600,
  },
  {
    id: 'angry',
    unicode: '😡',
    animatedUrl: notoAnimated('1f621'),
    staticUrl: notoStatic('1f621'),
    fallbackUrl: fluentStatic('Pouting face'),
    label: 'Mad',
    loopMs: 1800,
  },
  {
    id: 'rip',
    unicode: '💀',
    animatedUrl: notoAnimated('1f480'),
    staticUrl: notoStatic('1f480'),
    fallbackUrl: fluentStatic('Skull'),
    label: 'RIP',
    loopMs: 3500,
  },
];

export const EMOTE_BY_ID: Record<string, EmoteDef> = Object.fromEntries(
  EMOTES.map((e) => [e.id, e]),
);

// Client-side throttle so a user can't flood the channel with emotes.
export const EMOTE_THROTTLE_MS = 1500;
