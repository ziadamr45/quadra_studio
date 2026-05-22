import { NextRequest, NextResponse } from 'next/server';

// Cache for 24 hours
const CACHE_REVALIDATE = 86400;

// CORS headers helper
function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const surahParam = searchParams.get('surah');
  const recitationIdParam = searchParams.get('recitationId');

  // Validate parameters
  if (!surahParam || !recitationIdParam) {
    return NextResponse.json(
      { error: 'Missing required parameters: surah and recitationId' },
      { status: 400, headers: corsHeaders() }
    );
  }

  const surah = parseInt(surahParam, 10);
  const recitationId = parseInt(recitationIdParam, 10);

  if (isNaN(surah) || surah < 1 || surah > 114) {
    return NextResponse.json(
      { error: 'Invalid surah number. Must be between 1 and 114.' },
      { status: 400, headers: corsHeaders() }
    );
  }

  if (isNaN(recitationId) || recitationId < 1) {
    return NextResponse.json(
      { error: 'Invalid recitationId. Must be a positive number.' },
      { status: 400, headers: corsHeaders() }
    );
  }

  try {
    // Fetch audio file info, chapter info, and ayah text in parallel
    const [audioRes, chapterInfoRes, versesRes] = await Promise.allSettled([
      fetch(
        `https://api.quran.com/api/v4/chapter_recitations/${recitationId}/${surah}`,
        { next: { revalidate: CACHE_REVALIDATE } }
      ),
      fetch(
        `https://api.quran.com/api/v4/chapters/${surah}?language=en`,
        { next: { revalidate: CACHE_REVALIDATE } }
      ),
      fetch(
        `https://api.quran.com/api/v4/verses/by_chapter/${surah}?fields=text_uthmani,verse_key&per_page=300`,
        { next: { revalidate: CACHE_REVALIDATE } }
      ),
    ]);

    // Parse audio info
    let audioUrl = '';
    let totalDuration = 0;

    if (audioRes.status === 'fulfilled' && audioRes.value.ok) {
      const audioData = await audioRes.value.json();
      if (audioData?.audio_file) {
        audioUrl = audioData.audio_file.audio_url || '';
        // Duration is often 0 or missing, so we'll estimate if needed
        totalDuration = audioData.audio_file.duration || 0;
      }
    }

    // If we couldn't get the audio URL from chapter_recitations,
    // construct it from the known CDN pattern
    if (!audioUrl) {
      // Map recitation IDs to their CDN folder names
      const reciterFolders: Record<number, string> = {
        1: 'abdul_basit_murattal',
        2: 'ahmed_ibn_ali_al_ajamy',
        3: 'shatri',
        4: 'sudais',
        5: 'husary',
        6: 'minshawi',
        7: 'mishari_al_afasy',
        8: 'hudhaify',
        9: 'shuraym',
        10: 'maher_al_muaiqly',
        11: 'basfar',
        16: 'hani_arrifai',
        22: 'ayman_suwaid',
      };
      const folder = reciterFolders[recitationId] || 'mishari_al_afasy';
      audioUrl = `https://download.quranicaudio.com/qdc/${folder}/murattal/${surah}.mp3`;
    }

    // Parse chapter info
    let surahName = '';
    let surahNameEn = '';

    if (chapterInfoRes.status === 'fulfilled' && chapterInfoRes.value.ok) {
      const chapterData = await chapterInfoRes.value.json();
      if (chapterData?.chapter) {
        surahName = chapterData.chapter.name_arabic || '';
        surahNameEn = chapterData.chapter.name_simple || '';
      }
    }

    // Parse verses text
    let ayahTexts: Array<{ numberInSurah: number; text: string }> = [];

    if (versesRes.status === 'fulfilled' && versesRes.value.ok) {
      const versesData = await versesRes.value.json();
      if (versesData?.verses) {
        ayahTexts = versesData.verses.map((v: { verse_key: string; text_uthmani: string }) => ({
          numberInSurah: parseInt(v.verse_key.split(':')[1]),
          text: v.text_uthmani || '',
        }));
      }
    }

    // Fallback: fetch from alquran.cloud if Quran.com didn't return verses
    if (ayahTexts.length === 0) {
      try {
        const fallbackRes = await fetch(
          `https://api.alquran.cloud/v1/surah/${surah}`,
          { next: { revalidate: CACHE_REVALIDATE } }
        );
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          if (fallbackData?.data?.ayahs) {
            ayahTexts = fallbackData.data.ayahs.map(
              (a: { numberInSurah: number; text: string }) => ({
                numberInSurah: a.numberInSurah,
                text: a.text,
              })
            );
          }
        }
      } catch {
        // Ignore fallback errors
      }
    }

    if (ayahTexts.length === 0) {
      return NextResponse.json(
        { error: 'Could not fetch verse text data.' },
        { status: 404, headers: corsHeaders() }
      );
    }

    // Calculate proportional timestamps based on text length
    // Each ayah's duration is proportional to its text length
    const totalChars = ayahTexts.reduce((sum, a) => sum + a.text.length, 0);

    // If we don't have a real duration, estimate based on average recitation speed
    // Average Quran recitation: ~150 characters per minute for most reciters
    if (!totalDuration || totalDuration === 0) {
      totalDuration = Math.max((totalChars / 150) * 60, ayahTexts.length * 3);
    }

    // Add 2 seconds padding at the start for Bismillah
    const startPadding = 2;
    const effectiveDuration = totalDuration - startPadding;

    // Calculate timestamps proportionally
    const ayahs = [];
    let currentTime = startPadding;

    for (let i = 0; i < ayahTexts.length; i++) {
      const ayah = ayahTexts[i];
      const proportion = ayah.text.length / totalChars;
      const ayahDuration = effectiveDuration * proportion;

      // Minimum 2 seconds per ayah, maximum 30 seconds
      const clampedDuration = Math.max(2, Math.min(30, ayahDuration));

      ayahs.push({
        numberInSurah: ayah.numberInSurah,
        text: ayah.text,
        startTime: Math.round(currentTime * 100) / 100,
        endTime: Math.round((currentTime + clampedDuration) * 100) / 100,
      });

      currentTime += clampedDuration;
    }

    // Update total duration to match actual calculated end
    totalDuration = currentTime + 1; // Add 1 second padding at end

    const response = {
      ayahs,
      audioUrl,
      totalDuration: Math.round(totalDuration * 100) / 100,
      surahName,
      surahNameEn,
    };

    return NextResponse.json(response, {
      headers: {
        ...corsHeaders(),
        'Cache-Control': `public, s-maxage=${CACHE_REVALIDATE}, stale-while-revalidate=${CACHE_REVALIDATE}`,
      },
    });
  } catch (error) {
    console.error('[Timestamps API] Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching timestamp data.' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
