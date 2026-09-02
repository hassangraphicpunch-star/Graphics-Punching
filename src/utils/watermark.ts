/**
 * Watermark utility for permanently stamping the "GRAPHICS PUNCHING" watermark
 * onto images using HTML5 Canvas before displaying, downloading, or exporting.
 *
 * This ensures that when visitors right-click -> "Save Image As...",
 * the saved image file on their computer permanently includes the official watermark.
 */

export interface WatermarkRenderOptions {
  watermarkText?: string;
  subtext?: string;
  opacity?: number;
  placement?: 'diagonal' | 'center' | 'bottom-right' | 'tile';
  color?: string;
  websiteUrl?: string;
}

// In-memory cache of generated watermarked data URLs for instant re-use
const watermarkUrlCache = new Map<string, string>();
const inFlightPromises = new Map<string, Promise<string>>();

/**
 * Draws the official Graphics Punching watermark onto an HTML5 Canvas.
 */
export function renderWatermarkToCanvas(
  img: HTMLImageElement,
  canvas: HTMLCanvasElement,
  options: WatermarkRenderOptions = {}
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }

  const width = img.naturalWidth || img.width || 1200;
  const height = img.naturalHeight || img.height || 900;

  canvas.width = width;
  canvas.height = height;

  const watermarkText = options.watermarkText || 'GRAPHICS PUNCHING • PROOF';
  const subtext = options.subtext || 'SCREEN PRINTING • EMBROIDERY • VECTOR ARTWORK';
  const websiteUrl = options.websiteUrl || 'WWW.GRAPHICSPUNCHING.COM';
  const placement = options.placement || 'diagonal';

  // 1. Draw the base original full-resolution image
  ctx.drawImage(img, 0, 0, width, height);

  // 2. Draw subtle full-grid repeating diagonal background security pattern
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate((-25 * Math.PI) / 180);

  const patternFontSize = Math.max(16, Math.round(Math.min(width, height) * 0.032));
  ctx.font = `900 ${patternFontSize}px 'Plus Jakarta Sans', 'Arial Black', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const stepX = Math.round(width * 0.42);
  const stepY = Math.round(height * 0.22);
  const maxDist = Math.sqrt(width * width + height * height);

  for (let y = -maxDist; y <= maxDist; y += stepY) {
    for (let x = -maxDist; x <= maxDist; x += stepX) {
      // Dark drop shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillText(watermarkText, x + 1.5, y + 1.5);
      // Semi-transparent foreground
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.fillText(watermarkText, x, y);
    }
  }
  ctx.restore();

  // 3. Draw Main Central Prominent Watermark Shield & Banner
  ctx.save();
  ctx.translate(width / 2, height / 2);
  if (placement === 'diagonal') {
    ctx.rotate((-18 * Math.PI) / 180);
  }

  const mainFontSize = Math.max(26, Math.round(Math.min(width, height) * 0.072));
  ctx.font = `900 ${mainFontSize}px 'Plus Jakarta Sans', 'Arial Black', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Deep multi-layer shadow for visibility on any background (dark or light)
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = Math.round(mainFontSize * 0.4);
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 3;

  // Heavy dark outline
  ctx.lineWidth = Math.max(3, Math.round(mainFontSize * 0.09));
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
  ctx.strokeText(watermarkText, 0, 0);

  // Solid bright foreground
  ctx.fillStyle = options.color || '#FFFFFF';
  ctx.fillText(watermarkText, 0, 0);

  // Subtitle badge
  if (subtext) {
    const subFontSize = Math.max(11, Math.round(mainFontSize * 0.28));
    ctx.font = `800 ${subFontSize}px 'Plus Jakarta Sans', sans-serif`;
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#000000';
    ctx.fillStyle = '#FFC400';
    ctx.fillText(subtext, 0, mainFontSize * 0.68);
  }
  ctx.restore();

  // 4. Bottom Right Official Verification Stamp
  ctx.save();
  const stampFontSize = Math.max(12, Math.round(Math.min(width, height) * 0.024));
  ctx.font = `800 ${stampFontSize}px 'Plus Jakarta Sans', sans-serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillText(websiteUrl, width - 20 + 1, height - 16 + 1);
  // Gold text
  ctx.fillStyle = '#FFC400';
  ctx.fillText(websiteUrl, width - 20, height - 16);
  ctx.restore();
}

/**
 * Returns a Promise that resolves to a data URL containing the image with
 * the official watermark permanently stamped into its pixels.
 *
 * Subsequent requests for the same source and options return instantaneously from cache.
 */
export async function getWatermarkedImageUrl(
  imageSrc: string,
  options: WatermarkRenderOptions = {}
): Promise<string> {
  if (!imageSrc) return imageSrc;

  const cacheKey = `${imageSrc}__${options.watermarkText || 'default'}__${options.opacity || '0.25'}__${options.placement || 'diagonal'}`;

  if (watermarkUrlCache.has(cacheKey)) {
    return watermarkUrlCache.get(cacheKey)!;
  }

  if (inFlightPromises.has(cacheKey)) {
    return inFlightPromises.get(cacheKey)!;
  }

  const promise = new Promise<string>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        renderWatermarkToCanvas(img, canvas, options);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        watermarkUrlCache.set(cacheKey, dataUrl);
        inFlightPromises.delete(cacheKey);
        resolve(dataUrl);
      } catch (err) {
        console.warn('Canvas watermarking export error (possibly CORS):', err);
        inFlightPromises.delete(cacheKey);
        // Graceful fallback to original image if export fails
        resolve(imageSrc);
      }
    };

    img.onerror = (err) => {
      console.warn('Failed to load image for watermarking:', err);
      inFlightPromises.delete(cacheKey);
      resolve(imageSrc);
    };

    img.src = imageSrc;
  });

  inFlightPromises.set(cacheKey, promise);
  return promise;
}

/**
 * Downloads a watermarked copy of the image with a standardized filename.
 */
export async function downloadWatermarkedImage(
  imageSrc: string,
  rawTitle: string,
  watermarkText: string = 'GRAPHICS PUNCHING • PROOF',
  options: WatermarkRenderOptions = {}
): Promise<void> {
  try {
    const cleanName = rawTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'portfolio-project';
    const filename = `${cleanName}-watermarked.jpg`;

    const watermarkedDataUrl = await getWatermarkedImageUrl(imageSrc, {
      watermarkText,
      ...options,
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = watermarkedDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Download watermarked image failed:', err);
    // Fallback: direct download
    const link = document.createElement('a');
    link.download = `${rawTitle.toLowerCase().replace(/\s+/g, '-')}-preview.jpg`;
    link.href = imageSrc;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
