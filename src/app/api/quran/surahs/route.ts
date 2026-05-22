import { NextResponse } from 'next/server';
import { surahs } from '@/lib/quran-data';

const CACHE_REVALIDATE = 86400 * 30; // Cache for 30 days - this data never changes

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

export async function GET() {
  // The surahs data is static and comes from the local data file
  // No need to fetch from external API since this data never changes
  const surahList = surahs.map((surah) => ({
    id: surah.id,
    name: surah.name,
    englishName: surah.nameEn,
    ayahs: surah.ayahs,
    revelationType: surah.type,
  }));

  return NextResponse.json(
    { surahs: surahList, total: surahList.length },
    {
      headers: {
        ...corsHeaders(),
        'Cache-Control': `public, s-maxage=${CACHE_REVALIDATE}, stale-while-revalidate=${CACHE_REVALIDATE}`,
      },
    }
  );
}
