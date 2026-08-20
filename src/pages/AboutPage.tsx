import React from 'react';
import { AboutSection } from '../components/AboutSection';
import { WhyChooseUsSection } from '../components/WhyChooseUsSection';
import { Sparkles, Award, Factory, Users, ShieldCheck, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onOpenQuoteModal: () => void;
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenQuoteModal, onNavigate }) => {
  return (
    <div className="animate-fadeIn">
      {/* Page Header */}
      <div className="bg-[#050505] text-white py-14 sm:py-18 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFC400]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/25 text-[#FFC400] text-xs font-black tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OUR HERITAGE &amp; CRAFTSMANSHIP</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white">
            ABOUT <span className="text-[#FFC400]">GRAPHICS PUNCHING</span>
          </h1>

          <p className="mt-4 text-zinc-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Delivering retail-grade custom apparel printing, precision embroidery digitizing, and scale-independent vector separations since 2015.
          </p>
        </div>
      </div>

      {/* Main About Section */}
      <AboutSection onOpenQuoteModal={onOpenQuoteModal} />

      {/* Why Choose Us & Trust Metrics */}
      <WhyChooseUsSection />

      {/* Factory Standards Banner */}
      <section className="py-16 bg-[#0c0c0e] text-white border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center">
                <Factory className="w-5 h-5" />
              </div>
              <h3 className="font-display font-black text-lg uppercase text-white">
                Industrial Capacity
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Equipped with automatic M&amp;R 8-color screen printing carousels and Tajima commercial multi-head embroidery machines for high-volume contract runs.
              </p>
            </div>

            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-display font-black text-lg uppercase text-white">
                Master Punching &amp; Digitizing
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Every stitch path is manually placed by master digitizers with over 10+ years of factory-floor experience to eliminate birdnesting and thread breaks.
              </p>
            </div>

            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-display font-black text-lg uppercase text-white">
                Wholesale Partner Network
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Trusted by independent decorators, streetwear labels, promotional product distributors, and corporate apparel suppliers across North America.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
