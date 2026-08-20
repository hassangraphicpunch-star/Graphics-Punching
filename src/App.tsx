import React, { useState, useEffect } from 'react';
import { TopContactBar } from './components/TopContactBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { QuoteModal } from './components/QuoteModal';
import { SEOHead } from './components/SEOHead';

// Dedicated Page Views
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { PricingPage } from './pages/PricingPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { VectorFilesPage } from './pages/VectorFilesPage';
import { EmbroideryFilesPage } from './pages/EmbroideryFilesPage';
import { ScreenPrintingFilesPage } from './pages/ScreenPrintingFilesPage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>('home');

  // Global Quote Modal State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [modalService, setModalService] = useState('vector-artwork');
  const [modalTier, setModalTier] = useState('simple-vector');
  const [modalItem, setModalItem] = useState('');

  // Sync state with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (!hash || hash === 'home') {
        setCurrentPage('home');
      } else if (
        [
          'services', 
          'pricing', 
          'portfolio', 
          'vector-files',
          'embroidery-files',
          'screen-printing-files',
          'about', 
          'how-it-works', 
          'testimonials', 
          'faq', 
          'contact'
        ].includes(hash)
      ) {
        setCurrentPage(hash);
      } else if (hash === 'pricing-schedule') {
        setCurrentPage('pricing');
      } else if (hash === 'portfolio-vector' || hash === 'vector' || hash === 'vectors') {
        setCurrentPage('vector-files');
      } else if (hash === 'portfolio-embroidery' || hash === 'embroidery' || hash === 'embroidery-digitizing') {
        setCurrentPage('embroidery-files');
      } else if (hash === 'portfolio-screen-printing' || hash === 'screen-printing' || hash === 'screen-print') {
        setCurrentPage('screen-printing-files');
      } else {
        setCurrentPage('home');
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: string) => {
    const targetHash = page === 'home' ? '#/' : `#/${page}`;
    if (window.location.hash === targetHash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = targetHash;
    }
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

      {/* 5. GLOBAL CUSTOM QUOTE & UPLOAD MODAL */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={closeQuoteModal}
        initialService={modalService}
        initialTier={modalTier}
        initialItem={modalItem}
      />
    </div>
  );
}

