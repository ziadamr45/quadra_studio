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
import { Label } from '@/components/ui/label';
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

export default function DesignStep() {
  const { design, updateDesign } = useAppStore();

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-3">
        <Palette className="w-5 h-5 text-qudra" />
        <h2 className="text-base font-bold text-foreground arabic-text">تخصيص التصميم</h2>
      </div>

      <Accordion
        type="multiple"
        defaultValue={['templates', 'colors', 'text', 'cinematic']}
        className="space-y-1"
      >
        {/* Templates Section */}
        <AccordionItem value="templates" className="border-border">
          <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-qudra" />
              <span className="arabic-text">القوالب</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {videoTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() =>
                    updateDesign({
                      templateId: template.id,
                      bg1: template.bg1,
                      bg2: template.bg2,
                      accentColor: template.accentColor,
                      patternType: template.patternType,
                    })
                  }
                  className={`rounded-xl p-3 text-right border-2 transition-all ${
                    design.templateId === template.id
                      ? 'border-qudra'
                      : 'border-transparent hover:border-border'
                  }`}
                  style={{ background: template.bg1 }}
                >
                  {/* Color preview */}
                  <div className="flex gap-1 mb-2">
                    <div className="h-1 flex-1 rounded-full" style={{ background: template.bg1 }} />
                    <div className="h-1 flex-1 rounded-full" style={{ background: template.bg2 }} />
                    <div className="h-1 w-4 rounded-full" style={{ background: template.accentColor }} />
                  </div>

                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm">{template.icon}</span>
                    <span className="text-[11px] font-semibold text-white/90 arabic-text">
                      {template.name}
                    </span>
                  </div>
                  <p className="text-[9px] text-white/40 leading-relaxed arabic-text">
                    {template.description}
                  </p>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Colors & Patterns */}
        <AccordionItem value="colors" className="border-border">
          <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-sage" />
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
                  <Label className="text-xs text-muted-foreground arabic-text">كثافة الزخرفة</Label>
                  <span className="text-xs text-qudra">{design.patternDensity}</span>
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
                <Label className="text-sm text-foreground arabic-text">إظهار الزخرفة</Label>
                <button
                  onClick={() => updateDesign({ showPattern: !design.showPattern })}
                  className={`w-10 h-5 rounded-full transition-all ${
                    design.showPattern ? 'bg-qudra' : 'bg-secondary'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      design.showPattern ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
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

        {/* Text Settings */}
        <AccordionItem value="text" className="border-border">
          <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-qudra" />
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
                    لون مميز
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

              {/* Toggle options */}
              <div className="space-y-3">
                {([
                  { key: 'showAyahNumber' as const, label: 'رقم الآية' },
                  { key: 'showReaderName' as const, label: 'اسم القارئ' },
                  { key: 'showText' as const, label: 'إظهار النص' },
                  { key: 'showSurahName' as const, label: 'اسم السورة' },
                  { key: 'showProgressBar' as const, label: 'شريط التقدم' },
                  { key: 'showWatermark' as const, label: 'علامة مائية' },
                ]).map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <Label className="text-sm text-foreground arabic-text">{item.label}</Label>
                    <button
                      onClick={() =>
                        updateDesign({ [item.key]: !design[item.key] })
                      }
                      className={`w-10 h-5 rounded-full transition-all ${
                        design[item.key] ? 'bg-qudra' : 'bg-secondary'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          design[item.key] ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Cinematic */}
        <AccordionItem value="cinematic" className="border-border">
          <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-sage" />
              <span className="arabic-text">إعدادات الفيديو</span>
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
