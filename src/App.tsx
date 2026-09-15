import React, { useState, useEffect } from 'react';
import { TopContactBar } from './components/TopContactBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { QuoteModal } from './components/QuoteModal';
import { AIChatbot } from './components/AIChatbot';
import { SEOHead } from './components/SEOHead';
import { AdminPortal } from './components/AdminPortal';
import { AdminSettingsProvider, useWebsiteSettings } from './context/AdminSettingsContext';
import { Eye, ArrowLeft } from 'lucide-react';

// Dedicated Page Views
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { PricingPage } from './pages/PricingPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { VectorFilesPage } from './pages/VectorFilesPage';
import { EmbroideryFilesPage } from './pages/EmbroideryFilesPage';
import { ScreenPrintingFilesPage } from './pages/ScreenPrintingFilesPage';
import { PatchDesignPage } from './pages/PatchDesignPage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { PORTFOLIO_PROJECTS } from './data/content';
import { preloadPortfolioWatermarks } from './utils/watermark';

function resolveRouteFromUrl(): string {
  if (typeof window === 'undefined') return 'home';

  // 1. Check hash first (e.g. #/services, #services, #/pricing)
  const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
  // 2. Check pathname next (e.g. /services, /pricing, /admin)
  const rawPath = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase().trim();

  const candidate = rawHash || rawPath;

  if (!candidate || candidate === 'home') {
    return 'home';
  }

  const validPages = [
    'services',
    'pricing',
    'portfolio',
    'vector-files',
    'embroidery-files',
    'screen-printing-files',
    'patch-design',
    'about',
    'how-it-works',
    'testimonials',
    'faq',
    'contact',
    'admin',
  ];

  if (validPages.includes(candidate)) {
    return candidate;
  }

  // Admin aliases
  if (['settings', 'email-chatbot', 'admin-portal', 'dashboard', 'login'].includes(candidate)) {
    return 'admin';
  }

  // Common aliases
  if (candidate === 'pricing-schedule') return 'pricing';
  if (['portfolio-vector', 'vector', 'vectors', 'vector-art', 'vector-artwork'].includes(candidate)) return 'vector-files';
  if (['portfolio-embroidery', 'embroidery', 'embroidery-digitizing', 'digitizing'].includes(candidate)) return 'embroidery-files';
  if (['portfolio-screen-printing', 'screen-printing', 'screen-print', 'color-separations'].includes(candidate)) return 'screen-printing-files';
  if (['patch', 'patches', 'patch-files', 'custom-patches', 'custom-patch'].includes(candidate)) return 'patch-design';

  return 'home';
}

function MainAppContent() {
  const { previewMode, togglePreviewMode, isAdminAuthenticated, settings } = useWebsiteSettings();
  const [currentPage, setCurrentPage] = useState<string>(resolveRouteFromUrl());

  // Pre-generate watermarks into cache for instant right-click protection & lightning display
  useEffect(() => {
    preloadPortfolioWatermarks(PORTFOLIO_PROJECTS, {
      watermarkText: settings.watermark?.text || 'GRAPHICS PUNCHING • PROOF',
      opacity: settings.watermark?.opacity || 0.28,
      placement: (settings.watermark?.placement || 'diagonal') as any,
    });
  }, [settings.watermark]);

  // Global Quote Modal State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [modalService, setModalService] = useState('vector-artwork');
  const [modalTier, setModalTier] = useState('simple-vector');
  const [modalItem, setModalItem] = useState('');

  // Sync state with URL hash and pathname (supports direct URL access & browser back/forward)
  useEffect(() => {
    const syncRoute = () => {
      const page = resolveRouteFromUrl();
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    syncRoute();
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  const navigateTo = (page: string) => {
    const targetHash = page === 'home' ? '#/' : `#/${page}`;
    const targetPath = page === 'home' ? '/' : `/${page}`;

    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
    try {
      window.history.pushState(null, '', targetPath);
    } catch {}

    const resolved = [
      'services',
      'pricing',
      'portfolio',
      'vector-files',
      'embroidery-files',
      'screen-printing-files',
      'patch-design',
      'about',
      'how-it-works',
      'testimonials',
      'faq',
      'contact',
      'admin',
    ].includes(page)
      ? page
      : resolveRouteFromUrl();

    setCurrentPage(resolved);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openQuoteModal = (serviceId: string = 'vector-artwork', tierId: string = '', itemTitle: string = '') => {
    setModalService(serviceId);
    setModalTier(tierId);
    setModalItem(itemTitle);
    setIsQuoteModalOpen(true);
  };

  const closeQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-900 flex flex-col font-sans selection:bg-[#FFC400] selection:text-black">
      {/* Dynamic SEO Meta Tag & Canonical URL Handler */}
      <SEOHead page={currentPage} />

      {/* Admin Preview Mode Floating Banner */}
      {isAdminAuthenticated && previewMode && currentPage !== 'admin' && (
        <div className="bg-[#FFC400] text-black px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center justify-between sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>Website Changes Live Preview Mode Active</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="#/admin"
              className="bg-black text-[#FFC400] px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 hover:bg-zinc-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Admin Portal</span>
            </a>
            <button
              type="button"
              onClick={togglePreviewMode}
              className="bg-black/10 hover:bg-black/20 text-black px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ADMIN PORTAL VIEW */}
      {currentPage === 'admin' ? (
        <AdminPortal />
      ) : (
        <>
          {/* 1. TOP CONTACT BAR */}
          <TopContactBar />

          {/* 2. MAIN HEADER & MULTI-PAGE NAVIGATION */}
          <Navbar
            currentPage={currentPage}
            onNavigate={navigateTo}
            onOpenQuoteModal={() => openQuoteModal('vector-artwork', 'simple-vector')}
          />

          {/* 3. DEDICATED INDEPENDENT PAGE VIEW */}
          <main className="flex-1">
            {currentPage === 'home' && (
              <HomePage
                onNavigate={navigateTo}
                onOpenQuoteModal={openQuoteModal}
              />
            )}

            {currentPage === 'services' && (
              <ServicesPage
                onSelectServiceForQuote={openQuoteModal}
                onNavigate={navigateTo}
              />
            )}

            {currentPage === 'pricing' && (
              <PricingPage
                onSelectTierForQuote={(tierName) => openQuoteModal('vector-artwork', '', tierName)}
                onNavigate={navigateTo}
              />
            )}

            {currentPage === 'portfolio' && (
              <PortfolioPage
                onOpenQuoteModalWithItem={(itemTitle) => openQuoteModal('screen-printing', '', itemTitle)}
                onNavigate={navigateTo}
              />
            )}

            {currentPage === 'vector-files' && (
              <VectorFilesPage
                onOpenQuoteModal={openQuoteModal}
                onNavigate={navigateTo}
              />
            )}

            {currentPage === 'embroidery-files' && (
              <EmbroideryFilesPage
                onOpenQuoteModal={openQuoteModal}
                onNavigate={navigateTo}
              />
            )}

            {currentPage === 'screen-printing-files' && (
              <ScreenPrintingFilesPage
                onOpenQuoteModal={openQuoteModal}
                onNavigate={navigateTo}
              />
            )}

            {currentPage === 'patch-design' && (
              <PatchDesignPage
                onOpenQuoteModal={openQuoteModal}
                onNavigate={navigateTo}
              />
            )}

            {currentPage === 'about' && (
              <AboutPage
                onOpenQuoteModal={() => openQuoteModal('vector-artwork', 'simple-vector')}
                onNavigate={navigateTo}
              />
            )}

            {currentPage === 'how-it-works' && (
              <HowItWorksPage
                onOpenQuoteModal={() => openQuoteModal('vector-artwork', 'simple-vector')}
                onNavigate={navigateTo}
              />
            )}

            {currentPage === 'testimonials' && (
              <TestimonialsPage
                onOpenQuoteModal={() => openQuoteModal('vector-artwork', 'simple-vector')}
                onNavigate={navigateTo}
              />
            )}

            {currentPage === 'faq' && (
              <FAQPage
                onOpenQuoteModal={() => openQuoteModal('vector-artwork', 'simple-vector')}
                onNavigate={navigateTo}
              />
            )}

            {currentPage === 'contact' && (
              <ContactPage />
            )}
          </main>

          {/* 4. FOOTER WITH COMPLETE PAGE DIRECTORY */}
          <Footer onNavigate={navigateTo} />
        </>
      )}

      {/* 5. GLOBAL CUSTOM QUOTE & UPLOAD MODAL */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={closeQuoteModal}
        initialService={modalService}
        initialTier={modalTier}
        initialItem={modalItem}
      />

      {/* 6. REAL-TIME AI & LIVE VISITOR CHATBOT */}
      {settings.chatbot?.enabled && (
        <AIChatbot onOpenQuoteModal={openQuoteModal} onNavigate={navigateTo} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AdminSettingsProvider>
      <MainAppContent />
    </AdminSettingsProvider>
  );
}
