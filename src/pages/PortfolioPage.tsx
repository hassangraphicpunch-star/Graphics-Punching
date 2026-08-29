import React from 'react';
import { PortfolioSection } from '../components/PortfolioSection';
import { Sparkles, Star, ShieldCheck, ArrowRight } from 'lucide-react';

interface PortfolioPageProps {
  onOpenQuoteModalWithItem?: (itemTitle: string) => void;
  onNavigate: (page: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onOpenQuoteModalWithItem, onNavigate }) => {
  return (
    <div className="animate-fadeIn">
      {/* Page Hero Header */}
      <div className="bg-[#050505] text-white py-14 sm:py-18 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFC400]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/25 text-[#FFC400] text-xs font-black tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>REAL PRODUCTION WORK &amp; SAMPLES</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white">
            OUR <span className="text-[#FFC400]">COMPLETE PORTFOLIO</span>
          </h1>

          <p className="mt-4 text-zinc-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Browse our latest commercial screen printing, embroidery digitizing, vector artwork, and custom apparel projects. Click any project for full-size inspection and technical specifications.
          </p>

          {/* Quick Dedicated Category Navigation */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('vector-files')}
              className="bg-zinc-900/90 hover:bg-[#FFC400] text-zinc-200 hover:text-black border border-zinc-800 hover:border-[#FFC400] text-xs font-black uppercase px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow"
            >
              <span>Vector Files Only</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('embroidery-files')}
              className="bg-zinc-900/90 hover:bg-[#FFC400] text-zinc-200 hover:text-black border border-zinc-800 hover:border-[#FFC400] text-xs font-black uppercase px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow"
            >
              <span>Embroidery Files Only</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('screen-printing-files')}
              className="bg-zinc-900/90 hover:bg-[#FFC400] text-zinc-200 hover:text-black border border-zinc-800 hover:border-[#FFC400] text-xs font-black uppercase px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow"
            >
              <span>Screen Printing Files Only</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Portfolio Grid & Lightbox */}
      <PortfolioSection onOpenQuoteModalWithItem={onOpenQuoteModalWithItem} />

      {/* Bottom Conversion Prompt */}
      <section className="bg-[#0c0c0e] py-14 border-t border-zinc-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="font-display font-black text-2xl sm:text-3xl uppercase">
            Ready to Bring Your Design to Life?
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
            Upload your artwork for a guaranteed quote within 1 hour. We deliver production-ready DST embroidery and AI vector files with free revisions.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('contact')}
              className="bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Get a Free Quote Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
