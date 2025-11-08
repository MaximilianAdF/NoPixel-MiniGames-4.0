import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { UserSession } from '@/interfaces/user';

const SESSION_COOKIE_NAME = 'nopixel_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Create JWT session token
 */
export async function createSessionToken(payload: UserSession): Promise<string> {
  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
  
  const token = await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);

  return token;
}

/**
 * Verify and decode JWT session token
 */
export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    
    return payload as unknown as UserSession;
  } catch (error) {
    return null;
  }
}

/**
 * Set session cookie
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000, // seconds
    path: '/',
  });
}

/**
 * Get session from cookie
 */
export async function getSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return null;
    }

    const session = await verifySessionToken(sessionCookie.value);
    
    // Check if session is expired
    if (session && session.expiresAt < Date.now()) {
      await clearSession();
      return null;
    }

    return session;
  } catch (error) {
    return null;
  }
}

/**
 * Clear session cookie
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Update session (refresh token, update user data, etc.)
 */
export async function updateSession(updates: Partial<UserSession>): Promise<void> {
  const currentSession = await getSession();
  
  if (!currentSession) {
    throw new Error('No active session');
  }

  const updatedSession: UserSession = {
    ...currentSession,
    ...updates,
  };

  const token = await createSessionToken(updatedSession);
  await setSessionCookie(token);
}
