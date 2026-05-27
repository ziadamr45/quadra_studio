'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { getProxiedEveryAyahUrl } from '@/lib/quran-data';
import type { AyahTimestamp, SelectedReader } from '@/lib/store';

export interface AudioSyncState {
  isPlaying: boolean;
  currentAyahIndex: number;
  ayahOpacity: number; // 0-1 for fade effect
  progress: number; // 0-1 overall progress
  isAudioLoading: boolean;
  error: string | null;
}

export interface AudioSyncActions {
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  resume: () => Promise<void>;
}

export function useAudioSync(
  ayahs: AyahTimestamp[],
  reader: SelectedReader | null,
  surahId: number | null,
  onAyahChange?: (index: number, opacity: number) => void,
): AudioSyncState & AudioSyncActions {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(-1);
  const [ayahOpacity, setAyahOpacity] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const currentPlayIndexRef = useRef(-1);
  const isPlayingRef = useRef(false);
  const stopRequestedRef = useRef(false);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopInternal();
    };
  }, []);

  const stopInternal = useCallback(() => {
    stopRequestedRef.current = true;
    isPlayingRef.current = false;

    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = '';
      audioElementRef.current = null;
    }

    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }

    setCurrentAyahIndex(-1);
    setAyahOpacity(0);
    setProgress(0);
    setIsPlaying(false);
  }, []);

  const playAyah = useCallback(
    async (index: number) => {
      if (index >= ayahs.length || stopRequestedRef.current) {
        // All ayahs played
        stopInternal();
        return;
      }

      currentPlayIndexRef.current = index;
      setCurrentAyahIndex(index);
      setProgress(ayahs.length > 0 ? index / ayahs.length : 0);

      const ayah = ayahs[index];

      if (!reader || !surahId) {
        // No reader - just show text with estimated timing (5s per ayah)
        setAyahOpacity(1);
        onAyahChange?.(index, 1);

        await new Promise<void>((resolve) => {
          const timer = setTimeout(resolve, 5000);
          fadeTimeoutRef.current = timer;
        });

        if (stopRequestedRef.current) return;

        // Fade out
        setAyahOpacity(0);
        onAyahChange?.(index, 0);
        await new Promise<void>((resolve) => setTimeout(resolve, 500));

        if (stopRequestedRef.current) return;

        // Play next
        playAyah(index + 1);
        return;
      }

      // Build audio URL via proxy
      const audioUrl = getProxiedEveryAyahUrl(
        reader.everyAyahFolder,
        surahId,
        ayah.numberInSurah,
      );

      try {
        // Create new audio element for this ayah
        const audio = new Audio();
        audio.preload = 'auto';
        audio.crossOrigin = 'anonymous';
        audio.src = audioUrl;

        // Resume or create AudioContext on first play
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
        }
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        // Wait for audio to be ready
        await new Promise<void>((resolve, reject) => {
          audio.oncanplaythrough = () => resolve();
          audio.onerror = () => reject(new Error(`فشل تحميل صوت الآية ${ayah.numberInSurah}`));
          // Timeout after 15s
          const timeout = setTimeout(() => reject(new Error('انتهت مهلة تحميل الصوت')), 15000);
          audio.oncanplaythrough = () => { clearTimeout(timeout); resolve(); };
        });

        if (stopRequestedRef.current) {
          audio.src = '';
          return;
        }

        audioElementRef.current = audio;

        // On play: fade in text
        audio.onplay = () => {
          if (stopRequestedRef.current) return;
          setAyahOpacity(1);
          onAyahChange?.(index, 1);
        };

        // On ended: fade out and play next
        audio.onended = () => {
          if (stopRequestedRef.current) return;

          // Fade out
          setAyahOpacity(0);
          onAyahChange?.(index, 0);

          // Wait for fade-out then play next
          fadeTimeoutRef.current = setTimeout(() => {
            if (!stopRequestedRef.current) {
              playAyah(index + 1);
            }
          }, 500);
        };

        audio.onerror = () => {
          if (stopRequestedRef.current) return;
          console.warn(`Audio error for ayah ${ayah.numberInSurah}, skipping...`);
          // Skip to next ayah on error
          playAyah(index + 1);
        };

        // Start playing
        await audio.play();
      } catch (err) {
        if (stopRequestedRef.current) return;

        console.warn(`Failed to play ayah ${ayah.numberInSurah}:`, err);
        // Skip this ayah and continue
        playAyah(index + 1);
      }
    },
    [ayahs, reader, surahId, stopInternal, onAyahChange],
  );

  const play = useCallback(async () => {
    if (ayahs.length === 0) return;

    stopRequestedRef.current = false;
    isPlayingRef.current = true;
    setIsPlaying(true);
    setIsAudioLoading(true);
    setError(null);

    try {
      setIsAudioLoading(false);
      await playAyah(0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء التشغيل';
      setError(msg);
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  }, [ayahs, playAyah]);

  const pause = useCallback(() => {
    if (audioElementRef.current && !audioElementRef.current.paused) {
      audioElementRef.current.pause();
    }
    setIsPlaying(false);
    isPlayingRef.current = false;
    setAyahOpacity(0);
  }, []);

  const stop = useCallback(() => {
    stopInternal();
  }, [stopInternal]);

  const resume = useCallback(async () => {
    if (currentPlayIndexRef.current >= 0 && currentPlayIndexRef.current < ayahs.length) {
      stopRequestedRef.current = false;
      isPlayingRef.current = true;
      setIsPlaying(true);
      await playAyah(currentPlayIndexRef.current);
    } else {
      await play();
    }
  }, [ayahs, playAyah, play]);

  return {
    isPlaying,
    currentAyahIndex,
    ayahOpacity,
    progress,
    isAudioLoading,
    error,
    play,
    pause,
    stop,
    resume,
  };
}
