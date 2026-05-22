import { create } from "zustand";

export type AppMode = "quran" | "hadith";
export type PanelTab = "content" | "voice" | "design" | "export";

export interface AyahTimestamp {
  numberInSurah: number;
  text: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
}

export interface SelectedReader {
  id: string;
  name: string;
  nameEn: string;
  recitationId: number; // Quran.com recitation ID
  qualityLabel: string;
}

export interface VideoDesign {
  templateId: string;
  bg1: string;
  bg2: string;
  accentColor: string;
  patternType: string;
  patternDensity: number;
  showPattern: boolean;
  fontType: string; // "amiri" | "cairo" | "naskh" | "thuluth" | "kufi"
  fontSize: number;
  textColor: string;
  accentTextColor: string;
  textStyle: string; // "normal" | "bold" | "with-shadow" | "outlined"
  showAyahNumber: boolean;
  showReaderName: boolean;
  showSurahName: boolean;
  showProgressBar: boolean;
  aspectRatio: string; // "9:16" | "16:9" | "1:1" | "4:5"
  imageMotion: string; // "none" | "zoom-in" | "zoom-out" | "ken-burns" | "pan"
  backgroundImage: string; // URL or empty
  showWatermark: boolean;
  transitionType: string; // "fade" | "slide" | "zoom" | "none"
  transitionDuration: number; // in seconds
  textPosition: string; // "center" | "top" | "bottom"
}

export interface VideoExport {
  format: "mp4";
  preset: string; // "1080p" | "720p" | "480p"
  fps: number; // 24 | 30
  quality: string; // "high" | "medium" | "low"
}

export interface HadithData {
  collection: string;
  hadithNumber: number;
  text: string;
  narrator: string;
  grade: string;
}

export interface QuranProject {
  surahId: number | null;
  surahName: string;
  surahNameEn: string;
  ayahFrom: number;
  ayahTo: number;
  reader: SelectedReader | null;
  ayahs: AyahTimestamp[];
  audioUrl: string;
  totalDuration: number; // in seconds
  isLoading: boolean;
  error: string | null;
}

interface AppState {
  // Mode & Panel
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  activePanel: PanelTab;
  setActivePanel: (panel: PanelTab) => void;

  // Quran Project
  quranProject: QuranProject;
  updateQuranProject: (updates: Partial<QuranProject>) => void;
  resetQuranProject: () => void;

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

  // Playback
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  currentAyahIndex: number;
  setCurrentAyahIndex: (index: number) => void;

  // Export progress
  isExporting: boolean;
  setIsExporting: (exporting: boolean) => void;
  exportProgress: number;
  setExportProgress: (progress: number) => void;
}

const defaultQuranProject: QuranProject = {
  surahId: null,
  surahName: "",
  surahNameEn: "",
  ayahFrom: 1,
  ayahTo: 7,
  reader: null,
  ayahs: [],
  audioUrl: "",
  totalDuration: 0,
  isLoading: false,
  error: null,
};

const defaultDesign: VideoDesign = {
  templateId: "noor",
  bg1: "#0a0a0c",
  bg2: "#12121a",
  accentColor: "#c9a84c",
  patternType: "arabic",
  patternDensity: 4,
  showPattern: true,
  fontType: "amiri",
  fontSize: 28,
  textColor: "#f4f4f5",
  accentTextColor: "#c9a84c",
  textStyle: "with-shadow",
  showAyahNumber: true,
  showReaderName: true,
  showSurahName: true,
  showProgressBar: true,
  aspectRatio: "9:16",
  imageMotion: "none",
  backgroundImage: "",
  showWatermark: true,
  transitionType: "fade",
  transitionDuration: 0.3,
  textPosition: "center",
};

const defaultExport: VideoExport = {
  format: "mp4",
  preset: "1080p",
  fps: 30,
  quality: "high",
};

const defaultHadith: HadithData = {
  collection: "bukhari",
  hadithNumber: 0,
  text: "",
  narrator: "",
  grade: "",
};

export const useAppStore = create<AppState>((set) => ({
  // Mode & Panel
  appMode: "quran",
  setAppMode: (mode) =>
    set({
      appMode: mode,
      activePanel: "content",
      quranProject: { ...defaultQuranProject },
      hadithData: { ...defaultHadith },
    }),
  activePanel: "content",
  setActivePanel: (panel) => set({ activePanel: panel }),

  // Quran Project
  quranProject: { ...defaultQuranProject },
  updateQuranProject: (updates) =>
    set((state) => ({
      quranProject: { ...state.quranProject, ...updates },
    })),
  resetQuranProject: () =>
    set({ quranProject: { ...defaultQuranProject } }),

  // Hadith
  hadithData: { ...defaultHadith },
  updateHadithData: (updates) =>
    set((state) => ({
      hadithData: { ...state.hadithData, ...updates },
    })),

  // Design
  design: { ...defaultDesign },
  updateDesign: (updates) =>
    set((state) => ({
      design: { ...state.design, ...updates },
    })),
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
  exportSettings: { ...defaultExport },
  updateExportSettings: (updates) =>
    set((state) => ({
      exportSettings: { ...state.exportSettings, ...updates },
    })),

  // Playback
  isPlaying: false,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  currentTime: 0,
  setCurrentTime: (time) => set({ currentTime: time }),
  currentAyahIndex: 0,
  setCurrentAyahIndex: (index) => set({ currentAyahIndex: index }),

  // Export progress
  isExporting: false,
  setIsExporting: (exporting) => set({ isExporting: exporting }),
  exportProgress: 0,
  setExportProgress: (progress) => set({ exportProgress: progress }),
}));
