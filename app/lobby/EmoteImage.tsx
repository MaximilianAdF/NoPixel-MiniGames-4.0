'use client';

import { useEffect, useState } from 'react';

interface EmoteImageProps {
  primaryUrl: string;
  fallbackUrl: string;
  label: string;
  size: number;
  className?: string;
}

// Renders an emote image, trying the animated Noto WebP first and falling
// back to the Fluent 3D PNG if the primary 404s (Noto's animated set
// doesn't cover every face). Resets when the URLs change so each new emote
// gets a fresh attempt at the primary.
export default function EmoteImage({
  primaryUrl,
  fallbackUrl,
  label,
  size,
  className,
}: EmoteImageProps) {
  const [src, setSrc] = useState(primaryUrl);

  useEffect(() => {
    setSrc(primaryUrl);
  }, [primaryUrl]);

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={label}
      width={size}
      height={size}
      draggable={false}
      onError={() => {
        if (src !== fallbackUrl) setSrc(fallbackUrl);
      }}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
