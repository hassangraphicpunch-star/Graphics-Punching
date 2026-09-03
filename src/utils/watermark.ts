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

export function getWatermarkCacheKey(
  imageSrc: string,
  options: WatermarkRenderOptions = {}
): string {
  return `${imageSrc}__${options.watermarkText || 'default'}__${options.opacity || '0.28'}__${options.placement || 'diagonal'}`;
}

/**
 * Synchronously retrieves a cached watermarked data URL if already generated.
 */
export function getCachedWatermarkedUrl(
  imageSrc: string,
  options: WatermarkRenderOptions = {}
): string | null {
  if (!imageSrc) return null;
  const key = getWatermarkCacheKey(imageSrc, options);
  return watermarkUrlCache.get(key) || null;
}

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
 * Loads an image with smart CORS handling.
 */
function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const isExternal = src.startsWith('http://') || src.startsWith('https://');
    const isSameOrigin =
      !isExternal ||
      (typeof window !== 'undefined' && src.startsWith(window.location.origin));

    const img = new Image();

    // Only apply crossOrigin if truly external, avoiding CORS cache conflicts on same-origin assets
    if (!isSameOrigin) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => resolve(img);

    img.onerror = () => {
      // If failed with crossOrigin, retry once without crossOrigin
      if (img.crossOrigin) {
        const fallbackImg = new Image();
        fallbackImg.onload = () => resolve(fallbackImg);
        fallbackImg.onerror = (err) => reject(err);
        fallbackImg.src = src;
      } else {
        // Try fetching as blob
        fetch(src)
          .then((res) => res.blob())
          .then((blob) => {
            const blobUrl = URL.createObjectURL(blob);
            const blobImg = new Image();
            blobImg.onload = () => {
              resolve(blobImg);
            };
            blobImg.onerror = (err) => reject(err);
            blobImg.src = blobUrl;
          })
          .catch((fetchErr) => reject(fetchErr));
      }
    };

    img.src = src;
  });
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

  const cacheKey = getWatermarkCacheKey(imageSrc, options);

  if (watermarkUrlCache.has(cacheKey)) {
    return watermarkUrlCache.get(cacheKey)!;
  }

  if (inFlightPromises.has(cacheKey)) {
    return inFlightPromises.get(cacheKey)!;
  }

  const promise = (async () => {
    try {
      const img = await loadImageElement(imageSrc);
      const canvas = document.createElement('canvas');
      renderWatermarkToCanvas(img, canvas, options);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      watermarkUrlCache.set(cacheKey, dataUrl);
      return dataUrl;
    } catch (err) {
      console.warn('Watermark generation encountered an error, falling back to original image:', err);
      return imageSrc;
    } finally {
      inFlightPromises.delete(cacheKey);
    }
  })();

  inFlightPromises.set(cacheKey, promise);
  return promise;
}

/**
 * Preloads watermarked versions of multiple images in the background.
 */
export function preloadPortfolioWatermarks(
  items: Array<string | { image?: string; src?: string }>,
  options: WatermarkRenderOptions = {}
): void {
  if (typeof window === 'undefined') return;

  const urls: string[] = items
    .map((item) => {
      if (typeof item === 'string') return item;
      return item.image || item.src || '';
    })
    .filter((u): u is string => Boolean(u && u.length > 0));

  // Preload in gentle background batches
  const batchSize = 3;
  let currentIndex = 0;

  function processNextBatch() {
    if (currentIndex >= urls.length) return;
    const batch = urls.slice(currentIndex, currentIndex + batchSize);
    currentIndex += batchSize;

    Promise.all(batch.map((url) => getWatermarkedImageUrl(url, options)))
      .catch(() => {})
      .finally(() => {
        if (typeof window.requestIdleCallback === 'function') {
          window.requestIdleCallback(() => processNextBatch(), { timeout: 1000 });
        } else {
          setTimeout(processNextBatch, 150);
        }
      });
  }

  // Start initial batch after brief idle
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(() => processNextBatch(), { timeout: 500 });
  } else {
    setTimeout(processNextBatch, 100);
  }
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
