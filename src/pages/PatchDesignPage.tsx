import React, { useState } from 'react';
import { 
  Shield, Layers, CheckCircle2, Clock, Cpu, ArrowRight, 
  ZoomIn, Sparkles, Award, Scissors, Flame, Compass, 
  HelpCircle, ChevronDown, ChevronUp, Sliders, Check,
  ExternalLink, FileText, Download, ShieldCheck
} from 'lucide-react';
import { PORTFOLIO_PROJECTS, PortfolioItem } from '../data/content';
import { ImageLightboxModal, LightboxImageItem } from '../components/ImageLightboxModal';
import { WatermarkOverlay } from '../components/WatermarkOverlay';
import { WatermarkedPortfolioImage } from '../components/WatermarkedPortfolioImage';

interface PatchDesignPageProps {
  onOpenQuoteModal: (serviceId?: string, tierId?: string, itemTitle?: string) => void;
  onNavigate: (page: string) => void;
}

// Curated list of projects that represent custom patches
const PATCH_PROJECT_IDS = [
  'emb-king-tiger-martial-arts',
  'emb-bandit-cowboy',
  'vec-fort-irwin',
  'vec-mcallen-police',
  'emb-malakoff-tigers',
  'emb-tornadoes-crest',
  'emb-dog-house',
  'emb-dezertwulf',
  'emb-breeders-cup',
  'emb-hunt-horse-hound',
  'emb-az-turf',
  'emb-ms-dragon',
  'emb-two-bears',
  'emb-betancourt-dice',
  'emb-scotts-towing',
];

interface PatchTypeInfo {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  description: string;
  bestFor: string;
  minText: string;
  borderRecommended: string;
  durability: string;
  stitchFeature: string;
}

const PATCH_TYPES: PatchTypeInfo[] = [
  {
    id: 'embroidered',
    name: 'Custom Embroidered Patches',
    subtitle: 'The timeless industry standard',
    badge: 'Most Popular',
    description: 'Classic dimensional thread stitched into heavy poly-cotton twill. Available in 50%, 75%, and 100% full thread coverage with vibrant Madeira rayon/poly threads.',
    bestFor: 'Uniforms, military, martial arts, biker clubs, corporate workwear & hats',
    minText: '4.5mm (0.18") height',
    borderRecommended: 'Merrowed (Standard shapes) or Laser-cut (Contours)',
    durability: 'Extreme (Industrial washable, UV fade resistant)',
    stitchFeature: 'Multi-directional tatami and raised satin stitchwork',
  },
  {
    id: 'woven',
    name: 'High-Definition Woven Patches',
    subtitle: 'Micro-thread precision for intricate details',
    badge: 'Razor-Sharp Details',
    description: 'Woven continuously on high-density looms using ultra-fine micro-yarns. Flat, clean surface capturing razor-sharp fine lines and micro-lettering impossible with standard embroidery.',
    bestFor: 'Complex logos with small text, gradients, detailed crests & apparel tags',
    minText: '2.0mm (0.08") height',
    borderRecommended: 'Merrowed border or laser-cut heat-sealed border',
    durability: 'High (Thin, flexible, soft on skin)',
    stitchFeature: 'Continuous high-density micro-thread weave',
  },
  {
    id: 'pvc',
    name: '3D Molded PVC / Rubber Patches',
    subtitle: 'All-weather tactical dimension',
    badge: '100% Waterproof',
    description: 'Cast from durable, flexible polyvinyl chloride with deep recessed channels and 3D sculpted relief. Completely waterproof, mud-proof, and impervious to extreme weather.',
    bestFor: 'Tactical gear, airsoft, outdoor outerwear, backpacks & maritime teams',
    minText: '1.5mm molded relief',
    borderRecommended: 'Recessed perimeter sewing channel for velcro backing',
    durability: 'Indestructible (All-weather, non-fading, washable)',
    stitchFeature: 'Sewn perimeter groove with hook & loop backing',
  },
  {
    id: 'leather',
    name: 'Laser-Etched Leather & Leatherette',
    subtitle: 'Rustic artisanal craftsman finish',
    badge: 'Premium Lifestyle',
    description: 'Precision laser-engraved, debossed, or foil-stamped genuine steerhide and high-grade vegan leatherette. Delivers an authentic rustic, vintage, or luxury presentation.',
    bestFor: 'Trucker snapbacks, beanies, denim jackets, craft breweries & artisan goods',
    minText: 'Laser-etched vector precision',
    borderRecommended: 'Perimeter running-stitch groove for machine attachment',
    durability: 'Long-lasting natural patina with age',
    stitchFeature: 'Clean vector pathing and laser engraving vector files',
  },
  {
    id: 'chenille',
    name: 'Chenille & Varsity Letterman Patches',
    subtitle: 'Nostalgic retro plush athletic loops',
    badge: 'Vintage Collegiate',
    description: 'Plush, 3D textured yarn loops mounted onto stiff dual-layer wool felt backings. Delivers authentic collegiate varsity athletic pride with bold, tactile dimension.',
    bestFor: 'Letterman jackets, varsity sports teams, cheerleading & retro streetwear',
    minText: 'Large block typography (12mm+)',
    borderRecommended: 'Dual-layer felt border with chain-stitch perimeter',
    durability: 'High (Dry-clean or gentle wash recommended)',
    stitchFeature: 'Moss stitch loops and heavy chain-stitch outlines',
  },
  {
    id: 'sublimated',
    name: 'Printed / Dye-Sublimated Patches',
    subtitle: 'Photographic continuous tone gradients',
    badge: 'Full Color Photo',
    description: 'High-temperature dye sublimation infusing full-color photographic imagery and subtle color gradients into poly-twill fabric, encased with a genuine stitched merrowed border.',
    bestFor: 'Complex photorealistic art, multi-gradient logos, paintings & album art',
    minText: '1.0mm photographic clarity',
    borderRecommended: 'Overlocked merrowed embroidered edge',
    durability: 'Very High (Sublimation ink chemically bonded to fabric)',
    stitchFeature: 'Vector cutline and high-density merrowed edge file',
  },
];

const PATCH_BORDERS = [
  {
    name: 'Merrowed Overlock Border',
    width: '1/8" (3.2mm) heavy wrapped edge',
    icon: Scissors,
    tag: 'Classic & Most Durable',
    description: 'A traditional heavy continuous thread border looped completely over the patch edge. Prevents fabric fraying and gives patches a classic, substantial vintage feel.',
    bestShapes: 'Circles, squares, rectangles, ovals, and standard symmetric shields.',
  },
  {
    name: 'Hot-Cut / Laser-Cut Satin Border',
    width: '1/16" (1.6mm) flush sealed edge',
    icon: Flame,
    tag: 'Complex Custom Shapes',
    description: 'A high-density satin stitch border sealed using precision laser thermal cutting. Cut precisely along the contour of stars, flames, text outlines, and irregular custom silhouettes.',
    bestShapes: 'Die-cut shapes, mascot silhouettes, custom crests, and jagged contours.',
  },
  {
    name: 'Embroidered Applique Border',
    width: 'Direct satin border with placement run',
    icon: Layers,
    tag: 'Garment Applique',
    description: 'Engineered with a preliminary tackdown run and final satin border so the patch can be embroidered directly onto cut garment panels before garment assembly.',
    bestShapes: 'Tackle twill numbers, large front hoodies, and uniform appliques.',
  },
];

const PATCH_BACKINGS = [
  {
    name: 'Heat-Seal / Iron-On',
    icon: Flame,
    description: 'Commercial-grade thermo-plastic adhesive film applied to the rear. Bonds permanently to cotton, denim, and poly-blend garments with a heat press (320°F for 15-20s) or home iron.',
    popularity: 'Best for Retail & Event Merch',
  },
  {
    name: 'Tactical Hook & Loop (Velcro)',
    icon: ShieldCheck,
    description: 'High-strength male hook fastener machine-sewn to the rear of the patch. Comes with matching soft female loop fabric piece for tactical vests, operator caps, and uniforms.',
    popularity: 'Standard for Military & Tactical',
  },
  {
    name: 'Peel-and-Stick Adhesive',
    icon: Sparkles,
    description: 'Pressure-sensitive peel-off paper backing with high-tack glue. Perfect for temporary one-day attachment to jackets, convention badges, and hard surfaces.',
    popularity: 'Temporary & Promotional Events',
  },
  {
    name: 'Traditional Sew-On (Twill Backing)',
    icon: Scissors,
    description: 'Smooth, durable plain fabric backing with zero adhesive. Allows tailors, leatherworkers, and riders to sew the patch directly onto leather vests, heavy denim, and bags.',
    popularity: 'Maximum Permanent Durability',
  },
  {
    name: 'Magnetic Fasteners',
    icon: Cpu,
    description: 'Dual-bar neodymium magnetic backing that holds securely through fabric without piercing, puncturing, or damaging delicate silk, suits, or dress shirts.',
    popularity: 'Formal & Corporate Uniforms',
  },
];

export const PatchDesignPage: React.FC<PatchDesignPageProps> = ({ onOpenQuoteModal, onNavigate }) => {
  // Gallery state
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'martial' | 'tactical' | 'crest' | 'mascot'>('all');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Active Patch Type Tab
  const [activePatchTab, setActivePatchTab] = useState<string>('embroidered');

  // Interactive Patch Size Estimator State
  const [patchShape, setPatchShape] = useState<'circle' | 'shield' | 'rectangle' | 'custom'>('circle');
  const [patchWidth, setPatchWidth] = useState<number>(3.5);
  const [patchHeight, setPatchHeight] = useState<number>(3.5);
  const [coverage, setCoverage] = useState<'50' | '75' | '100'>('75');
  const [borderType, setBorderType] = useState<string>('merrowed');
  const [backingType, setBackingType] = useState<string>('iron-on');

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Filter curated patch projects
  const allPatchProjects = PORTFOLIO_PROJECTS.filter((p) => PATCH_PROJECT_IDS.includes(p.id));

  const filteredProjects = allPatchProjects.filter((p) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'martial') {
      return p.id.includes('tiger') || p.id.includes('dragon') || p.id.includes('martial');
    }
    if (selectedFilter === 'tactical') {
      return p.id.includes('irwin') || p.id.includes('police') || p.id.includes('turf');
    }
    if (selectedFilter === 'crest') {
      return p.id.includes('crest') || p.id.includes('breeders') || p.id.includes('hound');
    }
    if (selectedFilter === 'mascot') {
      return p.id.includes('cowboy') || p.id.includes('dog') || p.id.includes('wulf') || p.id.includes('bears') || p.id.includes('dice');
    }
    return true;
  });

  // Prepare Lightbox Items
  const lightboxImages: LightboxImageItem[] = filteredProjects.map((p) => ({
    src: p.image,
    title: p.title,
    category: p.category,
    categoryLabel: 'Custom Patch Design',
    tag: p.tag || 'Patch Master',
    specs: p.specs,
    client: p.client,
    description: p.description,
    stitchCount: p.stitchCount,
    turnaround: p.turnaround || '24–48h',
    deliverables: p.deliverables || [
      'Tajima .DST Machine File',
      'Wilcom .EMB Native Source File',
      'High-Res Stitch Simulation Proof',
      'Vector Cutline for Border'
    ],
  }));

  const openLightbox = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  // Standard patch size formula used by embroidery industry: (Width + Height) / 2
  const calculatedPatchSize = ((patchWidth + patchHeight) / 2).toFixed(1);
  const sizeNum = parseFloat(calculatedPatchSize);

  // Calculate estimated stitches and pricing
  let estimatedStitches = '12,000 – 16,000';
  let digitizingRate = '$15';
  let tierLabel = 'Small Patch';

  if (sizeNum <= 3.0) {
    estimatedStitches = coverage === '100' ? '12,000 – 15,000' : coverage === '75' ? '9,000 – 12,000' : '6,000 – 9,000';
    digitizingRate = '$15';
    tierLabel = 'Small / Cap Patch (Up to 3.0")';
  } else if (sizeNum <= 4.5) {
    estimatedStitches = coverage === '100' ? '18,000 – 26,000' : coverage === '75' ? '14,000 – 19,000' : '10,000 – 14,000';
    digitizingRate = '$25';
    tierLabel = 'Standard Uniform Patch (3.5" – 4.5")';
  } else if (sizeNum <= 7.0) {
    estimatedStitches = coverage === '100' ? '30,000 – 45,000' : coverage === '75' ? '24,000 – 32,000' : '18,000 – 24,000';
    digitizingRate = '$35';
    tierLabel = 'Medium / Large Emblem (5.0" – 7.0")';
  } else {
    estimatedStitches = coverage === '100' ? '50,000 – 80,000+' : coverage === '75' ? '40,000 – 60,000' : '30,000 – 45,000';
    digitizingRate = '$50';
    tierLabel = 'Oversized Jacket Back Rocker (8.0"+)';
  }

  const handleOrderCustomPatch = () => {
    const customSummary = `Custom Patch (${patchShape.toUpperCase()} ${patchWidth}"x${patchHeight}", Size: ${calculatedPatchSize}", ${coverage}% coverage, ${borderType} border, ${backingType} backing)`;
    onOpenQuoteModal('embroidery', 'patch-digitizing', customSummary);
  };

  const patchFaqs = [
    {
      q: 'What is the standard industry formula for patch size?',
      a: 'In commercial embroidery, patch size is measured as (Width + Height) ÷ 2. For example, a 4-inch wide by 3-inch high rectangular or oval patch equals (4 + 3) ÷ 2 = 3.5 inches. This formula accounts for the total square area and thread consumption.',
    },
    {
      q: 'What is the difference between a Merrowed Border and a Laser-Cut Border?',
      a: 'A Merrowed border uses an industrial 1/8" overlock stitch wrapped around the outer edge of the patch. It requires a uniform shape (circle, square, rectangle, oval) and produces the classic, heavy vintage patch edge. A Laser-Cut (or Hot-Cut) border uses a dense satin stitch sealed by a high-precision laser, allowing intricate, die-cut silhouette shapes such as flames, animal heads, or irregular contour lettering.',
    },
    {
      q: 'What is the minimum text height for embroidered patches?',
      a: 'For embroidered patches, we recommend a minimum letter height of 4.5mm (approx. 0.18" or 14-16pt font) to ensure clean, crisp, legible thread loops without bunched stitches. If your artwork contains micro-text below 4mm, we recommend our High-Definition Woven Patch digitizing, which supports text as small as 2.0mm.',
    },
    {
      q: 'What digital machine file formats do you deliver for custom patches?',
      a: 'Every patch digitizing order includes production-tested Tajima (.DST), Brother/Baby Lock (.PES), Melco (.EXP), Barudan (.DSB), Husqvarna (.VP3), and native Wilcom (.EMB) files, complete with a 1:1 scale printable PDF color run worksheet and Madeira/Isacord thread stop mappings.',
    },
    {
      q: 'Can you digitize patches with Velcro (Hook & Loop) or Iron-On backings?',
      a: 'Yes! We configure the stitch density and underlay specifically for your intended backing. For example, patches with heavy heat-seal backing require balanced pull compensation to prevent fabric curl, and tactical patches with Velcro require reinforced perimeter stitching lines to lock the hook backing securely.',
    },
    {
      q: 'What is your turnaround time for patch digitizing?',
      a: 'Our standard turnaround is 12 to 24 hours. We also offer 4 to 8 hour rush delivery for urgent production runs. Revisions for minor sizing, thread color swaps, or border tweaks are always free until your sewout runs smoothly.',
    },
  ];

  return (
    <div className="animate-fadeIn">
      {/* 1. HERO HEADER */}
      <div className="bg-[#050505] text-white py-14 sm:py-20 border-b border-zinc-800 relative overflow-hidden">
        {/* Subtle Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFC400]/15 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/25 text-[#FFC400] text-xs font-black tracking-widest uppercase mb-4 shadow-sm">
            <Shield className="w-3.5 h-3.5" />
            <span>CUSTOM EMBROIDERY &amp; PATCH DIGITIZING</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight text-white max-w-5xl mx-auto">
            CUSTOM PATCH <span className="text-[#FFC400]">DESIGN &amp; DIGITIZING</span>
          </h1>

          <p className="mt-5 text-zinc-300 text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Factory-calibrated digital embroidery files, vector line masters, and sewout proofs for custom embroidered, woven, PVC, leather, and varsity chenille patches. Guaranteed zero thread breaks, clean merrowed borders, and calibrated underlays.
          </p>

          {/* Value Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-semibold text-zinc-300">
            <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 px-3.5 py-1.5 rounded-full">
              <Scissors className="w-3.5 h-3.5 text-[#FFC400]" />
              <span>Merrowed &amp; Laser-Cut Borders</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 px-3.5 py-1.5 rounded-full">
              <Flame className="w-3.5 h-3.5 text-[#FFC400]" />
              <span>Iron-On &amp; Velcro Backing Ready</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 px-3.5 py-1.5 rounded-full">
              <Cpu className="w-3.5 h-3.5 text-[#FFC400]" />
              <span>Tajima DST, EMB, PES &amp; EXP</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 px-3.5 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5 text-[#FFC400]" />
              <span>4–8 Hour Rush Available</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenQuoteModal('embroidery', 'patch-digitizing', 'Custom Patch Design & Digitizing')}
              className="bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-[0_4px_20px_rgba(255,196,0,0.35)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
            >
              <span>Get Instant Patch Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#patch-calculator"
              className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 font-bold text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-[#FFC400]" />
              <span>Patch Size &amp; Stitch Calculator</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. PATCH TYPES & STYLES SELECTOR */}
      <section className="py-14 sm:py-20 bg-[#0a0a0c] text-white border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/25 text-[#FFC400] text-xs font-black tracking-widest uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VARIETIES &amp; FABRICATION METHODS</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl uppercase text-white">
              SELECT YOUR <span className="text-[#FFC400]">PATCH STYLE</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              We digitize and prepare production-ready vector masters and machine stitch files for every major patch manufacturing process.
            </p>
          </div>

          {/* Patch Type Nav Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
            {PATCH_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setActivePatchTab(type.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  activePatchTab === type.id
                    ? 'bg-[#FFC400] text-black shadow-md'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                <span>{type.name.replace('Custom ', '')}</span>
                {type.id === 'embroidered' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Active Patch Detail Card */}
          {PATCH_TYPES.filter((t) => t.id === activePatchTab).map((type) => (
            <div
              key={type.id}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="bg-[#FFC400] text-black text-xs font-black uppercase px-3 py-1 rounded-full">
                      {type.badge}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      {type.subtitle}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-2xl sm:text-3xl uppercase text-white">
                    {type.name}
                  </h3>

                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {type.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="bg-zinc-900/80 border border-zinc-800/80 p-3.5 rounded-xl">
                      <span className="text-[11px] font-black uppercase text-[#FFC400] block mb-1">
                        Best For
                      </span>
                      <p className="text-xs text-zinc-300">{type.bestFor}</p>
                    </div>

                    <div className="bg-zinc-900/80 border border-zinc-800/80 p-3.5 rounded-xl">
                      <span className="text-[11px] font-black uppercase text-[#FFC400] block mb-1">
                        Minimum Lettering Height
                      </span>
                      <p className="text-xs text-zinc-300">{type.minText}</p>
                    </div>

                    <div className="bg-zinc-900/80 border border-zinc-800/80 p-3.5 rounded-xl">
                      <span className="text-[11px] font-black uppercase text-[#FFC400] block mb-1">
                        Border Recommendation
                      </span>
                      <p className="text-xs text-zinc-300">{type.borderRecommended}</p>
                    </div>

                    <div className="bg-zinc-900/80 border border-zinc-800/80 p-3.5 rounded-xl">
                      <span className="text-[11px] font-black uppercase text-[#FFC400] block mb-1">
                        Durability &amp; Care
                      </span>
                      <p className="text-xs text-zinc-300">{type.durability}</p>
                    </div>
                  </div>

                  <div className="pt-3 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => onOpenQuoteModal('embroidery', 'patch-digitizing', `${type.name} Digitizing`)}
                      className="bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Quote for {type.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-zinc-400">
                      Standard Turnaround: <strong>12–24h (Rush 4–8h)</strong>
                    </span>
                  </div>
                </div>

                {/* Right Visual Features Box */}
                <div className="lg:col-span-5 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-4">
                  <h4 className="font-display font-bold text-sm uppercase text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
                    <ShieldCheck className="w-4 h-4 text-[#FFC400]" />
                    <span>Quality Specifications Guaranteed</span>
                  </h4>

                  <ul className="space-y-3 text-xs text-zinc-300">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#FFC400] shrink-0 mt-0.5" />
                      <span><strong>Pull-Compensated Underlay:</strong> Specifically balanced to avoid puckering on dense patch twill and backing adhesives.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#FFC400] shrink-0 mt-0.5" />
                      <span><strong>Border Overlap Integration:</strong> Pre-programmed outer guide stitches ensuring seamless alignment with merrowing machines or laser cutters.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#FFC400] shrink-0 mt-0.5" />
                      <span><strong>Color Run Sequence Sheet:</strong> Accurate thread stop breakdown matching Madeira, Isacord, and Marathon thread swatches.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#FFC400] shrink-0 mt-0.5" />
                      <span><strong>Full Multi-Format File Pack:</strong> Tajima .DST, Brother .PES, Melco .EXP, Barudan .DSB &amp; Wilcom .EMB included.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CURATED PATCH GALLERY */}
      <section className="py-14 sm:py-20 bg-[#fafafa] text-zinc-900 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 mb-8 border-b border-zinc-200">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-[#FFC400] text-xs font-black tracking-widest uppercase mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>AUTHENTIC PRODUCTION ARCHIVE</span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-4xl uppercase text-zinc-900">
                CUSTOM PATCH <span className="text-[#FFC400]">PORTFOLIO &amp; SEWOUTS</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                Real production sewouts, uniform patch crests, martial arts patches, and tactical emblems digitized by our master team. Click any patch to open in high-res zoom.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
              {[
                { id: 'all', label: 'All Patches' },
                { id: 'martial', label: 'Martial Arts' },
                { id: 'tactical', label: 'Tactical & Uniform' },
                { id: 'crest', label: 'Athletic Crests' },
                { id: 'mascot', label: 'Mascot & Club' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    selectedFilter === tab.id
                      ? 'bg-black text-[#FFC400] shadow'
                      : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Patch Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProjects.map((project, idx) => (
              <div
                key={project.id}
                id={`patch-item-${project.id}`}
                onClick={() => openLightbox(idx)}
                className="group relative rounded-2xl overflow-hidden bg-[#0c0c0e] shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-zinc-800 hover:border-[#FFC400] flex flex-col justify-between"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full flex items-center justify-center p-3 overflow-hidden bg-black select-none">
                  <WatermarkedPortfolioImage
                    src={project.image}
                    alt={project.title}
                    title={project.title}
                    className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Watermark Overlay */}
                  <WatermarkOverlay position="diagonal" opacity={0.28} />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                    <span className="bg-black/90 text-[#FFC400] border border-[#FFC400]/40 text-[10px] font-black uppercase px-2.5 py-1 rounded shadow">
                      {project.tag || 'Custom Patch'}
                    </span>
                  </div>

                  {/* Hover Inspect Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 z-20">
                    <span className="bg-[#FFC400] text-black text-xs font-black uppercase px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xl font-sans">
                      <ZoomIn className="w-4 h-4" />
                      <span>Inspect Stitching &amp; Border</span>
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-zinc-950">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-[#FFC400] mb-1.5">
                      <span>Custom Patch Digitizing</span>
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
                    <span className="text-zinc-400 text-[11px] truncate max-w-[150px] font-medium">
                      {project.client}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                      className="text-[#FFC400] hover:text-white font-bold flex items-center gap-1 cursor-pointer shrink-0 text-[11px]"
                    >
                      <span>View Patch Specs</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. INTERACTIVE PATCH SIZE & STITCH ESTIMATOR CALCULATOR */}
      <section id="patch-calculator" className="py-14 sm:py-20 bg-[#0c0c0e] text-white border-b border-zinc-800 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/25 text-[#FFC400] text-xs font-black tracking-widest uppercase mb-3">
              <Sliders className="w-3.5 h-3.5" />
              <span>INTERACTIVE ESTIMATION TOOL</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl uppercase text-white">
              PATCH SIZE &amp; <span className="text-[#FFC400]">STITCH CALCULATOR</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Use the official commercial formula <strong>(Width + Height) ÷ 2</strong> to calculate your patch scale, estimated stitch range, and instant flat digitizing quote.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl">
            
            {/* Controls Side */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Shape Selection */}
              <div>
                <label className="block text-xs font-black uppercase text-zinc-300 tracking-wider mb-2.5">
                  1. Choose Patch Silhouette Shape
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'circle', label: 'Circle / Round' },
                    { id: 'shield', label: 'Shield / Crest' },
                    { id: 'rectangle', label: 'Rectangle / Bar' },
                    { id: 'custom', label: 'Custom Contour' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setPatchShape(s.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer text-center border ${
                        patchShape === s.id
                          ? 'bg-[#FFC400] text-black border-[#FFC400] shadow'
                          : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dimensions Sliders */}
              <div className="space-y-4">
                <label className="block text-xs font-black uppercase text-zinc-300 tracking-wider">
                  2. Set Dimensions in Inches
                </label>

                {/* Width */}
                <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Width:</span>
                    <span className="font-mono font-black text-[#FFC400] text-sm bg-black px-2.5 py-0.5 rounded border border-zinc-800">
                      {patchWidth.toFixed(1)} inches ({Math.round(patchWidth * 25.4)} mm)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.5"
                    max="12.0"
                    step="0.25"
                    value={patchWidth}
                    onChange={(e) => setPatchWidth(parseFloat(e.target.value))}
                    className="w-full accent-[#FFC400] cursor-pointer h-2 bg-zinc-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>1.5" (Small Cap)</span>
                    <span>3.5" (Uniform)</span>
                    <span>7.0" (Back)</span>
                    <span>12.0" (Oversized)</span>
                  </div>
                </div>

                {/* Height */}
                <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Height:</span>
                    <span className="font-mono font-black text-[#FFC400] text-sm bg-black px-2.5 py-0.5 rounded border border-zinc-800">
                      {patchHeight.toFixed(1)} inches ({Math.round(patchHeight * 25.4)} mm)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.5"
                    max="12.0"
                    step="0.25"
                    value={patchHeight}
                    onChange={(e) => setPatchHeight(parseFloat(e.target.value))}
                    className="w-full accent-[#FFC400] cursor-pointer h-2 bg-zinc-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>1.5"</span>
                    <span>3.5"</span>
                    <span>7.0"</span>
                    <span>12.0"</span>
                  </div>
                </div>
              </div>

              {/* Thread Coverage */}
              <div>
                <label className="block text-xs font-black uppercase text-zinc-300 tracking-wider mb-2">
                  3. Thread Coverage Percentage
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '50', label: '50% Coverage', desc: 'Logo on exposed twill background' },
                    { id: '75', label: '75% Coverage', desc: 'Standard medium fill embroidery' },
                    { id: '100', label: '100% Coverage', desc: 'Full stitched background & motifs' },
                  ].map((cov) => (
                    <button
                      key={cov.id}
                      onClick={() => setCoverage(cov.id as any)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        coverage === cov.id
                          ? 'bg-[#FFC400]/15 border-[#FFC400] text-white'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-black uppercase text-[#FFC400]">{cov.label}</div>
                      <div className="text-[10px] text-zinc-400 mt-1 leading-tight">{cov.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Border & Backing Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-zinc-300 tracking-wider mb-1.5">
                    Border Finishing
                  </label>
                  <select
                    value={borderType}
                    onChange={(e) => setBorderType(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#FFC400] outline-none cursor-pointer"
                  >
                    <option value="merrowed">Merrowed Overlock (1/8")</option>
                    <option value="laser-cut">Laser-Cut / Hot-Cut Satin</option>
                    <option value="satin-edge">Smooth Satin Edge</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-zinc-300 tracking-wider mb-1.5">
                    Backing Fastener
                  </label>
                  <select
                    value={backingType}
                    onChange={(e) => setBackingType(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#FFC400] outline-none cursor-pointer"
                  >
                    <option value="iron-on">Heat-Seal / Iron-on</option>
                    <option value="velcro">Hook &amp; Loop (Velcro)</option>
                    <option value="sew-on">Plain Twill (Sew-On)</option>
                    <option value="peel-stick">Peel-and-Stick Adhesive</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Results Output Box */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-7 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFC400]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#FFC400]">
                    Calculated Patch Size
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    ({patchWidth}" + {patchHeight}") ÷ 2
                  </span>
                </div>

                {/* Big Size Display */}
                <div className="text-center py-2">
                  <div className="font-display font-black text-5xl sm:text-6xl text-white">
                    {calculatedPatchSize}<span className="text-[#FFC400] text-3xl">"</span>
                  </div>
                  <span className="inline-block mt-2 text-xs font-black uppercase text-[#FFC400] bg-black px-3 py-1 rounded-full border border-zinc-800">
                    {tierLabel}
                  </span>
                </div>

                {/* Specifications List */}
                <div className="space-y-2.5 text-xs bg-black/60 p-4 rounded-xl border border-zinc-800/80">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Dimensions:</span>
                    <span className="font-bold text-white">{patchWidth}" W × {patchHeight}" H</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Coverage:</span>
                    <span className="font-bold text-white">{coverage}% Thread Fill</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Est. Stitch Count:</span>
                    <span className="font-mono font-bold text-[#FFC400]">{estimatedStitches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Border Style:</span>
                    <span className="font-bold text-white capitalize">{borderType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Backing Type:</span>
                    <span className="font-bold text-white capitalize">{backingType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Turnaround:</span>
                    <span className="font-bold text-white">12–24 Hours (Express 4–8h)</span>
                  </div>
                </div>

                {/* Digitizing Rate */}
                <div className="bg-[#FFC400]/10 border border-[#FFC400]/30 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-zinc-400 block">
                      Digitizing File Package
                    </span>
                    <span className="text-xs text-white font-bold">
                      Includes DST, PES, EMB &amp; Sewout Proof
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-display font-black text-2xl sm:text-3xl text-[#FFC400]">
                      {digitizingRate}
                    </span>
                    <span className="text-[10px] text-zinc-400 block font-mono">flat rate</span>
                  </div>
                </div>
              </div>

              {/* Order Button */}
              <div className="mt-6 pt-4 border-t border-zinc-800">
                <button
                  onClick={handleOrderCustomPatch}
                  className="w-full bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Order This Patch Digitizing ({digitizingRate})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-zinc-400 text-center mt-2">
                  Zero risk: Free adjustments until your machine test runs clean.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. PATCH ANATOMY: BORDERS & BACKINGS EXPLAINED */}
      <section className="py-14 sm:py-20 bg-[#fafafa] text-zinc-900 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-[#FFC400] text-xs font-black tracking-widest uppercase mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>ENGINEERING &amp; ANATOMY GUIDE</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl uppercase text-zinc-900">
              PATCH BORDER &amp; <span className="text-[#FFC400]">BACKING GUIDE</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-2">
              Every detail matters. We calibrate border paths, die-cut vector lines, and backing underlays for flawless manufacturing.
            </p>
          </div>

          {/* Border Styles */}
          <div className="mb-14">
            <h3 className="font-display font-black text-lg sm:text-xl uppercase text-zinc-900 mb-6 flex items-center gap-2">
              <Scissors className="w-5 h-5 text-black" />
              <span>Border Finishing Options</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PATCH_BORDERS.map((border, i) => {
                const Icon = border.icon;
                return (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-black text-[#FFC400] flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded">
                          {border.tag}
                        </span>
                      </div>

                      <h4 className="font-display font-bold text-base uppercase text-zinc-900">
                        {border.name}
                      </h4>
                      <span className="text-xs text-[#FFC400] font-mono font-bold block mb-2">
                        {border.width}
                      </span>

                      <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                        {border.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-100">
                      <span className="text-[11px] font-black uppercase text-zinc-500 block mb-1">
                        Best Shapes
                      </span>
                      <p className="text-xs text-zinc-800 font-medium">
                        {border.bestShapes}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Backing Fasteners */}
          <div>
            <h3 className="font-display font-black text-lg sm:text-xl uppercase text-zinc-900 mb-6 flex items-center gap-2">
              <Flame className="w-5 h-5 text-black" />
              <span>Backing Attachment Fasteners</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {PATCH_BACKINGS.map((backing, i) => {
                const Icon = backing.icon;
                return (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 text-[#FFC400] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-display font-bold text-sm uppercase text-zinc-900">
                          {backing.name}
                        </h4>
                      </div>
                      <span className="text-[10px] font-black uppercase text-[#FFC400] bg-black px-2 py-0.5 rounded inline-block my-1">
                        {backing.popularity}
                      </span>
                      <p className="text-xs text-zinc-600 leading-relaxed mt-1">
                        {backing.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 6. HOW IT WORKS 4-STEP WORKFLOW */}
      <section className="py-14 sm:py-20 bg-[#0c0c0e] text-white border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/25 text-[#FFC400] text-xs font-black tracking-widest uppercase mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>FAST &amp; STREAMLINED PRODUCTION</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl uppercase text-white">
              HOW WE DIGITIZE <span className="text-[#FFC400]">CUSTOM PATCHES</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              From your initial logo, sketch, or badge to ready-to-sew multi-format machine files in 4 easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Upload Artwork or Sketch',
                desc: 'Send your vector file, PNG, JPEG scan, or rough hand drawing with target patch dimensions and backing preferences.',
              },
              {
                step: '02',
                title: 'Stitch & Border Calibration',
                desc: 'Our master digitizers program tatami fills, satin borders, push-pull compensation, and underlay densities calibrated for patch twill.',
              },
              {
                step: '03',
                title: 'Machine QA & Stitch Proof',
                desc: 'The design is simulated on multi-head commercial machine parameters (Tajima/Barudan) to eliminate thread breakage and trims.',
              },
              {
                step: '04',
                title: 'Instant Multi-Format Pack',
                desc: 'Receive DST, PES, EMB, EXP, and JEF files plus a 1:1 scale printable PDF color run worksheet ready for instant factory production.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 relative group hover:border-[#FFC400] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="font-display font-black text-3xl sm:text-4xl text-[#FFC400]/30 group-hover:text-[#FFC400] transition-colors mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-display font-bold text-base uppercase text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. PATCH FAQS */}
      <section className="py-14 sm:py-20 bg-[#fafafa] text-zinc-900 border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-[#FFC400] text-xs font-black tracking-widest uppercase mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl uppercase text-zinc-900">
              PATCH DESIGN <span className="text-[#FFC400]">FAQ</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-2">
              Everything you need to know about sizing, borders, backings, and machine formats for custom patches.
            </p>
          </div>

          <div className="space-y-3">
            {patchFaqs.map((faq, i) => {
              const isExpanded = expandedFaq === i;
              return (
                <div
                  key={i}
                  className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setExpandedFaq(isExpanded ? null : i)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50"
                  >
                    <span className="font-display font-bold text-sm sm:text-base uppercase text-zinc-900">
                      {faq.q}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-700">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8. BOTTOM ACTION CTA STRIP */}
      <section className="bg-gradient-to-r from-zinc-950 via-black to-zinc-950 py-16 border-t border-zinc-800 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#FFC400]/15 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/30 text-[#FFC400] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXPRESS DIGITIZING DIRECT DISPATCH</span>
          </span>

          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight">
            Ready to Bring Your <span className="text-[#FFC400]">Custom Patch Project</span> to Life?
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Upload your logo, team crest, or tactical emblem. Get a production-ready patch stitch file, merrowed border cutline, and virtual sewout proof delivered within 4–12 hours.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenQuoteModal('embroidery', 'patch-digitizing', 'Custom Patch Design & Digitizing')}
              className="bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider px-8 py-4 rounded-xl shadow-[0_4px_20px_rgba(255,196,0,0.35)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
            >
              <span>Get Custom Patch Quote ($15–$35)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 font-bold text-xs sm:text-sm uppercase tracking-wider px-6 py-4 rounded-xl transition-colors cursor-pointer"
            >
              Contact Our Studio
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
        onOpenQuote={(title) => onOpenQuoteModal('embroidery', 'patch-digitizing', title)}
      />

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0c0c0e] border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-7 text-white max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <span className="text-[10px] font-black uppercase text-[#FFC400] tracking-wider">
                  Custom Patch Specifications
                </span>
                <h3 className="font-display font-bold text-lg uppercase text-white">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-[4/3] bg-black rounded-2xl overflow-hidden p-3 flex items-center justify-center border border-zinc-800">
              <WatermarkedPortfolioImage
                src={selectedProject.image}
                alt={selectedProject.title}
                title={selectedProject.title}
                className="max-w-full max-h-full object-contain"
              />
              <WatermarkOverlay position="diagonal" opacity={0.25} />
            </div>

            <div className="space-y-3 text-xs text-zinc-300 bg-zinc-950 p-4 rounded-xl border border-zinc-900">
              <p><strong className="text-white uppercase">Client:</strong> {selectedProject.client}</p>
              <p><strong className="text-white uppercase">Stitch Count:</strong> {selectedProject.stitchCount || selectedProject.tag}</p>
              <p><strong className="text-white uppercase">Specifications:</strong> {selectedProject.specs}</p>
              <p><strong className="text-white uppercase">Description:</strong> {selectedProject.description}</p>
              {selectedProject.deliverables && (
                <div>
                  <strong className="text-white uppercase block mb-1">Deliverables Included:</strong>
                  <ul className="list-disc list-inside space-y-0.5 text-zinc-400">
                    {selectedProject.deliverables.map((del, i) => (
                      <li key={i}>{del}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedProject(null);
                  onOpenQuoteModal('embroidery', 'patch-digitizing', selectedProject.title);
                }}
                className="px-5 py-2.5 bg-[#FFC400] hover:bg-[#ffcd1a] text-black text-xs font-black uppercase rounded-xl cursor-pointer flex items-center gap-1.5 shadow"
              >
                <span>Request Similar Patch File</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
