# Task 5-a: VideoPreview Component with Remotion Player

## Summary
Rewrote `/src/components/VideoPreview.tsx` to integrate Remotion's `@remotion/player` for synchronized video preview.

## Key Changes

### VideoPreview Component (Main)
- **Remotion Player Integration**: Uses `<Player>` from `@remotion/player` with `QuranVideo` composition (same as export pipeline)
- **inputProps**: Built from store state via `useMemo` - maps ayahs (with surahName), audioUrl, design fields, totalDuration, fps
- **Dimensions**: Per aspect ratio - 9:16→1080×1920, 16:9→1920×1080, 1:1→1080×1080, 4:5→1080×1350
- **durationInFrames**: Calculated as `totalDuration × 30fps`
- **showRemotionPlayer flag**: Only true when quran mode + ayahs loaded + audioUrl present
- **Player ref**: `useRef<PlayerRef>` for external play/pause control
- **Controls**: Template prev/next navigation, play/pause button with pulse-gold animation

### StaticPreview Sub-component
- Shows when no audio URL is loaded yet (before timestamps are fetched)
- Renders: gradient bg, pattern overlay, vignette, decorative borders
- Quran mode: surah name, bismillah, up to 3 ayahs with number badges, reader name
- Hadith mode: collection badge, text, narrator
- Empty states: Book/MessageSquare icons with play badge overlays
- Watermark at bottom-left
- Matches visual styling of Remotion composition

## Files Modified
- `/src/components/VideoPreview.tsx` - Complete rewrite

## Verification
- `bun run lint` passes clean (0 errors)
- Dev server compiles successfully (GET / 200)
