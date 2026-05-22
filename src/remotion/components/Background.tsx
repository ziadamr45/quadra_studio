'use client';

import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface BackgroundProps {
  bg1: string;
  bg2: string;
  accentColor: string;
  patternType: string;
  imageMotion: string;
  backgroundImage?: string;
}

// SVG pattern definitions for each pattern type
const PatternOverlay: React.FC<{
  patternType: string;
  accentColor: string;
  width: number;
  height: number;
}> = ({ patternType, accentColor, width, height }) => {
  if (patternType === 'none') return null;

  // Parse accentColor to RGB for opacity variants
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 201, g: 168, b: 76 };
  };

  const rgb = hexToRgb(accentColor);
  const colorLow = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.06)`;
  const colorMed = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`;

  const patternDefs: Record<string, React.ReactNode> = {
    arabic: (
      <>
        {/* Cross-hatch Islamic pattern */}
        <pattern
          id="arabic-pattern"
          x="0"
          y="0"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="60"
            y2="60"
            stroke={colorMed}
            strokeWidth="0.5"
          />
          <line
            x1="60"
            y1="0"
            x2="0"
            y2="60"
            stroke={colorMed}
            strokeWidth="0.5"
          />
          <circle cx="30" cy="30" r="8" stroke={colorLow} fill="none" strokeWidth="0.3" />
          <circle cx="0" cy="0" r="4" stroke={colorLow} fill="none" strokeWidth="0.3" />
          <circle cx="60" cy="0" r="4" stroke={colorLow} fill="none" strokeWidth="0.3" />
          <circle cx="0" cy="60" r="4" stroke={colorLow} fill="none" strokeWidth="0.3" />
          <circle cx="60" cy="60" r="4" stroke={colorLow} fill="none" strokeWidth="0.3" />
        </pattern>
      </>
    ),
    geometric: (
      <>
        {/* 8-pointed star geometric pattern */}
        <pattern
          id="geometric-pattern"
          x="0"
          y="0"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <polygon
            points="40,5 50,30 75,30 55,45 62,70 40,55 18,70 25,45 5,30 30,30"
            stroke={colorMed}
            fill="none"
            strokeWidth="0.4"
          />
          <polygon
            points="40,20 46,33 60,33 49,41 53,54 40,46 27,54 31,41 20,33 34,33"
            stroke={colorLow}
            fill="none"
            strokeWidth="0.3"
          />
        </pattern>
      </>
    ),
    hexagonal: (
      <>
        <pattern
          id="hexagonal-pattern"
          x="0"
          y="0"
          width="56"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <polygon
            points="28,2 52,16 52,44 28,58 4,44 4,16"
            stroke={colorLow}
            fill="none"
            strokeWidth="0.4"
          />
          <polygon
            points="28,44 52,58 52,86 28,100 4,86 4,58"
            stroke={colorLow}
            fill="none"
            strokeWidth="0.4"
          />
        </pattern>
      </>
    ),
    floral: (
      <>
        <pattern
          id="floral-pattern"
          x="0"
          y="0"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <ellipse
            cx="25"
            cy="25"
            rx="20"
            ry="12"
            stroke={colorLow}
            fill="none"
            strokeWidth="0.3"
            transform="rotate(45 25 25)"
          />
          <ellipse
            cx="75"
            cy="75"
            rx="20"
            ry="12"
            stroke={colorLow}
            fill="none"
            strokeWidth="0.3"
            transform="rotate(-45 75 75)"
          />
          <circle cx="50" cy="50" r="6" stroke={colorMed} fill="none" strokeWidth="0.3" />
          <circle cx="25" cy="25" r="3" stroke={colorLow} fill="none" strokeWidth="0.3" />
          <circle cx="75" cy="75" r="3" stroke={colorLow} fill="none" strokeWidth="0.3" />
        </pattern>
      </>
    ),
    waves: (
      <>
        <pattern
          id="waves-pattern"
          x="0"
          y="0"
          width="120"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0,15 Q30,5 60,15 Q90,25 120,15"
            stroke={colorLow}
            fill="none"
            strokeWidth="0.5"
          />
          <path
            d="M0,25 Q30,15 60,25 Q90,35 120,25"
            stroke={colorLow}
            fill="none"
            strokeWidth="0.3"
          />
        </pattern>
      </>
    ),
    minimal: (
      <>
        <pattern
          id="minimal-pattern"
          x="0"
          y="0"
          width="200"
          height="200"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="100"
            x2="200"
            y2="100"
            stroke={colorLow}
            strokeWidth="0.3"
          />
          <circle cx="100" cy="100" r="1.5" fill={colorMed} />
        </pattern>
      </>
    ),
  };

  const patternDef = patternDefs[patternType];
  if (!patternDef) return null;

  return (
    <svg
      width={width}
      height={height}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <defs>{patternDef}</defs>
      <rect width={width} height={height} fill={`url(#${patternType}-pattern)`} />
    </svg>
  );
};

// Floating particles for cinematic feel
const Particles: React.FC<{
  accentColor: string;
  width: number;
  height: number;
  frame: number;
  fps: number;
}> = ({ accentColor, width, height, frame, fps }) => {
  // Generate deterministic particles
  const particles = useMemo(() => {
    const count = 25;
    const seed = [];
    for (let i = 0; i < count; i++) {
      seed.push({
        x: ((i * 137.5) % width) / width,
        y: ((i * 97.3) % height) / height,
        size: 1 + (i % 3),
        speed: 0.2 + (i % 5) * 0.1,
        opacity: 0.03 + (i % 4) * 0.02,
        phase: (i * 47) % 360,
      });
    }
    return seed;
  }, [width, height]);

  const time = frame / fps;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {particles.map((p, i) => {
        const yOffset = (time * p.speed * 20) % height;
        const xOffset = Math.sin((time * p.speed + p.phase) * 0.5) * 15;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${p.x * 100 + xOffset / width * 100}%`,
              top: `${(p.y * 100 - yOffset / height * 100 + 100) % 100}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: accentColor,
              opacity: p.opacity,
            }}
          />
        );
      })}
    </div>
  );
};

export const Background: React.FC<BackgroundProps> = ({
  bg1,
  bg2,
  accentColor,
  patternType,
  imageMotion,
  backgroundImage,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const totalFrames = Math.max(frame + 1, 1);

  // Image motion transforms
  const imageTransform = (() => {
    if (!backgroundImage) return '';

    const progress = frame / totalFrames;

    switch (imageMotion) {
      case 'zoom-in': {
        const scale = interpolate(frame, [0, totalFrames], [1, 1.15], {
          extrapolateRight: 'clamp',
        });
        return `scale(${scale})`;
      }
      case 'zoom-out': {
        const scale = interpolate(frame, [0, totalFrames], [1.15, 1], {
          extrapolateRight: 'clamp',
        });
        return `scale(${scale})`;
      }
      case 'ken-burns': {
        const scale = interpolate(frame, [0, totalFrames], [1, 1.1], {
          extrapolateRight: 'clamp',
        });
        const tx = interpolate(frame, [0, totalFrames], [0, -20], {
          extrapolateRight: 'clamp',
        });
        const ty = interpolate(frame, [0, totalFrames], [0, -10], {
          extrapolateRight: 'clamp',
        });
        return `scale(${scale}) translate(${tx}px, ${ty}px)`;
      }
      case 'pan': {
        const tx = interpolate(frame, [0, totalFrames], [-30, 30], {
          extrapolateRight: 'clamp',
        });
        return `translateX(${tx}px) scale(1.1)`;
      }
      default:
        return 'scale(1)';
    }
  })();

  return (
    <AbsoluteFill>
      {/* Base gradient background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(145deg, ${bg1} 0%, ${bg2} 50%, ${bg1} 100%)`,
        }}
      />

      {/* Background Image with Motion */}
      {backgroundImage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
          }}
        >
          <img
            src={backgroundImage}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: imageTransform,
              opacity: 0.4,
            }}
          />
          {/* Dark overlay on image for text readability */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(145deg, ${bg1}dd 0%, ${bg2}bb 50%, ${bg1}dd 100%)`,
            }}
          />
        </div>
      )}

      {/* Pattern Overlay */}
      <PatternOverlay
        patternType={patternType}
        accentColor={accentColor}
        width={width}
        height={height}
      />

      {/* Floating Particles */}
      <Particles
        accentColor={accentColor}
        width={width}
        height={height}
        frame={frame}
        fps={fps}
      />

      {/* Vignette Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Decorative Inner Border */}
      <div
        style={{
          position: 'absolute',
          inset: 20,
          border: '1px solid rgba(255,255,255,0.03)',
          borderRadius: 8,
          pointerEvents: 'none',
        }}
      />

      {/* Top Decorative Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(to right, transparent, ${accentColor}30, transparent)`,
        }}
      />

      {/* Bottom Decorative Line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(to right, transparent, ${accentColor}20, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};
