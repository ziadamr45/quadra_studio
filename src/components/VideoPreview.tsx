'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Book, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { videoTemplates } from '@/lib/quran-data';
import { useState } from 'react';

export default function VideoPreview() {
  const { design, selectedVerses, updateDesign, selectedReader } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(false);

  const currentTemplate = videoTemplates.find((t) => t.id === design.templateId);

  const getAspectClass = () => {
    switch (design.aspectRatio) {
      case '9:16':
        return 'aspect-[9/16] max-h-[65vh]';
      case '16:9':
        return 'aspect-[16/9] max-h-[50vh]';
      case '1:1':
        return 'aspect-square max-h-[50vh]';
      case '4:5':
        return 'aspect-[4/5] max-h-[60vh]';
      default:
        return 'aspect-[9/16] max-h-[65vh]';
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

  return (
    <div className="flex flex-col items-center gap-3">
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
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: getPatternBackground(design.patternType, design.accentColor),
              backgroundSize: `${(design.patternDensity + 1) * 8}px ${(design.patternDensity + 1) * 8}px`,
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
          {selectedVerses.length === 0 ? (
            // Placeholder
            <div className="flex flex-col items-center gap-4 opacity-50">
              <Book className="w-16 h-16 text-muted-foreground" />
              <p className="text-muted-foreground text-lg arabic-text">
                اختر الآيات لمعاينة الفيديو
              </p>
            </div>
          ) : (
            // Verse preview
            <div className="flex flex-col items-center gap-4 w-full">
              {/* Surah name */}
              {design.showSurahName && selectedVerses[0] && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm px-4 py-1 rounded-full border border-border/50"
                  style={{ color: design.accentTextColor }}
                >
                  سورة {selectedVerses[0].surahName}
                </motion.div>
              )}

              {/* Verse text */}
              {design.showText && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="arabic-text px-4"
                  style={{
                    color: design.textColor,
                    fontSize: design.aspectRatio === '16:9' ? '1rem' : '1.25rem',
                    fontWeight: design.textStyle === 'bold' ? 'bold' : 'normal',
                    textShadow:
                      design.textStyle === 'with-shadow'
                        ? '2px 2px 8px rgba(0,0,0,0.8)'
                        : design.textStyle === 'outlined'
                        ? '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
                        : '1px 1px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  {selectedVerses.slice(0, 3).map((v, i) => (
                    <span key={i}>
                      {v.ayahText}
                      {design.showAyahNumber && (
                        <span
                          className="text-xs mx-1 inline-flex items-center justify-center w-5 h-5 rounded-full"
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
                  {selectedVerses.length > 3 && (
                    <span className="text-muted-foreground text-sm">
                      {' '}
                      ...والمزيد
                    </span>
                  )}
                </motion.div>
              )}

              {/* Reader name */}
              {design.showReaderName && selectedReader && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs mt-auto"
                  style={{ color: design.accentTextColor }}
                >
                  {design.customReaderName || selectedReader.name}
                </motion.div>
              )}

              {/* Progress bar */}
              {design.showProgressBar && (
                <div className="w-full mt-auto px-4">
                  <div className="h-1 rounded-full bg-black/30 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: design.accentColor }}
                      initial={{ width: '0%' }}
                      animate={{ width: isPlaying ? '65%' : '0%' }}
                      transition={{ duration: isPlaying ? 8 : 0.3 }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Template name badge */}
        {currentTemplate && (
          <div className="absolute top-3 right-3 glass rounded-lg px-2 py-1 text-xs text-muted-foreground">
            {currentTemplate.icon} {currentTemplate.name}
          </div>
        )}

        {/* Aspect ratio badge */}
        <div className="absolute top-3 left-3 glass rounded-lg px-2 py-1 text-xs text-muted-foreground">
          {design.aspectRatio}
        </div>
      </motion.div>

      {/* Preview controls */}
      <div className="flex items-center gap-2">
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
          onClick={() => setIsPlaying(!isPlaying)}
          className="h-10 w-10 rounded-full border-emerald/30 hover:border-emerald hover:bg-emerald/10"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 text-emerald" />
          ) : (
            <Play className="h-4 w-4 text-emerald" />
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
