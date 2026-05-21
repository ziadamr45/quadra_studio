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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Monitor, Film } from 'lucide-react';
import { toast } from 'sonner';

export default function ExportSettings() {
  const { exportSettings, updateExportSettings, design, selectedVerses } = useAppStore();

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

  const handleExport = () => {
    if (selectedVerses.length === 0) {
      toast.error('الرجاء اختيار الآيات أولاً');
      return;
    }
    toast.success('جارٍ تحضير الفيديو للتصدير...');
  };

  return (
    <div className="space-y-5">
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
                ? 'border-emerald bg-emerald/5'
                : 'border-border hover:border-emerald/30'
            }`}
          >
            <RadioGroupItem value="mp4" id="mp4" className="sr-only" />
            <Film className="w-6 h-6 text-emerald" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground arabic-text">MP4</p>
              <Badge className="bg-emerald/10 text-emerald border-emerald/20 text-[9px] mt-1">
                موصى به
              </Badge>
            </div>
          </Label>

          <Label
            htmlFor="turbo-mp4"
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 cursor-pointer transition-all ${
              exportSettings.format === 'turbo-mp4'
                ? 'border-emerald bg-emerald/5'
                : 'border-border hover:border-emerald/30'
            }`}
          >
            <RadioGroupItem value="turbo-mp4" id="turbo-mp4" className="sr-only" />
            <Monitor className="w-6 h-6 text-copper" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground arabic-text">Turbo MP4</p>
              <Badge className="bg-copper/10 text-copper-light border-copper/20 text-[9px] mt-1">
                WebCodecs
              </Badge>
            </div>
          </Label>
        </RadioGroup>
      </div>

      <Separator className="bg-border" />

      {/* Preset */}
      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block arabic-text">
          الجودة
        </Label>
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
        <Label htmlFor="cinematic-audio" className="text-sm text-foreground arabic-text">
          صوت سينمائي
        </Label>
        <Switch
          id="cinematic-audio"
          checked={exportSettings.enableCinematicAudio}
          onCheckedChange={(checked) =>
            updateExportSettings({ enableCinematicAudio: checked })
          }
        />
      </div>

      {/* Resolution info */}
      <Card className="bg-secondary/50 border-border">
        <CardContent className="p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground arabic-text">الدقة</span>
            <span className="text-foreground font-mono">{getResolutionForPreset()}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-muted-foreground arabic-text">نسبة العرض</span>
            <span className="text-foreground font-mono">{design.aspectRatio}</span>
          </div>
        </CardContent>
      </Card>

      {/* Export button */}
      <Button
        onClick={handleExport}
        disabled={selectedVerses.length === 0}
        className={`w-full h-12 text-base font-semibold ${
          selectedVerses.length > 0
            ? 'bg-emerald hover:bg-emerald/90 text-emerald-foreground glow-emerald'
            : 'bg-secondary text-muted-foreground cursor-not-allowed'
        }`}
      >
        <Download className="w-5 h-5 ml-2" />
        <span className="arabic-text">تصدير الفيديو</span>
      </Button>

      {selectedVerses.length === 0 && (
        <p className="text-xs text-center text-muted-foreground arabic-text">
          اختر الآيات أولاً لتفعيل التصدير
        </p>
      )}
    </div>
  );
}
