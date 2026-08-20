import React, { useState } from 'react';
import { SERVICE_PACKAGES, ServicePackage } from '../data/content';
import { ServiceIcon } from './ServiceCardIcons';
import { 
  ArrowRight, CheckCircle2, X, Sparkles, Clock, DollarSign, 
  Layers, ShieldCheck, Zap, FileCode2, Check, ExternalLink, Cpu
} from 'lucide-react';

interface ServicesSectionProps {
  onSelectServiceForQuote: (serviceId: string, tierId?: string, itemTitle?: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForQuote }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'vector' | 'digitizing'>('all');
  const [selectedPackageForModal, setSelectedPackageForModal] = useState<ServicePackage | null>(null);

  const filteredPackages = activeCategory === 'all'
    ? SERVICE_PACKAGES
    : SERVICE_PACKAGES.filter((pkg) => pkg.category === activeCategory);

  const categories = [
    { id: 'all', label: 'All Packages', count: SERVICE_PACKAGES.length },
    { id: 'vector', label: 'Vector Artwork', count: SERVICE_PACKAGES.filter(p => p.category === 'vector').length },
    { id: 'digitizing', label: 'Logo Digitizing', count: SERVICE_PACKAGES.filter(p => p.category === 'digitizing').length },
  ];

  return (
    <section id="services" className="py-20 sm:py-28 bg-[#09090b] text-white relative overflow-hidden border-b border-zinc-800">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-72 bg-[#FFC400]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/25 text-[#FFC400] text-xs font-black tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WHOLESALE VECTOR &amp; DIGITIZING PACKAGES</span>
          </div>
          
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white">
            OUR <span className="text-[#FFC400]">SERVICES &amp; PACKAGES</span>
          </h2>
          
          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
            Transparent flat-rate digital vector redraws and commercial embroidery digitizing. Exact same wholesale pricing, turnaround, and file guarantees on every design.
          </p>

          {/* Quick Value Guarantees Banner */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            {[
              { icon: Zap, title: 'Express 2-4h Turnaround', desc: 'Fastest vector redraws' },
              { icon: ShieldCheck, title: '100% Production Ready', desc: 'Commercial machine tested' },
              { icon: DollarSign, title: 'No Hidden Fees', desc: 'Exact guaranteed flat rates' },
              { icon: Layers, title: 'Free Revisions', desc: 'Unlimited minor tweaks' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">{item.title}</p>
                    <p className="text-[11px] text-zinc-400 leading-tight">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Navigation Switcher */}
        <div className="flex items-center justify-center mb-10 overflow-x-auto pb-2 scrollbar-none">
          <div className="inline-flex bg-zinc-900/90 p-1.5 rounded-2xl border border-zinc-800 shadow-inner">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-5 sm:px-7 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#FFC400] text-black shadow-[0_2px_12px_rgba(255,196,0,0.35)]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-black ${
                  activeCategory === cat.id ? 'bg-black text-[#FFC400]' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {filteredPackages.map((pkg) => {
            const isPopular = pkg.popular;

            return (
              <div
                key={pkg.id}
                id={`service-pkg-${pkg.id}`}
                className={`rounded-2xl flex flex-col justify-between transition-all duration-300 relative group ${
                  isPopular
                    ? 'bg-zinc-900/95 border-2 border-[#FFC400] shadow-[0_0_30px_rgba(255,196,0,0.12)]'
                    : 'bg-zinc-900/70 border border-zinc-800 hover:border-zinc-600 hover:shadow-xl'
                }`}
              >
                {/* Popular / Feature Pill Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#FFC400] uppercase bg-[#FFC400]/10 border border-[#FFC400]/25 px-2.5 py-1 rounded-md">
                      {pkg.categoryLabel}
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      {pkg.badge && (
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider ${
                          isPopular
                            ? 'bg-[#FFC400] text-black font-extrabold shadow-sm'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}>
                          {pkg.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Icon Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight group-hover:text-[#FFC400] transition-colors">
                        {pkg.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
                        <Clock className="w-3.5 h-3.5 text-[#FFC400]" />
                        <span>Turnaround: <strong className="text-zinc-200">{pkg.turnaround}</strong></span>
                      </div>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-black/60 border border-zinc-800 flex items-center justify-center p-2 flex-shrink-0 group-hover:border-[#FFC400]/50 transition-colors">
                      <ServiceIcon type={pkg.iconName} className="w-8 h-8" />
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div className="bg-black/50 border border-zinc-800/80 rounded-xl p-3.5 mb-5 flex items-baseline justify-between">
                    <div>
                      <span className="text-zinc-400 text-xs font-semibold block uppercase tracking-wider">Flat Guaranteed Rate</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display font-black text-3xl text-[#FFC400] tracking-tight">
                          {pkg.priceDisplay}
                        </span>
                        <span className="text-xs text-zinc-400 font-medium">
                          {pkg.unit}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedPackageForModal(pkg)}
                      className="text-xs text-zinc-400 hover:text-white font-bold flex items-center gap-1 underline underline-offset-4 decoration-zinc-700 hover:decoration-[#FFC400] transition-all cursor-pointer"
                    >
                      <span>Specs</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-zinc-400 leading-relaxed min-h-[38px] mb-5">
                    {pkg.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2.5 pt-4 border-t border-zinc-800/80">
                    <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#FFC400]" />
                      Package Inclusions:
                    </p>
                    {pkg.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-zinc-300">
                        <div className="w-4 h-4 rounded-full bg-[#FFC400]/15 text-[#FFC400] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Formats Tags */}
                  <div className="mt-5 pt-3 border-t border-zinc-800/60 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase">Outputs:</span>
                    {pkg.formats.map((fmt, fmtIdx) => (
                      <span key={fmtIdx} className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700">
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Bottom CTA Actions */}
                <div className="p-6 pt-0 mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={() => onSelectServiceForQuote(pkg.serviceId, pkg.tierId, pkg.name)}
                    className={`w-full py-3.5 px-4 rounded-xl font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isPopular
                        ? 'bg-[#FFC400] hover:bg-[#ffcd1a] text-black shadow-[0_4px_16px_rgba(255,196,0,0.3)] hover:scale-[1.01]'
                        : 'bg-white hover:bg-zinc-100 text-black hover:scale-[1.01]'
                    }`}
                  >
                    <span>Order {pkg.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPackageForModal(pkg)}
                    className="w-full py-2 text-center text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    View Full Technical Specifications
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Package Specs Modal */}
      {selectedPackageForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#121214] text-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-700 relative animate-scaleUp max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPackageForModal(null)}
              aria-label="Close modal"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-5">
              <div className="p-3 bg-zinc-800 rounded-xl border border-zinc-700">
                <ServiceIcon type={selectedPackageForModal.iconName} className="w-10 h-10" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#FFC400] uppercase tracking-wider bg-[#FFC400]/10 px-2 py-0.5 rounded border border-[#FFC400]/30">
                    {selectedPackageForModal.categoryLabel}
                  </span>
                  {selectedPackageForModal.badge && (
                    <span className="text-[10px] font-bold text-zinc-300 uppercase bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                      {selectedPackageForModal.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase mt-1">
                  {selectedPackageForModal.name}
                </h3>
              </div>
            </div>

            <p className="text-sm text-zinc-300 mb-6 leading-relaxed">
              {selectedPackageForModal.description}
            </p>

            {/* Price & Turnaround Bar */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-black/60 border border-zinc-800 p-3.5 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Flat Rate</span>
                <span className="font-display font-black text-2xl text-[#FFC400]">
                  {selectedPackageForModal.priceDisplay}
                </span>
                <span className="text-xs text-zinc-400 ml-1">{selectedPackageForModal.unit}</span>
              </div>

              <div className="bg-black/60 border border-zinc-800 p-3.5 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Standard Turnaround</span>
                <span className="font-display font-black text-lg text-white">
                  {selectedPackageForModal.turnaround}
                </span>
                <span className="text-[10px] text-zinc-400 block">Express Delivery Available</span>
              </div>
            </div>

            {/* Technical Specifications Matrix */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 mb-6">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#FFC400] flex items-center gap-1.5 mb-3">
                <Cpu className="w-3.5 h-3.5" />
                Technical Specifications &amp; Standards
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedPackageForModal.specs.map((spec, sIdx) => (
                  <div key={sIdx} className="bg-black/50 p-2.5 rounded-lg border border-zinc-800/80 flex justify-between items-center">
                    <span className="text-zinc-400 text-[11px] font-medium">{spec.label}</span>
                    <span className="text-white font-bold text-[11px] text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables / Inclusions */}
            <div className="space-y-2 mb-6">
              <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FFC400]" />
                Included In This Package:
              </h4>
              <div className="space-y-2">
                {selectedPackageForModal.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2.5 text-xs text-zinc-300 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/60">
                    <CheckCircle2 className="w-4 h-4 text-[#FFC400] flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Output Formats */}
            <div className="mb-6">
              <span className="text-xs font-bold text-zinc-400 block uppercase tracking-wider mb-2">
                Production Deliverable Formats:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedPackageForModal.formats.map((fmt, fmtIdx) => (
                  <span key={fmtIdx} className="font-mono text-xs bg-black text-[#FFC400] px-3 py-1 rounded-md border border-zinc-700 font-bold">
                    {fmt}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Order Button */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const pkg = selectedPackageForModal;
                  setSelectedPackageForModal(null);
                  onSelectServiceForQuote(pkg.serviceId, pkg.tierId, pkg.name);
                }}
                className="w-full bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-display font-black text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(255,196,0,0.3)] transition-all cursor-pointer"
              >
                <span>Get Instant Quote for {selectedPackageForModal.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
