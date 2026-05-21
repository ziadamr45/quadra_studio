'use client';

import { useAppStore } from '@/lib/store';
import { videoTemplates, getPatternCSS, getAudioUrl } from '@/lib/quran-data';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Book,
  MessageSquare,
} from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';

export default function VideoPreview() {
  const {
    design,
    selectedVerses,
    updateDesign,
    selectedReader,
    appMode,
    hadithData,
  } = useAppStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTemplate = videoTemplates.find((t) => t.id === design.templateId);

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
        return 'max-h-[min(58vh,540px)]';
      case '16:9':
        return 'max-h-[min(40vh,360px)]';
      case '1:1':
        return 'max-h-[min(42vh,400px)]';
      case '4:5':
        return 'max-h-[min(50vh,460px)]';
      default:
        return 'max-h-[min(58vh,540px)]';
    }
  };

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
    if (appMode === 'quran' && selectedVerses.length > 0 && selectedReader) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        const firstVerse = selectedVerses[0];
        const audioUrl = `/api/quran/audio?url=${encodeURIComponent(
          getAudioUrl(selectedReader.audioId, firstVerse.surahId, firstVerse.ayahNumber)
        )}`;

        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play().catch(() => {});
          setIsPlaying(true);
        } else {
          const audio = new Audio(audioUrl);
          audio.onended = () => setIsPlaying(false);
          audio.onerror = () => setIsPlaying(false);
          audio.play().catch(() => {});
          audioRef.current = audio;
          setIsPlaying(true);
        }
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  }, [appMode, selectedVerses, selectedReader, isPlaying]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const hasContent =
    appMode === 'quran' ? selectedVerses.length > 0 : hadithData.text.trim().length > 0;
  const displayVerses = selectedVerses.slice(0, 5);

  const getFontSize = () => {
    if (design.aspectRatio === '16:9') return '0.85rem';
    return `${design.fontSize * 0.04}rem`;
  };

  const getTextStyle = () => {
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

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Preview Container */}
      <div className="relative w-full flex items-center justify-center">
        <motion.div
          layout
          className={`relative w-full ${getAspectClass()} ${getMaxHeightClass()} rounded-xl overflow-hidden gold-glow border border-gold/20 shadow-2xl shadow-black/40`}
        >
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
                  design.patternDensity
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

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 py-8 text-center">
            {!hasContent ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-5"
              >
                <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center relative">
                  {appMode === 'quran' ? (
                    <Book className="w-9 h-9 text-gold/30" />
                  ) : (
                    <MessageSquare className="w-9 h-9 text-emerald/30" />
                  )}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <Play className="w-2.5 h-2.5 text-gold/50 ml-px" />
                  </div>
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-white/25 text-sm arabic-text font-medium">
                    {appMode === 'quran'
                      ? 'اختر الآيات لمعاينة الفيديو'
                      : 'أدخل نص الحديث لمعاينة الفيديو'}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-px w-4 bg-gradient-to-r from-transparent to-white/10" />
                    <p className="text-white/10 text-[9px] tracking-[0.2em] uppercase">
                      {appMode === 'quran' ? 'Select Verses' : 'Enter Hadith'}
                    </p>
                    <div className="h-px w-4 bg-gradient-to-l from-transparent to-white/10" />
                  </div>
                </div>
              </motion.div>
            ) : appMode === 'quran' ? (
              <div className="flex flex-col items-center gap-3 w-full h-full">
                {/* Surah Name Header */}
                {design.showSurahName && selectedVerses[0] && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="h-px w-6 bg-gradient-to-r from-transparent to-gold/40" />
                    <span
                      className="text-[11px] px-3 py-1 rounded-full border border-white/10 tracking-wide arabic-text"
                      style={{ color: design.accentTextColor, borderColor: `${design.accentColor}30` }}
                    >
                      سورة {selectedVerses[0].surahName}
                    </span>
                    <div className="h-px w-6 bg-gradient-to-l from-transparent to-gold/40" />
                  </motion.div>
                )}

                {/* Decorative Bismillah */}
                {selectedVerses[0]?.surahId !== 1 && selectedVerses[0]?.surahId !== 9 && (
                  <div
                    className="text-[10px] opacity-30 arabic-quran"
                    style={{ color: design.accentTextColor }}
                  >
                    ﷽
                  </div>
                )}

                {/* Quran Text */}
                {design.showText && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedVerses.map((v) => `${v.surahId}:${v.ayahNumber}`).join(',')}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
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
                        {displayVerses.map((v, i) => (
                          <span key={i}>
                            {v.ayahText}
                            {design.showAyahNumber && (
                              <span
                                className="text-[8px] mx-1 inline-flex items-center justify-center w-5 h-5 rounded-full border align-middle"
                                style={{
                                  borderColor: `${design.accentColor}50`,
                                  color: design.accentTextColor,
                                  fontSize: '7px',
                                }}
                              >
                                {v.ayahNumber}
                              </span>
                            )}
                          </span>
                        ))}
                        {selectedVerses.length > 5 && (
                          <span className="text-white/30 text-[10px]"> ...والمزيد</span>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* Reader Name Footer */}
                {design.showReaderName && selectedReader && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-[10px] tracking-wide"
                    style={{ color: design.accentTextColor, opacity: 0.7 }}
                  >
                    ﴾ {design.customReaderName || selectedReader.name} ﴿
                  </motion.div>
                )}

                {/* Progress Bar */}
                {design.showProgressBar && (
                  <div className="w-full px-4 mt-auto">
                    <div className="h-[2px] rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: design.accentColor }}
                        initial={{ width: '0%' }}
                        animate={{ width: isPlaying ? '65%' : '0%' }}
                        transition={{ duration: isPlaying ? 6 : 0.3, ease: 'linear' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Hadith Preview */
              <div className="flex flex-col items-center gap-3 w-full h-full">
                {/* Hadith Source Badge */}
                {hadithData.source && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="h-px w-6 bg-gradient-to-r from-transparent to-emerald/40" />
                    <span
                      className="text-[10px] px-3 py-1 rounded-full border border-white/10 tracking-wide arabic-text"
                      style={{ color: design.accentTextColor, borderColor: `${design.accentColor}30` }}
                    >
                      {hadithData.source}
                    </span>
                    <div className="h-px w-6 bg-gradient-to-l from-transparent to-emerald/40" />
                  </motion.div>
                )}

                {/* Hadith Text */}
                {design.showText && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={hadithData.text}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
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
                  </AnimatePresence>
                )}

                {/* Narrator */}
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

                {/* Progress Bar */}
                {design.showProgressBar && (
                  <div className="w-full px-4 mt-auto">
                    <div className="h-[2px] rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: design.accentColor }}
                        initial={{ width: '0%' }}
                        animate={{ width: isPlaying ? '65%' : '0%' }}
                        transition={{ duration: isPlaying ? 6 : 0.3 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Decorative Line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

          {/* Template Name Badge - Top Right */}
          {currentTemplate && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-md px-2 py-0.5 flex items-center gap-1">
              <span className="text-[9px] text-gold/80">{currentTemplate.icon}</span>
              <span className="text-[9px] text-white/60 arabic-text">{currentTemplate.name}</span>
            </div>
          )}

          {/* Aspect Ratio Badge - Top Left */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-md px-2 py-0.5">
            <span className="text-[9px] text-white/50 font-mono">{design.aspectRatio}</span>
          </div>

          {/* Qudra Studio Watermark - Bottom Left */}
          {design.showWatermark && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 opacity-60">
              <span className="text-[8px] text-gold font-bold tracking-[0.25em]">QUDRA</span>
              <span className="text-[8px] text-white/50 tracking-[0.2em] font-medium">STUDIO</span>
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

      {/* Template Navigation Hint */}
      <div className="text-[10px] text-muted-foreground arabic-text">
        استخدم الأسهم لتغيير القالب
      </div>

      {/* Selected Verses Summary */}
      {appMode === 'quran' && selectedVerses.length > 0 && (
        <div className="w-full bg-card rounded-lg border border-border p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground arabic-text">الآيات المختارة</span>
            <span className="text-xs text-gold font-semibold">
              {selectedVerses.length} آية
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedVerses.slice(0, 8).map((v, i) => (
              <span
                key={i}
                className="text-[10px] bg-secondary rounded px-1.5 py-0.5 text-foreground/80 arabic-text"
              >
                {v.surahName} {v.ayahNumber}
              </span>
            ))}
            {selectedVerses.length > 8 && (
              <span className="text-[10px] text-muted-foreground">
                +{selectedVerses.length - 8}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
