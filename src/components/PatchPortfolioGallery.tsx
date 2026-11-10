import React, { useState } from 'react';
import { 
  Award, Sparkles, ZoomIn, ArrowRight, CheckCircle2, 
  Layers, Scissors, ShieldCheck, Tag, Eye, ChevronRight,
  Maximize2, Compass, Sliders, Check
} from 'lucide-react';
import { PATCH_PORTFOLIO_ITEMS, PatchPortfolioItem } from '../data/patchPortfolio';
import { ImageLightboxModal, LightboxImageItem } from './ImageLightboxModal';
import { WatermarkOverlay } from './WatermarkOverlay';
import { WatermarkedPortfolioImage } from './WatermarkedPortfolioImage';

interface PatchPortfolioGalleryProps {
  onOpenQuoteModal: (serviceId?: string, tierId?: string, itemTitle?: string) => void;
  className?: string;
  initialCategory?: string;
}

export const PatchPortfolioGallery: React.FC<PatchPortfolioGalleryProps> = ({
  onOpenQuoteModal,
  className = '',
  initialCategory = 'all'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [activeItemModal, setActiveItemModal] = useState<PatchPortfolioItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter items based on category
  const filteredItems = selectedCategory === 'all'
    ? PATCH_PORTFOLIO_ITEMS
    : PATCH_PORTFOLIO_ITEMS.filter((item) => item.category === selectedCategory);

  // Map to lightbox images
  const lightboxImages: LightboxImageItem[] = PATCH_PORTFOLIO_ITEMS.map((item) => ({
    src: item.image,
    title: `${item.title} (${item.categoryName})`,
    category: 'custom-patch',
    categoryLabel: item.categoryName,
    tag: item.tag,
    specs: `${item.dimensions} | ${item.stitchCount} | ${item.borderType}`,
    client: item.applicationGarment,
    description: `${item.standaloneDescription}\n\n${item.applicationDescription}\n\nThreads: ${item.threads}\nBacking: ${item.backingType}`,
    stitchCount: item.stitchCount,
    turnaround: item.turnaround,
    deliverables: item.formatFiles,
  }));

  const handleOpenLightbox = (itemId: string) => {
    const idx = PATCH_PORTFOLIO_ITEMS.findIndex((it) => it.id === itemId);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  const categories = [
    { id: 'all', label: 'All 10 Categories', count: PATCH_PORTFOLIO_ITEMS.length },
    { id: 'embroidered', label: '1. Embroidered Patches', count: 1 },
    { id: 'jacket', label: '2. Jacket Patches', count: 1 },
    { id: 'cap', label: '3. Cap Patches', count: 1 },
    { id: 'backpack', label: '4. Backpack Patches', count: 1 },
    { id: 'chenille', label: '5. Chenille Patches', count: 1 },
    { id: 'pvc', label: '6. PVC Rubber Patches', count: 1 },
    { id: 'leather', label: '7. Leather Patches', count: 1 },
    { id: 'uniform', label: '8. Uniform Patches', count: 1 },
    { id: 'hoodie', label: '9. Hoodie Patches', count: 1 },
    { id: 'military', label: '10. Military-Style Patches', count: 1 },
  ];

  return (
    <div className={`space-y-10 ${className}`}>
      {/* 1. Header Banner & Concept Overview */}
      <div className="bg-gradient-to-r from-zinc-950 via-[#0a0a0c] to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFC400]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/25 text-[#FFC400] text-xs font-black tracking-widest uppercase mb-4">
            <Award className="w-4 h-4" />
            <span>2-IN-1 DUAL-VIEW PORTFOLIO ARCHIVE</span>
          </div>
          
          <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl uppercase text-white tracking-tight">
            EMBROIDERY PATCHES <span className="text-[#FFC400]">SHOWCASE COLLECTION</span>
          </h2>
          
          <p className="text-zinc-300 text-sm sm:text-base mt-3 leading-relaxed">
            Every product showcase features our signature dual-view composition: 
            <strong className="text-white"> Left Side</strong> reveals the pristine standalone patch highlighting realistic embroidery threads, stitching density, and border craftsmanship on a clean studio background. 
            <strong className="text-white"> Right Side</strong> displays the exact same patch professionally attached to real jackets, caps, backpacks, hoodies, uniforms, and tactical gear.
          </p>

          {/* Quick Concept Explainer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-black/60 border border-zinc-800/80 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0 text-[#FFC400] font-black text-xs">
                L
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-white tracking-wider">
                  Left Side: Standalone Patch
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Studio lighting showing exact thread tension, Madeira rayon sheen, merrowed borders, and multi-directional tatami underlay.
                </p>
              </div>
            </div>

            <div className="bg-black/60 border border-zinc-800/80 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FFC400] text-black font-black text-xs flex items-center justify-center shrink-0">
                R
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-white tracking-wider">
                  Right Side: Real Product Application
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Identical artwork machine-stitched onto real denim, structured caps, heavy fleece, cordura, and uniform garments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-zinc-400">
            Browse by Patch Category ({PATCH_PORTFOLIO_ITEMS.length} Professional Showcases)
          </span>
          <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
            4:3 Split-Screen Composition
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-[#FFC400] text-black shadow-lg shadow-[#FFC400]/20 font-black'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
              }`}
            >
              <span>{cat.label}</span>
              {selectedCategory === cat.id && (
                <span className="w-1.5 h-1.5 rounded-full bg-black" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Patch Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            id={item.id}
            className="group bg-zinc-950 border border-zinc-800 hover:border-[#FFC400] rounded-3xl overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-black/60 flex flex-col justify-between"
          >
            {/* Top Bar with Number & Category Tag */}
            <div className="p-4 sm:px-6 sm:py-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-[#FFC400] text-black text-xs font-black flex items-center justify-center shrink-0">
                  {item.categoryNumber}
                </span>
                <span className="text-xs font-black uppercase text-white tracking-wide">
                  {item.categoryName}
                </span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FFC400] bg-black/70 border border-[#FFC400]/30 px-2.5 py-0.5 rounded-full">
                {item.tag}
              </span>
            </div>

            {/* Split Screen Image Container (4:3 Aspect Ratio) */}
            <div 
              onClick={() => handleOpenLightbox(item.id)}
              className="relative aspect-[4/3] w-full bg-black cursor-pointer overflow-hidden select-none group/img"
            >
              <WatermarkedPortfolioImage
                src={item.image}
                alt={`${item.title} - ${item.categoryName}`}
                title={item.title}
                className="w-full h-full object-cover group-hover/img:scale-[1.03] transition-transform duration-500"
                loading="lazy"
              />

              {/* Security Watermark */}
              <WatermarkOverlay position="diagonal" opacity={0.22} />

              {/* Split-Screen Indicator Pills */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
                <div className="bg-black/85 backdrop-blur-md text-white border border-zinc-700/80 text-[10px] sm:text-xs font-black uppercase px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FFC400]" />
                  <span>Left: Standalone Patch</span>
                </div>
                
                <div className="bg-black/85 backdrop-blur-md text-[#FFC400] border border-[#FFC400]/40 text-[10px] sm:text-xs font-black uppercase px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1.5">
                  <span>Right: On {item.applicationGarment.split('&')[0].trim()}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC400]" />
                </div>
              </div>

              {/* Center Transition Pill with Subtle Arrow */}
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none z-10">
                <div className="bg-black/80 backdrop-blur-sm border border-zinc-700 text-[#FFC400] p-1.5 rounded-full shadow-2xl opacity-75 group-hover/img:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Hover Overlay with Inspect CTA */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenLightbox(item.id);
                  }}
                  className="bg-[#FFC400] text-black font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 hover:bg-white transition-colors cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                  <span>Inspect Dual-View Stitching</span>
                </button>
              </div>
            </div>

            {/* Description & Technical Breakdown */}
            <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h3 className="font-display font-black text-lg sm:text-xl uppercase text-white group-hover:text-[#FFC400] transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                    {item.stitchCount}
                  </span>
                </div>
                
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {item.subtitle}
                </p>

                {/* Left/Right Split Description Text */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-zinc-800/80">
                  <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-3">
                    <span className="text-[10px] font-black uppercase text-[#FFC400] block mb-1">
                      Standalone Patch View
                    </span>
                    <p className="text-[11px] text-zinc-300 leading-snug">
                      {item.standaloneDescription.replace('LEFT: ', '')}
                    </p>
                  </div>

                  <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-3">
                    <span className="text-[10px] font-black uppercase text-[#FFC400] block mb-1">
                      Applied Garment View
                    </span>
                    <p className="text-[11px] text-zinc-300 leading-snug">
                      {item.applicationDescription.replace('RIGHT: ', '')}
                    </p>
                  </div>
                </div>

                {/* Specifications Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 text-[11px]">
                  <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-lg">
                    <span className="text-zinc-500 block text-[9px] uppercase font-bold">Dimensions</span>
                    <span className="text-white font-medium">{item.dimensions}</span>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-lg">
                    <span className="text-zinc-500 block text-[9px] uppercase font-bold">Border Type</span>
                    <span className="text-white font-medium truncate block" title={item.borderType}>{item.borderType}</span>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-lg col-span-2 sm:col-span-1">
                    <span className="text-zinc-500 block text-[9px] uppercase font-bold">Backing</span>
                    <span className="text-white font-medium truncate block" title={item.backingType}>{item.backingType}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setActiveItemModal(item)}
                  className="text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#FFC400]" />
                  <span>Full Tech Specs</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenQuoteModal('embroidery', 'patch-digitizing', `${item.title} (${item.categoryName})`)}
                  className="bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Order This Patch Style</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Technical Specs Detail Modal */}
      {activeItemModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveItemModal(null)}
        >
          <div 
            className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <span className="text-xs font-black uppercase text-[#FFC400] tracking-wider block mb-1">
                  Category #{activeItemModal.categoryNumber} • {activeItemModal.categoryName}
                </span>
                <h3 className="font-display font-black text-2xl uppercase text-white">
                  {activeItemModal.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  {activeItemModal.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveItemModal(null)}
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Split Image Preview */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-800 bg-black">
              <WatermarkedPortfolioImage
                src={activeItemModal.image}
                alt={activeItemModal.title}
                title={activeItemModal.title}
                className="w-full h-full object-cover"
              />
              <WatermarkOverlay position="diagonal" opacity={0.22} />
              
              <div className="absolute bottom-3 right-3">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenLightbox(activeItemModal.id);
                    setActiveItemModal(null);
                  }}
                  className="bg-[#FFC400] text-black font-black text-xs uppercase px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xl cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Inspect Fullscreen</span>
                </button>
              </div>
            </div>

            {/* Tech Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl space-y-2">
                <span className="text-[11px] font-black uppercase text-[#FFC400] block">
                  Embroidery Production Specifications
                </span>
                <div className="space-y-1.5 text-zinc-300">
                  <div><strong>Stitch Count:</strong> {activeItemModal.stitchCount}</div>
                  <div><strong>Dimensions:</strong> {activeItemModal.dimensions}</div>
                  <div><strong>Threads &amp; Finish:</strong> {activeItemModal.threads}</div>
                  <div><strong>Turnaround:</strong> {activeItemModal.turnaround}</div>
                </div>
              </div>

              <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl space-y-2">
                <span className="text-[11px] font-black uppercase text-[#FFC400] block">
                  Finishing &amp; Application Garment
                </span>
                <div className="space-y-1.5 text-zinc-300">
                  <div><strong>Border Finishing:</strong> {activeItemModal.borderType}</div>
                  <div><strong>Backing System:</strong> {activeItemModal.backingType}</div>
                  <div><strong>Applied Garment:</strong> {activeItemModal.applicationGarment}</div>
                  <div><strong>Machine Formats:</strong> {activeItemModal.formatFiles.join(', ')}</div>
                </div>
              </div>
            </div>

            {/* Digitizing Strategy Note */}
            <div className="bg-black/60 border border-zinc-800 p-4 rounded-xl">
              <span className="text-[11px] font-black uppercase text-[#FFC400] block mb-1">
                Master Digitizer Engineering Notes
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {activeItemModal.patchDesignNotes}
              </p>
            </div>

            {/* Footer Action */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setActiveItemModal(null)}
                className="text-xs text-zinc-400 hover:text-white font-bold cursor-pointer"
              >
                Close Spec Sheet
              </button>

              <button
                type="button"
                onClick={() => {
                  const title = `${activeItemModal.title} (${activeItemModal.categoryName})`;
                  setActiveItemModal(null);
                  onOpenQuoteModal('embroidery', 'patch-digitizing', title);
                }}
                className="bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow flex items-center gap-2 cursor-pointer"
              >
                <span>Request Digitizing Quote for This Style</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Lightbox Modal Integration for Fullscreen Pinch/Zoom Inspection */}
      <ImageLightboxModal
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        images={lightboxImages}
        currentIndex={lightboxIndex !== null ? lightboxIndex : 0}
        onIndexChange={(idx) => setLightboxIndex(idx)}
        onOpenQuoteForProject={(title) => {
          setLightboxIndex(null);
          onOpenQuoteModal('embroidery', 'patch-digitizing', title);
        }}
      />
    </div>
  );
};
