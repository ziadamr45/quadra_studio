import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const surah = searchParams.get('surah');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (!surah || !from || !to) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const surahNum = parseInt(surah);
    const fromNum = parseInt(from);
    const toNum = parseInt(to);

    const verses: { number: number; numberInSurah: number; text: string; surah: { number: number; name: string; englishName: string } }[] = [];
    for (let i = fromNum; i <= toNum; i++) {
      const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNum}:${i}`, {
        next: { revalidate: 86400 },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.code === 200 && data.data) {
          verses.push({
            number: data.data.number,
            numberInSurah: data.data.numberInSurah,
            text: data.data.text,
            surah: {
              number: data.data.surah.number,
              name: data.data.surah.name,
              englishName: data.data.surah.englishName,
            },
          });
        }
      }
    }

    // Also try to get English translation
    let englishVerses: { numberInSurah: number; text: string }[] = [];
    try {
      for (let i = fromNum; i <= toNum; i++) {
        const res = await fetch(
          `https://api.alquran.cloud/v1/ayah/${surahNum}:${i}/en.sahih`,
          { next: { revalidate: 86400 } }
        );
        if (res.ok) {
          const data = await res.json();
          if (data.code === 200 && data.data) {
            englishVerses.push({
              numberInSurah: data.data.numberInSurah,
              text: data.data.text,
            });
          }
        }
      }
    } catch {
      // English translation is optional
    }

    return NextResponse.json({ verses, englishVerses });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch verses' }, { status: 500 });
  }
}
