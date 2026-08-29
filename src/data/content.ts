import northEasternUtilitiesImg from '../assets/images/northeastern_utilities_vector_1787011793570.jpg';
import girlsWannaHaveFunImg from '../assets/images/girls_wanna_have_fun_color_sep_1787012045765.jpg';
import arabiaHotRodsImg from '../assets/images/arabia_hot_rods_vector_1787079998691.jpg';
import backWoodsImg from '../assets/images/back_woods_vector_1787080020936.jpg';
import catfishingHeroesImg from '../assets/images/catfishing_heroes_vector_1787080036259.jpg';
import alfajoresCookiesImg from '../assets/images/alfajores_cookies_vector_1787080582084.jpg';
import countryMarketFreshMeatsImg from '../assets/images/country_market_sweet_treats_1787080594066.jpg';
import intlFallsLibraryImg from '../assets/images/intl_falls_library_vector_1787080604886.jpg';
import littleforkElementaryImg from '../assets/images/littlefork_elementary_track_1787080614547.jpg';
import mcallenPoliceImg from '../assets/images/mcallen_police_badge_1787082488069.jpg';
import portCityBandImg from '../assets/images/port_city_band_logo_1787082507709.jpg';
import poweredByCommunityImg from '../assets/images/powered_by_community_shirt_1787082523357.jpg';
import purpleHorseWrestlingImg from '../assets/images/purple_horse_wrestling_1787082542654.jpg';
import stxArcheryImg from '../assets/images/stx_archery_emblem_1787082572809.jpg';
import thumbPrintLeafImg from '../assets/images/fingerprint_leaf_vector_1787082593385.jpg';
import dezertwulfImg from '../assets/images/dezertwulf_embroidery_1787087863366.jpg';
import freshLookImg from '../assets/images/fresh_look_embroidery_1787087880478.jpg';
import kingTigerImg from '../assets/images/king_tiger_embroidery_1787087896562.jpg';
import msDragonImg from '../assets/images/ms_dragon_embroidery_1787087913479.jpg';
import dogHouseImg from '../assets/images/dog_house_embroidery_1787087934199.jpg';
import turkeySlayersImg from '../assets/images/turkey_slayers_embroidery_1787087952285.jpg';
import twoBearsImg from '../assets/images/two_bears_embroidery_1787087971119.jpg';
import fighterBeeEmbroideryImg from '../assets/images/fighter_bee_embroidery_1787166502000.jpg';
import flyingNitroEmbroideryImg from '../assets/images/flying_nitro_embroidery_1787166524293.jpg';
import tornadoesCrestEmbroideryImg from '../assets/images/tornadoes_crest_embroidery_1787166550084.jpg';
import betancourtDiceCherriesImg from '../assets/images/betancourt_dice_cherries_embroidery_1787180335506.jpg';
import bevraVintageRacingImg from '../assets/images/bevra_vintage_racing_embroidery_1787180345576.jpg';
import hollyJollyBarrelRaceImg from '../assets/images/holly_jolly_barrel_race_embroidery_1787180354979.jpg';
import theBarnJoyCreekImg from '../assets/images/the_barn_joy_creek_embroidery_1787180364512.jpg';
import azTurfLandscapeImg from '../assets/images/az_turf_landscape_embroidery_1787254348932.jpg';
import breedersCupGoldImg from '../assets/images/breeders_cup_gold_embroidery_1787254367874.jpg';
import malakoffTigersImg from '../assets/images/malakoff_tigers_embroidery_1787254388435.jpg';
import modernDieselPerfImg from '../assets/images/modern_diesel_perf_embroidery_1787254407988.jpg';
import scottsTowingWreckerImg from '../assets/images/scotts_towing_wrecker_embroidery_1787254427840.jpg';
import fortIrwinFirefightersImg from '../assets/images/fort_irwin_crest_1787605875058.jpg';
import bagleyFlyersVectorImg from '../assets/images/bagley_flyers_vector_1787606356817.jpg';
import banditCowboyEmbroideryImg from '../assets/images/bandit_cowboy_embroidery_1787606674472.jpg';
import dogOutlineEmbroideryImg from '../assets/images/dog_outline_embroidery_1787606697784.jpg';
import kingTigerMartialArtsImg from '../assets/images/king_tiger_martial_arts_embroidery_1787610892805.jpg';
import huntHorseHoundImg from '../assets/images/hunt_horse_hound_embroidery_1787610913777.jpg';

export interface ServiceItem {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  tag: string;
  turnaround: string;
  details: string[];
  startingPrice: string;
  pricingTiers?: { name: string; price: string; description: string }[];
}

export interface ServicePackage {
  id: string;
  serviceId: string;
  tierId: string;
  category: 'vector' | 'digitizing';
  categoryLabel: string;
  name: string;
  price: number;
  priceDisplay: string;
  unit: string;
  turnaround: string;
  badge?: string;
  popular?: boolean;
  iconName: string;
  description: string;
  features: string[];
  formats: string[];
  specs: { label: string; value: string }[];
}

export const SERVICE_PACKAGES: ServicePackage[] = [
  // 1. Vector Artwork Packages
  {
    id: 'simple-vector',
    serviceId: 'vector-artwork',
    tierId: 'simple-vector',
    category: 'vector',
    categoryLabel: 'Vector Artwork',
    name: 'Simple Vector',
    price: 15,
    priceDisplay: '$15',
    unit: '/ file',
    turnaround: '2-4 Hours',
    badge: 'Express 2-4h',
    popular: true,
    iconName: 'vector',
    description: 'Clean manual redraw for basic logos, simple line art, typography, icons, and geometric shapes.',
    features: [
      '100% manual node-by-node Bézier redraw',
      'Delivered in .AI, .EPS, .SVG, .PDF & 300 DPI PNG',
      'Crisp infinite scaling with zero pixelation',
      'Free minor adjustments included'
    ],
    formats: ['.AI', '.EPS', '.SVG', '.PDF', '.PNG'],
    specs: [
      { label: 'Technique', value: 'Manual Bézier Pen Tracing' },
      { label: 'Resolution', value: 'Infinite Vector Scaling' },
      { label: 'Layering', value: 'Organized Named Layers' },
      { label: 'Revisions', value: 'Unlimited Minor Tweaks' }
    ]
  },
  {
    id: 'complex-vector',
    serviceId: 'vector-artwork',
    tierId: 'complex-vector',
    category: 'vector',
    categoryLabel: 'Vector Artwork',
    name: 'Complex Vector',
    price: 25,
    priceDisplay: '$25',
    unit: '/ file',
    turnaround: '4-6 Hours',
    badge: 'Most Popular',
    popular: true,
    iconName: 'vector',
    description: 'Detailed artwork, mascot illustrations, multi-color heraldic emblems, badges, and gradient shading.',
    features: [
      'Multi-layered vector paths & clean group hierarchy',
      'Precision color blends & gradient shading',
      'Complex typography & contour tracing',
      'Production-ready for all screen print & vinyl cutters'
    ],
    formats: ['.AI', '.EPS', '.SVG', '.PDF', '.CDR'],
    specs: [
      { label: 'Complexity', value: 'Mascots, Crests & Badges' },
      { label: 'Color Gradients', value: 'High-Fidelity Mesh / Blend' },
      { label: 'Cut Lines', value: 'Vinyl Plotter Ready' },
      { label: 'Turnaround', value: '4-6 Hours Express' }
    ]
  },
  {
    id: 'advance-vector',
    serviceId: 'vector-artwork',
    tierId: 'advance-vector',
    category: 'vector',
    categoryLabel: 'Vector Artwork',
    name: 'Advance Vector',
    price: 45,
    priceDisplay: '$45',
    unit: '/ file',
    turnaround: '6-8 Hours',
    badge: 'Master Tier',
    iconName: 'vector',
    description: 'Ultra-complex forensic recreation, intricate organic/biometric line art, 3D chrome bevels, and multi-element scenes.',
    features: [
      'Master-tier vector precision with thousands of nodes',
      '3D dimensional lighting, chrome & metallic effects',
      'Complex botanical, biometric or vehicle illustrations',
      'Ultra-crisp billboard & vehicle wrap scale capability'
    ],
    formats: ['.AI', '.EPS', '.SVG', '.PDF', '.TIFF'],
    specs: [
      { label: 'Nodes', value: '3,000+ Precision Anchors' },
      { label: 'Effects', value: '3D Chrome, Bevels & Lighting' },
      { label: 'Scale Suitability', value: 'Billboard & Vehicle Wraps' },
      { label: 'Quality', value: 'Museum / Master Grade' }
    ]
  },
  {
    id: 'color-separation',
    serviceId: 'vector-artwork',
    tierId: 'color-separation',
    category: 'vector',
    categoryLabel: 'Vector Artwork',
    name: 'Color Separation',
    price: 10,
    priceDisplay: '$10',
    unit: '/ separation',
    turnaround: '2-4 Hours',
    badge: 'Print Ready',
    iconName: 'vector',
    description: 'Color separations for spot color, simulated process, CMYK & index printing on dark and light garments.',
    features: [
      'Pantone Solid Coated color matching',
      'Film positives with registration & crop marks',
      'Solid white underbase separation',
      'Compatible with all RIP software & press lines'
    ],
    formats: ['.AI', '.PSD (Channels)', '.PDF', '.EPS'],
    specs: [
      { label: 'Process', value: 'Spot / Sim Process / CMYK' },
      { label: 'Underbase', value: 'Choked White Underbase' },
      { label: 'Palettes', value: 'PMS Solid Coated' },
      { label: 'RIP Compatibility', value: 'AccuRIP, FilmMaker, Wasatch' }
    ]
  },

  // 2. Embroidery Digitizing Packages
  {
    id: 'left-chest-cap',
    serviceId: 'logo-digitizing',
    tierId: 'left-chest-cap',
    category: 'digitizing',
    categoryLabel: 'Logo Digitizing',
    name: 'Left Chest & Cap',
    price: 15,
    priceDisplay: '$15',
    unit: '/ design',
    turnaround: '4-6 Hours',
    badge: 'Top Choice',
    popular: true,
    iconName: 'spool',
    description: 'Standard embroidery digitizing engineered for left chest garments (up to 4.5"x4.5") and structured caps/visors.',
    features: [
      'Cap center-out pathing calibration for zero bunching',
      'Calibrated pull compensation & underlay density',
      'Standard flat & 3D foam puff compatible',
      'Machine files: DST, PES, EMB, EXP, JEF, VP3'
    ],
    formats: ['.DST', '.PES', '.EMB', '.EXP', '.JEF', '.VP3'],
    specs: [
      { label: 'Max Dimensions', value: 'Up to 4.5" x 4.5"' },
      { label: 'Cap Pathing', value: 'Center-Out / Bottom-Up' },
      { label: 'Machines', value: 'Tajima, Barudan, Brother, Melco' },
      { label: 'Density', value: 'Auto Pull-Compensated' }
    ]
  },
  {
    id: 'mid-size',
    serviceId: 'logo-digitizing',
    tierId: 'mid-size',
    category: 'digitizing',
    categoryLabel: 'Logo Digitizing',
    name: 'Mid Size (5" to 8")',
    price: 25,
    priceDisplay: '$25',
    unit: '/ design',
    turnaround: '6-8 Hours',
    badge: 'Medium Scale',
    iconName: 'spool',
    description: 'Medium format embroidery files (5" to 8") for hoodies, aprons, sleeves, bags, and varsity emblems.',
    features: [
      'Multi-density tatami & satin stitch distribution',
      'Engineered to prevent fabric puckering & warping',
      'Smooth high-speed sequencing with minimal trims',
      'Visual stitch preview & color run worksheet included'
    ],
    formats: ['.DST', '.PES', '.EMB', '.EXP', '.JEF', '.VP3'],
    specs: [
      { label: 'Dimensions', value: '5.0" to 8.0"' },
      { label: 'Stitch Range', value: '12,000 - 28,000 Stitches' },
      { label: 'Garments', value: 'Hoodies, Outerwear, Bags' },
      { label: 'Sequencing', value: 'Minimal Trims & Jumps' }
    ]
  },
  {
    id: 'jacket-back',
    serviceId: 'logo-digitizing',
    tierId: 'jacket-back',
    category: 'digitizing',
    categoryLabel: 'Logo Digitizing',
    name: 'Jacket Back (Full Scale)',
    price: 40,
    priceDisplay: '$40',
    unit: '/ design',
    turnaround: '8-12 Hours',
    badge: 'Large Format',
    popular: true,
    iconName: 'spool',
    description: 'Full-size jacket back digitizing (up to 12"x14"+) with high stitch counts and complex multi-directional fills.',
    features: [
      'Large-scale full coverage (30,000 to 60,000+ stitches)',
      'Multi-angle tatami stitch fills simulating lighting',
      'Specially reinforced foundation underlay',
      'Optimized for high-speed multi-head commercial machines'
    ],
    formats: ['.DST', '.PES', '.EMB', '.EXP', '.JEF', '.VP3'],
    specs: [
      { label: 'Dimensions', value: 'Up to 12.0" x 14.0"+' },
      { label: 'Stitch Range', value: '30,000 to 60,000+ Stitches' },
      { label: 'Underlay', value: 'Multi-Directional Grid & Tatami' },
      { label: 'Worksheet', value: 'Full Production Run Sheet' }
    ]
  }
];

export interface PricingTierItem {
  id: string;
  title: string;
  price: number;
  priceDisplay: string;
  unit: string;
  turnaround: string;
  popular?: boolean;
  description: string;
  features: string[];
}

export const PRICING_DATA = {
  vector: [
    {
      id: 'color-separation',
      title: 'Color Separation',
      price: 10,
      priceDisplay: '$10',
      unit: '/ separation',
      turnaround: '2-4 Hours',
      description: 'Color separations for spot color, simulated process, CMYK & index printing on dark and light garments.',
      features: ['Pantone Solid Coated color matching', 'Film positives with registration & crop marks', 'Solid white underbase separation', 'Compatible with all RIP software & press lines']
    },
    {
      id: 'simple-vector',
      title: 'Simple Vector',
      price: 15,
      priceDisplay: '$15',
      unit: '/ file',
      turnaround: '2-4 Hours',
      popular: true,
      description: 'Clean manual redraw for basic logos, simple line art, typography, icons, and geometric shapes.',
      features: ['100% manual node-by-node Bézier redraw', 'Delivered in .AI, .EPS, .SVG, .PDF & 300 DPI PNG', 'Crisp infinite scaling with zero pixelation', 'Free minor adjustments included']
    },
    {
      id: 'complex-vector',
      title: 'Complex Vector',
      price: 25,
      priceDisplay: '$25',
      unit: '/ file',
      turnaround: '4-6 Hours',
      popular: true,
      description: 'Detailed artwork, mascot illustrations, multi-color heraldic emblems, badges, and gradient shading.',
      features: ['Multi-layered vector paths & clean group hierarchy', 'Precision color blends & gradient shading', 'Complex typography & contour tracing', 'Production-ready for all screen print & vinyl cutters']
    },
    {
      id: 'advance-vector',
      title: 'Advance Vector',
      price: 45,
      priceDisplay: '$45',
      unit: '/ file',
      turnaround: '6-8 Hours',
      description: 'Ultra-complex forensic recreation, intricate organic/biometric line art, 3D chrome bevels, and multi-element scenes.',
      features: ['Master-tier vector precision with thousands of nodes', '3D dimensional lighting, chrome & metallic effects', 'Complex botanical, biometric or vehicle illustrations', 'Ultra-crisp billboard & vehicle wrap scale capability']
    }
  ] as PricingTierItem[],
  digitizing: [
    {
      id: 'left-chest-cap',
      title: 'Left Chest & Cap',
      price: 15,
      priceDisplay: '$15',
      unit: '/ design',
      turnaround: '4-6 Hours',
      popular: true,
      description: 'Standard embroidery digitizing engineered for left chest garments (up to 4.5"x4.5") and structured caps/visors.',
      features: ['Cap center-out pathing calibration for zero bunching', 'Calibrated pull compensation & underlay density', 'Standard flat & 3D foam puff compatible', 'Machine files: DST, PES, EMB, EXP, JEF, VP3']
    },
    {
      id: 'mid-size',
      title: 'Mid Size',
      price: 25,
      priceDisplay: '$25',
      unit: '/ design',
      turnaround: '6-8 Hours',
      description: 'Medium format embroidery files (5" to 8") for hoodies, aprons, sleeves, bags, and varsity emblems.',
      features: ['Multi-density tatami & satin stitch distribution', 'Engineered to prevent fabric puckering & warping', 'Smooth high-speed sequencing with minimal trims', 'Visual stitch preview & color run worksheet included']
    },
    {
      id: 'jacket-back',
      title: 'Jacket Back',
      price: 40,
      priceDisplay: '$40',
      unit: '/ design',
      turnaround: '8-12 Hours',
      popular: true,
      description: 'Full-size jacket back digitizing (up to 12"x14"+) with high stitch counts and complex multi-directional fills.',
      features: ['Large-scale full coverage (30,000 to 60,000+ stitches)', 'Multi-angle tatami stitch fills simulating lighting', 'Specially reinforced foundation underlay', 'Optimized for high-speed multi-head commercial machines']
    }
  ] as PricingTierItem[]
};

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'screen-printing' | 'embroidery' | 'vector-artwork' | 'logo-digitizing' | 'custom-apparel';
  categoryLabel: string;
  image: string;
  tag: string;
  specs: string;
  client: string;
  description: string;
  turnaround?: string;
  colors?: string;
  stitchCount?: string;
  deliverables?: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  location: string;
  image: string;
  quote: string;
  rating: number;
  serviceUsed: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  iconName: string;
  detail: string;
}

export const CONTACT_INFO = {
  phone: '+1 (607) 205-0030',
  phoneClean: '+16072050030',
  email: 'graphicspunching264@gmail.com',
  secondaryEmail: 'info@graphicspunching.com',
  location: 'Serving Worldwide (Fast USA & Global Shipping)',
  website: 'www.graphicspunching.com',
  workingHours: 'Mon - Fri: 8:00 AM - 7:00 PM EST | 24/7 Digital Support',
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61593649506118',
    instagram: 'https://instagram.com',
    pinterest: 'https://pinterest.com',
    website: 'https://graphicspunching.com'
  }
};

export const SERVICES: ServiceItem[] = [
  {
    id: 'vector-artwork',
    title: 'VECTOR ARTWORK',
    shortTitle: 'Vector Artwork',
    description: 'Clean, scalable vector artwork for logos, printing & branding. Crisp lines at any resolution without pixelation.',
    iconName: 'vector',
    tag: 'Super Crisp 300+ DPI',
    turnaround: '2-6 Hours Express',
    startingPrice: '$15 / Simple Vector',
    pricingTiers: [
      { name: 'Simple Vector', price: '$15', description: 'Basic logos, line art, simple fonts & shapes' },
      { name: 'Complex Vector', price: '$25', description: 'Detailed emblems, multi-color mascots & gradients' },
      { name: 'Advance Vector', price: '$45', description: 'Forensic recreation, 3D chrome & complex scenes' },
      { name: 'Color Separation', price: '$10', description: 'Spot color, simulated process & underbase films' }
    ],
    details: [
      'Simple Vector: $15 | Complex Vector: $25 | Advance Vector: $45',
      'Color Separation: $10 (Spot, Simulated Process, CMYK)',
      '100% Manual node-by-node vector tracing (Never auto-trace)',
      'Delivered in .AI, .EPS, .PDF, .SVG & high-res .PNG',
      'Resolution independence up to billboard & vinyl cutter scale',
      'Free minor revisions until 100% satisfied'
    ]
  },
  {
    id: 'logo-digitizing',
    title: 'LOGO DIGITIZING',
    shortTitle: 'Logo Digitizing',
    description: 'Professional digitizing for embroidery with perfect stitch quality, minimal thread breaks, and tight tolerances.',
    iconName: 'spool',
    tag: 'Machine Ready Files',
    turnaround: '4-12 Hours Express',
    startingPrice: '$15 / Left Chest & Cap',
    pricingTiers: [
      { name: 'Left Chest & Cap', price: '$15', description: 'Up to 4.5"x4.5" calibrated for caps & chest' },
      { name: 'Mid Size', price: '$25', description: '5" to 8" medium format for hoodies & aprons' },
      { name: 'Jacket Back', price: '$40', description: 'Full format (up to 12"x14"+) multi-directional fills' }
    ],
    details: [
      'Left Chest & Cap: $15 | Mid Size: $25 | Jacket Back: $40',
      'Custom pathing, underlay & stitch density calibration',
      'Compatible with DST, PES, EMB, EXP, JEF, VP3',
      'Tested for caps, left chest, flats & 3D puff embroidery',
      'Stitch simulation worksheet included with order',
      'Guaranteed smooth running on any commercial machine'
    ]
  }
];

export const WHY_CHOOSE_US = [
  {
    id: 'top-quality',
    title: 'TOP QUALITY',
    subtitle: 'Premium materials & latest technology.',
    icon: 'Award',
    stat: '100%',
    statLabel: 'Quality Inspected',
    desc: 'We utilize industrial-grade M&R automatic screen presses and multi-head Tajima embroidery machines with eco-friendly premium inks and Madeira threads.'
  },
  {
    id: 'fast-delivery',
    title: 'FAST DELIVERY',
    subtitle: 'On-time delivery, every time.',
    icon: 'Clock',
    stat: '24-48h',
    statLabel: 'Rush Turnaround',
    desc: 'Tight project deadlines? We offer express digitizing in as fast as 4 hours and rapid apparel production with reliable tracked global courier delivery.'
  },
  {
    id: 'expert-team',
    title: 'EXPERT TEAM',
    subtitle: 'Skilled professionals with years of experience.',
    icon: 'Users',
    stat: '10+ Yrs',
    statLabel: 'Industry Mastery',
    desc: 'Our master digitizers, vector artists, and master printers review every file to eliminate stitch bunching, misalignment, or color drift.'
  },
  {
    id: 'best-prices',
    title: 'BEST PRICES',
    subtitle: 'Competitive pricing with no hidden charges.',
    icon: 'Tag',
    stat: '$0',
    statLabel: 'Setup / Hidden Fees',
    desc: 'Direct wholesale factory-level pricing with transparent quotes. What you see is what you pay, with volume discounts as your orders grow.'
  }
];

export const PORTFOLIO_PROJECTS: PortfolioItem[] = [
  // ================= SCREEN PRINTING =================
  {
    id: 'sp-1',
    title: 'Littlefork-Big Falls Elementary 2026 Vikings Athletics Apparel',
    category: 'screen-printing',
    categoryLabel: 'Screen Printing',
    image: littleforkElementaryImg,
    tag: 'School Spirit Print',
    specs: 'Multi-color spot screen print on bright safety orange garments with high-opacity ink formulation',
    client: 'Littlefork-Big Falls Elementary School (Vikings)',
    description: 'Vibrant school athletic event t-shirt package featuring cartoon track athletes, fireworks burst, Vikings mascot emblem, and bold typography "AIM HIGH! BE STRONG NEVER GIVE UP!" color-separated for high-speed automatic press production.',
    colors: '6 Spot Colors + Base',
    turnaround: '3 Days',
    deliverables: ['Screen Print Master Separation', 'T-shirt Press Production', 'Film Positives PDF', 'Size Bundling']
  },
  {
    id: 'sp-2',
    title: 'Catfishing With Heroes Veteran Event Screen Print',
    category: 'screen-printing',
    categoryLabel: 'Screen Printing',
    image: catfishingHeroesImg,
    tag: 'Veteran Event Print',
    specs: 'High-opacity white & crimson red discharge screen print with distressed USA flag master separation',
    client: 'Band of Brothers Outdoors / Moorhead Veterans',
    description: 'Turnkey veteran charity event apparel package featuring front chest catfish illustration with crossed rods, distressed stars & stripes, and full back typography screen printed with ultra-soft hand feel.',
    colors: '3 Spot Colors + White Base',
    turnaround: '3 Days',
    deliverables: ['Discharge Apparel Print', 'Film Color Separations', 'Front & Back Placement', 'Custom Polybagging']
  },
  {
    id: 'sp-3',
    title: 'The Country Market Fresh Meats & Sweet Treats Screen Print',
    category: 'screen-printing',
    categoryLabel: 'Screen Printing',
    image: countryMarketFreshMeatsImg,
    tag: 'Simulated Process',
    specs: 'Multi-color cartoon mascot screen print with crisp underbase on heavy dark apparel',
    client: 'The Country Market',
    description: 'Delightful cartoon farm animal mascots (dairy cow, smiling piglet, and winking hen enjoying ice cream sundaes and cones) with arched banner typography "Fresh Meats - Sweet Treats - MEAT OUR SWEET SIDE", optimized for clean multi-head screen printing on black tees.',
    colors: '5 Spot Colors + Flash White',
    turnaround: '3 Days',
    deliverables: ['Film Color Separations', 'Press-Ready Vector Master', 'Pantone Solid Coated Sheet', 'Dark Garment Underbase']
  },
  {
    id: 'sp-powered-by-community',
    title: 'Powered By Community Custom Screen Printed Apparel',
    category: 'screen-printing',
    categoryLabel: 'Screen Printing',
    image: poweredByCommunityImg,
    tag: 'Community & Charity Print',
    specs: 'Multi-layer screen print on black apparel with tree of life, caring hands, heart root system & banner typography',
    client: 'Community Foundation / Volunteer Alliance',
    description: 'Full chest custom screen printed apparel with vibrant white and shaded graphic depicting open hands fostering a blossoming tree of life with heart-shaped root network, bordered by bold typography "POWERED BY COMMUNITY". Color-separated for super soft hand feel on combed cotton shirts.',
    colors: 'High-Opacity Soft White & Tonal Grays',
    turnaround: '3 Days',
    deliverables: ['High-Opacity Screen Print', 'Master Film Separation', 'Custom Polybagging', 'Bulk Distribution Ready']
  },
  {
    id: 'sp-port-city-band',
    title: 'Port City Rock & Roll Band Screen Print & Merch Graphic',
    category: 'screen-printing',
    categoryLabel: 'Screen Printing',
    image: portCityBandImg,
    tag: 'Band Merch Screen Print',
    specs: 'High-impact nautical rock emblem with anchor, twin electric guitars, wings & banner script for band tour tees',
    client: 'Port City Band Tour & Merch',
    description: 'Custom rock merchandise apparel package featuring nautical anchor intertwined with twin rock guitars, spread wings, marine stars, and arched ribbon lettering "PORT CITY". Screen printed with durable plastisol ink for concert tour merchandising.',
    colors: '4 Spot Colors + Flash White Underbase',
    turnaround: '3 Days',
    deliverables: ['Concert Tour T-Shirt Press', 'Film Color Positives', 'Vector Merch Master', 'Size Breakdown Assortment']
  },

  // ================= EMBROIDERY =================
  {
    id: 'emb-king-tiger-martial-arts',
    title: 'King-Tiger Martial-Arts "One School. One Family." Circular Embroidered Patch',
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: kingTigerMartialArtsImg,
    tag: 'Martial Arts Crest 22K Stitches',
    specs: '22,800 stitches circular emblem with golden Bengal tiger, red satin arched lettering, Chinese kanji/hanzi characters & "ONE SCHOOL. ONE FAMILY." rocker',
    client: 'King-Tiger Martial Arts Academy & Uniforms',
    description: 'Dojo uniform and championship patch digitizing featuring a powerful Bengal tiger in gold, white, and red split tatami fills, arched 3D satin "KING-TIGER MARTIAL-ARTS" typography, crisp Chinese calligraphy characters (王 虎), double red circular containment borders, and bold white bottom embroidery reading "ONE SCHOOL. ONE FAMILY."',
    stitchCount: '22,800 Stitches',
    turnaround: '1-2 Days',
    deliverables: ['Tajima DST / Barudan DSB', 'Wilcom EMB Native Master', 'Uniform Gi Chest & Back Files', 'Production Thread Sequence Proof']
  },
  {
    id: 'emb-horse-hound-hunt-scene',
    title: 'Classic Equestrian Fox Hunt Horse & Hound Embroidery Sewout',
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: huntHorseHoundImg,
    tag: 'Equestrian Hunt 19K Stitches',
    specs: '19,200 stitches hunter in red frock coat blowing horn on galloping grey horse with leaping hunting dog & landscape running stitches',
    client: 'Traditional Country Club & Equestrian Hunt Apparel',
    description: 'Vintage traditional sporting embroidery design digitized with precise variable stitch angles capturing the anatomy and motion of a rider in classic red hunting coat blowing a brass horn, atop a galloping hunter horse with muscle shading, accompanied by a leaping hunting hound across manicured turf lines.',
    stitchCount: '19,200 Stitches',
    turnaround: '1-2 Days',
    deliverables: ['Tajima .DST / Melco .EXP / PES', 'Wilcom .EMB Vector-Stitch Source', 'Linen & Jacket Hoop Calibration', 'Thread Color Run Sheet']
  },
  {
    id: 'emb-bandit-cowboy-mask',
    title: 'Outlaw Bandit Cowboy Hat & Red Bandana Mask Embroidered Patch',
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: banditCowboyEmbroideryImg,
    tag: 'Mascot Patch 18K Stitches',
    specs: '18,400 stitches outlaw cowboy in wide-brim hat, vibrant red tatami bandana mask, silver satin highlights & dense merrowed border',
    client: 'Western Apparel & Custom Headwear Brand',
    description: 'High-impact western outlaw cowboy mascot digitized for custom patches, structured snapbacks, and leather vests. Features dynamic stitch angles creating dimension across the silver-white satin hat brim, deep shadow fill underneath, rich textured red bandana mask with contour folds, and a heavy black satin stitch border.',
    stitchCount: '18,400 Stitches',
    turnaround: '1-2 Days',
    deliverables: ['Tajima DST / Barudan File', 'Structured Cap & Patch Master', 'Wilcom EMB Native Source', 'High-Res Stitch Simulation Proof']
  },
  {
    id: 'emb-golden-retriever-lineart',
    title: 'Golden Retriever Canine Head Portrait Outline Embroidery Sewout',
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: dogOutlineEmbroideryImg,
    tag: 'Pet Portrait 15K Stitches',
    specs: '15,600 stitches pure white lustrous thread on deep black fabric with directional fur tatami & satin contours',
    client: 'Custom Pet Memorial & Canine Apparel Studio',
    description: 'Artistic canine lineart embroidery sewout featuring an expressive, smiling Golden Retriever portrait. Digitized with specialized running stitches and variable-width satin stitch contours that replicate organic fur flow, open tongue, and bright eye highlights on dark garments.',
    stitchCount: '15,600 Stitches',
    turnaround: '1-2 Days',
    deliverables: ['Tajima DST / Brother PES / Melco EXP', 'Garment Hoop & Tension Calibration', 'Wilcom EMB Master', 'Thread Color Run Sheet']
  },
  {
    id: 'emb-az-turf-landscape',
    title: 'AZ Turf & Landscape Saguaro Desert Crest Embroidery',
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: azTurfLandscapeImg,
    tag: 'Desert Crest 23K Stitches',
    specs: '23,600 stitches Arizona flag sunburst star, saguaro cactus, golden sunset tatami & heavy satin border',
    client: 'AZ Turf & Landscape LLC',
    description: 'High-precision commercial uniform embroidery sewout featuring Arizona state flag red and yellow sunburst stripes, brown 3D satin star, saguaro cactus landscape under a golden sun tatami fill, bold green and white bordered "TURF" lettering, and bottom "LANDSCAPE" patch with circular lawn coil emblem.',
    stitchCount: '23,600 Stitches',
    turnaround: '2 Days',
    deliverables: ['Tajima DST / Barudan File', 'Workwear & Cap Underlay Calibration', 'Wilcom EMB Master', 'Thread Color Run Sheet']
  },
  {
    id: 'emb-breeders-cup-gold',
    title: "Breeders' Cup Gold Equestrian Outline Satin Stitch Embroidery",
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: breedersCupGoldImg,
    tag: 'Equestrian Satin 16K',
    specs: '16,200 stitches dynamic sweeping horse head silhouette outline in rich metallic gold satin thread',
    client: "Breeders' Cup World Championships / Equestrian Club",
    description: "Prestigious championship equestrian embroidery sewout featuring fluid sweeping curves forming a stylized horse head profile in high-luster gold satin stitching, paired with crisp serif lettering \"BREEDERS' CUP\" with gold underline bar on charcoal fabric.",
    stitchCount: '16,200 Stitches',
    turnaround: '2 Days',
    deliverables: ['Tajima DST / Brother PES', 'Polo & Structured Cap Setup', 'Metallic Thread Calibration', '300 DPI Stitch Proof']
  },
  {
    id: 'emb-malakoff-tigers',
    title: 'Malakoff Tigers Varsity Roaring Mascot Crest Embroidered Patch',
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: malakoffTigersImg,
    tag: 'Varsity Mascot 32K',
    specs: '32,800 stitches ferocious roaring tiger head, gripping 3D claws, white & gold satin lettering with merrowed border',
    client: 'Malakoff High School Athletics / Tigers Booster',
    description: 'Fierce varsity sports mascot direct embroidery and jacket patch sewout. Features dense gold and white tatami tiger fur, red mouth interior with sharp fangs, dimensional claws gripping a textured black banner, arched white "MALAKOFF", and thick gold "TIGERS" block lettering.',
    stitchCount: '32,800 Stitches',
    turnaround: '3 Days',
    deliverables: ['Custom Merrowed Border Patches', 'DST / PES Machine Files', 'Letterman Jacket Back & Cap Files', 'Sample Stitchout Proof']
  },
  {
    id: 'emb-modern-diesel-perf',
    title: 'Modern Diesel Performance Cog Gear & Flag Fill Embroidery',
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: modernDieselPerfImg,
    tag: 'Automotive 21K Stitches',
    specs: '21,500 stitches industrial cog gear in white satin, blue arc borders & USA flag striped MDP lettering',
    client: 'Modern Diesel Performance Automotive',
    description: 'Heavy-duty automotive performance shop embroidery digitizing. Features an industrial gear cog framework with cyan accent arcs, bold italicized "MDP" letters filled with red and white American flag stripes, and crisp white block text "MODERN DIESEL PERFORMANCE".',
    stitchCount: '21,500 Stitches',
    turnaround: '2 Days',
    deliverables: ['Tajima DST / Barudan File', 'Uniform Shirt & Cap Hoop Setup', 'Wilcom EMB Native Master', 'High-Res Stitch Simulation']
  },
  {
    id: 'emb-scotts-towing-wrecker',
    title: "Scott's Auto & Towing Heavy Rotator Wrecker Jacket Back Embroidery",
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: scottsTowingWreckerImg,
    tag: 'Jacket Back 46K Stitches',
    specs: '46,800 stitches multi-axle heavy rotator tow truck, arched script typography & full contact lettering',
    client: "Scott's Auto & Towing (Allegan, Mich.)",
    description: "Extremely detailed commercial service jacket back embroidery sewout featuring a heavy-duty blue rotator tow truck with triple rear axles, boom crane, chrome wheel rims, arched \"Scott's AUTO & TOWING\" top lettering, and location/phone embroidery \"Allegan, Mich. 269 673-3549\".",
    stitchCount: '46,800 Stitches',
    turnaround: '4 Days',
    deliverables: ['Large Jacket Back Tajima DST', 'Dense Workwear Underlay Setup', 'Thread Run Sequence Sheet', 'High-Res Stitch Proof']
  },
  {
    id: 'emb-betancourt-cherries',
    title: 'Betancourt Club Est. 2026 Dice Cherries Embroidery',
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: betancourtDiceCherriesImg,
    tag: 'Dice Cherries Club 19K',
    specs: '19,400 stitches retro red dice cherries with satin pips, green leaf fill & script text',
    client: 'Betancourt Social Club',
    description: 'Playful retro club embroidery sewout featuring two high-gloss red dice styled as cherries with white satin stitch pips, detailed green tatami leaf fills, and arched serif & cursive script lettering "BETANCOURT EST. 2026 Club". Calibrated for left chest polos, hoodies, and structured snapbacks.',
    stitchCount: '19,400 Stitches',
    turnaround: '2 Days',
    deliverables: ['Tajima DST / Barudan File', 'Wilcom EMB Native Master', 'Polo & Cap Setup Sheets', '300 DPI Stitch Simulation Proof']
  },
  {
    id: 'emb-bevra-vintage-racing',
    title: 'BEVRA Vintage Racing 2026 Class Champion Large Jacket Back Embroidery',
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: bevraVintageRacingImg,
    tag: 'Jacket Back 44K Stitches',
    specs: '44,600 stitches vintage snowmobile racer, checkered flag, ice spray & 3D bordered lettering',
    client: 'BEVRA Vintage Snowmobile Racing Association',
    description: 'High-density competition jacket back embroidery sewout featuring dynamic vintage snowmobile racer in full gear carving through snow drifts, silver embroidered checkered flag, 3D block lettering "BEVRA VINTAGE RACING", and championship banner "2026 CLASS CHAMPION". Optimized for heavyweight snow jackets and leather vests.',
    stitchCount: '44,600 Stitches',
    turnaround: '4 Days',
    deliverables: ['Large-Format Tajima DST', 'Heavy Jacket Underlay Calibration', 'Color Sequencing Thread Sheet', 'Stitchout Simulation Proof']
  },
  {
    id: 'emb-holly-jolly-barrel-race',
    title: 'Holly Jolly Barrel Race & Tru Honor Events Arena Embroidery',
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: hollyJollyBarrelRaceImg,
    tag: 'Equestrian Event 28K',
    specs: '28,500 stitches galloping horse silhouette, festive candy-stripe lettering, barbed wire border & holly berries',
    client: 'Tru Honor Events / The Show Arena',
    description: 'Holiday western barrel race arena embroidery featuring festive candy-plaid patterned satin stitch lettering "HOLLY JOLLY BARREL RACE", silhouetted galloping quarter horse, bold red arena banners, and an authentic embroidered barbed wire border embellished with green holly leaves and red berries.',
    stitchCount: '28,500 Stitches',
    turnaround: '3 Days',
    deliverables: ['Tajima DST / Brother PES', 'Equestrian Blanket & Jacket Master', 'Detailed Thread Color Sequence', 'High-Res Stitch Render']
  },
  {
    id: 'emb-the-barn-joy-creek',
    title: 'The Barn at Joy Creek Ranch & Equestrian Crest Embroidery',
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: theBarnJoyCreekImg,
    tag: 'Ranch Emblem 31K',
    specs: '31,200 stitches dual horse portraits (black & chestnut), rustic cross-door barn, road & serif typography',
    client: 'The Barn at Joy Creek Equestrian Center',
    description: 'Distinguished equestrian estate and ranch embroidery digitizing emblem. Features detailed dual horse head portraits with fine mane stitch pathing, classic American barn with crossbuck doors, winding road perspective, and arched frame with bold serif embroidery "THE BARN AT JOY CREEK". Ideal for horse blankets, softshell vests, and caps.',
    stitchCount: '31,200 Stitches',
    turnaround: '3 Days',
    deliverables: ['DST / EXP / PES / JEF Files', 'Cap & Blanket Hoop Profiles', 'Wilcom EMB Vector Master', 'Production Quality Sewout Proof']
  },
  {
    id: 'emb-fighter-bee',
    title: 'Aggressive Hornet & Fighter Bee Mascot Embroidery Digitizing',
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: fighterBeeEmbroideryImg,
    tag: 'Mascot Digitizing 26K',
    specs: '26,400 stitches cartoon fighter bee mascot with boxing gloves, sunglasses & detailed wing veins',
    client: 'Stingers Athletics & Boxing Club',
    description: 'Dynamic cartoon wasp/hornet mascot direct embroidery sewout featuring textured yellow and black tatami body fills, high-contrast dark sunglasses, clenched boxing fists, and delicate translucent wing stitch pathing.',
    stitchCount: '26,400 Stitches',
    turnaround: '3 Days',
    deliverables: ['Tajima DST / Barudan File', 'Cap & Chest Setup Sheet', 'Wilcom EMB Native Master', '300 DPI Stitch Proof']
  },
  {
    id: 'emb-flying-nitro',
    title: "Flyin' With Nitro Poker Chip & Flaming Aces Embroidery Master",
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: flyingNitroEmbroideryImg,
    tag: '34,000+ Stitches Master',
    specs: '34,200 stitches red casino poker chip, burning flaming aces, red dice & 3D layered satin typography',
    client: "Flyin' With Nitro Racing & Poker Tour",
    description: 'High-stitch-count master embroidery sewout combining textured red casino poker chip, pair of Aces with multi-color blue and orange flame stitching, dimensional red dice, and high-impact cyan blue 3D layered lettering.',
    stitchCount: '34,200 Stitches',
    turnaround: '4 Days',
    deliverables: ['Multi-Color Machine DST / PES', 'Thread Color Run Sheet', '3D Puff & Satin Calibration', 'Production Sewout Sheet']
  },
  {
    id: 'emb-tornadoes-crest',
    title: 'Tornadoes Soccer Athletic Shield Crest Embroidered Patch',
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: tornadoesCrestEmbroideryImg,
    tag: 'Athletic Crest Patch 22K',
    specs: '22,800 stitches purple heraldic shield with swirling tornado vortex, soccer ball & split-fill banner',
    client: 'Tornadoes Soccer Club & Academy',
    description: 'Tournament-ready athletic crest embroidery patch with metallic silver and violet swirling tornado vortex engulfing a soccer ball, sparkling accents, split-fill magenta/white "TORNADOES" ribbon, and clean merrowed border.',
    stitchCount: '22,800 Stitches',
    turnaround: '3 Days',
    deliverables: ['Merrowed Border Custom Patches', 'DST / PES Machine Files', 'Heat-Seal / Iron-on Backing', 'Sample Stitchout Proof']
  },
  {
    id: 'emb-king-tiger',
    title: 'King Tiger Martial Arts Fire Clan Large Jacket Back Embroidery',
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: kingTigerImg,
    tag: 'Jacket Back 48K Stitches',
    specs: '48,200 stitches full jacket back embroidery with roaring tiger, flame stitches & kanji crest',
    client: 'King Tiger Martial Arts Dojo',
    description: 'Masterclass large-format embroidery digitizing and direct jacket back stitchout. Features high-density flame tatami stitching, realistic roaring tiger fur textures, and high-contrast gold metallic kanji calligraphy engineered for heavyweight satin and bomber jackets.',
    stitchCount: '48,200 Stitches',
    turnaround: '4 Days',
    deliverables: ['Tajima DST / Barudan Machine Files', 'Production Run Sheet', 'Stitch Simulation Proof', 'Direct Jacket Stitchout']
  },
  {
    id: 'emb-ms-dragon',
    title: 'MS Phoenix & Imperial Dragon Oriental Embroidery Digitizing',
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: msDragonImg,
    tag: '52,000+ Stitches Master',
    specs: 'Multi-layer metallic gold thread blending with oriental dragon, phoenix, Mt. Fuji & pagoda',
    client: 'MS Dragon Clan Apparel',
    description: 'Ultra-high stitch count back embroidery combining golden dragon scales, crimson phoenix feathers, Mount Fuji summit, and Japanese pagoda architectural lines. Calibrated underlay prevents puckering on silk-blend and satin fabrics.',
    stitchCount: '52,400 Stitches',
    turnaround: '5 Days',
    deliverables: ['High-Density DST / PES Files', 'Multi-Head Sequencing Sheet', 'Metallic Thread Spec Guide', 'Stitch Simulation PDF']
  },
  {
    id: 'emb-two-bears',
    title: 'Two Bears Construction Carpenter Bears Jacket Back Embroidery',
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: twoBearsImg,
    tag: '38,000+ Stitches Back',
    specs: 'Heavy workwear canvas embroidery with twin carpenter bears, wood plank & builder tools',
    client: 'Two Bears Construction Co.',
    description: 'Rugged heavy-duty jacket back embroidery designed specifically for Carhartt, duck canvas, and denim work jackets. Features twin builder bears with claw-textured fur, timber woodgrain fill, crossed hammers, and crisp banner typography.',
    stitchCount: '38,500 Stitches',
    turnaround: '4 Days',
    deliverables: ['Carhartt/Duck Fabric Machine Files', 'Underlay Pull Compensation', 'EMB Master File', 'DST / EXP / PES']
  },
  {
    id: 'emb-turkey-slayers',
    title: 'The Mexican Turkey Slayers Hunting Club Embroidery Master',
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: turkeySlayersImg,
    tag: 'Hunting Crest Spec',
    specs: '24,800 stitches wild turkey strutting embroidery with mountain forest & skull crest',
    client: 'The Mexican Turkey Slayers Hunting Club',
    description: 'Full-color outdoor hunting club embroidery digitizing featuring iridescent strutting turkey fan feathers, crossed 12-gauge shotguns, mountain forest background, and Mexican flag banner ribbon designed for field vest backs and structured camo trucker caps.',
    stitchCount: '24,800 Stitches',
    turnaround: '3 Days',
    deliverables: ['DST / PES Machine Files', 'Cap & Flat Hoop Setup', 'Thread Run Sheet', '300 DPI High-Res Proof']
  },
  {
    id: 'emb-dog-house',
    title: 'The Doghouse Coffee German Shepherd Crest Embroidery Patch',
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: dogHouseImg,
    tag: 'Merrowed Patch 18K',
    specs: 'Detailed German Shepherd profile with steaming coffee cup, laurels & sharp satin banner',
    client: 'The Doghouse Coffee Co.',
    description: 'Premium coffee brand embroidered patch featuring noble German Shepherd bust, steaming porcelain coffee cup, gold laurel branches, and rich espresso brown twill background with overlocked merrowed edge and heat-seal adhesive backing.',
    stitchCount: '18,200 Stitches',
    turnaround: '3 Days',
    deliverables: ['Custom Merrowed Border Patches', 'Heat-Seal & Velcro Backing', 'DST / PES Production Files', 'Sample Stitchout Proof']
  },
  {
    id: 'emb-fresh-look',
    title: 'Fresh Look Power Washing Mascot Embroidery Digitizing',
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: freshLookImg,
    tag: 'Mascot Cap & Chest',
    specs: '21,500 stitches water droplet mascot with pressure lance & 3D bevel text banner',
    client: 'Fresh Look Power Washing & Exterior Cleaning',
    description: 'Commercial service mascot embroidery featuring dynamic water droplet character holding high-pressure spray wand, water splash accents, and clean royal blue satin stitch banner lettering optimized for left-chest polos and water-resistant jackets.',
    stitchCount: '21,500 Stitches',
    turnaround: '3 Days',
    deliverables: ['Structured Cap File', 'Left Chest Polo File', 'DST / EXP / PES', 'Madeira Thread Chart']
  },
  {
    id: 'emb-dezertwulf',
    title: 'Dezertwulf Saguaro Howling Wolf Desert Embroidery Patch',
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: dezertwulfImg,
    tag: 'Desert Crest Patch',
    specs: '19,400 stitches howling wolf silhouette with saguaro cacti, desert moon & red satin arch border',
    client: 'Dezertwulf Off-Road & Overland Co.',
    description: 'Rugged desert expedition embroidered badge with howling wolf silhouette atop rocky canyon, towering saguaro cactus silhouettes, full moon glow, and deep crimson satin stitch arched border crafted for off-road headwear and overland tactical gear.',
    stitchCount: '19,400 Stitches',
    turnaround: '3 Days',
    deliverables: ['Merrowed Edge Twill Patches', 'DST / PES Machine Files', 'Thread Color Run Sheet', 'High-Res Digital Mockup']
  },
  {
    id: 'emb-purple-horse',
    title: 'Purple Stallion Athletics Mascot Custom Direct Embroidery',
    category: 'embroidery',
    categoryLabel: 'Embroidery',
    image: purpleHorseWrestlingImg,
    tag: 'Athletic Mascot Spec',
    specs: '18,500 stitches geometric purple stallion head with sharp shield outline & high-contrast highlights',
    client: 'Purple Horse Wrestling & Sports Academy',
    description: 'Commercial varsity embroidery file featuring dynamic geometric stallion head with angular cutlines, flowing violet mane, and crisp shield outline engineered with calibrated pull compensation for varsity jackets, hoodies, and structured caps.',
    stitchCount: '18,500 Stitches',
    turnaround: '3 Days',
    deliverables: ['DST / PES / EXP Machine Files', 'Stitch Simulation Sheet', 'Left Chest & Cap Setup', 'Color Stop Sequence']
  },

  // ================= VECTOR ARTWORK =================
  {
    id: 'vec-fort-irwin-firefighters',
    title: 'Fort Irwin Firefighters Association Est. 1996 Heraldic Crest Vector Redraw',
    category: 'vector-artwork',
    categoryLabel: 'Vector Artwork',
    image: fortIrwinFirefightersImg,
    tag: 'Firefighter Crest Vector',
    specs: 'High-contrast manual Bézier vector reconstruction of firefighter crest with crossed axes, Black Hawk helicopter, desert sunset, Joshua trees & coyote',
    client: 'Fort Irwin Firefighters Association (Est. 1996)',
    description: 'Intricate heraldic firefighter association emblem reconstructed with precision Bézier curves. Features dual crossed fire axes, rescue helicopter in flight, desert mountain horizon with Joshua tree, howling coyote silhouette, and ornate ribbon scrolls "FORT IRWIN - EST 1996 - FIREFIGHTERS ASSOCIATION". Perfectly separated for screen printing, vinyl cutting, vehicle decals, and patch manufacturing.',
    colors: '1-Color High-Contrast Black Vector',
    turnaround: '3-4 Hours',
    deliverables: ['.AI Vector Master', '.EPS Scale Master', '.SVG Cut/Web Asset', 'Ultra-Hi-Res Print PDF', 'Transparent PNG']
  },
  {
    id: 'vec-bagley-fosston-flyers',
    title: 'Bagley Fosston Flyers Palmer #5 Mascot Sticker Vector & Plotter Cutline',
    category: 'vector-artwork',
    categoryLabel: 'Vector Artwork',
    image: bagleyFlyersVectorImg,
    tag: 'Sports Mascot & Cutline',
    specs: 'Multi-color athletic hockey sticker with ferocious eagle mascot, crossed hockey sticks, golden snowflakes, ice texture & kiss-cut contour path',
    client: 'Bagley Fosston Flyers Hockey Club (Palmer #5)',
    description: 'Dynamic multi-layered sports vector illustration and sticker production artwork. Features a fierce bald eagle mascot with gold beak and outstretched claws clutching a maroon "FLYERS" banner, radial crossed hockey sticks with striped tape, icy blue crystal texture with golden yellow snowflakes, custom player typography "PALMER #5", and an exact 0.125" bleed vinyl plotter contour cut line.',
    colors: 'Maroon, Gold, Icy Blue, Black & White',
    turnaround: '4 Hours',
    deliverables: ['.AI Vector Source with Named Cut Contour Layer', '.EPS Print/Cut Master', '.SVG Plotter File', 'High-Res 300 DPI PNG']
  },
  {
    id: 'vec-mcallen-police',
    title: 'City of McAllen Police Department Texas Star Shield Vector Redraw',
    category: 'vector-artwork',
    categoryLabel: 'Vector Artwork',
    image: mcallenPoliceImg,
    tag: 'Law Enforcement Shield Spec',
    specs: 'High-precision manual Bézier vector reconstruction of law enforcement gold badge, Texas star & eagle crest',
    client: 'City of McAllen Police Department',
    description: 'Masterclass manual vector redraw and conversion of multi-element police badge featuring 5-point star, Texas state seal, bald eagle crest, and crisp micro-text "POLICE - CITY OF MCALLEN TEXAS". Engineered with clean layered paths for uniform patches, vehicle decals, signs, and apparel screen printing.',
    colors: 'Spot Gold, Navy Blue, Crimson Red & Black',
    turnaround: '4 Hours',
    deliverables: ['.AI Vector Master', '.EPS Scale Master', '.SVG Cut/Web Asset', 'Ultra-Hi-Res Print PDF']
  },
  {
    id: 'vec-1',
    title: 'International Falls Public Library Book Stack Vector Redraw',
    category: 'vector-artwork',
    categoryLabel: 'Vector Artwork',
    image: intlFallsLibraryImg,
    tag: 'Color Vector Recreation',
    specs: 'Complete manual Bézier curve vectorization of children library emblem with vibrant rainbow palette',
    client: 'International Falls Public Library',
    description: 'Whimsical library emblem featuring an open hardcover book atop a colorful stack of volumes, shooting stars, and cheerful multi-color bubble lettering reconstructed into crisp vector format for signs, bookmarks, and summer reading tees.',
    colors: 'Rainbow Spot Vector & Black Outlines',
    turnaround: '3 Hours',
    deliverables: ['.AI Vector Master', '.EPS Scale Master', '.SVG Web Asset', 'Ultra-Hi-Res Print PDF']
  },
  {
    id: 'vec-2',
    title: 'Alfajores Sandwich Cookies Precision Vector Line Art',
    category: 'vector-artwork',
    categoryLabel: 'Vector Artwork',
    image: alfajoresCookiesImg,
    tag: 'Line Art Vector',
    specs: 'Raster photo converted into clean single-weight vector contour line art for engraving and print packaging',
    client: 'Artisan Bakery & Confections',
    description: 'Precision vector node conversion from a plate photo of powdered-sugar dulce de leche sandwich cookies into clean, minimalist vector wireframe outlines ideal for laser engraving, menu linework, and packaging stamp dies.',
    colors: '1-Color Vector Line Art',
    turnaround: '2 Hours',
    deliverables: ['Vector AI Master', 'Clean Line SVG', 'Laser DXF Cut Path', 'Transparent 300 DPI PNG']
  },
  {
    id: 'vec-3',
    title: 'Back Woods Firearms Rustic Vector Emblem Redraw',
    category: 'vector-artwork',
    categoryLabel: 'Vector Artwork',
    image: backWoodsImg,
    tag: 'Manual Node Tracing',
    specs: 'Hand-crafted vectorization of distressed hunting crest into crisp, infinitely scalable vector artwork',
    client: 'Back Woods Firearms Co.',
    description: 'Full manual Bézier curve reconstruction of intricate outdoor firearm badge with crossed rifles, sunrise emblem, mountain ridge, pine forest, and custom Western wood-grain typography.',
    colors: 'Pantone Ochre, Forest Green & Espresso',
    turnaround: '4 Hours',
    deliverables: ['.AI Master File', '.EPS Print Master', '.SVG Scalable Vector', '300 DPI Transparent PNG']
  },
  {
    id: 'vec-4',
    title: 'Girls Just Wanna Have Fun Vector Redraw & Color Separation',
    category: 'vector-artwork',
    categoryLabel: 'Vector Artwork',
    image: girlsWannaHaveFunImg,
    tag: 'Color Separated',
    specs: 'Spot color separation with underbase channels & crisp typography redrawn for screen printing',
    client: 'Girls Trip Apparel & Events',
    description: 'Precision before-and-after vector redraw of custom cocktail martini glass illustration with leopard pattern bow, refined typography "Girls Just Wanna Have Fun - girls trip 2026", and spot color film separations ready for apparel press.',
    colors: '4 Spot Colors + White Underbase',
    turnaround: '4 Hours',
    deliverables: ['Vector AI Master', 'Film Output PDF', 'Color Separation Channels', 'Pantone Color Guide']
  },
  {
    id: 'vec-5',
    title: 'The Country Market Fresh Meats & Sweet Treats Mascot Vector Master',
    category: 'vector-artwork',
    categoryLabel: 'Vector Artwork',
    image: countryMarketFreshMeatsImg,
    tag: 'Mascot Vectorization',
    specs: 'Intricate multi-character cartoon illustration traced manually into razor-sharp vector shapes',
    client: 'The Country Market Deli & Sweets',
    description: 'High-detail manual vectorization of country market mascot trio with clean color fills, detailed shading, waffle cones, and bold retro banner typography suitable for both light and dark backgrounds.',
    colors: 'Pantone Solid Coated Master Palette',
    turnaround: '5 Hours',
    deliverables: ['.AI Master File', '.EPS Scale Master', '.SVG Web Asset', 'Dark/Light Background Variations']
  },
  {
    id: 'vec-6',
    title: 'North Eastern Utilities Industrial Vector Badge',
    category: 'vector-artwork',
    categoryLabel: 'Vector Artwork',
    image: northEasternUtilitiesImg,
    tag: 'Billboard Scalable',
    specs: 'Heavy industrial multi-element emblem redrawn for billboard & vehicle wrap scale',
    client: 'North Eastern Utilities (Andy Waggoner)',
    description: 'Precision manual vectorization of intricate industrial badge with gear perimeter, heavy excavator equipment, city skyline, crane, crossed wrench & hammer tools, and curved ribbon lettering with zero node distortion at large billboard scale.',
    colors: 'Pantone Industrial Orange & Charcoal Black',
    turnaround: '6 Hours',
    deliverables: ['.AI Vector Master', '.EPS Scale Master', '.SVG Scalable Vector', 'Ultra-Hi-Res Print PDF']
  },
  {
    id: 'vec-stx-archery',
    title: 'STX Archery & Outdoors Big Horn Sheep Mountain Badge Vector Redraw',
    category: 'vector-artwork',
    categoryLabel: 'Vector Artwork',
    image: stxArcheryImg,
    tag: 'Metallic 3D Vector Emblem',
    specs: 'Hexagonal outdoor adventure badge with big horn ram, snow-capped peaks, sunset sky & 3D chrome typography',
    client: 'STX Archery & Outdoors (Brand Ambassador Program)',
    description: 'High-detail manual vector conversion and redraw of heavy hexagonal hunting emblem featuring a majestic big horn ram overlooking the Rocky Mountains at sunset, complete with dimensional chrome bevels, wings, and crisp sub-text "BRAND AMBASSADOR".',
    colors: 'Full CMYK & Spot Vector Palette',
    turnaround: '4 Hours',
    deliverables: ['.AI Vector Master', '.EPS Scalable Master', '.SVG Cut / Web Asset', '300 DPI Transparent PNG']
  },
  {
    id: 'vec-thumb-print',
    title: 'Fingerprint Leaf Silhouette Forensic Vector Trace (Before & After)',
    category: 'vector-artwork',
    categoryLabel: 'Vector Artwork',
    image: thumbPrintLeafImg,
    tag: 'Forensic Vector Extraction',
    specs: 'Precision node-by-node reconstruction of intricate friction ridges and negative space leaf veins from paper stamp',
    client: 'BioIdentity & Nature Brand Identity',
    description: 'High-precision manual vector tracing converting a low-resolution ink fingerprint on textured paper into razor-sharp, flawless vector nodes with smooth Bézier curves, capturing thousands of fine biometric friction lines and organic leaf anatomy.',
    colors: '1-Color Pure Black Vector / Monochromatic',
    turnaround: '3 Hours',
    deliverables: ['Vector AI Source Master', 'Clean Node SVG', 'Laser & Vinyl Cut DXF', 'High-Res 1200 DPI PNG']
  },
  {
    id: 'vec-7',
    title: 'Arabia Hot Rods Line Art & Silhouette Vector Conversion',
    category: 'vector-artwork',
    categoryLabel: 'Vector Artwork',
    image: arabiaHotRodsImg,
    tag: 'Line Art Vector',
    specs: 'Vintage roadster with flames converted into crisp black-and-white outline & solid silhouette cuts',
    client: 'Arabia Hot Rods Garage',
    description: 'Precision vector conversion of vintage hot rod vehicle with flame paint job into cut-ready line art and bold silhouette separations suitable for vinyl decals, screen printing, and laser engraving.',
    colors: '1-Color Black Outline & Silhouette',
    turnaround: '3 Hours',
    deliverables: ['Vector AI Master', 'Cut-Ready DXF/SVG', 'Screen Print Film PDF', 'High-Res Monochrome PNG']
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '1',
    title: 'CONTACT US',
    description: 'Send your design or requirements.',
    iconName: 'MessageSquare',
    detail: 'Upload your vector file, sketch, or mock-up with your apparel preferences and quantity.'
  },
  {
    step: '2',
    title: 'GET A QUOTE',
    description: "We'll review and send you the best quote.",
    iconName: 'FileText',
    detail: 'Receive transparent pricing, digital proof, and turnaround estimates in minutes.'
  },
  {
    step: '3',
    title: 'WE PRODUCE',
    description: 'Your order goes into production.',
    iconName: 'Shirt',
    detail: 'Our master printers and digitizers run your job with strict multi-stage quality control.'
  },
  {
    step: '4',
    title: 'FAST DELIVERY',
    description: 'We deliver your order on time, every time.',
    iconName: 'Truck',
    detail: 'Carefully packaged, folded, and dispatched with live tracking right to your doorstep.'
  }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Jason T.',
    role: 'Business Owner',
    location: 'USA',
    image: '',
    quote: 'Amazing quality and fast turnaround! Graphics Punching is my go-to for all my apparel needs. The print vibrancy and stitch precision consistently exceed our standards.',
    rating: 5,
    serviceUsed: 'Screen Printing & Embroidery'
  },
  {
    id: 'test-2',
    name: 'Sarah M.',
    role: 'Clothing Brand Owner',
    location: 'Los Angeles, CA',
    image: '',
    quote: 'The embroidery digitizing is perfect and the stitching quality is top notch. Highly recommend! Zero thread breaks on our machines and client feedback has been phenomenal.',
    rating: 5,
    serviceUsed: 'Logo Digitizing & Custom Apparel'
  },
  {
    id: 'test-3',
    name: 'Mike R.',
    role: 'Team Manager',
    location: 'Chicago, IL',
    image: '',
    quote: 'Great communication, best prices and the prints always come out better than expected. They handled our 500-piece rush tournament order in record time without a single defect.',
    rating: 5,
    serviceUsed: 'Screen Printing & Vector Artwork'
  }
];

export const FAQ_ITEMS = [
  {
    q: 'What artwork formats do you accept for screen printing & digitizing?',
    a: 'We accept all major formats including .AI, .EPS, .PDF, .SVG, .PSD, .PNG, .JPG, .TIFF. For embroidery machine files, we export to .DST, .PES, .EMB, .EXP, .JEF, and .VP3. If you have low-res artwork, our Vector Artwork team can convert it into crisp vectors.'
  },
  {
    q: 'What is your standard turnaround time?',
    a: 'Vector conversions and logo digitizing are delivered in 4 to 12 hours (express options available). Custom screen printing and embroidery production standard turnaround is 3 to 7 business days depending on order size.'
  },
  {
    q: 'Are there any hidden setup or screen fees?',
    a: 'No! We believe in 100% transparent pricing. We do not charge surprise setup fees, film separation fees, or screen preparation costs on standard orders.'
  },
  {
    q: 'Do you offer rush orders?',
    a: 'Yes, we provide 24-48 hour rush apparel production and same-day express digitizing service. Contact our team directly with your deadline to confirm availability.'
  },
  {
    q: 'Can I see a sample or digital proof before production?',
    a: 'Absolutely! We send high-resolution digital mock-ups and embroidery stitch-out simulation worksheets for your written approval before any garments enter the print or embroidery line.'
  }
];
