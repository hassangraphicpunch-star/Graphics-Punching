import React, { useState, useEffect } from 'react';
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
  UploadCloud,
  RefreshCw,
  Zap,
  AlertCircle,
  Clock,
  Radio,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { useWebsiteSettings } from '../context/AdminSettingsContext';
import { AdminAuthGate } from './admin/AdminAuthGate';
import { WebsiteSettingsManager } from './admin/WebsiteSettingsManager';
import { EmailChatbotWorkspace } from './admin/EmailChatbotWorkspace';
import { EmailHistoryLogs } from './admin/EmailHistoryLogs';
import { ContactsDatabase } from './admin/ContactsDatabase';
import { LiveVisitorChatInbox } from './admin/LiveVisitorChatInbox';

export const AdminPortal: React.FC = () => {
  const {
    isAdminAuthenticated,
    logoutAdmin,
    previewMode,
    togglePreviewMode,
    settings,
    isPublishing,
    hasUnpublishedChanges,
    lastPublishedAt,
    autoPublishLive,
    toggleAutoPublishLive,
    syncStatus,
    sseStatus,
    sseError,
    subscribeToRealtimeEvents,
    publishToLive,
    syncFromServer,
  } = useWebsiteSettings();

  const [activeMainSection, setActiveMainSection] = useState<
    'settings' | 'live-chat' | 'chatbot' | 'history' | 'contacts'
  >('settings');
  const [publishFeedback, setPublishFeedback] = useState<string | null>(null);
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);
  const [incomingChatAlert, setIncomingChatAlert] = useState<{
    visitorName: string;
    text: string;
  } | null>(null);

  // Synchronize unread chat count in real time via context events & periodic fallback check
  useEffect(() => {
    let isMounted = true;

    // 1. Polling function for unread count
    const checkUnreadCount = async () => {
      try {
        const r = await fetch('/api/chatbot/conversations?_t=' + Date.now(), {
          credentials: 'include',
          cache: 'no-store',
        });
        if (r.ok) {
          const d = await r.json();
          if (isMounted && d.success && typeof d.totalUnread === 'number') {
            setUnreadChatCount(d.totalUnread);
          }
        }
      } catch {}
    };

    checkUnreadCount();
    const interval = setInterval(checkUnreadCount, 8000);

    // 2. Real-time subscriber to centralized stream
    const unsubscribe = subscribeToRealtimeEvents((packet) => {
      if (packet.type === 'chatbot_conversation_update') {
        if (typeof packet.totalUnread === 'number') {
          setUnreadChatCount(packet.totalUnread);
        }
        if (packet.newMessage?.role === 'user') {
          setIncomingChatAlert({
            visitorName: packet.conversation?.visitorName || 'Website Visitor',
            text: packet.newMessage.content?.slice(0, 100) || 'Sent a new message',
          });
          setTimeout(() => setIncomingChatAlert(null), 8000);
        }
      } else if (packet.type === 'chatbot_unread_update') {
        if (typeof packet.totalUnread === 'number') {
          setUnreadChatCount(packet.totalUnread);
        }
      }
    });

    return () => {
      isMounted = false;
      clearInterval(interval);
      unsubscribe();
    };
  }, [subscribeToRealtimeEvents]);

  const handleManualPublish = async () => {
    const res = await publishToLive({ note: 'Manual publish via Admin Command Portal' });
    if (res.success) {
      setPublishFeedback('✅ Live website updated & synchronized in real-time!');
      setTimeout(() => setPublishFeedback(null), 4000);
    } else {
      setPublishFeedback(`❌ Error: ${res.message}`);
      setTimeout(() => setPublishFeedback(null), 5000);
    }
  };

  // Format last published time
  const formatPublishedTime = (isoString: string | null) => {
    if (!isoString) return 'Not yet published';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' (' + date.toLocaleDateString() + ')';
    } catch {
      return isoString;
    }
  };

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
        {/* Top Admin Navigation & Real-Time Sync Header */}
        <div className="bg-[#0c0c0f] border border-zinc-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFC400] to-[#e6b000] text-black flex items-center justify-center font-black shadow-[0_4px_20px_rgba(255,196,0,0.35)] shrink-0">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight">
                    Admin Command Portal
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live System Active
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {settings.branding.siteName} • Global Content Management, Live Dynamic CMS &amp; Email Automation
                </p>
              </div>
            </div>

            {/* Quick Action Links & Publish Controls */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              <a
                href="#/"
                className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
              >
                <span>View Live Site</span>
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

          {/* Real-Time Live Website Sync & Publishing Control Strip */}
          <div className="pt-3 border-t border-zinc-850 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-zinc-950/80 rounded-2xl p-3 sm:p-4 border border-zinc-800/80">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    syncStatus === 'synced'
                      ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]'
                      : syncStatus === 'publishing'
                      ? 'bg-blue-500 animate-ping'
                      : syncStatus === 'error'
                      ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                      : 'bg-amber-400 animate-pulse'
                  }`}
                />
                <span className="text-xs font-bold text-zinc-200">
                  {syncStatus === 'synced' && '🟢 Live & Synchronized to Web'}
                  {syncStatus === 'unsaved' && '🟡 Updates Ready to Publish'}
                  {syncStatus === 'publishing' && '🔵 Publishing Live Updates...'}
                  {syncStatus === 'error' && '🔴 Sync Interrupted'}
                  {syncStatus === 'offline' && '⚪ Offline Mode'}
                </span>
              </div>

              <div className="text-[11px] text-zinc-400 flex items-center gap-1 border-l border-zinc-800 pl-3">
                <Clock className="w-3 h-3 text-zinc-500" />
                <span>Last Published: <strong className="text-zinc-300">{formatPublishedTime(lastPublishedAt)}</strong></span>
              </div>

              <div className="text-[11px] flex items-center gap-1.5 border-l border-zinc-800 pl-3">
                <span className={`w-2 h-2 rounded-full ${sseStatus === 'connected' ? 'bg-emerald-400 animate-ping' : sseStatus === 'connecting' ? 'bg-amber-400 animate-pulse' : 'bg-red-400'}`} />
                <span className={sseStatus === 'connected' ? 'text-emerald-400 font-semibold' : sseStatus === 'connecting' ? 'text-amber-400' : 'text-red-400'}>
                  {sseStatus === 'connected' ? 'SSE Stream Active' : sseStatus === 'connecting' ? 'SSE Connecting...' : 'SSE Stream Error'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
              {/* Auto-Publish Toggle */}
              <button
                type="button"
                onClick={toggleAutoPublishLive}
                title="When ON, all modifications in the Admin Portal automatically sync live across all visitors within 1 second."
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  autoPublishLive
                    ? 'bg-emerald-950/60 border-emerald-600/50 text-emerald-300 hover:bg-emerald-900/60'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${autoPublishLive ? 'text-emerald-400 fill-emerald-400/20' : 'text-zinc-500'}`} />
                <span>Auto-Sync Live: {autoPublishLive ? 'ON' : 'OFF'}</span>
              </button>

              {/* Sync from Server */}
              <button
                type="button"
                onClick={() => syncFromServer()}
                title="Pull latest published updates from server"
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              {/* Publish to Live Website Action */}
              <button
                type="button"
                onClick={handleManualPublish}
                disabled={isPublishing}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                  hasUnpublishedChanges
                    ? 'bg-gradient-to-r from-[#FFC400] to-[#ffaa00] hover:from-[#ffd033] hover:to-[#ffb71a] text-black shadow-[0_0_20px_rgba(255,196,0,0.4)] animate-pulse'
                    : 'bg-[#FFC400] hover:bg-[#ffcd1a] text-black'
                }`}
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Publishing Live...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4 text-black" />
                    <span>Publish to Live Website</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {incomingChatAlert && (
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400 text-xs text-white font-bold flex items-center justify-between gap-3 animate-bounce shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                <span>
                  <strong>⚡ Live Visitor Message:</strong> {incomingChatAlert.visitorName}: &ldquo;{incomingChatAlert.text}&rdquo;
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveMainSection('live-chat');
                  setIncomingChatAlert(null);
                }}
                className="px-3 py-1 rounded-xl bg-[#FFC400] text-black font-black text-[11px] uppercase tracking-wider hover:bg-[#ffd233] shrink-0 cursor-pointer"
              >
                Open Chat Inbox →
              </button>
            </div>
          )}

          {publishFeedback && (
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-[#FFC400]/40 text-xs text-white font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-[#FFC400]" />
              <span>{publishFeedback}</span>
            </div>
          )}
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
              id: 'live-chat',
              label: 'Visitor AI Chat & Live Desk',
              icon: MessageSquare,
              desc: 'Real-time visitor messages, quick replies & live 2-way desk',
              badge: unreadChatCount > 0 ? `${unreadChatCount} NEW` : undefined,
            },
            {
              id: 'chatbot',
              label: 'AI Email Copilot & Gmail',
              icon: Sparkles,
              desc: 'AI email drafting assistant & connected Gmail',
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
                className={`flex-1 min-w-[200px] flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left cursor-pointer relative ${
                  isActive
                    ? 'bg-[#FFC400] text-black shadow-lg'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 relative ${
                    isActive ? 'bg-black text-[#FFC400]' : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.badge && !isActive && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0c0c0e] animate-pulse" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <span
                      className={`text-xs font-black uppercase tracking-wider truncate ${
                        isActive ? 'text-black' : 'text-white'
                      }`}
                    >
                      {tab.label}
                    </span>
                    {tab.badge && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-black uppercase tracking-tight shrink-0 ${
                          isActive
                            ? 'bg-black text-white'
                            : 'bg-red-500 text-white animate-pulse'
                        }`}
                      >
                        {tab.badge} NEW
                      </span>
                    )}
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
          {activeMainSection === 'live-chat' && (
            <LiveVisitorChatInbox onComposeTo={handleDirectCompose} />
          )}
          {activeMainSection === 'chatbot' && (
            <EmailChatbotWorkspace
              onOpenLiveChat={() => setActiveMainSection('live-chat')}
              unreadChatCount={unreadChatCount}
            />
          )}
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
