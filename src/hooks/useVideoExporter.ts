'use client';

import { useState, useRef, useCallback } from 'react';
import { getProxiedEveryAyahUrl } from '@/lib/quran-data';
import type { AyahTimestamp, VideoDesign, SelectedReader, HadithData } from '@/lib/store';
import { drawVerseFrame } from '@/lib/video-engine';

export interface VideoExporterState {
  isExporting: boolean;
  progress: number;
  error: string | null;
}

export interface VideoExporterActions {
  exportVideo: () => Promise<Blob | null>;
  cancel: () => void;
}

interface ExportConfig {
  width: number;
  height: number;
  fps: number;
  ayahs: AyahTimestamp[];
  surahName: string;
  surahId: number | null;
  design: VideoDesign;
  reader: SelectedReader | null;
  readerName: string;
  mode: 'quran' | 'hadith';
  hadithData: HadithData;
}

export function useVideoExporter(config: ExportConfig): VideoExporterState & VideoExporterActions {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const cancelRef = useRef(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const cancel = useCallback(() => {
    cancelRef.current = true;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsExporting(false);
    setProgress(0);
  }, []);

  const exportVideo = useCallback(async (): Promise<Blob | null> => {
    const { width, height, fps, ayahs, surahName, surahId, design, reader, readerName, mode, hadithData } = config;

    if (ayahs.length === 0 && mode === 'quran') {
      setError('لا توجد آيات للتصدير');
      return null;
    }

    cancelRef.current = false;
    setIsExporting(true);
    setProgress(0);
    setError(null);

    try {
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;

      // Create AudioContext with MediaStreamDestination for audio
      const audioCtx = new AudioContext();
      const dest = audioCtx.createMediaStreamDestination();

      // Get canvas video stream
      const videoStream = canvas.captureStream(fps);

      // Combine video and audio tracks
      const combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...dest.stream.getAudioTracks(),
      ]);

      // Determine supported mimeType
      let mimeType = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8,opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
        }
      }

      // Create MediaRecorder
      const recorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: 8000000,
      });
      mediaRecorderRef.current = recorder;

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      // Start recording
      recorder.start(100);

      // Pre-fetch and decode all audio buffers
      const audioBuffers: AudioBuffer[] = [];
      if (reader && surahId && mode === 'quran') {
        for (let i = 0; i < ayahs.length; i++) {
          if (cancelRef.current) return null;

          const ayah = ayahs[i];
          const audioUrl = getProxiedEveryAyahUrl(reader.everyAyahFolder, surahId, ayah.numberInSurah);

          try {
            const response = await fetch(audioUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            audioBuffers.push(audioBuffer);
          } catch (err) {
            console.warn(`Failed to load audio for ayah ${ayah.numberInSurah}:`, err);
            // Create silent buffer as fallback (2 seconds)
            const sampleRate = audioCtx.sampleRate;
            const silentBuffer = audioCtx.createBuffer(1, sampleRate * 2, sampleRate);
            audioBuffers.push(silentBuffer);
          }

          // Update progress for audio loading phase (0-30%)
          setProgress(Math.round(((i + 1) / ayahs.length) * 30));
        }
      }

      if (cancelRef.current) return null;

      // Schedule all audio playback
      const audioStartTime = audioCtx.currentTime + 0.1; // Small offset
      let currentOffset = audioStartTime;

      for (let i = 0; i < audioBuffers.length; i++) {
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffers[i];
        source.connect(dest);
        source.start(currentOffset);
        currentOffset += audioBuffers[i].duration;
      }

      // Calculate total duration
      const totalDuration = audioBuffers.length > 0
        ? audioBuffers.reduce((sum, buf) => sum + buf.duration, 0)
        : ayahs.length * 5; // Fallback: 5 seconds per ayah

      // Track start time for each ayah
      const ayahStartTimes: number[] = [];
      let offset = audioStartTime;
      for (const buf of audioBuffers) {
        ayahStartTimes.push(offset);
        offset += buf.duration;
      }

      // Animate canvas frames
      const startTime = performance.now();
      const totalMs = totalDuration * 1000;

      await new Promise<void>((resolve) => {
        function animate() {
          if (cancelRef.current) {
            recorder.stop();
            resolve();
            return;
          }

          const elapsed = performance.now() - startTime;

          if (elapsed >= totalMs) {
            // Draw final frame
            const lastAyah = Math.max(0, ayahs.length - 1);
            drawVerseFrame(ctx, {
              ...config,
              width,
              height,
              fps,
              surahName,
              readerName,
              mode,
              hadithData,
              audioUrls: [],
              onProgress: () => {},
            }, lastAyah, 1.0);
            setProgress(100);

            // Stop after a short delay to ensure last frame is captured
            setTimeout(() => {
              if (recorder.state !== 'inactive') recorder.stop();
              resolve();
            }, 200);
            return;
          }

          // Determine current ayah based on elapsed time
          const currentTime = audioStartTime + elapsed / 1000;
          let currentAyahIdx = 0;
          for (let i = ayahStartTimes.length - 1; i >= 0; i--) {
            if (currentTime >= ayahStartTimes[i]) {
              currentAyahIdx = i;
              break;
            }
          }

          // Calculate fade opacity
          let opacity = 1;
          const currentAyahStart = ayahStartTimes[currentAyahIdx] || audioStartTime;
          const currentAyahEnd = (ayahStartTimes[currentAyahIdx + 1] || currentOffset);
          const timeIntoAyah = currentTime - currentAyahStart;
          const ayahDuration = currentAyahEnd - currentAyahStart;
          const fadeTime = 0.5; // 500ms fade

          if (timeIntoAyah < fadeTime) {
            // Fade in
            opacity = timeIntoAyah / fadeTime;
          } else if (ayahDuration - timeIntoAyah < fadeTime) {
            // Fade out
            opacity = Math.max(0, (ayahDuration - timeIntoAyah) / fadeTime);
          }

          // Calculate progress for current ayah
          const ayahProgress = ayahs.length > 0 ? (currentAyahIdx + 0.5) / ayahs.length : 0;

          // Draw frame with opacity
          ctx.globalAlpha = opacity;
          drawVerseFrame(ctx, {
            ...config,
            width,
            height,
            fps,
            surahName,
            readerName,
            mode,
            hadithData,
            audioUrls: [],
            onProgress: () => {},
          }, currentAyahIdx, ayahProgress);
          ctx.globalAlpha = 1;

          // Update progress (30-100% range for rendering)
          const renderProgress = 30 + Math.round((elapsed / totalMs) * 70);
          setProgress(Math.min(renderProgress, 99));

          requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
      });

      // Wait for recorder to finalize
      const blob = await new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          const finalBlob = new Blob(chunks, { type: mimeType });
          resolve(finalBlob);
        };
        if (recorder.state === 'inactive') {
          const finalBlob = new Blob(chunks, { type: mimeType });
          resolve(finalBlob);
        }
      });

      // Cleanup
      audioCtx.close();

      if (cancelRef.current) {
        setIsExporting(false);
        setProgress(0);
        return null;
      }

      setProgress(100);
      setIsExporting(false);
      return blob;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء التصدير';
      setError(msg);
      setIsExporting(false);
      setProgress(0);
      return null;
    }
  }, [config]);

  return {
    isExporting,
    progress,
    error,
    exportVideo,
    cancel,
  };
}
