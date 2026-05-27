'use client';

import { useAppStore, type VideoDesign, type QuranProject, type HadithData } from '@/lib/store';
import { videoTemplates, getPatternCSS } from '@/lib/quran-data';
import { useAudioSync } from '@/hooks/useAudioSync';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Play, Pause, ChevronLeft, ChevronRight, Book, MessageSquare, Loader2, Square,
} from 'lucide-react';
import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

// ---------------------------------------------------------------------------
// StaticPreview – non-animated design preview when no audio is loaded yet
// ---------------------------------------------------------------------------
interface StaticPreviewProps {
  design: VideoDesign;
  quranProject: QuranProject;
  appMode: 'quran' | 'hadith';
  hadithData: HadithData;
}

function StaticPreview({ design, quranProject, appMode, hadithData }: StaticPreviewProps) {
  const hasAyahs = (quranProject.ayahs?.length ?? 0) > 0;
  const displayAyah = (quranProject.ayahs ?? [])[0]; // Show only first ayah

  const getFontSize = () => {
    if (design.aspectRatio === '16:9') return '0.85rem';
    return `${design.fontSize * 0.04}rem`;
  };

  const getTextStyle = (): React.CSSProperties => {
    switch (design.textStyle) {
      case 'bold':
        return { fontWeight: 'bold' as const };
      case 'with-shadow':
        return { textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.4)' };
      case 'outlined':
        return {
          textShadow:
            '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 8px rgba(0,0,0,0.8)',
        };
      default:
        return { textShadow: '1px 1px 4px rgba(0,0,0,0.5)' };
    }
  };

  const getTextPositionClass = () => {
    switch (design.textPosition) {
      case 'top':
        return 'justify-start pt-16';
      case 'bottom':
        return 'justify-end pb-16';
      default:
        return 'justify-center';
    }
  };

  return (
    <div className="absolute inset-0">
      {/* Background Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(145deg, ${design.bg1} 0%, ${design.bg2} 50%, ${design.bg1} 100%)`,
        }}
      />

      {/* Background Image */}
      {design.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${design.backgroundImage})` }}
        />
      )}

      {/* Pattern Overlay */}
      {design.showPattern && design.patternType !== 'none' && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: getPatternCSS(
              design.patternType,
              design.accentColor,
              design.patternDensity,
            ),
            backgroundSize: `${(design.patternDensity + 1) * 12}px ${
              (design.patternDensity + 1) * 12
            }px`,
          }}
        />
      )}

      {/* Decorative Border Inside */}
      <div className="absolute inset-3 border border-white/[0.04] rounded-lg pointer-events-none" />

      {/* Top Decorative Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Content */}
      <div
        className={`relative z-10 flex flex-col items-center h-full px-6 py-8 text-center ${getTextPositionClass()}`}
      >
        {appMode === 'quran' ? (
          hasAyahs ? (
            <div className="flex flex-col items-center gap-3 w-full h-full">
              {/* Surah Name Header */}
              {design.showSurahName && quranProject.surahName && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="h-px w-6 bg-gradient-to-r from-transparent to-gold/40" />
                  <span
                    className="text-[11px] px-3 py-1 rounded-full border border-white/10 tracking-wide arabic-text"
                    style={{
                      color: design.accentTextColor,
                      borderColor: `${design.accentColor}30`,
                    }}
                  >
                    سورة {quranProject.surahName}
                  </span>
                  <div className="h-px w-6 bg-gradient-to-l from-transparent to-gold/40" />
                </motion.div>
              )}

              {/* Bismillah */}
              {quranProject.surahId !== 1 && quranProject.surahId !== 9 && (
                <div
                  className="text-[10px] opacity-30 arabic-quran"
                  style={{ color: design.accentTextColor }}
                >
                  ﷽
                </div>
              )}

              {/* Single ayah preview */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex-1 flex items-center justify-center"
              >
                <div
                  className="arabic-quran px-2 leading-[2.4]"
                  style={{
                    color: design.textColor,
                    fontSize: getFontSize(),
                    ...getTextStyle(),
                  }}
                >
                  {displayAyah?.text}
                  {design.showAyahNumber && displayAyah && (
                    <span
                      className="text-[8px] mx-1 inline-flex items-center justify-center w-5 h-5 rounded-full border align-middle"
                      style={{
                        borderColor: `${design.accentColor}50`,
                        color: design.accentTextColor,
                        fontSize: '7px',
                      }}
                    >
                      {displayAyah.numberInSurah}
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Reader Name Footer */}
              {design.showReaderName && quranProject.reader && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-[10px] tracking-wide"
                  style={{ color: design.accentTextColor, opacity: 0.7 }}
                >
                  ﴾ {quranProject.reader.name} ﴿
                </motion.div>
              )}

              {/* Progress Bar (static) */}
              {design.showProgressBar && (
                <div className="w-full px-4 mt-auto">
                  <div className="h-[2px] rounded-full bg-white/[0.06] overflow-hidden" />
                </div>
              )}
            </div>
          ) : (
            /* Empty Quran state */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-5"
            >
              <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center relative">
                <Book className="w-9 h-9 text-gold/30" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 text-gold/50 ml-px" />
                </div>
              </div>
              <div className="space-y-2 text-center">
                <p className="text-white/25 text-sm arabic-text font-medium">
                  اختر الآيات لمعاينة الفيديو
                </p>
              </div>
            </motion.div>
          )
        ) : hadithData.text.trim().length > 0 ? (
          /* Hadith static preview */
          <div className="flex flex-col items-center gap-3 w-full h-full">
            {hadithData.collection && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2"
              >
                <div className="h-px w-6 bg-gradient-to-r from-transparent to-emerald/40" />
                <span
                  className="text-[10px] px-3 py-1 rounded-full border border-white/10 tracking-wide arabic-text"
                  style={{
                    color: design.accentTextColor,
                    borderColor: `${design.accentColor}30`,
                  }}
                >
                  {hadithData.collection}
                </span>
                <div className="h-px w-6 bg-gradient-to-l from-transparent to-emerald/40" />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex items-center justify-center"
            >
              <div
                className="arabic-text px-2 leading-[2.2]"
                style={{
                  color: design.textColor,
                  fontSize: design.aspectRatio === '16:9' ? '0.85rem' : '1rem',
                  ...getTextStyle(),
                }}
              >
                {hadithData.text}
              </div>
            </motion.div>

            {hadithData.narrator && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[10px] tracking-wide"
                style={{ color: design.accentTextColor, opacity: 0.7 }}
              >
                ﴾ {hadithData.narrator} ﴿
              </motion.div>
            )}
          </div>
        ) : (
          /* Empty Hadith state */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-5"
          >
            <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center relative">
              <MessageSquare className="w-9 h-9 text-emerald/30" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Play className="w-2.5 h-2.5 text-gold/50 ml-px" />
              </div>
            </div>
            <div className="space-y-2 text-center">
              <p className="text-white/25 text-sm arabic-text font-medium">
                أدخل نص الحديث لمعاينة الفيديو
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Decorative Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      {/* Watermark */}
      {design.showWatermark && (
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 opacity-60 z-20">
          <span className="text-[8px] text-gold font-bold tracking-[0.25em]">QUDRA</span>
          <span className="text-[8px] text-white/50 tracking-[0.2em] font-medium">STUDIO</span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LivePreview – Canvas-based synchronized playback with sequential audio
// ---------------------------------------------------------------------------
interface LivePreviewProps {
  design: VideoDesign;
  quranProject: QuranProject;
  appMode: 'quran' | 'hadith';
  hadithData: HadithData;
  audioSync: ReturnType<typeof useAudioSync>;
}

function LivePreview({ design, quranProject, appMode, hadithData, audioSync }: LivePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 360, height: 640 });
  const animFrameRef = useRef<number>(0);
  const kenBurnsRef = useRef(1.0); // Scale factor for Ken Burns

  // Resize canvas to match container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setCanvasSize({ width: Math.round(width), height: Math.round(height) });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Render canvas frames
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvasSize.width;
    const h = canvasSize.height;

    // Ken Burns effect - slow zoom
    if (design.imageMotion === 'ken-burns' || design.imageMotion === 'zoom-in') {
      kenBurnsRef.current = Math.min(kenBurnsRef.current + 0.0003, 1.15);
    } else if (design.imageMotion === 'zoom-out') {
      kenBurnsRef.current = Math.max(kenBurnsRef.current - 0.0003, 0.85);
    } else {
      kenBurnsRef.current = 1.0;
    }

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, design.bg1);
    gradient.addColorStop(0.5, design.bg2);
    gradient.addColorStop(1, design.bg1);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Background image with motion
    if (design.backgroundImage) {
      ctx.save();
      const scale = kenBurnsRef.current;
      const dx = (w - w * scale) / 2;
      const dy = (h - h * scale) / 2;
      ctx.drawImage(
        design.backgroundImage as unknown as CanvasImageSource,
        dx, dy, w * scale, h * scale,
      );
      ctx.restore();
    }

    // Vignette
    const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.7);
    vignette.addColorStop(0, 'transparent');
    vignette.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    // Determine ayah text and opacity
    const currentIdx = audioSync.currentAyahIndex;
    const opacity = audioSync.ayahOpacity;

    if (currentIdx >= 0 && currentIdx < (quranProject.ayahs?.length ?? 0)) {
      const ayah = quranProject.ayahs[currentIdx];
      const fontFamily = design.fontType === 'amiri' || design.fontType === 'naskh' || design.fontType === 'thuluth'
        ? 'Amiri' : 'Cairo';

      ctx.save();
      ctx.globalAlpha = opacity;

      // Surah name
      if (design.showSurahName && quranProject.surahName) {
        ctx.font = `500 ${Math.max(11, w * 0.032)}px "${fontFamily}", serif`;
        ctx.fillStyle = design.accentTextColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(`سورة ${quranProject.surahName}`, w / 2, h * 0.08);
      }

      // Ayah text with word wrap
      const fontSize = Math.max(12, design.fontSize * (w / 400));
      ctx.font = `${design.textStyle === 'bold' ? 'bold' : 'normal'} ${fontSize}px "${fontFamily}", serif`;
      ctx.fillStyle = design.textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (design.textStyle === 'with-shadow') {
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      } else {
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
      }

      const maxWidth = w * 0.8;
      const text = ayah.text;
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (ctx.measureText(testLine).width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);

      const lineHeight = fontSize * 2.2;
      let startY: number;
      switch (design.textPosition) {
        case 'top':
          startY = h * 0.15;
          break;
        case 'bottom':
          startY = h * 0.6 - (lines.length * lineHeight) / 2 + lineHeight / 2;
          break;
        default:
          startY = (h - lines.length * lineHeight) / 2 + lineHeight / 2;
      }

      lines.forEach((line, i) => {
        ctx.fillText(line, w / 2, startY + i * lineHeight);

        if (design.showAyahNumber && i === lines.length - 1) {
          ctx.save();
          ctx.font = `${Math.max(8, fontSize * 0.3)}px "${fontFamily}", serif`;
          ctx.fillStyle = design.accentTextColor;
          ctx.shadowBlur = 0;
          const lineMetrics = ctx.measureText(line);
          const numX = w / 2 + lineMetrics.width / 2 + 14;
          const numY = startY + i * lineHeight;

          ctx.beginPath();
          ctx.arc(numX, numY - 4, Math.max(6, fontSize * 0.2), 0, Math.PI * 2);
          ctx.strokeStyle = design.accentColor + '50';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillText(`${ayah.numberInSurah}`, numX, numY);
          ctx.restore();
        }
      });

      // Reader name
      if (design.showReaderName && quranProject.reader) {
        ctx.save();
        ctx.font = `400 ${Math.max(9, w * 0.024)}px "${fontFamily}", serif`;
        ctx.fillStyle = design.accentTextColor;
        ctx.globalAlpha = opacity * 0.7;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.shadowBlur = 0;
        ctx.fillText(`﴾ ${quranProject.reader.name} ﴿`, w / 2, h * 0.88);
        ctx.restore();
      }

      ctx.restore();
    }

    // Progress bar
    if (design.showProgressBar) {
      ctx.save();
      const barY = h - 20;
      const barW = w * 0.7;
      const barX = (w - barW) / 2;
      const barH = 2;

      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(barX, barY, barW, barH);

      ctx.fillStyle = design.accentColor;
      ctx.fillRect(barX, barY, barW * audioSync.progress, barH);
      ctx.restore();
    }

    // Watermark
    if (design.showWatermark) {
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.font = '8px "Geist Mono", monospace';
      ctx.fillStyle = '#c9a84c';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText('QUDRA STUDIO', 8, h - 8);
      ctx.restore();
    }

    // Top decorative line
    const topLine = ctx.createLinearGradient(0, 0, w, 0);
    topLine.addColorStop(0, 'transparent');
    topLine.addColorStop(0.5, design.accentColor + '30');
    topLine.addColorStop(1, 'transparent');
    ctx.fillStyle = topLine;
    ctx.fillRect(0, 0, w, 1);

    // Continue animation loop
    animFrameRef.current = requestAnimationFrame(() => {
      // Force re-render by triggering a state update indirectly
      // The canvas will be re-drawn when audioSync state changes
    });

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [
    canvasSize,
    design,
    quranProject,
    audioSync.currentAyahIndex,
    audioSync.ayahOpacity,
    audioSync.progress,
  ]);

  // Force canvas re-render at 30fps when playing
  useEffect(() => {
    if (!audioSync.isPlaying) return;

    let frameId: number;
    const render = () => {
      // Trigger a re-render by accessing the canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const evt = new Event('resize');
        window.dispatchEvent(evt);
      }
      frameId = requestAnimationFrame(render);
    };
    frameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(frameId);
  }, [audioSync.isPlaying]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="w-full h-full"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// VideoPreview – Main component with Canvas-based preview
// ---------------------------------------------------------------------------
export default function VideoPreview() {
  const {
    design,
    quranProject,
    updateDesign,
    appMode,
    hadithData,
  } = useAppStore();

  const currentTemplate = videoTemplates.find((t) => t.id === design.templateId);

  // Use audio sync hook
  const audioSync = useAudioSync(
    quranProject.ayahs || [],
    quranProject.reader,
    quranProject.surahId,
  );

  const hasContent =
    appMode === 'quran'
      ? (quranProject.ayahs?.length ?? 0) > 0
      : hadithData.text.trim().length > 0;

  // Whether live preview is available (needs reader + ayahs)
  const canLivePreview =
    appMode === 'quran' &&
    (quranProject.ayahs?.length ?? 0) > 0 &&
    !!quranProject.reader;

  // Template navigation
  const handlePrevTemplate = useCallback(() => {
    const currentIndex = videoTemplates.findIndex((t) => t.id === design.templateId);
    const prevIndex = currentIndex <= 0 ? videoTemplates.length - 1 : currentIndex - 1;
    const prev = videoTemplates[prevIndex];
    updateDesign({
      templateId: prev.id,
      bg1: prev.bg1,
      bg2: prev.bg2,
      accentColor: prev.accentColor,
      patternType: prev.patternType,
    });
  }, [design.templateId, updateDesign]);

  const handleNextTemplate = useCallback(() => {
    const currentIndex = videoTemplates.findIndex((t) => t.id === design.templateId);
    const nextIndex = currentIndex >= videoTemplates.length - 1 ? 0 : currentIndex + 1;
    const next = videoTemplates[nextIndex];
    updateDesign({
      templateId: next.id,
      bg1: next.bg1,
      bg2: next.bg2,
      accentColor: next.accentColor,
      patternType: next.patternType,
    });
  }, [design.templateId, updateDesign]);

  const handlePlayPause = useCallback(() => {
    if (audioSync.isPlaying) {
      audioSync.pause();
    } else {
      audioSync.play();
    }
  }, [audioSync]);

  const handleStop = useCallback(() => {
    audioSync.stop();
  }, [audioSync]);

  // Get aspect class for container
  const getAspectClass = () => {
    switch (design.aspectRatio) {
      case '9:16':
        return 'aspect-[9/16]';
      case '16:9':
        return 'aspect-[16/9]';
      case '1:1':
        return 'aspect-square';
      case '4:5':
        return 'aspect-[4/5]';
      default:
        return 'aspect-[9/16]';
    }
  };

  const getMaxHeightClass = () => {
    switch (design.aspectRatio) {
      case '9:16':
        return 'max-h-[58vh]';
      case '16:9':
        return 'max-h-[40vh]';
      case '1:1':
        return 'max-h-[42vh]';
      case '4:5':
        return 'max-h-[50vh]';
      default:
        return 'max-h-[58vh]';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Preview Container */}
      <div className="relative w-full flex items-center justify-center">
        <motion.div
          layout
          className={`relative w-full ${getAspectClass()} ${getMaxHeightClass()} rounded-xl overflow-hidden gold-glow border border-gold/20 shadow-2xl shadow-black/40`}
        >
          {audioSync.isPlaying ? (
            /* ═══════════════════════════════════════════
               Live Preview – Canvas-based synchronized playback
            ═══════════════════════════════════════════ */
            <LivePreview
              design={design}
              quranProject={quranProject}
              appMode={appMode}
              hadithData={hadithData}
              audioSync={audioSync}
            />
          ) : (
            /* ═══════════════════════════════════════════
               Static Preview – Design preview only
            ═══════════════════════════════════════════ */
            <StaticPreview
              design={design}
              quranProject={quranProject}
              appMode={appMode}
              hadithData={hadithData}
            />
          )}

          {/* Template Name Badge – Top Right */}
          {currentTemplate && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-md px-2 py-0.5 flex items-center gap-1 z-20">
              <span className="text-[9px] text-gold/80">{currentTemplate.icon}</span>
              <span className="text-[9px] text-white/60 arabic-text">{currentTemplate.name}</span>
            </div>
          )}

          {/* Aspect Ratio Badge – Top Left */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-md px-2 py-0.5 z-20">
            <span className="text-[9px] text-white/50 font-mono">{design.aspectRatio}</span>
          </div>

          {/* Loading overlay */}
          {audioSync.isAudioLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-gold animate-spin" />
                <span className="text-xs text-white/70 arabic-text">
                  جارٍ تحميل الصوت...
                </span>
              </div>
            </div>
          )}

          {/* Error overlay */}
          {audioSync.error && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
              <div className="flex flex-col items-center gap-2 text-center px-4">
                <span className="text-xs text-red-400 arabic-text">{audioSync.error}</span>
              </div>
            </div>
          )}

          {/* Current ayah indicator */}
          {audioSync.isPlaying && audioSync.currentAyahIndex >= 0 && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded-md px-2 py-0.5 z-20">
              <span className="text-[9px] text-gold/80 arabic-text">
                آية {audioSync.currentAyahIndex + 1} من {quranProject.ayahs?.length ?? 0}
              </span>
            </div>
          )}

          {/* "Preview" badge */}
          {!audioSync.isPlaying && hasContent && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded-md px-2 py-0.5 z-20">
              <span className="text-[8px] text-white/40 tracking-wider uppercase">
                Preview
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Preview Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevTemplate}
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {audioSync.isPlaying ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePlayPause}
              className="h-12 w-12 rounded-full border-gold/20 hover:border-gold/40 hover:bg-gold/10 transition-all duration-300"
            >
              <Pause className="h-5 w-5 text-gold" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleStop}
              className="h-10 w-10 rounded-full border border-border hover:border-red-400/40 hover:bg-red-500/10 transition-all duration-300"
            >
              <Square className="h-4 w-4 text-red-400" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="icon"
            onClick={handlePlayPause}
            disabled={!hasContent || !canLivePreview}
            className={`h-12 w-12 rounded-full border-gold/20 hover:border-gold/40 hover:bg-gold/10 transition-all duration-300 ${
              hasContent && canLivePreview ? 'pulse-gold' : ''
            }`}
          >
            <Play className="h-5 w-5 text-gold ml-0.5" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextTemplate}
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {!canLivePreview && hasContent && appMode === 'quran' && (
        <div className="text-[10px] text-gold/60 arabic-text text-center">
          اختر قارئاً لتفعيل المعاينة المتزامنة
        </div>
      )}

      {canLivePreview && !audioSync.isPlaying && (
        <div className="text-[10px] text-muted-foreground arabic-text text-center">
          اضغط تشغيل لمعاينة الفيديو بالتزامن مع الصوت
        </div>
      )}

      {/* Selected Verses Summary */}
      {appMode === 'quran' && (quranProject.ayahs?.length ?? 0) > 0 && (
        <div className="w-full bg-card rounded-lg border border-border p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground arabic-text">الآيات المختارة</span>
            <span className="text-xs text-gold font-semibold">
              {quranProject.ayahs?.length ?? 0} آية
            </span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-foreground/70 arabic-text">
              {quranProject.surahName}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {quranProject.ayahFrom} - {quranProject.ayahTo}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {(quranProject.ayahs || []).slice(0, 8).map((ayah, i) => (
              <span
                key={i}
                className={`text-[10px] rounded px-1.5 py-0.5 arabic-text transition-colors ${
                  audioSync.isPlaying && audioSync.currentAyahIndex === i
                    ? 'bg-gold/20 text-gold'
                    : 'bg-secondary text-foreground/80'
                }`}
              >
                {ayah.numberInSurah}
              </span>
            ))}
            {(quranProject.ayahs?.length ?? 0) > 8 && (
              <span className="text-[10px] text-muted-foreground">
                +{(quranProject.ayahs?.length ?? 0) - 8}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
