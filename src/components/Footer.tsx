import React from 'react';
import { Phone, Mail, MapPin, Globe, Facebook, Instagram, ArrowUp, Sparkles, Heart, Shield, Lock } from 'lucide-react';
import { Logo } from './Logo';
import { useWebsiteSettings } from '../context/AdminSettingsContext';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings, isAdminAuthenticated } = useWebsiteSettings();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.location.hash = page === 'home' ? '#/' : `#/${page}`;
    }
  };

  if (!settings.sections.footerDirectory) {
    return null;
  }

  return (
    <footer id="footer" className="bg-[#050505] text-zinc-300 pt-14 sm:pt-20 border-t border-zinc-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-6 xl:gap-8 items-start">
          
          {/* Column 1: Brand Info & Socials (4 Cols on desktop, full on mobile) */}
          <div className="sm:col-span-2 md:col-span-2 lg:col-span-4 xl:col-span-4 space-y-4 sm:space-y-5">
            <a href="#/" onClick={(e) => handleLinkClick(e, 'home')} className="inline-block cursor-pointer">
              <Logo size="footer" />
            </a>

            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              {settings.footer.description}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1 sm:pt-2">
              {settings.social.facebook && (
                <a
                  href={settings.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-black hover:bg-[#FFC400] hover:border-[#FFC400] transition-all min-h-[36px] min-w-[36px]"
                >
                  <Facebook className="w-4 h-4 fill-current" />
                </a>
              )}
              {settings.social.instagram && (
                <a
                  href={settings.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-black hover:bg-[#FFC400] hover:border-[#FFC400] transition-all min-h-[36px] min-w-[36px]"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.social.pinterest && (
                <a
                  href={settings.social.pinterest}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Pinterest"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-black hover:bg-[#FFC400] hover:border-[#FFC400] transition-all min-h-[36px] min-w-[36px]"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.546.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                </a>
              )}
              {settings.contact.email && (
                <a
                  href={`mailto:${settings.contact.email}`}
                  aria-label="Email"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-black hover:bg-[#FFC400] hover:border-[#FFC400] transition-all min-h-[36px] min-w-[36px]"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Trademark sample notice */}
            {settings.footer.disclaimerText && (
              <p className="text-[10px] text-zinc-500 max-w-sm pt-2 leading-relaxed">
                {settings.footer.disclaimerText}
              </p>
            )}
          </div>

          {/* Column 2: Quick Links (2 Cols on desktop) */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <h4 className="font-display font-black text-sm uppercase tracking-wider text-white border-l-2 border-[#FFC400] pl-2.5">
              {settings.footer.quickLinksTitle || 'PAGES & LINKS'}
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              {settings.navigation
                .filter((n) => n.enabled)
                .map((link) => (
                  <li key={link.id || link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.page)}
                      className="text-zinc-400 hover:text-[#FFC400] transition-colors cursor-pointer py-1 inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              {/* Admin Portal link (only visible to authenticated admin) */}
              {isAdminAuthenticated && (
                <li>
                  <a
                    href="#/admin"
                    onClick={(e) => handleLinkClick(e, 'admin')}
                    className="text-zinc-500 hover:text-[#FFC400] transition-colors cursor-pointer py-1 inline-flex items-center gap-1.5 font-mono text-[11px]"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Admin Portal</span>
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Portfolio & Services (2 Cols on desktop) */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <h4 className="font-display font-black text-sm uppercase tracking-wider text-white border-l-2 border-[#FFC400] pl-2.5">
              PORTFOLIO GALLERIES
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              {[
                { label: 'Vector Files', page: 'vector-files', href: '#/vector-files' },
                { label: 'Embroidery Files', page: 'embroidery-files', href: '#/embroidery-files' },
                { label: 'Patch Design', page: 'patch-design', href: '#/patch-design' },
                { label: 'Screen Printing Files', page: 'screen-printing-files', href: '#/screen-printing-files' },
                { label: 'Vector Services', page: 'services', href: '#/services' },
                { label: 'Digitizing Rates', page: 'pricing', href: '#/pricing' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.page)}
                    className="text-zinc-400 hover:text-[#FFC400] transition-colors cursor-pointer py-1 inline-block"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us & Right Machine Graphic (4 Cols on desktop) */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            <h4 className="font-display font-black text-sm uppercase tracking-wider text-white border-l-2 border-[#FFC400] pl-2.5">
              CONTACT US
            </h4>
            
            <div className="space-y-2.5 text-xs">
              <a
                href={`tel:${settings.contact.phoneClean}`}
                className="flex items-center gap-3 text-zinc-300 hover:text-[#FFC400] transition-colors group min-h-[32px]"
              >
                <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#FFC400] shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span>{settings.contact.phone}</span>
              </a>

              <a
                href={`mailto:${settings.contact.email}`}
                className="flex items-center gap-3 text-zinc-300 hover:text-[#FFC400] transition-colors group min-h-[32px]"
              >
                <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#FFC400] shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">{settings.contact.email}</span>
              </a>

              <div className="flex items-center gap-3 text-zinc-300 min-h-[32px]">
                <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#FFC400] shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span>{settings.contact.location}</span>
              </div>

              <a
                href={`https://${settings.contact.website}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-zinc-300 hover:text-[#FFC400] transition-colors min-h-[32px]"
              >
                <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#FFC400] shrink-0">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <span>{settings.contact.website}</span>
              </a>
            </div>

            {/* Global delivery technical spec badge */}
            <div className="mt-4 p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FFC400]/10 border border-[#FFC400]/30 flex items-center justify-center text-[#FFC400] shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FFC400] shrink-0 animate-pulse" />
                  <span className="truncate">{settings.footer.addressSnippet}</span>
                </p>
                <p className="text-[10px] text-zinc-400">
                  {settings.contact.turnaroundClaim}
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Yellow bottom copyright bar */}
      <div className="bg-[#FFC400] text-black py-3 px-4 sm:px-6">
        <div className={`max-w-7xl mx-auto flex flex-col ${isAdminAuthenticated ? 'sm:flex-row' : ''} items-center justify-between gap-2 text-center sm:text-left`}>
          <span className="font-bold text-[11px] sm:text-xs tracking-wide uppercase">
            {settings.footer.copyrightText}
          </span>
          {isAdminAuthenticated && (
            <a
              href="#/admin"
              onClick={(e) => handleLinkClick(e, 'admin')}
              className="inline-flex items-center gap-1.5 text-black/75 hover:text-black hover:underline cursor-pointer font-bold text-[11px] uppercase tracking-wider transition-colors"
              title="Access Graphics Punching Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </a>
          )}
        </div>
      </div>

      {/* Scroll to Top Floating Button with Safe Touch Target */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 w-11 h-11 rounded-full bg-black border-2 border-[#FFC400] text-[#FFC400] hover:bg-[#FFC400] hover:text-black shadow-2xl flex items-center justify-center transition-all duration-300 cursor-pointer transform hover:-translate-y-1 min-h-[44px] min-w-[44px]"
      >
        <ArrowUp className="w-5 h-5 stroke-[2.5]" />
      </button>
    </footer>
  );
};
