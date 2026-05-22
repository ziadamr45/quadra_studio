'use client';

import React from 'react';
import { AbsoluteFill } from 'remotion';

interface WatermarkProps {
  show: boolean;
}

export const Watermark: React.FC<WatermarkProps> = ({ show }) => {
  if (!show) return null;

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: '16px 24px',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 1,
        }}
      >
        {/* Arabic name */}
        <span
          style={{
            fontFamily: '"Amiri", serif',
            fontSize: 11,
            color: '#c9a84c',
            opacity: 0.35,
            letterSpacing: 0.5,
            direction: 'rtl',
          }}
        >
          قدرة استوديو
        </span>
        {/* English subtitle */}
        <span
          style={{
            fontFamily: '"Cairo", sans-serif',
            fontSize: 7,
            color: '#c9a84c',
            opacity: 0.25,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          QUDRA STUDIO
        </span>
      </div>
    </AbsoluteFill>
  );
};
