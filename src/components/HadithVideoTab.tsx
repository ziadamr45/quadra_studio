'use client';

import { useAppStore } from '@/lib/store';
import { hadithCategories } from '@/lib/quran-data';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookOpen, Search } from 'lucide-react';

export default function HadithVideoTab() {
  const { hadithCategory, setHadithCategory, hadithSearch, setHadithSearch } = useAppStore();

  return (
    <div className="space-y-5">
      {/* Hadith category */}
      <div>
        <Label className="text-sm font-semibold text-foreground mb-3 block arabic-text">
          تصنيف الحديث
        </Label>
        <Select value={hadithCategory} onValueChange={setHadithCategory}>
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

      <Separator className="bg-border" />

      {/* Hadith text input */}
      <div>
        <Label className="text-sm font-semibold text-foreground mb-2 block arabic-text">
          نص الحديث
        </Label>
        <Textarea
          placeholder="الصق نص الحديث هنا..."
          rows={6}
          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none arabic-text leading-relaxed"
        />
      </div>

      <Separator className="bg-border" />

      {/* Search for hadith */}
      <div>
        <Label className="text-sm font-semibold text-foreground mb-2 block arabic-text">
          البحث في الأحاديث
        </Label>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن حديث..."
            value={hadithSearch}
            onChange={(e) => setHadithSearch(e.target.value)}
            className="pr-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Quick suggestions */}
        {hadithSearch.trim() && (
          <div className="mt-2 space-y-1">
            <p className="text-[11px] text-muted-foreground arabic-text">اقتراحات سريعة</p>
            <div className="flex flex-wrap gap-1.5">
              {['إنما الأعمال بالنيات', 'لا يؤمن أحدكم', 'خيركم من تعلم القرآن'].map(
                (suggestion) => (
                  <Badge
                    key={suggestion}
                    variant="outline"
                    className="text-[10px] border-border/50 text-muted-foreground hover:border-emerald/30 hover:text-emerald cursor-pointer transition-colors"
                  >
                    {suggestion}
                  </Badge>
                )
              )}
            </div>
          </div>
        )}
      </div>

      <Separator className="bg-border" />

      {/* Info message */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-start gap-2">
          <BookOpen className="w-4 h-4 text-emerald flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-foreground arabic-text leading-relaxed">
              يمكنك إضافة نص أي حديث شريف مع ذكر المصدر والراوي. تأكد من صحة الحديث قبل
              التصدير.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
