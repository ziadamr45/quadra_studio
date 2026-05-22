'use client';

import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface ProgressBarProps {
  show: boolean;
  accentColor: string;
  totalDuration: number;
  // Current ayah index for dot indicator
  currentAyahIndex: number;
  totalAyahs: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  show,
  accentColor,
  totalDuration,
  currentAyahIndex,
  totalAyahs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!show) return null;

  const totalFrames = totalDuration * fps;
  const progress = interpolate(frame, [0, totalFrames], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const barWidth = '65%';

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: 28,
        pointerEvents: 'none',
      }}
    >
      <div style={{ width: barWidth, position: 'relative' }}>
        {/* Track */}
        <div
          style={{
            height: 2,
            borderRadius: 1,
            backgroundColor: 'rgba(255,255,255,0.06)',
            overflow: 'hidden',
          }}
        >
          {/* Fill */}
          <div
            style={{
              height: '100%',
              width: `${progress * 100}%`,
              backgroundColor: accentColor,
              borderRadius: 1,
              boxShadow: `0 0 6px ${accentColor}40`,
            }}
          />
        </div>

        {/* Ayah indicator dots */}
        {totalAyahs > 1 && (
          <div
            style={{
              position: 'absolute',
              top: -2,
              left: 0,
              right: 0,
              height: 6,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {Array.from({ length: Math.min(totalAyahs, 30) }).map((_, i) => {
              const dotPosition = (i + 0.5) / totalAyahs;
              const isActive = i <= currentAyahIndex;
              const isCurrent = i === currentAyahIndex;

              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${dotPosition * 100}%`,
                    transform: 'translateX(-50%)',
                    width: isCurrent ? 5 : 3,
                    height: isCurrent ? 5 : 3,
                    borderRadius: '50%',
                    backgroundColor: isCurrent
                      ? accentColor
                      : isActive
                        ? `${accentColor}80`
                        : 'rgba(255,255,255,0.1)',
                    boxShadow: isCurrent ? `0 0 4px ${accentColor}60` : 'none',
                    transition: 'all 0.3s ease',
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
