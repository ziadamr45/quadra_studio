'use client';

import { useAppStore } from '@/lib/store';
import {
  videoTemplates,
  patternTypes,
  fontTypes,
  textStyleOptions,
  imageMotionOptions,
  aspectRatios,
  transitionTypes,
  textPositionOptions,
} from '@/lib/quran-data';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Palette,
  Type,
  Film,
  Sparkles,
  Image as ImageIcon,
  Monitor,
  Move,
  Hash,
  BookOpen,
  Mic,
  BarChart3,
  Shield,
  RatioIcon,
  Layers,
} from 'lucide-react';

export default function DesignPanel() {
  const { design, updateDesign, applyTemplate } = useAppStore();

  return (
    <div className="space-y-5 pb-4" dir="rtl">
      {/* Section Title */}
      <div className="flex items-center gap-2">
        <Palette className="w-5 h-5 text-gold" />
        <h2 className="text-base font-bold text-foreground arabic-text">تخصيص التصميم</h2>
      </div>

      {/* ====================== TEMPLATES SECTION ====================== */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold" />
          <h3 className="text-sm font-semibold text-foreground arabic-text">القوالب</h3>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {videoTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() =>
                applyTemplate({
                  id: template.id,
                  bg1: template.bg1,
                  bg2: template.bg2,
                  accentColor: template.accentColor,
                  patternType: template.patternType,
                })
              }
              className={`group rounded-lg p-2.5 text-center border-2 transition-all duration-200 hover:scale-[1.02] ${
                design.templateId === template.id
                  ? 'border-gold shadow-md shadow-gold/10 bg-card'
                  : 'border-border/50 bg-card hover:border-border'
              }`}
            >
              {/* Icon & color swatch */}
              <div className="flex items-center justify-center gap-1 mb-1.5">
                <span className="text-base transition-transform duration-200 group-hover:scale-110 inline-block">
                  {template.icon}
                </span>
              </div>

              {/* Color swatch bar */}
              <div className="flex gap-0.5 mb-1.5 justify-center">
                <div
                  className="h-1 w-4 rounded-full"
                  style={{ background: template.bg1 }}
                />
                <div
                  className="h-1 w-4 rounded-full"
                  style={{ background: template.bg2 }}
                />
                <div
                  className="h-1 w-4 rounded-full"
                  style={{ background: template.accentColor }}
                />
              </div>

              {/* Template name */}
              <span className="text-[11px] font-semibold text-foreground/90 arabic-text block">
                {template.name}
              </span>
              <span className="text-[9px] text-muted-foreground arabic-text block">
                {template.nameEn}
              </span>
            </button>
          ))}
        </div>
      </section>

      <Separator className="bg-border/50" />

      {/* ====================== BACKGROUND SECTION ====================== */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-gold" />
          <h3 className="text-sm font-semibold text-foreground arabic-text">الخلفية</h3>
        </div>

        {/* Background image URL */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
            صورة خلفية مخصصة (رابط)
          </Label>
          <Input
            placeholder="https://example.com/bg.jpg"
            value={design.backgroundImage}
            onChange={(e) => updateDesign({ backgroundImage: e.target.value })}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50 text-xs h-9"
          />
        </div>

        {/* Image motion effect */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
            تأثير حركة الصورة
          </Label>
          <Select
            value={design.imageMotion}
            onValueChange={(value) => updateDesign({ imageMotion: value })}
          >
            <SelectTrigger className="bg-secondary border-border text-foreground h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {imageMotionOptions.map((m) => (
                <SelectItem key={m.id} value={m.id} className="arabic-text text-xs">
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pattern type */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
            نوع الزخرفة
          </Label>
          <Select
            value={design.patternType}
            onValueChange={(value) => updateDesign({ patternType: value })}
          >
            <SelectTrigger className="bg-secondary border-border text-foreground h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {patternTypes.map((p) => (
                <SelectItem key={p.id} value={p.id} className="arabic-text text-xs">
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pattern density slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="text-xs text-muted-foreground arabic-text">كثافة الزخرفة</Label>
            <span className="text-xs text-gold font-mono">{design.patternDensity}</span>
          </div>
          <Slider
            value={[design.patternDensity]}
            onValueChange={([value]) => updateDesign({ patternDensity: value })}
            min={1}
            max={8}
            step={1}
          />
        </div>

        {/* Show pattern toggle */}
        <div className="flex items-center justify-between">
          <Label className="text-sm text-foreground arabic-text">إظهار الزخرفة</Label>
          <Switch
            checked={design.showPattern}
            onCheckedChange={(checked) => updateDesign({ showPattern: checked })}
            className="data-[state=checked]:bg-gold"
          />
        </div>
      </section>

      <Separator className="bg-border/50" />

      {/* ====================== TYPOGRAPHY SECTION ====================== */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-gold" />
          <h3 className="text-sm font-semibold text-foreground arabic-text">الخط والنص</h3>
        </div>

        {/* Font type */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
            نوع الخط
          </Label>
          <Select
            value={design.fontType}
            onValueChange={(value) => updateDesign({ fontType: value })}
          >
            <SelectTrigger className="bg-secondary border-border text-foreground h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {fontTypes.map((f) => (
                <SelectItem key={f.id} value={f.id} className="arabic-text text-xs">
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font size slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="text-xs text-muted-foreground arabic-text">حجم الخط</Label>
            <span className="text-xs text-gold font-mono">{design.fontSize}px</span>
          </div>
          <Slider
            value={[design.fontSize]}
            onValueChange={([value]) => updateDesign({ fontSize: value })}
            min={16}
            max={48}
            step={1}
          />
        </div>

        {/* Text style */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
            نمط النص
          </Label>
          <div className="grid grid-cols-4 gap-1.5">
            {textStyleOptions.map((s) => (
              <button
                key={s.id}
                onClick={() => updateDesign({ textStyle: s.id })}
                className={`rounded-md py-1.5 px-2 text-[11px] transition-all border arabic-text ${
                  design.textStyle === s.id
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-border bg-secondary text-muted-foreground hover:border-border/80 hover:text-foreground'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Text position */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
            موضع النص
          </Label>
          <div className="grid grid-cols-3 gap-1.5">
            {textPositionOptions.map((p) => (
              <button
                key={p.id}
                onClick={() => updateDesign({ textPosition: p.id })}
                className={`rounded-md py-1.5 px-2 text-[11px] transition-all border arabic-text flex flex-col items-center gap-0.5 ${
                  design.textPosition === p.id
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-border bg-secondary text-muted-foreground hover:border-border/80 hover:text-foreground'
                }`}
              >
                <Move className="w-3 h-3" />
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Colors row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Text color */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
              لون النص
            </Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={design.textColor}
                onChange={(e) => updateDesign({ textColor: e.target.value })}
                className="w-8 h-8 rounded-lg border-2 border-border cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
              />
              <span className="text-[10px] text-muted-foreground font-mono">{design.textColor}</span>
            </div>
          </div>
          {/* Accent color */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
              لون مميز
            </Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={design.accentTextColor}
                onChange={(e) => updateDesign({ accentTextColor: e.target.value })}
                className="w-8 h-8 rounded-lg border-2 border-border cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
              />
              <span className="text-[10px] text-muted-foreground font-mono">{design.accentTextColor}</span>
            </div>
          </div>
        </div>
      </section>

      <Separator className="bg-border/50" />

      {/* ====================== DISPLAY OPTIONS ====================== */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-gold" />
          <h3 className="text-sm font-semibold text-foreground arabic-text">خيارات العرض</h3>
        </div>

        <div className="space-y-3">
          {/* Show ayah number */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="w-3.5 h-3.5 text-muted-foreground" />
              <Label className="text-sm text-foreground arabic-text">رقم الآية</Label>
            </div>
            <Switch
              checked={design.showAyahNumber}
              onCheckedChange={(checked) => updateDesign({ showAyahNumber: checked })}
              className="data-[state=checked]:bg-gold"
            />
          </div>

          {/* Show surah name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
              <Label className="text-sm text-foreground arabic-text">اسم السورة</Label>
            </div>
            <Switch
              checked={design.showSurahName}
              onCheckedChange={(checked) => updateDesign({ showSurahName: checked })}
              className="data-[state=checked]:bg-gold"
            />
          </div>

          {/* Show reader name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="w-3.5 h-3.5 text-muted-foreground" />
              <Label className="text-sm text-foreground arabic-text">اسم القارئ</Label>
            </div>
            <Switch
              checked={design.showReaderName}
              onCheckedChange={(checked) => updateDesign({ showReaderName: checked })}
              className="data-[state=checked]:bg-gold"
            />
          </div>

          {/* Show progress bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5 text-muted-foreground" />
              <Label className="text-sm text-foreground arabic-text">شريط التقدم</Label>
            </div>
            <Switch
              checked={design.showProgressBar}
              onCheckedChange={(checked) => updateDesign({ showProgressBar: checked })}
              className="data-[state=checked]:bg-gold"
            />
          </div>

          {/* Show watermark */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-muted-foreground" />
              <Label className="text-sm text-foreground arabic-text">علامة مائية</Label>
            </div>
            <Switch
              checked={design.showWatermark}
              onCheckedChange={(checked) => updateDesign({ showWatermark: checked })}
              className="data-[state=checked]:bg-gold"
            />
          </div>
        </div>
      </section>

      <Separator className="bg-border/50" />

      {/* ====================== ASPECT RATIO ====================== */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <RatioIcon className="w-4 h-4 text-gold" />
          <h3 className="text-sm font-semibold text-foreground arabic-text">نسبة العرض</h3>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {aspectRatios.map((ratio) => {
            const isSelected = design.aspectRatio === ratio.id;
            return (
              <button
                key={ratio.id}
                onClick={() => updateDesign({ aspectRatio: ratio.id })}
                className={`rounded-lg p-2 text-center border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                  isSelected
                    ? 'border-gold bg-gold/10'
                    : 'border-border/50 bg-card hover:border-border'
                }`}
              >
                {/* Visual ratio icon */}
                <div
                  className={`rounded-sm border-2 transition-colors ${
                    isSelected ? 'border-gold' : 'border-muted-foreground/40'
                  }`}
                  style={{
                    width: ratio.id === '9:16' ? 14 : ratio.id === '1:1' ? 22 : 26,
                    height: ratio.id === '16:9' ? 14 : ratio.id === '1:1' ? 22 : 26,
                  }}
                />
                <span
                  className={`text-[10px] font-mono font-semibold ${
                    isSelected ? 'text-gold' : 'text-muted-foreground'
                  }`}
                >
                  {ratio.id}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <Separator className="bg-border/50" />

      {/* ====================== TRANSITIONS ====================== */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-gold" />
          <h3 className="text-sm font-semibold text-foreground arabic-text">الانتقالات</h3>
        </div>

        {/* Transition type */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
            نوع الانتقال
          </Label>
          <div className="grid grid-cols-4 gap-1.5">
            {transitionTypes.map((t) => (
              <button
                key={t.id}
                onClick={() => updateDesign({ transitionType: t.id })}
                className={`rounded-md py-1.5 px-2 text-[11px] transition-all border arabic-text ${
                  design.transitionType === t.id
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-border bg-secondary text-muted-foreground hover:border-border/80 hover:text-foreground'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Transition duration slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="text-xs text-muted-foreground arabic-text">مدة الانتقال</Label>
            <span className="text-xs text-gold font-mono">{design.transitionDuration.toFixed(1)}s</span>
          </div>
          <Slider
            value={[design.transitionDuration]}
            onValueChange={([value]) => updateDesign({ transitionDuration: value })}
            min={0.1}
            max={1.0}
            step={0.1}
          />
        </div>
      </section>
    </div>
  );
}
