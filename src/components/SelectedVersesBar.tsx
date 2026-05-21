'use client';

import { useAppStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { X, BookOpen, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SelectedVersesBar() {
  const { selectedVerses, removeVerse, clearVerses } = useAppStore();

  if (selectedVerses.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="glass rounded-xl p-3 border border-border"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald" />
          <h3 className="text-sm font-semibold text-foreground arabic-text">
            الآيات المختارة
          </h3>
          <Badge className="bg-emerald/10 text-emerald border-emerald/20 text-[10px]">
            {selectedVerses.length}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearVerses}
          className="h-7 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10"
        >
          <Trash2 className="w-3 h-3 ml-1" />
          <span className="arabic-text">مسح الكل</span>
        </Button>
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-1">
          <AnimatePresence>
            {selectedVerses.map((verse, index) => (
              <motion.div
                key={`${verse.surahId}-${verse.ayahNumber}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center gap-1.5 bg-secondary/80 border border-border/50 rounded-lg px-2.5 py-1.5 flex-shrink-0"
              >
                <span className="text-xs text-foreground arabic-text">
                  {verse.surahName}
                </span>
                <Badge
                  variant="outline"
                  className="text-[9px] px-1 py-0 border-emerald/30 text-emerald"
                >
                  {verse.ayahNumber}
                </Badge>
                <button
                  onClick={() => removeVerse(verse.surahId, verse.ayahNumber)}
                  className="text-muted-foreground hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <ScrollBar orientation="horizontal" className="h-1" />
      </ScrollArea>
    </motion.div>
  );
}
