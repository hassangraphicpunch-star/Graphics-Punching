import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ_ITEMS } from '../data/content';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-zinc-50 text-zinc-900 border-t border-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="h-[2px] w-6 bg-[#FFC400]" />
            <span className="text-[#b88c00] font-extrabold text-xs sm:text-sm tracking-widest uppercase">
              GOT QUESTIONS?
            </span>
            <span className="h-[2px] w-6 bg-[#FFC400]" />
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-[#050505]">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="mt-2 text-zinc-600 text-xs sm:text-sm">
            Everything you need to know about vector prep, digitizing formats, minimums, and shipping.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-zinc-200 overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-zinc-900 hover:text-[#b88c00] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FFC400]/20 text-[#b88c00] text-xs flex items-center justify-center flex-shrink-0">
                      Q
                    </span>
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${
                      isOpen ? 'transform rotate-180 text-[#b88c00]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 border-t border-zinc-100 leading-relaxed animate-fadeIn">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
