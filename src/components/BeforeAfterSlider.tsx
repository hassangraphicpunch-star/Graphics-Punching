import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Sparkles, MoveHorizontal, CheckCircle2, ZoomIn, Layers, Zap } from 'lucide-react';
import { WatermarkOverlay } from './WatermarkOverlay';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title: string;
  subtitle?: string;
  specs?: string[];
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
  onOpenQuote?: () => void;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Original Low-Res / Artwork',
  afterLabel = 'Production Vector / Embroidery Sewout',
  title,
  subtitle,
  specs = [],
  aspectRatio = 'square',
  onOpenQuote,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const position = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPosition(position);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleMove(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, handleMove]);

  return (
    <div className="w-full bg-[#0a0a0c] rounded-2xl sm:rounded-3xl border border-zinc-800 p-4 sm:p-6 lg:p-8 shadow-2xl">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/25 text-[#FFC400] text-[10px] sm:text-xs font-extrabold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3 h-3" />
            <span>INTERACTIVE COMPARISON</span>
          </div>
          <h3 className="font-display font-black text-xl sm:text-2xl uppercase text-white tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Quick percentage jump buttons for accessibility & mobile taps */}
        <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSliderPosition(0)}
            aria-label="View 100% Before Artwork"
            className={`px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase transition-all cursor-pointer ${
              sliderPosition <= 5 ? 'bg-[#FFC400] text-black shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Before Only
          </button>
          <button
            type="button"
            onClick={() => setSliderPosition(50)}
            aria-label="View 50/50 Split View"
            className={`px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase transition-all cursor-pointer ${
              sliderPosition > 40 && sliderPosition < 60 ? 'bg-[#FFC400] text-black shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            50/50 Split
          </button>
          <button
            type="button"
            onClick={() => setSliderPosition(100)}
            aria-label="View 100% After Artwork"
            className={`px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase transition-all cursor-pointer ${
              sliderPosition >= 95 ? 'bg-[#FFC400] text-black shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            After Only
          </button>
        </div>
      </div>

      {/* Interactive Slider Stage */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] max-h-[520px] rounded-xl sm:rounded-2xl overflow-hidden bg-black select-none cursor-ew-resize border border-zinc-800 touch-none shadow-inner"
      >
        {/* "After" Image (Full Canvas Background Layer) */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center p-3 sm:p-6 bg-zinc-950">
          <img
            src={afterImage}
            alt="After - Vector or Digitized Sewout"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
          />
          <WatermarkOverlay size="md" />
          {/* Label Top Right */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 pointer-events-none">
            <span className="bg-[#FFC400] text-black font-black text-[10px] sm:text-xs uppercase tracking-wider px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow-lg">
              {afterLabel}
            </span>
          </div>
        </div>

        {/* "Before" Image (Clipped Layer on Left) */}
        <div
          className="absolute inset-0 w-full h-full flex items-center justify-center p-3 sm:p-6 bg-zinc-900 border-r border-[#FFC400]/80 overflow-hidden"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
        >
          <img
            src={beforeImage}
            alt="Before - Original Artwork"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain pointer-events-none filter blur-[0.3px] contrast-105"
          />
          <WatermarkOverlay size="md" />
          {/* Label Top Left */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 pointer-events-none">
            <span className="bg-black/90 text-zinc-200 border border-zinc-700 font-bold text-[10px] sm:text-xs uppercase tracking-wider px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow-lg">
              {beforeLabel}
            </span>
          </div>
        </div>

        {/* Divider Handle Line */}
        <div
          className="absolute top-0 bottom-0 z-20 pointer-events-none flex items-center justify-center -translate-x-1/2"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Vertical gold line */}
          <div className="w-[3px] h-full bg-[#FFC400] shadow-[0_0_12px_rgba(255,196,0,0.8)]" />

          {/* Center Grab Handle Button */}
          <div className="absolute top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FFC400] text-black border-2 border-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.8)] transition-transform group-hover:scale-110">
            <MoveHorizontal className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>
        </div>

        {/* Mobile touch hint pill */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-zinc-700 text-[10px] text-zinc-300 sm:hidden flex items-center gap-1.5">
          <MoveHorizontal className="w-3 h-3 text-[#FFC400]" />
          <span>Drag slider left / right</span>
        </div>
      </div>

      {/* Footer Specs & CTA */}
      <div className="mt-5 sm:mt-6 pt-4 border-t border-zinc-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {specs.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {specs.map((spec, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-900/80 px-2.5 py-1 rounded-lg border border-zinc-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC400] shrink-0" />
                <span>{spec}</span>
              </div>
            ))}
          </div>
        )}

        {onOpenQuote && (
          <button
            type="button"
            onClick={onOpenQuote}
            className="bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg self-stretch sm:self-auto"
          >
            <span>Order Redraw / Digitizing</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
