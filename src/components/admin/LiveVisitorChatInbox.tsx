import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  User,
  Bot,
  Shield,
  Trash2,
  Archive,
  RefreshCw,
  Volume2,
  VolumeX,
  ExternalLink,
  Sparkles,
  AlertCircle,
  FileDown,
  Mail,
  Zap,
  Phone,
  Globe,
  Monitor
} from 'lucide-react';
import { ChatConversation, ChatMessageItem } from '../../types/chat';

interface LiveVisitorChatInboxProps {
  onComposeTo?: (email: string, name: string) => void;
}

export const LiveVisitorChatInbox: React.FC<LiveVisitorChatInboxProps> = ({ onComposeTo }) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'active' | 'archived'>('all');
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastNotification, setLastNotification] = useState<{ title: string; text: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play audio chime for incoming messages using Web Audio API
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioContextRef.current = new AudioContextClass();
        }
      }
      const ctx = audioContextRef.current;
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch (e) {
      console.warn('Audio chime playback omitted:', e);
    }
  };

  // Fetch all chat conversations from server with optional silent background mode
  const fetchConversations = async (isBackground = false) => {
    if (!isBackground && conversations.length === 0) {
      setIsLoading(true);
    }
    try {
      const res = await fetch(`/api/chatbot/conversations?_t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.conversations)) {
          setConversations((prev) => {
            // Check if there are real changes to avoid unnecessary re-renders
            if (
              prev.length === data.conversations.length &&
              JSON.stringify(prev) === JSON.stringify(data.conversations)
            ) {
              return prev;
            }
            return data.conversations;
          });

          // Default select first conversation if none selected
          setSelectedConvId((currentSelected) => {
            if (!currentSelected && data.conversations.length > 0) {
              return data.conversations[0].id;
            }
            // If currently selected no longer exists, fallback to first
            if (
              currentSelected &&
              !data.conversations.some((c: ChatConversation) => c.id === currentSelected) &&
              data.conversations.length > 0
            ) {
              return data.conversations[0].id;
            }
            return currentSelected;
          });
        }
      }
    } catch (err) {
      console.warn('Error fetching chat conversations:', err);
    } finally {
      if (!isBackground) {
        setIsLoading(false);
      }
    }
  };

  // Initial load and continuous 3-second background polling fallback
  useEffect(() => {
    fetchConversations(false);
    const interval = setInterval(() => {
      fetchConversations(true);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Listen to real-time Server-Sent Events (SSE) with auto-reconnection
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: any = null;
    let isMounted = true;

    const connect = () => {
      if (!isMounted) return;
      try {
        eventSource = new EventSource('/api/site/events');

        eventSource.onmessage = (event) => {
          try {
            const packet = JSON.parse(event.data);

            if (packet.type === 'chatbot_conversation_update') {
              const updatedConv: ChatConversation = packet.conversation;
              const newMsg: ChatMessageItem = packet.newMessage;

              setConversations((prev) => {
                const idx = prev.findIndex((c) => c.id === updatedConv.id);
                if (idx >= 0) {
                  const next = [...prev];
                  next[idx] = updatedConv;
                  return next;
                } else {
                  return [updatedConv, ...prev];
                }
              });

              // If user message, play chime and trigger visual toast
              if (newMsg?.role === 'user') {
                playChime();
                setLastNotification({
                  title: `New Message from ${updatedConv.visitorName}`,
                  text: newMsg.content.slice(0, 80),
                });
                setTimeout(() => setLastNotification(null), 6000);
              }
            } else if (packet.type === 'chatbot_admin_reply') {
              const updatedConv: ChatConversation = packet.conversation;
              setConversations((prev) => {
                const idx = prev.findIndex((c) => c.id === updatedConv.id);
                if (idx >= 0) {
                  const next = [...prev];
                  next[idx] = updatedConv;
                  return next;
                }
                return [updatedConv, ...prev];
              });
            } else if (packet.type === 'chatbot_unread_update') {
              if (packet.conversationId) {
                setConversations((prev) =>
                  prev.map((c) =>
                    c.id === packet.conversationId ? { ...c, unreadForAdmin: 0 } : c
                  )
                );
              }
            } else if (packet.type === 'chatbot_conversations_refresh') {
              fetchConversations(true);
            }
          } catch (e) {
            console.warn('Error parsing SSE packet:', e);
          }
        };

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          if (isMounted) {
            clearTimeout(reconnectTimeout);
            reconnectTimeout = setTimeout(connect, 4000);
          }
        };
      } catch (e) {
        console.warn('SSE connection error in Chat Inbox:', e);
      }
    };

    connect();

    return () => {
      isMounted = false;
      if (eventSource) eventSource.close();
      clearTimeout(reconnectTimeout);
    };
  }, [soundEnabled]);

  // Scroll to bottom of active conversation messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConvId, conversations]);

  const selectedConversation = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  // Mark conversation as read
  const handleMarkAsRead = async (convId: string) => {
    try {
      await fetch('/api/chatbot/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: convId }),
      });
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, unreadForAdmin: 0 } : c))
      );
    } catch (e) {
      console.warn('Failed to mark read:', e);
    }
  };

  // When admin selects a conversation with unread messages, automatically mark as read
  const handleSelectConversation = (conv: ChatConversation) => {
    setSelectedConvId(conv.id);
    if (conv.unreadForAdmin > 0) {
      handleMarkAsRead(conv.id);
    }
  };

  // Send Live Administrator Reply to Visitor
  const handleSendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !selectedConversation || isSendingReply) return;

    const messageContent = replyText.trim();
    setIsSendingReply(true);

    try {
      const res = await fetch('/api/chatbot/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          replyText: messageContent,
          adminName: 'Graphics Punching Support Desk',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.conversation) {
          setConversations((prev) =>
            prev.map((c) => (c.id === data.conversation.id ? data.conversation : c))
          );
        }
        setReplyText('');
      } else {
        alert('Could not dispatch message to visitor. Please verify your connection.');
      }
    } catch (err) {
      console.error('Error sending admin reply:', err);
    } finally {
      setIsSendingReply(false);
    }
  };

  // Archive / Clear conversation
  const handleArchive = async (convId: string, action: 'archive' | 'delete' = 'archive') => {
    try {
      await fetch('/api/chatbot/clear-or-archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: convId, action }),
      });
      if (action === 'delete') {
        setConversations((prev) => prev.filter((c) => c.id !== convId));
        if (selectedConvId === convId) {
          setSelectedConvId(conversations.find((c) => c.id !== convId)?.id || null);
        }
      } else {
        setConversations((prev) =>
          prev.map((c) => (c.id === convId ? { ...c, status: 'archived' } : c))
        );
      }
    } catch (err) {
      console.error('Error archiving conversation:', err);
    }
  };

  // Export full transcript as text file
  const handleExportTranscript = (conv: ChatConversation) => {
    const lines: string[] = [
      `======================================================================`,
      `GRAPHICS PUNCHING • CHATBOT VISITOR TRANSCRIPT`,
      `======================================================================`,
      `CONVERSATION ID: ${conv.id}`,
      `VISITOR: ${conv.visitorName}`,
      `STARTED: ${new Date(conv.startedAt).toLocaleString()}`,
      `LAST UPDATE: ${new Date(conv.lastUpdatedAt).toLocaleString()}`,
      `STATUS: ${conv.status.toUpperCase()}`,
      `PAGE URL: ${conv.sessionInfo?.url || 'N/A'}`,
      `PLATFORM: ${conv.sessionInfo?.platform || 'N/A'}`,
      `======================================================================`,
      ``,
      ...conv.messages.map((m, i) => {
        const speaker =
          m.role === 'admin'
            ? `[ADMIN - ${m.senderName || 'Support'}]`
            : m.role === 'assistant'
            ? `[PUNCHY AI ASSISTANT]`
            : `[VISITOR - ${conv.visitorName}]`;
        const time = m.timestamp ? ` (${m.timestamp})` : '';
        const tag = m.type && m.type !== 'user_message' ? ` <Type: ${m.type}>` : '';
        return `${i + 1}. ${speaker}${time}${tag}:\n${m.content}\n`;
      }),
      `======================================================================`,
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-transcript-${conv.visitorName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (filterType === 'unread' && c.unreadForAdmin === 0) return false;
    if (filterType === 'active' && c.status !== 'active') return false;
    if (filterType === 'archived' && c.status !== 'archived') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inName = c.visitorName?.toLowerCase().includes(q);
      const inId = c.id.toLowerCase().includes(q);
      const inLastMsg = c.lastMessage?.toLowerCase().includes(q);
      const inMsgs = c.messages?.some((m) => m.content.toLowerCase().includes(q));
      return inName || inId || inLastMsg || inMsgs;
    }
    return true;
  });

  const totalUnreadCount = conversations.reduce((acc, c) => acc + (c.unreadForAdmin || 0), 0);
  const activeConversationsCount = conversations.filter((c) => c.status === 'active').length;

  const quickCannedReplies = [
    '⚡ Standard turnaround is 12-24 hours. Rush 4-8 hours available upon request.',
    '💲 Our digitizing flat rate is $15 for Left Chest / Cap / Beanie, with free revisions.',
    '📐 Vector redraw flat rate: $10 simple, $15 medium, $25-$35 complex in AI/EPS/PDF.',
    '🧵 We deliver production-tested Tajima (.DST), Brother (.PES), and Wilcom (.EMB) files with color sheets.',
    '📧 Please email your artwork file to graphicspunching264@gmail.com and we will evaluate it immediately.',
  ];

  return (
    <div className="space-y-6">
      {/* Real-time Notification Banner (if any) */}
      {lastNotification && (
        <div className="bg-[#FFC400] text-black px-4 py-3 rounded-2xl flex items-center justify-between shadow-xl animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black text-[#FFC400] flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider">{lastNotification.title}</p>
              <p className="text-xs font-medium opacity-90 truncate max-w-xl">{lastNotification.text}</p>
            </div>
          </div>
          <button
            onClick={() => setLastNotification(null)}
            className="text-xs font-bold uppercase tracking-wider bg-black/10 hover:bg-black/20 px-3 py-1.5 rounded-lg cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Unread Inquiries</span>
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                totalUnreadCount > 0 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2 font-display">{totalUnreadCount}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            {totalUnreadCount > 0 ? 'Requires administrator attention' : 'All inquiries reviewed'}
          </p>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Conversations</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-2 font-display">{activeConversationsCount}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Live visitor chat threads</p>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Recorded</span>
            <div className="w-7 h-7 rounded-lg bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2 font-display">{conversations.length}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Synchronized to server storage</p>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Real-Time Sync</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-sm font-black text-white mt-2 flex items-center gap-1.5 font-display">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SSE Stream Active</span>
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Live push to Admin Portal</p>
        </div>
      </div>

      {/* Main Inbox Layout */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Top Control Bar */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFC400] text-black flex items-center justify-center font-black">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-wider font-display flex items-center gap-2">
                <span>Live Visitor Chat Inbox</span>
                {totalUnreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                    {totalUnreadCount} NEW
                  </span>
                )}
              </h2>
              <p className="text-xs text-zinc-400">
                Monitor and live-reply to every customer browsing your website in real time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Chime sound enabled' : 'Chime sound muted'}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-zinc-800 border-zinc-700 text-[#FFC400]'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-500'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden md:inline">{soundEnabled ? 'Chime On' : 'Chime Muted'}</span>
            </button>

            <button
              onClick={fetchConversations}
              className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden md:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* 2-Column Interface: Sidebar + Transcript */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          {/* Left Column: Conversation Directory */}
          <div className="lg:col-span-4 border-r border-zinc-800 flex flex-col bg-zinc-950/60">
            {/* Search and Filters */}
            <div className="p-3 border-b border-zinc-800 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search visitor, inquiry, text..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFC400]"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'unread', label: `Unread (${totalUnreadCount})` },
                  { id: 'active', label: 'Active' },
                  { id: 'archived', label: 'Archived' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterType(tab.id as any)}
                    className={`px-2.5 py-1 rounded-lg font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                      filterType === tab.id
                        ? 'bg-[#FFC400] text-black'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/60 max-h-[560px]">
              {isLoading ? (
                <div className="p-8 text-center text-zinc-500 text-xs">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#FFC400]" />
                  Loading live conversations...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs space-y-2">
                  <MessageSquare className="w-8 h-8 mx-auto text-zinc-600" />
                  <p className="font-bold text-zinc-400">No conversations found</p>
                  <p className="text-[11px] text-zinc-500">
                    Visitor interactions with the AI chatbot will appear here in real time.
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = selectedConversation?.id === conv.id;
                  const hasUnread = conv.unreadForAdmin > 0;
                  const formattedTime = new Date(conv.lastUpdatedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      className={`w-full p-3.5 text-left transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-800/90 border-l-4 border-[#FFC400]'
                          : hasUnread
                          ? 'bg-zinc-900/90 hover:bg-zinc-850'
                          : 'hover:bg-zinc-900/40'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            hasUnread
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                              : isSelected
                              ? 'bg-[#FFC400] text-black'
                              : 'bg-zinc-800 text-zinc-300'
                          }`}
                        >
                          <User className="w-4 h-4" />
                        </div>
                        {conv.status === 'active' && (
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-zinc-950 absolute -bottom-0.5 -right-0.5" />
                        )}
                      </div>

                      {/* Content Summary */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span
                            className={`text-xs font-bold truncate ${
                              hasUnread ? 'text-white font-black' : isSelected ? 'text-[#FFC400]' : 'text-zinc-300'
                            }`}
                          >
                            {conv.visitorName}
                          </span>
                          <span className="text-[10px] text-zinc-500 shrink-0">{formattedTime}</span>
                        </div>

                        {/* Event type chip */}
                        {conv.lastEventType && conv.lastEventType !== 'user_message' && (
                          <span className="inline-block px-1.5 py-0.5 mb-1 rounded text-[9px] font-black uppercase tracking-wider bg-[#FFC400]/10 text-[#FFC400] border border-[#FFC400]/20 truncate max-w-[180px]">
                            {conv.lastEventType.replace('_', ' ')}
                          </span>
                        )}

                        <p
                          className={`text-xs truncate ${
                            hasUnread ? 'text-zinc-200 font-medium' : 'text-zinc-500'
                          }`}
                        >
                          {conv.lastMessage || '(Empty inquiry)'}
                        </p>
                      </div>

                      {/* Unread badge pill */}
                      {hasUnread && (
                        <span className="shrink-0 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                          {conv.unreadForAdmin}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Live Transcript & Reply Desk */}
          <div className="lg:col-span-8 flex flex-col bg-zinc-950/90">
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 bg-zinc-900/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 text-[#FFC400] flex items-center justify-center font-bold">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-white font-display">
                          {selectedConversation.visitorName}
                        </h3>
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                            selectedConversation.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {selectedConversation.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-0.5">
                        <span className="flex items-center gap-1 font-mono text-[10px]">
                          ID: {selectedConversation.id}
                        </span>
                        <span>•</span>
                        <span>
                          Started: {new Date(selectedConversation.startedAt).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Header */}
                  <div className="flex items-center gap-2">
                    {onComposeTo && (
                      <button
                        onClick={() =>
                          onComposeTo(
                            selectedConversation.visitorEmail || 'customer@inquiry.com',
                            selectedConversation.visitorName
                          )
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Draft email in Gmail Dispatch Workspace"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#FFC400]" />
                        <span className="hidden sm:inline">Draft Email</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleExportTranscript(selectedConversation)}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Download full transcript"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Transcript</span>
                    </button>

                    <button
                      onClick={() => handleArchive(selectedConversation.id, 'archive')}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
                      title="Archive conversation"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('Delete this conversation record?')) {
                          handleArchive(selectedConversation.id, 'delete');
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 text-xs font-bold transition-all cursor-pointer"
                      title="Delete conversation permanently"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Session Context Bar */}
                {selectedConversation.sessionInfo && (
                  <div className="px-4 py-2 bg-zinc-900/40 border-b border-zinc-800/80 flex flex-wrap items-center gap-4 text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#FFC400]" />
                      <span className="text-zinc-500">Page:</span>
                      <span className="text-zinc-300 font-mono truncate max-w-xs">
                        {selectedConversation.sessionInfo.url || 'Website'}
                      </span>
                    </span>
                    {selectedConversation.sessionInfo.platform && (
                      <span className="flex items-center gap-1.5">
                        <Monitor className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-zinc-500">Platform:</span>
                        <span className="text-zinc-300">{selectedConversation.sessionInfo.platform}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Live Message Stream */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-h-[460px]">
                  {(selectedConversation.messages || []).map((msg, idx) => {
                    const isUser = msg.role === 'user';
                    const isAssistant = msg.role === 'assistant';
                    const isAdmin = msg.role === 'admin';

                    return (
                      <div
                        key={msg.id || idx}
                        className={`flex gap-3 ${isUser ? 'justify-start' : isAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        {/* Avatar */}
                        {!isAdmin && (
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                              isUser ? 'bg-zinc-800 text-zinc-200' : 'bg-[#FFC400] text-black'
                            }`}
                          >
                            {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </div>
                        )}

                        {/* Message bubble */}
                        <div
                          className={`max-w-xl rounded-2xl p-4 space-y-1.5 shadow-md ${
                            isUser
                              ? 'bg-zinc-900 border border-zinc-800 text-zinc-200'
                              : isAdmin
                              ? 'bg-[#FFC400] text-black border border-[#FFC400]/40'
                              : 'bg-zinc-850 border border-zinc-700/80 text-zinc-100'
                          }`}
                        >
                          {/* Sender & Timestamp */}
                          <div className="flex items-center justify-between gap-3 text-[11px]">
                            <span
                              className={`font-black uppercase tracking-wider ${
                                isUser ? 'text-[#FFC400]' : isAdmin ? 'text-black' : 'text-emerald-400'
                              }`}
                            >
                              {isUser
                                ? selectedConversation.visitorName
                                : isAdmin
                                ? `🛡️ ${msg.senderName || 'Administrator (You)'}`
                                : '🤖 Punchy AI (Virtual Assistant)'}
                            </span>
                            <span
                              className={`font-mono text-[10px] ${
                                isAdmin ? 'text-black/70' : 'text-zinc-500'
                              }`}
                            >
                              {msg.timestamp || ''}
                            </span>
                          </div>

                          {/* Action / Inquiry Type Tag */}
                          {msg.type && msg.type !== 'user_message' && (
                            <div
                              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md inline-block ${
                                isAdmin
                                  ? 'bg-black/10 text-black'
                                  : 'bg-[#FFC400]/10 text-[#FFC400] border border-[#FFC400]/20'
                              }`}
                            >
                              ⚡ {msg.type.replace('_', ' ')}
                            </div>
                          )}

                          {/* Message Body */}
                          <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed font-normal">
                            {msg.content}
                          </p>

                          {/* Suggested Action Pill (if present) */}
                          {msg.suggestedAction && (
                            <div className="pt-1.5">
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg bg-black/20 text-black">
                                <Sparkles className="w-3.5 h-3.5" />
                                {msg.suggestedAction.label}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Admin Avatar */}
                        {isAdmin && (
                          <div className="w-8 h-8 rounded-xl bg-[#FFC400] text-black flex items-center justify-center shrink-0 font-bold">
                            <Shield className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Canned Responses */}
                <div className="p-3 bg-zinc-900/80 border-t border-zinc-800">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFC400]" />
                    <span>Quick Response Templates (Click to insert):</span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {quickCannedReplies.map((reply, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setReplyText((prev) => (prev ? `${prev} ${reply}` : reply))}
                        className="text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg border border-zinc-700/80 whitespace-nowrap transition-all cursor-pointer truncate max-w-xs"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Administrator Reply Composer */}
                <form onSubmit={handleSendReply} className="p-4 bg-zinc-950 border-t border-zinc-800">
                  <div className="flex items-end gap-3">
                    <div className="flex-1 relative">
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendReply();
                          }
                        }}
                        placeholder="Type a live reply to this visitor (Press Enter to send)..."
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFC400] resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!replyText.trim() || isSendingReply}
                      className="px-5 py-3 rounded-2xl bg-[#FFC400] hover:bg-[#ffcd1a] disabled:opacity-40 disabled:hover:bg-[#FFC400] text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0"
                    >
                      {isSendingReply ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Live</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-2">
                    ⚡ Live Reply: Sent immediately to the visitor's screen via SSE.
                  </p>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-zinc-500">
                <MessageSquare className="w-12 h-12 text-zinc-700 mb-3" />
                <h3 className="text-sm font-bold text-zinc-300">Select a Conversation</h3>
                <p className="text-xs text-zinc-500 max-w-sm mt-1">
                  Choose a visitor thread from the sidebar to inspect their inquiries and reply in real time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
