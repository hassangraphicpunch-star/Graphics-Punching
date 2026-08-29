import React from 'react';
import { Award, Clock, Users, Tag, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { WHY_CHOOSE_US } from '../data/content';

export const WhyChooseUsSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award':
        return (
          <div className="w-12 h-12 rounded-full border-2 border-[#FFC400] flex items-center justify-center text-[#FFC400] group-hover:bg-[#FFC400] group-hover:text-black transition-all">
            <Award className="w-6 h-6 stroke-[1.8]" />
          </div>
        );
      case 'Clock':
        return (
          <div className="w-12 h-12 rounded-full border-2 border-[#FFC400] flex items-center justify-center text-[#FFC400] group-hover:bg-[#FFC400] group-hover:text-black transition-all">
            <Clock className="w-6 h-6 stroke-[1.8]" />
          </div>
        );
      case 'Users':
        return (
          <div className="w-12 h-12 rounded-full border-2 border-[#FFC400] flex items-center justify-center text-[#FFC400] group-hover:bg-[#FFC400] group-hover:text-black transition-all">
            <Users className="w-6 h-6 stroke-[1.8]" />
          </div>
        );
      case 'Tag':
      default:
        return (
          <div className="w-12 h-12 rounded-full border-2 border-[#FFC400] flex items-center justify-center text-[#FFC400] group-hover:bg-[#FFC400] group-hover:text-black transition-all">
            <Tag className="w-6 h-6 stroke-[1.8]" />
          </div>
        );
    }
  };

  return (
    <section id="why-choose-us" className="bg-[#050505] text-white py-16 sm:py-20 border-y border-zinc-800 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#FFC400]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Heading Column */}
          <div className="lg:col-span-4 space-y-2 text-center lg:text-left">
            <p className="text-[#FFC400] font-extrabold text-xs sm:text-sm tracking-widest uppercase">
              WHY CHOOSE US
            </p>
            <h2 className="font-display font-black text-3xl sm:text-4xl xl:text-5xl uppercase tracking-tight text-white leading-[1.05]">
              QUALITY YOU CAN TRUST, <br />
              <span className="text-[#FFC400]">SERVICE YOU DESERVE!</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-normal pt-2">
              Serving apparel brands, distributors, print shops, and sports organizations nationwide with precision craftsmanship.
            </p>
          </div>

          {/* Right Features Column (4 Columns with subtle dividers) */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-zinc-800">
              {WHY_CHOOSE_US.map((item, idx) => (
                <div
                  key={item.id}
                  className="lg:px-5 flex flex-col items-center text-center group cursor-pointer"
                >
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {getIcon(item.icon)}
                  </div>
                  
                  <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-tight mb-1 group-hover:text-[#FFC400] transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                    {item.subtitle}
                  </p>

                  <div className="mt-4 pt-3 border-t border-zinc-800/80 w-full flex items-center justify-center gap-2">
                    <span className="text-xs font-black text-[#FFC400]">{item.stat}</span>
                    <span className="text-[10px] text-zinc-500 uppercase">{item.statLabel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
