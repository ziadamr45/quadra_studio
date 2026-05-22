'use client';

import React from 'react';
import {
  AbsoluteFill,
  Audio,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { AyahText } from './components/AyahText';
import { Background } from './components/Background';
import { Watermark } from './components/Watermark';
import { ProgressBar } from './components/ProgressBar';

export interface AyahData {
  text: string;
  numberInSurah: number;
  startTime: number;
  endTime: number;
  surahName: string;
}

export interface QuranVideoDesign {
  bg1: string;
  bg2: string;
  accentColor: string;
  textColor: string;
  fontType: string;
  fontSize: number;
  showAyahNumber: boolean;
  showSurahName: boolean;
  showReaderName: string;
  templateId: string;
  patternType: string;
  aspectRatio: string;
  showWatermark: boolean;
  imageMotion: string;
  backgroundImage?: string;
  showProgressBar: boolean;
}

export interface QuranVideoProps {
  ayahs: AyahData[];
  audioUrl: string;
  design: QuranVideoDesign;
  totalDuration: number;
  fps: number;
}

export const QuranVideo: React.FC<QuranVideoProps> = ({
  ayahs,
  audioUrl,
  design,
  totalDuration,
  fps,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Convert current frame to seconds
  const currentTime = frame / fps;

  // Find the currently active ayah based on timestamps
  const activeAyahIndex = ayahs.findIndex(
    (ayah) => currentTime >= ayah.startTime && currentTime < ayah.endTime
  );

  // If no ayah matches (gap between ayahs), find the last passed ayah
  const displayAyahIndex =
    activeAyahIndex >= 0
      ? activeAyahIndex
      : ayahs.reduce((lastIdx, ayah, i) => {
          if (currentTime >= ayah.startTime) return i;
          return lastIdx;
        }, -1);

  const currentAyah = displayAyahIndex >= 0 ? ayahs[displayAyahIndex] : null;

  // Determine if we're in a transition zone (near the start or end of an ayah)
  const fadeDuration = 0.3; // seconds
  const isInFadeZone =
    currentAyah &&
    (currentTime - currentAyah.startTime < fadeDuration ||
      currentAyah.endTime - currentTime < fadeDuration);

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* Background Layer */}
      <Background
        bg1={design.bg1}
        bg2={design.bg2}
        accentColor={design.accentColor}
        patternType={design.patternType}
        imageMotion={design.imageMotion}
        backgroundImage={design.backgroundImage}
      />

      {/* Audio Layer */}
      {audioUrl && (
        <Audio src={audioUrl} />
      )}

      {/* Ayah Content Layer */}
      {currentAyah && (
        <AyahText
          text={currentAyah.text}
          numberInSurah={currentAyah.numberInSurah}
          surahName={currentAyah.surahName}
          showAyahNumber={design.showAyahNumber}
          showSurahName={design.showSurahName}
          showReaderName={design.showReaderName}
          textColor={design.textColor}
          accentColor={design.accentColor}
          fontType={design.fontType}
          fontSize={design.fontSize}
          startTime={currentAyah.startTime}
          endTime={currentAyah.endTime}
          fps={fps}
          aspectRatio={design.aspectRatio}
        />
      )}

      {/* Progress Bar */}
      <ProgressBar
        show={design.showProgressBar}
        accentColor={design.accentColor}
        totalDuration={totalDuration}
        currentAyahIndex={Math.max(displayAyahIndex, 0)}
        totalAyahs={ayahs.length}
      />

      {/* Watermark */}
      <Watermark show={design.showWatermark} />

      {/* Debug: Invisible spacer to ensure proper frame count */}
      <div
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        {durationInFrames}
      </div>
    </AbsoluteFill>
  );
};
