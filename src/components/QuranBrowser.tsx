'use client';

import { useState, useMemo, useCallback } from 'react';
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
import { Search, Book, ArrowRight, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function QuranBrowser() {
  const { showQuranBrowser, setShowQuranBrowser, addVerses, selectedVerses } = useAppStore();
  const [surahSearch, setSurahSearch] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [fromAyah, setFromAyah] = useState('1');
  const [toAyah, setToAyah] = useState('');
  const [isLoadingVerses, setIsLoadingVerses] = useState(false);

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

  const selectedSurahData = surahs.find((s) => s.id === selectedSurah);

  const handleAddVerses = useCallback(async () => {
    const surah = surahs.find((s) => s.id === selectedSurah);
    if (!surah) return;

    const from = parseInt(fromAyah) || 1;
    const to = parseInt(toAyah) || from;

    if (from < 1 || to > surah.ayahs || from > to) {
      toast.error('تأكد من صحة نطاق الآيات');
      return;
    }

    setIsLoadingVerses(true);

    try {
      // Fetch real verses from the API
      const res = await fetch(
        `/api/quran/verses?surah=${surah.id}&from=${from}&to=${to}`
      );

      if (res.ok) {
        const data = await res.json();
        if (data.verses && data.verses.length > 0) {
          const newVerses = data.verses.map((verse: { numberInSurah: number; text: string; surah: { name: string }; number: number }) => ({
            surahId: surah.id,
            surahName: verse.surah?.name || surah.name,
            ayahNumber: verse.numberInSurah,
            ayahText: verse.text,
            absoluteAyahNumber: verse.number,
          }));
          addVerses(newVerses);
          toast.success(`تمت إضافة ${newVerses.length} آية من سورة ${surah.name}`);
        } else {
          toast.error('لم يتم العثور على الآيات');
        }
      } else {
        toast.error('تعذر تحميل الآيات');
      }
    } catch {
      toast.error('حدث خطأ في التحميل');
    } finally {
      setIsLoadingVerses(false);
      setSelectedSurah(null);
      setFromAyah('1');
      setToAyah('');
      setShowQuranBrowser(false);
    }
  }, [selectedSurah, fromAyah, toAyah, addVerses, setShowQuranBrowser]);

  const isVerseSelected = (surahId: number, ayahNum: number) => {
    return selectedVerses.some(v => v.surahId === surahId && v.ayahNumber === ayahNum);
  };

  return (
    <Dialog open={showQuranBrowser} onOpenChange={setShowQuranBrowser}>
      <DialogContent className="sm:max-w-[560px] max-h-[85vh] p-0 bg-card border-border overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                <Book className="w-4 h-4 text-gold" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground arabic-text">
                  تصفح القرآن الكريم
                </h2>
                <p className="text-[10px] text-muted-foreground tracking-wider">BROWSE QURAN</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن سورة باسمها أو رقمها..."
                value={surahSearch}
                onChange={(e) => setSurahSearch(e.target.value)}
                className="pr-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 max-h-[60vh]">
            {selectedSurahData ? (
              <div className="p-4">
                {/* Back button */}
                <button
                  onClick={() => {
                    setSelectedSurah(null);
                    setFromAyah('1');
                    setToAyah('');
                  }}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span className="text-sm arabic-text">العودة للسور</span>
                </button>

                {/* Surah info */}
                <div className="bg-secondary/50 rounded-xl p-4 mb-4 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold font-bold text-lg">
                      {selectedSurahData.id}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground arabic-text text-lg">
                        {selectedSurahData.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedSurahData.nameEn} • {selectedSurahData.ayahs} آية
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`mr-auto text-[10px] ${
                        selectedSurahData.type === 'meccan'
                          ? 'border-gold/30 text-gold'
                          : 'border-emerald/30 text-emerald'
                      }`}
                    >
                      {selectedSurahData.type === 'meccan' ? 'مكية' : 'مدنية'}
                    </Badge>
                  </div>
                </div>

                {/* Ayah range */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground arabic-text">اختر نطاق الآيات</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground mb-1 block arabic-text">من آية</label>
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
                      <label className="text-xs text-muted-foreground mb-1 block arabic-text">إلى آية</label>
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
                    disabled={isLoadingVerses}
                    className="w-full btn-gold h-11 font-semibold"
                  >
                    {isLoadingVerses ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        <span className="arabic-text">جارٍ التحميل...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 ml-2" />
                        <span className="arabic-text">إضافة الآيات</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {filteredSurahs.map((surah) => (
                  <button
                    key={surah.id}
                    onClick={() => {
                      setSelectedSurah(surah.id);
                      setToAyah(surah.ayahs.toString());
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 border-b border-border/30 text-right hover:bg-secondary/50 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground font-bold text-xs flex-shrink-0 group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                      {surah.id}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground text-sm arabic-text">
                          {surah.name}
                        </h3>
                        <span className="text-xs text-muted-foreground">{surah.nameEn}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{surah.ayahs} آية</p>
                    </div>

                    <Badge
                      variant="outline"
                      className={`text-[10px] flex-shrink-0 ${
                        surah.type === 'meccan'
                          ? 'border-gold/30 text-gold'
                          : 'border-emerald/30 text-emerald'
                      }`}
                    >
                      {surah.type === 'meccan' ? 'مكية' : 'مدنية'}
                    </Badge>
                  </button>
                ))}

                {filteredSurahs.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Search className="w-10 h-10 mb-3 opacity-30" />
                    <p className="text-sm arabic-text">لم يتم العثور على نتائج</p>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
