/**
 * Teams API Routes
 *
 * GET /api/admin/teams - List all teams
 * POST /api/admin/teams - Create a new team
 */

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getAllTeamsWithRelations, createTeam } from '@/lib/admin/teams';

export async function GET() {
  try {
    const { session, user } = await getSession();

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const teams = getAllTeamsWithRelations();
    return NextResponse.json({ teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { session, user } = await getSession();

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission
    if (user.role === 'viewer') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();

    // Basic validation
    if (!body.id || !body.name || !body.departmentId) {
      return NextResponse.json(
        { error: 'Missing required fields: id, name, departmentId' },
        { status: 400 }
      );
    }

    const team = createTeam(body, user.id);
    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
}
