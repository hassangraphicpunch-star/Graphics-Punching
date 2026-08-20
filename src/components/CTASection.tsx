import React from 'react';
import { ArrowRight, PhoneCall, Sparkles, ShieldCheck } from 'lucide-react';
import { CONTACT_INFO } from '../data/content';

interface CTASectionProps {
  onOpenQuoteModal: () => void;
  onScrollToContact: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onOpenQuoteModal, onScrollToContact }) => {
  return (
    <section className="relative py-20 sm:py-24 bg-[#0a0a0a] text-white border-y border-zinc-800 overflow-hidden">
      {/* Technical Grid Background */}
      <div className="absolute inset-0 z-0 opacity-15">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #FFC400 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/30 text-[#FFC400] text-xs font-extrabold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>START YOUR ORDER TODAY</span>
        </div>

        <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white leading-tight max-w-3xl mx-auto">
          READY TO BRING YOUR DESIGN <br />
          <span className="text-[#FFC400]">TO LIFE?</span>
        </h2>

        <p className="text-zinc-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
          Get professional screen printing, embroidery and vector artwork services for your next project. Send us your files or ideas for a free digital proof and quote within minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onOpenQuoteModal}
            id="cta-get-free-quote-btn"
            className="w-full sm:w-auto bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase px-8 py-4 rounded-sm flex items-center justify-center gap-3 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-[0_8px_24px_rgba(255,196,0,0.35)] cursor-pointer group"
          >
            <span>GET A FREE QUOTE</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onScrollToContact}
            id="cta-contact-us-btn"
            className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white hover:text-[#FFC400] border border-zinc-700 font-bold text-xs sm:text-sm tracking-wider uppercase px-8 py-4 rounded-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-[#FFC400]" />
            <span>CONTACT US</span>
          </button>
        </div>

        {/* Small reassurance line */}
        <p className="text-xs text-zinc-500 pt-3 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#FFC400]" />
          <span>No credit card required for quote &bull; Free mockup proof with every estimate</span>
        </p>
      </div>
    </section>
  );
};
