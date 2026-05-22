'use client';

import { Player } from '@remotion/player';
import { QuranVideo } from '@/remotion/QuranVideo';
import { useAppStore, type VideoDesign, type QuranProject, type HadithData } from '@/lib/store';
import { videoTemplates, getPatternCSS } from '@/lib/quran-data';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Play, Pause, ChevronLeft, ChevronRight, Book, MessageSquare, Loader2,
} from 'lucide-react';
import { useCallback, useMemo, useRef } from 'react';
import type { PlayerRef } from '@remotion/player';

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
  const hasHadith = hadithData.text.trim().length > 0;
  const displayAyahs = (quranProject.ayahs ?? []).slice(0, 3);

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
            /* ── Quran static preview with up to 3 ayahs ── */
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

              {/* Ayah text – up to 3 */}
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
                  {displayAyahs.map((ayah, i) => (
                    <span key={i}>
                      {ayah.text}
                      {design.showAyahNumber && (
                        <span
                          className="text-[8px] mx-1 inline-flex items-center justify-center w-5 h-5 rounded-full border align-middle"
                          style={{
                            borderColor: `${design.accentColor}50`,
                            color: design.accentTextColor,
                            fontSize: '7px',
                          }}
                        >
                          {ayah.numberInSurah}
                        </span>
                      )}
                    </span>
                  ))}
                  {(quranProject.ayahs?.length ?? 0) > 3 && (
                    <span className="text-white/30 text-[10px]"> ...والمزيد</span>
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

              {/* Progress Bar (static – 0%) */}
              {design.showProgressBar && (
                <div className="w-full px-4 mt-auto">
                  <div className="h-[2px] rounded-full bg-white/[0.06] overflow-hidden" />
                </div>
              )}
            </div>
          ) : (
            /* ── Empty Quran state ── */
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
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px w-4 bg-gradient-to-r from-transparent to-white/10" />
                  <p className="text-white/10 text-[9px] tracking-[0.2em] uppercase">
                    Select Verses
                  </p>
                  <div className="h-px w-4 bg-gradient-to-l from-transparent to-white/10" />
                </div>
              </div>
            </motion.div>
          )
        ) : hasHadith ? (
          /* ── Hadith static preview ── */
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

            {design.showProgressBar && (
              <div className="w-full px-4 mt-auto">
                <div className="h-[2px] rounded-full bg-white/[0.06] overflow-hidden" />
              </div>
            )}
          </div>
        ) : (
          /* ── Empty Hadith state ── */
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
              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-4 bg-gradient-to-r from-transparent to-white/10" />
                <p className="text-white/10 text-[9px] tracking-[0.2em] uppercase">
                  Enter Hadith
                </p>
                <div className="h-px w-4 bg-gradient-to-l from-transparent to-white/10" />
              </div>
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
// VideoPreview – Main component with Remotion Player
// ---------------------------------------------------------------------------
export default function VideoPreview() {
  const {
    design,
    quranProject,
    updateDesign,
    appMode,
    hadithData,
    isPlaying,
    setIsPlaying,
  } = useAppStore();

  const playerRef = useRef<PlayerRef>(null);
  const currentTemplate = videoTemplates.find((t) => t.id === design.templateId);

  // Build Remotion inputProps from current state
  const inputProps = useMemo(
    () => ({
      ayahs: (quranProject.ayahs || []).map((a) => ({
        ...a,
        surahName: quranProject.surahName || '',
      })),
      audioUrl: quranProject.audioUrl || '',
      design: {
        bg1: design.bg1,
        bg2: design.bg2,
        accentColor: design.accentColor,
        textColor: design.textColor,
        fontType: design.fontType,
        fontSize: design.fontSize,
        showAyahNumber: design.showAyahNumber,
        showSurahName: design.showSurahName,
        showReaderName: quranProject.reader?.name || '',
        templateId: design.templateId,
        patternType: design.patternType,
        aspectRatio: design.aspectRatio,
        showWatermark: design.showWatermark,
        imageMotion: design.imageMotion,
        backgroundImage: design.backgroundImage,
        showProgressBar: design.showProgressBar,
      },
      totalDuration: quranProject.totalDuration || 30,
      fps: 30,
    }),
    [quranProject, design],
  );

  // Calculate duration in frames
  const durationInFrames = useMemo(() => {
    return Math.ceil((quranProject.totalDuration || 30) * 30);
  }, [quranProject.totalDuration]);

  // Get dimensions based on aspect ratio
  const dimensions = useMemo(() => {
    switch (design.aspectRatio) {
      case '9:16':
        return { width: 1080, height: 1920 };
      case '16:9':
        return { width: 1920, height: 1080 };
      case '1:1':
        return { width: 1080, height: 1080 };
      case '4:5':
        return { width: 1080, height: 1350 };
      default:
        return { width: 1080, height: 1920 };
    }
  }, [design.aspectRatio]);

  const hasContent =
    appMode === 'quran'
      ? (quranProject.ayahs?.length ?? 0) > 0
      : hadithData.text.trim().length > 0;

  // Whether the Remotion Player should be shown (needs audio + ayahs)
  const showRemotionPlayer =
    appMode === 'quran' &&
    (quranProject.ayahs?.length ?? 0) > 0 &&
    !!quranProject.audioUrl;

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
    if (showRemotionPlayer && playerRef.current) {
      // Use Remotion Player's native play/pause
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, setIsPlaying, showRemotionPlayer]);

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
          {showRemotionPlayer ? (
            /* ═══════════════════════════════════════════
               Remotion Player – Synchronized Preview
               Uses the SAME QuranVideo composition as export
            ═══════════════════════════════════════════ */
            <Player
              ref={playerRef}
              component={QuranVideo}
              inputProps={inputProps}
              durationInFrames={durationInFrames}
              fps={30}
              compositionWidth={dimensions.width}
              compositionHeight={dimensions.height}
              style={{ width: '100%', height: '100%' }}
              autoPlay={false}
              loop
            />
          ) : (
            /* ═══════════════════════════════════════════
               Static Preview – No audio loaded yet
               Shows background + design + static ayah text
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
          {quranProject.isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-gold animate-spin" />
                <span className="text-xs text-white/70 arabic-text">
                  جارٍ تحميل التلاوة...
                </span>
              </div>
            </div>
          )}

          {/* "Preview" badge – shown only for static preview */}
          {!showRemotionPlayer && hasContent && (
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

        <Button
          variant="outline"
          size="icon"
          onClick={handlePlayPause}
          disabled={!hasContent}
          className={`h-12 w-12 rounded-full border-gold/20 hover:border-gold/40 hover:bg-gold/10 transition-all duration-300 ${
            hasContent && !isPlaying ? 'pulse-gold' : ''
          }`}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 text-gold" />
          ) : (
            <Play className="h-5 w-5 text-gold ml-0.5" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextTemplate}
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-[10px] text-muted-foreground arabic-text">
        استخدم الأسهم لتغيير القالب
      </div>

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
                className="text-[10px] bg-secondary rounded px-1.5 py-0.5 text-foreground/80 arabic-text"
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
