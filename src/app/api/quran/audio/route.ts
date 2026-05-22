import { NextRequest, NextResponse } from 'next/server';

// Proxy audio from alquran.cloud to avoid CORS issues
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'QudraStudio/1.0',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Audio fetch failed' }, { status: res.status });
    }

    const audioBuffer = await res.arrayBuffer();
    const headers = new Headers();
    headers.set('Content-Type', 'audio/mpeg');
    headers.set('Cache-Control', 'public, max-age=86400');
    headers.set('Content-Length', audioBuffer.byteLength.toString());

    return new NextResponse(audioBuffer, { headers });
  } catch {
    return NextResponse.json({ error: 'Audio proxy error' }, { status: 500 });
  }
}
