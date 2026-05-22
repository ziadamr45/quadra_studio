// Quran Timestamp API - Fetches synchronized ayah timing data from Quran.com API v4
// This is CRITICAL for frame-accurate ayah display in Remotion compositions

import type { AyahData } from '@/remotion/QuranVideo';

// Reciter name to Quran.com recitation ID mapping
export const RECITATION_IDS: Record<string, number> = {
  'Mishary Al-Afasy': 7,
  'Abdul Basit Abdul Samad': 1,
  'Abdul Rahman Al-Sudais': 4,
  'Abu Bakr Ash-Shatri': 3,
  'Ahmed Al-Ajmy': 2,
  'Saood Ash-Shuraym': 9,
  'Hani Ar-Rifai': 16,
  'Mahmoud Khalil Al-Husary': 5,
  'Ali Al-Hudhaify': 8,
  'Maher Al-Muaiqly': 10,
  'Muhammad Siddiq Al-Minshawi': 6,
  'Abdullah Basfar': 11,
  'Ayman Suwayd': 22,
};

// Reverse mapping: recitation ID to reciter name
export const RECITATION_NAMES: Record<number, string> = Object.fromEntries(
  Object.entries(RECITATION_IDS).map(([name, id]) => [id, name])
);

/**
 * Parse a timestamp string like "1:23" into seconds (83)
 * Handles formats: "M:SS", "MM:SS", "H:MM:SS"
 */
export function parseTimestamp(ts: string): number {
  const parts = ts.trim().split(':').map(Number);

  if (parts.length === 2) {
    // M:SS or MM:SS
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // H:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  return 0;
}

/**
 * Fetch surah audio with timestamps from Quran.com API v4
 * Returns ayah data with start/end times and full audio URL
 */
export async function fetchSurahAudioWithTimestamps(
  surahNumber: number,
  recitationId: number
): Promise<{ ayahs: AyahData[]; audioUrl: string; totalDuration: number }> {
  // Fetch ayah timestamps from the recitation endpoint
  const timestampResponse = await fetch(
    `https://api.quran.com/api/v4/recitations/${recitationId}/by_chapter/${surahNumber}`
  );

  if (!timestampResponse.ok) {
    throw new Error(
      `Failed to fetch timestamps: ${timestampResponse.status} ${timestampResponse.statusText}`
    );
  }

  const timestampData = await timestampResponse.json();

  // Fetch full chapter audio URL
  const audioResponse = await fetch(
    `https://api.quran.com/api/v4/chapter_recitations/${recitationId}/${surahNumber}`
  );

  if (!audioResponse.ok) {
    throw new Error(
      `Failed to fetch audio URL: ${audioResponse.status} ${audioResponse.statusText}`
    );
  }

  const audioData = await audioResponse.json();
  const audioUrl: string = audioData?.audio_file?.audio_url || '';

  // Parse the ayah data with timestamps
  const ayahs: AyahData[] = [];
  const audioFiles = timestampData?.audio_files || [];

  for (let i = 0; i < audioFiles.length; i++) {
    const ayahAudio = audioFiles[i];
    const startTime = parseTimestamp(ayahAudio.timestamp || '0:00');

    // End time is the start time of the next ayah, or total duration for last ayah
    let endTime: number;
    if (i < audioFiles.length - 1) {
      endTime = parseTimestamp(audioFiles[i + 1].timestamp || '0:00');
    } else {
      // For the last ayah, estimate 10 seconds or use audio duration
      endTime = startTime + 10;
    }

    ayahs.push({
      text: '', // Will be filled separately from verses API
      numberInSurah: ayahAudio.verse_key
        ? parseInt(ayahAudio.verse_key.split(':')[1])
        : i + 1,
      startTime,
      endTime,
      surahName: '', // Will be filled separately
    });
  }

  // Calculate total duration from the last ayah's end time
  const totalDuration =
    ayahs.length > 0 ? ayahs[ayahs.length - 1].endTime : 30;

  return {
    ayahs,
    audioUrl,
    totalDuration,
  };
}

/**
 * Fetch ayah text for a surah to fill in the text field
 * Uses the Quran.com API v4 verses endpoint
 */
export async function fetchSurahVerses(
  surahNumber: number
): Promise<Array<{ numberInSurah: number; text: string; surahName: string }>> {
  const response = await fetch(
    `https://api.quran.com/api/v4/verses/by_chapter/${surahNumber}?fields=text_uthmani,verse_key&per_page=300`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch verses: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  const verses = data?.verses || [];

  return verses.map(
    (verse: { verse_number?: number; text_uthmani?: string; verse_key?: string }) => ({
      numberInSurah: verse.verse_key
        ? parseInt(verse.verse_key.split(':')[1])
        : verse.verse_number || 0,
      text: verse.text_uthmani || '',
      surahName: '', // Caller can add this
    })
  );
}

/**
 * Complete fetch: Get both timestamps and verse text, merge them
 */
export async function fetchCompleteSurahData(
  surahNumber: number,
  recitationId: number,
  surahName: string
): Promise<{ ayahs: AyahData[]; audioUrl: string; totalDuration: number }> {
  // Fetch both in parallel
  const [timestampResult, verses] = await Promise.all([
    fetchSurahAudioWithTimestamps(surahNumber, recitationId),
    fetchSurahVerses(surahNumber),
  ]);

  // Merge verse text into timestamp data
  const verseMap = new Map(
    verses.map((v) => [v.numberInSurah, v.text])
  );

  const mergedAyahs = timestampResult.ayahs.map((ayah) => ({
    ...ayah,
    text: verseMap.get(ayah.numberInSurah) || ayah.text,
    surahName,
  }));

  return {
    ayahs: mergedAyahs,
    audioUrl: timestampResult.audioUrl,
    totalDuration: timestampResult.totalDuration,
  };
}

/**
 * Get recitation ID from reader ID string
 */
export function getRecitationIdFromReaderId(readerId: string): number {
  // Map our internal reader IDs to Quran.com recitation IDs
  const readerToRecitation: Record<string, number> = {
    'ar.alafasy': 7, // Mishary Al-Afasy
    'ar.abdulbasitmurattal': 1, // Abdul Basit Abdul Samad
    'ar.abdulbasitmujawwad': 1, // Abdul Basit (Mujawwad) - same reciter
    'ar.sudais': 4, // Abdul Rahman Al-Sudais
    'ar.shaatree': 3, // Abu Bakr Ash-Shatri
    'ar.ahmedajamy': 2, // Ahmed Al-Ajmy
    'ar.saaborimuneer': 9, // Saood Ash-Shuraym
    'ar.hanirifai': 16, // Hani Ar-Rifai
    'ar.husary': 5, // Mahmoud Khalil Al-Husary
    'ar.hudhaify': 8, // Ali Al-Hudhaify
    'ar.mahermuaiqly': 10, // Maher Al-Muaiqly
    'ar.minshawi': 6, // Muhammad Siddiq Al-Minshawi
    'ar.abdullahbasfar': 11, // Abdullah Basfar
    'ar.aymanswaid': 22, // Ayman Suwayd
  };

  return readerToRecitation[readerId] || 7; // Default to Mishary Al-Afasy
}
