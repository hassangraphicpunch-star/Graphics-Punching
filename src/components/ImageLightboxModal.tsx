import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, 
  Maximize2, ExternalLink, Sparkles, Layers, Tag, Clock, ArrowRight,
  Download, Check, ShieldCheck
} from 'lucide-react';
import { WatermarkOverlay } from './WatermarkOverlay';
import { downloadWatermarkedImage } from '../utils/watermark';

export interface LightboxImageItem {
  src: string;
  title: string;
  category?: string;
  categoryLabel?: string;
  tag?: string;
  specs?: string;
  client?: string;
  description?: string;
  stitchCount?: string;
  turnaround?: string;
  deliverables?: string[];
}

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: LightboxImageItem[];
  currentIndex: number;
  onIndexChange?: (newIndex: number) => void;
  onOpenQuoteForProject?: (projectTitle: string) => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
  onOpenQuoteForProject,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showMetadata, setShowMetadata] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const currentItem = images[currentIndex] || images[0];

  const handleDownloadImage = async () => {
    if (!currentItem || isDownloading) return;
    try {
      setIsDownloading(true);
      await downloadWatermarkedImage(currentItem.src, currentItem.title, 'GRAPHICS PUNCHING');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Reset zoom & pan when index changes or modal opens
  useEffect(() => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setDownloadSuccess(false);
  }, [currentIndex, isOpen]);

  // Lock body scroll when lightbox is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    onIndexChange?.(newIndex);
  }, [currentIndex, images.length, onIndexChange]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    onIndexChange?.(newIndex);
  }, [currentIndex, images.length, onIndexChange]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Keyboard navigation & controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  // Mouse pan handlers for zoomed state
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      e.preventDefault();
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile pan & swipe
  const touchStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX - panOffset.x,
        y: e.touches[0].clientY - panOffset.y,
        time: Date.now(),
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (zoomLevel > 1 && e.touches.length === 1) {
      setPanOffset({
        x: e.touches[0].clientX - touchStartRef.current.x,
        y: e.touches[0].clientY - touchStartRef.current.y,
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (zoomLevel <= 1 && e.changedTouches.length === 1) {
      const deltaX = e.changedTouches[0].clientX - (touchStartRef.current.x + panOffset.x);
      const deltaTime = Date.now() - touchStartRef.current.time;
      // If quick swipe (> 50px in < 400ms)
      if (deltaTime < 400 && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          handlePrev();
        } else {
          handleNext();
        }
      }
    }
  };

  if (!isOpen || !currentItem) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Full size image preview"
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-xl text-white select-none animate-fadeIn transition-opacity duration-200"
    >
      {/* Top Floating Control Bar */}
      <header className="relative z-30 flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5 bg-black/80 border-b border-zinc-800/80 backdrop-blur-md shrink-0">
        {/* Left: Project title & Counter */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden min-w-0 pr-2">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="h-2 w-2 rounded-full bg-[#FFC400] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-mono font-bold text-zinc-400">
              {currentIndex + 1}/{images.length}
            </span>
          </div>

          <div className="h-3 sm:h-4 w-px bg-zinc-700 hidden sm:block shrink-0" />

          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-white truncate max-w-[140px] xs:max-w-[200px] sm:max-w-md">
            {currentItem.title}
          </h3>

          {currentItem.tag && (
            <span className="hidden md:inline-block bg-[#FFC400]/15 text-[#FFC400] border border-[#FFC400]/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shrink-0">
              {currentItem.tag}
            </span>
          )}
        </div>

        {/* Right: Controls Toolbar */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Zoom Out */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            title="Zoom Out (-)"
            aria-label="Zoom Out"
            className="p-1.5 sm:p-2 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Zoom Level Indicator / Reset */}
          <button
            type="button"
            onClick={handleResetZoom}
            title="Reset Zoom (0)"
            aria-label="Reset Zoom"
            className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-[11px] sm:text-xs font-mono font-bold text-[#FFC400] border border-zinc-700/60 transition-all cursor-pointer flex items-center gap-1 min-h-[36px]"
          >
            <span>{Math.round(zoomLevel * 100)}%</span>
            {zoomLevel !== 1 && <RotateCcw className="w-3 h-3 text-zinc-400" />}
          </button>

          {/* Zoom In */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 4}
            title="Zoom In (+)"
            aria-label="Zoom In"
            className="p-1.5 sm:p-2 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Download Watermarked Image */}
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isDownloading}
            title="Download Watermarked Image"
            aria-label="Download watermarked image"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-zinc-900/90 hover:bg-[#FFC400] text-zinc-300 hover:text-black border border-zinc-700/60 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer min-h-[36px]"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="hidden lg:inline text-[11px]">Saved!</span>
              </>
            ) : isDownloading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span className="hidden lg:inline text-[11px]">Watermarking...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span className="hidden lg:inline text-[11px]">Download</span>
              </>
            )}
          </button>

          {/* Toggle Metadata Pane */}
          <button
            type="button"
            onClick={() => setShowMetadata(!showMetadata)}
            title="Toggle Details"
            aria-label="Toggle details pane"
            className={`p-1.5 sm:p-2 rounded-lg border transition-all cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center ${
              showMetadata
                ? 'bg-[#FFC400] text-black border-[#FFC400]'
                : 'bg-zinc-900/90 text-zinc-300 hover:text-white border-zinc-700/60'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-zinc-700 mx-0.5 sm:mx-1" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            title="Close Preview (Escape)"
            aria-label="Close full size image preview"
            className="p-1.5 sm:px-3 sm:py-2 rounded-lg bg-red-600/90 hover:bg-red-600 text-white font-black text-xs uppercase flex items-center gap-1.5 transition-all shadow-lg hover:shadow-red-600/30 cursor-pointer min-h-[36px]"
          >
            <X className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">CLOSE</span>
          </button>
        </div>
      </header>

      {/* Main Image Display Stage */}
      <main
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`flex-1 relative w-full h-full flex items-center justify-center p-2 sm:p-6 md:p-8 overflow-hidden ${
          zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
        }`}
      >
        {/* Navigation Arrow Previous */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            title="Previous Image (Left Arrow)"
            aria-label="Previous image"
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-black/80 hover:bg-[#FFC400] text-white hover:text-black border border-zinc-700/80 flex items-center justify-center transition-all duration-200 shadow-2xl backdrop-blur-md cursor-pointer group min-h-[44px] min-w-[44px]"
          >
            <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 transition-transform group-hover:-translate-x-1" />
          </button>
        )}

        {/* The Exact Original Image (Zero Cropping, Zero Distortion, 100% Proportional Fit) */}
        <div 
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center center',
          }}
          className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-100 ease-out overflow-hidden rounded-lg"
        >
          <img
            ref={imageRef}
            src={currentItem.src}
            alt={currentItem.title}
            referrerPolicy="no-referrer"
            style={{
              maxHeight: showMetadata ? 'calc(100vh - 190px)' : 'calc(100vh - 80px)',
              maxWidth: 'calc(100vw - 20px)',
            }}
            className="w-auto h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] rounded-lg pointer-events-auto transition-transform duration-100"
            draggable={false}
          />
          <WatermarkOverlay size="lg" />
        </div>

        {/* Navigation Arrow Next */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            title="Next Image (Right Arrow)"
            aria-label="Next image"
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-black/80 hover:bg-[#FFC400] text-white hover:text-black border border-zinc-700/80 flex items-center justify-center transition-all duration-200 shadow-2xl backdrop-blur-md cursor-pointer group min-h-[44px] min-w-[44px]"
          >
            <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </main>

      {/* Bottom Collapsible Specification & Action Drawer */}
      {showMetadata && (
        <footer className="relative z-30 bg-[#0c0c0e]/95 border-t border-zinc-800/90 px-3 sm:px-6 py-2.5 sm:py-3.5 backdrop-blur-md animate-fadeIn shrink-0 max-h-[40vh] overflow-y-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4">
            
            {/* Left: Metadata Details */}
            <div className="space-y-1 max-w-3xl">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="bg-[#FFC400] text-black text-[10px] font-black uppercase px-2.5 py-0.5 rounded shadow-sm">
                  {currentItem.categoryLabel || currentItem.category || 'Portfolio Master'}
                </span>

                {currentItem.turnaround && (
                  <span className="bg-zinc-900 border border-zinc-700/70 text-zinc-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#FFC400]" />
                    {currentItem.turnaround}
                  </span>
                )}

                {currentItem.stitchCount && (
                  <span className="bg-zinc-900 border border-zinc-700/70 text-zinc-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#FFC400]" />
                    {currentItem.stitchCount}
                  </span>
                )}

                {currentItem.client && (
                  <span className="text-[11px] text-zinc-400 font-medium truncate max-w-[200px] sm:max-w-[240px]">
                    Client: <strong className="text-zinc-200">{currentItem.client}</strong>
                  </span>
                )}
              </div>

              {currentItem.specs && (
                <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed line-clamp-2 md:line-clamp-1">
                  {currentItem.specs}
                </p>
              )}
            </div>

            {/* Right: Quick Action Buttons */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0 pt-1 md:pt-0">
              <button
                type="button"
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-bold uppercase px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[40px]"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saved!</span>
                  </>
                ) : isDownloading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-[#FFC400]" />
                    <span>Download Image</span>
                  </>
                )}
              </button>

              {onOpenQuoteForProject && (
                <button
                  type="button"
                  onClick={() => {
                    const title = currentItem.title;
                    onClose();
                    onOpenQuoteForProject(title);
                  }}
                  id="lightbox-quote-btn"
                  className="flex-1 sm:flex-initial bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-black text-xs uppercase tracking-wider px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer min-h-[40px] group"
                >
                  <span>Request Quote</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold uppercase transition-colors cursor-pointer min-h-[40px]"
              >
                Close
              </button>
            </div>

          </div>
        </footer>
      )}
    </div>
  );
};
