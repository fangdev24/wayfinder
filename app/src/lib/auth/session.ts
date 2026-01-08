/**
 * Session Management for Admin Panel
 *
 * HTTP-only cookie-based sessions backed by SQLite.
 * Follows NCSC guidance for secure session handling.
 */

import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { adminSessions, adminUsers, type AdminUser } from '@/lib/db/schema';
import { eq, and, gt, lt } from 'drizzle-orm';

const SESSION_COOKIE_NAME = 'wayfinder_admin_session';
const SESSION_EXPIRY_HOURS = parseInt(process.env.ADMIN_SESSION_EXPIRY || '24', 10);

/**
 * Generate a cryptographically secure session ID
 */
function generateSessionId(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Create a new session for a user
 */
export async function createSession(userId: string): Promise<string> {
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000);

  db.insert(adminSessions).values({
    id: sessionId,
    userId,
    expiresAt: expiresAt.toISOString(),
  }).run();

  // Set HTTP-only cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/admin',
    expires: expiresAt,
  });

  return sessionId;
}

/**
 * Get current session from cookie
 */
export async function getSession(): Promise<{
  session: { id: string; userId: string; expiresAt: string } | null;
  user: AdminUser | null;
}> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return { session: null, user: null };
  }

  // Find valid (non-expired) session
  const now = new Date().toISOString();
  const sessions = db
    .select()
    .from(adminSessions)
    .where(and(eq(adminSessions.id, sessionId), gt(adminSessions.expiresAt, now)))
    .all();

  if (sessions.length === 0) {
    return { session: null, user: null };
  }

  const session = sessions[0];

  // Get associated user
  const users = db.select().from(adminUsers).where(eq(adminUsers.id, session.userId)).all();

  if (users.length === 0) {
    return { session: null, user: null };
  }

  return { session, user: users[0] };
}

/**
 * Delete session (logout)
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionId) {
    db.delete(adminSessions).where(eq(adminSessions.id, sessionId)).run();
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Extend session expiry (called on authenticated requests)
 */
export async function extendSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) return;

  const newExpiresAt = new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000);

  db.update(adminSessions)
    .set({ expiresAt: newExpiresAt.toISOString() })
    .where(eq(adminSessions.id, sessionId))
    .run();

  // Update cookie expiry
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/admin',
    expires: newExpiresAt,
  });
}

/**
 * Clean up expired sessions (run periodically)
 */
export function cleanupExpiredSessions(): number {
  const now = new Date().toISOString();
  const result = db.delete(adminSessions).where(lt(adminSessions.expiresAt, now)).run();
  return result.changes;
}
