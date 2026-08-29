import React from 'react';
import { QuoteSection } from '../components/QuoteSection';
import { Sparkles, Mail, Phone, MapPin, Clock, ShieldCheck, CheckCircle2, Facebook, ExternalLink } from 'lucide-react';
import { useWebsiteSettings } from '../context/AdminSettingsContext';

export const ContactPage: React.FC = () => {
  const { settings } = useWebsiteSettings();
  const { contact, social } = settings;

  return (
    <div className="animate-fadeIn">
      {/* Page Header */}
      <div className="bg-[#050505] text-white py-14 sm:py-18 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFC400]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/25 text-[#FFC400] text-xs font-black tracking-widest uppercase mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>DIRECT FACTORY DISPATCH &amp; SUPPORT</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white">
            CONTACT <span className="text-[#FFC400]">US &amp; GET A QUOTE</span>
          </h1>

          <p className="mt-4 text-zinc-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Ready to quote your vector conversion or embroidery digitizing project? Submit your specifications below or contact our production team directly.
          </p>

          {/* Social Quick Connect */}
          {social.facebook && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <a
                href={social.facebook}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/40 text-blue-400 hover:text-blue-300 text-xs font-bold transition-all shadow-sm group"
              >
                <Facebook className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                <span>Connect on Facebook</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Main Quote / Contact System */}
      <QuoteSection />

      {/* Direct Contact Pillars Strip */}
      <section className="py-14 bg-[#0a0a0a] text-white border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-left">
            
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-display font-black text-sm uppercase text-white">Email Address</h3>
              <a 
                href={`mailto:${contact.email}`} 
                className="text-xs text-[#FFC400] hover:underline font-mono block break-all"
              >
                {contact.email}
              </a>
              <p className="text-[11px] text-zinc-500">Quotes returned within 1 hour</p>
            </div>

            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-display font-black text-sm uppercase text-white">Direct Phone</h3>
              <a 
                href={`tel:${contact.phoneClean || contact.phone}`} 
                className="text-xs text-[#FFC400] hover:underline font-mono block"
              >
                {contact.phone}
              </a>
              <p className="text-[11px] text-zinc-500">{contact.businessHours || 'Mon–Fri: 8:00 AM – 7:00 PM CST'}</p>
            </div>

            {social.facebook && (
              <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center">
                  <Facebook className="w-5 h-5 fill-current" />
                </div>
                <h3 className="font-display font-black text-sm uppercase text-white">Official Facebook</h3>
                <a 
                  href={social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-400 hover:underline font-mono flex items-center gap-1"
                >
                  <span>Visit Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <p className="text-[11px] text-zinc-500">Updates, portfolios &amp; direct messages</p>
              </div>
            )}

            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-display font-black text-sm uppercase text-white">Turnaround Speed</h3>
              <p className="text-xs text-[#FFC400] font-bold">{contact.turnaroundClaim || '4-12 Hours Standard'}</p>
              <p className="text-[11px] text-zinc-500">2-4h Rush service available</p>
            </div>

            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-display font-black text-sm uppercase text-white">Production Center</h3>
              <p className="text-xs text-zinc-300">{contact.location || 'Houston, Texas, USA'}</p>
              <p className="text-[11px] text-zinc-500">Worldwide digital dispatch</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
