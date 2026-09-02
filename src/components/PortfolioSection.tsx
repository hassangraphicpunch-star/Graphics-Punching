import React, { useState } from 'react';
import { 
  ArrowRight, X, Layers, Tag, Clock, Palette, CheckCircle2, 
  Sparkles, Cpu, ShieldCheck, FileCode2, Maximize2, ZoomIn, Download 
} from 'lucide-react';
import { ImageLightboxModal, LightboxImageItem } from './ImageLightboxModal';
import { WatermarkOverlay } from './WatermarkOverlay';
import { WatermarkedPortfolioImage } from './WatermarkedPortfolioImage';
import { downloadWatermarkedImage } from '../utils/watermark';
import { useWebsiteSettings } from '../context/AdminSettingsContext';
import { PortfolioItem, PORTFOLIO_PROJECTS } from '../data/content';

interface PortfolioSectionProps {
  onOpenQuoteModalWithItem?: (itemTitle: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onOpenQuoteModalWithItem }) => {
  const { portfolioItems } = useWebsiteSettings();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [visibleLimit, setVisibleLimit] = useState<number>(12);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  const activeProjects: PortfolioItem[] = portfolioItems && portfolioItems.length > 0
    ? portfolioItems
    : PORTFOLIO_PROJECTS;

  const categories = [
    { id: 'all', label: 'ALL WORK' },
    { id: 'embroidery', label: 'EMBROIDERY DIGITIZING' },
    { id: 'vector-artwork', label: 'VECTOR ARTWORK' },
    { id: 'screen-printing', label: 'SCREEN PRINTING' },
  ];

  const filteredProjects = selectedCategory === 'all'
    ? activeProjects
    : activeProjects.filter((p) => p.category === selectedCategory);

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
                ? activeProjects.length 
                : activeProjects.filter(p => p.category === cat.id).length;
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

                {/* Main Original Image - Zero Cropping, Stamped with Official Watermark */}
                <WatermarkedPortfolioImage
                  src={project.image}
                  alt={project.title}
                  title={project.title}
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
                          className="text-xs font-bold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Info for Mobile and Scannability */}
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-[#0e0e11] border-t border-zinc-850">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#FFC400]">
                      {project.categoryLabel}
                    </span>
                    {project.stitchCount && (
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {project.stitchCount}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-black text-base sm:text-lg uppercase text-white tracking-tight truncate group-hover:text-[#FFC400] transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed pt-0.5">
                    {project.specs}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-850 flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-medium text-[11px] truncate max-w-[150px]">
                    {project.client}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadWatermarkedImage(project.image, project.title);
                      }}
                      className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-[#FFC400] cursor-pointer"
                      title="Download sample"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[#FFC400] font-black uppercase text-[11px] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-10 sm:mt-14 text-center">
            <button
              onClick={() => setVisibleLimit((prev) => prev + 6)}
              id="portfolio-load-more-btn"
              className="bg-[#050505] hover:bg-black text-white hover:text-[#FFC400] font-black text-xs sm:text-sm uppercase tracking-wider px-8 py-3.5 rounded-full border border-zinc-800 hover:border-[#FFC400] shadow-md transition-all duration-200 cursor-pointer min-h-[44px]"
            >
              Load More Projects ({filteredProjects.length - visibleLimit} Remaining)
            </button>
          </div>
        )}

      </div>

      {/* Lightbox Modal with Full-size original preview & details */}
      <ImageLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={lightboxImages}
        initialIndex={lightboxIndex}
        onSelectForQuote={(itemTitle) => {
          setIsLightboxOpen(false);
          if (onOpenQuoteModalWithItem) {
            onOpenQuoteModalWithItem(itemTitle);
          }
        }}
      />

      {/* Quick Details Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="bg-[#0e0e11] border border-zinc-800 rounded-3xl max-w-xl w-full p-6 text-white space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-[#FFC400]/15 text-[#FFC400] border border-[#FFC400]/30 text-xs font-black uppercase">
                {selectedProject.categoryLabel}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {selectedProject.tag}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-display font-black uppercase text-white">
              {selectedProject.title}
            </h3>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black p-3 flex items-center justify-center border border-zinc-800">
              <WatermarkedPortfolioImage
                src={selectedProject.image}
                alt={selectedProject.title}
                title={selectedProject.title}
                className="max-w-full max-h-full object-contain"
              />
              <WatermarkOverlay size="sm" />
            </div>

            <div className="space-y-2 text-xs text-zinc-300">
              <p><strong className="text-white">Specs:</strong> {selectedProject.specs}</p>
              {selectedProject.description && (
                <p><strong className="text-white">Description:</strong> {selectedProject.description}</p>
              )}
              {selectedProject.stitchCount && (
                <p><strong className="text-white">Stitch Count:</strong> {selectedProject.stitchCount}</p>
              )}
              {selectedProject.turnaround && (
                <p><strong className="text-white">Turnaround:</strong> {selectedProject.turnaround}</p>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => downloadWatermarkedImage(selectedProject.image, selectedProject.title)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold uppercase rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const title = selectedProject.title;
                  setSelectedProject(null);
                  if (onOpenQuoteModalWithItem) {
                    onOpenQuoteModalWithItem(title);
                  }
                }}
                className="px-5 py-2.5 bg-[#FFC400] hover:bg-[#ffcd1a] text-black text-xs font-black uppercase rounded-xl shadow cursor-pointer flex items-center gap-1.5"
              >
                <span>Request Similar File</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
