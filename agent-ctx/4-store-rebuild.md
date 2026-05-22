# Task 4: Rebuild the Store and Data Types for Remotion-based Architecture

## Summary
Completely rebuilt the Zustand store and data types to support the Remotion-based synchronized video generation architecture. Updated all components, data files, and the video engine to work with the new store shape.

## Files Modified

### 1. `/src/lib/store.ts` - Complete Store Overhaul
- **New Types**: AyahTimestamp, SelectedReader (with recitationId), QuranProject, VideoDesign (with new fields), VideoExport (fps as number), HadithData (collection/hadithNumber/grade)
- **Removed**: SelectedVerse, AudioState, showQuranBrowser state, isRecording state, selectedVerses management
- **New Store State**: quranProject (consolidates surah+reader+ayahs+audio), top-level playback (isPlaying, currentTime, currentAyahIndex), top-level export (isExporting, exportProgress)
- **New Methods**: updateQuranProject(), resetQuranProject()

### 2. `/src/lib/quran-data.ts` - Reader & Template Updates
- Added `recitationId` field to all 14 readers (Quran.com IDs: 1-22)
- Added `transitionTypes` array (fade, slide, zoom, none)
- Added `textPositionOptions` array (center, top, bottom)
- Added `qualityOptions` array (high, medium, low)
- Added `pan` option to imageMotionOptions
- Added `getQuranComAudioUrl()` helper
- Kept all 9 templates, patterns, fonts intact

### 3. `/src/lib/video-engine.ts` - Updated Export Config
- Now uses AyahTimestamp instead of SelectedVerse
- Uses VideoDesign from store (with new fields)
- Supports textPosition in rendering

### 4. Components Updated
- **VideoPreview.tsx**: Uses quranProject.ayahs/reader, store-level isPlaying, textPosition
- **ContentPanel.tsx**: Uses quranProject, resetQuranProject(), hadithData.collection/grade, onBrowseQuran callback
- **VoicePanel.tsx**: Uses updateQuranProject({ reader }), local isRecording state
- **DesignPanel.tsx**: Added transitionType/Duration, textPosition, backgroundImage controls
- **ExportPanel.tsx**: Store-level isExporting/exportProgress, quality/fps as number
- **QuranBrowser.tsx**: Props-based (open/onOpenChange), updateQuranProject()
- **QudraStudio.tsx**: Local showQuranBrowser state, passes callbacks to children

### 5. Prisma/Database
- Verified Neon PostgreSQL connection works
- Fixed .env quoting issue for Prisma CLI

## Verification
- `bun run lint` passes clean
- App compiles and renders (GET / 200)
- All store types are correctly exported and used
