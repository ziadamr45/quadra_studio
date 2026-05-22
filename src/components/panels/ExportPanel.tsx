'use client';

import { useAppStore } from '@/lib/store';
import { aspectRatios, qualityOptions } from '@/lib/quran-data';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Settings,
  FileVideo,
  Clock,
  HardDrive,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCallback, useRef } from 'react';
import { exportVideo, downloadBlob } from '@/lib/video-engine';

type ExportStatus = 'idle' | 'preparing' | 'rendering' | 'finalizing' | 'complete' | 'error';

export default function ExportPanel() {
  const {
    exportSettings,
    updateExportSettings,
    design,
    quranProject,
    appMode,
    hadithData,
    isExporting,
    setIsExporting,
    exportProgress,
    setExportProgress,
  } = useAppStore();

  const abortRef = useRef(false);

  const selectedReader = quranProject.reader;
  const selectedAyahs = quranProject.ayahs;

  const currentAspect = aspectRatios.find((a) => a.id === design.aspectRatio);

  const hasContent =
    appMode === 'quran'
      ? (selectedAyahs?.length ?? 0) > 0
      : (hadithData?.text || '').trim().length > 0;

  const getExportDimensions = () => {
    if (!currentAspect) return { width: 1080, height: 1920 };
    switch (exportSettings.preset) {
      case '1080p':
        return { width: currentAspect.width, height: currentAspect.height };
      case '720p':
        return {
          width: Math.round(currentAspect.width * 0.667),
          height: Math.round(currentAspect.height * 0.667),
        };
      case '480p':
        return {
          width: Math.round(currentAspect.width * 0.444),
          height: Math.round(currentAspect.height * 0.444),
        };
      default:
        return { width: currentAspect.width, height: currentAspect.height };
    }
  };

  const getResolutionLabel = () => {
    const dims = getExportDimensions();
    return `${dims.width} × ${dims.height}`;
  };

  const getEstimatedDuration = () => {
    if (appMode === 'quran' && quranProject.totalDuration > 0) {
      const mins = Math.floor(quranProject.totalDuration / 60);
      const secs = Math.round(quranProject.totalDuration % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    if (appMode === 'quran' && selectedAyahs?.length) {
      // Estimate ~5 seconds per ayah
      const est = selectedAyahs.length * 5;
      const mins = Math.floor(est / 60);
      const secs = est % 60;
      return `~${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return '--:--';
  };

  const getEstimatedFileSize = () => {
    const dims = getExportDimensions();
    const pixels = dims.width * dims.height;
    const durationSeconds =
      appMode === 'quran' && quranProject.totalDuration > 0
        ? quranProject.totalDuration
        : (selectedAyahs?.length || 1) * 5;

    // Rough estimate: bitrate depends on quality
    let bitrate: number;
    switch (exportSettings.quality) {
      case 'high':
        bitrate = 8; // Mbps
        break;
      case 'medium':
        bitrate = 4;
        break;
      case 'low':
        bitrate = 2;
        break;
      default:
        bitrate = 8;
    }

    // Scale bitrate with resolution relative to 1080p
    const scale = Math.min(pixels / (1920 * 1080), 1);
    bitrate *= scale;

    const sizeMB = (bitrate * durationSeconds) / 8;

    if (sizeMB >= 1024) return `~${(sizeMB / 1024).toFixed(1)} GB`;
    return `~${Math.round(sizeMB)} MB`;
  };

  const getExportStatus = (): ExportStatus => {
    if (!isExporting) return exportProgress >= 100 ? 'complete' : 'idle';
    if (exportProgress < 10) return 'preparing';
    if (exportProgress < 90) return 'rendering';
    if (exportProgress < 100) return 'finalizing';
    return 'complete';
  };

  const getStatusText = (status: ExportStatus): string => {
    switch (status) {
      case 'preparing':
        return 'جارٍ التحضير...';
      case 'rendering':
        return 'جارٍ التصيير...';
      case 'finalizing':
        return 'جارٍ الإنهاء...';
      case 'complete':
        return 'اكتمل التصدير!';
      case 'error':
        return 'حدث خطأ';
      default:
        return '';
    }
  };

  const handleExport = useCallback(async () => {
    if (!hasContent) {
      toast.error('الرجاء اختيار المحتوى أولاً');
      return;
    }

    if (appMode === 'quran' && !selectedReader) {
      toast.error('الرجاء اختيار القارئ أولاً');
      return;
    }

    abortRef.current = false;
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Step 1: Create export job via API
      const config = {
        mode: appMode,
        design,
        exportSettings,
        quranProject: {
          surahId: quranProject.surahId,
          surahName: quranProject.surahName,
          ayahFrom: quranProject.ayahFrom,
          ayahTo: quranProject.ayahTo,
          reader: selectedReader,
          ayahs: selectedAyahs,
          totalDuration: quranProject.totalDuration,
        },
        hadithData: appMode === 'hadith' ? hadithData : undefined,
      };

      // Call the API to register the export job
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: appMode, config }),
      });

      if (!response.ok) {
        throw new Error('Failed to create export job');
      }

      // Step 2: Use local Canvas-based export as fallback
      const dimensions = getExportDimensions();

      const verses = selectedAyahs.map((ayah) => ({
        surahId: quranProject.surahId || 1,
        surahName: quranProject.surahName,
        ayahNumber: ayah.numberInSurah,
        ayahText: ayah.text,
      }));

      const audioUrls: string[] = [];
      if (appMode === 'quran' && selectedReader) {
        for (const verse of verses) {
          const url = `/api/quran/audio-proxy?url=${encodeURIComponent(
            `https://cdn.islamic.network/quran/audio/128/${selectedReader.id}/${verse.surahId}:${verse.ayahNumber}.mp3`
          )}`;
          audioUrls.push(url);
        }
      }

      const blob = await exportVideo({
        width: dimensions.width,
        height: dimensions.height,
        fps: exportSettings.fps,
        ayahs: selectedAyahs,
        surahName: quranProject.surahName,
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
          showWatermark: true,
          imageMotion: design.imageMotion,
          backgroundImage: design.backgroundImage,
          transitionType: design.transitionType,
          transitionDuration: design.transitionDuration,
          textPosition: design.textPosition,
          aspectRatio: design.aspectRatio,
          templateId: design.templateId,
        },
        readerName: selectedReader?.name || '',
        mode: appMode,
        hadithData: {
          text: hadithData?.text || '',
          narrator: hadithData?.narrator || '',
          collection: hadithData?.collection || '',
          hadithNumber: hadithData?.hadithNumber || 0,
          grade: hadithData?.grade || '',
        },
        audioUrls,
        onProgress: (progress) => {
          if (abortRef.current) return;
          setExportProgress(progress);
        },
      });

      if (abortRef.current) {
        toast.info('تم إلغاء التصدير');
        return;
      }

      const filename =
        appMode === 'quran'
          ? `qudra-quran-${quranProject.surahName || 'video'}.webm`
          : `qudra-hadith-video.webm`;
      downloadBlob(blob, filename);

      setExportProgress(100);
      toast.success('تم تصدير الفيديو بنجاح!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('حدث خطأ أثناء التصدير');
    } finally {
      setIsExporting(false);
    }
  }, [
    hasContent,
    appMode,
    selectedReader,
    selectedAyahs,
    hadithData,
    design,
    exportSettings,
    quranProject,
    setIsExporting,
    setExportProgress,
  ]);

  const handleCancel = () => {
    abortRef.current = true;
    setIsExporting(false);
    setExportProgress(0);
    toast.info('تم إلغاء التصدير');
  };

  const status = getExportStatus();

  return (
    <div className="space-y-5 pb-4" dir="rtl">
      {/* Section Title */}
      <div className="flex items-center gap-2">
        <FileVideo className="w-5 h-5 text-gold" />
        <h2 className="text-base font-bold text-foreground arabic-text">تصدير الفيديو</h2>
      </div>

      {/* ====================== QUALITY SETTINGS ====================== */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-gold" />
          <h3 className="text-sm font-semibold text-foreground arabic-text">إعدادات الجودة</h3>
        </div>

        {/* Resolution presets */}
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block arabic-text">الدقة</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '1080p', label: '1080p', desc: 'عالية' },
              { id: '720p', label: '720p', desc: 'متوسطة' },
              { id: '480p', label: '480p', desc: 'منخفضة' },
            ].map((preset) => (
              <button
                key={preset.id}
                onClick={() => updateExportSettings({ preset: preset.id })}
                className={`rounded-lg p-2.5 text-center border-2 transition-all duration-200 ${
                  exportSettings.preset === preset.id
                    ? 'border-gold bg-gold/10'
                    : 'border-border/50 bg-card hover:border-border'
                }`}
              >
                <span
                  className={`text-sm font-bold font-mono block ${
                    exportSettings.preset === preset.id ? 'text-gold' : 'text-foreground'
                  }`}
                >
                  {preset.label}
                </span>
                <span
                  className={`text-[10px] arabic-text block ${
                    exportSettings.preset === preset.id ? 'text-gold/70' : 'text-muted-foreground'
                  }`}
                >
                  {preset.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Frame rate */}
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block arabic-text">عدد الإطارات</Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 24, label: '24 fps' },
              { value: 30, label: '30 fps' },
            ].map((fps) => (
              <button
                key={fps.value}
                onClick={() => updateExportSettings({ fps: fps.value })}
                className={`rounded-lg py-2 px-3 text-center border-2 transition-all duration-200 font-mono text-sm font-semibold ${
                  exportSettings.fps === fps.value
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-border/50 bg-card text-muted-foreground hover:border-border hover:text-foreground'
                }`}
              >
                {fps.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quality */}
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block arabic-text">الجودة</Label>
          <div className="grid grid-cols-3 gap-2">
            {qualityOptions.map((q) => (
              <button
                key={q.id}
                onClick={() => updateExportSettings({ quality: q.id })}
                className={`rounded-lg py-2 px-2 text-center border-2 transition-all duration-200 text-xs arabic-text font-semibold ${
                  exportSettings.quality === q.id
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-border/50 bg-card text-muted-foreground hover:border-border hover:text-foreground'
                }`}
              >
                {q.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-border/50" />

      {/* ====================== PROJECT INFO SUMMARY ====================== */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-gold" />
          <h3 className="text-sm font-semibold text-foreground arabic-text">ملخص المشروع</h3>
        </div>

        <Card className="bg-secondary/40 border-border/50">
          <CardContent className="p-3 space-y-2">
            {appMode === 'quran' ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground arabic-text">السورة</span>
                  <span className="text-xs text-foreground font-semibold arabic-text">
                    {quranProject.surahName || '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground arabic-text">نطاق الآيات</span>
                  <span className="text-xs text-foreground font-mono">
                    {quranProject.ayahFrom} — {quranProject.ayahTo}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground arabic-text">القارئ</span>
                  <span className="text-xs text-foreground arabic-text">
                    {selectedReader?.name || '—'}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground arabic-text">المصدر</span>
                <span className="text-xs text-foreground arabic-text">
                  {hadithData?.collection || '—'}
                </span>
              </div>
            )}

            <Separator className="bg-border/30" />

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground arabic-text">الدقة</span>
              <span className="text-xs text-foreground font-mono">{getResolutionLabel()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground arabic-text">المدة المقدّرة</span>
              <span className="text-xs text-foreground font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                {getEstimatedDuration()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground arabic-text">حجم الملف المقدّر</span>
              <span className="text-xs text-foreground font-mono">{getEstimatedFileSize()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground arabic-text">الصيغة</span>
              <span className="text-xs text-foreground font-mono">WebM (VP9)</span>
            </div>
          </CardContent>
        </Card>

        {/* Status indicators */}
        <div className="space-y-1.5">
          <div
            className={`flex items-center gap-2 text-xs ${
              hasContent ? 'text-emerald' : 'text-muted-foreground'
            }`}
          >
            {hasContent ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            <span className="arabic-text">
              المحتوى {hasContent ? 'جاهز' : 'مطلوب'}
            </span>
          </div>
          {appMode === 'quran' && (
            <div
              className={`flex items-center gap-2 text-xs ${
                selectedReader ? 'text-emerald' : 'text-muted-foreground'
              }`}
            >
              {selectedReader ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5" />
              )}
              <span className="arabic-text">
                القارئ {selectedReader ? 'جاهز' : 'مطلوب'}
              </span>
            </div>
          )}
        </div>
      </section>

      <Separator className="bg-border/50" />

      {/* ====================== EXPORT PROGRESS ====================== */}
      {isExporting && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground arabic-text">
              {getStatusText(status)}
            </span>
            <span className="text-xs text-gold font-mono">{exportProgress}%</span>
          </div>

          <Progress
            value={exportProgress}
            className="h-2 bg-secondary [&>[data-slot=progress-indicator]]:bg-gold"
          />

          {/* Status steps */}
          <div className="flex items-center gap-1 justify-center">
            {(['preparing', 'rendering', 'finalizing', 'complete'] as ExportStatus[]).map(
              (step, i) => (
                <div key={step} className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors ${
                      status === step
                        ? 'bg-gold'
                        : i <
                            ['preparing', 'rendering', 'finalizing', 'complete'].indexOf(status)
                          ? 'bg-emerald'
                          : 'bg-secondary'
                    }`}
                  />
                  {i < 3 && (
                    <div
                      className={`w-6 h-px ${
                        i < ['preparing', 'rendering', 'finalizing', 'complete'].indexOf(status)
                          ? 'bg-emerald/50'
                          : 'bg-border'
                      }`}
                    />
                  )}
                </div>
              )
            )}
          </div>

          {/* Cancel button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 h-8 text-xs"
          >
            <X className="w-3.5 h-3.5 ml-1" />
            <span className="arabic-text">إلغاء</span>
          </Button>
        </section>
      )}

      {/* ====================== EXPORT BUTTON ====================== */}
      <Button
        onClick={handleExport}
        disabled={!hasContent || isExporting || (appMode === 'quran' && !selectedReader)}
        className={`w-full h-12 text-base font-semibold transition-all duration-200 rounded-lg ${
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
