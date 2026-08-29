import React from 'react';
import { MessageSquare, FileText, Shirt, Truck, ChevronRight, CheckCircle2 } from 'lucide-react';
import { PROCESS_STEPS } from '../data/content';

export const ProcessSection: React.FC = () => {
  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquare':
        return <MessageSquare className="w-9 h-9 stroke-[1.8] text-zinc-900" />;
      case 'FileText':
        return <FileText className="w-9 h-9 stroke-[1.8] text-zinc-900" />;
      case 'Shirt':
        return <Shirt className="w-9 h-9 stroke-[1.8] text-zinc-900" />;
      case 'Truck':
      default:
        return <Truck className="w-9 h-9 stroke-[1.8] text-zinc-900" />;
    }
  };

  return (
    <section id="how-it-works" className="py-20 sm:py-24 bg-[#F8F9FA] text-zinc-900 border-t border-zinc-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="h-[2px] w-6 bg-[#FFC400]" />
            <span className="text-[#b88c00] font-extrabold text-xs sm:text-sm tracking-widest uppercase">
              OUR PROCESS
            </span>
            <span className="h-[2px] w-6 bg-[#FFC400]" />
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-[#050505]">
            SIMPLE 4 STEPS
          </h2>
          <p className="mt-3 text-zinc-600 text-sm sm:text-base">
            From initial concept to packaged delivery — our streamlined pipeline guarantees speed, precision, and complete peace of mind.
          </p>
        </div>

        {/* 4 Steps Row with Connecting Chevron Arrows */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 relative items-start">
          {PROCESS_STEPS.map((step, idx) => (
            <div key={step.step} className="relative flex flex-col items-center text-center group px-3">
              
              {/* Icon Container */}
              <div className="relative mb-5">
                <div className="w-20 h-20 rounded-2xl bg-white border-2 border-zinc-200 group-hover:border-[#FFC400] flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 transform group-hover:-translate-y-1">
                  {getStepIcon(step.iconName)}
                </div>

                {/* Step Number Badge */}
                <div className="absolute -top-2 -right-2 bg-[#FFC400] text-black font-display font-black text-xs px-2 py-0.5 rounded-full shadow border border-black/10">
                  0{step.step}
                </div>
              </div>

              {/* Title & Description matching reference */}
              <h3 className="font-display font-black text-xl sm:text-2xl text-[#050505] uppercase tracking-tight mb-2 group-hover:text-[#b88c00] transition-colors">
                {step.step}. {step.title}
              </h3>
              
              <p className="text-xs sm:text-sm text-zinc-600 font-medium leading-relaxed max-w-xs">
                {step.description}
              </p>

              <div className="mt-3 text-[11px] text-zinc-500 bg-white/80 px-3 py-1.5 rounded-lg border border-zinc-200/80">
                {step.detail}
              </div>

              {/* Arrow divider for desktop (shown between steps) */}
              {idx < PROCESS_STEPS.length - 1 && (
                <div className="hidden lg:flex absolute top-10 -right-3 z-10 text-zinc-400">
                  <ChevronRight className="w-6 h-6 stroke-[2.5]" />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
