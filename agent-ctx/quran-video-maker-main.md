# Task: Quran Video Maker - Noor (نُور) Application

## Summary
Built a complete Quran Video Maker web application called "نُور" (Noor - Light) with a modern dark theme using Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui, framer-motion, and zustand.

## Files Created/Modified

### Modified Files
- `src/app/layout.tsx` - Updated with RTL support (lang="ar" dir="rtl"), Arabic metadata title and description
- `src/app/page.tsx` - Simple client component rendering MainPage

### New Components (12 files)
1. **MainPage.tsx** - Main container with header (logo, tabs, connection status, report button), two-column layout (video preview + settings), and selected verses footer
2. **OnboardingModal.tsx** - 4-step welcome modal with gradient backgrounds, icons, dot indicators, skip/next buttons
3. **VideoPreview.tsx** - 9:16 preview container with background gradient, pattern overlay, verse text rendering, play/pause controls, template switching
4. **QuranBrowser.tsx** - Modal dialog for browsing 114 surahs with search, surah cards with number/name/type badges, ayah range selection
5. **RecitationSettings.tsx** - Audio source selection (reader/upload/record), reader search and selection with quality badges, recording with pulse animation
6. **VersesSettings.tsx** - Quran browse button, English translation toggle, custom text input with add/remove
7. **DesignSettings.tsx** - Accordion sections for templates (8 cards), colors/patterns, text settings, cinematic options
8. **ExportSettings.tsx** - Format selection (MP4/Turbo), quality preset, FPS, CRF, cinematic audio toggle, resolution info, export button
9. **ReportModal.tsx** - Report dialog with type selection (question/suggestion/problem), title, details, email inputs
10. **HadithVideoTab.tsx** - Hadith category selector, text input, search with suggestions
11. **SelectedVersesBar.tsx** - Bottom bar showing selected verses as scrollable cards with remove buttons
12. **SettingsPanel.tsx** - Tabbed panel (الآيات/التلاوة/التصميم/التصدير) with animated content switching

## Design System
- **Base color:** #0a0a0a (deep black)
- **Surface/Card:** #141414
- **Primary:** Emerald green #10b981
- **Accent:** Copper/terracotta #c2703e
- **Text:** Warm white #e8e2d9
- **Muted text:** #7a7570
- **Border:** #2a2725
- **Style:** Modern, clean, with glass-morphism effects, smooth framer-motion transitions
- **Layout:** Two-column (preview left, settings right with tabbed interface)
- **RTL:** All text and layout is RTL for Arabic

## Status
- All 12 components built and working
- Lint passes with no errors
- Dev server running on port 3000, returning 200 status
- Page renders correctly with all UI elements
