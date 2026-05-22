import { NextRequest, NextResponse } from 'next/server';

const CACHE_REVALIDATE = 86400;

// CORS headers helper
function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Range',
    'Access-Control-Expose-Headers': 'Content-Range, Content-Length, Accept-Ranges',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const audioUrl = searchParams.get('url');

  if (!audioUrl) {
    return NextResponse.json(
      { error: 'Missing required parameter: url' },
      { status: 400, headers: corsHeaders() }
    );
  }

  // Validate URL format to prevent SSRF
  try {
    const parsedUrl = new URL(audioUrl);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: 'Only HTTP(S) URLs are allowed.' },
        { status: 400, headers: corsHeaders() }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Invalid URL format.' },
      { status: 400, headers: corsHeaders() }
    );
  }

  try {
    // Build headers for the upstream request
    const upstreamHeaders: HeadersInit = {
      'User-Agent': 'QudraStudio/2.0',
    };

    // Forward Range header for seeking support
    const rangeHeader = request.headers.get('Range');
    if (rangeHeader) {
      upstreamHeaders['Range'] = rangeHeader;
    }

    const upstreamRes = await fetch(audioUrl, {
      headers: upstreamHeaders,
    });

    if (!upstreamRes.ok && upstreamRes.status !== 206) {
      return NextResponse.json(
        { error: `Failed to fetch audio (upstream status: ${upstreamRes.status})` },
        { status: 502, headers: corsHeaders() }
      );
    }

    // Determine content type
    const contentType = upstreamRes.headers.get('Content-Type') || 'audio/mpeg';

    // Build response headers
    const responseHeaders = new Headers({
      ...corsHeaders(),
      'Content-Type': contentType,
      'Cache-Control': `public, max-age=${CACHE_REVALIDATE}, stale-while-revalidate=${CACHE_REVALIDATE}`,
      'Accept-Ranges': 'bytes',
    });

    // Forward relevant headers from upstream
    const contentLength = upstreamRes.headers.get('Content-Length');
    const contentRange = upstreamRes.headers.get('Content-Range');

    if (contentLength) {
      responseHeaders.set('Content-Length', contentLength);
    }
    if (contentRange) {
      responseHeaders.set('Content-Range', contentRange);
    }

    // Handle range response (206 Partial Content)
    const statusCode = upstreamRes.status === 206 ? 206 : 200;

    // Stream the audio data back
    const audioBuffer = await upstreamRes.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: statusCode,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[Audio Proxy API] Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while proxying audio.' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
