import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const collection = searchParams.get('collection') || 'bukhari';
  const number = searchParams.get('number');

  if (!number) {
    return NextResponse.json({ error: 'Missing hadith number' }, { status: 400 });
  }

  try {
    // Map our collection IDs to the API's collection names
    const collectionMap: Record<string, string> = {
      bukhari: 'bukhari',
      muslim: 'muslim',
      tirmidhi: 'tirmidhi',
      abuDawud: 'abu-dawud',
      nasai: 'nasai',
      ibnMajah: 'ibn-majah',
      malik: 'malik',
      ahmad: 'ahmad',
    };

    const apiCollection = collectionMap[collection] || collection;
    const res = await fetch(`https://api.hadith.gading.dev/v1/books/${apiCollection}/${number}`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Hadith not found' }, { status: 404 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch hadith' }, { status: 500 });
  }
}
