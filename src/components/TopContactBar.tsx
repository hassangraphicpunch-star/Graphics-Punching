import React from 'react';
import { Phone, Mail, Facebook, Instagram, Globe, Sparkles } from 'lucide-react';
import { CONTACT_INFO } from '../data/content';

export const TopContactBar: React.FC = () => {
  return (
    <div id="top-contact-bar" className="bg-[#050505] text-zinc-300 text-[11px] sm:text-xs border-b border-zinc-800/80 py-2 sm:py-2.5 px-3 sm:px-6 lg:px-8 relative z-50 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
        {/* Left Side: Phone & Email with 1-tap call/email */}
        <div className="flex items-center flex-wrap justify-center sm:justify-start gap-2.5 sm:gap-5 w-full sm:w-auto">
          <a
            href={`tel:${CONTACT_INFO.phoneClean}`}
            id="top-bar-phone-link"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-white hover:text-[#FFC400] transition-colors font-medium group min-h-[32px] py-0.5 px-1 rounded"
          >
            <span className="w-5 h-5 rounded-full bg-[#FFC400]/10 flex items-center justify-center text-[#FFC400] group-hover:bg-[#FFC400] group-hover:text-black transition-all shrink-0">
              <Phone className="w-3 h-3 fill-current" />
            </span>
            <span className="tracking-wide whitespace-nowrap">{CONTACT_INFO.phone}</span>
          </a>

          <div className="hidden sm:block text-zinc-700 select-none">|</div>

          <a
            href={`mailto:${CONTACT_INFO.email}`}
            id="top-bar-email-link"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-zinc-300 hover:text-[#FFC400] transition-colors font-medium group min-h-[32px] py-0.5 px-1 rounded max-w-[260px] sm:max-w-none"
          >
            <span className="w-5 h-5 rounded-full bg-[#FFC400]/10 flex items-center justify-center text-[#FFC400] group-hover:bg-[#FFC400] group-hover:text-black transition-all shrink-0">
              <Mail className="w-3 h-3" />
            </span>
            <span className="tracking-wide truncate">{CONTACT_INFO.email}</span>
          </a>
        </div>

        {/* Right Side: Social & Follow Links */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-zinc-400 font-semibold tracking-wider text-[10px] sm:text-[11px] uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#FFC400] shrink-0" />
            <span className="hidden xs:inline">Follow Us:</span>
          </span>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href={CONTACT_INFO.social.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-7 h-7 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-black hover:bg-[#FFC400] hover:border-[#FFC400] transition-all cursor-pointer"
            >
              <Facebook className="w-3.5 h-3.5 fill-current" />
            </a>
            <a
              href={CONTACT_INFO.social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-7 h-7 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-black hover:bg-[#FFC400] hover:border-[#FFC400] transition-all cursor-pointer"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a
              href={CONTACT_INFO.social.pinterest}
              target="_blank"
              rel="noreferrer"
              aria-label="Pinterest"
              className="w-7 h-7 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-black hover:bg-[#FFC400] hover:border-[#FFC400] transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.546.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href={`https://${CONTACT_INFO.website}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Website"
              className="w-7 h-7 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-black hover:bg-[#FFC400] hover:border-[#FFC400] transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
