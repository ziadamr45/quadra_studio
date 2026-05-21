'use client';

import { useAppStore } from '@/lib/store';
import { videoTemplates } from '@/lib/quran-data';
import { Book, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function VideoPreview() {
  const { design, selectedVerses, updateDesign, selectedReader, appMode, hadithData } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTemplate = videoTemplates.find((t) => t.id === design.templateId);

  const getAspectClass = () => {
    switch (design.aspectRatio) {
      case '9:16': return 'aspect-[9/16] max-h-[60vh]';
      case '16:9': return 'aspect-[16/9] max-h-[45vh]';
      case '1:1': return 'aspect-square max-h-[45vh]';
      case '4:5': return 'aspect-[4/5] max-h-[55vh]';
      default: return 'aspect-[9/16] max-h-[60vh]';
    }
  };

  const handlePrevTemplate = () => {
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
  };

  const handleNextTemplate = () => {
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
  };

  const handlePlayPause = () => {
    if (appMode === 'quran' && selectedVerses.length > 0 && selectedReader) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        // Play first verse audio
        const firstVerse = selectedVerses[0];
        const audioId = selectedReader.audioUrl || 'ar.alafasy';
        const paddedSurah = firstVerse.surahId.toString().padStart(3, '0');
        const paddedAyah = firstVerse.ayahNumber.toString().padStart(3, '0');
        const audioUrl = `/api/quran/audio?url=${encodeURIComponent(
          `https://cdn.islamic.network/quran/audio/128/${audioId}/${paddedSurah}${paddedAyah}.mp3`
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
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const hasContent = appMode === 'quran' ? selectedVerses.length > 0 : hadithData.text.trim().length > 0;
  const displayVerses = selectedVerses.slice(0, 5);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Preview Container */}
      <motion.div
        layout
        className={`relative w-full ${getAspectClass()} rounded-xl overflow-hidden shadow-2xl border border-border`}
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${design.bg1}, ${design.bg2})`,
          }}
        />

        {/* Pattern overlay */}
        {design.showPattern && design.patternType !== 'none' && (
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: getPatternBackground(design.patternType, design.accentColor),
              backgroundSize: `${(design.patternDensity + 1) * 10}px ${(design.patternDensity + 1) * 10}px`,
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
          {!hasContent ? (
            <div className="flex flex-col items-center gap-3 opacity-40">
              <Book className="w-14 h-14 text-muted-foreground" />
              <p className="text-muted-foreground text-sm arabic-text">
                اختر المحتوى لمعاينة الفيديو
              </p>
            </div>
          ) : appMode === 'quran' ? (
            <div className="flex flex-col items-center gap-4 w-full">
              {/* Surah name */}
              {design.showSurahName && selectedVerses[0] && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs px-3 py-1 rounded-full border border-white/20"
                  style={{ color: design.accentTextColor }}
                >
                  سورة {selectedVerses[0].surahName}
                </motion.div>
              )}

              {/* Verse text */}
              {design.showText && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="arabic-text px-2"
                  style={{
                    color: design.textColor,
                    fontSize: design.aspectRatio === '16:9' ? '0.9rem' : '1.15rem',
                    fontWeight: design.textStyle === 'bold' ? 'bold' : 'normal',
                    textShadow: design.textStyle === 'with-shadow'
                      ? '2px 2px 8px rgba(0,0,0,0.8)'
                      : design.textStyle === 'outlined'
                      ? '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
                      : '1px 1px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  {displayVerses.map((v, i) => (
                    <span key={i}>
                      {v.ayahText}
                      {design.showAyahNumber && (
                        <span
                          className="text-[10px] mx-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full"
                          style={{
                            border: `1px solid ${design.accentColor}`,
                            color: design.accentTextColor,
                          }}
                        >
                          {v.ayahNumber}
                        </span>
                      )}
                    </span>
                  ))}
                  {selectedVerses.length > 5 && (
                    <span className="text-muted-foreground text-xs"> ...والمزيد</span>
                  )}
                </motion.div>
              )}

              {/* Reader name */}
              {design.showReaderName && selectedReader && (
                <div
                  className="text-[11px] mt-auto"
                  style={{ color: design.accentTextColor }}
                >
                  {design.customReaderName || selectedReader.name}
                </div>
              )}

              {/* Progress bar */}
              {design.showProgressBar && (
                <div className="w-full mt-auto px-3">
                  <div className="h-1 rounded-full bg-black/30 overflow-hidden">
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
          ) : (
            /* Hadith preview */
            <div className="flex flex-col items-center gap-4 w-full">
              {design.showText && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="arabic-text px-2"
                  style={{
                    color: design.textColor,
                    fontSize: '1rem',
                    fontWeight: design.textStyle === 'bold' ? 'bold' : 'normal',
                    textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  {hadithData.text}
                </motion.div>
              )}
              {hadithData.narrator && (
                <div className="text-[11px]" style={{ color: design.accentTextColor }}>
                  {hadithData.narrator}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Template name badge */}
        {currentTemplate && (
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-md px-2 py-0.5 text-[10px] text-white/70">
            {currentTemplate.icon} {currentTemplate.name}
          </div>
        )}

        {/* Aspect ratio badge */}
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-md px-2 py-0.5 text-[10px] text-white/70">
          {design.aspectRatio}
        </div>

        {/* Qudra Studio Watermark */}
        {design.showWatermark && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 opacity-60">
            <Image
              src="/qudra-logo.png"
              alt="Qudra"
              width={14}
              height={14}
              className="rounded-sm"
            />
            <span className="text-[8px] text-white/70 font-medium tracking-wider">QUDRA</span>
          </div>
        )}
      </motion.div>

      {/* Preview controls */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevTemplate}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handlePlayPause}
          className="h-10 w-10 rounded-full border-qudra/30 hover:border-qudra hover:bg-qudra/10"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 text-qudra" />
          ) : (
            <Play className="h-4 w-4 text-qudra" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextTemplate}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Selected verses summary */}
      {appMode === 'quran' && selectedVerses.length > 0 && (
        <div className="w-full surface rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground arabic-text">الآيات المختارة</span>
            <span className="text-xs text-qudra font-medium">{selectedVerses.length} آية</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedVerses.slice(0, 8).map((v, i) => (
              <span
                key={i}
                className="text-[10px] bg-secondary rounded px-1.5 py-0.5 text-foreground"
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

function getPatternBackground(type: string, color: string): string {
  switch (type) {
    case 'hexagonal':
      return `radial-gradient(circle at 50% 50%, ${color}22 1px, transparent 1px)`;
    case 'arabic':
      return `repeating-linear-gradient(45deg, ${color}11 0px, ${color}11 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-45deg, ${color}11 0px, ${color}11 1px, transparent 1px, transparent 10px)`;
    case 'floral':
      return `radial-gradient(ellipse at 25% 25%, ${color}15 0%, transparent 50%), radial-gradient(ellipse at 75% 75%, ${color}15 0%, transparent 50%)`;
    case 'geometric':
      return `linear-gradient(30deg, ${color}11 12%, transparent 12.5%, transparent 87%, ${color}11 87.5%, ${color}11), linear-gradient(150deg, ${color}11 12%, transparent 12.5%, transparent 87%, ${color}11 87.5%, ${color}11)`;
    case 'waves':
      return `repeating-linear-gradient(0deg, ${color}0a 0px, transparent 3px, transparent 8px)`;
    case 'minimal':
      return `linear-gradient(180deg, ${color}08 0%, transparent 100%)`;
    default:
      return 'none';
  }
}
