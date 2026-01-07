import { NextResponse } from 'next/server';

/**
 * Pod Proxy API Route
 *
 * This route proxies requests to Solid Pods from the server side.
 * Needed because in containerized environments (like KASM), the browser
 * may not be able to reach localhost services directly due to network
 * isolation between the browser and container network namespaces.
 *
 * In production, this wouldn't be needed as Pods would be on public URLs.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const podUrl = searchParams.get('url');

  if (!podUrl) {
    return NextResponse.json(
      { error: 'Missing url parameter' },
      { status: 400 }
    );
  }

  // Only allow proxying to localhost Pod server in development
  const allowedHosts = ['localhost:3002', '127.0.0.1:3002'];
  try {
    const targetUrl = new URL(podUrl);
    if (!allowedHosts.includes(targetUrl.host)) {
      return NextResponse.json(
        { error: 'Proxy only allowed for local Pod server' },
        { status: 403 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Invalid URL' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(podUrl, {
      headers: {
        Accept: 'text/turtle, application/ld+json, application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Pod returned ${response.status}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') || 'text/turtle';
    const body = await response.text();

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to connect to Pod server',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 502 }
    );
  }
}
