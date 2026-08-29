import React, { useState } from 'react';
import {
  Settings,
  Mail,
  Send,
  Users,
  Eye,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { useWebsiteSettings } from '../context/AdminSettingsContext';
import { AdminAuthGate } from './admin/AdminAuthGate';
import { WebsiteSettingsManager } from './admin/WebsiteSettingsManager';
import { EmailChatbotWorkspace } from './admin/EmailChatbotWorkspace';
import { EmailHistoryLogs } from './admin/EmailHistoryLogs';
import { ContactsDatabase } from './admin/ContactsDatabase';

export const AdminPortal: React.FC = () => {
  const { isAdminAuthenticated, logoutAdmin, previewMode, togglePreviewMode, settings } =
    useWebsiteSettings();

  const [activeMainSection, setActiveMainSection] = useState<
    'settings' | 'chatbot' | 'history' | 'contacts'
  >('settings');

  // Handle composing email directly from contacts/logs
  const handleDirectCompose = (toEmail: string, name: string, contextService?: string) => {
    setActiveMainSection('chatbot');
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050507] text-white pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <AdminAuthGate />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white pt-20 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Admin Navigation Header */}
        <div className="bg-[#0c0c0f] border border-zinc-800 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFC400] to-[#e6b000] text-black flex items-center justify-center font-black shadow-[0_4px_20px_rgba(255,196,0,0.35)]">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight">
                  Admin Command Portal
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">
                  Live
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {settings.branding.siteName} • Global Content Management, Live Dynamic CMS &amp; Email Automation
              </p>
            </div>
          </div>

          {/* Quick Action Links */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <a
              href="#/"
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={logoutAdmin}
              className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-900/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock / Exit</span>
            </button>
          </div>
        </div>

        {/* Primary Tabs Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 p-1.5 bg-[#0c0c0e] border border-zinc-800 rounded-2xl">
          {[
            {
              id: 'settings',
              label: 'Website Settings & CMS',
              icon: Sliders,
              desc: 'Branding, text, pricing, portfolio, SEO & flags',
            },
            {
              id: 'chatbot',
              label: 'Email Chatbot & Gmail Dispatch',
              icon: Sparkles,
              desc: 'AI drafting copilot & connected Gmail',
            },
            {
              id: 'history',
              label: 'Dispatched Email Logs',
              icon: Send,
              desc: 'Sent mail tracking & audit trail',
            },
            {
              id: 'contacts',
              label: 'Customer Leads & CRM',
              icon: Users,
              desc: 'Quote inquiries & client database',
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeMainSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveMainSection(tab.id as any)}
                className={`flex-1 min-w-[200px] flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#FFC400] text-black shadow-lg'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-black text-[#FFC400]' : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div
                    className={`text-xs font-black uppercase tracking-wider truncate ${
                      isActive ? 'text-black' : 'text-white'
                    }`}
                  >
                    {tab.label}
                  </div>
                  <div
                    className={`text-[10px] truncate ${
                      isActive ? 'text-black/80 font-medium' : 'text-zinc-500'
                    }`}
                  >
                    {tab.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Section Render */}
        <div className="min-h-[500px]">
          {activeMainSection === 'settings' && <WebsiteSettingsManager />}
          {activeMainSection === 'chatbot' && <EmailChatbotWorkspace />}
          {activeMainSection === 'history' && (
            <EmailHistoryLogs onComposeTo={handleDirectCompose} />
          )}
          {activeMainSection === 'contacts' && (
            <ContactsDatabase onDraftEmailTo={handleDirectCompose} />
          )}
        </div>
      </div>
    </div>
  );
};
