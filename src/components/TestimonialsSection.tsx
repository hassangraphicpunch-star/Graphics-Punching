import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { TESTIMONIALS } from '../data/content';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 sm:py-24 bg-[#050505] text-white border-t border-zinc-800/80 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFC400]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[#FFC400] font-extrabold text-xs sm:text-sm tracking-widest uppercase mb-2">
            WHAT OUR CLIENTS SAY
          </p>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white">
            TESTIMONIALS
          </h2>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base">
            Real reviews from independent apparel decorators, streetwear brands, and corporate clients.
          </p>
        </div>

        {/* 3 Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-zinc-950/90 rounded-2xl p-7 border border-zinc-800/90 hover:border-[#FFC400]/60 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] group relative"
            >
              {/* Quote Mark in Gold */}
              <div className="mb-4">
                <Quote className="w-10 h-10 text-[#FFC400] fill-[#FFC400] opacity-90 transform -scale-x-100" />
              </div>

              {/* Quote text */}
              <div className="flex-1">
                <p className="text-zinc-200 text-sm sm:text-base leading-relaxed italic font-normal">
                  "{testimonial.quote}"
                </p>
              </div>

              {/* 5-Star Rating */}
              <div className="flex items-center gap-1 my-5 text-[#FFC400]">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-[#FFC400]" />
                ))}
                <span className="text-[11px] text-zinc-400 font-semibold ml-2">Verified Order</span>
              </div>

              {/* Client Info & Vector Initials Badge */}
              <div className="pt-4 border-t border-zinc-800/90 flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-zinc-900 border-2 border-[#FFC400] text-[#FFC400] flex items-center justify-center font-display font-black text-base shadow-md">
                    {testimonial.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-3.5 h-3.5 rounded-full border-2 border-black" />
                </div>

                <div>
                  <h4 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-tight group-hover:text-[#FFC400] transition-colors">
                    – {testimonial.name}
                  </h4>
                  <p className="text-xs text-zinc-400 font-medium">{testimonial.role}</p>
                  <p className="text-[11px] text-[#FFC400] font-semibold">{testimonial.location}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Aggregate Stats Strip */}
        <div className="mt-14 pt-8 border-t border-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="font-display font-black text-2xl sm:text-3xl text-[#FFC400]">4.9 / 5.0</p>
            <p className="text-xs text-zinc-400 font-medium">Average Customer Rating</p>
          </div>
          <div>
            <p className="font-display font-black text-2xl sm:text-3xl text-white">99.4%</p>
            <p className="text-xs text-zinc-400 font-medium">On-Time Shipment Rate</p>
          </div>
          <div>
            <p className="font-display font-black text-2xl sm:text-3xl text-[#FFC400]">100%</p>
            <p className="text-xs text-zinc-400 font-medium">Satisfaction Guaranteed</p>
          </div>
        </div>

      </div>
    </section>
  );
};
