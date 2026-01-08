/**
 * Session API Route
 *
 * Returns current session status and user info.
 */

import { NextResponse } from 'next/server';
import { getSession, extendSession } from '@/lib/auth/session';

export async function GET() {
  try {
    const { session, user } = await getSession();

    if (!session || !user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Extend session on activity
    await extendSession();

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId,
      },
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { error: 'An error occurred checking session' },
      { status: 500 }
    );
  }
}
