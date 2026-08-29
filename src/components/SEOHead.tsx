import React, { useEffect } from 'react';
import { useWebsiteSettings } from '../context/AdminSettingsContext';
import { CONTACT_INFO } from '../data/content';

export interface RouteMetadata {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  ogType?: string;
}

export const ROUTE_METADATA_MAP: Record<string, RouteMetadata> = {
  home: {
    title: 'Graphics Punching | Screen Printing, Embroidery Digitizing & Vector Artwork',
    description: 'Professional embroidery digitizing, manual vector artwork conversion, and screen printing color separation services. Fast turnaround, 100% machine-tested files with zero thread breaks.',
    keywords: 'embroidery digitizing, vector artwork redraw, screen printing separations, DST files, logo digitizing, Graphics Punching',
    canonicalPath: '/',
    ogType: 'website',
  },
  services: {
    title: 'Wholesale Production Services | Embroidery Digitizing & Vector Art - Graphics Punching',
    description: 'Explore commercial embroidery digitizing, master vector separations, and simulated process screen printing art preparation with 2-4h rush options and free revisions.',
    keywords: 'embroidery services, vector conversion service, screen print separations, commercial digitizing, rush digitizing',
    canonicalPath: '/#/services',
    ogType: 'website',
  },
  pricing: {
    title: 'Pricing & Turnaround Rates | Graphics Punching',
    description: 'Transparent flat-rate wholesale pricing for simple to complex vector redraws ($15-$45) and machine-tested embroidery digitizing ($20-$50). Volume discounts available.',
    keywords: 'embroidery digitizing pricing, vector artwork pricing, screen print artwork cost, commercial digitizing rates',
    canonicalPath: '/#/pricing',
    ogType: 'website',
  },
  portfolio: {
    title: 'Production Portfolio Gallery | Graphics Punching',
    description: 'Browse our complete commercial portfolio: authentic embroidery sewouts, manual vector logo redraws, and multi-color screen printing apparel separations.',
    keywords: 'embroidery portfolio, vector redraw examples, screen printing proofs, machine sewout samples',
    canonicalPath: '/#/portfolio',
    ogType: 'website',
  },
  'vector-files': {
    title: 'Vector Artwork & Redraw Portfolio | Graphics Punching',
    description: 'High-resolution vector redraws, simulated process color separations, CMYK halftones, and vinyl cut-ready master vector files in AI, EPS, PDF, and SVG formats.',
    keywords: 'vector redraw portfolio, screen print separations portfolio, CMYK color separation, AI EPS vector conversion',
    canonicalPath: '/#/vector-files',
    ogType: 'website',
  },
  'embroidery-files': {
    title: 'Embroidery Digitizing & Sewout Portfolio | Graphics Punching',
    description: 'Machine-calibrated embroidery digitizing portfolio with actual sewouts, precise push-pull compensation, 3D puff cap setups, and custom jacket back patches.',
    keywords: 'embroidery digitizing portfolio, DST sewout samples, 3D puff embroidery, cap digitizing, jacket back embroidery',
    canonicalPath: '/#/embroidery-files',
    ogType: 'website',
  },
  'screen-printing-files': {
    title: 'Screen Printing Artwork & Separations | Graphics Punching',
    description: 'Simulated process separations, spot color index separations, and apparel mockup production files ready for automatic and manual screen printing presses.',
    keywords: 'screen printing separations, spot color index, simulated process, apparel mockups',
    canonicalPath: '/#/screen-printing-files',
    ogType: 'website',
  },
  about: {
    title: 'About Us | Professional Digitizing & Vector Studio - Graphics Punching',
    description: 'Learn about Graphics Punching: master vector artists and machine embroidery digitizers delivering retail-ready digital assets to apparel decorators worldwide.',
    keywords: 'about Graphics Punching, embroidery digitizing company, vector artwork studio, apparel decorators partner',
    canonicalPath: '/#/about',
    ogType: 'website',
  },
  'how-it-works': {
    title: 'How It Works | 4-Step Precision Workflow - Graphics Punching',
    description: 'See how our streamlined production process works from artwork submission and master digitization to rigorous machine testing and instant multi-format delivery.',
    keywords: 'digitizing process, vector conversion workflow, how Graphics Punching works, embroidery ordering steps',
    canonicalPath: '/#/how-it-works',
    ogType: 'website',
  },
  testimonials: {
    title: 'Client Reviews & Shop Testimonials | Graphics Punching',
    description: 'Read reviews from screen printers, embroidery shops, and apparel brands who trust Graphics Punching for reliable production files and same-day rush turnarounds.',
    keywords: 'Graphics Punching reviews, digitizing testimonials, screen printer recommendations, embroidery shop reviews',
    canonicalPath: '/#/testimonials',
    ogType: 'website',
  },
  faq: {
    title: 'Frequently Asked Questions (FAQ) | Graphics Punching',
    description: 'Got questions about stitch formats (DST, PES, EMB), vector file types, rush turnarounds, machine testing, or revision policies? Find answers in our FAQ.',
    keywords: 'embroidery digitizing FAQ, vector artwork questions, DST file formats, turnarounds and revisions',
    canonicalPath: '/#/faq',
    ogType: 'website',
  },
  contact: {
    title: 'Contact & Free Quote Request | Graphics Punching',
    description: 'Get in touch with our production team for immediate custom quotes, urgent rush projects, or wholesale account inquiries. Response within 1-2 hours.',
    keywords: 'contact Graphics Punching, quote request, rush digitizing order, email support',
    canonicalPath: '/#/contact',
    ogType: 'website',
  },
  admin: {
    title: 'Admin Command Portal | Website Settings & Email System - Graphics Punching',
    description: 'Administrator control panel for real-time website settings management, dynamic CMS, portfolio catalog editing, and AI email assistance.',
    keywords: 'admin portal, website management, email chatbot, cms settings',
    canonicalPath: '/#/admin',
    ogType: 'website',
  },
};

/**
 * Helper function to update or create a `<meta>` tag in `<head>`
 */
function setMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string): void {
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Helper function to update or create a `<link rel="...">` tag in `<head>`
 */
function setLinkTag(rel: string, href: string): void {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute(rel, rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

export interface SEOHeadProps {
  page?: string;
  title?: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  image?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  page = 'home',
  title,
  description,
  keywords,
  canonicalPath,
  image = '/favicon.png',
}) => {
  const { settings } = useWebsiteSettings();

  useEffect(() => {
    const config = ROUTE_METADATA_MAP[page] || ROUTE_METADATA_MAP.home;
    const pageSeo = settings?.seo?.[page] || (page === 'home' ? settings?.seo?.home : undefined);

    const baseTitle = pageSeo?.title || config.title;
    const baseDescription = pageSeo?.description || config.description;
    const baseKeywords = pageSeo?.keywords || config.keywords;

    const finalTitle = title || baseTitle;
    const finalDescription = description || baseDescription;
    const finalKeywords = keywords || baseKeywords || 'embroidery digitizing, vector artwork, screen printing';
    const finalPath = canonicalPath || config.canonicalPath || (page === 'home' ? '/' : `/#/${page}`);

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://graphicspunching.com';
    const canonicalUrl = `${origin}${finalPath.startsWith('/') ? '' : '/'}${finalPath}`;
    const absoluteImageUrl = image.startsWith('http') ? image : `${origin}${image.startsWith('/') ? '' : '/'}${image}`;

    // 1. Document Title
    document.title = finalTitle;

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', finalDescription);
    setMetaTag('name', 'keywords', finalKeywords);
    setMetaTag('name', 'robots', 'index, follow');

    // 3. Canonical Link Tag
    setLinkTag('canonical', canonicalUrl);

    // 4. OpenGraph Tags
    setMetaTag('property', 'og:site_name', settings?.branding?.siteName || 'Graphics Punching');
    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', finalDescription);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', config.ogType || 'website');
    setMetaTag('property', 'og:image', absoluteImageUrl);

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', finalTitle);
    setMetaTag('name', 'twitter:description', finalDescription);
    setMetaTag('name', 'twitter:url', canonicalUrl);
    setMetaTag('name', 'twitter:image', absoluteImageUrl);

    // 6. JSON-LD Structured Data
    let jsonLdScript = document.querySelector('#seo-structured-data') as HTMLScriptElement | null;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'seo-structured-data';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: settings?.branding?.siteName || 'Graphics Punching',
      url: origin,
      logo: `${origin}/favicon.png`,
      email: settings?.contact?.email || CONTACT_INFO.email,
      telephone: settings?.contact?.phone || CONTACT_INFO.phone,
      description: finalDescription,
      sameAs: [
        settings?.social?.facebook,
        settings?.social?.instagram,
        settings?.social?.pinterest,
        settings?.social?.website,
      ].filter(Boolean),
    });
  }, [page, title, description, keywords, canonicalPath, image, settings]);

  return null;
};
