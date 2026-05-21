'use client';

import { useAppStore } from '@/lib/store';
import {
  videoTemplates,
  patternTypes,
  fontTypes,
  textStyleOptions,
  imageMotionOptions,
  aspectRatios,
  videoEffects,
} from '@/lib/quran-data';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Palette, Type, Film, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DesignSettings() {
  const { design, updateDesign } = useAppStore();

  return (
    <div>
      <Accordion
        type="multiple"
        defaultValue={['templates', 'colors', 'text', 'cinematic']}
        className="space-y-1"
      >
        {/* Templates Section */}
        <AccordionItem value="templates" className="border-border">
          <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald" />
              <span className="arabic-text">القوالب</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {videoTemplates.map((template) => (
                <motion.button
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    updateDesign({
                      templateId: template.id,
                      bg1: template.bg1,
                      bg2: template.bg2,
                      accentColor: template.accentColor,
                      patternType: template.patternType,
                    })
                  }
                  className={`template-card rounded-xl p-3 text-right ${
                    design.templateId === template.id ? 'selected' : ''
                  }`}
                  style={{ background: `${template.bg1}` }}
                >
                  {/* Color preview bar */}
                  <div className="flex gap-1 mb-2">
                    <div
                      className="h-1.5 flex-1 rounded-full"
                      style={{ background: template.bg1 }}
                    />
                    <div
                      className="h-1.5 flex-1 rounded-full"
                      style={{ background: template.bg2 }}
                    />
                    <div
                      className="h-1.5 w-4 rounded-full"
                      style={{ background: template.accentColor }}
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{template.icon}</span>
                    <span className="text-xs font-semibold text-foreground/90 arabic-text">
                      {template.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-foreground/50 leading-relaxed arabic-text">
                    {template.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Colors & Patterns Section */}
        <AccordionItem value="colors" className="border-border">
          <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-copper" />
              <span className="arabic-text">الألوان والزخارف</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-1">
              {/* Pattern type */}
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
                  نوع الزخرفة
                </Label>
                <Select
                  value={design.patternType}
                  onValueChange={(value) => updateDesign({ patternType: value })}
                >
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {patternTypes.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="arabic-text">
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
                    اللون الأساسي
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={design.bg1}
                      onChange={(e) => updateDesign({ bg1: e.target.value })}
                      className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent"
                    />
                    <Input
                      value={design.bg1}
                      onChange={(e) => updateDesign({ bg1: e.target.value })}
                      className="bg-secondary border-border text-foreground text-xs"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
                    اللون الثانوي
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={design.bg2}
                      onChange={(e) => updateDesign({ bg2: e.target.value })}
                      className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent"
                    />
                    <Input
                      value={design.bg2}
                      onChange={(e) => updateDesign({ bg2: e.target.value })}
                      className="bg-secondary border-border text-foreground text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Pattern density */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label className="text-xs text-muted-foreground arabic-text">
                    كثافة الزخرفة
                  </Label>
                  <span className="text-xs text-emerald">{design.patternDensity}</span>
                </div>
                <Slider
                  value={[design.patternDensity]}
                  onValueChange={([value]) => updateDesign({ patternDensity: value })}
                  min={0}
                  max={10}
                  step={1}
                  className="py-2"
                />
              </div>

              {/* Show pattern toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="show-pattern" className="text-sm text-foreground arabic-text">
                  إظهار الزخرفة
                </Label>
                <Switch
                  id="show-pattern"
                  checked={design.showPattern}
                  onCheckedChange={(checked) => updateDesign({ showPattern: checked })}
                />
              </div>

              <Separator className="bg-border" />

              {/* Image motion */}
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
                  حركة الصورة
                </Label>
                <Select
                  value={design.imageMotion}
                  onValueChange={(value) => updateDesign({ imageMotion: value })}
                >
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {imageMotionOptions.map((m) => (
                      <SelectItem key={m.id} value={m.id} className="arabic-text">
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Text Settings Section */}
        <AccordionItem value="text" className="border-border">
          <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-emerald" />
              <span className="arabic-text">إعدادات النص</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-1">
              {/* Font type */}
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
                  نوع الخط
                </Label>
                <Select
                  value={design.fontType}
                  onValueChange={(value) => updateDesign({ fontType: value })}
                >
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {fontTypes.map((f) => (
                      <SelectItem key={f.id} value={f.id} className="arabic-text">
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom reader name */}
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
                  اسم القارئ المخصص
                </Label>
                <Input
                  placeholder="اتركه فارغاً للاسم الافتراضي"
                  value={design.customReaderName}
                  onChange={(e) => updateDesign({ customReaderName: e.target.value })}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Text colors */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
                    لون النص
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={design.textColor}
                      onChange={(e) => updateDesign({ textColor: e.target.value })}
                      className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent"
                    />
                    <Input
                      value={design.textColor}
                      onChange={(e) => updateDesign({ textColor: e.target.value })}
                      className="bg-secondary border-border text-foreground text-xs"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
                    لون النص المميز
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={design.accentTextColor}
                      onChange={(e) => updateDesign({ accentTextColor: e.target.value })}
                      className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent"
                    />
                    <Input
                      value={design.accentTextColor}
                      onChange={(e) => updateDesign({ accentTextColor: e.target.value })}
                      className="bg-secondary border-border text-foreground text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Text style */}
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
                  نمط النص
                </Label>
                <Select
                  value={design.textStyle}
                  onValueChange={(value) => updateDesign({ textStyle: value })}
                >
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {textStyleOptions.map((s) => (
                      <SelectItem key={s.id} value={s.id} className="arabic-text">
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-border" />

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-ayah-number" className="text-sm text-foreground arabic-text">
                    رقم الآية
                  </Label>
                  <Checkbox
                    id="show-ayah-number"
                    checked={design.showAyahNumber}
                    onCheckedChange={(checked) =>
                      updateDesign({ showAyahNumber: checked as boolean })
                    }
                    className="border-border data-[state=checked]:bg-emerald data-[state=checked]:border-emerald"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-reader-name" className="text-sm text-foreground arabic-text">
                    اسم القارئ
                  </Label>
                  <Checkbox
                    id="show-reader-name"
                    checked={design.showReaderName}
                    onCheckedChange={(checked) =>
                      updateDesign({ showReaderName: checked as boolean })
                    }
                    className="border-border data-[state=checked]:bg-emerald data-[state=checked]:border-emerald"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-text" className="text-sm text-foreground arabic-text">
                    إظهار النص
                  </Label>
                  <Checkbox
                    id="show-text"
                    checked={design.showText}
                    onCheckedChange={(checked) =>
                      updateDesign({ showText: checked as boolean })
                    }
                    className="border-border data-[state=checked]:bg-emerald data-[state=checked]:border-emerald"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-surah-name" className="text-sm text-foreground arabic-text">
                    اسم السورة
                  </Label>
                  <Checkbox
                    id="show-surah-name"
                    checked={design.showSurahName}
                    onCheckedChange={(checked) =>
                      updateDesign({ showSurahName: checked as boolean })
                    }
                    className="border-border data-[state=checked]:bg-emerald data-[state=checked]:border-emerald"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-progress" className="text-sm text-foreground arabic-text">
                    شريط التقدم
                  </Label>
                  <Checkbox
                    id="show-progress"
                    checked={design.showProgressBar}
                    onCheckedChange={(checked) =>
                      updateDesign({ showProgressBar: checked as boolean })
                    }
                    className="border-border data-[state=checked]:bg-emerald data-[state=checked]:border-emerald"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Cinematic Section */}
        <AccordionItem value="cinematic" className="border-border">
          <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-copper" />
              <span className="arabic-text">سينمائي</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-1">
              {/* Aspect ratio */}
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
                  نسبة العرض
                </Label>
                <Select
                  value={design.aspectRatio}
                  onValueChange={(value) => updateDesign({ aspectRatio: value })}
                >
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {aspectRatios.map((a) => (
                      <SelectItem key={a.id} value={a.id} className="arabic-text">
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Video effect */}
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
                  تأثير الفيديو
                </Label>
                <Select
                  value={design.videoEffect}
                  onValueChange={(value) => updateDesign({ videoEffect: value })}
                >
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {videoEffects.map((e) => (
                      <SelectItem key={e.id} value={e.id} className="arabic-text">
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
