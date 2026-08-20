import React from 'react';
import { ProcessSection } from '../components/ProcessSection';
import { 
  Sparkles, CheckCircle2, Cpu, FileCode2, ArrowRight, ShieldCheck, 
  Layers, Zap, Clock 
} from 'lucide-react';

interface HowItWorksPageProps {
  onOpenQuoteModal: () => void;
  onNavigate: (page: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onOpenQuoteModal, onNavigate }) => {
  return (
    <div className="animate-fadeIn">
      {/* Page Header */}
      <div className="bg-[#050505] text-white py-14 sm:py-18 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFC400]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/25 text-[#FFC400] text-xs font-black tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PRECISION PRODUCTION PIPELINE</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white">
            HOW <span className="text-[#FFC400]">IT WORKS</span>
          </h1>

          <p className="mt-4 text-zinc-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            A frictionless 4-step workflow engineered for rapid vector separation and machine-calibrated digitizing with zero press downtime.
          </p>
        </div>
      </div>

      {/* Main 4 Step Component */}
      <ProcessSection />

      {/* Deep Dive Technical Standards & Machine Calibration */}
      <section className="py-16 sm:py-20 bg-[#09090b] text-white border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-white">
              ENGINEERED FOR <span className="text-[#FFC400]">COMMERCIAL MACHINES</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-2">
              We calibrate every digital file to meet rigorous industrial production tolerances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-zinc-950 p-7 rounded-2xl border border-zinc-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-display font-black text-xl uppercase text-white">
                Multi-Head Machine Compatibility
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tested and verified for Tajima, Barudan, Brother, SWF, Melco, Happy, Ricoma, and ZSK multi-head commercial embroidery machines.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FFC400]" />
                  <span>Optimized trims to reduce manual trimming labor</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FFC400]" />
                  <span>Automatic tie-ins and tie-offs for secure stitches</span>
                </li>
              </ul>
            </div>

            <div className="bg-zinc-950 p-7 rounded-2xl border border-zinc-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-display font-black text-xl uppercase text-white">
                Push-Pull &amp; Underlay Calibration
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Every fabric responds differently. We program custom underlays (Tatami, Edge Run, Center Walk) based on your garment substrate (piqué polos, caps, fleece, or nylon).
              </p>
              <ul className="space-y-2 pt-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FFC400]" />
                  <span>Fabric-specific density compensation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FFC400]" />
                  <span>3D Foam / Puff calibration with capping stitches</span>
                </li>
              </ul>
            </div>

            <div className="bg-zinc-950 p-7 rounded-2xl border border-zinc-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center">
                <FileCode2 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-black text-xl uppercase text-white">
                Screen Print Color Separations
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Spot color separations with registration marks, chokes, spreads, and halftone dot angles calibrated for automated and manual screen printing presses.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FFC400]" />
                  <span>Underbase white channel generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FFC400]" />
                  <span>Simulated process &amp; CMYK halftones (45–55 LPI)</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="mt-14 text-center">
            <button
              onClick={onOpenQuoteModal}
              className="bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Submit Your Artwork Today</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>
    </div>
  );
};
