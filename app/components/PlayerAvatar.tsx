'use client';

import { useState } from 'react';
import Link from 'next/link';
import EmoteImage from '@/app/lobby/EmoteImage';

interface PlayerAvatarProps {
  // The user / member's identifier — used to link to their profile page.
  userId: string;
  // Display name; first character is used as the fallback initial.
  displayName: string;
  // Discord identity, for Discord-authenticated users only. When both are
  // present we build the CDN avatar URL; otherwise we fall back to an
  // initial in a coloured circle.
  discordId?: string;
  avatarHash?: string;
  size?: number;
  className?: string;
  // Whether clicking the avatar navigates to /profile/[userId].
  linkable?: boolean;
  // Ring colour around the avatar (spring-green for "this is me" / "host", etc).
  ringClass?: string;
  // Optional floating emote bubble above the avatar. `key` should change per
  // emote so the CSS animation restarts on each new one. `loopMs` is the
  // bubble's visible lifetime, applied as an inline animation-duration so
  // the float resolves on the same frame the parent removes the bubble.
  emote?: {
    primaryUrl: string;
    fallbackUrl: string;
    label: string;
    loopMs: number;
    key: number;
  } | null;
  // Which side of the avatar to anchor the bubble to. 'left' leans the
  // bubble up-and-right (use for avatars on the left side of a layout so
  // the bubble points inward toward the action), 'right' leans up-and-left,
  // 'center' (default) renders directly above.
  emoteAnchor?: 'left' | 'right' | 'center';
  // Bubble size override — useful in match views where the emote should
  // read clearly from across the screen.
  emoteSize?: number;
}

export default function PlayerAvatar({
  userId,
  displayName,
  discordId,
  avatarHash,
  size = 32,
  className,
  linkable = true,
  ringClass,
  emote,
  emoteAnchor = 'center',
  emoteSize = 48,
}: PlayerAvatarProps) {
  const [imgError, setImgError] = useState(false);
  // The session sometimes hands us the full Discord CDN URL in `avatarHash`
  // and sometimes just the hash — handle both. (The naming is a holdover
  // from when we expected only the hash.)
  const avatarUrl = (() => {
    if (!avatarHash) return null;
    if (avatarHash.startsWith('http://') || avatarHash.startsWith('https://')) {
      return avatarHash;
    }
    if (!discordId) return null;
    return `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.png?size=${size * 2}`;
  })();
  const initial = (displayName || '?').trim().charAt(0).toUpperCase() || '?';
  const showFallback = !avatarUrl || imgError;

  const body = !showFallback ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatarUrl!}
      alt={displayName}
      width={size}
      height={size}
      onError={() => setImgError(true)}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  ) : (
    <div
      // Matches the canonical no-avatar fallback used on profile pages:
      // solid dark fill with a spring-green initial.
      className="rounded-full flex items-center justify-center bg-[#0F1B21] text-[#54FFA4] font-bold"
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.45) }}
      aria-hidden
    >
      {initial}
    </div>
  );

  const wrapped = (
    <div
      className={`relative shrink-0 rounded-full ${ringClass ?? ''} ${className ?? ''}`}
      style={{ width: size, height: size }}
    >
      {emote && (
        <div
          key={emote.key}
          className={`emote-bubble emote-bubble--${emoteAnchor} absolute z-20 rounded-full bg-black/80 backdrop-blur-sm border border-white/15 shadow-xl shadow-black/50 pointer-events-none flex items-center justify-center`}
          style={{
            animationDuration: `${emote.loopMs}ms`,
            // Explicit square box so the bubble never collapses into a tall thin
            // pill when the parent does shrink-to-fit width resolution.
            width: emoteSize + 16,
            height: emoteSize + 16,
          }}
        >
          <EmoteImage
            primaryUrl={emote.primaryUrl}
            fallbackUrl={emote.fallbackUrl}
            label={emote.label}
            size={emoteSize}
            className="block"
          />
          <span
            aria-hidden
            className={`emote-bubble__tail emote-bubble__tail--${emoteAnchor} absolute block w-2.5 h-2.5 rounded-full bg-black/80 border border-white/15`}
          />
        </div>
      )}
      {body}
    </div>
  );

  // Guest clientIds (`guest-…`) have no profile page, so render as a static
  // avatar even when linkable=true (the call site usually doesn't know).
  if (linkable && !userId.startsWith('guest-')) {
    return (
      <Link
        href={`/profile/${userId}`}
        className="shrink-0 rounded-full hover:opacity-90 transition-opacity"
        title={`Open ${displayName}'s profile`}
      >
        {wrapped}
      </Link>
    );
  }
  return wrapped;
}
