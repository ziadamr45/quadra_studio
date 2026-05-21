import { create } from "zustand";

export type AppMode = "quran" | "hadith";
export type AppStep = "content" | "voice" | "design" | "export";

interface SelectedReader {
  id: string;
  name: string;
  qualityLabel: string;
  bitrate: string;
  audioUrl: string;
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
  showWatermark: boolean;
}

interface VideoExport {
  format: "mp4" | "turbo-mp4";
  preset: string;
  fps: string;
  crf: string;
  enableCinematicAudio: boolean;
}

interface HadithData {
  category: string;
  text: string;
  narrator: string;
  source: string;
}

interface AppState {
  // Mode & Step
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  currentStep: AppStep;
  setCurrentStep: (step: AppStep) => void;
  completedSteps: AppStep[];
  markStepCompleted: (step: AppStep) => void;

  // Quran browser
  showQuranBrowser: boolean;
  setShowQuranBrowser: (show: boolean) => void;

  // Reader
  selectedReader: SelectedReader | null;
  setSelectedReader: (reader: SelectedReader | null) => void;
  isAudioPlaying: boolean;
  setIsAudioPlaying: (playing: boolean) => void;

  // Verses
  selectedVerses: SelectedVerse[];
  addVerse: (verse: SelectedVerse) => void;
  removeVerse: (surahId: number, ayahNumber: number) => void;
  clearVerses: () => void;

  // Hadith
  hadithData: HadithData;
  updateHadithData: (updates: Partial<HadithData>) => void;

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
  // Mode & Step
  appMode: "quran",
  setAppMode: (mode) => set({ appMode: mode, currentStep: "content", completedSteps: [] }),
  currentStep: "content",
  setCurrentStep: (step) => set({ currentStep: step }),
  completedSteps: [],
  markStepCompleted: (step) =>
    set((state) => ({
      completedSteps: state.completedSteps.includes(step)
        ? state.completedSteps
        : [...state.completedSteps, step],
    })),

  // Quran browser
  showQuranBrowser: false,
  setShowQuranBrowser: (show) => set({ showQuranBrowser: show }),

  // Reader
  selectedReader: null,
  setSelectedReader: (reader) => set({ selectedReader: reader }),
  isAudioPlaying: false,
  setIsAudioPlaying: (playing) => set({ isAudioPlaying: playing }),

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

  // Hadith
  hadithData: {
    category: "bukhari",
    text: "",
    narrator: "",
    source: "",
  },
  updateHadithData: (updates) =>
    set((state) => ({ hadithData: { ...state.hadithData, ...updates } })),

  // Design
  design: {
    templateId: "night-sky",
    bg1: "#0f1419",
    bg2: "#1a1a2e",
    accentColor: "#c96442",
    patternType: "geometric",
    patternDensity: 3,
    showPattern: true,
    fontType: "naskh",
    customReaderName: "",
    textColor: "#e7e9ea",
    accentTextColor: "#c96442",
    textStyle: "normal",
    showAyahNumber: true,
    showReaderName: true,
    showText: true,
    showSurahName: true,
    showProgressBar: true,
    aspectRatio: "9:16",
    videoEffect: "none",
    showEnglishTranslation: false,
    customTexts: [],
    imageMotion: "none",
    showWatermark: true,
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
