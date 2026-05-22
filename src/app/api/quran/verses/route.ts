import { NextRequest, NextResponse } from 'next/server';

const CACHE_REVALIDATE = 86400;

// CORS headers helper
function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
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
  const surah = searchParams.get('surah');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const includeEnglish = searchParams.get('english') === 'true';

  if (!surah) {
    return NextResponse.json(
      { error: 'Missing required parameter: surah' },
      { status: 400, headers: corsHeaders() }
    );
  }

  const surahNum = parseInt(surah, 10);

  if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
    return NextResponse.json(
      { error: 'Invalid surah number. Must be between 1 and 114.' },
      { status: 400, headers: corsHeaders() }
    );
  }

  const fromNum = from ? parseInt(from, 10) : 1;
  const toNum = to ? parseInt(to, 10) : 999; // Default to all ayahs

  if (isNaN(fromNum) || isNaN(toNum) || fromNum < 1 || toNum < fromNum) {
    return NextResponse.json(
      { error: 'Invalid range parameters. from must be >= 1 and to must be >= from.' },
      { status: 400, headers: corsHeaders() }
    );
  }

  try {
    // Fetch Arabic text from alquran.cloud
    const arabicRes = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNum}`,
      { next: { revalidate: CACHE_REVALIDATE } }
    );

    if (!arabicRes.ok) {
      return NextResponse.json(
        { error: `Failed to fetch surah from alquran.cloud (status: ${arabicRes.status})` },
        { status: 502, headers: corsHeaders() }
      );
    }

    const arabicData = await arabicRes.json();
    if (arabicData.code !== 200 || !arabicData.data?.ayahs) {
      return NextResponse.json(
        { error: 'Invalid response format from alquran.cloud' },
        { status: 502, headers: corsHeaders() }
      );
    }

    // Fetch English translation if requested (using Sahih International - edition id 131)
    let englishAyahs: Map<number, string> | null = null;

    if (includeEnglish) {
      try {
        // Use the en.sahih edition from alquran.cloud
        const englishRes = await fetch(
          `https://api.alquran.cloud/v1/surah/${surahNum}/en.sahih`,
          { next: { revalidate: CACHE_REVALIDATE } }
        );

        if (englishRes.ok) {
          const englishData = await englishRes.json();
          if (englishData.code === 200 && englishData.data?.ayahs) {
            englishAyahs = new Map<number, string>();
            for (const ayah of englishData.data.ayahs) {
              englishAyahs.set(ayah.numberInSurah, ayah.text);
            }
          }
        }
      } catch (englishError) {
        // Non-critical: English translation is optional
        console.warn('[Verses API] Failed to fetch English translation:', englishError);
      }
    }

    // Filter the ayahs to the requested range
    const allAyahs = arabicData.data.ayahs;
    const surahInfo = {
      number: surahNum,
      name: arabicData.data.name,
      englishName: arabicData.data.englishName,
    };

    const verses = allAyahs
      .filter((a: { numberInSurah: number }) => a.numberInSurah >= fromNum && a.numberInSurah <= toNum)
      .map((a: { number: number; numberInSurah: number; text: string }) => ({
        number: a.number,
        numberInSurah: a.numberInSurah,
        text: a.text,
        ...(englishAyahs && englishAyahs.has(a.numberInSurah)
          ? { englishText: englishAyahs.get(a.numberInSurah) }
          : {}),
        surah: surahInfo,
      }));

    return NextResponse.json(
      { verses },
      {
        headers: {
          ...corsHeaders(),
          'Cache-Control': `public, s-maxage=${CACHE_REVALIDATE}, stale-while-revalidate=${CACHE_REVALIDATE}`,
        },
      }
    );
  } catch (error) {
    console.error('[Verses API] Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching verse data.' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
