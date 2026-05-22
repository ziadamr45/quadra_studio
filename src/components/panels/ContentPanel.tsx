'use client';

import { useAppStore } from '@/lib/store';
import { hadithCollections } from '@/lib/quran-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Book,
  X,
  TextCursorInput,
  MessageSquare,
  Clock,
  Volume2,
  RefreshCw,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useState, useCallback } from 'react';

interface ContentPanelProps {
  onBrowseQuran: () => void;
}

export default function ContentPanel({ onBrowseQuran }: ContentPanelProps) {
  const {
    appMode,
    quranProject,
    resetQuranProject,
    updateQuranProject,
    hadithData,
    updateHadithData,
    design,
    updateDesign,
  } = useAppStore();
  const [customText, setCustomText] = useState('');
  const [isLoadingTimestamps, setIsLoadingTimestamps] = useState(false);

  const hasReader = !!quranProject?.reader;
  const hasAyahs = (quranProject?.ayahs?.length ?? 0) > 0;
  const hasRealTimestamps = hasAyahs && quranProject?.audioUrl && quranProject.audioUrl.length > 0;

  const handleAddCustomText = () => {
    if (!customText.trim()) return;
    updateDesign({ backgroundImage: customText.trim() });
    setCustomText('');
    toast.success('تمت إضافة النص');
  };

  const handleReloadTimestamps = useCallback(async () => {
    if (!quranProject?.surahId || !quranProject?.reader) {
      toast.error('اختر سورة وقارئاً أولاً');
      return;
    }

    setIsLoadingTimestamps(true);

    try {
      const [timestampsRes, versesRes] = await Promise.allSettled([
        fetch(
          `/api/quran/timestamps?surah=${quranProject.surahId}&recitationId=${quranProject.reader.recitationId}`
        ),
        fetch(
          `/api/quran/verses?surah=${quranProject.surahId}&from=${quranProject.ayahFrom}&to=${quranProject.ayahTo}`
        ),
      ]);

      if (timestampsRes.status === 'rejected' || !timestampsRes.value.ok) {
        toast.error('فشل تحميل التوقيتات الصوتية');
        return;
      }

      const timestampsData = await timestampsRes.value.json();

      if (!timestampsData.ayahs || timestampsData.ayahs.length === 0) {
        toast.error('لا توجد بيانات توقيتات');
        return;
      }

      // Filter timestamps to selected range
      const filteredTimestamps = timestampsData.ayahs.filter(
        (ayah: { numberInSurah: number }) =>
          ayah.numberInSurah >= quranProject.ayahFrom &&
          ayah.numberInSurah <= quranProject.ayahTo
      );

      // Get verse text
      let versesData: { verses: Array<{ numberInSurah: number; text: string }> } | null = null;
      if (versesRes.status === 'fulfilled' && versesRes.value.ok) {
        versesData = await versesRes.value.json();
      }

      const textMap = new Map<number, string>();
      if (versesData?.verses) {
        for (const verse of versesData.verses) {
          textMap.set(verse.numberInSurah, verse.text);
        }
      }

      const mergedAyahs = filteredTimestamps.map(
        (ts: { numberInSurah: number; startTime: number; endTime: number }) => ({
          numberInSurah: ts.numberInSurah,
          text: textMap.get(ts.numberInSurah) || '',
          startTime: ts.startTime,
          endTime: ts.endTime,
        })
      );

      let rangeTotalDuration = 0;
      if (mergedAyahs.length > 0) {
        rangeTotalDuration =
          mergedAyahs[mergedAyahs.length - 1].endTime -
          mergedAyahs[0].startTime;
      }

      updateQuranProject({
        ayahs: mergedAyahs,
        totalDuration: rangeTotalDuration,
        audioUrl: timestampsData.audioUrl || '',
        surahName: timestampsData.surahName || quranProject.surahName,
        surahNameEn: timestampsData.surahNameEn || quranProject.surahNameEn,
        error: null,
      });

      toast.success('تم تحديث التوقيتات الصوتية بنجاح');
    } catch {
      toast.error('حدث خطأ أثناء تحميل التوقيتات');
    } finally {
      setIsLoadingTimestamps(false);
    }
  }, [quranProject, updateQuranProject]);

  if (appMode === 'hadith') {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-5 h-5 text-emerald" />
          <h2 className="text-base font-bold text-foreground arabic-text">محتوى الحديث</h2>
        </div>

        {/* Hadith collection */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
            تصنيف الحديث
          </Label>
          <Select
            value={hadithData.collection}
            onValueChange={(value) => updateHadithData({ collection: value })}
          >
            <SelectTrigger className="bg-secondary border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {hadithCollections.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} className="arabic-text">
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Hadith number */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
            رقم الحديث
          </Label>
          <Input
            type="number"
            placeholder="مثال: 1"
            value={hadithData.hadithNumber || ''}
            onChange={(e) => updateHadithData({ hadithNumber: parseInt(e.target.value) || 0 })}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Hadith text */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
            نص الحديث
          </Label>
          <Textarea
            placeholder="الصق نص الحديث الشريف هنا..."
            rows={6}
            value={hadithData.text}
            onChange={(e) => updateHadithData({ text: e.target.value })}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none arabic-text leading-relaxed"
          />
        </div>

        {/* Narrator */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
            الراوي
          </Label>
          <Input
            placeholder="مثال: عن أبي هريرة رضي الله عنه"
            value={hadithData.narrator}
            onChange={(e) => updateHadithData({ narrator: e.target.value })}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground arabic-text"
          />
        </div>

        {/* Grade */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
            درجة الحديث
          </Label>
          <Input
            placeholder="مثال: صحيح"
            value={hadithData.grade}
            onChange={(e) => updateHadithData({ grade: e.target.value })}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground arabic-text"
          />
        </div>

        <div className="bg-secondary/50 rounded-lg p-3 border border-border">
          <p className="text-xs text-muted-foreground arabic-text leading-relaxed">
            تأكد من صحة الحديث قبل التصدير. يمكنك إضافة أي حديث مع ذكر المصدر والراوي.
          </p>
        </div>
      </div>
    );
  }

  // Quran mode
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <Book className="w-5 h-5 text-gold" />
        <h2 className="text-base font-bold text-foreground arabic-text">اختر الآيات</h2>
      </div>

      {/* Browse Quran Button */}
      <button
        onClick={onBrowseQuran}
        className="w-full group relative overflow-hidden rounded-xl h-14 border border-gold/20 bg-gradient-to-l from-gold/5 via-gold/10 to-gold/5 hover:from-gold/10 hover:via-gold/15 hover:to-gold/10 transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-gold/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        <div className="relative flex items-center justify-center gap-2.5">
          <Book className="w-5 h-5 text-gold" />
          <span className="arabic-text font-semibold text-gold text-base">تصفح القرآن الكريم</span>
        </div>
      </button>

      {/* Selected verses info */}
      {hasAyahs && (
        <div className="space-y-3">
          {/* Surah info header */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground arabic-text">الآيات المختارة</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => resetQuranProject()}
                className="text-[10px] text-muted-foreground hover:text-red-400 transition-colors arabic-text flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                مسح الكل
              </button>
              <Badge className="bg-gold/10 text-gold border-gold/20 text-[10px]">
                {quranProject?.ayahs?.length ?? 0} آية
              </Badge>
            </div>
          </div>

          {/* Surah details card */}
          <div className="bg-gold/5 rounded-xl p-3.5 border border-gold/15 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gold arabic-text">
                {quranProject?.surahName}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {quranProject?.surahNameEn}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-muted-foreground/70">
              <span className="arabic-text">
                الآيات {quranProject?.ayahFrom} - {quranProject?.ayahTo}
              </span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {quranProject?.totalDuration
                  ? `${Math.floor(quranProject.totalDuration / 60)}:${String(Math.floor(quranProject.totalDuration % 60)).padStart(2, '0')}`
                  : '--:--'}
              </span>
            </div>

            {/* Reader info */}
            {quranProject?.reader ? (
              <div className="flex items-center gap-2 pt-1 border-t border-gold/10">
                <Volume2 className="w-3.5 h-3.5 text-gold/60" />
                <span className="text-[11px] text-gold/80 arabic-text font-medium">
                  {quranProject.reader.name}
                </span>
                <span className="text-[10px] text-muted-foreground/50">
                  {quranProject.reader.nameEn}
                </span>
                {hasRealTimestamps ? (
                  <Badge className="bg-emerald/10 text-emerald border-emerald/20 text-[9px] mr-auto">
                    متزامن
                  </Badge>
                ) : (
                  <Badge className="bg-gold/10 text-gold border-gold/20 text-[9px] mr-auto">
                    تقديري
                  </Badge>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 pt-1 border-t border-gold/10">
                <AlertCircle className="w-3.5 h-3.5 text-gold/40" />
                <span className="text-[10px] text-gold/50 arabic-text">
                  لم يتم اختيار قارئ — التوقيت تقديري
                </span>
              </div>
            )}

            {/* Load Timestamps button */}
            {hasReader && !hasRealTimestamps && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReloadTimestamps}
                disabled={isLoadingTimestamps}
                className="w-full mt-2 h-8 text-xs bg-gold/5 hover:bg-gold/10 text-gold border border-gold/10 arabic-text"
              >
                {isLoadingTimestamps ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 ml-1.5 animate-spin" />
                    جارٍ تحميل التوقيتات...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 ml-1.5" />
                    تحميل التوقيتات المتزامنة
                  </>
                )}
              </Button>
            )}

            {/* Reload timestamps when reader changes */}
            {hasReader && hasRealTimestamps && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReloadTimestamps}
                disabled={isLoadingTimestamps}
                className="w-full mt-2 h-8 text-xs bg-emerald/5 hover:bg-emerald/10 text-emerald border border-emerald/10 arabic-text"
              >
                {isLoadingTimestamps ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 ml-1.5 animate-spin" />
                    جارٍ التحديث...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 ml-1.5" />
                    إعادة تحميل التوقيتات
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Error message */}
          {quranProject?.error && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gold/5 border border-gold/10">
              <AlertCircle className="w-3.5 h-3.5 text-gold flex-shrink-0" />
              <span className="text-[11px] text-gold/70 arabic-text">{quranProject.error}</span>
            </div>
          )}

          {/* Verse list */}
          <div className="max-h-48 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {quranProject?.ayahs?.map((ayah) => (
              <div
                key={`${quranProject?.surahId}-${ayah.numberInSurah}`}
                className="flex items-start gap-2 p-2 rounded-lg bg-secondary/50 border border-border/50 text-xs"
              >
                <div className="flex-shrink-0 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1 h-1 rounded-full bg-gold/60" />
                  <span className="text-gold font-medium whitespace-nowrap">{ayah.numberInSurah}</span>
                </div>
                <span className="flex-1 text-foreground/70 truncate arabic-text leading-relaxed">{ayah.text}</span>
                {hasRealTimestamps && ayah.endTime > ayah.startTime && (
                  <span className="text-[9px] text-muted-foreground/40 whitespace-nowrap mt-0.5">
                    {Math.floor(ayah.endTime - ayah.startTime)}ث
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator className="bg-border" />

      {/* Custom texts */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TextCursorInput className="w-4 h-4 text-emerald" />
          <h3 className="text-sm font-semibold text-foreground arabic-text">نص مخصص</h3>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="أدخل نصاً مخصصاً..."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCustomText()}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
          <Button
            onClick={handleAddCustomText}
            size="icon"
            className="bg-gold hover:bg-gold-dark text-background flex-shrink-0"
            disabled={!customText.trim()}
          >
            <TextCursorInput className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
