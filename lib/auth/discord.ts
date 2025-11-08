import { DiscordUser, DiscordTokenResponse } from '@/interfaces/user';

// Discord OAuth endpoints
const DISCORD_API_URL = 'https://discord.com/api/v10';
const DISCORD_OAUTH_URL = 'https://discord.com/api/oauth2';

/**
 * Get Discord OAuth authorization URL
 */
export function getDiscordAuthUrl(): string {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI || `${process.env.NEXTAUTH_URL}/api/auth/discord/callback`;
  const scope = 'identify email';

  const params = new URLSearchParams({
    client_id: clientId!,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scope,
  });

  return `${DISCORD_OAUTH_URL}/authorize?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(code: string): Promise<DiscordTokenResponse> {
  const clientId = process.env.DISCORD_CLIENT_ID!;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET!;
  const redirectUri = process.env.DISCORD_REDIRECT_URI || `${process.env.NEXTAUTH_URL}/api/auth/discord/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
  });

  const response = await fetch(`${DISCORD_OAUTH_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code for token: ${error}`);
  }

  return response.json();
}

/**
 * Refresh Discord access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<DiscordTokenResponse> {
  const clientId = process.env.DISCORD_CLIENT_ID!;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET!;

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const response = await fetch(`${DISCORD_OAUTH_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh access token');
  }

  return response.json();
}

/**
 * Get Discord user info from access token
 */
export async function getDiscordUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch(`${DISCORD_API_URL}/users/@me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Discord user');
  }

  return response.json();
}

/**
 * Revoke Discord access token (logout)
 */
export async function revokeDiscordToken(accessToken: string): Promise<void> {
  const clientId = process.env.DISCORD_CLIENT_ID!;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET!;

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    token: accessToken,
  });

  await fetch(`${DISCORD_OAUTH_URL}/token/revoke`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
}

/**
 * Get Discord avatar URL
 */
export function getDiscordAvatarUrl(discordId: string, avatarHash: string | null, size = 128): string {
  if (!avatarHash) {
    // Default Discord avatar based on discriminator
    const defaultAvatarIndex = parseInt(discordId) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
  }

  return `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.png?size=${size}`;
}
