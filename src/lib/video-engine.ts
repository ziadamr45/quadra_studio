// Video Export Engine for Qudra Studio
// Uses Canvas API + MediaRecorder to export videos with watermark

import type { SelectedVerse } from './store';

interface ExportConfig {
  width: number;
  height: number;
  fps: number;
  verses: SelectedVerse[];
  design: {
    bg1: string;
    bg2: string;
    accentColor: string;
    patternType: string;
    patternDensity: number;
    showPattern: boolean;
    fontType: string;
    fontSize: number;
    textColor: string;
    accentTextColor: string;
    textStyle: string;
    showAyahNumber: boolean;
    showSurahName: boolean;
    showReaderName: boolean;
    showProgressBar: boolean;
    showWatermark: boolean;
    customReaderName: string;
  };
  readerName: string;
  mode: 'quran' | 'hadith';
  hadithData: {
    text: string;
    narrator: string;
    source: string;
  };
  audioUrls: string[];
  onProgress: (progress: number) => void;
}

function getFontFamily(fontType: string): string {
  switch (fontType) {
    case 'amiri': return 'Amiri';
    case 'cairo': return 'Cairo';
    case 'naskh': return 'Amiri';
    case 'thuluth': return 'Amiri';
    case 'kufi': return 'Cairo';
    default: return 'Amiri';
  }
}

function getTextShadow(style: string): string {
  switch (style) {
    case 'bold': return '2px 2px 4px rgba(0,0,0,0.5)';
    case 'with-shadow': return '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.4)';
    case 'outlined': return '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000';
    default: return '1px 1px 4px rgba(0,0,0,0.5)';
  }
}

function drawPattern(ctx: CanvasRenderingContext2D, type: string, color: string, density: number, w: number, h: number) {
  const size = (density + 1) * 12;
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;

  switch (type) {
    case 'arabic':
      for (let x = 0; x < w; x += size) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + size, h);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + size, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      break;
    case 'geometric':
      for (let x = 0; x < w; x += size * 2) {
        for (let y = 0; y < h; y += size * 2) {
          ctx.beginPath();
          ctx.moveTo(x + size, y);
          ctx.lineTo(x + size * 2, y + size);
          ctx.lineTo(x + size, y + size * 2);
          ctx.lineTo(x, y + size);
          ctx.closePath();
          ctx.stroke();
        }
      }
      break;
    case 'waves':
      for (let y = 0; y < h; y += size) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x < w; x += 4) {
          ctx.lineTo(x, y + Math.sin(x / 20) * 3);
        }
        ctx.stroke();
      }
      break;
    default:
      break;
  }
  ctx.restore();
}

function drawWatermark(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.font = '10px "Geist Mono", monospace';
  ctx.fillStyle = '#c9a84c';
  ctx.textAlign = 'left';
  ctx.fillText('QUDRA STUDIO', 12, h - 12);
  ctx.restore();
}

function drawVerseFrame(
  ctx: CanvasRenderingContext2D,
  config: ExportConfig,
  verseIndex: number,
  progress: number
) {
  const { width: w, height: h, design, verses, readerName, mode, hadithData } = config;

  // Clear
  ctx.clearRect(0, 0, w, h);

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, design.bg1);
  gradient.addColorStop(0.5, design.bg2);
  gradient.addColorStop(1, design.bg1);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  // Pattern overlay
  if (design.showPattern && design.patternType !== 'none') {
    drawPattern(ctx, design.patternType, design.accentColor, design.patternDensity, w, h);
  }

  // Decorative border
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  ctx.strokeRect(24, 24, w - 48, h - 48);
  ctx.restore();

  // Top decorative line
  const topLine = ctx.createLinearGradient(0, 0, w, 0);
  topLine.addColorStop(0, 'transparent');
  topLine.addColorStop(0.5, design.accentColor + '40');
  topLine.addColorStop(1, 'transparent');
  ctx.fillStyle = topLine;
  ctx.fillRect(0, 0, w, 1);

  const fontFamily = getFontFamily(design.fontType);

  if (mode === 'quran' && verses.length > 0) {
    const verse = verses[verseIndex] || verses[0];

    // Surah name
    if (design.showSurahName) {
      ctx.save();
      ctx.font = `500 ${Math.max(14, w * 0.018)}px "${fontFamily}", serif`;
      ctx.fillStyle = design.accentTextColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(`سورة ${verse.surahName}`, w / 2, h * 0.08);
      ctx.restore();
    }

    // Verse text
    if (design.showText) {
      ctx.save();
      const fontSize = Math.max(16, design.fontSize * (w / 400));
      ctx.font = `${design.textStyle === 'bold' ? 'bold' : 'normal'} ${fontSize}px "${fontFamily}", serif`;
      ctx.fillStyle = design.textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.shadowBlur = 4;

      if (design.textStyle === 'with-shadow') {
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      }

      // Word wrap the verse text
      const maxWidth = w * 0.8;
      const text = verse.ayahText;
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);

      const lineHeight = fontSize * 2.2;
      const startY = (h - lines.length * lineHeight) / 2 + lineHeight / 2;

      lines.forEach((line, i) => {
        ctx.fillText(line, w / 2, startY + i * lineHeight);

        // Ayah number at the end of last line
        if (design.showAyahNumber && i === lines.length - 1) {
          ctx.save();
          ctx.font = `${Math.max(10, fontSize * 0.3)}px "${fontFamily}", serif`;
          ctx.fillStyle = design.accentTextColor;
          const numText = `${verse.ayahNumber}`;
          const numMetrics = ctx.measureText(numText);
          const lineMetrics = ctx.measureText(line);
          const numX = w / 2 + lineMetrics.width / 2 + 16;
          const numY = startY + i * lineHeight;

          // Draw circle around ayah number
          ctx.beginPath();
          ctx.arc(numX, numY - 4, Math.max(8, fontSize * 0.25), 0, Math.PI * 2);
          ctx.strokeStyle = design.accentColor + '50';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillText(numText, numX, numY);
          ctx.restore();
        }
      });
      ctx.restore();
    }

    // Reader name
    if (design.showReaderName && readerName) {
      ctx.save();
      ctx.font = `400 ${Math.max(10, w * 0.014)}px "${fontFamily}", serif`;
      ctx.fillStyle = design.accentTextColor;
      ctx.globalAlpha = 0.7;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(`﴾ ${design.customReaderName || readerName} ﴿`, w / 2, h * 0.88);
      ctx.restore();
    }
  } else if (mode === 'hadith' && hadithData.text) {
    // Hadith source
    if (hadithData.source) {
      ctx.save();
      ctx.font = `500 ${Math.max(12, w * 0.016)}px "${fontFamily}", serif`;
      ctx.fillStyle = design.accentTextColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(hadithData.source, w / 2, h * 0.1);
      ctx.restore();
    }

    // Hadith text
    ctx.save();
    const fontSize = Math.max(14, w * 0.022);
    ctx.font = `normal ${fontSize}px "${fontFamily}", serif`;
    ctx.fillStyle = design.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 4;

    const maxWidth = w * 0.8;
    const words = hadithData.text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    const lineHeight = fontSize * 2.2;
    const startY = (h - lines.length * lineHeight) / 2 + lineHeight / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line, w / 2, startY + i * lineHeight);
    });
    ctx.restore();

    // Narrator
    if (hadithData.narrator) {
      ctx.save();
      ctx.font = `400 ${Math.max(10, w * 0.014)}px "${fontFamily}", serif`;
      ctx.fillStyle = design.accentTextColor;
      ctx.globalAlpha = 0.7;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(`﴾ ${hadithData.narrator} ﴿`, w / 2, h * 0.88);
      ctx.restore();
    }
  }

  // Progress bar
  if (design.showProgressBar) {
    ctx.save();
    const barY = h - 40;
    const barW = w * 0.7;
    const barX = (w - barW) / 2;
    const barH = 2;

    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(barX, barY, barW, barH);

    ctx.fillStyle = design.accentColor;
    ctx.fillRect(barX, barY, barW * progress, barH);
    ctx.restore();
  }

  // Watermark (ALWAYS present on export)
  drawWatermark(ctx, w, h);

  // Bottom decorative line
  const botLine = ctx.createLinearGradient(0, h - 1, w, h - 1);
  botLine.addColorStop(0, 'transparent');
  botLine.addColorStop(0.5, design.accentColor + '20');
  botLine.addColorStop(1, 'transparent');
  ctx.fillStyle = botLine;
  ctx.fillRect(0, h - 1, w, 1);
}

export async function exportVideo(config: ExportConfig): Promise<Blob> {
  const { width, height, fps, verses, audioUrls, onProgress } = config;

  // Create offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Set up MediaRecorder
  const stream = canvas.captureStream(fps);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: 8000000,
  });

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  return new Promise((resolve, reject) => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(blob);
    };

    mediaRecorder.onerror = () => reject(new Error('Recording failed'));

    // Start recording
    mediaRecorder.start(100);

    // Load and play audio
    const audioElements: HTMLAudioElement[] = [];
    let totalDuration = 0;

    // Calculate total duration based on content
    if (audioUrls.length > 0) {
      audioUrls.forEach((url) => {
        const audio = new Audio(url);
        audio.preload = 'auto';
        audioElements.push(audio);
      });

      // If we have audio, we'll sync to it
      // For now, estimate 5 seconds per ayah if no audio loaded
      totalDuration = Math.max(audioUrls.length * 5000, 10000);
    } else {
      // No audio - use estimated timing
      totalDuration = verses.length > 0 ? verses.length * 5000 : 10000;
    }

    const totalFrames = (totalDuration / 1000) * fps;
    let currentFrame = 0;

    function animate() {
      if (currentFrame >= totalFrames) {
        mediaRecorder.stop();
        audioElements.forEach((a) => { a.pause(); a.src = ''; });
        return;
      }

      const overallProgress = currentFrame / totalFrames;
      const verseCount = verses.length || 1;
      const verseIndex = Math.min(
        Math.floor(overallProgress * verseCount),
        verseCount - 1
      );
      const verseProgress = (overallProgress * verseCount) - verseIndex;

      drawVerseFrame(ctx, config, verseIndex, verseProgress);
      onProgress(Math.round(overallProgress * 100));

      currentFrame++;
      requestAnimationFrame(animate);
    }

    animate();
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
