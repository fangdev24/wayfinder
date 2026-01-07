import { NextResponse } from 'next/server';
import { fetchSolidProfile } from '@/lib/solid-client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const webId = searchParams.get('webId') || 'http://localhost:3002/flint-rivers/profile/card#me';

  try {
    const profile = await fetchSolidProfile(webId);
    return NextResponse.json({
      success: true,
      webId,
      profile,
      message: profile ? 'Profile fetched successfully' : 'No profile data returned',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      webId,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
