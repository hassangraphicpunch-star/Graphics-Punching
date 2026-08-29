import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { WhyChooseUsSection } from '../components/WhyChooseUsSection';
import { CTASection } from '../components/CTASection';
import { ImageLightboxModal, LightboxImageItem } from '../components/ImageLightboxModal';
import { WatermarkOverlay } from '../components/WatermarkOverlay';
import { 
  Sparkles, ArrowRight, ShieldCheck, Zap, Palette, Layers, 
  CheckCircle2, Clock, Star, Maximize2, Scissors, Cpu
} from 'lucide-react';
import { PORTFOLIO_PROJECTS, PortfolioItem } from '../data/content';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onOpenQuoteModal: (serviceId?: string, tierId?: string, itemTitle?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenQuoteModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  // Filter projects for the homepage showcase
  const filteredProjects = selectedCategory === 'all'
    ? PORTFOLIO_PROJECTS.slice(0, 6)
    : PORTFOLIO_PROJECTS.filter((p) => p.category === selectedCategory).slice(0, 6);

  const lightboxImages: LightboxImageItem[] = filteredProjects.map((p) => ({
    src: p.image,
    title: p.title,
    category: p.category,
    categoryLabel: p.categoryLabel,
    tag: p.tag,
    specs: p.specs,
    client: p.client,
    description: p.description,
    stitchCount: p.stitchCount,
    turnaround: p.turnaround,
    deliverables: p.deliverables,
  }));

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="animate-fadeIn overflow-hidden">
      {/* 1. Hero Section */}
      <Hero
        onOpenQuoteModal={() => onOpenQuoteModal('vector-artwork', 'simple-vector')}
        onScrollToPortfolio={() => onNavigate('portfolio')}
      />

      {/* 2. Core Value & Precision Guarantee Bar */}
      <section className="bg-[#0c0c0e] py-8 sm:py-10 border-b border-zinc-800/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
            
            <div className="bg-zinc-900/60 p-4 sm:p-5 rounded-2xl border border-zinc-800 hover:border-[#FFC400]/40 transition-all flex items-start gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-base uppercase text-white">
                  Express 2-4h Rush Option
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Same-day vector conversions and embroidery digitizing for urgent press deadlines.
                </p>
              </div>
            </div>

            <div className="bg-zinc-900/60 p-4 sm:p-5 rounded-2xl border border-zinc-800 hover:border-[#FFC400]/40 transition-all flex items-start gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-base uppercase text-white">
                  100% Machine Tested
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Every DST, EMB, and vector file is calibrated for minimal thread breaks and density balance.
                </p>
              </div>
            </div>

            <div className="bg-zinc-900/60 p-4 sm:p-5 rounded-2xl border border-zinc-800 hover:border-[#FFC400]/40 transition-all flex items-start gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center shrink-0">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-base uppercase text-white">
                  Free Unlimited Revisions
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  We guarantee total satisfaction with zero-cost revisions on all digital production files.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PROMINENT HOMEPAGE PORTFOLIO SHOWCASE (Moved High Up for Immediate Visibility) */}
      <section id="homepage-portfolio" className="py-10 sm:py-14 bg-[#070709] text-white border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header & Category Filter Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC400]/10 text-[#FFC400] text-xs font-black uppercase tracking-wider mb-2.5">
                <Star className="w-3.5 h-3.5 fill-[#FFC400]" />
                <span>FEATURED PRODUCTION SHOWCASE</span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-white">
                EXPLORE OUR <span className="text-[#FFC400]">RECENT WORK</span>
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-xl">
                Browse verified commercial embroidery sewouts, master vector separations, and screen printing apparel production.
              </p>
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Featured' },
                { id: 'embroidery', label: 'Embroidery' },
                { id: 'vector-artwork', label: 'Vector Artwork' },
                { id: 'screen-printing', label: 'Screen Print' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer min-h-[38px] ${
                    selectedCategory === tab.id
                      ? 'bg-[#FFC400] text-black shadow-md shadow-[#FFC400]/20'
                      : 'bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => onNavigate('portfolio')}
                className="hidden lg:inline-flex items-center gap-1.5 text-xs font-extrabold uppercase text-[#FFC400] hover:text-[#ffcd1a] ml-2 cursor-pointer transition-colors"
              >
                <span>Full Portfolio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Portfolio Grid with Permanent Watermarks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredProjects.map((project, idx) => (
              <div
                key={project.id}
                onClick={() => handleOpenLightbox(idx)}
                className="group bg-[#0c0c0e] rounded-2xl overflow-hidden border border-zinc-800 hover:border-[#FFC400] shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Image Container with Zero Cropping and Watermark */}
                <div className="relative aspect-[4/3] w-full flex items-center justify-center p-3 overflow-hidden bg-black/95">
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-300 relative z-0"
                    loading="lazy"
                  />
                  
                  {/* Permanent Watermark Overlay */}
                  <WatermarkOverlay size="sm" />

                  <div className="absolute top-2.5 left-2.5 z-20">
                    <span className="bg-black/90 text-[#FFC400] border border-[#FFC400]/40 text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                      {project.tag}
                    </span>
                  </div>

                  {project.turnaround && (
                    <div className="absolute top-2.5 right-2.5 z-20">
                      <span className="bg-zinc-900/90 text-zinc-300 border border-zinc-700/60 text-[9px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-[#FFC400]" />
                        {project.turnaround}
                      </span>
                    </div>
                  )}

                  {/* Hover action banner */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex items-center justify-center pointer-events-none">
                    <span className="bg-[#FFC400] text-black text-xs font-black uppercase px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xl">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Click to Inspect / Download</span>
                    </span>
                  </div>
                </div>

                {/* Project Specs Card */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-zinc-950 border-t border-zinc-850">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#FFC400] block mb-1">
                      {project.categoryLabel}
                    </span>

                    <h3 className="font-display font-bold text-base uppercase text-white group-hover:text-[#FFC400] transition-colors truncate">
                      {project.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {project.specs}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-850 flex items-center justify-between text-xs">
                    <span className="text-zinc-400 text-[11px] truncate max-w-[140px]">
                      {project.client}
                    </span>
                    <span className="text-[#FFC400] font-bold flex items-center gap-1 shrink-0 text-xs">
                      <span>Full Resolution</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Button */}
          <div className="mt-8 sm:mt-10 text-center">
            <button
              type="button"
              onClick={() => onNavigate('portfolio')}
              className="inline-flex items-center gap-2 bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-black text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl shadow-lg transition-all cursor-pointer min-h-[44px]"
            >
              <span>Explore Complete 30+ Project Portfolio Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 4. Technical Comparison & Machine Calibration Matrix */}
      <section className="py-12 sm:py-16 bg-[#09090b] text-white border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC400]/10 text-[#FFC400] text-xs font-black uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PRECISION DIGITAL CRAFTSMANSHIP</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-white">
              SEE THE <span className="text-[#FFC400]">PRECISION DIFFERENCE</span>
            </h2>
            <p className="mt-2 text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Compare our industry-grade machine calibrations with standard raw artwork files across Vector &amp; Embroidery workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {/* Card 1: Vector Redraw Quality */}
            <div className="bg-[#0a0a0c] rounded-2xl sm:rounded-3xl border border-zinc-800 p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2 text-[#FFC400]">
                    <Layers className="w-5 h-5" />
                    <span className="font-display font-bold uppercase text-sm tracking-wider">Vector Artwork Redraw</span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#FFC400]/10 text-[#FFC400] px-2.5 py-1 rounded-md border border-[#FFC400]/30">
                    MASTER AI / EPS
                  </span>
                </div>

                <h3 className="font-display font-black text-xl text-white uppercase">
                  Zero Blur • Scale-Infinite Mathematical Bézier Curves
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  We eliminate pixelation from low-res screenshots, converting them into mathematically perfect vector lines with exact Pantone PMS matching ready for automated screen print separation.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase block">Raw Bitmap File</span>
                    <p className="text-xs text-zinc-400 mt-1">72 DPI pixelated edges, blurry text, unusable on film.</p>
                  </div>
                  <div className="bg-zinc-900/80 p-3 rounded-xl border border-[#FFC400]/30">
                    <span className="text-[10px] font-bold text-[#FFC400] uppercase block">GP Vector Master</span>
                    <p className="text-xs text-zinc-200 mt-1">Infinite scale, clean closed vector paths, spot color PMS channels.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-zinc-850 flex items-center justify-between">
                <span className="text-xs text-zinc-400">Starting at only $15</span>
                <button
                  type="button"
                  onClick={() => onOpenQuoteModal('vector-artwork', 'simple-vector')}
                  className="bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Order Vector Redraw
                </button>
              </div>
            </div>

            {/* Card 2: Embroidery Digitizing Sewout */}
            <div className="bg-[#0a0a0c] rounded-2xl sm:rounded-3xl border border-zinc-800 p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2 text-[#FFC400]">
                    <Cpu className="w-5 h-5" />
                    <span className="font-display font-bold uppercase text-sm tracking-wider">Embroidery Digitizing &amp; Sewout</span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#FFC400]/10 text-[#FFC400] px-2.5 py-1 rounded-md border border-[#FFC400]/30">
                    DST / EMB FORMAT
                  </span>
                </div>

                <h3 className="font-display font-black text-xl text-white uppercase">
                  Calibrated Underlay • Push-Pull Compensation • Zero Jam
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Optimized stitch sequences with tailored underlay density for structured caps, flat garments, jackets, and 3D foam puff embroidery ensuring flawless machine runnability.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase block">Generic Auto-Digitizing</span>
                    <p className="text-xs text-zinc-400 mt-1">Frequent thread breaks, puckering fabric, excessive jump trims.</p>
                  </div>
                  <div className="bg-zinc-900/80 p-3 rounded-xl border border-[#FFC400]/30">
                    <span className="text-[10px] font-bold text-[#FFC400] uppercase block">GP Precision Sewout</span>
                    <p className="text-xs text-zinc-200 mt-1">Calibrated pull-push tension, crisp satin edges, 99.98% machine run rate.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-zinc-850 flex items-center justify-between">
                <span className="text-xs text-zinc-400">Starting at only $20</span>
                <button
                  type="button"
                  onClick={() => onOpenQuoteModal('embroidery', 'standard-cap-chest')}
                  className="bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Order Digitizing
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Services Quick Overview */}
      <section className="py-14 sm:py-18 bg-[#070709] text-white border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC400]/10 text-[#FFC400] text-xs font-black uppercase tracking-wider mb-2.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CORE SPECIALTIES</span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-white">
                WHOLESALE <span className="text-[#FFC400]">SERVICES</span>
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#FFC400] hover:text-[#ffcd1a] transition-colors cursor-pointer self-start sm:self-auto min-h-[40px]"
            >
              <span>View All Services &amp; Packages</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Service Block 1: Vector Redraw */}
            <div className="bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-800 hover:border-[#FFC400]/60 transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center">
                  <Palette className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-display font-black text-2xl sm:text-3xl uppercase text-white group-hover:text-[#FFC400] transition-colors">
                  Vector Artwork &amp; Color Separation
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  Transform low-resolution raster JPEGs and sketches into razor-sharp, scale-infinite vector artwork with exact spot color PMS matching for screen printers.
                </p>
                <ul className="space-y-2 pt-2 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FFC400] shrink-0" />
                    <span>AI, EPS, SVG, High-Res PDF &amp; PNG deliverables</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FFC400] shrink-0" />
                    <span>Halftone dot separations &amp; simulated process channels</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FFC400] shrink-0" />
                    <span>Flat-rate simple vector redraws starting at only $15</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase px-5 py-3 rounded-xl transition-all cursor-pointer min-h-[44px] flex items-center justify-center"
                >
                  Explore Vector Packages
                </button>
                <button
                  type="button"
                  onClick={() => onOpenQuoteModal('vector-artwork', 'simple-vector')}
                  className="border border-zinc-700 hover:border-zinc-500 text-white font-bold text-xs uppercase px-4 py-3 rounded-xl transition-colors cursor-pointer min-h-[44px] flex items-center justify-center"
                >
                  Instant Quote
                </button>
              </div>
            </div>

            {/* Service Block 2: Embroidery Digitizing */}
            <div className="bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-800 hover:border-[#FFC400]/60 transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center">
                  <Layers className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-display font-black text-2xl sm:text-3xl uppercase text-white group-hover:text-[#FFC400] transition-colors">
                  Commercial Embroidery Digitizing
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  Precision stitch programming for left chest crests, 3D puff snapbacks, structured caps, and complex high-stitch jacket backs with zero machine jamming.
                </p>
                <ul className="space-y-2 pt-2 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FFC400] shrink-0" />
                    <span>DST, PES, EMB, EXP, JEF, HUS &amp; VP3 formats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FFC400] shrink-0" />
                    <span>Comprehensive color run sheet &amp; production sewout PDF</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FFC400] shrink-0" />
                    <span>Flat-rate cap / chest digitizing starting at only $20</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase px-5 py-3 rounded-xl transition-all cursor-pointer min-h-[44px] flex items-center justify-center"
                >
                  Explore Digitizing Packages
                </button>
                <button
                  type="button"
                  onClick={() => onOpenQuoteModal('embroidery', 'standard-cap-chest')}
                  className="border border-zinc-700 hover:border-zinc-500 text-white font-bold text-xs uppercase px-4 py-3 rounded-xl transition-colors cursor-pointer min-h-[44px] flex items-center justify-center"
                >
                  Instant Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Why Choose Us Pillar Section */}
      <WhyChooseUsSection />

      {/* 7. Call To Action Strip */}
      <CTASection
        onOpenQuoteModal={() => onOpenQuoteModal('vector-artwork', 'simple-vector')}
        onScrollToContact={() => onNavigate('contact')}
      />

      {/* Full-Resolution Lightbox Modal */}
      <ImageLightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={lightboxImages}
        currentIndex={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onOpenQuoteForProject={(title) => onOpenQuoteModal('vector-artwork', 'simple-vector', title)}
      />
    </div>
  );
};


