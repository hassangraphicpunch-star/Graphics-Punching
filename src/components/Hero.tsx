import React from 'react';
import { ArrowRight, Star, Clock, ShieldCheck, Tag, Sparkles, CheckCircle2, Flame, Cpu, Layers, Palette, Zap } from 'lucide-react';

interface HeroProps {
  onOpenQuoteModal: () => void;
  onScrollToPortfolio: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuoteModal, onScrollToPortfolio }) => {
  return (
    <section
      id="home"
      className="relative min-h-[560px] sm:min-h-[620px] lg:min-h-[680px] bg-[#050505] overflow-hidden flex items-center border-b border-zinc-800/80"
    >
      {/* Background Multi-layer Gradient & Precision Industrial Technical Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        {/* Subtle geometric dot grid for precision engineering feel */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #FFC400 1.2px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />
        {/* Dark radial and linear gradients for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/95 sm:via-[#050505]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#FFC400]/15 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-zinc-800/20 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Hero Copy & Calls-to-Action */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Small yellow uppercase eyebrow */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:py-1.5 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/30 text-[#FFC400] text-[11px] sm:text-xs md:text-sm font-extrabold uppercase tracking-widest">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-[#FFC400]" />
              <span>PREMIUM QUALITY. BOLD IMPACT.</span>
            </div>

            {/* Massive Bold Heading */}
            <div className="space-y-1">
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white uppercase leading-[0.94] break-words">
                WE PRINT <br />
                <span className="text-[#FFC400] drop-shadow-[0_4px_24px_rgba(255,196,0,0.35)]">
                  YOUR IDEAS
                </span>
              </h1>
            </div>

            {/* Supporting Text */}
            <p className="text-zinc-300 text-sm sm:text-base md:text-lg font-normal max-w-2xl leading-relaxed">
              Professional Screen Printing, Embroidery Digitizing &amp; Vector Artwork Services that make your brand stand out with unmatched color depth, durability, and stitch-perfect precision.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
              <button
                onClick={onOpenQuoteModal}
                id="hero-get-quote-btn"
                className="w-full sm:w-auto bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs sm:text-sm md:text-base tracking-wider uppercase px-6 sm:px-8 py-3.5 sm:py-4 rounded-sm flex items-center justify-center gap-3 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_24px_rgba(255,196,0,0.4)] cursor-pointer min-h-[48px] group"
              >
                <span>GET A FREE QUOTE</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1.5" />
              </button>

              <button
                onClick={onScrollToPortfolio}
                id="hero-view-work-btn"
                className="w-full sm:w-auto bg-transparent hover:bg-zinc-900/90 text-white hover:text-[#FFC400] border border-zinc-600 hover:border-[#FFC400] font-bold text-xs sm:text-sm md:text-base tracking-wider uppercase px-6 sm:px-8 py-3.5 sm:py-4 rounded-sm flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer min-h-[48px] group"
              >
                <span>EXPLORE TECHNICAL SPECS</span>
                <ArrowRight className="w-4 h-4 text-[#FFC400] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* 4 Trust Indicators */}
            <div className="pt-6 sm:pt-8 border-t border-zinc-800/80">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
                {/* 1. PREMIUM QUALITY */}
                <div className="flex items-center gap-2.5 sm:gap-3 group">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-[#FFC400] group-hover:border-[#FFC400] group-hover:scale-105 transition-all shrink-0">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-display font-bold text-xs sm:text-sm tracking-wide text-white uppercase group-hover:text-[#FFC400] transition-colors truncate">
                      PREMIUM
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-zinc-400 font-medium truncate">QUALITY</p>
                  </div>
                </div>

                {/* 2. FAST TURNAROUND */}
                <div className="flex items-center gap-2.5 sm:gap-3 group">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-[#FFC400] group-hover:border-[#FFC400] group-hover:scale-105 transition-all shrink-0">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-display font-bold text-xs sm:text-sm tracking-wide text-white uppercase group-hover:text-[#FFC400] transition-colors truncate">
                      FAST
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-zinc-400 font-medium truncate">TURNAROUND</p>
                  </div>
                </div>

                {/* 3. NO SETUP FEES */}
                <div className="flex items-center gap-2.5 sm:gap-3 group">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-[#FFC400] group-hover:border-[#FFC400] group-hover:scale-105 transition-all shrink-0">
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-display font-bold text-xs sm:text-sm tracking-wide text-white uppercase group-hover:text-[#FFC400] transition-colors truncate">
                      NO SETUP
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-zinc-400 font-medium truncate">FEES</p>
                  </div>
                </div>

                {/* 4. 100% SATISFACTION */}
                <div className="flex items-center gap-2.5 sm:gap-3 group">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-[#FFC400] group-hover:border-[#FFC400] group-hover:scale-105 transition-all shrink-0">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-display font-bold text-xs sm:text-sm tracking-wide text-white uppercase group-hover:text-[#FFC400] transition-colors truncate">
                      100%
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-zinc-400 font-medium truncate">SATISFACTION</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Production & Machine Calibration Board */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-[#FFC400]/20 to-zinc-800 rounded-3xl blur-xl pointer-events-none" />
              
              <div className="relative bg-zinc-950/95 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5">
                {/* Header Status Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      LIVE PRODUCTION DESK
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#FFC400] bg-[#FFC400]/10 border border-[#FFC400]/30 px-2.5 py-1 rounded-full uppercase">
                    EST. 2015
                  </span>
                </div>

                {/* Core Machine & Output Matrices */}
                <div className="space-y-3 text-xs">
                  <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center shrink-0">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-display font-bold text-white uppercase text-xs block">
                          Embroidery Machine Formats
                        </span>
                        <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                          DST • PES • EMB • EXP • JEF • HUS
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Zero Jam
                    </span>
                  </div>

                  <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center shrink-0">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-display font-bold text-white uppercase text-xs block">
                          Vector Master Output
                        </span>
                        <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                          AI • EPS • SVG • PDF • CDR • 300DPI PNG
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#FFC400] bg-[#FFC400]/10 px-2 py-0.5 rounded border border-[#FFC400]/20">
                      Infinite Scale
                    </span>
                  </div>

                  <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center shrink-0">
                        <Palette className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-display font-bold text-white uppercase text-xs block">
                          Screen Print Separation
                        </span>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Spot PMS • Simulated Process • Halftone Underbase
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-white bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                      Press Ready
                    </span>
                  </div>
                </div>

                {/* Quick Stats Strip */}
                <div className="grid grid-cols-3 gap-2.5 pt-2 text-center text-xs">
                  <div className="bg-black/80 p-2.5 rounded-xl border border-zinc-800/90">
                    <p className="font-display font-black text-lg text-[#FFC400]">4-12h</p>
                    <p className="text-[10px] text-zinc-400 font-medium uppercase">Turnaround</p>
                  </div>
                  <div className="bg-black/80 p-2.5 rounded-xl border border-zinc-800/90">
                    <p className="font-display font-black text-lg text-white">99.98%</p>
                    <p className="text-[10px] text-zinc-400 font-medium uppercase">Accuracy</p>
                  </div>
                  <div className="bg-black/80 p-2.5 rounded-xl border border-zinc-800/90">
                    <p className="font-display font-black text-lg text-[#FFC400]">FREE</p>
                    <p className="text-[10px] text-zinc-400 font-medium uppercase">Revisions</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onOpenQuoteModal}
                    className="w-full bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <span>Request Free Artwork Evaluation</span>
                    <Zap className="w-3.5 h-3.5 fill-black" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

