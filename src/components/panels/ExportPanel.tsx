'use client';

import { useAppStore } from '@/lib/store';
import { aspectRatios, videoPresets, fpsOptions, crfOptions } from '@/lib/quran-data';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Film, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useCallback } from 'react';
import { exportVideo, downloadBlob } from '@/lib/video-engine';
import { getAudioUrl } from '@/lib/quran-data';
import { Progress } from '@/components/ui/progress';

export default function ExportPanel() {
  const {
    exportSettings,
    updateExportSettings,
    design,
    selectedVerses,
    appMode,
    hadithData,
    selectedReader,
  } = useAppStore();

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

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

  const getExportDimensions = () => {
    if (!currentAspect) return { width: 1080, height: 1920 };
    switch (exportSettings.preset) {
      case '1080p':
        return { width: currentAspect.width, height: currentAspect.height };
      case '720p':
        return { width: Math.round(currentAspect.width * 0.667), height: Math.round(currentAspect.height * 0.667) };
      case '480p':
        return { width: Math.round(currentAspect.width * 0.444), height: Math.round(currentAspect.height * 0.444) };
      default:
        return { width: currentAspect.width, height: currentAspect.height };
    }
  };

  const hasContent =
    appMode === 'quran' ? selectedVerses.length > 0 : hadithData.text.trim().length > 0;

  const handleExport = useCallback(async () => {
    if (!hasContent) {
      toast.error('الرجاء اختيار المحتوى أولاً');
      return;
    }

    if (!selectedReader && appMode === 'quran') {
      toast.error('الرجاء اختيار القارئ أولاً');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      const dimensions = getExportDimensions();

      // Build audio URLs
      const audioUrls: string[] = [];
      if (appMode === 'quran' && selectedReader) {
        for (const verse of selectedVerses) {
          const url = `/api/quran/audio?url=${encodeURIComponent(
            getAudioUrl(selectedReader.audioId, verse.surahId, verse.ayahNumber)
          )}`;
          audioUrls.push(url);
        }
      }

      const blob = await exportVideo({
        width: dimensions.width,
        height: dimensions.height,
        fps: parseInt(exportSettings.fps),
        verses: selectedVerses,
        design: {
          bg1: design.bg1,
          bg2: design.bg2,
          accentColor: design.accentColor,
          patternType: design.patternType,
          patternDensity: design.patternDensity,
          showPattern: design.showPattern,
          fontType: design.fontType,
          fontSize: design.fontSize,
          textColor: design.textColor,
          accentTextColor: design.accentTextColor,
          textStyle: design.textStyle,
          showAyahNumber: design.showAyahNumber,
          showSurahName: design.showSurahName,
          showReaderName: design.showReaderName,
          showProgressBar: design.showProgressBar,
          showWatermark: true, // ALWAYS true for export
          customReaderName: design.customReaderName,
        },
        readerName: selectedReader?.name || '',
        mode: appMode,
        hadithData,
        audioUrls,
        onProgress: setExportProgress,
      });

      // Download the video
      const filename = appMode === 'quran'
        ? `qudra-quran-${selectedVerses[0]?.surahName || 'video'}.webm`
        : `qudra-hadith-video.webm`;
      downloadBlob(blob, filename);

      toast.success('تم تصدير الفيديو بنجاح!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('حدث خطأ أثناء التصدير');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [hasContent, appMode, selectedReader, selectedVerses, hadithData, design, exportSettings, getExportDimensions]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <Download className="w-5 h-5 text-gold" />
        <h2 className="text-base font-bold text-foreground arabic-text">تصدير الفيديو</h2>
      </div>

      {/* Status indicators */}
      <div className="space-y-2">
        <div className={`flex items-center gap-2 text-xs ${selectedVerses.length > 0 || hadithData.text ? 'text-emerald' : 'text-muted-foreground'}`}>
          {selectedVerses.length > 0 || hadithData.text ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5" />
          )}
          <span className="arabic-text">المحتوى {selectedVerses.length > 0 || hadithData.text ? '✓' : 'مطلوب'}</span>
        </div>
        {appMode === 'quran' && (
          <div className={`flex items-center gap-2 text-xs ${selectedReader ? 'text-emerald' : 'text-muted-foreground'}`}>
            {selectedReader ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            <span className="arabic-text">القارئ {selectedReader ? '✓' : 'مطلوب'}</span>
          </div>
        )}
      </div>

      <Separator className="bg-border" />

      {/* Quality */}
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

      {/* Resolution info card */}
      <Card className="bg-secondary/50 border-border">
        <CardContent className="p-3 space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground arabic-text">الدقة</span>
            <span className="text-foreground font-mono text-xs">{getResolutionForPreset()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground arabic-text">نسبة العرض</span>
            <span className="text-foreground font-mono text-xs">{design.aspectRatio}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground arabic-text">علامة مائية</span>
            <span className="text-emerald text-xs arabic-text">مفعلة (إلزامية)</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground arabic-text">الصيغة</span>
            <span className="text-foreground font-mono text-xs">WebM (VP9)</span>
          </div>
        </CardContent>
      </Card>

      {/* Export progress */}
      {isExporting && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground arabic-text">جارٍ التصدير...</span>
            <span className="text-xs text-gold font-mono">{exportProgress}%</span>
          </div>
          <Progress value={exportProgress} className="h-2" />
        </div>
      )}

      {/* Export button */}
      <Button
        onClick={handleExport}
        disabled={!hasContent || isExporting || (appMode === 'quran' && !selectedReader)}
        className={`w-full h-12 text-base font-semibold transition-all duration-200 ${
          hasContent && !isExporting && (appMode === 'hadith' || selectedReader)
            ? 'btn-gold'
            : 'bg-secondary text-muted-foreground cursor-not-allowed'
        }`}
      >
        {isExporting ? (
          <>
            <Loader2 className="w-5 h-5 ml-2 animate-spin" />
            <span className="arabic-text">جارٍ التصدير... {exportProgress}%</span>
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
      {hasContent && appMode === 'quran' && !selectedReader && (
        <p className="text-xs text-center text-muted-foreground arabic-text">
          اختر القارئ أولاً لتفعيل التصدير
        </p>
      )}
    </div>
  );
}
