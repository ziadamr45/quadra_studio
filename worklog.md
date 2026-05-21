---
Task ID: 1
Agent: Main
Task: Complete rebuild of Quran video maker as Qudra Studio with new identity

Work Log:
- Analyzed existing codebase (MainPage, SettingsPanel, VideoPreview, etc.)
- Copied uploaded logo to public/qudra-logo.png
- Wrote new globals.css with Qudra Studio color scheme (terracotta #c96442 + sage #7c9a82)
- Wrote new store.ts with step-based workflow (content → voice → design → export)
- Wrote new quran-data.ts with completely new template names and audio API integration
- Wrote new layout.tsx with "قدرة استوديو - Qudra Studio" branding
- Wrote new page.tsx pointing to QudraApp component
- Created API routes for Quran verses (/api/quran/verses) and audio proxy (/api/quran/audio)
- Wrote QudraApp.tsx - main component with step navigation, mode switcher, footer
- Wrote VideoPreview.tsx - redesigned with Qudra watermark and real audio playback
- Wrote ContentStep.tsx - Quran browser and Hadith text input
- Wrote VoiceStep.tsx - Reciter selection with real audio preview from alquran.cloud
- Wrote DesignStep.tsx - Template selection, colors, text settings, toggles
- Wrote ExportStep.tsx - Export settings with watermark info
- Wrote QuranBrowser.tsx - Surah browser with real API verse fetching
- Removed all old component files
- Fixed TypeScript errors
- Lint passes clean
- App compiles and serves successfully (verified with curl, agent-browser)

Stage Summary:
- Complete rebuild with new Qudra Studio identity
- Color scheme: Deep charcoal + terracotta + sage (completely different from original emerald/copper)
- Step-based workflow instead of tabs (fundamentally different UX)
- New template names (سماء الليل, رمال الصحراء, غابة عميقة, etc.)
- Real API integration for Quran verses and audio
- Qudra Studio watermark on all videos and preview
- Logo integrated from user upload
- No Azkar section (as requested)
- App verified working with 200 HTTP response
