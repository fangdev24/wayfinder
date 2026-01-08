/**
 * Sign-In API Route
 *
 * Mock GOV.UK Sign-in for demo purposes.
 * In production, this would redirect to GOV.UK Sign-in OAuth flow.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createSession } from '@/lib/auth/session';

// Demo password - in production, use GOV.UK Sign-in OAuth
const DEMO_PASSWORD = process.env.ADMIN_DEMO_PASSWORD || 'demo123';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check demo password
    if (password !== DEMO_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Find user by email
    const users = db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email.toLowerCase()))
      .all();

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Create session
    await createSession(user.id);

    // Update last login
    db.update(adminUsers)
      .set({ lastLogin: new Date().toISOString() })
      .where(eq(adminUsers.id, user.id))
      .run();

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json(
      { error: 'An error occurred during sign-in' },
      { status: 500 }
    );
  }
}
