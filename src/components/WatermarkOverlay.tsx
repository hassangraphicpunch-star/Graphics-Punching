import React from 'react';

interface WatermarkOverlayProps {
  /** Size scale of the watermark text: 'sm' | 'md' | 'lg' */
  size?: 'sm' | 'md' | 'lg';
  /** Watermark layout variant: 'diagonal' | 'center' | 'full' */
  variant?: 'diagonal' | 'center' | 'full';
  /** Alias for variant */
  position?: 'diagonal' | 'center' | 'full';
  /** Custom opacity level (0 to 1) */
  opacity?: number;
  /** Additional styling classes */
  className?: string;
  /** Custom text if desired */
  text?: string;
  /** Whether to show subtle repeating background grid */
  showGrid?: boolean;
}

export const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({
  size = 'md',
  variant,
  position = 'diagonal',
  opacity = 0.38,
  className = '',
  text = 'GRAPHICS PUNCHING',
  showGrid = true,
}) => {
  const activeVariant = variant || position;

  const sizeClasses = {
    sm: 'text-[11px] sm:text-xs tracking-[0.25em]',
    md: 'text-xs sm:text-sm md:text-base tracking-[0.28em]',
    lg: 'text-sm sm:text-lg md:text-2xl tracking-[0.32em]',
  }[size];

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none select-none z-10 overflow-hidden flex items-center justify-center ${className}`}
    >
      {/* 1. Subtle Repeating Diagonal Security Grid (Always present to cover all quadrants) */}
      {showGrid && (
        <div 
          className="absolute inset-0 opacity-[0.14] flex flex-col justify-around rotate-[-22deg] scale-125 pointer-events-none select-none"
        >
          <div className="flex justify-around whitespace-nowrap text-[9px] sm:text-[10px] font-black uppercase text-white tracking-[0.3em]">
            <span>{text}</span>
            <span>•</span>
            <span>{text}</span>
            <span>•</span>
            <span>{text}</span>
          </div>
          <div className="flex justify-around whitespace-nowrap text-[9px] sm:text-[10px] font-black uppercase text-white tracking-[0.3em]">
            <span>{text}</span>
            <span>•</span>
            <span>{text}</span>
            <span>•</span>
            <span>{text}</span>
          </div>
          <div className="flex justify-around whitespace-nowrap text-[9px] sm:text-[10px] font-black uppercase text-white tracking-[0.3em]">
            <span>{text}</span>
            <span>•</span>
            <span>{text}</span>
            <span>•</span>
            <span>{text}</span>
          </div>
        </div>
      )}

      {/* 2. Main High-Contrast Watermark Centerpiece */}
      <div
        style={{ opacity }}
        className={`relative z-10 transform transition-transform ${
          activeVariant === 'diagonal' ? '-rotate-[22deg]' : ''
        } flex flex-col items-center justify-center text-center px-3 py-1.5`}
      >
        <span
          className={`font-display font-black uppercase text-white whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] ${sizeClasses}`}
          style={{
            textShadow: '0 0 10px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.98), 0 0 3px #000',
            letterSpacing: '0.28em',
          }}
        >
          {text}
        </span>
        <span
          className="text-[8px] sm:text-[9.5px] font-black uppercase text-[#FFC400] tracking-[0.35em] mt-0.5"
          style={{
            textShadow: '0 0 8px rgba(0,0,0,0.98), 0 1px 3px #000',
          }}
        >
          SCREEN PRINT • EMBROIDERY • VECTOR
        </span>
      </div>
    </div>
  );
};


