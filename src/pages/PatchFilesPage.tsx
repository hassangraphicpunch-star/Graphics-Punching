import React, { useState } from 'react';
import { 
  Sparkles, Award, ArrowRight, ShieldCheck, Clock, CheckCircle2, 
  Layers, ZoomIn, Maximize2, Scissors, Flame, Compass, Eye, Filter
} from 'lucide-react';
import { PORTFOLIO_PROJECTS, PortfolioItem } from '../data/content';
import { PATCH_PORTFOLIO_ITEMS, PatchPortfolioItem } from '../data/patchPortfolio';
import { ImageLightboxModal, LightboxImageItem } from '../components/ImageLightboxModal';
import { WatermarkOverlay } from '../components/WatermarkOverlay';
import { WatermarkedPortfolioImage } from '../components/WatermarkedPortfolioImage';

interface PatchFilesPageProps {
  onOpenQuoteModal: (serviceId?: string, tierId?: string, itemTitle?: string) => void;
  onNavigate: (page: string) => void;
}

// Convert PATCH_PORTFOLIO_ITEMS into unified PortfolioItem format
const showcasePatchProjects: PortfolioItem[] = PATCH_PORTFOLIO_ITEMS.map((item) => ({
  id: item.id,
  title: item.title,
  category: 'embroidery',
  categoryLabel: `Custom Patches • ${item.categoryName}`,
  image: item.image,
  tag: item.tag,
  specs: `${item.dimensions} | ${item.stitchCount} | ${item.borderType}`,
  client: `${item.applicationGarment} (Dual-View Standalone + Applied Mockup)`,
  description: `${item.standaloneDescription}\n\n${item.applicationDescription}\n\nThreads: ${item.threads}\nBacking: ${item.backingType}\nDesign Notes: ${item.patchDesignNotes}`,
  stitchCount: item.stitchCount,
  turnaround: item.turnaround,
  deliverables: item.formatFiles,
}));

// Authentic patch sewouts from the main portfolio archive
const authenticPatchProjectIds = [
  'emb-king-tiger-martial-arts',
  'emb-bandit-cowboy-mask',
  'emb-malakoff-tigers',
  'emb-tornadoes-crest',
  'emb-dog-house',
  'emb-dezertwulf',
  'vec-fort-irwin',
  'vec-mcallen-police',
  'emb-az-turf-landscape',
  'emb-breeders-cup-gold',
];

const archivePatchProjects: PortfolioItem[] = PORTFOLIO_PROJECTS.filter((p) =>
  authenticPatchProjectIds.includes(p.id) ||
  p.title.toLowerCase().includes('patch') ||
  p.tag?.toLowerCase().includes('patch')
);

// Combined all patch projects (showcase + authentic archive sewouts)
const allPatchProjects: PortfolioItem[] = [...showcasePatchProjects, ...archivePatchProjects];

export const PatchFilesPage: React.FC<PatchFilesPageProps> = ({ onOpenQuoteModal, onNavigate }) => {
  const [selectedSubFilter, setSelectedSubFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Sub-filter tabs
  const subFilters = [
    { id: 'all', label: 'All Patch Projects', count: allPatchProjects.length },
    { id: 'dual-view', label: '2-in-1 Dual View Showcases', count: showcasePatchProjects.length },
    { id: 'embroidered', label: 'Embroidered Patches', count: allPatchProjects.filter(p => p.tag?.toLowerCase().includes('embroidery') || p.title.toLowerCase().includes('embroidered') || p.id.includes('tiger') || p.id.includes('eagle')).length },
    { id: 'jacket-cap', label: 'Jacket & Cap Patches', count: allPatchProjects.filter(p => p.id.includes('jacket') || p.id.includes('cap') || p.id.includes('cowboy')).length },
    { id: 'pvc-leather', label: 'PVC, Leather & Chenille', count: allPatchProjects.filter(p => p.id.includes('pvc') || p.id.includes('leather') || p.id.includes('chenille')).length },
    { id: 'uniform', label: 'Uniform & Tactical Morale', count: allPatchProjects.filter(p => p.id.includes('uniform') || p.id.includes('military') || p.id.includes('police') || p.id.includes('irwin')).length },
  ];

  const filteredProjects = allPatchProjects.filter((p) => {
    if (selectedSubFilter === 'all') return true;
    if (selectedSubFilter === 'dual-view') return p.id.startsWith('patch-');
    if (selectedSubFilter === 'embroidered') {
      return p.tag?.toLowerCase().includes('embroidery') || p.title.toLowerCase().includes('embroidered') || p.id.includes('tiger') || p.id.includes('eagle') || p.id.includes('crest');
    }
    if (selectedSubFilter === 'jacket-cap') {
      return p.id.includes('jacket') || p.id.includes('cap') || p.id.includes('cowboy') || p.id.includes('hoodie');
    }
    if (selectedSubFilter === 'pvc-leather') {
      return p.id.includes('pvc') || p.id.includes('leather') || p.id.includes('chenille');
    }
    if (selectedSubFilter === 'uniform') {
      return p.id.includes('uniform') || p.id.includes('military') || p.id.includes('police') || p.id.includes('irwin');
    }
    return true;
  });

  const lightboxImages: LightboxImageItem[] = filteredProjects.map((p) => ({
    src: p.image,
    title: p.title,
    category: 'custom-patch',
    categoryLabel: p.categoryLabel || 'Custom Patch Design',
    tag: p.tag,
    specs: p.specs,
    client: p.client,
    description: p.description,
    stitchCount: p.stitchCount,
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
            <Award className="w-3.5 h-3.5" />
            <span>PORTFOLIO DIRECTORY / PATCH DESIGN FILES &amp; SAMPLES</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white">
            CUSTOM PATCH <span className="text-[#FFC400]">FILES &amp; SEWOUTS</span>
          </h1>

          <p className="mt-4 text-zinc-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            Factory-calibrated digital embroidery patch files, woven micro-thread files, 3D molded PVC rubber patches, debossed leather patches, and authentic production sewout mockups. Tajima .DST, Brother .PES, Wilcom .EMB, and vector cutlines included.
          </p>

          {/* Dedicated Category Navigation Buttons - All 4 styled identically */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-5xl mx-auto px-2">
            <button
              onClick={() => onNavigate('vector-files')}
              className="bg-zinc-900/90 hover:bg-[#FFC400] text-zinc-200 hover:text-black border border-zinc-800 hover:border-[#FFC400] text-xs font-black uppercase px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow whitespace-nowrap"
            >
              <span>Vector Files Only</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('embroidery-files')}
              className="bg-zinc-900/90 hover:bg-[#FFC400] text-zinc-200 hover:text-black border border-zinc-800 hover:border-[#FFC400] text-xs font-black uppercase px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow whitespace-nowrap"
            >
              <span>Embroidery Files Only</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('screen-printing-files')}
              className="bg-zinc-900/90 hover:bg-[#FFC400] text-zinc-200 hover:text-black border border-zinc-800 hover:border-[#FFC400] text-xs font-black uppercase px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow whitespace-nowrap"
            >
              <span>Screen Printing Files Only</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setSelectedSubFilter('all')}
              className="bg-[#FFC400] text-black border border-[#FFC400] text-xs font-black uppercase px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg whitespace-nowrap"
            >
              <span>Patch Files Only</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Stats Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-zinc-300">
            <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 px-3.5 py-1.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC400]" />
              <span>Embroidered, Woven, PVC &amp; Leather</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 px-3.5 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5 text-[#FFC400]" />
              <span>12–24h Standard (Rush 4–8h)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 px-3.5 py-1.5 rounded-full">
              <Scissors className="w-3.5 h-3.5 text-[#FFC400]" />
              <span>Merrowed &amp; Laser Cut Borders</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN GALLERY SECTION */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#fafafa] text-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Info Bar & Sub-Filters */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 mb-8 border-b border-zinc-200">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFC400]" />
                <h2 className="font-display font-black text-2xl sm:text-3xl uppercase text-zinc-900">
                  Patch Projects &amp; Samples ({filteredProjects.length})
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                Showing custom patch designs, embroidered crests, 3D PVC rubber, laser-etched leather, and varsity chenille. Click any patch to inspect stitching in high-res zoom.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigate('patch-design')}
                className="bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border border-zinc-800 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-[#FFC400]" />
                <span>Patch Guide &amp; Calculator</span>
              </button>

              <button
                onClick={() => onOpenQuoteModal('embroidery', 'patch-digitizing', 'Custom Patch Files')}
                className="bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <span>Order Patch Files</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sub-Filter Pills */}
          <div className="w-full overflow-x-auto pb-3 mb-8 no-scrollbar">
            <div className="flex items-center gap-2 min-w-max px-1">
              {subFilters.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedSubFilter(tab.id)}
                  className={`text-xs font-extrabold uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                    selectedSubFilter === tab.id
                      ? 'bg-[#050505] text-[#FFC400] shadow ring-2 ring-[#FFC400]/40'
                      : 'bg-white text-zinc-700 hover:bg-zinc-200 hover:text-black border border-zinc-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    selectedSubFilter === tab.id ? 'bg-[#FFC400] text-black' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProjects.map((project, idx) => (
              <div
                key={project.id}
                id={`patch-file-${project.id}`}
                onClick={() => openLightbox(idx)}
                className="group relative rounded-2xl overflow-hidden bg-[#0c0c0e] shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-zinc-800 hover:border-[#FFC400] flex flex-col justify-between"
              >
                {/* Image Container with 4:3 Aspect Ratio */}
                <div className="relative aspect-[4/3] w-full flex items-center justify-center p-3 overflow-hidden bg-black select-none">
                  <WatermarkedPortfolioImage
                    src={project.image}
                    alt={project.title}
                    title={project.title}
                    className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Watermark Overlay */}
                  <WatermarkOverlay position="diagonal" opacity={0.25} />

                  {/* Tag Badge */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                    <span className="bg-black/90 backdrop-blur-md text-[#FFC400] border border-[#FFC400]/40 text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow">
                      {project.tag || 'Custom Patch'}
                    </span>
                  </div>

                  {/* Dual View Indicator for 2-in-1 items */}
                  {project.id.startsWith('patch-') && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-[#FFC400] text-black text-[10px] font-black uppercase px-2 py-0.5 rounded shadow flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>2-in-1 Dual View</span>
                      </span>
                    </div>
                  )}

                  {/* Hover Inspect Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 z-20">
                    <span className="bg-[#FFC400] text-black text-xs font-black uppercase px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-xl font-sans">
                      <ZoomIn className="w-4 h-4" />
                      <span>Inspect Stitching &amp; Finish</span>
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-zinc-950">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-[#FFC400] mb-1.5">
                      <span>{project.categoryLabel || 'Custom Patch Digitizing'}</span>
                      {project.stitchCount && (
                        <span className="text-zinc-400 font-bold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                          {project.stitchCount}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-base sm:text-lg uppercase text-white group-hover:text-[#FFC400] transition-colors line-clamp-2">
                      {project.title}
                    </h3>

                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      {project.specs}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800/90 flex items-center justify-between text-xs">
                    <span className="text-zinc-400 text-[11px] truncate max-w-[170px] font-medium">
                      {project.client}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                      className="text-[#FFC400] hover:text-white font-bold flex items-center gap-1 cursor-pointer shrink-0 text-[11px]"
                    >
                      <span>Full Specs</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA Banner */}
          <div className="mt-16 bg-[#0c0c0e] border border-zinc-800 rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-[#FFC400]/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-[#FFC400] block">
                COMMERCIAL PATCH DIGITIZING &amp; EMBROIDERY FILES
              </span>
              <h3 className="font-display font-black text-2xl sm:text-4xl uppercase">
                Ready to Order Custom Patch Files?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl mx-auto">
                Send us your artwork or sketch. We digitize with calibrated underlays, clean merrowed borders, and multi-format files (.DST, .PES, .EXP, .EMB) in 12–24 hours (rush 4–8h).
              </p>
              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => onOpenQuoteModal('embroidery', 'patch-digitizing', 'Custom Patch Files Order')}
                  className="bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Get Instant Patch Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('patch-design')}
                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Patch Size &amp; Stitch Calculator</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FFC400]" />
                </button>
              </div>
            </div>
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
        onOpenQuoteForProject={(title) => onOpenQuoteModal('embroidery', 'patch-digitizing', title)}
      />

      {/* Project Details Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 text-white max-h-[90vh] overflow-y-auto space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <span className="text-[10px] font-black uppercase text-[#FFC400]">
                  {selectedProject.categoryLabel || 'Custom Patch Specifications'}
                </span>
                <h3 className="font-display font-bold text-lg uppercase text-white">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-zinc-400 hover:text-white p-1 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-[4/3] bg-black rounded-xl overflow-hidden p-2 flex items-center justify-center">
              <WatermarkedPortfolioImage
                src={selectedProject.image}
                alt={selectedProject.title}
                title={selectedProject.title}
                className="max-w-full max-h-full object-contain"
              />
              <WatermarkOverlay position="diagonal" opacity={0.25} />
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <p><strong className="text-white uppercase">Client / Product:</strong> {selectedProject.client}</p>
              <p><strong className="text-white uppercase">Specifications:</strong> {selectedProject.specs}</p>
              <div className="whitespace-pre-line leading-relaxed text-zinc-300">
                <strong className="text-white uppercase block mb-1">Description:</strong>
                {selectedProject.description}
              </div>
              {selectedProject.stitchCount && (
                <p><strong className="text-white uppercase">Stitch Count:</strong> {selectedProject.stitchCount}</p>
              )}
              {selectedProject.turnaround && (
                <p><strong className="text-white uppercase">Standard Turnaround:</strong> {selectedProject.turnaround}</p>
              )}
              {selectedProject.deliverables && selectedProject.deliverables.length > 0 && (
                <div>
                  <strong className="text-white uppercase block mb-1">Deliverables &amp; Formats:</strong>
                  <ul className="list-disc list-inside space-y-0.5 text-zinc-400">
                    {selectedProject.deliverables.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
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
                  const title = selectedProject.title;
                  setSelectedProject(null);
                  onOpenQuoteModal('embroidery', 'patch-digitizing', title);
                }}
                className="px-5 py-2 bg-[#FFC400] hover:bg-[#ffcd1a] text-black text-xs font-black uppercase rounded-lg cursor-pointer flex items-center gap-1.5"
              >
                <span>Request Similar Patch Files</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
