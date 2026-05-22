import { NextRequest, NextResponse } from 'next/server';

const CACHE_REVALIDATE = 86400;

// Collection ID mapping for the hadith API
const collectionMap: Record<string, string> = {
  bukhari: 'bukhari',
  muslim: 'muslim',
  tirmidhi: 'tirmidhi',
  abuDawud: 'abu-dawud',
  abudawud: 'abu-dawud',
  nasai: 'nasai',
  ibnMajah: 'ibn-majah',
  ibnmajah: 'ibn-majah',
  malik: 'malik',
  ahmad: 'ahmad',
};

// Curated hadiths for when the API is unavailable
const curatedHadiths: Record<string, Array<{ number: number; text: string; narrator: string; grade: string }>> = {
  bukhari: [
    { number: 1, text: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى', narrator: 'عمر بن الخطاب رضي الله عنه', grade: 'صحيح' },
    { number: 2, text: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ', narrator: 'أبو هريرة رضي الله عنه', grade: 'صحيح' },
    { number: 3, text: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ ضَيْفَهُ', narrator: 'أبو هريرة رضي الله عنه', grade: 'صحيح' },
    { number: 4, text: 'لا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ', narrator: 'أنس بن مالك رضي الله عنه', grade: 'صحيح' },
    { number: 5, text: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ', narrator: 'عبد الله بن عمرو رضي الله عنهما', grade: 'صحيح' },
  ],
  muslim: [
    { number: 1, text: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى أَكُونَ أَحَبَّ إِلَيْهِ مِنْ وَالِدِهِ وَوَلَدِهِ', narrator: 'أنس بن مالك رضي الله عنه', grade: 'صحيح' },
    { number: 2, text: 'لَا يَدْخُلُ الْجَنَّةَ مَنْ لَا يَأْمَنُ جَارُهُ بَوَائِقَهُ', narrator: 'أبو هريرة رضي الله عنه', grade: 'صحيح' },
    { number: 3, text: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ', narrator: 'عثمان بن عفان رضي الله عنه', grade: 'صحيح' },
  ],
  tirmidhi: [
    { number: 1, text: 'إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ', narrator: 'أبو هريرة رضي الله عنه', grade: 'صحيح' },
    { number: 2, text: 'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ', narrator: 'معاذ بن جبل رضي الله عنه', grade: 'حسن' },
  ],
  abuDawud: [
    { number: 1, text: 'أَفْضَلُ الأَعْمَالِ أَدْوَمُهَا وَإِنْ قَلَّ', narrator: 'عائشة رضي الله عنها', grade: 'صحيح' },
  ],
  nasai: [
    { number: 1, text: 'الدُّعَاءُ هُوَ الْعِبَادَةُ', narrator: 'النعمان بن بشير رضي الله عنه', grade: 'صحيح' },
  ],
  ibnMajah: [
    { number: 1, text: 'الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ ارْحَمُوا أَهْلَ الأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ', narrator: 'جرير بن عبد الله رضي الله عنه', grade: 'صحيح' },
  ],
  malik: [
    { number: 1, text: 'لَقِّنُوا مَوْتَاكُمْ لَا إِلَهَ إِلَّا اللَّهُ', narrator: 'أبو سعيد الخدري رضي الله عنه', grade: 'صحيح' },
  ],
  ahmad: [
    { number: 1, text: 'إِنَّ اللَّهَ كَتَبَ الْإِحْسَانَ عَلَى كُلِّ شَيْءٍ', narrator: 'شداد بن أوس رضي الله عنه', grade: 'صحيح' },
  ],
};

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
  const collection = searchParams.get('collection') || 'bukhari';
  const number = searchParams.get('number');
  const curated = searchParams.get('curated') === 'true';

  // If curated mode or no specific hadith number, return curated hadiths
  if (curated || !number) {
    const normalizedCollection = collection.toLowerCase();
    const hadiths = curatedHadiths[normalizedCollection] || curatedHadiths['bukhari'];

    return NextResponse.json(
      { hadiths },
      {
        headers: {
          ...corsHeaders(),
          'Cache-Control': `public, s-maxage=${CACHE_REVALIDATE}, stale-while-revalidate=${CACHE_REVALIDATE}`,
        },
      }
    );
  }

  // Fetch specific hadith from API
  const apiCollection = collectionMap[collection] || collection;

  try {
    const res = await fetch(
      `https://api.hadith.gading.dev/v1/books/${apiCollection}/${number}`,
      { next: { revalidate: CACHE_REVALIDATE } }
    );

    if (!res.ok) {
      // Fallback to curated hadiths if API fails
      const normalizedCollection = collection.toLowerCase();
      const hadiths = curatedHadiths[normalizedCollection] || curatedHadiths['bukhari'];

      return NextResponse.json(
        {
          hadiths,
          fallback: true,
          message: 'External API unavailable, returning curated hadiths.',
        },
        {
          headers: {
            ...corsHeaders(),
            'Cache-Control': `public, s-maxage=300, stale-while-revalidate=600`,
          },
        }
      );
    }

    const data = await res.json();

    // Normalize the API response
    const hadith = data.data || data;
    const hadiths = [{
      number: hadith.number || parseInt(number, 10),
      text: hadith.arab || hadith.text || '',
      narrator: hadith.name || hadith.narrator || '',
      grade: hadith.grade || 'غير محدد',
    }];

    return NextResponse.json(
      { hadiths },
      {
        headers: {
          ...corsHeaders(),
          'Cache-Control': `public, s-maxage=${CACHE_REVALIDATE}, stale-while-revalidate=${CACHE_REVALIDATE}`,
        },
      }
    );
  } catch (error) {
    console.error('[Hadith API] Error:', error);

    // Fallback to curated hadiths
    const normalizedCollection = collection.toLowerCase();
    const hadiths = curatedHadiths[normalizedCollection] || curatedHadiths['bukhari'];

    return NextResponse.json(
      {
        hadiths,
        fallback: true,
        message: 'External API error, returning curated hadiths.',
      },
      {
        status: 200,
        headers: {
          ...corsHeaders(),
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  }
}
