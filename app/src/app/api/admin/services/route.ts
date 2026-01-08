/**
 * Services API Routes
 *
 * GET /api/admin/services - List all services
 * POST /api/admin/services - Create a new service
 */

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getAllServices, createService } from '@/lib/admin/services';

export async function GET() {
  try {
    const { session, user } = await getSession();

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const services = getAllServices();
    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { session, user } = await getSession();

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission (viewers can't create)
    if (user.role === 'viewer') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();

    // Basic validation
    if (!body.id || !body.name || !body.type || !body.departmentId || !body.teamId) {
      return NextResponse.json(
        { error: 'Missing required fields: id, name, type, departmentId, teamId' },
        { status: 400 }
      );
    }

    const service = createService(body, user.id);
    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
