import { create } from "zustand";

export type AppMode = "quran" | "hadith";
export type PanelTab = "content" | "voice" | "design" | "export";

interface SelectedReader {
  id: string;
  name: string;
  qualityLabel: string;
  bitrate: string;
  audioId: string;
}

export interface SelectedVerse {
  surahId: number;
  surahName: string;
  ayahNumber: number;
  ayahText: string;
  englishText?: string;
  absoluteAyahNumber?: number;
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
  fontSize: number;
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
  format: "mp4";
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

interface AudioState {
  isPlaying: boolean;
  currentAyahIndex: number;
  duration: number;
  currentTime: number;
}

interface AppState {
  // Mode & Panel
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  activePanel: PanelTab;
  setActivePanel: (panel: PanelTab) => void;

  // Quran browser
  showQuranBrowser: boolean;
  setShowQuranBrowser: (show: boolean) => void;

  // Reader
  selectedReader: SelectedReader | null;
  setSelectedReader: (reader: SelectedReader | null) => void;

  // Audio state
  audioState: AudioState;
  setAudioState: (updates: Partial<AudioState>) => void;
  resetAudioState: () => void;

  // Verses
  selectedVerses: SelectedVerse[];
  addVerse: (verse: SelectedVerse) => void;
  addVerses: (verses: SelectedVerse[]) => void;
  removeVerse: (surahId: number, ayahNumber: number) => void;
  clearVerses: () => void;
  reorderVerses: (fromIndex: number, toIndex: number) => void;

  // Hadith
  hadithData: HadithData;
  updateHadithData: (updates: Partial<HadithData>) => void;

  // Design
  design: VideoDesign;
  updateDesign: (updates: Partial<VideoDesign>) => void;
  applyTemplate: (template: { id: string; bg1: string; bg2: string; accentColor: string; patternType: string }) => void;

  // Export
  exportSettings: VideoExport;
  updateExportSettings: (updates: Partial<VideoExport>) => void;

  // Recording
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;

  // Export progress
  exportProgress: number;
  setExportProgress: (progress: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Mode & Panel
  appMode: "quran",
  setAppMode: (mode) => set({ appMode: mode, activePanel: "content", selectedVerses: [], hadithData: { category: "bukhari", text: "", narrator: "", source: "" } }),
  activePanel: "content",
  setActivePanel: (panel) => set({ activePanel: panel }),

  // Quran browser
  showQuranBrowser: false,
  setShowQuranBrowser: (show) => set({ showQuranBrowser: show }),

  // Reader
  selectedReader: null,
  setSelectedReader: (reader) => set({ selectedReader: reader }),

  // Audio state
  audioState: {
    isPlaying: false,
    currentAyahIndex: 0,
    duration: 0,
    currentTime: 0,
  },
  setAudioState: (updates) =>
    set((state) => ({ audioState: { ...state.audioState, ...updates } })),
  resetAudioState: () =>
    set({ audioState: { isPlaying: false, currentAyahIndex: 0, duration: 0, currentTime: 0 } }),

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
  addVerses: (verses) =>
    set((state) => {
      const existingKeys = new Set(
        state.selectedVerses.map((v) => `${v.surahId}:${v.ayahNumber}`)
      );
      const newVerses = verses.filter(
        (v) => !existingKeys.has(`${v.surahId}:${v.ayahNumber}`)
      );
      return { selectedVerses: [...state.selectedVerses, ...newVerses] };
    }),
  removeVerse: (surahId, ayahNumber) =>
    set((state) => ({
      selectedVerses: state.selectedVerses.filter(
        (v) => !(v.surahId === surahId && v.ayahNumber === ayahNumber)
      ),
    })),
  clearVerses: () => set({ selectedVerses: [] }),
  reorderVerses: (fromIndex, toIndex) =>
    set((state) => {
      const newVerses = [...state.selectedVerses];
      const [removed] = newVerses.splice(fromIndex, 1);
      newVerses.splice(toIndex, 0, removed);
      return { selectedVerses: newVerses };
    }),

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
    templateId: "noor",
    bg1: "#0a0a0c",
    bg2: "#12121a",
    accentColor: "#c9a84c",
    patternType: "arabic",
    patternDensity: 4,
    showPattern: true,
    fontType: "amiri",
    fontSize: 28,
    customReaderName: "",
    textColor: "#f4f4f5",
    accentTextColor: "#c9a84c",
    textStyle: "with-shadow",
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
  applyTemplate: (template) =>
    set((state) => ({
      design: {
        ...state.design,
        templateId: template.id,
        bg1: template.bg1,
        bg2: template.bg2,
        accentColor: template.accentColor,
        patternType: template.patternType,
      },
    })),

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

  // Export progress
  exportProgress: 0,
  setExportProgress: (progress) => set({ exportProgress: progress }),
}));
