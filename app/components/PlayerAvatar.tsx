'use client';

import Link from 'next/link';

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
}: PlayerAvatarProps) {
  const avatarUrl =
    discordId && avatarHash
      ? `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.png?size=${size * 2}`
      : null;
  const initial = (displayName || '?').trim().charAt(0).toUpperCase() || '?';

  const body = avatarUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatarUrl}
      alt={displayName}
      width={size}
      height={size}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  ) : (
    <div
      className="rounded-full flex items-center justify-center bg-gradient-to-br from-white/15 to-white/5 text-white/70 font-semibold"
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.4) }}
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
      {body}
    </div>
  );

  if (linkable) {
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
