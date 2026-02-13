/**
 * Site Configuration
 *
 * Centralized configuration for site-wide constants.
 * This makes future domain migrations easier - just update NEXT_PUBLIC_SITE_URL env variable.
 */

// Primary site URL - used for SEO, canonical URLs, OG images, etc.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://nphacks.net";

// Site name for metadata
export const SITE_NAME = "NoPixel 4.0 Minigames";

// Domain without protocol (for display purposes)
export const SITE_DOMAIN = SITE_URL.replace(/^https?:\/\//, "");
