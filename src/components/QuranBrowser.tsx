'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { surahs } from '@/lib/quran-data';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Search, Book, ArrowRight, X } from 'lucide-react';
import { toast } from 'sonner';

export default function QuranBrowser() {
  const { showQuranBrowser, setShowQuranBrowser, surahSearch, setSurahSearch, addVerse } =
    useAppStore();
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [fromAyah, setFromAyah] = useState('');
  const [toAyah, setToAyah] = useState('');

  const filteredSurahs = useMemo(() => {
    if (!surahSearch.trim()) return surahs;
    const search = surahSearch.trim();
    return surahs.filter(
      (s) =>
        s.name.includes(search) ||
        s.nameEn.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toString() === search
    );
  }, [surahSearch]);

  const handleSurahSelect = (surahId: number) => {
    setSelectedSurah(surahId);
    setFromAyah('');
    setToAyah('');
  };

  const handleAddVerses = () => {
    const surah = surahs.find((s) => s.id === selectedSurah);
    if (!surah) return;

    const from = parseInt(fromAyah) || 1;
    const to = parseInt(toAyah) || from;

    if (from < 1 || to > surah.ayahs || from > to) {
      toast.error('تأكد من صحة نطاق الآيات');
      return;
    }

    for (let i = from; i <= to; i++) {
      addVerse({
        surahId: surah.id,
        surahName: surah.name,
        ayahNumber: i,
        ayahText: `﴿آية ${i} من سورة ${surah.name}﴾`,
      });
    }

    toast.success(`تمت إضافة الآيات ${from} إلى ${to} من سورة ${surah.name}`);
    setSelectedSurah(null);
    setFromAyah('');
    setToAyah('');
    setShowQuranBrowser(false);
  };

  const selectedSurahData = surahs.find((s) => s.id === selectedSurah);

  return (
    <Dialog open={showQuranBrowser} onOpenChange={setShowQuranBrowser}>
      <DialogContent className="sm:max-w-[560px] max-h-[85vh] p-0 bg-card border-border overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3 mb-3">
              <Book className="w-5 h-5 text-emerald" />
              <h2 className="text-lg font-bold text-foreground arabic-text">
                تصفح القرآن الكريم
              </h2>
            </div>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن سورة..."
                value={surahSearch}
                onChange={(e) => setSurahSearch(e.target.value)}
                className="pr-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 max-h-[60vh]">
            <AnimatePresence mode="wait">
              {selectedSurahData ? (
                <motion.div
                  key="ayah-select"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-4"
                >
                  {/* Back button */}
                  <button
                    onClick={() => setSelectedSurah(null)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span className="text-sm">العودة للسور</span>
                  </button>

                  {/* Surah info */}
                  <div className="glass rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-emerald/10 flex items-center justify-center text-emerald font-bold text-sm">
                        {selectedSurahData.id}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground arabic-text">
                          {selectedSurahData.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {selectedSurahData.nameEn} • {selectedSurahData.ayahs} آية
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ayah range */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">اختر نطاق الآيات</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground mb-1 block">من آية</label>
                        <Input
                          type="number"
                          min={1}
                          max={selectedSurahData.ayahs}
                          placeholder="1"
                          value={fromAyah}
                          onChange={(e) => setFromAyah(e.target.value)}
                          className="bg-secondary border-border text-foreground"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground mb-1 block">إلى آية</label>
                        <Input
                          type="number"
                          min={1}
                          max={selectedSurahData.ayahs}
                          placeholder={selectedSurahData.ayahs.toString()}
                          value={toAyah}
                          onChange={(e) => setToAyah(e.target.value)}
                          className="bg-secondary border-border text-foreground"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleAddVerses}
                      className="w-full bg-emerald hover:bg-emerald/90 text-emerald-foreground font-semibold"
                    >
                      إضافة الآيات
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="surah-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {filteredSurahs.map((surah) => (
                    <button
                      key={surah.id}
                      onClick={() => handleSurahSelect(surah.id)}
                      className="surah-item w-full flex items-center gap-3 px-4 py-3 border-b border-border/50 text-right"
                    >
                      {/* Surah number */}
                      <div className="w-9 h-9 rounded-full bg-emerald/10 flex items-center justify-center text-emerald font-bold text-xs flex-shrink-0">
                        {surah.id}
                      </div>

                      {/* Surah info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground text-sm arabic-text">
                            {surah.name}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {surah.nameEn}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {surah.ayahs} آية
                        </p>
                      </div>

                      {/* Type badge */}
                      <Badge
                        variant="outline"
                        className={`text-[10px] flex-shrink-0 ${
                          surah.type === 'meccan'
                            ? 'border-emerald/30 text-emerald'
                            : 'border-copper/30 text-copper-light'
                        }`}
                      >
                        {surah.type === 'meccan' ? 'مكية' : 'مدنية'}
                      </Badge>
                    </button>
                  ))}

                  {filteredSurahs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Search className="w-10 h-10 mb-3 opacity-30" />
                      <p className="text-sm">لم يتم العثور على نتائج</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
