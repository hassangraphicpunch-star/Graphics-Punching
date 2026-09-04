import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, ChevronDown, FileCode2, Layers, Palette, Sparkles, Grid, Shield } from 'lucide-react';
import { Logo } from './Logo';
import { CONTACT_INFO } from '../data/content';

interface NavbarProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onOpenQuoteModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentPage = 'home', 
  onNavigate, 
  onOpenQuoteModal 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPortfolioDropdownOpen, setIsPortfolioDropdownOpen] = useState(false);
  const [mobilePortfolioExpanded, setMobilePortfolioExpanded] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPortfolioDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsPortfolioDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsPortfolioDropdownOpen(false);
    }, 180);
  };

  const isPortfolioActive = [
    'portfolio', 
    'vector-files', 
    'embroidery-files', 
    'screen-printing-files',
    'patch-design',
    'portfolio-vector',
    'portfolio-embroidery',
    'portfolio-screen-printing'
  ].includes(currentPage);

  const portfolioDropdownItems = [
    {
      label: 'Vector Files',
      page: 'vector-files',
      href: '#/vector-files',
      description: 'Manual Bézier redraws & scalable vector art',
      icon: FileCode2,
      tag: 'Vector Art'
    },
    {
      label: 'Embroidery Files',
      page: 'embroidery-files',
      href: '#/embroidery-files',
      description: 'DST/PES digitizing, jacket backs & 3D puff',
      icon: Layers,
      tag: 'Embroidery'
    },
    {
      label: 'Patch Design',
      page: 'patch-design',
      href: '#/patch-design',
      description: 'Custom embroidered, woven, PVC & leather patch files',
      icon: Shield,
      tag: 'Patches'
    },
    {
      label: 'Screen Printing Files',
      page: 'screen-printing-files',
      href: '#/screen-printing-files',
      description: 'Spot color & simulated process separations',
      icon: Palette,
      tag: 'Screen Print'
    },
    {
      label: 'All Portfolio Gallery',
      page: 'portfolio',
      href: '#/portfolio',
      description: 'View complete collection of 30+ production files',
      icon: Grid,
      tag: 'All Work'
    }
  ];

  const standardNavLinks = [
    { label: 'HOME', page: 'home', href: '#/' },
    { label: 'SERVICES', page: 'services', href: '#/services' },
    { label: 'PRICING', page: 'pricing', href: '#/pricing' },
    // Portfolio handled with dropdown
    { label: 'ABOUT US', page: 'about', href: '#/about' },
    { label: 'HOW IT WORKS', page: 'how-it-works', href: '#/how-it-works' },
    { label: 'TESTIMONIALS', page: 'testimonials', href: '#/testimonials' },
    { label: 'FAQ', page: 'faq', href: '#/faq' },
    { label: 'CONTACT US', page: 'contact', href: '#/contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setIsPortfolioDropdownOpen(false);
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.location.hash = page === 'home' ? '#/' : `#/${page}`;
    }
  };

  return (
    <>
      <header
        id="main-navigation"
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#050505]/95 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.85)] border-b border-zinc-800/90 py-2.5 sm:py-3'
            : 'bg-[#050505]/98 backdrop-blur-sm border-b border-zinc-800/60 py-3 sm:py-3.5 lg:py-4'
        }`}
      >
        <div className="w-full max-w-[1480px] mx-auto px-3 sm:px-5 lg:px-8 flex items-center justify-between gap-3 sm:gap-4 lg:gap-6">
          {/* Logo Brand Container (Never shrinks or overlaps) */}
          <div className="shrink-0 flex items-center">
            <a
              href="#/"
              onClick={(e) => handleLinkClick(e, 'home')}
              className="inline-flex items-center cursor-pointer shrink-0"
              aria-label="Graphics Punching Home"
            >
              <Logo size={isScrolled ? 'sm' : 'nav'} />
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 xl:gap-2 2xl:gap-4 text-[11px] xl:text-[11.5px] 2xl:text-[12.5px] font-bold tracking-wider shrink-0" aria-label="Main Navigation">
            {/* 1. Home */}
            <a
              href="#/"
              id="nav-link-home"
              onClick={(e) => handleLinkClick(e, 'home')}
              className={`transition-colors uppercase relative px-2 py-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                currentPage === 'home' ? 'text-[#FFC400]' : 'text-zinc-300 hover:text-[#FFC400]'
              }`}
            >
              HOME
              {currentPage === 'home' && (
                <span className="absolute bottom-0 left-1 right-1 h-[2px] bg-[#FFC400] rounded-full shadow-[0_0_8px_#FFC400]" />
              )}
            </a>

            {/* 2. Services */}
            <a
              href="#/services"
              id="nav-link-services"
              onClick={(e) => handleLinkClick(e, 'services')}
              className={`transition-colors uppercase relative px-2 py-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                currentPage === 'services' ? 'text-[#FFC400]' : 'text-zinc-300 hover:text-[#FFC400]'
              }`}
            >
              SERVICES
              {currentPage === 'services' && (
                <span className="absolute bottom-0 left-1 right-1 h-[2px] bg-[#FFC400] rounded-full shadow-[0_0_8px_#FFC400]" />
              )}
            </a>

            {/* 3. Pricing */}
            <a
              href="#/pricing"
              id="nav-link-pricing"
              onClick={(e) => handleLinkClick(e, 'pricing')}
              className={`transition-colors uppercase relative px-2 py-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                currentPage === 'pricing' ? 'text-[#FFC400]' : 'text-zinc-300 hover:text-[#FFC400]'
              }`}
            >
              PRICING
              {currentPage === 'pricing' && (
                <span className="absolute bottom-0 left-1 right-1 h-[2px] bg-[#FFC400] rounded-full shadow-[0_0_8px_#FFC400]" />
              )}
            </a>

            {/* 4. PORTFOLIO WITH DEDICATED DROPDOWN MENU */}
            <div 
              ref={dropdownRef}
              className="relative shrink-0"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                id="nav-portfolio-dropdown-btn"
                onClick={() => setIsPortfolioDropdownOpen(!isPortfolioDropdownOpen)}
                className={`transition-colors uppercase relative px-2 py-1.5 cursor-pointer whitespace-nowrap flex items-center gap-1 shrink-0 ${
                  isPortfolioActive ? 'text-[#FFC400]' : 'text-zinc-300 hover:text-[#FFC400]'
                }`}
                aria-expanded={isPortfolioDropdownOpen}
                aria-haspopup="true"
              >
                <span>PORTFOLIO</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isPortfolioDropdownOpen ? 'rotate-180 text-[#FFC400]' : ''}`} />
                {isPortfolioActive && (
                  <span className="absolute bottom-0 left-1 right-1 h-[2px] bg-[#FFC400] rounded-full shadow-[0_0_8px_#FFC400]" />
                )}
              </button>

              {/* Dropdown Menu Popup */}
              {isPortfolioDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-[#0c0c0e] border border-zinc-800/90 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.85)] p-2.5 z-50 animate-fadeIn backdrop-blur-xl"
                  role="menu"
                >
                  <div className="px-3 py-2 border-b border-zinc-800/80 mb-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-[#FFC400] tracking-wider">
                      PORTFOLIO CATEGORIES
                    </span>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase">
                      Dedicated Pages
                    </span>
                  </div>

                  <div className="space-y-1">
                    {portfolioDropdownItems.map((item) => {
                      const Icon = item.icon;
                      const isItemActive = currentPage === item.page;
                      return (
                        <a
                          key={item.page}
                          href={item.href}
                          onClick={(e) => handleLinkClick(e, item.page)}
                          className={`flex items-start gap-3 p-2.5 rounded-xl transition-all duration-150 group cursor-pointer ${
                            isItemActive 
                              ? 'bg-[#FFC400]/15 border border-[#FFC400]/30 text-white' 
                              : 'hover:bg-zinc-900 text-zinc-300 hover:text-white border border-transparent'
                          }`}
                          role="menuitem"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isItemActive 
                              ? 'bg-[#FFC400] text-black font-bold' 
                              : 'bg-zinc-900 group-hover:bg-[#FFC400]/20 text-[#FFC400] transition-colors'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-black uppercase tracking-wide group-hover:text-[#FFC400] transition-colors ${
                                isItemActive ? 'text-[#FFC400]' : 'text-white'
                              }`}>
                                {item.label}
                              </span>
                              {isItemActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC400] shadow-[0_0_6px_#FFC400]" />
                              )}
                            </div>
                            <p className="text-[10px] text-zinc-400 font-normal mt-0.5 line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 5. About Us */}
            <a
              href="#/about"
              id="nav-link-about"
              onClick={(e) => handleLinkClick(e, 'about')}
              className={`transition-colors uppercase relative px-2 py-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                currentPage === 'about' ? 'text-[#FFC400]' : 'text-zinc-300 hover:text-[#FFC400]'
              }`}
            >
              ABOUT US
              {currentPage === 'about' && (
                <span className="absolute bottom-0 left-1 right-1 h-[2px] bg-[#FFC400] rounded-full shadow-[0_0_8px_#FFC400]" />
              )}
            </a>

            {/* 6. How It Works */}
            <a
              href="#/how-it-works"
              id="nav-link-how-it-works"
              onClick={(e) => handleLinkClick(e, 'how-it-works')}
              className={`transition-colors uppercase relative px-2 py-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                currentPage === 'how-it-works' ? 'text-[#FFC400]' : 'text-zinc-300 hover:text-[#FFC400]'
              }`}
            >
              HOW IT WORKS
              {currentPage === 'how-it-works' && (
                <span className="absolute bottom-0 left-1 right-1 h-[2px] bg-[#FFC400] rounded-full shadow-[0_0_8px_#FFC400]" />
              )}
            </a>

            {/* 7. Testimonials */}
            <a
              href="#/testimonials"
              id="nav-link-testimonials"
              onClick={(e) => handleLinkClick(e, 'testimonials')}
              className={`transition-colors uppercase relative px-2 py-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                currentPage === 'testimonials' ? 'text-[#FFC400]' : 'text-zinc-300 hover:text-[#FFC400]'
              }`}
            >
              TESTIMONIALS
              {currentPage === 'testimonials' && (
                <span className="absolute bottom-0 left-1 right-1 h-[2px] bg-[#FFC400] rounded-full shadow-[0_0_8px_#FFC400]" />
              )}
            </a>

            {/* 8. FAQ */}
            <a
              href="#/faq"
              id="nav-link-faq"
              onClick={(e) => handleLinkClick(e, 'faq')}
              className={`transition-colors uppercase relative px-2 py-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                currentPage === 'faq' ? 'text-[#FFC400]' : 'text-zinc-300 hover:text-[#FFC400]'
              }`}
            >
              FAQ
              {currentPage === 'faq' && (
                <span className="absolute bottom-0 left-1 right-1 h-[2px] bg-[#FFC400] rounded-full shadow-[0_0_8px_#FFC400]" />
              )}
            </a>

            {/* 9. Contact Us */}
            <a
              href="#/contact"
              id="nav-link-contact"
              onClick={(e) => handleLinkClick(e, 'contact')}
              className={`transition-colors uppercase relative px-2 py-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                currentPage === 'contact' ? 'text-[#FFC400]' : 'text-zinc-300 hover:text-[#FFC400]'
              }`}
            >
              CONTACT US
              {currentPage === 'contact' && (
                <span className="absolute bottom-0 left-1 right-1 h-[2px] bg-[#FFC400] rounded-full shadow-[0_0_8px_#FFC400]" />
              )}
            </a>
          </nav>

          {/* Right Action Button: GET A QUOTE */}
          <div className="hidden sm:flex items-center shrink-0">
            <button
              onClick={onOpenQuoteModal}
              id="nav-get-quote-btn"
              className="bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-[11px] xl:text-xs tracking-wider uppercase px-4 xl:px-5 py-2.5 rounded-sm flex items-center gap-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_14px_rgba(255,196,0,0.3)] cursor-pointer min-h-[40px] shrink-0 whitespace-nowrap group"
            >
              <span>GET A QUOTE</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Mobile / Tablet Hamburger Button & Quick Quote */}
          <div className="flex xl:hidden items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onOpenQuoteModal}
              className="sm:hidden bg-[#FFC400] text-black text-[11px] font-black uppercase px-3 py-2 rounded shadow min-h-[38px] flex items-center justify-center cursor-pointer whitespace-nowrap shrink-0"
            >
              Quote
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle-btn"
              aria-label="Toggle Menu"
              className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white hover:text-[#FFC400] transition-colors cursor-pointer min-h-[44px] min-w-[44px] shrink-0"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden animate-fadeIn">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 right-0 max-w-xs sm:max-w-sm w-full bg-[#0a0a0a] border-l border-zinc-800 p-5 sm:p-6 flex flex-col justify-between shadow-2xl overflow-y-auto max-h-screen z-10">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-zinc-800">
                <Logo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white cursor-pointer min-h-[44px] min-w-[44px]"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              <div className="mt-5 flex flex-col gap-1">
                {/* Home */}
                <a
                  href="#/"
                  onClick={(e) => handleLinkClick(e, 'home')}
                  className={`text-xs sm:text-sm font-black tracking-wider uppercase py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-between min-h-[40px] ${
                    currentPage === 'home' ? 'bg-[#FFC400]/15 text-[#FFC400] border-l-4 border-[#FFC400]' : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <span>HOME</span>
                  {currentPage === 'home' && <span className="w-2 h-2 rounded-full bg-[#FFC400]" />}
                </a>

                {/* Services */}
                <a
                  href="#/services"
                  onClick={(e) => handleLinkClick(e, 'services')}
                  className={`text-xs sm:text-sm font-black tracking-wider uppercase py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-between min-h-[40px] ${
                    currentPage === 'services' ? 'bg-[#FFC400]/15 text-[#FFC400] border-l-4 border-[#FFC400]' : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <span>SERVICES</span>
                  {currentPage === 'services' && <span className="w-2 h-2 rounded-full bg-[#FFC400]" />}
                </a>

                {/* Pricing */}
                <a
                  href="#/pricing"
                  onClick={(e) => handleLinkClick(e, 'pricing')}
                  className={`text-xs sm:text-sm font-black tracking-wider uppercase py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-between min-h-[40px] ${
                    currentPage === 'pricing' ? 'bg-[#FFC400]/15 text-[#FFC400] border-l-4 border-[#FFC400]' : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <span>PRICING</span>
                  {currentPage === 'pricing' && <span className="w-2 h-2 rounded-full bg-[#FFC400]" />}
                </a>

                {/* PORTFOLIO WITH ACCORDION SUB-LINKS */}
                <div className="rounded-xl bg-zinc-950 border border-zinc-850 p-1 my-1">
                  <button
                    type="button"
                    onClick={() => setMobilePortfolioExpanded(!mobilePortfolioExpanded)}
                    className={`w-full text-xs sm:text-sm font-black tracking-wider uppercase py-2.5 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-between min-h-[40px] ${
                      isPortfolioActive ? 'text-[#FFC400]' : 'text-zinc-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>PORTFOLIO</span>
                      <span className="text-[9px] bg-[#FFC400]/20 text-[#FFC400] px-1.5 py-0.5 rounded font-extrabold">
                        4 SPECIALTIES
                      </span>
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobilePortfolioExpanded ? 'rotate-180 text-[#FFC400]' : 'text-zinc-400'}`} />
                  </button>

                  {mobilePortfolioExpanded && (
                    <div className="pl-2 pr-1 py-1 space-y-1 border-t border-zinc-900">
                      {portfolioDropdownItems.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = currentPage === subItem.page;
                        return (
                          <a
                            key={subItem.page}
                            href={subItem.href}
                            onClick={(e) => handleLinkClick(e, subItem.page)}
                            className={`text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-between transition-colors min-h-[38px] ${
                              isSubActive
                                ? 'bg-[#FFC400]/15 text-[#FFC400] font-black'
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <SubIcon className="w-3.5 h-3.5 text-[#FFC400]" />
                              <span>{subItem.label}</span>
                            </span>
                            {isSubActive && <span className="w-1.5 h-1.5 rounded-full bg-[#FFC400]" />}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* About Us */}
                <a
                  href="#/about"
                  onClick={(e) => handleLinkClick(e, 'about')}
                  className={`text-xs sm:text-sm font-black tracking-wider uppercase py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-between min-h-[40px] ${
                    currentPage === 'about' ? 'bg-[#FFC400]/15 text-[#FFC400] border-l-4 border-[#FFC400]' : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <span>ABOUT US</span>
                  {currentPage === 'about' && <span className="w-2 h-2 rounded-full bg-[#FFC400]" />}
                </a>

                {/* How It Works */}
                <a
                  href="#/how-it-works"
                  onClick={(e) => handleLinkClick(e, 'how-it-works')}
                  className={`text-xs sm:text-sm font-black tracking-wider uppercase py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-between min-h-[40px] ${
                    currentPage === 'how-it-works' ? 'bg-[#FFC400]/15 text-[#FFC400] border-l-4 border-[#FFC400]' : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <span>HOW IT WORKS</span>
                  {currentPage === 'how-it-works' && <span className="w-2 h-2 rounded-full bg-[#FFC400]" />}
                </a>

                {/* Testimonials */}
                <a
                  href="#/testimonials"
                  onClick={(e) => handleLinkClick(e, 'testimonials')}
                  className={`text-xs sm:text-sm font-black tracking-wider uppercase py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-between min-h-[40px] ${
                    currentPage === 'testimonials' ? 'bg-[#FFC400]/15 text-[#FFC400] border-l-4 border-[#FFC400]' : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <span>TESTIMONIALS</span>
                  {currentPage === 'testimonials' && <span className="w-2 h-2 rounded-full bg-[#FFC400]" />}
                </a>

                {/* FAQ */}
                <a
                  href="#/faq"
                  onClick={(e) => handleLinkClick(e, 'faq')}
                  className={`text-xs sm:text-sm font-black tracking-wider uppercase py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-between min-h-[40px] ${
                    currentPage === 'faq' ? 'bg-[#FFC400]/15 text-[#FFC400] border-l-4 border-[#FFC400]' : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <span>FAQ</span>
                  {currentPage === 'faq' && <span className="w-2 h-2 rounded-full bg-[#FFC400]" />}
                </a>

                {/* Contact Us */}
                <a
                  href="#/contact"
                  onClick={(e) => handleLinkClick(e, 'contact')}
                  className={`text-xs sm:text-sm font-black tracking-wider uppercase py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-between min-h-[40px] ${
                    currentPage === 'contact' ? 'bg-[#FFC400]/15 text-[#FFC400] border-l-4 border-[#FFC400]' : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <span>CONTACT US</span>
                  {currentPage === 'contact' && <span className="w-2 h-2 rounded-full bg-[#FFC400]" />}
                </a>
              </div>
            </div>

            <div className="pt-5 border-t border-zinc-800 space-y-3 mt-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuoteModal();
                }}
                className="w-full bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-black text-xs uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg min-h-[46px] cursor-pointer"
              >
                <span>Request a Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-zinc-400 text-center space-y-1">
                <p>Email: <a href={`mailto:${CONTACT_INFO.email}`} className="text-[#FFC400] font-bold">{CONTACT_INFO.email}</a></p>
                <p>Phone: <a href={`tel:${CONTACT_INFO.phoneClean}`} className="text-zinc-200 font-bold">{CONTACT_INFO.phone}</a></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

