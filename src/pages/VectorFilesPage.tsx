import React, { useState } from 'react';
import { PORTFOLIO_PROJECTS, PortfolioItem } from '../data/content';
import { Sparkles, FileCode2, ArrowRight, Layers, ShieldCheck, Clock, CheckCircle2, Zap, ZoomIn, Maximize2 } from 'lucide-react';
import { ImageLightboxModal, LightboxImageItem } from '../components/ImageLightboxModal';
import { WatermarkOverlay } from '../components/WatermarkOverlay';

interface VectorFilesPageProps {
  onOpenQuoteModal: (serviceId?: string, tierId?: string, itemTitle?: string) => void;
  onNavigate: (page: string) => void;
}

export const VectorFilesPage: React.FC<VectorFilesPageProps> = ({ onOpenQuoteModal, onNavigate }) => {
  const vectorProjects = PORTFOLIO_PROJECTS.filter((p) => p.category === 'vector-artwork');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const lightboxImages: LightboxImageItem[] = vectorProjects.map((p) => ({
    src: p.image,
    title: p.title,
    category: p.category,
    categoryLabel: p.categoryLabel,
    tag: p.tag,
    specs: p.specs,
    client: p.client,
    description: p.description,
    turnaround: p.turnaround,
    deliverables: p.deliverables,
  }));

  const openLightbox = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="animate-fadeIn">
      {/* 1. HERO HEADER */}
      <div className="bg-[#050505] text-white py-14 sm:py-18 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFC400]/12 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/25 text-[#FFC400] text-xs font-black tracking-widest uppercase mb-3">
            <FileCode2 className="w-3.5 h-3.5" />
            <span>PORTFOLIO DIRECTORY / VECTOR DESIGN FILES</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white">
            VECTOR <span className="text-[#FFC400]">FILES &amp; ARTWORK</span>
          </h1>

          <p className="mt-4 text-zinc-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            High-precision manual Bézier curve redraws, color separations, raster-to-vector restorations, and cut-ready files. Every node is placed by hand with zero auto-trace defects.
          </p>

          {/* Quick Stats Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-zinc-300">
            <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 px-3.5 py-1.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC400]" />
              <span>100% Manual Hand Tracing</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 px-3.5 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5 text-[#FFC400]" />
              <span>2–4 Hour Rush Available</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 px-3.5 py-1.5 rounded-full">
              <Layers className="w-3.5 h-3.5 text-[#FFC400]" />
              <span>AI, EPS, SVG, PDF Masters</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN GALLERY SECTION */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#fafafa] text-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Info Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-zinc-200">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl uppercase text-zinc-900">
                Vector Design Projects ({vectorProjects.length})
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                Click any project image to open in high-resolution zoom lightbox
              </p>
            </div>

            <button
              onClick={() => onOpenQuoteModal('vector-artwork', 'simple-vector')}
              className="bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>Order Vector Redraw</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {vectorProjects.map((project, idx) => (
              <div
                key={project.id}
                id={`vector-item-${project.id}`}
                onClick={() => openLightbox(idx)}
                className="group relative rounded-2xl overflow-hidden bg-[#0c0c0e] shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-zinc-800 hover:border-[#FFC400] flex flex-col justify-between"
              >
                {/* Image Container with Original Aspect Ratio */}
                <div className="relative aspect-[4/3] w-full flex items-center justify-center p-3 overflow-hidden bg-black select-none">
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Watermark Overlay */}
                  <WatermarkOverlay position="diagonal" opacity={0.28} />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-black/90 text-[#FFC400] border border-[#FFC400]/40 text-[10px] font-black uppercase px-2.5 py-1 rounded shadow">
                      {project.tag}
                    </span>
                  </div>

                  {/* Hover Inspect Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 z-20">
                    <span className="bg-[#FFC400] text-black text-xs font-black uppercase px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Inspect Vector</span>
                    </span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-zinc-950">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-[#FFC400] mb-1">
                      <span>Vector Artwork</span>
                      {project.turnaround && (
                        <span className="text-zinc-400 font-bold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                          {project.turnaround}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-base sm:text-lg uppercase text-white group-hover:text-[#FFC400] transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    
                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2">
                      {project.specs}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                    <span className="text-zinc-400 text-[11px] truncate max-w-[150px]">{project.client}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                      className="text-[#FFC400] hover:text-white font-bold flex items-center gap-1 cursor-pointer shrink-0 text-[11px]"
                    >
                      <span>View Specs</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. TECHNICAL SPECIFICATIONS & DELIVERABLES */}
      <section className="py-14 bg-[#0c0c0e] text-white border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
              <div className="w-10 h-10 rounded-xl bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center mb-4">
                <FileCode2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base uppercase text-white mb-2">
                Standard Deliverables
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Native Adobe Illustrator (.AI), Scalable Vector Graphics (.SVG), Encapsulated PostScript (.EPS), and High-Resolution Print Ready PDFs.
              </p>
            </div>

            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
              <div className="w-10 h-10 rounded-xl bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base uppercase text-white mb-2">
                Organized Node Layers
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Cleanly grouped paths, organized Pantone spot color swatches, expanded cut paths for vinyl plotters, and zero stray anchor points.
              </p>
            </div>

            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
              <div className="w-10 h-10 rounded-xl bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base uppercase text-white mb-2">
                Production Guaranteed
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tested for sharp vector edges on giant billboard vinyl wraps, laser engravers, promotional merchandise, and screen print presses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM ACTION STRIP */}
      <section className="bg-gradient-to-r from-zinc-950 via-black to-zinc-950 py-12 border-t border-zinc-800 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <h2 className="font-display font-black text-2xl sm:text-3xl uppercase">
            Have a Low-Resolution Image to Vectorize?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Send us your JPG, PNG, photo, or sketch. We will manually redraw it into razor-sharp vector curves with free unlimited revisions.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => onOpenQuoteModal('vector-artwork', 'simple-vector')}
              className="bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase px-7 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Get Instant Vector Quote ($10–$15)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <ImageLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={lightboxImages}
        currentIndex={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onOpenQuote={(title) => onOpenQuoteModal('vector-artwork', '', title)}
      />

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 text-white max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <span className="text-[10px] font-black uppercase text-[#FFC400]">Vector Artwork Specs</span>
                <h3 className="font-display font-bold text-lg uppercase text-white">{selectedProject.title}</h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-zinc-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-[4/3] bg-black rounded-xl overflow-hidden p-2 flex items-center justify-center">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain"
              />
              <WatermarkOverlay position="diagonal" opacity={0.25} />
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <p><strong className="text-white uppercase">Client:</strong> {selectedProject.client}</p>
              <p><strong className="text-white uppercase">Specifications:</strong> {selectedProject.specs}</p>
              <p><strong className="text-white uppercase">Description:</strong> {selectedProject.description}</p>
              {selectedProject.turnaround && (
                <p><strong className="text-white uppercase">Standard Turnaround:</strong> {selectedProject.turnaround}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold rounded-lg cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedProject(null);
                  onOpenQuoteModal('vector-artwork', '', selectedProject.title);
                }}
                className="px-5 py-2 bg-[#FFC400] hover:bg-[#ffcd1a] text-black text-xs font-black uppercase rounded-lg cursor-pointer flex items-center gap-1.5"
              >
                <span>Request Similar Vector</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
