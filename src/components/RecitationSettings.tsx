'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { readers } from '@/lib/quran-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Mic,
  Upload,
  Radio,
  Search,
  Play,
  Volume2,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

type AudioSource = 'reader' | 'upload' | 'record';

export default function RecitationSettings() {
  const {
    selectedReader,
    setSelectedReader,
    readerSearch,
    setReaderSearch,
    isRecording,
    setIsRecording,
  } = useAppStore();

  const [audioSource, setAudioSource] = useState<AudioSource>('reader');
  const [expandedReader, setExpandedReader] = useState(true);

  const filteredReaders = readers.filter(
    (r) => !readerSearch.trim() || r.name.includes(readerSearch.trim())
  );

  const handleRecordToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      toast.success('تم إيقاف التسجيل');
    } else {
      setIsRecording(true);
      toast.info('جارٍ التسجيل...');
    }
  };

  const handleFileUpload = () => {
    toast.info('ميزة رفع الملفات الصوتية قادمة قريباً');
  };

  return (
    <div className="space-y-5">
      {/* Audio Source Section */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 arabic-text">
          مصدر الصوت
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setAudioSource('reader');
              setExpandedReader(true);
            }}
            className={`flex flex-col items-center gap-1.5 h-auto py-3 ${
              audioSource === 'reader'
                ? 'border-emerald bg-emerald/5 text-emerald'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span className="text-[11px] arabic-text">اختيار قارئ</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setAudioSource('upload');
              setExpandedReader(false);
            }}
            className={`flex flex-col items-center gap-1.5 h-auto py-3 ${
              audioSource === 'upload'
                ? 'border-emerald bg-emerald/5 text-emerald'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span className="text-[11px] arabic-text">رفع ملف صوتي</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setAudioSource('record');
              setExpandedReader(false);
            }}
            className={`flex flex-col items-center gap-1.5 h-auto py-3 ${
              audioSource === 'record'
                ? 'border-emerald bg-emerald/5 text-emerald'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="relative">
              <Mic className="w-4 h-4" />
              {isRecording && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse-record" />
              )}
            </div>
            <span className="text-[11px] arabic-text">تسجيل مباشر</span>
          </Button>
        </div>
      </div>

      <Separator className="bg-border" />

      {/* Upload Section */}
      <AnimatePresence>
        {audioSource === 'upload' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-xl p-6 text-center">
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3 arabic-text">
                اختر ملفاً صوتياً للتلاوة
              </p>
              <Button
                onClick={handleFileUpload}
                variant="outline"
                className="border-emerald/30 text-emerald hover:bg-emerald/10"
              >
                <Upload className="w-4 h-4 ml-2" />
                رفع ملف صوتي
              </Button>
              <p className="text-[11px] text-muted-foreground mt-2">
                يدعم MP3, WAV, OGG
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Record Section */}
      <AnimatePresence>
        {audioSource === 'record' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-xl p-6 text-center">
              <div className="relative inline-block">
                <Mic
                  className={`w-10 h-10 mx-auto mb-3 ${
                    isRecording ? 'text-red-500' : 'text-muted-foreground'
                  }`}
                />
                {isRecording && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-red-500/20" />
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
                    : 'bg-emerald hover:bg-emerald/90 text-emerald-foreground'
                }`}
              >
                <Radio className="w-4 h-4 ml-2" />
                {isRecording ? 'إيقاف التسجيل' : 'بدء التسجيل'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reader Selection */}
      <AnimatePresence>
        {audioSource === 'reader' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {/* Selected reader info */}
            {selectedReader && (
              <div className="glass rounded-xl p-3 mb-4 glow-emerald">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald" />
                    <span className="text-sm font-medium text-foreground arabic-text">
                      {selectedReader.name}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-emerald/30 text-emerald"
                  >
                    {selectedReader.qualityLabel} • {selectedReader.bitrate}
                  </Badge>
                </div>
              </div>
            )}

            {/* Toggle expand */}
            <button
              onClick={() => setExpandedReader(!expandedReader)}
              className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
            >
              <span className="arabic-text">قائمة القراء ({readers.length})</span>
              {expandedReader ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            <AnimatePresence>
              {expandedReader && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  {/* Search */}
                  <div className="relative mb-3">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="ابحث باسم القارئ..."
                      value={readerSearch}
                      onChange={(e) => setReaderSearch(e.target.value)}
                      className="pr-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  {/* Readers list */}
                  <ScrollArea className="max-h-64">
                    <div className="space-y-1">
                      {filteredReaders.map((reader) => (
                        <button
                          key={reader.id}
                          onClick={() => {
                            const firstQuality = reader.qualities[0];
                            setSelectedReader({
                              id: reader.id,
                              name: reader.name,
                              qualityLabel: firstQuality.label,
                              bitrate: firstQuality.bitrate,
                            });
                            toast.success(`تم اختيار ${reader.name}`);
                          }}
                          className={`reader-card w-full rounded-lg p-3 border text-right ${
                            selectedReader?.id === reader.id
                              ? 'selected border-emerald/30 bg-emerald/5'
                              : 'border-transparent'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground arabic-text">
                                {reader.name}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {reader.qualities.map((q, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-[9px] px-1.5 py-0 border-border/50 text-muted-foreground"
                                  >
                                    {q.label} • {q.bitrate}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-emerald flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast.info('معاينة صوت القارئ');
                              }}
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
