import React from 'react';
import { CheckCircle2, ShieldCheck, Sparkles, Zap, Award, Factory, ArrowRight, Cpu, Layers, Palette, Clock, Facebook, ExternalLink } from 'lucide-react';
import { useWebsiteSettings } from '../context/AdminSettingsContext';

interface AboutSectionProps {
  onOpenQuoteModal: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenQuoteModal }) => {
  const { settings } = useWebsiteSettings();

  return (
    <section id="about" className="py-20 sm:py-24 bg-[#0a0a0a] text-white border-t border-zinc-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Factory & Craftsmanship Engineering Matrix */}
          <div className="lg:col-span-6 relative">
            <div className="bg-zinc-950 rounded-2xl p-6 sm:p-8 border border-zinc-800 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center font-display font-black text-xl border border-[#FFC400]/30">
                    GP
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-white uppercase">Industrial Precision Facility</h3>
                    <p className="text-xs text-zinc-400">Tajima Multi-Head &amp; M&amp;R Automatic Presses</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#FFC400] bg-[#FFC400]/10 px-3 py-1 rounded border border-[#FFC400]/30">
                  EST. 2015
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800/80">
                  <div className="flex items-center gap-2 text-[#FFC400] mb-1">
                    <Factory className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Screen Press Floor</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    M&amp;R Automatic 8-color carousels with precise micro-registration for soft-hand water-based &amp; plastisol inks.
                  </p>
                </div>

                <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800/80">
                  <div className="flex items-center gap-2 text-[#FFC400] mb-1">
                    <Cpu className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Tajima Digitizing</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Calibrated underlay density, pull-push compensation, and knot-free jump stitching for all headwear and apparel.
                  </p>
                </div>

                <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800/80">
                  <div className="flex items-center gap-2 text-[#FFC400] mb-1">
                    <Layers className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Vector Redraws</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Bézier curve mastery in Adobe Illustrator with exact Pantone PMS color formulas and clean closed outlines.
                  </p>
                </div>

                <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800/80">
                  <div className="flex items-center gap-2 text-[#FFC400] mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Express Output</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Dedicated shift digitizers guaranteeing 4–12 hour delivery with free revisions and machine sewout proofing.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-black/60 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Production Standards:</span>
                <span className="text-[#FFC400] font-bold">100% Machine Verified Before Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right Column: About Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC400]/10 text-[#FFC400] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ABOUT GRAPHICS PUNCHING</span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-tight">
              MASTER APPAREL PRINTING &amp; <br />
              <span className="text-[#FFC400]">PRECISION DIGITIZING ARTWORK</span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
              At <strong>GRAPHICS PUNCHING</strong>, we combine years of garment printing expertise with advanced <strong>embroidery digitizing and vector separation technology</strong>. From custom embroidered caps to professionally screen-printed apparel, we deliver <strong>high-quality, retail-ready garments</strong> designed to stand out. Our attention to detail, precision, and commitment to quality ensure every project meets professional industry standards.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-start gap-2.5 bg-zinc-900/60 p-3 rounded-lg border border-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-[#FFC400] flex-shrink-0 mt-0.5" />
                <span className="text-xs text-zinc-200 font-medium">Exact PMS color mixing &amp; water-based soft hand prints</span>
              </div>

              <div className="flex items-start gap-2.5 bg-zinc-900/60 p-3 rounded-lg border border-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-[#FFC400] flex-shrink-0 mt-0.5" />
                <span className="text-xs text-zinc-200 font-medium">Flawless 3D puff embroidery with calibrated thread tension</span>
              </div>

              <div className="flex items-start gap-2.5 bg-zinc-900/60 p-3 rounded-lg border border-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-[#FFC400] flex-shrink-0 mt-0.5" />
                <span className="text-xs text-zinc-200 font-medium">Rapid 4-to-12 hour vector conversion &amp; digitizing proofs</span>
              </div>

              <div className="flex items-start gap-2.5 bg-zinc-900/60 p-3 rounded-lg border border-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-[#FFC400] flex-shrink-0 mt-0.5" />
                <span className="text-xs text-zinc-200 font-medium">Direct blank garment wholesale access with top brand mills</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenQuoteModal}
                className="bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase tracking-wider px-7 py-3.5 rounded flex items-center gap-2 shadow-[0_4px_14px_rgba(255,196,0,0.3)] transition-all cursor-pointer group"
              >
                <span>Partner With Graphics Punching</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href={settings.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="bg-zinc-900 hover:bg-zinc-800 text-blue-400 border border-zinc-800 hover:border-blue-500/40 font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded flex items-center gap-2 transition-all cursor-pointer group"
              >
                <Facebook className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                <span>Facebook Page</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

