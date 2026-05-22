'use client';

import React from 'react';
import { Composition } from 'remotion';
import { QuranVideo, QuranVideoProps } from './QuranVideo';

// Aspect ratio dimensions
const ASPECT_DIMENSIONS: Record<
  string,
  { width: number; height: number }
> = {
  '9:16': { width: 1080, height: 1920 },
  '16:9': { width: 1920, height: 1080 },
  '1:1': { width: 1080, height: 1080 },
  '4:5': { width: 1080, height: 1350 },
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Default composition for 9:16 aspect ratio (most common for Quran videos) */}
      <Composition
        id="QuranVideo-9-16"
        component={QuranVideo}
        durationInFrames={900} // 30 seconds at 30fps (will be overridden by props)
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ayahs: [],
          audioUrl: '',
          design: {
            bg1: '#0a0a0c',
            bg2: '#12121a',
            accentColor: '#c9a84c',
            textColor: '#f4f4f5',
            fontType: 'amiri',
            fontSize: 28,
            showAyahNumber: true,
            showSurahName: true,
            showReaderName: '',
            templateId: 'noor',
            patternType: 'arabic',
            aspectRatio: '9:16',
            showWatermark: true,
            imageMotion: 'none',
            showProgressBar: true,
          },
          totalDuration: 30,
          fps: 30,
        }}
      />
      {/* 16:9 composition */}
      <Composition
        id="QuranVideo-16-9"
        component={QuranVideo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          ayahs: [],
          audioUrl: '',
          design: {
            bg1: '#0a0a0c',
            bg2: '#12121a',
            accentColor: '#c9a84c',
            textColor: '#f4f4f5',
            fontType: 'amiri',
            fontSize: 28,
            showAyahNumber: true,
            showSurahName: true,
            showReaderName: '',
            templateId: 'noor',
            patternType: 'arabic',
            aspectRatio: '16:9',
            showWatermark: true,
            imageMotion: 'none',
            showProgressBar: true,
          },
          totalDuration: 30,
          fps: 30,
        }}
      />
      {/* 1:1 composition */}
      <Composition
        id="QuranVideo-1-1"
        component={QuranVideo}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          ayahs: [],
          audioUrl: '',
          design: {
            bg1: '#0a0a0c',
            bg2: '#12121a',
            accentColor: '#c9a84c',
            textColor: '#f4f4f5',
            fontType: 'amiri',
            fontSize: 28,
            showAyahNumber: true,
            showSurahName: true,
            showReaderName: '',
            templateId: 'noor',
            patternType: 'arabic',
            aspectRatio: '1:1',
            showWatermark: true,
            imageMotion: 'none',
            showProgressBar: true,
          },
          totalDuration: 30,
          fps: 30,
        }}
      />
      {/* 4:5 composition */}
      <Composition
        id="QuranVideo-4-5"
        component={QuranVideo}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={{
          ayahs: [],
          audioUrl: '',
          design: {
            bg1: '#0a0a0c',
            bg2: '#12121a',
            accentColor: '#c9a84c',
            textColor: '#f4f4f5',
            fontType: 'amiri',
            fontSize: 28,
            showAyahNumber: true,
            showSurahName: true,
            showReaderName: '',
            templateId: 'noor',
            patternType: 'arabic',
            aspectRatio: '4:5',
            showWatermark: true,
            imageMotion: 'none',
            showProgressBar: true,
          },
          totalDuration: 30,
          fps: 30,
        }}
      />
    </>
  );
};

// Helper: Get composition dimensions from aspect ratio
export function getCompositionDimensions(aspectRatio: string): {
  width: number;
  height: number;
} {
  return ASPECT_DIMENSIONS[aspectRatio] || ASPECT_DIMENSIONS['9:16'];
}

// Helper: Get composition ID from aspect ratio
export function getCompositionId(aspectRatio: string): string {
  const normalized = aspectRatio.replace(':', '-');
  return `QuranVideo-${normalized}`;
}

// Helper: Calculate duration in frames
export function calculateDurationInFrames(
  totalDurationSeconds: number,
  fps: number = 30
): number {
  return Math.ceil(totalDurationSeconds * fps);
}

// Re-export types
export type { QuranVideoProps, QuranVideoDesign, AyahData } from './QuranVideo';
