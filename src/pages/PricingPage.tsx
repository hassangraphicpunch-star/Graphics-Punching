import React from 'react';
import { 
  DollarSign, Check, Zap, ShieldCheck, ArrowRight, Sparkles, 
  HelpCircle, Layers, FileCode2, Clock, CheckCircle2 
} from 'lucide-react';
import { SERVICE_PACKAGES } from '../data/content';

interface PricingPageProps {
  onSelectTierForQuote?: (tierName: string) => void;
  onOpenQuoteModal?: (serviceId?: string, tierId?: string, itemTitle?: string) => void;
  onNavigate: (page: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ 
  onSelectTierForQuote, 
  onOpenQuoteModal, 
  onNavigate 
}) => {
  const handleOrder = (serviceId: string, tierId: string, name: string) => {
    if (onOpenQuoteModal) {
      onOpenQuoteModal(serviceId, tierId, name);
    } else if (onSelectTierForQuote) {
      onSelectTierForQuote(name);
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Page Header */}
      <div className="bg-[#050505] text-white py-14 sm:py-18 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFC400]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/25 text-[#FFC400] text-xs font-black tracking-widest uppercase mb-3">
            <DollarSign className="w-3.5 h-3.5" />
            <span>WHOLESALE FLAT-RATE FEE SCHEDULE</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white">
            TRANSPARENT <span className="text-[#FFC400]">PRICING</span>
          </h1>

          <p className="mt-4 text-zinc-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            No surprise setup fees or hidden charges. Get upfront flat rates with guaranteed turnarounds and free minor revisions on every single file.
          </p>
        </div>
      </div>

      {/* Pricing Comparison Cards */}
      <section className="py-16 sm:py-20 bg-[#09090b] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* 1. Vector Artwork Packages Table */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center">
                <FileCode2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-black text-2xl sm:text-3xl uppercase text-white">
                  Vector Artwork &amp; Color Separation Rates
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400">Scale-independent raster-to-vector conversion for apparel printers</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SERVICE_PACKAGES.filter(p => p.category === 'vector').map((pkg) => (
                <div
                  key={pkg.id}
                  className={`bg-zinc-950 rounded-3xl p-7 border flex flex-col justify-between transition-all duration-300 relative ${
                    pkg.popular
                      ? 'border-[#FFC400] shadow-[0_0_30px_rgba(255,196,0,0.15)] ring-1 ring-[#FFC400]/50'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3.5 right-6">
                      <span className="bg-[#FFC400] text-black text-[10px] font-black uppercase px-3 py-1 rounded-full shadow">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] font-black text-[#FFC400] uppercase tracking-wider block mb-1">
                      {pkg.turnaround}
                    </span>
                    <h3 className="font-display font-black text-2xl uppercase text-white">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed min-h-[48px]">
                      {pkg.description}
                    </p>

                    <div className="my-6 pt-4 border-t border-zinc-800/80 flex items-baseline gap-2">
                      <span className="font-display font-black text-4xl sm:text-5xl text-[#FFC400]">
                        {pkg.priceDisplay || `$${pkg.price}`}
                      </span>
                      <span className="text-xs text-zinc-500 font-bold uppercase">/ {pkg.unit || 'Flat Rate'}</span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-zinc-300">
                      {pkg.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#FFC400] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => handleOrder('vector-artwork', pkg.id, pkg.name)}
                      className={`w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        pkg.popular
                          ? 'bg-[#FFC400] hover:bg-[#ffcd1a] text-black shadow-lg'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700'
                      }`}
                    >
                      <span>Order This Package</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Logo Digitizing Packages Table */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-black text-2xl sm:text-3xl uppercase text-white">
                  Commercial Embroidery Digitizing Rates
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400">Machine-tested stitch files for caps, polos, and jacket backs</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SERVICE_PACKAGES.filter(p => p.category === 'digitizing').map((pkg) => (
                <div
                  key={pkg.id}
                  className={`bg-zinc-950 rounded-3xl p-7 border flex flex-col justify-between transition-all duration-300 relative ${
                    pkg.popular
                      ? 'border-[#FFC400] shadow-[0_0_30px_rgba(255,196,0,0.15)] ring-1 ring-[#FFC400]/50'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3.5 right-6">
                      <span className="bg-[#FFC400] text-black text-[10px] font-black uppercase px-3 py-1 rounded-full shadow">
                        BEST FOR CAPS &amp; POLOS
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] font-black text-[#FFC400] uppercase tracking-wider block mb-1">
                      {pkg.turnaround}
                    </span>
                    <h3 className="font-display font-black text-2xl uppercase text-white">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed min-h-[48px]">
                      {pkg.description}
                    </p>

                    <div className="my-6 pt-4 border-t border-zinc-800/80 flex items-baseline gap-2">
                      <span className="font-display font-black text-4xl sm:text-5xl text-[#FFC400]">
                        {pkg.priceDisplay || `$${pkg.price}`}
                      </span>
                      <span className="text-xs text-zinc-500 font-bold uppercase">/ {pkg.unit || 'Flat Rate'}</span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-zinc-300">
                      {pkg.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#FFC400] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => handleOrder('embroidery', pkg.id, pkg.name)}
                      className={`w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        pkg.popular
                          ? 'bg-[#FFC400] hover:bg-[#ffcd1a] text-black shadow-lg'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700'
                      }`}
                    >
                      <span>Order This Package</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rush & Custom Volume Banner */}
          <div className="mt-16 bg-gradient-to-r from-zinc-950 via-black to-zinc-950 p-8 sm:p-10 rounded-3xl border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#FFC400] uppercase">
                <Zap className="w-4 h-4" />
                <span>NEED YOUR FILE IN 2 TO 4 HOURS?</span>
              </div>
              <h3 className="font-display font-black text-2xl uppercase text-white">
                24-Hour &amp; Super-Rush Express Rate Available
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                Need same-day or 24-hour turnaround? Select <strong className="text-[#FFC400]">Express (24h / Same-Day) (+ $10 / file)</strong> in our quote estimator, or request 2–4 hour rush priority queue for urgent press jobs.
              </p>
            </div>

            <button
              onClick={() => onNavigate('contact')}
              className="bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap"
            >
              Request Rush Quote
            </button>
          </div>

        </div>
      </section>
    </div>
  );
};
