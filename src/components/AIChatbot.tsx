import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  Minimize2,
  Maximize2,
  RefreshCw,
  ArrowRight,
  Shield,
  Phone,
  Clock,
  CheckCircle2,
  FileCode2,
  Layers,
  ChevronDown,
  Mail,
  Check
} from 'lucide-react';
import { useAdminSettings } from '../context/AdminSettingsContext';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  suggestedAction?: {
    type: string;
    label: string;
    url?: string;
  };
}

interface AIChatbotProps {
  onOpenQuoteModal?: (serviceId?: string, tierId?: string, itemTitle?: string) => void;
  onNavigate?: (page: string) => void;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ onOpenQuoteModal, onNavigate }) => {
  const { settings, addEmailLog } = useAdminSettings();
  const chatbotConfig = settings.chatbot;

  // Don't render anything if the chatbot is disabled in Management Portal
  if (!chatbotConfig || chatbotConfig.enabled === false) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notificationToast, setNotificationToast] = useState<{ show: boolean; text: string } | null>(null);

  const [conversationId] = useState<string>(() => {
    try {
      let cid = sessionStorage.getItem('gp_chat_conv_id');
      if (!cid) {
        cid = `conv-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
        sessionStorage.setItem('gp_chat_conv_id', cid);
      }
      return cid;
    } catch {
      return `conv-${Date.now()}`;
    }
  });

  const [visitorId] = useState<string>(() => {
    try {
      let vid = localStorage.getItem('gp_visitor_id');
      if (!vid) {
        vid = `visitor-${Math.random().toString(36).substring(2, 8)}`;
        localStorage.setItem('gp_visitor_id', vid);
      }
      return vid;
    } catch {
      return `visitor-${Date.now().toString(36)}`;
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content:
          chatbotConfig.welcomeMessage ||
          'Hi there! 👋 Welcome to Graphics Punching. How can I help with your embroidery digitizing, vector redraw, custom patches, or screen printing project today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Real-time SSE listener for live replies sent by the Administrator from the Portal
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/site/events');
      eventSource.onmessage = (event) => {
        try {
          const packet = JSON.parse(event.data);
          if (
            packet.type === 'chatbot_admin_reply' &&
            packet.conversationId === conversationId &&
            packet.adminMessage
          ) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === packet.adminMessage.id)) return prev;
              return [
                ...prev,
                {
                  id: packet.adminMessage.id,
                  role: 'assistant',
                  content: `🛡️ **Administrator**: ${packet.adminMessage.content}`,
                  timestamp:
                    packet.adminMessage.timestamp ||
                    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ];
            });
            setHasUnread(true);
          }
        } catch {
          // Ignore non-JSON packet
        }
      };
    } catch (e) {
      console.warn('SSE client error in chatbot:', e);
    }
    return () => {
      if (eventSource) eventSource.close();
    };
  }, [conversationId]);

  // Helper to automatically notify administrator via email on chatbot interactions
  const notifyAdminOfInteraction = async ({
    selectedInquiry,
    eventType = 'user_message',
    actionDetails,
    conversationSnapshot,
  }: {
    selectedInquiry: string;
    eventType: 'quick_reply' | 'user_message' | 'quick_action' | 'message_click';
    actionDetails?: any;
    conversationSnapshot?: ChatMessage[];
  }) => {
    // If explicitly disabled in admin settings, do not notify
    if (chatbotConfig?.notifyAdminOnInquiry === false) {
      return;
    }

    const now = new Date();
    const formattedDateTime = now.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });

    const activeConversation = conversationSnapshot || messages;
    const rawTarget =
      chatbotConfig?.adminNotificationEmail ||
      settings.emailSettings?.notificationEmail ||
      'graphicspunching264@gmail.com';
    const adminTarget = rawTarget
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s && !s.toLowerCase().includes('hassangraphicpunch'))
      .join(', ') || 'graphicspunching264@gmail.com';

    const sessionInfo = {
      conversationId,
      visitorId,
      url: window.location.href,
      path: window.location.hash || window.location.pathname,
      platform: typeof navigator !== 'undefined' ? navigator.platform : 'Web',
      viewport: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Desktop',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    };

    // Show temporary feedback toast in chatbot header/banner
    const firstRecipient = adminTarget.split(/[,;]+/)[0].trim();
    setNotificationToast({
      show: true,
      text: `Alert emailed to admin (${firstRecipient})`,
    });
    setTimeout(() => {
      setNotificationToast(null);
    }, 4500);

    try {
      // 1. Dispatch to server endpoint /api/chatbot/notify-admin
      fetch('/api/chatbot/notify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedInquiry,
          eventType,
          timestamp: formattedDateTime,
          conversation: activeConversation.map((m) => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp,
          })),
          adminEmail: adminTarget,
          actionDetails,
          sessionInfo,
        }),
      }).catch((err) => console.warn('Background admin email notification failed:', err));

      // 2. Also register in local dispatch history in AdminSettingsContext
      if (addEmailLog) {
        addEmailLog({
          to: adminTarget,
          recipientName: 'Administrator',
          from: settings.emailSettings?.connectedEmail || 'graphicspunching264@gmail.com',
          replyTo: settings.contact?.email || 'graphicspunching264@gmail.com',
          subject: `[Chatbot Inquiry] ${selectedInquiry.slice(0, 60)}`,
          body: `EVENT TYPE: ${eventType.toUpperCase()}\nSELECTED INQUIRY / ACTION: "${selectedInquiry}"\nDATE & TIME: ${formattedDateTime}\n\nCONVERSATION DETAILS (${activeConversation.length} messages):\n${activeConversation
            .map((m) => `[${m.timestamp}] ${m.role.toUpperCase()}: ${m.content}`)
            .join('\n')}`,
          attachments: [],
          status: 'delivered',
        });
      }
    } catch (err) {
      console.warn('Error recording admin email notification:', err);
    }
  };

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Handle auto-open if configured in settings
  useEffect(() => {
    if (chatbotConfig.autoOpenDelaySeconds > 0 && !isOpen) {
      const timer = setTimeout(() => {
        const hasOpened = sessionStorage.getItem('gp_chatbot_opened');
        if (!hasOpened) {
          setIsOpen(true);
          setShowTooltip(false);
          sessionStorage.setItem('gp_chatbot_opened', 'true');
        }
      }, chatbotConfig.autoOpenDelaySeconds * 1000);
      return () => clearTimeout(timer);
    }
  }, [chatbotConfig.autoOpenDelaySeconds, isOpen]);

  // Dismiss tooltip after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async (
    textToSend?: string,
    sourceType: 'user_message' | 'quick_reply' = 'user_message'
  ) => {
    const text = (textToSend !== undefined ? textToSend : inputMessage).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    // 1. Immediately persist visitor message to server real-time chat store
    try {
      fetch('/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          visitorId,
          visitorName: `Visitor #${visitorId.slice(-4).toUpperCase()}`,
          message: text,
          role: 'user',
          type: sourceType,
          sessionInfo: {
            conversationId,
            visitorId,
            url: window.location.href,
            platform: typeof navigator !== 'undefined' ? navigator.platform : 'Web',
          },
        }),
      }).catch((e) => console.warn('Chat message server sync warning:', e));
    } catch (postErr) {
      console.warn('Could not post chat message:', postErr);
    }

    // 2. Automatically send notification email to administrator
    notifyAdminOfInteraction({
      selectedInquiry: text,
      eventType: sourceType,
      conversationSnapshot: newMessages,
    });

    try {
      // Build request payload for backend endpoint
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          settings: {
            botName: chatbotConfig.botName,
            botRole: chatbotConfig.botRole,
            tone: chatbotConfig.tone,
            customKnowledge: chatbotConfig.customKnowledge,
            supportEmail: chatbotConfig.supportEmail || settings.contact.email,
            supportPhone: chatbotConfig.supportPhone || settings.contact.phone,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.reply || "I'm here to help with your vector and digitizing requirements. Would you like to get a quote or speak with our team?";

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: data.suggestedAction,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Record assistant answer on server
      fetch('/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          visitorId,
          message: replyText,
          role: 'assistant',
          type: 'assistant_reply',
          suggestedAction: data.suggestedAction,
        }),
      }).catch(() => {});
    } catch (err) {
      console.warn('Chat request failed, using intelligent client response:', err);
      // Client-side fallback if network or endpoint fails
      const fallbackReply = generateClientFallback(text, chatbotConfig);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: fallbackReply.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedAction: fallbackReply.suggestedAction,
        },
      ]);

      // Record fallback answer on server
      fetch('/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          visitorId,
          message: fallbackReply.content,
          role: 'assistant',
          type: 'assistant_reply',
          suggestedAction: fallbackReply.suggestedAction,
        }),
      }).catch(() => {});
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPromptClick = (prompt: string) => {
    handleSendMessage(prompt, 'quick_reply');
  };

  const handleMessageClick = (msg: ChatMessage) => {
    const text = `[Topic Inquiry] "${msg.content.slice(0, 150)}" [${msg.role}]`;
    fetch('/api/chatbot/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId,
        visitorId,
        visitorName: `Visitor #${visitorId.slice(-4).toUpperCase()}`,
        message: text,
        role: 'user',
        type: 'message_click',
      }),
    }).catch(() => {});

    notifyAdminOfInteraction({
      selectedInquiry: text,
      eventType: 'message_click',
      conversationSnapshot: messages,
    });
  };

  const handleHeaderQuoteClick = () => {
    const text = '⚡ Requested Instant Quote via Header Shortcut';
    fetch('/api/chatbot/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId,
        visitorId,
        visitorName: `Visitor #${visitorId.slice(-4).toUpperCase()}`,
        message: text,
        role: 'user',
        type: 'quick_action',
      }),
    }).catch(() => {});

    notifyAdminOfInteraction({
      selectedInquiry: text,
      eventType: 'quick_action',
      actionDetails: { type: 'quote', source: 'header' },
      conversationSnapshot: messages,
    });
    if (onOpenQuoteModal) onOpenQuoteModal('vector-artwork', 'simple-vector');
  };

  const generateClientFallback = (query: string, config: any): { content: string; suggestedAction?: any } => {
    const q = query.toLowerCase();
    if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('quote')) {
      return {
        content: `**Graphics Punching Flat-Rate Pricing**:
• **Vector Art Redraws**: Simple ($10) | Medium ($15) | Complex ($25-$35)
• **Embroidery Digitizing**: Left Chest/Cap ($15 flat) | Midsize ($25) | Jacket Back ($35-$50)
• **Screen Print Separations**: Spot Color ($15) | Simulated Process/CMYK ($25-$35)
• **Free Revisions** included on all orders!`,
        suggestedAction: { type: 'quote', label: '⚡ Request Instant Quote' },
      };
    }
    if (q.includes('format') || q.includes('dst') || q.includes('pes') || q.includes('vector')) {
      return {
        content: `We deliver all universal commercial production files:
• **Embroidery**: Tajima .DST, Brother .PES, Melco .EXP, Barudan .DSB, Wilcom .EMB + PDF Color Worksheet.
• **Vector Redraws**: Adobe Illustrator .AI, .EPS, .SVG, Print PDF, and 300 DPI Transparent PNG.`,
        suggestedAction: { type: 'quote', label: '📁 Submit Files' },
      };
    }
    if (q.includes('turnaround') || q.includes('rush') || q.includes('delivery') || q.includes('hours')) {
      return {
        content: `**Speed & Reliability**:
• **Standard Turnaround**: 12 to 24 Hours.
• **Rush Priority**: 4 to 8 Hours available on request.
• **Order Intake**: 24/7 digital desk active worldwide.`,
        suggestedAction: { type: 'quote', label: '🚀 Start Rush Order' },
      };
    }
    return {
      content: `Thank you for reaching out! At Graphics Punching, we provide manual vector conversions ($10-$15), machine-tested embroidery digitizing ($15 flat), custom patches, and screen printing separations.
Feel free to ask about our file formats, turnarounds, or request a quick estimate!`,
      suggestedAction: { type: 'quote', label: '⚡ Get Instant Quote' },
    };
  };

  const handleActionClick = (action: { type: string; label: string; url?: string }) => {
    // Notify administrator immediately of clicked quick action button
    notifyAdminOfInteraction({
      selectedInquiry: `Action Clicked: ${action.label} (${action.type})`,
      eventType: 'quick_action',
      actionDetails: action,
      conversationSnapshot: messages,
    });

    if (action.type === 'quote') {
      if (onOpenQuoteModal) {
        onOpenQuoteModal('vector-artwork', 'simple-vector');
      } else {
        window.location.hash = '#/contact';
      }
    } else if (action.type === 'navigate' && action.url) {
      if (onNavigate && action.url.startsWith('#/')) {
        const page = action.url.replace('#/', '');
        onNavigate(page);
      } else {
        window.location.hash = action.url;
      }
    } else if (action.type === 'contact') {
      if (onNavigate) {
        onNavigate('contact');
      } else {
        window.location.hash = '#/contact';
      }
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content:
          chatbotConfig.welcomeMessage ||
          'Hi there! 👋 How can I help with your embroidery digitizing, vector redraw, custom patches, or screen printing project today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const isBottomLeft = chatbotConfig.position === 'bottom-left';

  // Format message text with basic markdown (bold, bullet points, line breaks, links)
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Parse markdown bold and links
      const parts = line.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
      return (
        <div key={idx} className={line.trim() === '' ? 'h-2' : 'min-h-[1.2em]'}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-white">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
              const match = part.match(/\[(.*?)\]\((.*?)\)/);
              if (match) {
                return (
                  <a
                    key={pIdx}
                    href={match[2]}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#FFC400] underline font-semibold hover:text-[#ffcf33] break-all"
                  >
                    {match[1]}
                  </a>
                );
              }
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div
      id="gp-ai-chatbot-root"
      className={`fixed z-50 transition-all duration-300 font-sans ${
        isBottomLeft
          ? 'left-4 sm:left-6 bottom-4 sm:bottom-6'
          : 'right-4 sm:right-6 bottom-4 sm:bottom-6'
      }`}
    >
      {/* 1. FLOATING ACTION LAUNCH BUTTON (When Closed) */}
      {!isOpen && (
        <div className="relative flex items-center">
          {/* Tooltip / Teaser Bubble */}
          {showTooltip && (
            <div
              className={`absolute bottom-full mb-3 whitespace-nowrap bg-zinc-900/95 backdrop-blur border border-[#FFC400]/40 text-white text-xs px-3.5 py-2 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce cursor-pointer ${
                isBottomLeft ? 'left-0' : 'right-0'
              }`}
              onClick={() => {
                setIsOpen(true);
                setShowTooltip(false);
              }}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium">
                Need a fast <strong className="text-[#FFC400]">DST</strong> or{' '}
                <strong className="text-[#FFC400]">Vector</strong> quote?
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="text-zinc-400 hover:text-white p-0.5 rounded"
                aria-label="Dismiss message"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Main Floating Trigger Button */}
          <button
            type="button"
            id="gp-chatbot-launcher"
            onClick={() => {
              setIsOpen(true);
              setShowTooltip(false);
              setHasUnread(false);
            }}
            className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-zinc-950 border-2 border-[#FFC400] text-[#FFC400] shadow-[0_10px_30px_rgba(255,196,0,0.35)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer overflow-hidden"
            aria-label="Open AI Production Assistant"
          >
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FFC400]/20 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

            <div className="relative flex items-center justify-center">
              <Bot className="w-7 h-7 sm:w-8 sm:h-8 text-[#FFC400] transition-transform group-hover:rotate-6" />
              <Sparkles className="w-3.5 h-3.5 text-white absolute -top-1.5 -right-1.5 animate-pulse" />
            </div>

            {/* Active Online Indicator Ring */}
            <span className="absolute top-2 right-2 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-zinc-950" />
            </span>
          </button>
        </div>
      )}

      {/* 2. CHATBOT WINDOW (When Open) */}
      {isOpen && (
        <div
          id="gp-chatbot-window"
          className={`bg-zinc-950/98 backdrop-blur-xl border border-zinc-800 shadow-[0_20px_60px_rgba(0,0,0,0.85)] rounded-2xl sm:rounded-3xl flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized
              ? 'w-72 sm:w-80 h-16'
              : 'w-[calc(100vw-32px)] sm:w-[410px] md:w-[440px] h-[580px] max-h-[calc(100vh-100px)]'
          }`}
        >
          {/* A. HEADER */}
          <div className="px-4 py-3 bg-zinc-900/90 border-b border-zinc-800/80 flex items-center justify-between gap-2 select-none">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-[#FFC400]/40 flex items-center justify-center text-[#FFC400]">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-zinc-900 rounded-full" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black tracking-tight text-white truncate">
                    {chatbotConfig.botName || 'Punchy AI'}
                  </h3>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#FFC400]/20 text-[#FFC400] border border-[#FFC400]/30">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 truncate">
                  {chatbotConfig.botRole || 'Graphics Punching Virtual Assistant'}
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1">
              {chatbotConfig.enableInstantQuoteShortcut && !isMinimized && (
                <button
                  type="button"
                  onClick={handleHeaderQuoteClick}
                  className="hidden xs:flex items-center gap-1 text-[11px] font-bold bg-[#FFC400] text-black px-2.5 py-1 rounded-lg hover:bg-[#ffcf33] active:scale-95 transition-all shadow-sm cursor-pointer"
                  title="Request Instant Quote"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Quote</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                title="Restart conversation"
                aria-label="Restart chat"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
                aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                title="Close chat"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* B. BODY & MESSAGES (Hidden if Minimized) */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs sm:text-[13px] scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {/* Security and Trust Banner */}
                <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-2.5 flex items-center justify-between text-[11px] text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#FFC400]" />
                    <span>Tested Production Files • 12-24h Delivery</span>
                  </div>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    24/7 Active
                  </span>
                </div>

                {/* Instant Email Notification Banner (when interaction occurs) */}
                {notificationToast && (
                  <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] px-3 py-2 rounded-xl flex items-center justify-between shadow-sm animate-fadeIn">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 animate-pulse" />
                      <span className="font-medium truncate">{notificationToast.text}</span>
                    </div>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0 ml-2">
                      Notified
                    </span>
                  </div>
                )}

                {/* Message Stream */}
                {messages.map((msg) => {
                  const isAssistant = msg.role === 'assistant';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-end gap-2 max-w-[90%]">
                        {isAssistant && chatbotConfig.showAvatar && (
                          <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-[#FFC400]/40 flex items-center justify-center text-[#FFC400] flex-shrink-0 text-[10px]">
                            <Bot className="w-3.5 h-3.5" />
                          </div>
                        )}

                        <div
                          onClick={() => handleMessageClick(msg)}
                          title="Click to notify administrator about this inquiry topic"
                          className={`p-3.5 rounded-2xl leading-relaxed cursor-pointer transition-all hover:ring-1 hover:ring-[#FFC400]/50 ${
                            isAssistant
                              ? 'bg-zinc-900/90 text-zinc-200 border border-zinc-800 rounded-bl-sm shadow-md hover:bg-zinc-850'
                              : 'bg-[#FFC400] text-zinc-950 font-medium rounded-br-sm shadow-md hover:brightness-105'
                          }`}
                        >
                          {isAssistant ? (
                            <div className="space-y-1.5">{renderFormattedContent(msg.content)}</div>
                          ) : (
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                          )}

                          {/* Action Button inside Assistant Message */}
                          {isAssistant && msg.suggestedAction && (
                            <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleActionClick(msg.suggestedAction!);
                                }}
                                className="inline-flex items-center gap-1.5 text-xs font-black bg-[#FFC400] text-black px-3 py-1.5 rounded-lg hover:bg-[#ffcf33] active:scale-95 transition-all shadow-sm cursor-pointer"
                              >
                                <span>{msg.suggestedAction.label}</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <span className="text-[9px] text-zinc-500 mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}

                {/* Loading / Typing State */}
                {isLoading && (
                  <div className="flex items-center gap-2 text-zinc-400 text-xs">
                    <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-[#FFC400]/40 flex items-center justify-center text-[#FFC400] flex-shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-bl-sm px-4 py-2.5 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FFC400] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FFC400] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FFC400] animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="text-[11px] text-zinc-400 ml-1.5 font-medium">Thinking...</span>
                    </div>
                  </div>
                )}

                {/* Quick Prompts (Display below welcome message if user hasn't asked yet) */}
                {messages.length === 1 && chatbotConfig.quickPrompts && chatbotConfig.quickPrompts.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#FFC400]" />
                      <span>Popular Inquiries:</span>
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {chatbotConfig.quickPrompts.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleQuickPromptClick(prompt)}
                          className="text-left text-xs bg-zinc-900/80 hover:bg-zinc-800/90 text-zinc-300 hover:text-white border border-zinc-800 hover:border-[#FFC400]/40 rounded-xl px-3 py-2 transition-all flex items-center justify-between group cursor-pointer"
                        >
                          <span className="line-clamp-1">{prompt}</span>
                          <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:text-[#FFC400] group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* C. FOOTER & INPUT BAR */}
              <div className="p-3 bg-zinc-900/95 border-t border-zinc-800/80">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-end gap-2"
                >
                  <div className="flex-1 bg-zinc-950 border border-zinc-800 focus-within:border-[#FFC400]/70 rounded-xl px-3 py-2 transition-colors flex items-center">
                    <textarea
                      ref={textareaRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder={
                        chatbotConfig.placeholderText ||
                        'Ask about pricing, turnarounds, DST/PES files...'
                      }
                      rows={1}
                      className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-zinc-500 resize-none focus:outline-none max-h-24 leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="w-10 h-10 rounded-xl bg-[#FFC400] text-black flex items-center justify-center font-bold hover:bg-[#ffcf33] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0 shadow-md cursor-pointer"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* Bottom Disclaimer */}
                <div className="mt-2 text-center">
                  <p className="text-[10px] text-zinc-500">
                    Graphics Punching Digital Studio • Tajima DST, PES & Vector specialists
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
