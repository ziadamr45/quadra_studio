'use client';

import { useAppStore } from '@/lib/store';
import VideoPreview from './VideoPreview';
import SettingsPanel from './SettingsPanel';
import SelectedVersesBar from './SelectedVersesBar';
import OnboardingModal from './OnboardingModal';
import QuranBrowser from './QuranBrowser';
import ReportModal from './ReportModal';
import { Moon, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function MainPage() {
  const { activeTab, setActiveTab, setShowReport, selectedVerses } = useAppStore();
  const [isConnected] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-background islamic-pattern">
      {/* Header */}
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center">
                <Moon className="w-4 h-4 text-emerald" />
              </div>
              <h1 className="text-xl font-bold text-foreground arabic-text">نُور</h1>
            </div>

            {/* Main tabs */}
            <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('quran')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'quran'
                    ? 'bg-emerald text-emerald-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="arabic-text">فيديو قرآني</span>
              </button>
              <button
                onClick={() => setActiveTab('hadith')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'hadith'
                    ? 'bg-copper text-copper-light text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="arabic-text">فيديو حديث</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Connection status */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/50">
                {isConnected ? (
                  <>
                    <Wifi className="w-3 h-3 text-emerald" />
                    <span className="text-[11px] text-emerald arabic-text">متصل</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-red-400" />
                    <span className="text-[11px] text-red-400 arabic-text">غير متصل</span>
                  </>
                )}
              </div>

              {/* Report button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReport(true)}
                className="text-muted-foreground hover:text-copper"
              >
                <AlertTriangle className="w-4 h-4 ml-1" />
                <span className="text-xs arabic-text">بلاغ</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4 h-full">
          {/* Left panel - Video Preview */}
          <motion.div
            layout
            className="lg:w-[380px] xl:w-[420px] flex-shrink-0 lg:sticky lg:top-20 lg:self-start"
          >
            <div className="glass rounded-xl p-4 glow-emerald">
              <VideoPreview />
            </div>
          </motion.div>

          {/* Right panel - Settings */}
          <motion.div
            layout
            className="flex-1 min-w-0"
          >
            <div className="glass rounded-xl h-[calc(100vh-180px)] min-h-[500px] overflow-hidden">
              <SettingsPanel />
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer - Selected Verses Bar */}
      {selectedVerses.length > 0 && (
        <footer className="max-w-[1400px] mx-auto w-full px-4 pb-4">
          <SelectedVersesBar />
        </footer>
      )}

      {/* Modals */}
      <OnboardingModal />
      <QuranBrowser />
      <ReportModal />
    </div>
  );
}
