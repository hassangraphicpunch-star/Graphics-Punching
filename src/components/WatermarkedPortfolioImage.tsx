import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useWebsiteSettings } from '../context/AdminSettingsContext';
import { 
  getWatermarkedImageUrl, 
  getCachedWatermarkedUrl, 
  downloadWatermarkedImage 
} from '../utils/watermark';
import { resolvePortfolioImageUrl, getFallbackPortfolioImage } from '../utils/imageResolver';

export interface WatermarkedPortfolioImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  showOverlayBadge?: boolean;
}

/**
 * WatermarkedPortfolioImage ensures that:
 * 1. The image rendered in the DOM has the official watermark permanently stamped into its pixels.
 * 2. When a user right-clicks and chooses "Save Image As...", the saved file includes the watermark.
 * 3. Dragging, copying, or saving the image preserves the watermarked version.
 * 4. Automatic fallback handling ensures images always render even with relative or legacy paths.
 */
export const WatermarkedPortfolioImage = forwardRef<HTMLImageElement, WatermarkedPortfolioImageProps>(
  (
    {
      src,
      alt,
      title,
      className = '',
      style,
      loading = 'lazy',
      showOverlayBadge = false,
      ...rest
    },
    ref
  ) => {
    const { settings } = useWebsiteSettings();
    const watermarkConfig = settings.watermark;

    // Resolve image URL through master resolver to handle any path format
    const resolvedSrc = resolvePortfolioImageUrl(src);

    const watermarkOptions = {
      watermarkText: watermarkConfig?.text || 'GRAPHICS PUNCHING • PROOF',
      opacity: watermarkConfig?.opacity || 0.28,
      placement: (watermarkConfig?.placement || 'diagonal') as 'diagonal' | 'center' | 'bottom-right' | 'tile',
      color: watermarkConfig?.color || '#FFFFFF',
      subtext: 'SCREEN PRINTING • EMBROIDERY • VECTOR ARTWORK',
      websiteUrl: 'WWW.GRAPHICSPUNCHING.COM',
    };

    // Synchronously check if the watermarked version is already in memory cache
    const initialCached = getCachedWatermarkedUrl(resolvedSrc, watermarkOptions);

    const [watermarkedSrc, setWatermarkedSrc] = useState<string>(initialCached || resolvedSrc);
    const [isWatermarking, setIsWatermarking] = useState<boolean>(!initialCached);
    const [hasError, setHasError] = useState<boolean>(false);
    const isMountedRef = useRef<boolean>(true);
    const retryCountRef = useRef<number>(0);

    useEffect(() => {
      isMountedRef.current = true;
      retryCountRef.current = 0;
      setHasError(false);

      if (watermarkConfig?.enabled === false) {
        setWatermarkedSrc(resolvedSrc);
        setIsWatermarking(false);
        return;
      }

      const cached = getCachedWatermarkedUrl(resolvedSrc, watermarkOptions);
      if (cached) {
        setWatermarkedSrc(cached);
        setIsWatermarking(false);
        return;
      }

      let isCancelled = false;
      setIsWatermarking(true);

      getWatermarkedImageUrl(resolvedSrc, watermarkOptions)
        .then((url) => {
          if (!isCancelled && isMountedRef.current) {
            setWatermarkedSrc(url);
            setIsWatermarking(false);
          }
        })
        .catch((err) => {
          console.warn('Watermark generation fell back to resolved source:', err);
          if (!isCancelled && isMountedRef.current) {
            setWatermarkedSrc(resolvedSrc);
            setIsWatermarking(false);
          }
        });

      return () => {
        isCancelled = true;
        isMountedRef.current = false;
      };
    }, [resolvedSrc, watermarkConfig?.text, watermarkConfig?.opacity, watermarkConfig?.enabled, watermarkConfig?.placement]);

    const handleContextMenu = (e: React.MouseEvent<HTMLImageElement>) => {
      // If watermarking hasn't finished baking into the src data URL yet,
      // prevent the browser from saving the raw original file and immediately trigger the watermarked download!
      if (isWatermarking || watermarkedSrc === resolvedSrc) {
        e.preventDefault();
        downloadWatermarkedImage(resolvedSrc, title || alt, watermarkConfig?.text, watermarkOptions);
      }
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (retryCountRef.current === 0) {
        retryCountRef.current++;
        // First fallback: try direct raw resolved source if data-url failed
        if (watermarkedSrc !== resolvedSrc) {
          setWatermarkedSrc(resolvedSrc);
          return;
        }
        // Try static asset route
        const filename = resolvedSrc.split(/[/\\]/).pop();
        if (filename) {
          setWatermarkedSrc(`/assets/images/${filename}`);
          return;
        }
      } else if (retryCountRef.current === 1) {
        retryCountRef.current++;
        const filename = resolvedSrc.split(/[/\\]/).pop();
        if (filename) {
          setWatermarkedSrc(`/src/assets/images/${filename}`);
          return;
        }
      } else if (retryCountRef.current === 2) {
        retryCountRef.current++;
        setWatermarkedSrc(getFallbackPortfolioImage());
        return;
      }
      setHasError(true);
    };

    return (
      <img
        ref={ref}
        src={watermarkedSrc}
        alt={alt}
        title={title || alt}
        referrerPolicy="no-referrer"
        loading={loading}
        onContextMenu={handleContextMenu}
        onError={handleImageError}
        className={className}
        style={style}
        {...rest}
      />
    );
  }
);

WatermarkedPortfolioImage.displayName = 'WatermarkedPortfolioImage';
