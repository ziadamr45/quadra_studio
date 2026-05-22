'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { surahs } from '@/lib/quran-data';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  Book,
  ArrowRight,
  Loader2,
  Check,
  Clock,
  Mic,
  AlertCircle,
  ListChecks,
  Volume2,
} from 'lucide-react';
import { toast } from 'sonner';

interface QuranBrowserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TimestampAyah {
  numberInSurah: number;
  verseKey: string;
  startTime: number;
  endTime: number;
}

interface VerseAyah {
  number: number;
  numberInSurah: number;
  text: string;
  englishText?: string;
  surah?: {
    number: number;
    name: string;
    englishName: string;
  };
}

export default function QuranBrowser({ open, onOpenChange }: QuranBrowserProps) {
  const { updateQuranProject, quranProject } = useAppStore();
  const [surahSearch, setSurahSearch] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [fromAyah, setFromAyah] = useState('1');
  const [toAyah, setToAyah] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

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
  const hasReader = !!quranProject?.reader;

  const handleSelectAll = useCallback(() => {
    if (!selectedSurahData) return;
    setFromAyah('1');
    setToAyah(selectedSurahData.ayahs.toString());
  }, [selectedSurahData]);

  const handleAddVerses = useCallback(async () => {
    const surah = surahs.find((s) => s.id === selectedSurah);
    if (!surah) return;

    const from = parseInt(fromAyah) || 1;
    const to = parseInt(toAyah) || from;

    if (from < 1 || to > surah.ayahs || from > to) {
      toast.error('تأكد من صحة نطاق الآيات');
      return;
    }

    setIsLoading(true);

    try {
      if (hasReader && quranProject.reader) {
        // ---- PATH 1: Reader selected → fetch real timestamps ----
        setLoadingMessage('جارٍ تحميل التوقيتات الصوتية...');

        // Fetch timestamps and verse text in parallel
        const [timestampsRes, versesRes] = await Promise.allSettled([
          fetch(
            `/api/quran/timestamps?surah=${surah.id}&recitationId=${quranProject.reader.recitationId}`
          ),
          fetch(
            `/api/quran/verses?surah=${surah.id}&from=${from}&to=${to}`
          ),
        ]);

        // Check if timestamps succeeded
        if (timestampsRes.status === 'rejected' || !timestampsRes.value.ok) {
          // Fall back to text-only with estimated timing
          setLoadingMessage('فشل تحميل التوقيتات، جارٍ التحميل بالنص فقط...');
          const versesData =
            versesRes.status === 'fulfilled' && versesRes.value.ok
              ? await versesRes.value.json()
              : null;

          if (versesData?.verses?.length > 0) {
            const ayahTimestamps = versesData.verses.map(
              (verse: VerseAyah, index: number) => ({
                numberInSurah: verse.numberInSurah,
                text: verse.text,
                startTime: index * 5,
                endTime: (index + 1) * 5,
              })
            );

            updateQuranProject({
              surahId: surah.id,
              surahName: surah.name,
              surahNameEn: surah.nameEn,
              ayahFrom: from,
              ayahTo: to,
              ayahs: ayahTimestamps,
              totalDuration: ayahTimestamps.length * 5,
              audioUrl: '',
              error: 'تم التحميل بدون توقيتات صوتية',
            });
            toast.success(`تمت إضافة ${ayahTimestamps.length} آية (بدون توقيتات)`);
          } else {
            toast.error('تعذر تحميل الآيات');
          }
          return;
        }

        const timestampsData = await timestampsRes.value.json();

        if (!timestampsData.ayahs || timestampsData.ayahs.length === 0) {
          toast.error('لا توجد بيانات توقيتات لهذه السورة');
          return;
        }

        // Filter timestamps to selected range
        const filteredTimestamps: TimestampAyah[] = timestampsData.ayahs.filter(
          (ayah: TimestampAyah) =>
            ayah.numberInSurah >= from && ayah.numberInSurah <= to
        );

        // Get verse text
        setLoadingMessage('جارٍ تحميل نص الآيات...');
        let versesData: { verses: VerseAyah[] } | null = null;

        if (versesRes.status === 'fulfilled' && versesRes.value.ok) {
          versesData = await versesRes.value.json();
        }

        // Merge timestamps with text
        const textMap = new Map<number, string>();
        if (versesData?.verses) {
          for (const verse of versesData.verses) {
            textMap.set(verse.numberInSurah, verse.text);
          }
        }

        const mergedAyahs = filteredTimestamps.map(
          (ts: TimestampAyah) => ({
            numberInSurah: ts.numberInSurah,
            text: textMap.get(ts.numberInSurah) || '',
            startTime: ts.startTime,
            endTime: ts.endTime,
          })
        );

        // Calculate total duration for the filtered range
        let rangeTotalDuration = 0;
        if (mergedAyahs.length > 0) {
          rangeTotalDuration =
            mergedAyahs[mergedAyahs.length - 1].endTime -
            mergedAyahs[0].startTime;
        }

        const surahName = timestampsData.surahName || surah.name;
        const surahNameEn = timestampsData.surahNameEn || surah.nameEn;

        updateQuranProject({
          surahId: surah.id,
          surahName,
          surahNameEn,
          ayahFrom: from,
          ayahTo: to,
          ayahs: mergedAyahs,
          totalDuration: rangeTotalDuration,
          audioUrl: timestampsData.audioUrl || '',
          error: null,
        });

        toast.success(
          `تمت إضافة ${mergedAyahs.length} آية مع التوقيتات الصوتية`
        );
      } else {
        // ---- PATH 2: No reader → fetch text only with estimated timing ----
        setLoadingMessage('جارٍ تحميل نص الآيات...');

        const res = await fetch(
          `/api/quran/verses?surah=${surah.id}&from=${from}&to=${to}`
        );

        if (res.ok) {
          const data = await res.json();
          if (data.verses && data.verses.length > 0) {
            const ayahTimestamps = data.verses.map(
              (verse: VerseAyah, index: number) => ({
                numberInSurah: verse.numberInSurah,
                text: verse.text,
                startTime: index * 5,
                endTime: (index + 1) * 5,
              })
            );

            updateQuranProject({
              surahId: surah.id,
              surahName: surah.name,
              surahNameEn: surah.nameEn,
              ayahFrom: from,
              ayahTo: to,
              ayahs: ayahTimestamps,
              totalDuration: ayahTimestamps.length * 5,
              audioUrl: '',
              error: null,
            });
            toast.success(
              `تمت إضافة ${ayahTimestamps.length} آية (توقيت تقديري)`
            );
          } else {
            toast.error('لم يتم العثور على الآيات');
          }
        } else {
          toast.error('تعذر تحميل الآيات');
        }
      }
    } catch {
      toast.error('حدث خطأ في التحميل');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
      setSelectedSurah(null);
      setFromAyah('1');
      setToAyah('');
      onOpenChange(false);
    }
  }, [selectedSurah, fromAyah, toAyah, updateQuranProject, onOpenChange, hasReader, quranProject?.reader]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 bg-[#0c0c10] border-gold/15 overflow-hidden shadow-2xl shadow-black/40">
        <DialogTitle className="sr-only">تصفح القرآن الكريم</DialogTitle>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-5 border-b border-gold/10 bg-gradient-to-l from-gold/5 via-transparent to-gold/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Book className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground arabic-text">
                  تصفح القرآن الكريم
                </h2>
                <p className="text-[10px] text-gold/50 tracking-[0.2em] font-medium">
                  BROWSE QURAN
                </p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن سورة باسمها أو رقمها..."
                value={surahSearch}
                onChange={(e) => setSurahSearch(e.target.value)}
                className="pr-10 bg-[#12121a] border-gold/10 text-foreground placeholder:text-muted-foreground/60 focus:border-gold/30 h-10"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 max-h-[65vh]">
            {selectedSurahData ? (
              <div className="p-5">
                {/* Back button */}
                <button
                  onClick={() => {
                    setSelectedSurah(null);
                    setFromAyah('1');
                    setToAyah('');
                  }}
                  className="flex items-center gap-2 text-muted-foreground hover:text-gold mb-5 transition-colors group"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  <span className="text-sm arabic-text">العودة للسور</span>
                </button>

                {/* Surah info card */}
                <div className="bg-gradient-to-l from-gold/5 via-[#12121a] to-gold/5 rounded-xl p-5 mb-5 border border-gold/15 relative overflow-hidden">
                  {/* Decorative pattern */}
                  <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `repeating-linear-gradient(45deg, #c9a84c 0px, #c9a84c 1px, transparent 1px, transparent 20px), repeating-linear-gradient(-45deg, #c9a84c 0px, #c9a84c 1px, transparent 1px, transparent 20px)`
                  }} />
                  <div className="relative flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-xl">
                      {selectedSurahData.id}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground arabic-text text-xl">
                        {selectedSurahData.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {selectedSurahData.nameEn}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          selectedSurahData.type === 'meccan'
                            ? 'border-gold/25 text-gold bg-gold/5'
                            : 'border-emerald/25 text-emerald bg-emerald/5'
                        }`}
                      >
                        {selectedSurahData.type === 'meccan' ? 'مكية' : 'مدنية'}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground/60">
                        {selectedSurahData.ayahs} آية
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ayah range selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground arabic-text flex items-center gap-2">
                      <ListChecks className="w-4 h-4 text-gold" />
                      اختر نطاق الآيات
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSelectAll}
                      className="text-[10px] text-gold hover:text-gold hover:bg-gold/10 h-7 px-2.5 arabic-text"
                    >
                      تحديد الكل
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
                        من آية
                      </label>
                      <Input
                        type="number"
                        min={1}
                        max={selectedSurahData.ayahs}
                        placeholder="1"
                        value={fromAyah}
                        onChange={(e) => setFromAyah(e.target.value)}
                        className="bg-[#12121a] border-gold/10 text-foreground focus:border-gold/30 h-10"
                      />
                    </div>
                    <div className="pt-5 text-muted-foreground/40">—</div>
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
                        إلى آية
                      </label>
                      <Input
                        type="number"
                        min={1}
                        max={selectedSurahData.ayahs}
                        placeholder={selectedSurahData.ayahs.toString()}
                        value={toAyah}
                        onChange={(e) => setToAyah(e.target.value)}
                        className="bg-[#12121a] border-gold/10 text-foreground focus:border-gold/30 h-10"
                      />
                    </div>
                  </div>

                  {/* Range preview */}
                  {fromAyah && toAyah && parseInt(toAyah) >= parseInt(fromAyah) && (
                    <div className="text-xs text-muted-foreground/70 arabic-text text-center">
                      {parseInt(toAyah) - parseInt(fromAyah) + 1} آية سيتم إضافتها
                    </div>
                  )}

                  <Separator className="bg-gold/10" />

                  {/* Reader status hint */}
                  {hasReader ? (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald/5 border border-emerald/15">
                      <Volume2 className="w-4 h-4 text-emerald flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-emerald arabic-text font-medium">
                          القارئ: {quranProject.reader?.name}
                        </p>
                        <p className="text-[10px] text-emerald/60 arabic-text">
                          سيتم تحميل التوقيتات الصوتية المتزامنة
                        </p>
                      </div>
                      <Clock className="w-4 h-4 text-emerald/40" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gold/5 border border-gold/15">
                      <AlertCircle className="w-4 h-4 text-gold flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gold arabic-text font-medium">
                          لم يتم اختيار قارئ
                        </p>
                        <p className="text-[10px] text-gold/50 arabic-text">
                          اختر قارئاً من تبويب الصوت لتحميل التوقيتات المتزامنة، أو أضف بتوقيت تقديري
                        </p>
                      </div>
                      <Mic className="w-4 h-4 text-gold/30" />
                    </div>
                  )}

                  {/* Add button */}
                  <Button
                    onClick={handleAddVerses}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-l from-gold/90 via-gold to-gold/90 hover:from-gold hover:via-gold-dark hover:to-gold text-background h-12 font-semibold text-base shadow-lg shadow-gold/20 transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                        <span className="arabic-text">{loadingMessage || 'جارٍ التحميل...'}</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5 ml-2" />
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
                    className="w-full flex items-center gap-3 px-5 py-3.5 border-b border-gold/5 text-right hover:bg-gold/5 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#12121a] border border-gold/10 flex items-center justify-center text-muted-foreground font-bold text-xs flex-shrink-0 group-hover:bg-gold/10 group-hover:border-gold/20 group-hover:text-gold transition-all">
                      {surah.id}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground text-sm arabic-text group-hover:text-gold transition-colors">
                          {surah.name}
                        </h3>
                        <span className="text-xs text-muted-foreground/70">
                          {surah.nameEn}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground/50 mt-0.5">
                        {surah.ayahs} آية
                      </p>
                    </div>

                    <Badge
                      variant="outline"
                      className={`text-[10px] flex-shrink-0 ${
                        surah.type === 'meccan'
                          ? 'border-gold/20 text-gold/70'
                          : 'border-emerald/20 text-emerald/70'
                      }`}
                    >
                      {surah.type === 'meccan' ? 'مكية' : 'مدنية'}
                    </Badge>
                  </button>
                ))}

                {filteredSurahs.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Search className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm arabic-text">لم يتم العثور على نتائج</p>
                    <p className="text-[10px] text-muted-foreground/50 mt-1">
                      حاول البحث باسم آخر أو رقم السورة
                    </p>
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
