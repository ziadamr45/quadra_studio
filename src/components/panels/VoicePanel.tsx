'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { readers, getProxiedEveryAyahUrl } from '@/lib/quran-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Mic,
  Upload,
  Search,
  Play,
  Pause,
  Volume2,
  Check,
  Radio,
} from 'lucide-react';
import { toast } from 'sonner';

type AudioSource = 'reader' | 'upload' | 'record';

export default function VoicePanel() {
  const {
    quranProject,
    updateQuranProject,
  } = useAppStore();

  const [audioSource, setAudioSource] = useState<AudioSource>('reader');
  const [readerSearch, setReaderSearch] = useState('');
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const selectedReader = quranProject?.reader ?? null;

  const filteredReaders = readers.filter(
    (r) =>
      !readerSearch.trim() ||
      r.name.includes(readerSearch.trim()) ||
      r.nameEn.toLowerCase().includes(readerSearch.trim().toLowerCase())
  );

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlayPreview = (readerId: string, everyAyahFolder: string) => {
    if (playingPreview === readerId) {
      audioRef.current?.pause();
      setPlayingPreview(null);
      return;
    }

    // Use EveryAyah for preview: Al-Fatiha ayah 1
    const audioUrl = getProxiedEveryAyahUrl(everyAyahFolder, 1, 1);

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audio.onended = () => setPlayingPreview(null);
    audio.onerror = () => {
      setPlayingPreview(null);
      toast.error('تعذر تشغيل الصوت');
    };
    audio.play().catch(() => {
      setPlayingPreview(null);
      toast.error('تعذر تشغيل الصوت');
    });
    audioRef.current = audio;
    setPlayingPreview(readerId);
  };

  const handleSelectReader = (reader: (typeof readers)[0]) => {
    const firstQuality = reader.qualities[0];
    updateQuranProject({
      reader: {
        id: reader.id,
        name: reader.name,
        nameEn: reader.nameEn,
        recitationId: reader.recitationId,
        everyAyahFolder: reader.everyAyahFolder,
        qualityLabel: firstQuality.label,
      },
    });
    toast.success(`تم اختيار ${reader.name}`);
  };

  const handleRecordToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      toast.success('تم إيقاف التسجيل');
    } else {
      setIsRecording(true);
      toast.info('جارٍ التسجيل...');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <Volume2 className="w-5 h-5 text-gold" />
        <h2 className="text-base font-bold text-foreground arabic-text">اختر الصوت</h2>
      </div>

      {/* Audio Source Selection */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setAudioSource('reader')}
          className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
            audioSource === 'reader'
              ? 'border-gold bg-gold/5 text-gold'
              : 'border-border hover:border-gold/30 text-muted-foreground'
          }`}
        >
          <Volume2 className="w-5 h-5" />
          <span className="text-[11px] arabic-text font-medium">اختيار قارئ</span>
        </button>
        <button
          onClick={() => setAudioSource('upload')}
          className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
            audioSource === 'upload'
              ? 'border-gold bg-gold/5 text-gold'
              : 'border-border hover:border-gold/30 text-muted-foreground'
          }`}
        >
          <Upload className="w-5 h-5" />
          <span className="text-[11px] arabic-text font-medium">رفع ملف</span>
        </button>
        <button
          onClick={() => setAudioSource('record')}
          className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
            audioSource === 'record'
              ? 'border-gold bg-gold/5 text-gold'
              : 'border-border hover:border-gold/30 text-muted-foreground'
          }`}
        >
          <div className="relative">
            <Mic className="w-5 h-5" />
            {isRecording && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
          <span className="text-[11px] arabic-text font-medium">تسجيل</span>
        </button>
      </div>

      {/* Upload Section */}
      {audioSource === 'upload' && (
        <div className="bg-secondary/50 rounded-xl p-8 text-center border border-border">
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-3 arabic-text">
            اختر ملفاً صوتياً للتلاوة
          </p>
          <Button variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
            <Upload className="w-4 h-4 ml-2" />
            رفع ملف صوتي
          </Button>
          <p className="text-[10px] text-muted-foreground mt-2">MP3, WAV, OGG</p>
        </div>
      )}

      {/* Record Section */}
      {audioSource === 'record' && (
        <div className="bg-secondary/50 rounded-xl p-8 text-center border border-border">
          <div className="relative inline-block">
            <Mic
              className={`w-10 h-10 mx-auto mb-3 ${
                isRecording ? 'text-red-500' : 'text-muted-foreground'
              }`}
            />
            {isRecording && (
              <div className="flex items-center justify-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="audio-bar w-1 bg-red-500 rounded-full"
                    style={{ height: '4px', animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3 arabic-text">
            {isRecording ? 'جارٍ التسجيل...' : 'اضغط للتسجيل المباشر'}
          </p>
          <Button
            onClick={handleRecordToggle}
            className={`${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gold hover:bg-gold-dark text-background'
            }`}
          >
            <Radio className="w-4 h-4 ml-2" />
            {isRecording ? 'إيقاف' : 'بدء التسجيل'}
          </Button>
        </div>
      )}

      {/* Reader Selection */}
      {audioSource === 'reader' && (
        <>
          {/* Selected reader info */}
          {selectedReader && (
            <div className="bg-gold/5 border border-gold/20 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-gold" />
                  <span className="text-sm font-medium text-foreground arabic-text">
                    {selectedReader.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60">{selectedReader.nameEn}</span>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] border-gold/30 text-gold"
                >
                  {selectedReader.qualityLabel}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                <span className="text-[10px] text-emerald/80 arabic-text">
                  صوت متزامن عبر EveryAyah.com
                </span>
              </div>
            </div>
          )}

          <Separator className="bg-border" />

          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ابحث باسم القارئ..."
              value={readerSearch}
              onChange={(e) => setReaderSearch(e.target.value)}
              className="pr-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              dir="rtl"
            />
          </div>

          {/* Readers list */}
          <ScrollArea className="max-h-72">
            <div className="space-y-1">
              {filteredReaders.map((reader) => (
                <div
                  key={reader.id}
                  onClick={() => handleSelectReader(reader)}
                  className={`flex items-center gap-3 rounded-lg p-3 cursor-pointer transition-all ${
                    selectedReader?.id === reader.id
                      ? 'bg-gold/5 border border-gold/20'
                      : 'hover:bg-secondary border border-transparent'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground arabic-text truncate">
                        {reader.name}
                      </p>
                      <span className="text-[10px] text-muted-foreground/60 truncate">{reader.nameEn}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex flex-wrap gap-1">
                        {reader.qualities.map((q, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-[9px] px-1.5 py-0 border-border/50 text-muted-foreground"
                          >
                            {q.bitrate}
                          </Badge>
                        ))}
                      </div>
                      {playingPreview === reader.id && (
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className="audio-bar w-0.5 bg-gold rounded-full"
                              style={{ height: '4px', animationDelay: `${i * 0.1}s` }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-gold flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPreview(reader.id, reader.everyAyahFolder);
                    }}
                  >
                    {playingPreview === reader.id ? (
                      <Pause className="h-3.5 w-3.5" />
                    ) : (
                      <Play className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>

          {filteredReaders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm arabic-text">لم يتم العثور على نتائج</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
