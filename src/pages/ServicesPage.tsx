import React from 'react';
import { ServicesSection } from '../components/ServicesSection';
import { 
  Sparkles, Layers, ShieldCheck, Zap, FileCode2, CheckCircle2, 
  Cpu, ArrowRight, Clock, HelpCircle 
} from 'lucide-react';

interface ServicesPageProps {
  onOpenQuoteModal: (serviceId?: string, tierId?: string, itemTitle?: string) => void;
  onNavigate: (page: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onOpenQuoteModal, onNavigate }) => {
  return (
    <div className="animate-fadeIn overflow-hidden">
      {/* Dedicated Page Hero Header */}
      <div className="bg-[#050505] text-white py-12 sm:py-16 lg:py-20 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFC400]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/25 text-[#FFC400] text-xs font-black tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WHOLESALE DIGITAL ARTWORK &amp; DIGITIZING</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white">
            OUR <span className="text-[#FFC400]">SERVICES &amp; PACKAGES</span>
          </h1>

          <p className="mt-3 sm:mt-4 text-zinc-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            Standardized wholesale packages with guaranteed flat rates, 4–12 hour turnarounds, and production-ready machine calibration for screen printers and embroidery houses.
          </p>
        </div>
      </div>

      {/* Main Services Section Component */}
      <ServicesSection
        onSelectServiceForQuote={(serviceId, tierId, itemTitle) =>
          onOpenQuoteModal(serviceId, tierId, itemTitle)
        }
      />

      {/* Production Format & Machine Compatibility Specification Strip */}
      <section className="py-14 sm:py-20 bg-[#0c0c0e] text-white border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
            
            {/* Vector Formats */}
            <div className="bg-zinc-950 p-6 sm:p-7 rounded-2xl border border-zinc-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center shrink-0">
                  <FileCode2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-base sm:text-lg uppercase text-white">
                    Vector Artwork Output Deliverables
                  </h3>
                  <p className="text-xs text-zinc-400">Scale-independent print files for screen printing &amp; vinyl</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-2">
                {[
                  { ext: '.AI', desc: 'Adobe Illustrator Vector Master' },
                  { ext: '.EPS', desc: 'Encapsulated PostScript universal' },
                  { ext: '.SVG', desc: 'Scalable Vector Graphics' },
                  { ext: '.PDF', desc: 'High-Resolution Vector PDF' },
                  { ext: '.PNG', desc: '300 DPI Transparent Preview' },
                  { ext: '.CDR', desc: 'CorelDraw upon request' },
                ].map((fmt, i) => (
                  <div key={i} className="bg-zinc-900/80 p-2.5 sm:p-3 rounded-lg border border-zinc-800">
                    <span className="text-xs font-black text-[#FFC400] font-mono">{fmt.ext}</span>
                    <p className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5 leading-tight">{fmt.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Embroidery Formats */}
            <div className="bg-zinc-950 p-6 sm:p-7 rounded-2xl border border-zinc-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-base sm:text-lg uppercase text-white">
                    Embroidery Machine Stitch Formats
                  </h3>
                  <p className="text-xs text-zinc-400">Direct binary machine files tested for all major brands</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-2">
                {[
                  { ext: '.DST', desc: 'Tajima Commercial Standard' },
                  { ext: '.PES', desc: 'Brother / Babylock Format' },
                  { ext: '.EMB', desc: 'Wilcom Object Native Source' },
                  { ext: '.EXP', desc: 'Melco / Bernina Format' },
                  { ext: '.JEF', desc: 'Janome Machine Format' },
                  { ext: '.PDF', desc: 'Production Sewout Sheet' },
                ].map((fmt, i) => (
                  <div key={i} className="bg-zinc-900/80 p-2.5 sm:p-3 rounded-lg border border-zinc-800">
                    <span className="text-xs font-black text-[#FFC400] font-mono">{fmt.ext}</span>
                    <p className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5 leading-tight">{fmt.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Need a Custom Quote Banner */}
          <div className="mt-10 sm:mt-12 bg-gradient-to-r from-zinc-900 via-zinc-900 to-black p-6 sm:p-8 rounded-2xl border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="font-display font-black text-xl sm:text-2xl uppercase text-white">
                Have a Complex Artwork or High-Volume Bulk Order?
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm">
                Get custom contract pricing with dedicated batch account management and fast turnaround guarantees.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
              <button
                onClick={() => onOpenQuoteModal('vector-artwork', 'complex-vector')}
                className="bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer min-h-[44px] flex items-center justify-center text-center"
              >
                Request Custom Quote
              </button>
              <button
                onClick={() => onNavigate('pricing')}
                className="border border-zinc-700 hover:border-zinc-500 text-white font-bold text-xs uppercase px-5 py-3.5 rounded-xl transition-colors cursor-pointer min-h-[44px] flex items-center justify-center text-center"
              >
                View Rate Schedule
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
