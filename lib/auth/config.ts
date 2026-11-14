import { SITE_URL } from '@/lib/siteConfig';

export function getSessionSecret(): Uint8Array {
  const value = process.env.NEXTAUTH_SECRET || process.env.SESSION_SECRET || process.env.JWT_SECRET;
  if (!value || Buffer.byteLength(value) < 32) {
    throw new Error('Configure NEXTAUTH_SECRET with at least 32 random bytes');
  }
  return new TextEncoder().encode(value);
}

export function getAuthBaseUrl(): string {
  return new URL(process.env.NEXTAUTH_URL || SITE_URL).origin;
}

export function getDiscordRedirectUri(): string {
  const uri = new URL(process.env.DISCORD_REDIRECT_URI || '/api/auth/discord/callback', getAuthBaseUrl());
  if (!['http:', 'https:'].includes(uri.protocol) || uri.pathname !== '/api/auth/discord/callback' || uri.search || uri.hash) {
    throw new Error('DISCORD_REDIRECT_URI must point to /api/auth/discord/callback');
  }
  return uri.href;
}

export function safeReturnTo(value: string | null | undefined): string {
  if (!value?.startsWith('/') || value.startsWith('//') || /[\\\r\n]/.test(value)) return '/';
  const base = 'https://return.invalid';
  const url = new URL(value, base);
  return url.origin === base ? `${url.pathname}${url.search}${url.hash}` : '/';
}
