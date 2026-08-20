import React from 'react';
import { FAQSection } from '../components/FAQSection';
import { Sparkles, HelpCircle, Mail, Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { CONTACT_INFO } from '../data/content';

interface FAQPageProps {
  onOpenQuoteModal: () => void;
  onNavigate: (page: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onOpenQuoteModal, onNavigate }) => {
  return (
    <div className="animate-fadeIn">
      {/* Page Header */}
      <div className="bg-[#050505] text-white py-14 sm:py-18 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFC400]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/25 text-[#FFC400] text-xs font-black tracking-widest uppercase mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>HELP &amp; FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white">
            FREQUENTLY <span className="text-[#FFC400]">ASKED QUESTIONS</span>
          </h1>

          <p className="mt-4 text-zinc-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about turnaround times, file deliverables, revisions, embroidery machine compatibility, and wholesale pricing.
          </p>
        </div>
      </div>

      {/* Main FAQ Component */}
      <FAQSection />

      {/* Still Have Questions Contact Strip */}
      <section className="py-16 bg-[#0c0c0e] text-white border-t border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-display font-black text-2xl sm:text-3xl uppercase">
            Still Have a Question We Haven’t Answered?
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
            Our digitizing technicians and vector specialists are standing by to review your artwork and answer technical inquiries.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={`mailto:${CONTACT_INFO.email}?subject=Question%20about%20Graphics%20Punching`}
              className="bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Email Support Team</span>
            </a>

            <button
              onClick={() => onNavigate('contact')}
              className="border border-zinc-700 hover:border-zinc-500 text-white font-bold text-xs uppercase px-6 py-3.5 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-[#FFC400]" />
              <span>Open Contact Form</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
