'use client';

import { useAppStore } from '@/lib/store';
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
import { Book, Plus, X, TextCursorInput, MessageSquare } from 'lucide-react';
import { hadithCategories } from '@/lib/quran-data';
import { toast } from 'sonner';
import { useState } from 'react';

export default function ContentStep() {
  const { appMode, selectedVerses, setShowQuranBrowser, hadithData, updateHadithData, design, updateDesign } = useAppStore();
  const [customText, setCustomText] = useState('');

  const handleAddCustomText = () => {
    if (!customText.trim()) return;
    updateDesign({ customTexts: [...design.customTexts, customText.trim()] });
    setCustomText('');
    toast.success('تمت إضافة النص');
  };

  const handleRemoveCustomText = (index: number) => {
    const newTexts = design.customTexts.filter((_, i) => i !== index);
    updateDesign({ customTexts: newTexts });
  };

  if (appMode === 'hadith') {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-5 h-5 text-qudra" />
          <h2 className="text-base font-bold text-foreground arabic-text">محتوى الحديث</h2>
        </div>

        {/* Hadith category */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
            تصنيف الحديث
          </Label>
          <Select
            value={hadithData.category}
            onValueChange={(value) => updateHadithData({ category: value })}
          >
            <SelectTrigger className="bg-secondary border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {hadithCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} className="arabic-text">
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Source */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
            المصدر
          </Label>
          <Input
            placeholder="مثال: رواه البخاري ومسلم"
            value={hadithData.source}
            onChange={(e) => updateHadithData({ source: e.target.value })}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
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
        <Book className="w-5 h-5 text-qudra" />
        <h2 className="text-base font-bold text-foreground arabic-text">اختر الآيات</h2>
      </div>

      {/* Browse Quran Button */}
      <Button
        onClick={() => setShowQuranBrowser(true)}
        className="w-full bg-qudra/10 border border-qudra/20 text-qudra hover:bg-qudra/20 h-14 text-base"
        variant="outline"
      >
        <Book className="w-5 h-5 ml-2" />
        <span className="arabic-text font-semibold">تصفح القرآن الكريم</span>
      </Button>

      {/* Selected verses */}
      {selectedVerses.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground arabic-text">الآيات المختارة</span>
            <Badge className="bg-qudra/10 text-qudra border-qudra/20 text-[10px]">
              {selectedVerses.length} آية
            </Badge>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {selectedVerses.map((verse, index) => (
              <div
                key={`${verse.surahId}-${verse.ayahNumber}`}
                className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 border border-border/50 text-xs"
              >
                <span className="text-qudra font-medium">{verse.surahName}</span>
                <span className="text-muted-foreground">آية {verse.ayahNumber}</span>
                <span className="flex-1 text-foreground truncate arabic-text">{verse.ayahText}</span>
                <button
                  onClick={() => useAppStore.getState().removeVerse(verse.surahId, verse.ayahNumber)}
                  className="text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator className="bg-border" />

      {/* English translation toggle */}
      <div className="flex items-center justify-between">
        <Label className="text-sm text-foreground arabic-text">الترجمة الإنجليزية</Label>
        <button
          onClick={() => updateDesign({ showEnglishTranslation: !design.showEnglishTranslation })}
          className={`w-10 h-5 rounded-full transition-all ${
            design.showEnglishTranslation ? 'bg-qudra' : 'bg-secondary'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transition-transform ${
              design.showEnglishTranslation ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      <Separator className="bg-border" />

      {/* Custom texts */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TextCursorInput className="w-4 h-4 text-sage" />
          <h3 className="text-sm font-semibold text-foreground arabic-text">نصوص مخصصة</h3>
        </div>

        <div className="flex gap-2 mb-3">
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
            className="bg-qudra hover:bg-qudra-dark text-white flex-shrink-0"
            disabled={!customText.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {design.customTexts.length > 0 && (
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {design.customTexts.map((text, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-2 rounded-lg bg-secondary/50 border border-border/50"
              >
                <p className="text-xs text-foreground flex-1 arabic-text leading-relaxed">{text}</p>
                <button
                  onClick={() => handleRemoveCustomText(index)}
                  className="text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
