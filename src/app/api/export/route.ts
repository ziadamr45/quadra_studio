import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// CORS headers helper
function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

// POST - Create a new export job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.mode || !body.config) {
      return NextResponse.json(
        { error: 'Missing required fields: mode and config' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const validModes = ['quran', 'hadith'];
    if (!validModes.includes(body.mode)) {
      return NextResponse.json(
        { error: `Invalid mode. Must be one of: ${validModes.join(', ')}` },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Create export job in database
    const exportJob = await db.exportJob.create({
      data: {
        status: 'pending',
        mode: body.mode,
        config: typeof body.config === 'string' ? body.config : JSON.stringify(body.config),
        progress: 0,
      },
    });

    // Return the job ID immediately for polling
    // The actual Remotion rendering will be implemented later
    // For now, we simulate a mock response
    return NextResponse.json(
      {
        jobId: exportJob.id,
        status: 'pending',
        message: 'Export job created successfully. The Remotion rendering pipeline will process this job.',
        estimatedDuration: '2-5 minutes',
        pollUrl: `/api/export?jobId=${exportJob.id}`,
      },
      {
        status: 201,
        headers: corsHeaders(),
      }
    );
  } catch (error) {
    console.error('[Export API] Error creating job:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while creating the export job.' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// GET - Poll export job status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json(
      { error: 'Missing required parameter: jobId' },
      { status: 400, headers: corsHeaders() }
    );
  }

  try {
    const job = await db.exportJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Export job not found.' },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      {
        jobId: job.id,
        status: job.status,
        progress: job.progress,
        outputUrl: job.outputUrl,
        error: job.error,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
      },
      {
        headers: {
          ...corsHeaders(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('[Export API] Error fetching job:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching the export job.' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
