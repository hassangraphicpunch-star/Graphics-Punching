import React, { useState } from 'react';
import { PORTFOLIO_PROJECTS, PortfolioItem } from '../data/content';
import { 
  ArrowRight, X, Layers, Tag, Clock, Palette, CheckCircle2, 
  Sparkles, Cpu, ShieldCheck, FileCode2, Maximize2, ZoomIn, Download 
} from 'lucide-react';
import { ImageLightboxModal, LightboxImageItem } from './ImageLightboxModal';
import { WatermarkOverlay } from './WatermarkOverlay';
import { downloadWatermarkedImage } from '../utils/watermark';

interface PortfolioSectionProps {
  onOpenQuoteModalWithItem?: (itemTitle: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onOpenQuoteModalWithItem }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [visibleLimit, setVisibleLimit] = useState<number>(12);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  const categories = [
    { id: 'all', label: 'ALL WORK' },
    { id: 'embroidery', label: 'EMBROIDERY DIGITIZING' },
    { id: 'vector-artwork', label: 'VECTOR ARTWORK' },
    { id: 'screen-printing', label: 'SCREEN PRINTING' },
  ];

  const filteredProjects = selectedCategory === 'all'
    ? PORTFOLIO_PROJECTS
    : PORTFOLIO_PROJECTS.filter((p) => p.category === selectedCategory);

  const displayedProjects = filteredProjects.slice(0, visibleLimit);
  const hasMore = visibleLimit < filteredProjects.length;

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

  const openLightboxForProject = (project: PortfolioItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const index = filteredProjects.findIndex((p) => p.id === project.id);
    setLightboxIndex(index >= 0 ? index : 0);
    setIsLightboxOpen(true);
  };

  const handleOpenDetails = (project: PortfolioItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProject(project);
  };

  return (
    <section id="portfolio" className="py-14 sm:py-20 lg:py-28 bg-[#fafafa] text-zinc-900 relative border-y border-zinc-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 border border-black/10 mb-3">
            <span className="h-2 w-2 rounded-full bg-[#FFC400]" />
            <span className="text-black font-extrabold text-xs tracking-widest uppercase">
              OUR COMPLETE WORK &amp; PORTFOLIO
            </span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-[#050505] leading-tight">
            OUR PRODUCTION PORTFOLIO
          </h2>
          <p className="mt-3 sm:mt-4 text-zinc-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Authentic production sewouts, manual vector artwork redraws, and custom apparel projects. Click any project to inspect high-resolution details or view full specifications.
          </p>
        </div>

        {/* Category Filters with Horizontal Touch Scroll on Mobile */}
        <div className="w-full overflow-x-auto pb-3 sm:pb-0 mb-8 sm:mb-12 no-scrollbar">
          <div className="flex sm:flex-wrap items-center justify-start sm:justify-center gap-2 sm:gap-3 min-w-max sm:min-w-0 px-1">
            {categories.map((cat) => {
              const count = cat.id === 'all' 
                ? PORTFOLIO_PROJECTS.length 
                : PORTFOLIO_PROJECTS.filter(p => p.category === cat.id).length;
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  id={`filter-btn-${cat.id}`}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setVisibleLimit(12);
                  }}
                  className={`text-xs sm:text-sm font-extrabold uppercase tracking-wider px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-2 min-h-[40px] shrink-0 ${
                    isActive
                      ? 'bg-[#050505] text-[#FFC400] shadow-md scale-105 ring-2 ring-[#FFC400]/40'
                      : 'bg-white text-zinc-700 hover:bg-zinc-200 hover:text-black border border-zinc-200 shadow-sm'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-[#FFC400] text-black' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid with Authentic Original Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {displayedProjects.map((project) => (
            <div
              key={project.id}
              id={`portfolio-item-${project.id}`}
              onClick={() => openLightboxForProject(project)}
              className="group relative rounded-2xl overflow-hidden bg-[#0c0c0e] shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-zinc-800 hover:border-[#FFC400] flex flex-col justify-between"
            >
              {/* Aspect Ratio Box with Original Image Preserved Without Cropping or Distortion */}
              <div className="relative aspect-[4/3] sm:aspect-square w-full flex items-center justify-center p-4 sm:p-5 overflow-hidden bg-black/90">
                {/* Subtle ambient backdrop */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20 blur-xl scale-125 pointer-events-none transition-opacity duration-500 group-hover:opacity-35"
                  style={{ backgroundImage: `url(${project.image})` }}
                />

                {/* Main Original Image - Zero Cropping, Zero Distortion */}
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-full w-auto h-auto object-contain drop-shadow-[0_8px_25px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-500 ease-out relative z-0"
                  loading="lazy"
                />

                {/* Watermark Overlay */}
                <WatermarkOverlay size="sm" />

                {/* Category Tag Badge */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                  <span className="bg-black/90 backdrop-blur-md text-[#FFC400] border border-[#FFC400]/40 text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
                    {project.tag}
                  </span>
                </div>

                {/* Turnaround Badge */}
                {project.turnaround && (
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                    <span className="bg-zinc-900/90 backdrop-blur-md text-white border border-zinc-700/60 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#FFC400]" />
                      {project.turnaround}
                    </span>
                  </div>
                )}

                {/* Desktop Hover Overlay with Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex flex-col justify-end p-5 sm:p-6 text-white z-20">
                  <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 space-y-2">
                    <span className="text-xs font-black text-[#FFC400] uppercase tracking-widest block">
                      {project.categoryLabel}
                    </span>
                    
                    <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-white leading-tight">
                      {project.title}
                    </h3>
                    
                    <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                      {project.specs}
                    </p>

                    <div className="pt-3 flex items-center justify-between gap-2 border-t border-zinc-800">
                      <button
                        type="button"
                        onClick={(e) => openLightboxForProject(project, e)}
                        className="text-xs font-black text-[#FFC400] hover:text-white uppercase flex items-center gap-1.5 transition-colors cursor-pointer py-1.5"
                      >
                        <Maximize2 className="w-4 h-4" />
                        <span>Inspect &amp; Zoom</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadWatermarkedImage(project.image, project.title);
                          }}
                          title="Download Watermarked File"
                          className="p-1.5 rounded-lg bg-zinc-900/90 hover:bg-[#FFC400] text-zinc-300 hover:text-black border border-zinc-700/60 transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleOpenDetails(project, e)}
                          className="text-xs font-black text-zinc-300 hover:text-white uppercase flex items-center gap-1 transition-colors cursor-pointer py-1.5"
                        >
                          <span>Specs</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Always-Visible Footer Card */}
              <div className="p-3.5 bg-zinc-950 border-t border-zinc-850 flex md:hidden items-center justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-white uppercase tracking-tight truncate">
                    {project.title}
                  </h4>
                  <span className="text-[10px] text-[#FFC400] uppercase font-bold block truncate">
                    {project.categoryLabel}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => openLightboxForProject(project, e)}
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-[#FFC400] hover:bg-[#FFC400] hover:text-black transition-all cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                    aria-label={`Preview full image of ${project.title}`}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleOpenDetails(project, e)}
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-[11px] font-bold uppercase transition-all cursor-pointer min-h-[38px] flex items-center justify-center"
                  >
                    Specs
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              id="portfolio-load-more-btn"
              onClick={() => setVisibleLimit((prev) => prev + 12)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#050505] hover:bg-zinc-800 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer min-h-[46px]"
            >
              <span>Load More Projects</span>
              <ArrowRight className="w-4 h-4 text-[#FFC400]" />
            </button>
          </div>
        )}

      </div>

      {/* Project Technical Specifications Modal */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Project Specifications"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 text-white relative shadow-2xl animate-fadeIn my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              aria-label="Close modal"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer transition-colors min-h-[40px] min-w-[40px]"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Modal Content Header */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <span className="bg-[#FFC400] text-black text-[10px] font-black uppercase px-2.5 py-0.5 rounded">
                  {selectedProject.categoryLabel}
                </span>
                <span className="bg-zinc-800 text-zinc-300 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded">
                  {selectedProject.tag}
                </span>
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl uppercase text-white tracking-tight">
                {selectedProject.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            {/* Original Image Preview in Modal */}
            <div 
              onClick={() => {
                const proj = selectedProject;
                setSelectedProject(null);
                openLightboxForProject(proj);
              }}
              className="relative aspect-video rounded-xl overflow-hidden bg-black mb-6 border border-zinc-800 flex items-center justify-center cursor-pointer group"
            >
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              />
              <WatermarkOverlay size="md" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                <span className="bg-[#FFC400] text-black font-black text-xs uppercase px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow">
                  <ZoomIn className="w-4 h-4" />
                  <span>Open Full-Resolution Lightbox</span>
                </span>
              </div>
            </div>

            {/* Technical Specification Blueprint Box */}
            <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 mb-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-850">
                <span className="text-xs font-black uppercase tracking-wider text-[#FFC400] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Production &amp; Engineering Blueprint</span>
                </span>
                <span className="text-[10px] font-bold text-zinc-400">100% Quality Guaranteed</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Client Account</span>
                  <span className="text-xs font-bold text-white truncate block">{selectedProject.client}</span>
                </div>
                {selectedProject.stitchCount && (
                  <div className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">Stitch Density</span>
                    <span className="text-xs font-bold text-[#FFC400]">{selectedProject.stitchCount}</span>
                  </div>
                )}
                <div className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Turnaround</span>
                  <span className="text-xs font-bold text-white">{selectedProject.turnaround || '4-12 Hours'}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Full Technical Specifications</span>
                <p className="text-xs text-zinc-300 bg-zinc-900/40 p-3 rounded-lg border border-zinc-850">
                  {selectedProject.specs}
                </p>
              </div>
            </div>

            {/* Technical Deliverables */}
            {selectedProject.deliverables && selectedProject.deliverables.length > 0 && (
              <div className="mb-6 space-y-2">
                <span className="text-[11px] font-black uppercase text-zinc-400 tracking-wider block">
                  DELIVERABLE FORMATS &amp; MACHINE COMPATIBILITY:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.deliverables.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-bold font-mono px-3 py-1.5 rounded bg-zinc-900 text-[#FFC400] border border-zinc-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold uppercase transition-colors cursor-pointer min-h-[42px]"
              >
                Close Spec Sheet
              </button>

              {onOpenQuoteModalWithItem && (
                <button
                  type="button"
                  onClick={() => {
                    const item = selectedProject.title;
                    setSelectedProject(null);
                    onOpenQuoteModalWithItem(item);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[42px]"
                >
                  <span>Order This Specification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Size Original Image Lightbox Modal */}
      <ImageLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={lightboxImages}
        currentIndex={lightboxIndex}
        onIndexChange={(newIdx) => setLightboxIndex(newIdx)}
        onOpenQuoteForProject={onOpenQuoteModalWithItem}
      />
    </section>
  );
};

