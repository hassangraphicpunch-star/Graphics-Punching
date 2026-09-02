import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useWebsiteSettings } from '../context/AdminSettingsContext';
import { getWatermarkedImageUrl, downloadWatermarkedImage } from '../utils/watermark';

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
 * 3. Dragging or copying the image also copies the watermarked version.
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

    // We start with src, and swap to watermarked data URL as soon as generated
    const [watermarkedSrc, setWatermarkedSrc] = useState<string>(src);
    const [isWatermarking, setIsWatermarking] = useState<boolean>(true);
    const isMountedRef = useRef<boolean>(true);

    useEffect(() => {
      isMountedRef.current = true;

      if (watermarkConfig?.enabled === false) {
        setWatermarkedSrc(src);
        setIsWatermarking(false);
        return;
      }

      let isCancelled = false;

      getWatermarkedImageUrl(src, {
        watermarkText: watermarkConfig?.text || 'GRAPHICS PUNCHING • PROOF',
        opacity: watermarkConfig?.opacity || 0.28,
        placement: watermarkConfig?.placement || 'diagonal',
        color: watermarkConfig?.color || '#FFFFFF',
        subtext: 'SCREEN PRINTING • EMBROIDERY • VECTOR ARTWORK',
        websiteUrl: 'WWW.GRAPHICSPUNCHING.COM',
      }).then((url) => {
        if (!isCancelled && isMountedRef.current) {
          setWatermarkedSrc(url);
          setIsWatermarking(false);
        }
      });

      return () => {
        isCancelled = true;
        isMountedRef.current = false;
      };
    }, [src, watermarkConfig]);

    const handleContextMenu = (e: React.MouseEvent<HTMLImageElement>) => {
      // If the image is already watermarked, native right-click "Save Image As..." saves the watermarked image.
      // If user right-clicked while watermarking was still loading, trigger an immediate watermarked save.
      if (isWatermarking && watermarkConfig?.enabled !== false) {
        e.preventDefault();
        downloadWatermarkedImage(src, title || alt, watermarkConfig?.text);
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
