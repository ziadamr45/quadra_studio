'use client';

import { useAppStore } from '@/lib/store';
import VersesSettings from './VersesSettings';
import RecitationSettings from './RecitationSettings';
import DesignSettings from './DesignSettings';
import ExportSettings from './ExportSettings';
import HadithVideoTab from './HadithVideoTab';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Mic, Palette, Download } from 'lucide-react';

const tabs = [
  { id: 'verses' as const, label: 'الآيات', icon: BookOpen },
  { id: 'recitation' as const, label: 'التلاوة', icon: Mic },
  { id: 'design' as const, label: 'التصميم', icon: Palette },
  { id: 'export' as const, label: 'التصدير', icon: Download },
];

export default function SettingsPanel() {
  const { activeSettingsTab, setActiveSettingsTab, activeTab } = useAppStore();

  const isHadith = activeTab === 'hadith';

  return (
    <div className="flex flex-col h-full">
      {/* Tab navigation */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSettingsTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSettingsTab(tab.id)}
              className={`settings-tab flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors ${
                isActive
                  ? 'active text-emerald'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="arabic-text">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSettingsTab}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {activeSettingsTab === 'verses' && (
              isHadith ? <HadithVideoTab /> : <VersesSettings />
            )}
            {activeSettingsTab === 'recitation' && <RecitationSettings />}
            {activeSettingsTab === 'design' && <DesignSettings />}
            {activeSettingsTab === 'export' && <ExportSettings />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
