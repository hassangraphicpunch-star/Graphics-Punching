import { ServicePackage, ServiceItem } from '../data/content';

export interface BrandingSettings {
  siteName: string;
  tagline: string;
  logoText: string;
  logoSubtext: string;
  faviconUrl: string;
  primaryColor: string;
  accentColor: string;
  announcementBarText: string;
  announcementBarEnabled: boolean;
  announcementBarLink: string;
}

export interface HomepageSettings {
  heroBadge: string;
  heroHeadline: string;
  heroHeadlineHighlight: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroSecondaryCtaText: string;
  trustBadge1: string;
  trustBadge2: string;
  trustBadge3: string;
  aboutTitle: string;
  aboutSubtitle: string;
  aboutStory: string;
  ctaBannerTitle: string;
  ctaBannerSubtitle: string;
  ctaBannerBtnText: string;
}

export interface ContactSettings {
  phone: string;
  phoneClean: string;
  email: string;
  secondaryEmail: string;
  location: string;
  website: string;
  workingHours: string;
  turnaroundClaim: string;
}

export interface EmailSystemSettings {
  connectedEmail: string;
  notificationEmail: string;
  autoResponderEnabled: boolean;
  autoResponderSubject: string;
  autoResponderBody: string;
  quotePrefix: string;
  replyToName: string;
}

export interface SocialLinksSettings {
  facebook: string;
  instagram: string;
  pinterest: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  twitter: string;
  whatsapp: string;
  website: string;
}

export interface WatermarkConfig {
  enabled: boolean;
  text: string;
  opacity: number; // 0.05 to 0.6
  size: number; // 12 to 36
  placement: 'center' | 'diagonal' | 'bottom-right' | 'tile';
  color: string;
}

export interface SectionVisibilityFlags {
  topContactBar: boolean;
  heroStats: boolean;
  beforeAfterSlider: boolean;
  servicesGrid: boolean;
  whyChooseUs: boolean;
  processSteps: boolean;
  pricingSection: boolean;
  portfolioShowcase: boolean;
  testimonials: boolean;
  faqSection: boolean;
  ctaBanner: boolean;
  footerDirectory: boolean;
  watermarkOverlay: boolean;
}

export interface NavigationMenuItem {
  id: string;
  label: string;
  page: string;
  href: string;
  enabled: boolean;
  isDropdown?: boolean;
  order: number;
}

export interface FooterSettings {
  description: string;
  copyrightText: string;
  disclaimerText: string;
  addressSnippet: string;
  showMadeWithLove: boolean;
  quickLinksTitle: string;
}

export interface PageSEOSetting {
  title: string;
  description: string;
  keywords: string;
}

export interface EditablePortfolioItem {
  id: string;
  title: string;
  category: 'vector' | 'embroidery' | 'color-separation';
  categoryLabel?: string;
  image: string; // url or base64
  originalImage?: string;
  tag: string;
  specs: string;
  client: string;
  description: string;
  turnaround?: string;
  colors?: string;
  stitchCount?: string;
  deliverables?: string[];
  order?: number;
  featured?: boolean;
}

export interface ContactLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceInterested: string;
  projectDetails?: string;
  date: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  source: string;
}

export interface EmailAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
  isSample?: boolean;
}

export interface EmailLog {
  id: string;
  trackingId: string;
  to: string;
  recipientName?: string;
  from: string;
  replyTo?: string;
  subject: string;
  body: string;
  attachments: EmailAttachment[];
  status: 'sent' | 'delivered' | 'draft' | 'failed' | 'queued';
  sentAt: string;
  errorMessage?: string;
  isStarred?: boolean;
  thread?: Array<{
    id: string;
    role: 'user' | 'assistant' | 'system';
    text: string;
    timestamp: string;
  }>;
}

export interface WebsiteSettings {
  branding: BrandingSettings;
  homepage: HomepageSettings;
  contact: ContactSettings;
  emailSettings: EmailSystemSettings;
  social: SocialLinksSettings;
  watermark: WatermarkConfig;
  sections: SectionVisibilityFlags;
  navigation: NavigationMenuItem[];
  footer: FooterSettings;
  seo: Record<string, PageSEOSetting>;
  services: ServiceItem[];
  pricingPackages: ServicePackage[];
}
