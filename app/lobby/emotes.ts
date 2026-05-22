// Preset quick-reactions shipped over the Ably lobby channel. Visuals are
// Microsoft Fluent UI 3D emoji PNGs served via jsdelivr — no asset files
// to commit, but they cache aggressively on the CDN. Wire format stores
// the stable `id` so visuals can change later without breaking history.
export interface EmoteDef {
  id: string;
  // Unicode emoji used as the <img> alt text + sound-effect lookup fallback.
  unicode: string;
  imageUrl: string;
  // Short label used as tooltip / aria-label on the button.
  label: string;
}

// Fluent UI emoji repo path convention: assets/<Name>/3D/<snake_case_name>_3d.png
function fe(name: string): string {
  const filename = `${name.toLowerCase().replace(/ /g, '_')}_3d.png`;
  return `https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/${encodeURIComponent(name)}/3D/${filename}`;
}

export const EMOTES: EmoteDef[] = [
  {
    id: 'laugh',
    unicode: '😆',
    imageUrl: fe('Grinning squinting face'),
    label: 'LOL',
  },
  {
    id: 'cry',
    unicode: '😭',
    imageUrl: fe('Loudly crying face'),
    label: 'Cry',
  },
  {
    id: 'clown',
    unicode: '🤡',
    imageUrl: fe('Clown face'),
    label: 'Clown',
  },
  {
    id: 'angry',
    unicode: '😡',
    imageUrl: fe('Pouting face'),
    label: 'Mad',
  },
  {
    id: 'rip',
    unicode: '💀',
    imageUrl: fe('Skull'),
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
