import React, { useState, useRef } from 'react';
import {
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  Type,
  Phone,
  Mail,
  Share2,
  DollarSign,
  Image as ImageIcon,
  Shield,
  Menu as MenuIcon,
  Search,
  Layers,
  ToggleLeft,
  ToggleRight,
  Download,
  Upload,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Edit2,
  ExternalLink,
  HelpCircle,
  Lock,
  Copy,
} from 'lucide-react';
import { useWebsiteSettings } from '../../context/AdminSettingsContext';
import { EditablePortfolioItem, NavigationMenuItem } from '../../types/admin';

export const WebsiteSettingsManager: React.FC = () => {
  const {
    settings,
    portfolioItems,
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
    resetToDefaults,
    exportSettingsJSON,
    importSettingsJSON,
    previewMode,
    togglePreviewMode,
  } = useWebsiteSettings();

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    | 'branding'
    | 'homepage'
    | 'contact'
    | 'email'
    | 'social'
    | 'services'
    | 'portfolio'
    | 'watermark'
    | 'navigation'
    | 'seo'
    | 'footer'
    | 'sections'
    | 'security'
    | 'backup'
  >('branding');

  // Password Management State
  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [pwdStatus, setPwdStatus] = useState<{ type: 'error' | 'success' | null; message: string }>({
    type: null,
    message: '',
  });

  // Saved Toast state
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Changes saved & applied live!');

  // Portfolio Modal State
  const [editingItem, setEditingItem] = useState<EditablePortfolioItem | null>(null);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [portfolioFilterCategory, setPortfolioFilterCategory] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger Save Notification
  const triggerSaveNotification = (msg = 'Settings updated and synced successfully!') => {
    setToastMessage(msg);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  // Helper for JSON import file
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importSettingsJSON(content);
        if (success) {
          triggerSaveNotification('Configuration backup imported successfully!');
        } else {
          alert('Invalid configuration JSON file.');
        }
      }
    };
    reader.readAsText(file);
  };

  // Portfolio Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64 && editingItem) {
        setEditingItem({
          ...editingItem,
          image: base64,
          originalImage: base64,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSavePortfolioModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (editingItem.id && portfolioItems.some((p) => p.id === editingItem.id)) {
      editPortfolioItem(editingItem.id, editingItem);
      triggerSaveNotification(`Updated "${editingItem.title}"`);
    } else {
      addPortfolioItem(editingItem);
      triggerSaveNotification(`Added new portfolio item "${editingItem.title}"`);
    }
    setIsPortfolioModalOpen(false);
    setEditingItem(null);
  };

  const handleMovePortfolioItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...portfolioItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    reorderPortfolioItems(newItems);
    triggerSaveNotification('Portfolio display order updated!');
  };

  const filteredPortfolio = portfolioItems.filter((item) => {
    if (portfolioFilterCategory === 'all') return true;
    return item.category === portfolioFilterCategory;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showSaveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FFC400] text-black px-4 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-2.5 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-black" />
          <span className="text-xs sm:text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header Controls Bar */}
      <div className="bg-[#0e0e11] border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#FFC400]/15 text-[#FFC400] border border-[#FFC400]/30 text-[10px] font-black uppercase tracking-wider">
              Live Management
            </span>
            <span className="text-xs text-zinc-400 font-mono">No Code Deploy Required</span>
          </div>
          <h2 className="text-lg sm:text-xl font-display font-black text-white uppercase mt-1">
            Website Content &amp; System Settings
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Modify text, branding, contact channels, pricing packages, portfolio items, and feature toggles in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={togglePreviewMode}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              previewMode
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{previewMode ? 'Preview Banner ON' : 'Preview Mode'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerSaveNotification('All settings synced & active across live website');
            }}
            className="px-4 py-2 bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-[0_4px_14px_rgba(255,196,0,0.25)] transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save All</span>
          </button>
        </div>
      </div>

      {/* Main Settings Body with Side Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sub-Navigation Sidebar */}
        <div className="lg:col-span-3 bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-2.5 space-y-1">
          <div className="px-3 py-2 text-[10px] font-black uppercase text-zinc-500 tracking-wider">
            Configuration Sections
          </div>

          {[
            { id: 'branding', label: 'Branding & Logo', icon: Type },
            { id: 'homepage', label: 'Homepage & Copy', icon: Sliders },
            { id: 'contact', label: 'Contact & Business', icon: Phone },
            { id: 'email', label: 'Email & Form Settings', icon: Mail },
            { id: 'social', label: 'Social Media Links', icon: Share2 },
            { id: 'services', label: 'Services & Pricing', icon: DollarSign },
            { id: 'portfolio', label: 'Portfolio Manager', icon: ImageIcon, badge: `${portfolioItems.length}` },
            { id: 'watermark', label: 'Image Watermarks', icon: Shield },
            { id: 'navigation', label: 'Navigation Menu', icon: MenuIcon },
            { id: 'seo', label: 'SEO & Meta Tags', icon: Search },
            { id: 'footer', label: 'Footer & Copyright', icon: Layers },
            { id: 'sections', label: 'Section Feature Flags', icon: ToggleLeft },
            { id: 'security', label: 'Security & Access', icon: Lock },
            { id: 'backup', label: 'Backup & Restore', icon: Download },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FFC400] text-black shadow-md font-extrabold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#FFC400]'}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                      isActive ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Settings Content Area */}
        <div className="lg:col-span-9 bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-5 sm:p-7">
          {/* 1. BRANDING TAB */}
          {activeTab === 'branding' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-800 pb-4">
                <h3 className="text-base sm:text-lg font-display font-black text-white uppercase">
                  Website Identity &amp; Branding
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Manage your brand name, header logo typography, tagline, and top announcement banner.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    Website Name
                  </label>
                  <input
                    type="text"
                    value={settings.branding.siteName}
                    onChange={(e) => updateBranding({ siteName: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    Primary Brand Color (Hex)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.branding.primaryColor}
                      onChange={(e) => updateBranding({ primaryColor: e.target.value })}
                      className="w-10 h-10 rounded-lg bg-transparent border border-zinc-800 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.branding.primaryColor}
                      onChange={(e) => updateBranding({ primaryColor: e.target.value })}
                      className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.branding.tagline}
                    onChange={(e) => updateBranding({ tagline: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    Logo Main Text
                  </label>
                  <input
                    type="text"
                    value={settings.branding.logoText}
                    onChange={(e) => updateBranding({ logoText: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-display font-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    Logo Subtext / Disciplines
                  </label>
                  <input
                    type="text"
                    value={settings.branding.logoSubtext}
                    onChange={(e) => updateBranding({ logoSubtext: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2 p-4 bg-zinc-950 border border-zinc-850 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase">Announcement Banner</h4>
                      <p className="text-[11px] text-zinc-400">Display special promotions or express speed badge at the very top of pages.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateBranding({ announcementBarEnabled: !settings.branding.announcementBarEnabled })}
                      className="cursor-pointer text-[#FFC400]"
                    >
                      {settings.branding.announcementBarEnabled ? (
                        <ToggleRight className="w-8 h-8 fill-current" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-zinc-600" />
                      )}
                    </button>
                  </div>

                  {settings.branding.announcementBarEnabled && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={settings.branding.announcementBarText}
                          onChange={(e) => updateBranding({ announcementBarText: e.target.value })}
                          placeholder="Announcement message text..."
                          className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={settings.branding.announcementBarLink}
                          onChange={(e) => updateBranding({ announcementBarLink: e.target.value })}
                          placeholder="Target Link (e.g. #/contact)"
                          className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. HOMEPAGE TAB */}
          {activeTab === 'homepage' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-800 pb-4">
                <h3 className="text-base sm:text-lg font-display font-black text-white uppercase">
                  Homepage Headlines &amp; Content
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Customize the hero banner, trust pill badges, about section narrative, and call-to-action banner text.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    Hero Eyebrow Badge
                  </label>
                  <input
                    type="text"
                    value={settings.homepage.heroBadge}
                    onChange={(e) => updateHomepage({ heroBadge: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                      Main Hero Headline
                    </label>
                    <input
                      type="text"
                      value={settings.homepage.heroHeadline}
                      onChange={(e) => updateHomepage({ heroHeadline: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-display font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                      Headline Highlight (Gold Text)
                    </label>
                    <input
                      type="text"
                      value={settings.homepage.heroHeadlineHighlight}
                      onChange={(e) => updateHomepage({ heroHeadlineHighlight: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-[#FFC400] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-display font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    Hero Subtitle / Value Proposition
                  </label>
                  <textarea
                    rows={3}
                    value={settings.homepage.heroSubtitle}
                    onChange={(e) => updateHomepage({ heroSubtitle: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                      Primary CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={settings.homepage.heroCtaText}
                      onChange={(e) => updateHomepage({ heroCtaText: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white px-3.5 py-2.5 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                      Secondary CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={settings.homepage.heroSecondaryCtaText}
                      onChange={(e) => updateHomepage({ heroSecondaryCtaText: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white px-3.5 py-2.5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Hero Trust Guarantee Pills
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={settings.homepage.trustBadge1}
                      onChange={(e) => updateHomepage({ trustBadge1: e.target.value })}
                      className="bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      value={settings.homepage.trustBadge2}
                      onChange={(e) => updateHomepage({ trustBadge2: e.target.value })}
                      className="bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      value={settings.homepage.trustBadge3}
                      onChange={(e) => updateHomepage({ trustBadge3: e.target.value })}
                      className="bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* About Story */}
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    About Section Story Paragraph
                  </label>
                  <textarea
                    rows={4}
                    value={settings.homepage.aboutStory}
                    onChange={(e) => updateHomepage({ aboutStory: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. CONTACT & BUSINESS INFO */}
          {activeTab === 'contact' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-800 pb-4">
                <h3 className="text-base sm:text-lg font-display font-black text-white uppercase">
                  Contact Information &amp; Business Details
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  These details automatically populate across the header bar, contact page, quote modal, and footer.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    Primary Telephone Number
                  </label>
                  <input
                    type="text"
                    value={settings.contact.phone}
                    onChange={(e) => updateContact({ phone: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    Sanitized Dial Link (E.164 format)
                  </label>
                  <input
                    type="text"
                    value={settings.contact.phoneClean}
                    onChange={(e) => updateContact({ phoneClean: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    Primary Production Email
                  </label>
                  <input
                    type="email"
                    value={settings.contact.email}
                    onChange={(e) => updateContact({ email: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    Secondary / Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.contact.secondaryEmail}
                    onChange={(e) => updateContact({ secondaryEmail: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    Physical / Service Location
                  </label>
                  <input
                    type="text"
                    value={settings.contact.location}
                    onChange={(e) => updateContact({ location: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    Working Hours
                  </label>
                  <input
                    type="text"
                    value={settings.contact.workingHours}
                    onChange={(e) => updateContact({ workingHours: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    Turnaround Speed Claim
                  </label>
                  <input
                    type="text"
                    value={settings.contact.turnaroundClaim}
                    onChange={(e) => updateContact({ turnaroundClaim: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. EMAIL & FORM SETTINGS */}
          {activeTab === 'email' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-800 pb-4">
                <h3 className="text-base sm:text-lg font-display font-black text-white uppercase">
                  Connected Email &amp; Contact Form Automation
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Configure the connected Gmail gateway, notification email routing, and auto-responder confirmation.
                </p>
              </div>

              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase">Connected Gmail Gateway</h4>
                      <p className="text-xs text-blue-300 font-mono">{settings.emailSettings.connectedEmail}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase">
                    Connected &amp; Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                      Connected Account Email
                    </label>
                    <input
                      type="email"
                      value={settings.emailSettings.connectedEmail}
                      onChange={(e) => updateEmailSettings({ connectedEmail: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                      Quote Notification Recipient
                    </label>
                    <input
                      type="email"
                      value={settings.emailSettings.notificationEmail}
                      onChange={(e) => updateEmailSettings({ notificationEmail: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                      Quote Subject Prefix
                    </label>
                    <input
                      type="text"
                      value={settings.emailSettings.quotePrefix}
                      onChange={(e) => updateEmailSettings({ quotePrefix: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white px-3.5 py-2.5 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                      Reply-To Display Name
                    </label>
                    <input
                      type="text"
                      value={settings.emailSettings.replyToName}
                      onChange={(e) => updateEmailSettings({ replyToName: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white px-3.5 py-2.5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Auto Responder */}
                <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase">Customer Instant Auto-Responder</h4>
                      <p className="text-[11px] text-zinc-400">Automatically acknowledge quote requests with a confirmation message.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateEmailSettings({ autoResponderEnabled: !settings.emailSettings.autoResponderEnabled })}
                      className="cursor-pointer text-[#FFC400]"
                    >
                      {settings.emailSettings.autoResponderEnabled ? (
                        <ToggleRight className="w-8 h-8 fill-current" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-zinc-600" />
                      )}
                    </button>
                  </div>

                  {settings.emailSettings.autoResponderEnabled && (
                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                          Auto-Responder Subject Line
                        </label>
                        <input
                          type="text"
                          value={settings.emailSettings.autoResponderSubject}
                          onChange={(e) => updateEmailSettings({ autoResponderSubject: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                          Auto-Responder Message Template
                        </label>
                        <textarea
                          rows={4}
                          value={settings.emailSettings.autoResponderBody}
                          onChange={(e) => updateEmailSettings({ autoResponderBody: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-lg text-xs font-mono leading-relaxed"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 5. SOCIAL MEDIA LINKS */}
          {activeTab === 'social' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-800 pb-4">
                <h3 className="text-base sm:text-lg font-display font-black text-white uppercase">
                  Social Media &amp; Channel Profiles
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Manage direct URLs to your Facebook page, Instagram, Pinterest, and WhatsApp messaging channel.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2 p-4 rounded-xl bg-blue-950/20 border border-blue-800/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-blue-300">
                      Official Facebook Page URL
                    </label>
                    <a
                      href={settings.social.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>Open Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="url"
                    value={settings.social.facebook}
                    onChange={(e) => updateSocial({ facebook: e.target.value })}
                    className="w-full bg-zinc-950 border border-blue-500/50 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-mono"
                  />
                  <p className="text-[11px] text-zinc-400">
                    Active Facebook URL: <code>https://www.facebook.com/profile.php?id=61593649506118</code>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    Instagram Profile URL
                  </label>
                  <input
                    type="url"
                    value={settings.social.instagram}
                    onChange={(e) => updateSocial({ instagram: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    Pinterest Gallery URL
                  </label>
                  <input
                    type="url"
                    value={settings.social.pinterest}
                    onChange={(e) => updateSocial({ pinterest: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    WhatsApp Direct Phone / Link
                  </label>
                  <input
                    type="text"
                    value={settings.social.whatsapp}
                    onChange={(e) => updateSocial({ whatsapp: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    LinkedIn Company Page
                  </label>
                  <input
                    type="url"
                    value={settings.social.linkedin}
                    onChange={(e) => updateSocial({ linkedin: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    YouTube Channel URL
                  </label>
                  <input
                    type="url"
                    value={settings.social.youtube}
                    onChange={(e) => updateSocial({ youtube: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    TikTok Profile URL
                  </label>
                  <input
                    type="url"
                    value={settings.social.tiktok}
                    onChange={(e) => updateSocial({ tiktok: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 6. SERVICES & PRICING */}
          {activeTab === 'services' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-800 pb-4">
                <h3 className="text-base sm:text-lg font-display font-black text-white uppercase">
                  Services &amp; Pricing Packages
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Update starting rates, turnaround times, and pricing schedule packages.
                </p>
              </div>

              <div className="space-y-4">
                {settings.pricingPackages.map((pkg, idx) => (
                  <div
                    key={pkg.id || idx}
                    className="p-4 bg-zinc-950 border border-zinc-850 rounded-2xl space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded bg-[#FFC400]/20 text-[#FFC400] text-[10px] font-black uppercase">
                          {pkg.categoryLabel || pkg.category}
                        </span>
                        <h4 className="text-sm font-bold text-white">{pkg.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400 font-mono">Price:</span>
                        <input
                          type="number"
                          value={pkg.price}
                          onChange={(e) => {
                            const newPrice = Number(e.target.value);
                            const updated = [...settings.pricingPackages];
                            updated[idx] = {
                              ...pkg,
                              price: newPrice,
                              priceDisplay: `$${newPrice}`,
                            };
                            updatePricingPackages(updated);
                          }}
                          className="w-20 bg-zinc-900 border border-zinc-700 text-[#FFC400] font-black text-xs px-2 py-1 rounded text-center"
                        />
                        <span className="text-xs text-zinc-500">{pkg.unit}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                          Turnaround Guarantee
                        </label>
                        <input
                          type="text"
                          value={pkg.turnaround}
                          onChange={(e) => {
                            const updated = [...settings.pricingPackages];
                            updated[idx] = { ...pkg, turnaround: e.target.value };
                            updatePricingPackages(updated);
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-1.5 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                          Feature Description
                        </label>
                        <input
                          type="text"
                          value={pkg.description}
                          onChange={(e) => {
                            const updated = [...settings.pricingPackages];
                            updated[idx] = { ...pkg, description: e.target.value };
                            updatePricingPackages(updated);
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-1.5 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. PORTFOLIO MANAGER */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-display font-black text-white uppercase">
                    Portfolio Items &amp; Image Management ({portfolioItems.length})
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Upload original artwork photos, edit specs, change client names, and reorder display sequence.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingItem({
                      id: '',
                      title: 'New Production Project',
                      category: 'vector',
                      categoryLabel: 'Vector Artwork',
                      image: '',
                      tag: 'Vector Redraw',
                      specs: 'Precision Bézier redraw delivered in .AI & .EPS',
                      client: 'Apparel Client',
                      description: 'High-detail vector artwork conversion prepared for screen printing and vinyl plotting.',
                      turnaround: '2-4 Hours',
                      colors: 'Full Color Master',
                      deliverables: ['Vector AI / EPS', '300 DPI PNG', 'Film Positives'],
                    });
                    setIsPortfolioModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase rounded-xl flex items-center gap-1.5 shadow cursor-pointer self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Portfolio Item</span>
                </button>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: `All (${portfolioItems.length})` },
                  { id: 'vector', label: 'Vector Artwork' },
                  { id: 'embroidery', label: 'Embroidery Digitizing' },
                  { id: 'screen-printing', label: 'Screen Printing' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setPortfolioFilterCategory(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      portfolioFilterCategory === c.id
                        ? 'bg-zinc-800 text-[#FFC400] border border-zinc-700'
                        : 'text-zinc-400 hover:text-white bg-zinc-950'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Portfolio Grid List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {filteredPortfolio.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="p-3.5 bg-zinc-950 border border-zinc-850 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Image Thumbnail */}
                      <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-zinc-600" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-zinc-800 text-[#FFC400]">
                            {item.category}
                          </span>
                          <span className="text-xs font-bold text-zinc-400 truncate">{item.client}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5 max-w-md">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-zinc-500 font-mono truncate">{item.specs}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMovePortfolioItem(index, 'up')}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMovePortfolioItem(index, 'down')}
                        disabled={index === portfolioItems.length - 1}
                        title="Move Down"
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingItem({ ...item });
                          setIsPortfolioModalOpen(true);
                        }}
                        title="Edit Item"
                        className="p-1.5 rounded-lg bg-[#FFC400]/20 hover:bg-[#FFC400]/30 text-[#FFC400] cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete portfolio item "${item.title}"?`)) {
                            deletePortfolioItem(item.id);
                            triggerSaveNotification(`Deleted item "${item.title}"`);
                          }
                        }}
                        title="Delete Item"
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. WATERMARK CONFIG */}
          {activeTab === 'watermark' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-800 pb-4">
                <h3 className="text-base sm:text-lg font-display font-black text-white uppercase">
                  Image Watermark Security Studio
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Protect portfolio artwork proofs with custom watermark text, opacity, and angle placement.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-850 rounded-xl">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">Global Watermark Overlay</h4>
                    <p className="text-[11px] text-zinc-400">Apply watermark layer over all portfolio artwork previews.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateWatermark({ enabled: !settings.watermark.enabled })}
                    className="cursor-pointer text-[#FFC400]"
                  >
                    {settings.watermark.enabled ? (
                      <ToggleRight className="w-8 h-8 fill-current" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-zinc-600" />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                      Watermark Stamp Text
                    </label>
                    <input
                      type="text"
                      value={settings.watermark.text}
                      onChange={(e) => updateWatermark({ text: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-display tracking-widest font-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                      Watermark Placement Style
                    </label>
                    <select
                      value={settings.watermark.placement}
                      onChange={(e) => updateWatermark({ placement: e.target.value as any })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm"
                    >
                      <option value="diagonal">Diagonal 45° Angle (Recommended)</option>
                      <option value="center">Center Centered Stamp</option>
                      <option value="bottom-right">Bottom Right Subdued</option>
                      <option value="tile">Multi-Tile Repeating Security Pattern</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase text-zinc-400">
                        Opacity: {Math.round(settings.watermark.opacity * 100)}%
                      </label>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.6"
                      step="0.01"
                      value={settings.watermark.opacity}
                      onChange={(e) => updateWatermark({ opacity: parseFloat(e.target.value) })}
                      className="w-full accent-[#FFC400]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase text-zinc-400">
                        Font Size: {settings.watermark.size}px
                      </label>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="36"
                      step="1"
                      value={settings.watermark.size}
                      onChange={(e) => updateWatermark({ size: parseInt(e.target.value) })}
                      className="w-full accent-[#FFC400]"
                    />
                  </div>
                </div>

                {/* Live Preview of Watermark */}
                <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase">Live Watermark Preview</h4>
                  <div className="relative h-32 w-full rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center">
                    <div className="text-xs text-zinc-600 uppercase font-mono">Sample Artwork Canvas</div>
                    {settings.watermark.enabled && (
                      <div
                        className="absolute inset-0 pointer-events-none flex items-center justify-center select-none"
                        style={{
                          opacity: settings.watermark.opacity,
                          transform: settings.watermark.placement === 'diagonal' ? 'rotate(-30deg)' : 'none',
                        }}
                      >
                        <span
                          className="font-black font-display uppercase tracking-widest border border-white/40 px-3 py-1.5 rounded"
                          style={{
                            fontSize: `${settings.watermark.size}px`,
                            color: settings.watermark.color,
                          }}
                        >
                          {settings.watermark.text}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. NAVIGATION MENU */}
          {activeTab === 'navigation' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-800 pb-4">
                <h3 className="text-base sm:text-lg font-display font-black text-white uppercase">
                  Navigation Menu Items &amp; Order
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Enable, disable, rename, or reorganize header links and page routing destinations.
                </p>
              </div>

              <div className="space-y-3">
                {settings.navigation.map((navItem, idx) => (
                  <div
                    key={navItem.id || idx}
                    className="p-3 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="w-6 text-center text-xs font-mono text-zinc-500 font-bold">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={navItem.label}
                        onChange={(e) => {
                          const updated = [...settings.navigation];
                          updated[idx] = { ...navItem, label: e.target.value };
                          updateNavigation(updated);
                        }}
                        className="bg-zinc-900 border border-zinc-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg w-40"
                      />
                      <span className="text-xs font-mono text-zinc-400">{navItem.href}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...settings.navigation];
                          updated[idx] = { ...navItem, enabled: !navItem.enabled };
                          updateNavigation(updated);
                        }}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                          navItem.enabled
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                            : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                        }`}
                      >
                        {navItem.enabled ? 'Visible' : 'Hidden'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. SEO & META TAGS */}
          {activeTab === 'seo' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-800 pb-4">
                <h3 className="text-base sm:text-lg font-display font-black text-white uppercase">
                  SEO Meta Titles, Descriptions &amp; Keywords
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Optimize search engine indexing for Google, Bing, Facebook Open Graph, and Twitter Cards.
                </p>
              </div>

              <div className="space-y-6">
                {['home', 'services', 'pricing', 'portfolio', 'contact'].map((pageKey) => {
                  const seoData = settings.seo[pageKey] || {
                    title: '',
                    description: '',
                    keywords: '',
                  };
                  return (
                    <div
                      key={pageKey}
                      className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                        <span className="text-xs font-black uppercase text-[#FFC400] tracking-wider">
                          Page: {pageKey.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">#/{pageKey === 'home' ? '' : pageKey}</span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                          Meta Title ({seoData.title.length} chars)
                        </label>
                        <input
                          type="text"
                          value={seoData.title}
                          onChange={(e) => updateSEO(pageKey, { title: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                          Meta Description ({seoData.description.length} chars)
                        </label>
                        <textarea
                          rows={2}
                          value={seoData.description}
                          onChange={(e) => updateSEO(pageKey, { description: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                          Target Keywords
                        </label>
                        <input
                          type="text"
                          value={seoData.keywords}
                          onChange={(e) => updateSEO(pageKey, { keywords: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 11. FOOTER & COPYRIGHT */}
          {activeTab === 'footer' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-800 pb-4">
                <h3 className="text-base sm:text-lg font-display font-black text-white uppercase">
                  Footer Content &amp; Legal Notices
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Manage the footer summary paragraph, copyright year notice, and trademark disclaimers.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    Footer Description
                  </label>
                  <textarea
                    rows={3}
                    value={settings.footer.description}
                    onChange={(e) => updateFooter({ description: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    Copyright Notice
                  </label>
                  <input
                    type="text"
                    value={settings.footer.copyrightText}
                    onChange={(e) => updateFooter({ copyrightText: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    Sample Showcase Disclaimer
                  </label>
                  <textarea
                    rows={3}
                    value={settings.footer.disclaimerText}
                    onChange={(e) => updateFooter({ disclaimerText: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white p-3.5 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 12. SECTION VISIBILITY / FEATURE FLAGS */}
          {activeTab === 'sections' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-800 pb-4">
                <h3 className="text-base sm:text-lg font-display font-black text-white uppercase">
                  Section Feature Flags &amp; Visibility Controls
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Turn specific sections on or off in real-time across the live website.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'topContactBar', title: 'Top Contact Header Bar', desc: 'Phone, email, hours strip' },
                  { key: 'heroStats', title: 'Hero Metrics & Trust Strip', desc: '2-6h express, 100% manual redraw' },
                  { key: 'beforeAfterSlider', title: 'Interactive Before/After Slider', desc: 'Vector comparison slider' },
                  { key: 'servicesGrid', title: 'Services & Disciplines Grid', desc: 'Vector, digitizing, screen print' },
                  { key: 'whyChooseUs', title: 'Why Choose Us Quality Matrix', desc: 'Speed, precision, Tajima machines' },
                  { key: 'processSteps', title: 'How It Works 4-Step Process', desc: 'Upload, digitize, proof, dispatch' },
                  { key: 'pricingSection', title: 'Transparent Pricing Schedule', desc: 'Pricing packages & features' },
                  { key: 'portfolioShowcase', title: 'Homepage Portfolio Gallery', desc: 'Recent production pieces' },
                  { key: 'testimonials', title: 'Customer Reviews & Testimonials', desc: 'Quotes from apparel shops' },
                  { key: 'faqSection', title: 'FAQ Accordion Matrix', desc: 'Common digitizing & vector questions' },
                  { key: 'ctaBanner', title: 'Bottom CTA Callout Banner', desc: 'Ready to turn artwork into files' },
                  { key: 'watermarkOverlay', title: 'Image Watermark Protection', desc: 'Anti-theft overlay stamp' },
                ].map((sec) => {
                  const isEnabled = settings.sections[sec.key as keyof typeof settings.sections];
                  return (
                    <div
                      key={sec.key}
                      className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase">{sec.title}</h4>
                        <p className="text-[11px] text-zinc-400">{sec.desc}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          updateSections({
                            [sec.key]: !isEnabled,
                          })
                        }
                        className="cursor-pointer text-[#FFC400]"
                      >
                        {isEnabled ? (
                          <ToggleRight className="w-8 h-8 fill-current text-[#FFC400]" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-zinc-600" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 13. BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-800 pb-4">
                <h3 className="text-base sm:text-lg font-display font-black text-white uppercase">
                  Configuration Backup, Export &amp; Factory Reset
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Save all website custom settings into a portable JSON backup file or restore factory defaults.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Export Card */}
                <div className="p-5 bg-zinc-950 border border-zinc-850 rounded-2xl space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center">
                    <Download className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase">Export Configuration JSON</h4>
                  <p className="text-xs text-zinc-400">
                    Download a full backup of all current branding, portfolio items, pricing, and email logs.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const json = exportSettingsJSON();
                      const blob = new Blob([json], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `graphics_punching_settings_backup_${new Date().toISOString().slice(0, 10)}.json`;
                      a.click();
                      triggerSaveNotification('Settings backup exported successfully!');
                    }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className="p-5 bg-zinc-950 border border-zinc-850 rounded-2xl space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-400 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase">Restore From Backup File</h4>
                  <p className="text-xs text-zinc-400">
                    Upload a previously exported JSON backup file to restore website content immediately.
                  </p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="block w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-zinc-900 file:text-zinc-300 hover:file:bg-zinc-800 cursor-pointer"
                  />
                </div>

                {/* Reset to Factory Defaults */}
                <div className="sm:col-span-2 p-5 bg-red-950/20 border border-red-900/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-red-300 uppercase">Reset to Factory Defaults</h4>
                    <p className="text-xs text-zinc-400 mt-0.5 max-w-lg">
                      Restores all original portfolio items, pricing schedules, contact details, and branding to initial factory state.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        confirm(
                          'Are you sure you want to reset all website settings and portfolio items to factory defaults?'
                        )
                      ) {
                        resetToDefaults();
                        triggerSaveNotification('Reset to factory defaults successfully!');
                      }
                    }}
                    className="px-4 py-2.5 bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset All Defaults</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 13. SECURITY & ACCESS TAB */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-800 pb-4">
                <h3 className="text-base sm:text-lg font-display font-black text-white uppercase flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#FFC400]" />
                  <span>Admin Security &amp; Password Management</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Manage administrator access credentials. Passwords are cryptographically hashed using SHA-256 and never visible to visitors or stored in plain text.
                </p>
              </div>

              {/* Password Change Card */}
              <div className="max-w-xl bg-zinc-950 border border-zinc-850 rounded-2xl p-6 space-y-5">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    Change Administrator Password
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Enter your current password followed by your new password to update administrative access credentials.
                  </p>
                </div>

                {pwdStatus.message && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                      pwdStatus.type === 'success'
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                        : 'bg-red-950/40 border-red-800 text-red-300'
                    }`}
                  >
                    {pwdStatus.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <span>{pwdStatus.message}</span>
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!pwdCurrent || !pwdNew || !pwdConfirm) {
                      setPwdStatus({
                        type: 'error',
                        message: 'Please fill in all password fields.',
                      });
                      return;
                    }
                    if (pwdNew !== pwdConfirm) {
                      setPwdStatus({
                        type: 'error',
                        message: 'New password and confirmation do not match.',
                      });
                      return;
                    }
                    if (pwdNew.length < 6) {
                      setPwdStatus({
                        type: 'error',
                        message: 'New password must be at least 6 characters long.',
                      });
                      return;
                    }

                    const res = changeAdminPassword(pwdCurrent, pwdNew);
                    if (res.success) {
                      setPwdStatus({
                        type: 'success',
                        message: res.message,
                      });
                      setPwdCurrent('');
                      setPwdNew('');
                      setPwdConfirm('');
                      triggerSaveNotification('Admin password changed and encrypted successfully!');
                    } else {
                      setPwdStatus({
                        type: 'error',
                        message: res.message,
                      });
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={pwdCurrent}
                      onChange={(e) => {
                        setPwdCurrent(e.target.value);
                        setPwdStatus({ type: null, message: '' });
                      }}
                      placeholder="Enter current admin password"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={pwdNew}
                      onChange={(e) => {
                        setPwdNew(e.target.value);
                        setPwdStatus({ type: null, message: '' });
                      }}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={pwdConfirm}
                      onChange={(e) => {
                        setPwdConfirm(e.target.value);
                        setPwdStatus({ type: null, message: '' });
                      }}
                      placeholder="Repeat new password"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer flex items-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Update &amp; Encrypt Password</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Encryption & Obfuscation Information */}
              <div className="p-5 bg-zinc-950/60 border border-zinc-850 rounded-2xl space-y-2.5 max-w-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Security &amp; Privacy Shield Active</span>
                </div>
                <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside">
                  <li>Passwords are hashed with cryptographic SHA-256 before verification.</li>
                  <li>No raw or plain text passwords are visible to website visitors or stored in source code.</li>
                  <li>Administrative sessions are locked by default until authorized with master credentials.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PORTFOLIO EDIT / ADD MODAL */}
      {isPortfolioModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0e0e11] border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base sm:text-lg font-display font-black text-white uppercase">
                {editingItem.id ? 'Edit Portfolio Item' : 'Add New Portfolio Project'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsPortfolioModalOpen(false);
                  setEditingItem(null);
                }}
                className="text-zinc-400 hover:text-white p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePortfolioModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Service Category
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value as any,
                        categoryLabel:
                          e.target.value === 'vector'
                            ? 'Vector Artwork'
                            : e.target.value === 'embroidery'
                            ? 'Embroidery'
                            : 'Screen Printing',
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3.5 py-2.5 rounded-xl text-xs"
                  >
                    <option value="vector">Vector Artwork Redraw</option>
                    <option value="embroidery">Embroidery Digitizing</option>
                    <option value="screen-printing">Screen Printing Color Separation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Client / Brand Name
                  </label>
                  <input
                    type="text"
                    value={editingItem.client}
                    onChange={(e) => setEditingItem({ ...editingItem, client: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3.5 py-2.5 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Image Upload Area */}
              <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl space-y-3">
                <label className="block text-xs font-bold uppercase text-white">
                  Portfolio Image / Proof
                </label>
                <div className="flex items-center gap-4">
                  {editingItem.image && (
                    <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0">
                      <img
                        src={editingItem.image}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-zinc-850 file:text-zinc-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="Or enter Image URL (https://...)"
                      value={editingItem.image}
                      onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-1.5 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Badge Tag
                  </label>
                  <input
                    type="text"
                    value={editingItem.tag}
                    onChange={(e) => setEditingItem({ ...editingItem, tag: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3.5 py-2 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Turnaround Speed
                  </label>
                  <input
                    type="text"
                    value={editingItem.turnaround || '2-4 Hours'}
                    onChange={(e) => setEditingItem({ ...editingItem, turnaround: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3.5 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                  Technical Specifications
                </label>
                <input
                  type="text"
                  value={editingItem.specs}
                  onChange={(e) => setEditingItem({ ...editingItem, specs: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white px-3.5 py-2.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                  Project Description
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsPortfolioModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold uppercase rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FFC400] hover:bg-[#ffcd1a] text-black text-xs font-black uppercase rounded-xl shadow cursor-pointer"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
