import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useWebsiteSettings } from '../context/AdminSettingsContext';
import { 
  getWatermarkedImageUrl, 
  getCachedWatermarkedUrl, 
  downloadWatermarkedImage 
} from '../utils/watermark';

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

    const watermarkOptions = {
      watermarkText: watermarkConfig?.text || 'GRAPHICS PUNCHING • PROOF',
      opacity: watermarkConfig?.opacity || 0.28,
      placement: (watermarkConfig?.placement || 'diagonal') as 'diagonal' | 'center' | 'bottom-right' | 'tile',
      color: watermarkConfig?.color || '#FFFFFF',
      subtext: 'SCREEN PRINTING • EMBROIDERY • VECTOR ARTWORK',
      websiteUrl: 'WWW.GRAPHICSPUNCHING.COM',
    };

    // Synchronously check if the watermarked version is already in memory cache
    const initialCached = getCachedWatermarkedUrl(src, watermarkOptions);

    const [watermarkedSrc, setWatermarkedSrc] = useState<string>(initialCached || src);
    const [isWatermarking, setIsWatermarking] = useState<boolean>(!initialCached);
    const isMountedRef = useRef<boolean>(true);

    useEffect(() => {
      isMountedRef.current = true;

      if (watermarkConfig?.enabled === false) {
        setWatermarkedSrc(src);
        setIsWatermarking(false);
        return;
      }

      const cached = getCachedWatermarkedUrl(src, watermarkOptions);
      if (cached) {
        setWatermarkedSrc(cached);
        setIsWatermarking(false);
        return;
      }

      let isCancelled = false;
      setIsWatermarking(true);

      getWatermarkedImageUrl(src, watermarkOptions).then((url) => {
        if (!isCancelled && isMountedRef.current) {
          setWatermarkedSrc(url);
          setIsWatermarking(false);
        }
      });

      return () => {
        isCancelled = true;
        isMountedRef.current = false;
      };
    }, [src, watermarkConfig?.text, watermarkConfig?.opacity, watermarkConfig?.enabled, watermarkConfig?.placement]);

    const handleContextMenu = (e: React.MouseEvent<HTMLImageElement>) => {
      // If watermarking hasn't finished baking into the src data URL yet,
      // prevent the browser from saving the raw original file and immediately trigger the watermarked download!
      if (isWatermarking || watermarkedSrc === src) {
        e.preventDefault();
        downloadWatermarkedImage(src, title || alt, watermarkConfig?.text, watermarkOptions);
      }
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
        className={className}
        style={style}
        {...rest}
      />
    );
  }
);

WatermarkedPortfolioImage.displayName = 'WatermarkedPortfolioImage';
