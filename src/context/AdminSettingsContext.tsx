import React, { createContext, useContext, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { computeHashSync, DEFAULT_AUTH_HASH } from '../utils/security';
import {
  WebsiteSettings,
  EditablePortfolioItem,
  ContactLead,
  EmailLog,
  BrandingSettings,
  HomepageSettings,
  ContactSettings,
  EmailSystemSettings,
  SocialLinksSettings,
  WatermarkConfig,
  SectionVisibilityFlags,
  NavigationMenuItem,
  FooterSettings,
  PageSEOSetting,
} from '../types/admin';
import {
  CONTACT_INFO,
  SERVICES,
  SERVICE_PACKAGES,
  PORTFOLIO_PROJECTS,
  PortfolioItem,
} from '../data/content';

// Default initial state matching original data
const DEFAULT_BRANDING: BrandingSettings = {
  siteName: 'Graphics Punching',
  tagline: 'Professional Screen Printing, Embroidery Digitizing & Vector Artwork Services',
  logoText: 'GRAPHICS PUNCHING',
  logoSubtext: 'VECTOR ARTWORK • EMBROIDERY DIGITIZING • SCREEN PRINTING',
  faviconUrl: '/favicon.ico',
  primaryColor: '#FFC400',
  accentColor: '#050505',
  announcementBarText: '🚀 Fast Express Turnaround (2-6 Hours) • No Hidden Fees • Free Minor Revisions',
  announcementBarEnabled: true,
  announcementBarLink: '#/contact',
};

const DEFAULT_HOMEPAGE: HomepageSettings = {
  heroBadge: 'PREMIUM VECTOR ART & EMBROIDERY DIGITIZING',
  heroHeadline: 'MASTER-CRAFTED APPAREL & VECTOR ARTWORK',
  heroHeadlineHighlight: 'READY FOR PRESS & EMBROIDERY MACHINES',
  heroSubtitle: 'Transform any sketch, raster image, or emblem into high-precision, production-ready manual vector files and machine-calibrated embroidery digitizing in as fast as 2 to 6 hours.',
  heroCtaText: 'START CUSTOM QUOTE',
  heroSecondaryCtaText: 'EXPLORE OUR WORK',
  trustBadge1: '100% Manual Node Redraws (Zero Auto-Trace)',
  trustBadge2: 'Tajima, Brother & Barudan Machine-Calibrated',
  trustBadge3: 'Rush 2-4 Hour Express Dispatch Available',
  aboutTitle: 'WORLD-CLASS VECTOR ART & DIGITIZING MASTERY',
  aboutSubtitle: 'Built by Industry Veterans for Screen Printers, Embroiderers & Apparel Brands',
  aboutStory: 'Founded with a passion for millimeter precision and flawless stitch pathing, Graphics Punching powers print shops, commercial embroiderers, uniform makers, and athletic apparel manufacturers worldwide. Every node is placed by hand with obsessive attention to detail.',
  ctaBannerTitle: 'READY TO TURN YOUR ARTWORK INTO PRODUCTION-READY FILES?',
  ctaBannerSubtitle: 'Get a fast, accurate quote within minutes. Zero setup fees, free file formats, and unlimited minor adjustments included.',
  ctaBannerBtnText: 'REQUEST INSTANT QUOTE',
};

const DEFAULT_CONTACT: ContactSettings = {
  phone: CONTACT_INFO.phone,
  phoneClean: CONTACT_INFO.phoneClean,
  email: CONTACT_INFO.email,
  secondaryEmail: CONTACT_INFO.secondaryEmail || 'info@graphicspunching.com',
  location: CONTACT_INFO.location,
  website: CONTACT_INFO.website,
  workingHours: CONTACT_INFO.workingHours,
  turnaroundClaim: '2-6 Hours Express Digitizing & Vector Redraws',
};

const DEFAULT_EMAIL_SETTINGS: EmailSystemSettings = {
  connectedEmail: 'graphicspunching264@gmail.com',
  notificationEmail: 'graphicspunching264@gmail.com',
  autoResponderEnabled: true,
  autoResponderSubject: 'Thank you for contacting Graphics Punching - We have received your project details',
  autoResponderBody: 'Hello,\n\nThank you for reaching out to Graphics Punching. We have received your inquiry / quote request and our production team is already reviewing your file specifications.\n\nWe will reply with an exact turnaround estimate and breakdown shortly.\n\nBest regards,\nGraphics Punching Team\n+1 (607) 205-0030\nwww.graphicspunching.com',
  quotePrefix: '[NEW QUOTE REQUEST]',
  replyToName: 'Graphics Punching Production Desk',
};

const DEFAULT_SOCIAL: SocialLinksSettings = {
  facebook: CONTACT_INFO.social.facebook || 'https://www.facebook.com/profile.php?id=61593649506118',
  instagram: 'https://instagram.com',
  pinterest: 'https://pinterest.com',
  linkedin: 'https://linkedin.com',
  youtube: 'https://youtube.com',
  tiktok: 'https://tiktok.com',
  twitter: 'https://x.com',
  whatsapp: '+16072050030',
  website: 'https://www.graphicspunching.com',
};

const DEFAULT_WATERMARK: WatermarkConfig = {
  enabled: true,
  text: 'GRAPHICS PUNCHING • PROOF',
  opacity: 0.22,
  size: 20,
  placement: 'diagonal',
  color: '#ffffff',
};

const DEFAULT_SECTIONS: SectionVisibilityFlags = {
  topContactBar: true,
  heroStats: true,
  beforeAfterSlider: true,
  servicesGrid: true,
  whyChooseUs: true,
  processSteps: true,
  pricingSection: true,
  portfolioShowcase: true,
  testimonials: true,
  faqSection: true,
  ctaBanner: true,
  footerDirectory: true,
  watermarkOverlay: true,
};

const DEFAULT_NAVIGATION: NavigationMenuItem[] = [
  { id: 'nav-home', label: 'HOME', page: 'home', href: '#/', enabled: true, order: 1 },
  { id: 'nav-services', label: 'SERVICES', page: 'services', href: '#/services', enabled: true, order: 2 },
  { id: 'nav-pricing', label: 'PRICING', page: 'pricing', href: '#/pricing', enabled: true, order: 3 },
  { id: 'nav-portfolio', label: 'PORTFOLIO', page: 'portfolio', href: '#/portfolio', enabled: true, isDropdown: true, order: 4 },
  { id: 'nav-about', label: 'ABOUT US', page: 'about', href: '#/about', enabled: true, order: 5 },
  { id: 'nav-how-it-works', label: 'HOW IT WORKS', page: 'how-it-works', href: '#/how-it-works', enabled: true, order: 6 },
  { id: 'nav-testimonials', label: 'TESTIMONIALS', page: 'testimonials', href: '#/testimonials', enabled: true, order: 7 },
  { id: 'nav-faq', label: 'FAQ', page: 'faq', href: '#/faq', enabled: true, order: 8 },
  { id: 'nav-contact', label: 'CONTACT US', page: 'contact', href: '#/contact', enabled: true, order: 9 },
];

const DEFAULT_FOOTER: FooterSettings = {
  description: 'Graphics Punching is the premier global studio specializing in custom apparel screen printing, high-precision manual vector conversions, and machine-tested embroidery digitizing for brands and decorators worldwide.',
  copyrightText: `© ${new Date().getFullYear()} Graphics Punching. All rights reserved. Registered trademark.`,
  disclaimerText: 'All company names, brand logos, and registered marks displayed in sample portfolios remain the sole property of their respective trademark holders and are showcased strictly for technique demonstration.',
  addressSnippet: 'Global Digital Dispatch • Fast Worldwide Service & High-Speed Turnaround',
  showMadeWithLove: true,
  quickLinksTitle: 'Quick Directory',
};

const DEFAULT_SEO: Record<string, PageSEOSetting> = {
  home: {
    title: 'Graphics Punching | Screen Printing, Vector Artwork & Embroidery Digitizing',
    description: 'Premier custom screen printing, manual vector artwork redraws, and precision embroidery digitizing services with 2-6 hour turnaround.',
    keywords: 'vector redraw, embroidery digitizing, screen printing, color separation, DST files, PES files, AI vector files, apparel printing',
  },
  services: {
    title: 'Our Services | Vector Redraws, Embroidery Digitizing & Screen Print Separations',
    description: 'Explore our full range of master-grade artwork and digitizing services starting from $15 per file.',
    keywords: 'embroidery digitizing services, vector art services, color separations, custom patches, logo punch',
  },
  pricing: {
    title: 'Transparent Pricing Schedule | Graphics Punching',
    description: 'Simple and transparent pricing: Simple Vectors at $15, Complex Vectors at $25, Left Chest & Cap Digitizing at $15, Jacket Backs at $40.',
    keywords: 'embroidery pricing, vector art prices, digitizing cost, cheap vector conversion, fast digitizing quotes',
  },
  portfolio: {
    title: 'Production Portfolio & Gallery | Graphics Punching',
    description: 'Browse 30+ real production examples of vector conversions, screen prints, and cap embroidery digitizing.',
    keywords: 'vector portfolio, embroidery samples, screen printing examples, DST stitch preview',
  },
  contact: {
    title: 'Contact Us & Custom Quote | Graphics Punching',
    description: 'Submit your raster artwork, logos, or apparel mockup for an immediate turnaround quote and review.',
    keywords: 'request quote, contact digitizer, vector redraw quote, apparel mockups',
  },
};

const INITIAL_CONTACT_LEADS: ContactLead[] = [
  {
    id: 'lead-1',
    name: 'Michael Henderson',
    email: 'm.henderson@apexathletics.com',
    phone: '+1 (512) 489-3320',
    company: 'Apex Athletic Apparel',
    serviceInterested: 'Embroidery Digitizing (Cap & Left Chest)',
    projectDetails: 'Looking for 3D puff embroidery file for team snapbacks. 5,000 piece run.',
    date: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'new',
    source: 'Website Quote Form',
  },
  {
    id: 'lead-2',
    name: 'Sarah Jenkins',
    email: 'sjenkins@urbanthreadprint.com',
    phone: '+1 (312) 809-1144',
    company: 'Urban Thread Printworks',
    serviceInterested: 'Simulated Process Color Separation',
    projectDetails: '6-color simulated process for black hoodies, need white underbase + highlight.',
    date: new Date(Date.now() - 3600000 * 8).toISOString(),
    status: 'quoted',
    source: 'Contact Page Inquiry',
  },
  {
    id: 'lead-3',
    name: 'David Torres',
    email: 'dtorres@lone-star-uniforms.com',
    phone: '+1 (210) 993-4521',
    company: 'Lone Star Uniforms & Workwear',
    serviceInterested: 'Vector Artwork & Left Chest Patch',
    projectDetails: 'Police department crest redraw from low-res scan and DST digitizing.',
    date: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'contacted',
    source: 'Direct Email',
  },
  {
    id: 'lead-4',
    name: 'Emily Watson',
    email: 'emily@coastlinemerch.com',
    phone: '+1 (619) 320-7711',
    company: 'Coastline Merchandising',
    serviceInterested: 'Jacket Back Digitizing',
    projectDetails: 'Large 45,000 stitch biker club jacket back with metallic gold thread simulation.',
    date: new Date(Date.now() - 3600000 * 48).toISOString(),
    status: 'closed',
    source: 'Website Quote Form',
  },
];

const INITIAL_EMAIL_LOGS: EmailLog[] = [
  {
    id: 'log-1',
    trackingId: 'GP-MSG-K98X2-901B',
    to: 'm.henderson@apexathletics.com',
    recipientName: 'Michael Henderson',
    from: 'graphicspunching264@gmail.com',
    replyTo: 'graphicspunching264@gmail.com',
    subject: 'Your 3D Puff Snapback Digitizing Quote - Graphics Punching',
    body: `Hi Michael,\n\nThank you for reaching out regarding the 3D puff embroidery digitizing for Apex Athletic Apparel.\n\nWe have reviewed your team snapback artwork. We can deliver your calibrated Tajima DST and Wilcom EMB files with center-out pathing and dedicated 3D foam underlay within 4 hours for $15.\n\nWould you like us to proceed immediately?\n\nBest regards,\nProduction Team\nGraphics Punching`,
    attachments: [
      { id: 'att-1', name: 'Apex_Snapback_Preview_Simulation.png', size: 482000, type: 'image/png', isSample: true },
      { id: 'att-2', name: 'Graphics_Punching_Rate_Card.pdf', size: 124000, type: 'application/pdf', isSample: true },
    ],
    status: 'delivered',
    sentAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'log-2',
    trackingId: 'GP-MSG-K74Q1-442C',
    to: 'sjenkins@urbanthreadprint.com',
    recipientName: 'Sarah Jenkins',
    from: 'graphicspunching264@gmail.com',
    replyTo: 'graphicspunching264@gmail.com',
    subject: 'Completed 6-Color Simulated Process Separations - Urban Thread',
    body: `Hi Sarah,\n\nYour 6-color simulated process color separations for the black hoodie run are completed and verified.\n\nAttached are your RIP-ready film positives with Pantone Solid Coated callouts and dedicated 55 LPI halftone angle worksheets.\n\nPlease let us know if you need any adjustments to the white underbase choke.\n\nBest regards,\nGraphics Punching Team`,
    attachments: [
      { id: 'att-3', name: 'UrbanThread_SimProcess_Films.pdf', size: 1850000, type: 'application/pdf', isSample: true },
    ],
    status: 'delivered',
    sentAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
];

interface AdminSettingsContextType {
  settings: WebsiteSettings;
  portfolioItems: EditablePortfolioItem[];
  leads: ContactLead[];
  emailLogs: EmailLog[];
  previewMode: boolean;
  isAdminAuthenticated: boolean;

  // Real-Time Live Sync & Publishing
  isPublishing: boolean;
  hasUnpublishedChanges: boolean;
  lastPublishedAt: string | null;
  autoPublishLive: boolean;
  syncStatus: 'synced' | 'unsaved' | 'publishing' | 'offline' | 'error';
  publishToLive: (options?: { quiet?: boolean; note?: string }) => Promise<{ success: boolean; message: string; publishedAt?: string }>;
  toggleAutoPublishLive: () => void;
  syncFromServer: () => Promise<void>;

  // Authentication
  loginAdmin: (passwordOrPin: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPassword: (currentPassword: string, newPassword: string) => { success: boolean; message: string };

  // Settings Updaters
  updateBranding: (branding: Partial<BrandingSettings>) => void;
  updateHomepage: (homepage: Partial<HomepageSettings>) => void;
  updateContact: (contact: Partial<ContactSettings>) => void;
  updateEmailSettings: (emailSettings: Partial<EmailSystemSettings>) => void;
  updateSocial: (social: Partial<SocialLinksSettings>) => void;
  updateWatermark: (watermark: Partial<WatermarkConfig>) => void;
  updateSections: (sections: Partial<SectionVisibilityFlags>) => void;
  updateNavigation: (navigation: NavigationMenuItem[]) => void;
  updateFooter: (footer: Partial<FooterSettings>) => void;
  updateSEO: (pageKey: string, seo: Partial<PageSEOSetting>) => void;
  updateServices: (services: any[]) => void;
  updatePricingPackages: (packages: any[]) => void;

  // Portfolio Management
  addPortfolioItem: (item: Omit<EditablePortfolioItem, 'id'>) => EditablePortfolioItem;
  editPortfolioItem: (id: string, item: Partial<EditablePortfolioItem>) => void;
  deletePortfolioItem: (id: string) => void;
  reorderPortfolioItems: (newItems: EditablePortfolioItem[]) => void;

  // Leads & Contact Management
  addContactLead: (lead: Omit<ContactLead, 'id' | 'date'>) => ContactLead;
  updateContactLead: (id: string, updates: Partial<ContactLead>) => void;
  deleteContactLead: (id: string) => void;

  // Email Logs Management
  addEmailLog: (log: Omit<EmailLog, 'id' | 'trackingId' | 'sentAt'>) => EmailLog;
  updateEmailLog: (id: string, updates: Partial<EmailLog>) => void;
  deleteEmailLog: (id: string) => void;
  clearEmailLogs: () => void;

  // Utility
  togglePreviewMode: () => void;
  resetToDefaults: () => void;
  exportSettingsJSON: () => string;
  importSettingsJSON: (jsonStr: string) => boolean;
}

const AdminSettingsContext = createContext<AdminSettingsContextType | null>(null);

const STORAGE_KEYS = {
  SETTINGS: 'gp_website_settings_v2',
  PORTFOLIO: 'gp_portfolio_items_v2',
  LEADS: 'gp_contact_leads_v2',
  EMAIL_LOGS: 'gp_email_logs_v2',
  AUTH: 'gp_admin_session_auth_v2',
  AUTH_HASH: 'gp_admin_auth_hash_v2',
  LAST_PUBLISHED: 'gp_last_published_at_v2',
  AUTO_PUBLISH: 'gp_auto_publish_live_v2',
};

export const AdminSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Settings State
  const [settings, setSettings] = useState<WebsiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading settings from localStorage:', e);
    }
    return {
      branding: DEFAULT_BRANDING,
      homepage: DEFAULT_HOMEPAGE,
      contact: DEFAULT_CONTACT,
      emailSettings: DEFAULT_EMAIL_SETTINGS,
      social: DEFAULT_SOCIAL,
      watermark: DEFAULT_WATERMARK,
      sections: DEFAULT_SECTIONS,
      navigation: DEFAULT_NAVIGATION,
      footer: DEFAULT_FOOTER,
      seo: DEFAULT_SEO,
      services: SERVICES,
      pricingPackages: SERVICE_PACKAGES,
    };
  });

  // 2. Portfolio Items State
  const [portfolioItems, setPortfolioItems] = useState<EditablePortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading portfolio from localStorage:', e);
    }
    // Initialize with existing portfolio projects
    return PORTFOLIO_PROJECTS.map((item, index) => ({
      id: item.id,
      title: item.title,
      category: item.category as 'vector' | 'embroidery' | 'color-separation',
      categoryLabel: item.categoryLabel,
      image: item.image,
      originalImage: item.image,
      tag: item.tag,
      specs: item.specs,
      client: item.client,
      description: item.description,
      turnaround: item.turnaround,
      colors: item.colors,
      stitchCount: item.stitchCount,
      deliverables: item.deliverables,
      order: index + 1,
      featured: index < 6,
    }));
  });

  // 3. Leads Database
  const [leads, setLeads] = useState<ContactLead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading leads from localStorage:', e);
    }
    return INITIAL_CONTACT_LEADS;
  });

  // 4. Email History Logs
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EMAIL_LOGS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading email logs from localStorage:', e);
    }
    return INITIAL_EMAIL_LOGS;
  });

  // 5. Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // 6. Preview Mode State
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  // 7. Real-Time Live Sync & Publishing State
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState<boolean>(false);
  const [lastPublishedAt, setLastPublishedAt] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_PUBLISHED) || null;
    } catch {
      return null;
    }
  });
  const [autoPublishLive, setAutoPublishLive] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTO_PUBLISH) === 'true';
    } catch {
      return true; // Default ON for seamless real-time syncing
    }
  });
  const [syncStatus, setSyncStatus] = useState<'synced' | 'unsaved' | 'publishing' | 'offline' | 'error'>('synced');

  // Track initial server fetch completion
  const isInitialServerFetchDone = useRef<boolean>(false);
  const autoPublishTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize from Server
  const syncFromServer = useCallback(async () => {
    try {
      const res = await fetch('/api/site/data');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.hasCustomData && json.data) {
          const published = json.data;
          if (published.settings) {
            setSettings(published.settings);
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(published.settings));
          }
          if (Array.isArray(published.portfolioItems) && published.portfolioItems.length > 0) {
            setPortfolioItems(published.portfolioItems);
            localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(published.portfolioItems));
          }
          if (Array.isArray(published.leads)) {
            setLeads(published.leads);
            localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(published.leads));
          }
          if (Array.isArray(published.emailLogs)) {
            setEmailLogs(published.emailLogs);
            localStorage.setItem(STORAGE_KEYS.EMAIL_LOGS, JSON.stringify(published.emailLogs));
          }
          if (json.publishedAt) {
            setLastPublishedAt(json.publishedAt);
            localStorage.setItem(STORAGE_KEYS.LAST_PUBLISHED, json.publishedAt);
          }
          setHasUnpublishedChanges(false);
          setSyncStatus('synced');
        }
      }
    } catch (err) {
      console.warn('Could not sync with server:', err);
    }
  }, []);

  // 1. Initial Load: Fetch published website data from server
  useEffect(() => {
    syncFromServer().finally(() => {
      isInitialServerFetchDone.current = true;
    });
  }, [syncFromServer]);

  // 2. Real-Time Server-Sent Events (SSE) Listener for Live Updates
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let fallbackPollInterval: NodeJS.Timeout | null = null;

    try {
      eventSource = new EventSource('/api/site/events');

      eventSource.onopen = () => {
        setSyncStatus((prev) => (prev === 'offline' ? 'synced' : prev));
      };

      eventSource.onmessage = (event) => {
        try {
          const packet = JSON.parse(event.data);
          if (packet.type === 'published_update' && packet.data) {
            const updated = packet.data;
            if (updated.settings) setSettings(updated.settings);
            if (Array.isArray(updated.portfolioItems)) setPortfolioItems(updated.portfolioItems);
            if (Array.isArray(updated.leads)) setLeads(updated.leads);
            if (Array.isArray(updated.emailLogs)) setEmailLogs(updated.emailLogs);
            if (packet.publishedAt) {
              setLastPublishedAt(packet.publishedAt);
              localStorage.setItem(STORAGE_KEYS.LAST_PUBLISHED, packet.publishedAt);
            }
            setHasUnpublishedChanges(false);
            setSyncStatus('synced');
          } else if (packet.type === 'new_lead' && packet.lead) {
            setLeads((prev) => [packet.lead, ...prev.filter((l) => l.id !== packet.lead.id)]);
          } else if (packet.type === 'reset_to_defaults') {
            syncFromServer();
          }
        } catch (e) {
          console.warn('Error parsing SSE event:', e);
        }
      };

      eventSource.onerror = () => {
        // Fallback to polling if SSE encounters transient interruption
        if (!fallbackPollInterval) {
          fallbackPollInterval = setInterval(() => {
            syncFromServer();
          }, 15000);
        }
      };
    } catch (e) {
      console.warn('SSE not supported or failed to connect:', e);
      fallbackPollInterval = setInterval(() => {
        syncFromServer();
      }, 15000);
    }

    return () => {
      if (eventSource) eventSource.close();
      if (fallbackPollInterval) clearInterval(fallbackPollInterval);
    };
  }, [syncFromServer]);

  // Publish to Live Website Action
  const publishToLive = async (options?: { quiet?: boolean; note?: string }): Promise<{ success: boolean; message: string; publishedAt?: string }> => {
    setIsPublishing(true);
    setSyncStatus('publishing');

    try {
      const payload = {
        settings,
        portfolioItems,
        leads,
        emailLogs,
        note: options?.note || 'Published via Admin Portal',
      };

      const res = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const json = await res.json();

      if (json.success) {
        const publishTimestamp = json.publishedAt || new Date().toISOString();
        setLastPublishedAt(publishTimestamp);
        setHasUnpublishedChanges(false);
        setSyncStatus('synced');
        localStorage.setItem(STORAGE_KEYS.LAST_PUBLISHED, publishTimestamp);
        setIsPublishing(false);
        return {
          success: true,
          message: 'Website published and synchronized live to all visitors in real-time.',
          publishedAt: publishTimestamp,
        };
      } else {
        throw new Error(json.error || 'Failed to publish');
      }
    } catch (error: any) {
      console.error('Publish to live failed:', error);
      setIsPublishing(false);
      setSyncStatus('error');
      return {
        success: false,
        message: error?.message || 'Network error while publishing to live server.',
      };
    }
  };

  // Toggle Auto-Publish Mode
  const toggleAutoPublishLive = () => {
    setAutoPublishLive((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEYS.AUTO_PUBLISH, next ? 'true' : 'false');
      return next;
    });
  };

  // Persistence Effects to LocalStorage and Auto-Publish
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to persist settings:', e);
    }

    if (isInitialServerFetchDone.current) {
      setHasUnpublishedChanges(true);
      if (syncStatus !== 'publishing') setSyncStatus('unsaved');

      if (autoPublishLive) {
        if (autoPublishTimeoutRef.current) clearTimeout(autoPublishTimeoutRef.current);
        autoPublishTimeoutRef.current = setTimeout(() => {
          publishToLive({ quiet: true, note: 'Auto-published live update' });
        }, 1200);
      }
    }
  }, [settings, autoPublishLive]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(portfolioItems));
    } catch (e) {
      console.warn('Failed to persist portfolio items:', e);
    }

    if (isInitialServerFetchDone.current) {
      setHasUnpublishedChanges(true);
      if (syncStatus !== 'publishing') setSyncStatus('unsaved');

      if (autoPublishLive) {
        if (autoPublishTimeoutRef.current) clearTimeout(autoPublishTimeoutRef.current);
        autoPublishTimeoutRef.current = setTimeout(() => {
          publishToLive({ quiet: true, note: 'Auto-published live portfolio update' });
        }, 1200);
      }
    }
  }, [portfolioItems, autoPublishLive]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    } catch (e) {
      console.warn('Failed to persist leads:', e);
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EMAIL_LOGS, JSON.stringify(emailLogs));
    } catch (e) {
      console.warn('Failed to persist email logs:', e);
    }
  }, [emailLogs]);

  // Auth Methods
  const loginAdmin = (passwordInput: string): boolean => {
    if (!passwordInput) return false;
    const inputHash = computeHashSync(passwordInput.trim());

    // Check against custom persisted password hash or default hash
    let targetHash = DEFAULT_AUTH_HASH;
    try {
      const savedHash = localStorage.getItem(STORAGE_KEYS.AUTH_HASH);
      if (savedHash && savedHash.length === 64) {
        targetHash = savedHash;
      }
    } catch {}

    if (inputHash === targetHash) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      } catch {}
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch {}
  };

  const changeAdminPassword = (
    currentPassword: string,
    newPassword: string
  ): { success: boolean; message: string } => {
    if (!currentPassword || !newPassword) {
      return { success: false, message: 'All password fields are required.' };
    }
    if (newPassword.trim().length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    const currentInputHash = computeHashSync(currentPassword.trim());
    let targetHash = DEFAULT_AUTH_HASH;
    try {
      const savedHash = localStorage.getItem(STORAGE_KEYS.AUTH_HASH);
      if (savedHash && savedHash.length === 64) {
        targetHash = savedHash;
      }
    } catch {}

    if (currentInputHash !== targetHash) {
      return { success: false, message: 'Current password does not match.' };
    }

    const newHash = computeHashSync(newPassword.trim());
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_HASH, newHash);
      return { success: true, message: 'Administrator password successfully updated and encrypted.' };
    } catch (e) {
      return { success: false, message: 'Failed to update administrator password.' };
    }
  };

  // Updaters
  const updateBranding = (branding: Partial<BrandingSettings>) => {
    setSettings((prev) => ({ ...prev, branding: { ...prev.branding, ...branding } }));
  };

  const updateHomepage = (homepage: Partial<HomepageSettings>) => {
    setSettings((prev) => ({ ...prev, homepage: { ...prev.homepage, ...homepage } }));
  };

  const updateContact = (contact: Partial<ContactSettings>) => {
    setSettings((prev) => ({ ...prev, contact: { ...prev.contact, ...contact } }));
  };

  const updateEmailSettings = (emailSettings: Partial<EmailSystemSettings>) => {
    setSettings((prev) => ({ ...prev, emailSettings: { ...prev.emailSettings, ...emailSettings } }));
  };

  const updateSocial = (social: Partial<SocialLinksSettings>) => {
    setSettings((prev) => ({ ...prev, social: { ...prev.social, ...social } }));
  };

  const updateWatermark = (watermark: Partial<WatermarkConfig>) => {
    setSettings((prev) => ({ ...prev, watermark: { ...prev.watermark, ...watermark } }));
  };

  const updateSections = (sections: Partial<SectionVisibilityFlags>) => {
    setSettings((prev) => ({ ...prev, sections: { ...prev.sections, ...sections } }));
  };

  const updateNavigation = (navigation: NavigationMenuItem[]) => {
    setSettings((prev) => ({ ...prev, navigation }));
  };

  const updateFooter = (footer: Partial<FooterSettings>) => {
    setSettings((prev) => ({ ...prev, footer: { ...prev.footer, ...footer } }));
  };

  const updateSEO = (pageKey: string, seo: Partial<PageSEOSetting>) => {
    setSettings((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [pageKey]: { ...(prev.seo[pageKey] || DEFAULT_SEO[pageKey] || {}), ...seo },
      },
    }));
  };

  const updateServices = (services: any[]) => {
    setSettings((prev) => ({ ...prev, services }));
  };

  const updatePricingPackages = (pricingPackages: any[]) => {
    setSettings((prev) => ({ ...prev, pricingPackages }));
  };

  // Portfolio Methods
  const addPortfolioItem = (item: Omit<EditablePortfolioItem, 'id'>): EditablePortfolioItem => {
    const newItem: EditablePortfolioItem = {
      ...item,
      id: `custom-${Date.now()}`,
      order: portfolioItems.length + 1,
    };
    setPortfolioItems((prev) => [newItem, ...prev]);
    return newItem;
  };

  const editPortfolioItem = (id: string, updates: Partial<EditablePortfolioItem>) => {
    setPortfolioItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolioItems((prev) => prev.filter((item) => item.id !== id));
  };

  const reorderPortfolioItems = (newItems: EditablePortfolioItem[]) => {
    setPortfolioItems(newItems);
  };

  // Leads Methods
  const addContactLead = (lead: Omit<ContactLead, 'id' | 'date'>): ContactLead => {
    const newLead: ContactLead = {
      ...lead,
      id: `lead-${Date.now()}`,
      date: new Date().toISOString(),
    };
    setLeads((prev) => [newLead, ...prev]);
    return newLead;
  };

  const updateContactLead = (id: string, updates: Partial<ContactLead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const deleteContactLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  // Email Logs Methods
  const addEmailLog = (log: Omit<EmailLog, 'id' | 'trackingId' | 'sentAt'>): EmailLog => {
    const trackingId = `GP-MSG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newLog: EmailLog = {
      ...log,
      id: `log-${Date.now()}`,
      trackingId,
      sentAt: new Date().toISOString(),
    };
    setEmailLogs((prev) => [newLog, ...prev]);
    return newLog;
  };

  const updateEmailLog = (id: string, updates: Partial<EmailLog>) => {
    setEmailLogs((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const deleteEmailLog = (id: string) => {
    setEmailLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const clearEmailLogs = () => {
    setEmailLogs([]);
  };

  // Utility Methods
  const togglePreviewMode = () => {
    setPreviewMode((prev) => !prev);
  };

  const resetToDefaults = () => {
    setSettings({
      branding: DEFAULT_BRANDING,
      homepage: DEFAULT_HOMEPAGE,
      contact: DEFAULT_CONTACT,
      emailSettings: DEFAULT_EMAIL_SETTINGS,
      social: DEFAULT_SOCIAL,
      watermark: DEFAULT_WATERMARK,
      sections: DEFAULT_SECTIONS,
      navigation: DEFAULT_NAVIGATION,
      footer: DEFAULT_FOOTER,
      seo: DEFAULT_SEO,
      services: SERVICES,
      pricingPackages: SERVICE_PACKAGES,
    });
    setPortfolioItems(
      PORTFOLIO_PROJECTS.map((item, index) => ({
        id: item.id,
        title: item.title,
        category: item.category as 'vector' | 'embroidery' | 'color-separation',
        categoryLabel: item.categoryLabel,
        image: item.image,
        originalImage: item.image,
        tag: item.tag,
        specs: item.specs,
        client: item.client,
        description: item.description,
        turnaround: item.turnaround,
        colors: item.colors,
        stitchCount: item.stitchCount,
        deliverables: item.deliverables,
        order: index + 1,
        featured: index < 6,
      }))
    );
  };

  const exportSettingsJSON = (): string => {
    return JSON.stringify(
      {
        version: '2.0',
        exportedAt: new Date().toISOString(),
        settings,
        portfolioItems,
        leads,
        emailLogs,
      },
      null,
      2
    );
  };

  const importSettingsJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.settings) setSettings(data.settings);
      if (Array.isArray(data.portfolioItems)) setPortfolioItems(data.portfolioItems);
      if (Array.isArray(data.leads)) setLeads(data.leads);
      if (Array.isArray(data.emailLogs)) setEmailLogs(data.emailLogs);
      return true;
    } catch (e) {
      console.error('Failed to import configuration:', e);
      return false;
    }
  };

  const value = useMemo(
    () => ({
      settings,
      portfolioItems,
      leads,
      emailLogs,
      previewMode,
      isAdminAuthenticated,
      isPublishing,
      hasUnpublishedChanges,
      lastPublishedAt,
      autoPublishLive,
      syncStatus,
      publishToLive,
      toggleAutoPublishLive,
      syncFromServer,
      loginAdmin,
      logoutAdmin,
      changeAdminPassword,
      updateBranding,
      updateHomepage,
      updateContact,
      updateEmailSettings,
      updateSocial,
      updateWatermark,
      updateSections,
      updateNavigation,
      updateFooter,
      updateSEO,
      updateServices,
      updatePricingPackages,
      addPortfolioItem,
      editPortfolioItem,
      deletePortfolioItem,
      reorderPortfolioItems,
      addContactLead,
      updateContactLead,
      deleteContactLead,
      addEmailLog,
      updateEmailLog,
      deleteEmailLog,
      clearEmailLogs,
      togglePreviewMode,
      resetToDefaults,
      exportSettingsJSON,
      importSettingsJSON,
    }),
    [
      settings,
      portfolioItems,
      leads,
      emailLogs,
      previewMode,
      isAdminAuthenticated,
      isPublishing,
      hasUnpublishedChanges,
      lastPublishedAt,
      autoPublishLive,
      syncStatus,
      publishToLive,
      toggleAutoPublishLive,
      syncFromServer,
    ]
  );

  return <AdminSettingsContext.Provider value={value}>{children}</AdminSettingsContext.Provider>;
};

export const useWebsiteSettings = () => {
  const context = useContext(AdminSettingsContext);
  if (!context) {
    throw new Error('useWebsiteSettings must be used within an AdminSettingsProvider');
  }
  return context;
};
