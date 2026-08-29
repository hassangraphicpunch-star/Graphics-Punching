import React from 'react';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { Sparkles, Star, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';

interface TestimonialsPageProps {
  onOpenQuoteModal: () => void;
  onNavigate: (page: string) => void;
}

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({ onOpenQuoteModal, onNavigate }) => {
  return (
    <div className="animate-fadeIn">
      {/* Page Header */}
      <div className="bg-[#050505] text-white py-14 sm:py-18 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFC400]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/25 text-[#FFC400] text-xs font-black tracking-widest uppercase mb-3">
            <Star className="w-3.5 h-3.5 fill-[#FFC400]" />
            <span>VERIFIED CLIENT FEEDBACK</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white">
            CLIENT <span className="text-[#FFC400]">TESTIMONIALS</span>
          </h1>

          <p className="mt-4 text-zinc-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Discover why commercial screen printers, contract embroidery shops, and streetwear brands choose Graphics Punching as their daily digitizing &amp; artwork partner.
          </p>
        </div>
      </div>

      {/* Main Testimonials Section */}
      <TestimonialsSection />

      {/* Customer Trust Guarantee Strip */}
      <section className="py-16 bg-[#09090b] text-white border-t border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex p-3 rounded-full bg-[#FFC400]/10 text-[#FFC400] mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h2 className="font-display font-black text-3xl uppercase text-white">
            100% Quality &amp; Machine Sewout Guarantee
          </h2>

          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            If your machine experiences looping, excessive trims, or push-pull distortion on our digitized stitch files, we will revise the file immediately at zero additional cost until it runs clean.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenQuoteModal}
              className="bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Start Your First Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('portfolio')}
              className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-bold text-xs uppercase px-7 py-4 rounded-xl transition-colors cursor-pointer"
            >
              View Production Samples
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
