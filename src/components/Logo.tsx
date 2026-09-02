import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'nav' | 'footer';
  variant?: 'light' | 'dark' | 'footer' | 'badge';
  showSubtext?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'dark',
  showSubtext = true,
  className = '' 
}) => {
  if (variant === 'badge') {
    return (
      <div className={`flex flex-col items-center text-center group cursor-pointer ${className}`} id="gp-brand-badge">
        <div className="relative rounded-full p-1 bg-gradient-to-b from-[#FFC400] via-[#d4a000] to-zinc-900 shadow-[0_0_30px_rgba(255,196,0,0.3)] group-hover:shadow-[0_0_40px_rgba(255,196,0,0.5)] transition-all duration-300">
          <div className="rounded-full bg-[#0A0A0A] w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center p-2 border border-zinc-800 text-center overflow-hidden">
            <img 
              src="/logo.png" 
              alt="Graphics Punching Official Logo" 
              className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        <div className="mt-3 flex flex-col items-center">
          <span className="font-display font-black text-lg tracking-wider text-white uppercase">
            GRAPHICS <span className="text-[#FFC400]">PUNCHING</span>
          </span>
          <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
            Vector Art • Embroidery Digitizing • Screen Printing
          </span>
        </div>
      </div>
    );
  }

  const getDimensions = () => {
    switch (size) {
      case 'footer':
        return { 
          iconSize: 'w-10 h-10 sm:w-11 sm:h-11', 
          titleClass: 'text-base sm:text-lg lg:text-xl tracking-tight', 
          subtitleClass: 'text-[8px] sm:text-[8.5px] tracking-wider',
          gap: 'gap-3'
        };
      case 'nav':
        return { 
          iconSize: 'w-9 h-9 sm:w-10 sm:h-10', 
          titleClass: 'text-base sm:text-lg tracking-tight', 
          subtitleClass: 'text-[7.5px] sm:text-[8.5px] tracking-wider',
          gap: 'gap-2.5 sm:gap-3'
        };
      case 'sm':
        return { 
          iconSize: 'w-8 h-8 sm:w-9 sm:h-9', 
          titleClass: 'text-base sm:text-lg', 
          subtitleClass: 'text-[8px] sm:text-[9px]',
          gap: 'gap-2.5'
        };
      case 'lg':
        return { 
          iconSize: 'w-12 h-12 sm:w-14 sm:h-14', 
          titleClass: 'text-xl sm:text-2xl tracking-tight', 
          subtitleClass: 'text-[9px] sm:text-[10px]',
          gap: 'gap-3.5'
        };
      case 'xl':
        return { 
          iconSize: 'w-16 h-16 sm:w-20 sm:h-20', 
          titleClass: 'text-3xl sm:text-4xl tracking-tight', 
          subtitleClass: 'text-xs',
          gap: 'gap-4'
        };
      case 'full':
        return {
          iconSize: 'w-14 h-14 sm:w-16 sm:h-16',
          titleClass: 'text-2xl tracking-tight',
          subtitleClass: 'text-[10px]',
          gap: 'gap-3.5'
        };
      case 'md':
      default:
        return { 
          iconSize: 'w-9 h-9 sm:w-10 sm:h-10', 
          titleClass: 'text-base sm:text-lg tracking-tight', 
          subtitleClass: 'text-[8px] sm:text-[8.5px] tracking-wider',
          gap: 'gap-2.5 sm:gap-3'
        };
    }
  };

  const dims = getDimensions();

  return (
    <div className={`inline-flex items-center ${dims.gap} shrink-0 min-w-max select-none cursor-pointer group ${className}`} id="gp-brand-logo">
      {/* GP Icon Shield/Emblem with Official Logo Art */}
      <div className="relative flex-shrink-0">
        <div className="absolute -inset-1 bg-gradient-to-tr from-[#FFC400]/40 to-transparent rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className={`${dims.iconSize} relative rounded-full bg-gradient-to-b from-[#1c1a12] to-[#0a0a0a] border border-[#FFC400]/80 p-0.5 shadow-[0_2px_12px_rgba(255,196,0,0.25)] overflow-hidden transition-transform duration-300 group-hover:scale-105 flex items-center justify-center`}>
          <img 
            src="/logo.png" 
            alt="Graphics Punching Logo" 
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              // Fallback to favicon.png or text GP
              const target = e.currentTarget;
              if (target.src.includes('/logo.png')) {
                target.src = '/favicon.png';
              } else {
                target.style.display = 'none';
                if (target.nextElementSibling) {
                  (target.nextElementSibling as HTMLElement).style.display = 'flex';
                }
              }
            }}
          />
          <div className="w-full h-full rounded-full bg-[#0e0e10] border border-[#FFC400]/40 items-center justify-center hidden">
            <span className="font-display font-black text-[#FFC400] text-xs tracking-tighter">
              GP
            </span>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="flex flex-col justify-center leading-none shrink-0">
        <div className="flex items-baseline gap-1.5 whitespace-nowrap">
          <span className={`font-display font-black uppercase text-white ${dims.titleClass} tracking-wide transition-colors group-hover:text-zinc-100`}>
            GRAPHICS
          </span>
          <span className={`font-display font-black uppercase text-[#FFC400] ${dims.titleClass} tracking-wide drop-shadow-[0_2px_12px_rgba(255,196,0,0.35)]`}>
            PUNCHING
          </span>
        </div>
        
        {showSubtext && (
          <div className="flex items-center gap-1 mt-1 whitespace-nowrap">
            <span className={`font-sans font-bold uppercase text-zinc-300 ${dims.subtitleClass} flex items-center whitespace-nowrap`}>
              <span className="text-[#FFC400]">VECTOR</span>
              <span className="text-zinc-500 mx-1">•</span>
              <span className="text-white">EMBROIDERY</span>
              <span className="text-zinc-500 mx-1">•</span>
              <span className="text-[#FFC400]">SCREEN PRINT</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};


