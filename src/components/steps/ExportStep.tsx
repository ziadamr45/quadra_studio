'use client';

import { useAppStore } from '@/lib/store';
import { aspectRatios, videoPresets, fpsOptions, crfOptions } from '@/lib/quran-data';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Monitor, Film, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import Image from 'next/image';

export default function ExportStep() {
  const { exportSettings, updateExportSettings, design, selectedVerses, appMode, hadithData } =
    useAppStore();
  const [isExporting, setIsExporting] = useState(false);

  const currentAspect = aspectRatios.find((a) => a.id === design.aspectRatio);

  const getResolutionForPreset = () => {
    if (!currentAspect) return '1080 × 1920';
    switch (exportSettings.preset) {
      case '1080p':
        return `${currentAspect.width} × ${currentAspect.height}`;
      case '720p':
        return `${Math.round(currentAspect.width * 0.667)} × ${Math.round(currentAspect.height * 0.667)}`;
      case '480p':
        return `${Math.round(currentAspect.width * 0.444)} × ${Math.round(currentAspect.height * 0.444)}`;
      default:
        return `${currentAspect.width} × ${currentAspect.height}`;
    }
  };

  const hasContent = appMode === 'quran' ? selectedVerses.length > 0 : hadithData.text.trim().length > 0;

  const handleExport = () => {
    if (!hasContent) {
      toast.error('الرجاء اختيار المحتوى أولاً');
      return;
    }

    setIsExporting(true);

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      toast.success('تم تصدير الفيديو بنجاح!');
    }, 3000);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <Download className="w-5 h-5 text-qudra" />
        <h2 className="text-base font-bold text-foreground arabic-text">تصدير الفيديو</h2>
      </div>

      {/* Format selection */}
      <div>
        <Label className="text-sm font-semibold text-foreground mb-3 block arabic-text">
          صيغة التصدير
        </Label>
        <RadioGroup
          value={exportSettings.format}
          onValueChange={(value) =>
            updateExportSettings({ format: value as 'mp4' | 'turbo-mp4' })
          }
          className="grid grid-cols-2 gap-3"
        >
          <Label
            htmlFor="mp4"
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 cursor-pointer transition-all ${
              exportSettings.format === 'mp4'
                ? 'border-qudra bg-qudra/5'
                : 'border-border hover:border-qudra/30'
            }`}
          >
            <RadioGroupItem value="mp4" id="mp4" className="sr-only" />
            <Film className="w-6 h-6 text-qudra" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground arabic-text">MP4</p>
              <Badge className="bg-qudra/10 text-qudra border-qudra/20 text-[9px] mt-1">
                موصى به
              </Badge>
            </div>
          </Label>

          <Label
            htmlFor="turbo-mp4"
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 cursor-pointer transition-all ${
              exportSettings.format === 'turbo-mp4'
                ? 'border-qudra bg-qudra/5'
                : 'border-border hover:border-qudra/30'
            }`}
          >
            <RadioGroupItem value="turbo-mp4" id="turbo-mp4" className="sr-only" />
            <Monitor className="w-6 h-6 text-sage" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground arabic-text">Turbo MP4</p>
              <Badge className="bg-sage/10 text-sage border-sage/20 text-[9px] mt-1">
                WebCodecs
              </Badge>
            </div>
          </Label>
        </RadioGroup>
      </div>

      <Separator className="bg-border" />

      {/* Preset */}
      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">الجودة</Label>
        <Select
          value={exportSettings.preset}
          onValueChange={(value) => updateExportSettings({ preset: value })}
        >
          <SelectTrigger className="bg-secondary border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {videoPresets.map((p) => (
              <SelectItem key={p.id} value={p.id} className="arabic-text">
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* FPS */}
      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
          عدد الإطارات
        </Label>
        <Select
          value={exportSettings.fps}
          onValueChange={(value) => updateExportSettings({ fps: value })}
        >
          <SelectTrigger className="bg-secondary border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {fpsOptions.map((f) => (
              <SelectItem key={f.id} value={f.id} className="arabic-text">
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* CRF */}
      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
          جودة الضغط (CRF)
        </Label>
        <Select
          value={exportSettings.crf}
          onValueChange={(value) => updateExportSettings({ crf: value })}
        >
          <SelectTrigger className="bg-secondary border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {crfOptions.map((c) => (
              <SelectItem key={c.id} value={c.id} className="arabic-text">
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-border" />

      {/* Cinematic audio toggle */}
      <div className="flex items-center justify-between">
        <Label className="text-sm text-foreground arabic-text">صوت سينمائي</Label>
        <button
          onClick={() =>
            updateExportSettings({ enableCinematicAudio: !exportSettings.enableCinematicAudio })
          }
          className={`w-10 h-5 rounded-full transition-all ${
            exportSettings.enableCinematicAudio ? 'bg-qudra' : 'bg-secondary'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transition-transform ${
              exportSettings.enableCinematicAudio ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Resolution info card */}
      <Card className="bg-secondary/50 border-border">
        <CardContent className="p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground arabic-text">الدقة</span>
            <span className="text-foreground font-mono text-xs">{getResolutionForPreset()}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-muted-foreground arabic-text">نسبة العرض</span>
            <span className="text-foreground font-mono text-xs">{design.aspectRatio}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-muted-foreground arabic-text">علامة مائية</span>
            <span className="text-foreground text-xs">
              {design.showWatermark ? (
                <span className="flex items-center gap-1">
                  <Image src="/qudra-logo.png" alt="" width={12} height={12} className="rounded-sm" />
                  Qudra Studio
                </span>
              ) : (
                'معطلة'
              )}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Export button */}
      <Button
        onClick={handleExport}
        disabled={selectedVerses.length === 0 || isExporting}
        className={`w-full h-12 text-base font-semibold ${
          hasContent && !isExporting
            ? 'bg-qudra hover:bg-qudra-dark text-white'
            : 'bg-secondary text-muted-foreground cursor-not-allowed'
        }`}
      >
        {isExporting ? (
          <>
            <Loader2 className="w-5 h-5 ml-2 animate-spin" />
            <span className="arabic-text">جارٍ التصدير...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5 ml-2" />
            <span className="arabic-text">تصدير الفيديو</span>
          </>
        )}
      </Button>

      {!hasContent && (
        <p className="text-xs text-center text-muted-foreground arabic-text">
          اختر المحتوى أولاً لتفعيل التصدير
        </p>
      )}
    </div>
  );
}
