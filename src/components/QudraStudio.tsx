'use client';

import { useAppStore, type PanelTab } from '@/lib/store';
import ContentPanel from '@/components/panels/ContentPanel';
import VoicePanel from '@/components/panels/VoicePanel';
import DesignPanel from '@/components/panels/DesignPanel';
import ExportPanel from '@/components/panels/ExportPanel';
import VideoPreview from '@/components/VideoPreview';
import QuranBrowser from '@/components/QuranBrowser';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Mic,
  Palette,
  Download,
  Book,
  MessageSquare,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

const tabs: { id: PanelTab; label: string; icon: typeof BookOpen }[] = [
  { id: 'content', label: 'المحتوى', icon: BookOpen },
  { id: 'voice', label: 'الصوت', icon: Mic },
  { id: 'design', label: 'التصميم', icon: Palette },
  { id: 'export', label: 'التصدير', icon: Download },
];

export default function QudraStudio() {
  const { appMode, setAppMode, activePanel, setActivePanel } = useAppStore();

  const renderPanel = () => {
    switch (activePanel) {
      case 'content':
        return <ContentPanel />;
      case 'voice':
        return <VoicePanel />;
      case 'design':
        return <DesignPanel />;
      case 'export':
        return <ExportPanel />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo - Right side */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
              <Image
                src="/qudra-logo.png"
                alt="Qudra Studio"
                width={30}
                height={30}
                className="rounded-md"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-foreground arabic-text">قدرة استوديو</span>
              <span className="text-[10px] text-gold/60 tracking-[0.2em] font-medium">QUDRA STUDIO</span>
            </div>
          </div>

          {/* Mode Switcher - Center */}
          <div className="flex items-center gap-0.5 bg-secondary/80 rounded-full p-1 border border-border/80">
            <button
              onClick={() => setAppMode('quran')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium transition-all duration-300 ease-out ${
                appMode === 'quran'
                  ? 'bg-gold text-background shadow-md shadow-gold/25'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              <Book className="w-3.5 h-3.5" />
              <span className="arabic-text">فيديو قرآني</span>
            </button>
            <button
              onClick={() => setAppMode('hadith')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium transition-all duration-300 ease-out ${
                appMode === 'hadith'
                  ? 'bg-emerald text-background shadow-md shadow-emerald/25'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="arabic-text">فيديو حديث</span>
            </button>
          </div>

          {/* Spacer - Left side for balance */}
          <div className="w-[140px] hidden sm:block" />
        </div>
        {/* Decorative Gold Line */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* Video Preview - Left side (desktop) / Top (mobile) */}
          <div className="lg:w-[40%] xl:w-[38%] flex-shrink-0 lg:sticky lg:top-[80px] lg:self-start">
            <VideoPreview />
          </div>

          {/* Control Panel - Right side (desktop) / Bottom (mobile) */}
          <div className="flex-1 min-w-0">
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-lg shadow-black/20">
              {/* Tab Bar */}
              <div className="border-b border-border bg-card/50 px-2 pt-2">
                <div className="flex items-center gap-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activePanel === tab.id;
                    return (
                      <Button
                        key={tab.id}
                        variant="ghost"
                        onClick={() => setActivePanel(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs font-medium transition-all duration-200 relative ${
                          isActive
                            ? 'text-gold bg-secondary/50'
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/20'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="arabic-text">{tab.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-5 sm:p-6 min-h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePanel}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    {renderPanel()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-auto">
        {/* Decorative Gold Line */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image
              src="/qudra-logo.png"
              alt="Qudra Studio"
              width={18}
              height={18}
              className="rounded"
            />
            <span className="text-xs text-muted-foreground arabic-text">قدرة استوديو</span>
            <span className="text-[10px] text-border">|</span>
            <span className="text-[10px] text-muted-foreground/60">© 2025</span>
          </div>
          <span className="text-[10px] text-gold/40 tracking-[0.15em] font-medium">QUDRA STUDIO v2.0</span>
        </div>
      </footer>

      {/* Quran Browser Modal */}
      <QuranBrowser />
    </div>
  );
}
