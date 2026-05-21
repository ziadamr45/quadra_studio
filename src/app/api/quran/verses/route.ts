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

    // Fetch the entire surah at once instead of individual ayahs
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch surah' }, { status: 500 });
    }

    const data = await res.json();
    if (data.code !== 200 || !data.data?.ayahs) {
      return NextResponse.json({ error: 'Invalid response' }, { status: 500 });
    }

    // Filter the ayahs to the requested range
    const allAyahs = data.data.ayahs;
    const verses = allAyahs
      .filter((a: { numberInSurah: number }) => a.numberInSurah >= fromNum && a.numberInSurah <= toNum)
      .map((a: { number: number; numberInSurah: number; text: string }) => ({
        number: a.number,
        numberInSurah: a.numberInSurah,
        text: a.text,
        surah: {
          number: surahNum,
          name: data.data.name,
          englishName: data.data.englishName,
        },
      }));

    return NextResponse.json({ verses });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch verses' }, { status: 500 });
  }
}
