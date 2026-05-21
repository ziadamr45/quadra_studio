import { create } from "zustand";

export type AppTab = "quran" | "hadith";
export type SettingsTab = "verses" | "recitation" | "design" | "export";

interface SelectedReader {
  id: string;
  name: string;
  qualityLabel: string;
  bitrate: string;
}

interface SelectedVerse {
  surahId: number;
  surahName: string;
  ayahNumber: number;
  ayahText: string;
}

interface VideoDesign {
  templateId: string;
  bg1: string;
  bg2: string;
  accentColor: string;
  patternType: string;
  patternDensity: number;
  showPattern: boolean;
  fontType: string;
  customReaderName: string;
  textColor: string;
  accentTextColor: string;
  textStyle: string;
  showAyahNumber: boolean;
  showReaderName: boolean;
  showText: boolean;
  showSurahName: boolean;
  showProgressBar: boolean;
  aspectRatio: string;
  videoEffect: string;
  showEnglishTranslation: boolean;
  customTexts: string[];
  imageMotion: string;
}

interface VideoExport {
  format: "mp4" | "turbo-mp4";
  preset: string;
  fps: string;
  crf: string;
  enableCinematicAudio: boolean;
}

interface AppState {
  // Navigation
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  activeSettingsTab: SettingsTab;
  setActiveSettingsTab: (tab: SettingsTab) => void;

  // Onboarding
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;

  // Quran browser
  showQuranBrowser: boolean;
  setShowQuranBrowser: (show: boolean) => void;
  surahSearch: string;
  setSurahSearch: (search: string) => void;

  // Report modal
  showReport: boolean;
  setShowReport: (show: boolean) => void;

  // Hadith
  hadithCategory: string;
  setHadithCategory: (cat: string) => void;
  hadithSearch: string;
  setHadithSearch: (search: string) => void;

  // Reader
  selectedReader: SelectedReader | null;
  setSelectedReader: (reader: SelectedReader | null) => void;
  readerSearch: string;
  setReaderSearch: (search: string) => void;

  // Verses
  selectedVerses: SelectedVerse[];
  addVerse: (verse: SelectedVerse) => void;
  removeVerse: (surahId: number, ayahNumber: number) => void;
  clearVerses: () => void;

  // Design
  design: VideoDesign;
  updateDesign: (updates: Partial<VideoDesign>) => void;

  // Export
  exportSettings: VideoExport;
  updateExportSettings: (updates: Partial<VideoExport>) => void;

  // Recording
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;

  // Preview
  previewKey: number;
  refreshPreview: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Navigation
  activeTab: "quran",
  setActiveTab: (tab) => set({ activeTab: tab }),
  activeSettingsTab: "verses",
  setActiveSettingsTab: (tab) => set({ activeSettingsTab: tab }),

  // Onboarding
  showOnboarding: true,
  setShowOnboarding: (show) => set({ showOnboarding: show }),
  onboardingStep: 0,
  setOnboardingStep: (step) => set({ onboardingStep: step }),

  // Quran browser
  showQuranBrowser: false,
  setShowQuranBrowser: (show) => set({ showQuranBrowser: show }),
  surahSearch: "",
  setSurahSearch: (search) => set({ surahSearch: search }),

  // Report modal
  showReport: false,
  setShowReport: (show) => set({ showReport: show }),

  // Hadith
  hadithCategory: "bukhari",
  setHadithCategory: (cat) => set({ hadithCategory: cat }),
  hadithSearch: "",
  setHadithSearch: (search) => set({ hadithSearch: search }),

  // Reader
  selectedReader: null,
  setSelectedReader: (reader) => set({ selectedReader: reader }),
  readerSearch: "",
  setReaderSearch: (search) => set({ readerSearch: search }),

  // Verses
  selectedVerses: [],
  addVerse: (verse) =>
    set((state) => {
      const exists = state.selectedVerses.find(
        (v) => v.surahId === verse.surahId && v.ayahNumber === verse.ayahNumber
      );
      if (exists) return state;
      return { selectedVerses: [...state.selectedVerses, verse] };
    }),
  removeVerse: (surahId, ayahNumber) =>
    set((state) => ({
      selectedVerses: state.selectedVerses.filter(
        (v) => !(v.surahId === surahId && v.ayahNumber === ayahNumber)
      ),
    })),
  clearVerses: () => set({ selectedVerses: [] }),

  // Design
  design: {
    templateId: "",
    bg1: "#0a0f1e",
    bg2: "#050810",
    accentColor: "#d4a853",
    patternType: "hexagonal",
    patternDensity: 3,
    showPattern: true,
    fontType: "naskh",
    customReaderName: "",
    textColor: "#fef9c3",
    accentTextColor: "#eab308",
    textStyle: "normal",
    showAyahNumber: true,
    showReaderName: true,
    showText: true,
    showSurahName: true,
    showProgressBar: true,
    aspectRatio: "9:16",
    videoEffect: "none",
    showEnglishTranslation: true,
    customTexts: [],
    imageMotion: "none",
  },
  updateDesign: (updates) =>
    set((state) => ({ design: { ...state.design, ...updates } })),

  // Export
  exportSettings: {
    format: "mp4",
    preset: "1080p",
    fps: "30",
    crf: "23",
    enableCinematicAudio: false,
  },
  updateExportSettings: (updates) =>
    set((state) => ({
      exportSettings: { ...state.exportSettings, ...updates },
    })),

  // Recording
  isRecording: false,
  setIsRecording: (recording) => set({ isRecording: recording }),

  // Preview
  previewKey: 0,
  refreshPreview: () => set((state) => ({ previewKey: state.previewKey + 1 })),
}));
