'use client';

import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

interface AyahTextProps {
  text: string;
  numberInSurah: number;
  surahName: string;
  showAyahNumber: boolean;
  showSurahName: boolean;
  showReaderName: string;
  textColor: string;
  accentColor: string;
  fontType: string;
  fontSize: number;
  // Timing
  startTime: number;
  endTime: number;
  fps: number;
  // Container
  aspectRatio: string;
}

export const AyahText: React.FC<AyahTextProps> = ({
  text,
  numberInSurah,
  surahName,
  showAyahNumber,
  showSurahName,
  showReaderName,
  textColor,
  accentColor,
  fontType,
  fontSize,
  startTime,
  endTime,
  fps,
  aspectRatio,
}) => {
  const frame = useCurrentFrame();
  const startFrame = startTime * fps;
  const endFrame = endTime * fps;
  const fadeFrames = 0.3 * fps; // 0.3 seconds fade

  // Calculate opacity with fade in/out
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + fadeFrames, endFrame - fadeFrames, endFrame],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Subtle scale animation for cinematic feel
  const scale = interpolate(
    frame,
    [startFrame, startFrame + fadeFrames * 2, endFrame - fadeFrames * 2, endFrame],
    [0.97, 1, 1, 0.97],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Subtle Y translation for entrance
  const translateY = interpolate(
    frame,
    [startFrame, startFrame + fadeFrames * 2],
    [10, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Font family
  const fontFamily =
    fontType === 'cairo'
      ? '"Cairo", sans-serif'
      : fontType === 'kufi'
        ? '"Cairo", sans-serif'
        : '"Amiri", serif';

  // Responsive font size based on aspect ratio
  const responsiveFontSize =
    aspectRatio === '16:9'
      ? fontSize * 0.7
      : aspectRatio === '1:1'
        ? fontSize * 0.85
        : aspectRatio === '4:5'
          ? fontSize * 0.9
          : fontSize;

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        padding: aspectRatio === '9:16' ? '60px 40px 80px' : '40px 60px',
      }}
    >
      {/* Surah Name */}
      {showSurahName && (
        <div
          style={{
            fontFamily: '"Cairo", sans-serif',
            fontSize: responsiveFontSize * 0.45,
            color: accentColor,
            marginBottom: 16,
            padding: '4px 20px',
            borderRadius: 20,
            border: `1px solid ${accentColor}30`,
            letterSpacing: 1,
          }}
        >
          سورة {surahName}
        </div>
      )}

      {/* Decorative Top Ornament */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
          opacity: 0.6,
        }}
      >
        <div
          style={{
            width: 40,
            height: 1,
            background: `linear-gradient(to right, transparent, ${accentColor})`,
          }}
        />
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            border: `1px solid ${accentColor}`,
            background: 'transparent',
          }}
        />
        <div
          style={{
            width: 40,
            height: 1,
            background: `linear-gradient(to left, transparent, ${accentColor})`,
          }}
        />
      </div>

      {/* Ayah Text with Decorative Frame */}
      <div
        style={{
          position: 'relative',
          padding: '20px 30px',
          maxWidth: '85%',
          textAlign: 'center',
          direction: 'rtl',
        }}
      >
        {/* Decorative corner ornaments */}
        {/* Top-Left */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 20,
            height: 20,
            borderTop: `1px solid ${accentColor}40`,
            borderLeft: `1px solid ${accentColor}40`,
          }}
        />
        {/* Top-Right */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 20,
            height: 20,
            borderTop: `1px solid ${accentColor}40`,
            borderRight: `1px solid ${accentColor}40`,
          }}
        />
        {/* Bottom-Left */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 20,
            height: 20,
            borderBottom: `1px solid ${accentColor}40`,
            borderLeft: `1px solid ${accentColor}40`,
          }}
        />
        {/* Bottom-Right */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 20,
            height: 20,
            borderBottom: `1px solid ${accentColor}40`,
            borderRight: `1px solid ${accentColor}40`,
          }}
        />

        {/* Main Ayah Text */}
        <span
          style={{
            fontFamily,
            fontSize: responsiveFontSize,
            color: textColor,
            lineHeight: 2.2,
            textShadow: `2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.4), 0 0 40px rgba(0,0,0,0.2)`,
            wordWrap: 'break-word',
            direction: 'rtl',
          }}
        >
          {text}
        </span>

        {/* Ayah Number Badge */}
        {showAyahNumber && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: responsiveFontSize * 0.8,
              height: responsiveFontSize * 0.8,
              borderRadius: '50%',
              border: `1px solid ${accentColor}50`,
              color: accentColor,
              fontFamily: '"Amiri", serif',
              fontSize: responsiveFontSize * 0.3,
              marginRight: 6,
              marginLeft: 6,
              verticalAlign: 'middle',
              background: `${accentColor}08`,
            }}
          >
            {numberInSurah}
          </span>
        )}
      </div>

      {/* Decorative Bottom Ornament */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginTop: 20,
          opacity: 0.6,
        }}
      >
        <div
          style={{
            width: 40,
            height: 1,
            background: `linear-gradient(to right, transparent, ${accentColor})`,
          }}
        />
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            border: `1px solid ${accentColor}`,
            background: 'transparent',
          }}
        />
        <div
          style={{
            width: 40,
            height: 1,
            background: `linear-gradient(to left, transparent, ${accentColor})`,
          }}
        />
      </div>

      {/* Reader Name */}
      {showReaderName && (
        <div
          style={{
            fontFamily: '"Cairo", sans-serif',
            fontSize: responsiveFontSize * 0.35,
            color: accentColor,
            marginTop: 16,
            opacity: 0.7,
            letterSpacing: 0.5,
          }}
        >
          ﴾ {showReaderName} ﴿
        </div>
      )}
    </AbsoluteFill>
  );
};
