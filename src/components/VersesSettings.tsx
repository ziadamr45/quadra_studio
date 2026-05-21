'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Book, Plus, X, TextCursorInput } from 'lucide-react';
import { toast } from 'sonner';

export default function VersesSettings() {
  const {
    design,
    updateDesign,
    selectedVerses,
    setShowQuranBrowser,
  } = useAppStore();

  const [customText, setCustomText] = useState('');

  const handleAddCustomText = () => {
    if (!customText.trim()) return;
    updateDesign({ customTexts: [...design.customTexts, customText.trim()] });
    setCustomText('');
    toast.success('تمت إضافة النص المخصص');
  };

  const handleRemoveCustomText = (index: number) => {
    const newTexts = design.customTexts.filter((_, i) => i !== index);
    updateDesign({ customTexts: newTexts });
  };

  return (
    <div className="space-y-5">
      {/* Browse Quran Button */}
      <div>
        <Button
          onClick={() => setShowQuranBrowser(true)}
          className="w-full bg-emerald/10 border border-emerald/20 text-emerald hover:bg-emerald/20 h-12"
          variant="outline"
        >
          <Book className="w-5 h-5 ml-2" />
          <span className="arabic-text font-semibold">تصفح القرآن الكريم</span>
        </Button>
      </div>

      {/* Selected verses count */}
      {selectedVerses.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground arabic-text">الآيات المختارة</span>
          <Badge className="bg-emerald/10 text-emerald border-emerald/20">
            {selectedVerses.length} آية
          </Badge>
        </div>
      )}

      <Separator className="bg-border" />

      {/* English translation toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor="english-translation" className="text-sm text-foreground arabic-text">
          الترجمة الإنجليزية
        </Label>
        <Switch
          id="english-translation"
          checked={design.showEnglishTranslation}
          onCheckedChange={(checked) =>
            updateDesign({ showEnglishTranslation: checked })
          }
        />
      </div>

      <Separator className="bg-border" />

      {/* Custom texts */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2 arabic-text">
          <TextCursorInput className="w-4 h-4 text-copper" />
          إضافة نصوص مخصصة
        </h3>

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
            className="bg-emerald hover:bg-emerald/90 text-emerald-foreground flex-shrink-0"
            disabled={!customText.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Custom texts list */}
        {design.customTexts.length > 0 && (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {design.customTexts.map((text, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-2 rounded-lg bg-secondary/50 border border-border/50"
              >
                <p className="text-sm text-foreground flex-1 arabic-text leading-relaxed">
                  {text}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-red-400 flex-shrink-0"
                  onClick={() => handleRemoveCustomText(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
