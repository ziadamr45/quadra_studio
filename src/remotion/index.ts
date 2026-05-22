// Barrel exports for Remotion compositions and helpers

// Main composition component
export { QuranVideo } from './QuranVideo';

// Root composition
export { RemotionRoot, getCompositionDimensions, getCompositionId, calculateDurationInFrames } from './Root';

// Types
export type { QuranVideoProps, QuranVideoDesign, AyahData } from './QuranVideo';

// Sub-components (for testing/custom usage)
export { AyahText } from './components/AyahText';
export { Background } from './components/Background';
export { Watermark } from './components/Watermark';
export { ProgressBar } from './components/ProgressBar';
