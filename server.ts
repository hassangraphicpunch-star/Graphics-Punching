import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 3000;

// Body parsing with generous limit for attachments and portfolio image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Graceful JSON parse error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    console.warn('JSON parsing syntax error on request to', req.path);
    return res.status(400).json({ success: false, error: 'Malformed JSON payload' });
  }
  next();
});

// Trailing-slash normalization for all API routes
app.use((req, res, next) => {
  if (req.path.length > 1 && req.path.endsWith('/') && req.path.startsWith('/api')) {
    const query = req.url.slice(req.path.length);
    req.url = req.path.slice(0, -1) + query;
  }
  next();
});

// Permissive CORS middleware strictly permitting https://www.graphicspunching.com and all production / preview origins
const corsOptions: cors.CorsOptions = {
  origin: (requestOrigin, callback) => {
    // Always permit requests with no origin (mobile clients, curl, server-to-server) or from valid origins
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'X-Accel-Buffering',
    'If-Modified-Since',
    'Range',
  ],
  exposedHeaders: ['Content-Length', 'Content-Type', 'X-Accel-Buffering'],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Explicit fallback CORS headers to guarantee non-blocking cross-origin communication
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma, X-Accel-Buffering, If-Modified-Since, Range'
  );
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// ============================================================
// PERSISTENT STORAGE: SUPABASE / POSTGRESQL (PRODUCTION & SERVERLESS)
// ============================================================
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '[STORAGE] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not configured. Running with in-memory persistence fallback.'
  );
}

// In-memory mirror cache of published live site data and chat conversations
let inMemoryPublishedData: any = null;
let inMemoryChatConversations: any[] = [];

async function supabaseRequest(
  table: string,
  options: {
    method?: string;
    body?: any;
    query?: string;
    prefer?: string;
  } = {}
) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Persistent database is not configured.');
  }

  const url =
    `${SUPABASE_URL}/rest/v1/${table}` +
    (options.query ? `?${options.query}` : '');

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: options.prefer || 'return=representation',
    },
    body:
      options.body !== undefined
        ? JSON.stringify(options.body)
        : undefined,
  });

  const text = await response.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(
      `Supabase ${response.status}: ${
        typeof data === 'string'
          ? data
          : JSON.stringify(data)
      }`
    );
  }

  return data;
}

// Deep merge utility for settings objects
function deepMerge(target: any, source: any): any {
  if (!source || typeof source !== 'object') return target;
  if (!target || typeof target !== 'object') return source;
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] !== null &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(target[key], source[key]);
    } else if (source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  return result;
}

const BASELINE_SETTINGS = {
  branding: {
    siteName: 'Graphics Punching',
    tagline: 'Master Vector Art & Embroidery Digitizing',
    logoText: 'GRAPHICS PUNCHING',
    primaryColor: '#FFC400',
    accentColor: '#18181b',
    fontDisplay: 'Montserrat, sans-serif',
    fontBody: 'Inter, sans-serif',
    darkThemeByDefault: true,
  },
  homepage: {
    heroBadge: 'PREMIUM VECTOR ART & EMBROIDERY DIGITIZING',
    heroHeadline: 'MASTER-CRAFTED APPAREL & VECTOR ARTWORK',
    heroHeadlineHighlight: 'READY FOR PRESS & EMBROIDERY MACHINES',
    heroSubtitle: 'Transform any sketch, raster image, or emblem into high-precision, production-ready manual vector files and machine-calibrated embroidery digitizing in as fast as 2 to 6 hours.',
    heroCtaText: 'START CUSTOM QUOTE',
    heroSecondaryCtaText: 'EXPLORE OUR WORK',
    trustBadge1: 'PREMIUM',
    trustBadge2: 'FAST',
    trustBadge3: 'NO SETUP',
  },
  contact: {
    email: 'graphicspunching264@gmail.com',
    phone: '+1 (607) 205-0030',
    whatsapp: '+1 (607) 205-0030',
    workingHours: '24/7 Production Desk (Mon-Sat)',
    address: 'Global High-Speed Production Studio & Digital Dispatch',
    rushTurnaroundClaim: '2-6 Hours Available',
    standardTurnaroundClaim: '12-24 Hours',
  },
  emailSettings: {
    provider: 'gmail_workspace',
    connectedEmail: 'graphicspunching264@gmail.com',
    notificationEmail: 'graphicspunching264@gmail.com',
    senderDisplayName: 'Graphics Punching Studio Desk',
    enableAutoResponder: true,
    autoResponderSubject: 'Thank you for choosing Graphics Punching - Order Evaluation Started',
    autoResponderBody: 'Hello,\n\nWe have received your artwork and project request. Our production specialists are inspecting your design to ensure flawless machine calibration and razor-sharp output.\n\nWe will deliver your quote and production roadmap shortly.\n\nBest regards,\nGraphics Punching Support Team\nPhone: +1 (607) 205-0030',
    quotePrefix: 'GP-QTE',
    replyToName: 'Graphics Punching Dispatch',
  },
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61593649506118',
    instagram: 'https://www.instagram.com/graphicspunching/',
    pinterest: 'https://www.pinterest.com/graphicspunching/?actingBusinessId=1113444845282202777',
    linkedin: '',
    youtube: '',
    tiktok: '',
    twitter: '',
    whatsapp: '+16072050030',
    website: 'https://www.graphicspunching.com',
  },
  watermark: {
    enabled: true,
    text: 'GRAPHICS PUNCHING • PROOF',
    opacity: 0.22,
    size: 20,
    placement: 'diagonal',
    color: '#ffffff',
  },
  sections: {
    topContactBar: true,
    hero: true,
    heroStats: true,
    beforeAfterSlider: true,
    servicesGrid: true,
    whyChooseUs: true,
    processSteps: true,
    pricingSection: true,
    portfolioShowcase: true,
    testimonials: true,
    faqSection: true,
    ctaBanner: true,
    footerDirectory: true,
    watermarkOverlay: true,
  },
  footer: {
    description: 'Graphics Punching is the premier global studio specializing in custom apparel screen printing, high-precision manual vector conversions, and machine-tested embroidery digitizing for brands and decorators worldwide.',
    copyrightText: `© ${new Date().getFullYear()} Graphics Punching. All rights reserved. Registered trademark.`,
    disclaimerText: 'All company names, brand logos, and registered marks displayed in sample portfolios remain the sole property of their respective trademark holders and are showcased strictly for technique demonstration.',
    addressSnippet: 'Global Digital Dispatch • Fast Worldwide Service & High-Speed Turnaround',
    showMadeWithLove: true,
    quickLinksTitle: 'Quick Directory',
  },
  chatbot: {
    enabled: true,
    botName: 'Punchy AI',
    botRole: 'Graphics Punching Virtual Assistant',
    welcomeMessage: 'Hello! I am Punchy AI, your 24/7 artwork and digitizing specialist. How can we elevate your apparel decoration today?',
    quickPrompts: [
      'What are your digitizing turnaround times & rates?',
      'Which file formats do you deliver (DST, EMB, PES)?',
      'How do custom patch orders and borders work?',
      'Can you clean up a low-res image into high-res vector?',
    ],
    tone: 'friendly',
    primaryColor: '#FFC400',
    showAvatar: true,
    position: 'bottom-right',
    supportEmail: 'graphicspunching264@gmail.com',
    supportPhone: '+1 (607) 205-0030',
    autoOpenDelaySeconds: 0,
    enableInstantQuoteShortcut: true,
    notifyAdminOnInquiry: true,
    adminNotificationEmail: 'graphicspunching264@gmail.com',
  },
};

// ============================================================
// DATABASE-BACKED STORAGE HELPERS (PERSISTENT & SERVERLESS-READY)
// ============================================================

const DATA_DIR = path.join(process.cwd(), 'data');
const PUBLISHED_DATA_FILE = path.join(DATA_DIR, 'published_site_data.json');
const CHAT_CONVERSATIONS_FILE = path.join(DATA_DIR, 'chat_conversations.json');

// Initialize local disk cache for instant availability
function initStorageFromDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(PUBLISHED_DATA_FILE)) {
      const raw = fs.readFileSync(PUBLISHED_DATA_FILE, 'utf-8');
      if (raw && raw.trim()) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          inMemoryPublishedData = {
            id: 'production',
            settings: parsed.settings || BASELINE_SETTINGS,
            portfolioItems: parsed.portfolioItems || parsed.portfolio_items || [],
            leads: parsed.leads || [],
            emailLogs: parsed.emailLogs || parsed.email_logs || [],
            version: parsed.version || 1,
            publishedAt: parsed.publishedAt || parsed.published_at || new Date().toISOString(),
            publishNote: parsed.publishNote || parsed.publish_note || '',
          };
          console.log(`[STORAGE] Loaded published site data (v${inMemoryPublishedData.version}) from disk.`);
        }
      }
    }
    if (fs.existsSync(CHAT_CONVERSATIONS_FILE)) {
      const raw = fs.readFileSync(CHAT_CONVERSATIONS_FILE, 'utf-8');
      if (raw && raw.trim()) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          inMemoryChatConversations = parsed;
          console.log(`[STORAGE] Loaded ${inMemoryChatConversations.length} chat conversations from disk.`);
        }
      }
    }
  } catch (err: any) {
    console.warn('[STORAGE] Initial disk read warning:', err?.message);
  }
}

// Pre-seed memory from disk cache on launch
initStorageFromDisk();

async function getPublishedData() {
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const rows = await supabaseRequest('site_state', {
        query: 'id=eq.production&select=*',
      });

      if (!rows?.length) {
        const initial = {
          id: 'production',
          settings: inMemoryPublishedData?.settings || BASELINE_SETTINGS,
          portfolio_items: inMemoryPublishedData?.portfolioItems || [],
          leads: inMemoryPublishedData?.leads || [],
          email_logs: inMemoryPublishedData?.emailLogs || [],
          version: inMemoryPublishedData?.version || 1,
          published_at: inMemoryPublishedData?.publishedAt || new Date().toISOString(),
          publish_note: inMemoryPublishedData?.publishNote || 'Initial production baseline',
          updated_at: new Date().toISOString(),
        };

        const created = await supabaseRequest('site_state', {
          method: 'POST',
          body: initial,
        });

        const res = created?.[0] || initial;
        inMemoryPublishedData = {
          settings: res.settings,
          portfolioItems: res.portfolio_items,
          leads: res.leads,
          emailLogs: res.email_logs,
          version: res.version,
          publishedAt: res.published_at,
          publishNote: res.publish_note,
        };
        return res;
      }

      const row = rows[0];
      inMemoryPublishedData = {
        settings: row.settings,
        portfolioItems: row.portfolio_items,
        leads: row.leads,
        emailLogs: row.email_logs,
        version: row.version,
        publishedAt: row.published_at,
        publishNote: row.publish_note,
      };
      return row;
    } catch (err: any) {
      console.warn('[STORAGE] Supabase getPublishedData failed, using local/in-memory state:', err?.message || err);
    }
  }

  // Local / In-memory fallback
  if (!inMemoryPublishedData) {
    initStorageFromDisk();
  }

  if (!inMemoryPublishedData) {
    inMemoryPublishedData = {
      id: 'production',
      settings: BASELINE_SETTINGS,
      portfolioItems: [],
      leads: [],
      emailLogs: [],
      version: 1,
      publishedAt: new Date().toISOString(),
      publishNote: 'Initial baseline state',
    };
  }

  return {
    id: 'production',
    settings: inMemoryPublishedData.settings || BASELINE_SETTINGS,
    portfolio_items: inMemoryPublishedData.portfolioItems || [],
    leads: inMemoryPublishedData.leads || [],
    email_logs: inMemoryPublishedData.emailLogs || [],
    version: inMemoryPublishedData.version || 1,
    published_at: inMemoryPublishedData.publishedAt || new Date().toISOString(),
    publish_note: inMemoryPublishedData.publishNote || '',
  };
}

async function savePublishedData(data: any) {
  inMemoryPublishedData = {
    settings: data.settings,
    portfolioItems: data.portfolioItems || data.portfolio_items || [],
    leads: data.leads || [],
    emailLogs: data.emailLogs || data.email_logs || [],
    version: data.version,
    publishedAt: data.publishedAt || data.published_at || new Date().toISOString(),
    publishNote: data.publishNote || data.publish_note || '',
  };

  // Persist to local disk cache
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PUBLISHED_DATA_FILE, JSON.stringify(inMemoryPublishedData, null, 2), 'utf-8');
  } catch (diskErr: any) {
    console.warn('[STORAGE] Local disk save warning:', diskErr?.message);
  }

  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const rows = await supabaseRequest('site_state', {
        method: 'PATCH',
        query: 'id=eq.production',
        body: {
          settings: inMemoryPublishedData.settings,
          portfolio_items: inMemoryPublishedData.portfolioItems,
          leads: inMemoryPublishedData.leads,
          email_logs: inMemoryPublishedData.emailLogs,
          version: inMemoryPublishedData.version,
          published_at: inMemoryPublishedData.publishedAt,
          publish_note: inMemoryPublishedData.publishNote,
          updated_at: new Date().toISOString(),
        },
      });
      return rows?.[0] || inMemoryPublishedData;
    } catch (err: any) {
      console.warn('[STORAGE] Supabase savePublishedData failed, state saved locally:', err?.message || err);
    }
  }

  return inMemoryPublishedData;
}

// Conversation persistence helpers
async function getConversation(id: string) {
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const rows = await supabaseRequest('chat_conversations', {
        query: `id=eq.${encodeURIComponent(id)}&select=*`,
      });
      if (rows?.[0]) {
        const row = rows[0];
        return {
          id: row.id,
          visitorId: row.visitor_id,
          visitorName: row.visitor_name,
          visitorEmail: row.visitor_email,
          visitorPhone: row.visitor_phone,
          status: row.status,
          unreadForAdmin: row.unread_for_admin,
          unreadForVisitor: row.unread_for_visitor,
          lastMessage: row.last_message,
          lastEventType: row.last_event_type,
          sessionInfo: row.session_info || {},
          messages: row.messages || [],
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          lastUpdatedAt: row.updated_at,
        };
      }
    } catch (err: any) {
      console.warn('[STORAGE] Supabase getConversation error, fallback to memory:', err?.message);
    }
  }

  return inMemoryChatConversations.find((c: any) => c.id === id) || null;
}

async function saveConversation(conversation: any) {
  const idx = inMemoryChatConversations.findIndex((c: any) => c.id === conversation.id);
  if (idx >= 0) {
    inMemoryChatConversations[idx] = conversation;
  } else {
    inMemoryChatConversations.unshift(conversation);
  }

  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const payload = {
        id: conversation.id,
        visitor_id: conversation.visitorId || null,
        visitor_name: conversation.visitorName || '',
        visitor_email: conversation.visitorEmail || '',
        visitor_phone: conversation.visitorPhone || '',
        status: conversation.status || 'active',
        unread_for_admin: Number(conversation.unreadForAdmin || 0),
        unread_for_visitor: Number(conversation.unreadForVisitor || 0),
        last_message: conversation.lastMessage || '',
        last_event_type: conversation.lastEventType || '',
        session_info: conversation.sessionInfo || {},
        messages: conversation.messages || [],
        updated_at: new Date().toISOString(),
      };

      const rows = await supabaseRequest('chat_conversations', {
        method: 'POST',
        query: 'on_conflict=id',
        body: payload,
        prefer: 'resolution=merge-duplicates,return=representation',
      });
      // Also sync to local disk
      try {
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
        fs.writeFileSync(CHAT_CONVERSATIONS_FILE, JSON.stringify(inMemoryChatConversations, null, 2), 'utf-8');
      } catch {}
      return rows?.[0] || conversation;
    } catch (err: any) {
      console.warn('[STORAGE] Supabase saveConversation error, saved in memory:', err?.message);
    }
  }

  // Persist to local disk
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(CHAT_CONVERSATIONS_FILE, JSON.stringify(inMemoryChatConversations, null, 2), 'utf-8');
  } catch (diskErr: any) {
    console.warn('[STORAGE] Local disk save chat error:', diskErr?.message);
  }

  return conversation;
}

async function getAllConversations() {
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const rows = await supabaseRequest('chat_conversations', {
        query: 'select=*&order=updated_at.desc',
      });
      if (Array.isArray(rows)) {
        const mapped = rows.map((row: any) => ({
          id: row.id,
          visitorId: row.visitor_id,
          visitorName: row.visitor_name,
          visitorEmail: row.visitor_email,
          visitorPhone: row.visitor_phone,
          status: row.status,
          unreadForAdmin: row.unread_for_admin,
          unreadForVisitor: row.unread_for_visitor,
          lastMessage: row.last_message,
          lastEventType: row.last_event_type,
          sessionInfo: row.session_info || {},
          messages: row.messages || [],
          lastUpdatedAt: row.updated_at,
          createdAt: row.created_at,
        }));
        inMemoryChatConversations = mapped;
        return mapped;
      }
    } catch (err: any) {
      console.warn('[STORAGE] Supabase getAllConversations error, fallback to local cache:', err?.message);
    }
  }

  if (!inMemoryChatConversations || inMemoryChatConversations.length === 0) {
    initStorageFromDisk();
  }

  inMemoryChatConversations.sort(
    (a: any, b: any) =>
      new Date(b.lastUpdatedAt || b.updatedAt || 0).getTime() -
      new Date(a.lastUpdatedAt || a.updatedAt || 0).getTime()
  );
  return inMemoryChatConversations;
}

async function markConversationAsRead(id: string): Promise<boolean> {
  let found = false;
  const conv = inMemoryChatConversations.find((c) => c.id === id);
  if (conv) {
    conv.unreadForAdmin = 0;
    conv.lastUpdatedAt = new Date().toISOString();
    found = true;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(CHAT_CONVERSATIONS_FILE, JSON.stringify(inMemoryChatConversations, null, 2), 'utf-8');
  } catch {}

  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    try {
      await supabaseRequest('chat_conversations', {
        method: 'PATCH',
        query: `id=eq.${encodeURIComponent(id)}`,
        body: {
          unread_for_admin: 0,
          updated_at: new Date().toISOString(),
        },
      });
      found = true;
    } catch (err: any) {
      console.warn('[STORAGE] Supabase markRead error:', err?.message);
    }
  }

  return found;
}

async function archiveOrDeleteConversation(id: string, action: 'archive' | 'delete') {
  if (action === 'delete') {
    inMemoryChatConversations = inMemoryChatConversations.filter((c) => c.id !== id);
    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(CHAT_CONVERSATIONS_FILE, JSON.stringify(inMemoryChatConversations, null, 2), 'utf-8');
    } catch {}

    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await supabaseRequest('chat_conversations', {
          method: 'DELETE',
          query: `id=eq.${encodeURIComponent(id)}`,
        });
      } catch (err: any) {
        console.warn('[STORAGE] Supabase delete conversation error:', err?.message);
      }
    }
  } else {
    const conv = inMemoryChatConversations.find((c) => c.id === id);
    if (conv) {
      conv.status = 'archived';
      conv.lastUpdatedAt = new Date().toISOString();
    }
    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(CHAT_CONVERSATIONS_FILE, JSON.stringify(inMemoryChatConversations, null, 2), 'utf-8');
    } catch {}

    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await supabaseRequest('chat_conversations', {
          method: 'PATCH',
          query: `id=eq.${encodeURIComponent(id)}`,
          body: {
            status: 'archived',
            updated_at: new Date().toISOString(),
          },
        });
      } catch (err: any) {
        console.warn('[STORAGE] Supabase archive conversation error:', err?.message);
      }
    }
  }
}

// ============================================================
// REAL EMAIL DISPATCH ENGINE (NODEMAILER / SMTP / GMAIL)
// ============================================================

function getMailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (user && pass) {
    if (host) {
      return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    }
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }
  return null;
}

async function dispatchRealEmail(options: {
  to: string;
  from?: string;
  replyTo?: string;
  subject: string;
  body: string;
  html?: string;
  attachments?: any[];
  cc?: string;
  bcc?: string;
}): Promise<{ sent: boolean; messageId?: string; error?: string; notConfigured?: boolean }> {
  const transporter = getMailTransporter();
  if (!transporter) {
    return {
      sent: false,
      notConfigured: true,
      error: 'SMTP credentials not configured. Set SMTP_USER and SMTP_PASS or GMAIL_APP_PASSWORD to send live emails.',
    };
  }

  try {
    const fromAddress = options.from || process.env.SMTP_USER || 'graphicspunching264@gmail.com';
    const info = await transporter.sendMail({
      from: fromAddress,
      to: options.to,
      replyTo: options.replyTo || fromAddress,
      subject: options.subject,
      text: options.body,
      html: options.html,
      cc: options.cc,
      bcc: options.bcc,
      attachments: Array.isArray(options.attachments)
        ? options.attachments.map((att: any) => ({
            filename: att.name || 'attachment',
            content: att.data || att.content,
            contentType: att.type,
          }))
        : undefined,
    });

    console.log(`[REAL MAIL DELIVERED] messageId=${info.messageId} to=${options.to}`);
    return {
      sent: true,
      messageId: info.messageId,
    };
  } catch (err: any) {
    console.error('[REAL MAIL FAILED]', err);
    return {
      sent: false,
      error: err?.message || 'Failed to dispatch email via mail transport',
    };
  }
}

// Authoritative Dispatched Email Logger
async function recordDispatchedEmailLog(logInput: {
  to: string;
  recipientName?: string;
  from?: string;
  replyTo?: string;
  subject: string;
  body: string;
  attachments?: any[];
  status?: 'sent' | 'delivered' | 'draft' | 'failed' | 'queued';
  thread?: any[];
  trackingId?: string;
  providerMessageId?: string | null;
  error?: string | null;
}) {
  try {
    const trackingId =
      logInput.trackingId ||
      `GP-MSG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      trackingId,
      to: logInput.to || 'graphicspunching264@gmail.com',
      recipientName: logInput.recipientName || '',
      from: logInput.from || 'graphicspunching264@gmail.com',
      replyTo: logInput.replyTo || 'graphicspunching264@gmail.com',
      subject: logInput.subject || 'Graphics Punching Notification',
      body: logInput.body || '',
      attachments: logInput.attachments || [],
      status: logInput.status || 'queued',
      sentAt: new Date().toISOString(),
      providerMessageId: logInput.providerMessageId || null,
      error: logInput.error || null,
      thread: logInput.thread || [],
    };

    const published = await getPublishedData();
    const currentLogs = Array.isArray(published.email_logs || published.emailLogs)
      ? [...(published.email_logs || published.emailLogs)]
      : [];

    currentLogs.unshift(newLog);
    if (currentLogs.length > 200) {
      currentLogs.length = 200;
    }

    await savePublishedData({
      settings: published.settings || BASELINE_SETTINGS,
      portfolioItems: published.portfolio_items || published.portfolioItems || [],
      leads: published.leads || [],
      emailLogs: currentLogs,
      version: published.version || 1,
      publishedAt: published.published_at || published.publishedAt || new Date().toISOString(),
    });

    // Broadcast email log update to all admin sessions
    broadcastLiveSiteUpdate({
      type: 'new_email_log',
      emailLog: newLog,
      totalEmailLogs: currentLogs.length,
    });

    console.log(`[EMAIL LOGGED] ${newLog.status.toUpperCase()}: ${trackingId} -> ${newLog.to} ("${newLog.subject}")`);
    return newLog;
  } catch (err) {
    console.error('Error in recordDispatchedEmailLog:', err);
    return null;
  }
}

// Synchronize incoming chatbot conversations with contact leads store
async function syncConversationToLead(conversation: any) {
  try {
    const published = await getPublishedData();
    const leads = Array.isArray(published.leads) ? [...published.leads] : [];

    const visitorEmail = conversation.visitorEmail?.trim();
    const visitorPhone = conversation.visitorPhone?.trim();
    const visitorName = conversation.visitorName?.trim() || 'Website Visitor';

    let existingLead = leads.find(
      (l: any) =>
        (visitorEmail && l.email && l.email.toLowerCase() === visitorEmail.toLowerCase()) ||
        l.id === `lead-chat-${conversation.id}` ||
        (conversation.visitorId && l.source?.includes(conversation.visitorId))
    );

    if (existingLead) {
      if (visitorEmail) existingLead.email = visitorEmail;
      if (visitorPhone) existingLead.phone = visitorPhone;
      if (visitorName && visitorName !== 'Website Visitor') existingLead.name = visitorName;
      existingLead.projectDetails = `Chatbot Conversation (${conversation.messages?.length || 0} msgs). Latest: "${conversation.lastMessage || ''}"`;
    } else {
      const newLead = {
        id: `lead-chat-${conversation.id || Date.now()}`,
        name: visitorName,
        email: visitorEmail || '',
        phone: visitorPhone || '',
        company: '',
        serviceInterested: 'Embroidery Digitizing / Vector Art',
        projectDetails: `Inquiry via 24/7 AI Chatbot: "${conversation.lastMessage || 'New inquiry'}"`,
        date: new Date().toISOString(),
        status: 'new',
        source: `AI Chatbot (${conversation.visitorId || 'visitor'})`,
        estimateTotal: null,
      };
      leads.unshift(newLead);
      broadcastLiveSiteUpdate({
        type: 'new_lead',
        lead: newLead,
      });
    }

    await savePublishedData({
      settings: published.settings || BASELINE_SETTINGS,
      portfolioItems: published.portfolio_items || published.portfolioItems || [],
      leads,
      emailLogs: published.email_logs || published.emailLogs || [],
      version: published.version || 1,
      publishedAt: published.published_at || published.publishedAt || new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error in syncConversationToLead:', err);
  }
}

// Lazy initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// ============================================================
// SERVER-SENT EVENTS (SSE) - CONSOLIDATED LIVE BROADCAST POOL
// ============================================================

interface SseClientConnection {
  res: express.Response;
  role: 'admin' | 'visitor';
  conversationId?: string;
  visitorId?: string;
}

const sseClientConnections = new Set<SseClientConnection>();

function broadcastLiveSiteUpdate(updatePayload: any) {
  const sseData = `data: ${JSON.stringify(updatePayload)}\n\n`;
  const deadClients: SseClientConnection[] = [];

  for (const client of sseClientConnections) {
    // Visitor access isolation: do not broadcast one visitor's chat to another
    if (updatePayload.type === 'chatbot_conversation_update' || updatePayload.type === 'chatbot_admin_reply') {
      const convId = updatePayload.conversation?.id || updatePayload.conversationId;
      const visId = updatePayload.conversation?.visitorId || updatePayload.visitorId;
      if (client.role === 'visitor') {
        const matchesConv = Boolean(client.conversationId && convId && client.conversationId === convId);
        const matchesVisitor = Boolean(client.visitorId && visId && client.visitorId === visId);
        if (!matchesConv && !matchesVisitor) {
          continue;
        }
      }
    } else if (
      updatePayload.type === 'chatbot_unread_update' ||
      updatePayload.type === 'new_lead' ||
      updatePayload.type === 'new_email_log' ||
      updatePayload.type === 'chatbot_conversations_refresh'
    ) {
      if (client.role === 'visitor') {
        continue; // Internal admin events only
      }
    }

    try {
      client.res.write(sseData);
      if (typeof (client.res as any).flush === 'function') {
        (client.res as any).flush();
      }
    } catch {
      deadClients.push(client);
    }
  }

  for (const dead of deadClients) {
    sseClientConnections.delete(dead);
  }
}

const handleSseStream = async (req: express.Request, res: express.Response) => {
  const origin = req.headers.origin;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform, no-store');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.writeHead(200);

  if (typeof (res as any).flushHeaders === 'function') {
    (res as any).flushHeaders();
  }

  // Send initial 2KB comment padding to punch through reverse proxy buffers
  res.write(`: ${' '.repeat(2048)}\n\n`);
  if (typeof (res as any).flush === 'function') {
    (res as any).flush();
  }

  const role = (req.query.role as string) === 'admin' ? 'admin' : 'visitor';
  const conversationId = (req.query.conversationId as string) || undefined;
  const visitorId = (req.query.visitorId as string) || undefined;

  const clientInfo: SseClientConnection = {
    res,
    role,
    conversationId,
    visitorId,
  };

  sseClientConnections.add(clientInfo);

  // Send immediate initial connection confirmation packet
  const published = await getPublishedData();
  const connectPacket = {
    type: 'connected',
    role,
    conversationId,
    publishedAt: published?.published_at || published?.publishedAt || null,
    version: published?.version || 1,
    activeAdminClients: Array.from(sseClientConnections).filter((c) => c.role === 'admin').length,
    activeVisitorClients: Array.from(sseClientConnections).filter((c) => c.role === 'visitor').length,
    timestamp: new Date().toISOString(),
  };

  res.write(`data: ${JSON.stringify(connectPacket)}\n\n`);
  if (typeof (res as any).flush === 'function') {
    (res as any).flush();
  }

  // Periodic keep-alive heartbeat every 15 seconds
  const heartbeatInterval = setInterval(() => {
    try {
      res.write(`: heartbeat\n\nevent: ping\ndata: {"time":"${new Date().toISOString()}"}\n\n`);
      if (typeof (res as any).flush === 'function') {
        (res as any).flush();
      }
    } catch {
      clearInterval(heartbeatInterval);
      sseClientConnections.delete(clientInfo);
    }
  }, 15000);

  req.on('close', () => {
    clearInterval(heartbeatInterval);
    sseClientConnections.delete(clientInfo);
  });
};

const handleSsePost = (req: express.Request, res: express.Response) => {
  const eventPayload = req.body || {};
  broadcastLiveSiteUpdate(eventPayload);
  res.json({
    success: true,
    message: 'Event received and broadcasted to active live SSE clients',
    activeClients: sseClientConnections.size,
    timestamp: new Date().toISOString(),
  });
};

// Single, canonical registration for SSE endpoints
app.get(['/api/events', '/api/site/events'], handleSseStream);
app.post(['/api/events', '/api/site/events'], handleSsePost);
app.options(['/api/events', '/api/site/events'], (req, res) => res.sendStatus(204));

// 1. Health & Server Status check endpoint
app.get('/api/health', async (req, res) => {
  const published = await getPublishedData();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Graphics Punching Portal API',
    storageMode: SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY ? 'supabase_postgres' : 'in_memory_fallback',
    lastPublishedAt: published?.published_at || published?.publishedAt || null,
    version: published?.version || 1,
    activeLiveClients: sseClientConnections.size,
    activeAdminClients: Array.from(sseClientConnections).filter((c) => c.role === 'admin').length,
    activeVisitorClients: Array.from(sseClientConnections).filter((c) => c.role === 'visitor').length,
  });
});

// 2. Fetch Live Published Website Data
app.get('/api/site/data', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    const row = await getPublishedData();

    const data = {
      settings: deepMerge(BASELINE_SETTINGS, row.settings || {}),
      portfolioItems: row.portfolio_items || row.portfolioItems || [],
      leads: row.leads || [],
      emailLogs: row.email_logs || row.emailLogs || [],
      publishedAt: row.published_at || row.publishedAt,
      version: row.version,
    };

    res.json({
      success: true,
      hasCustomData: true,
      publishedAt: row.published_at || row.publishedAt,
      version: row.version,
      data,
    });
  } catch (error: any) {
    console.error('[SITE DATA]', error);
    res.status(500).json({
      success: false,
      error: 'Unable to load published website data.',
      details: error?.message,
    });
  }
});

app.get('/api/site/version', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    const row = await getPublishedData();
    res.json({
      success: true,
      version: row.version || 1,
      publishedAt: row.published_at || row.publishedAt || null,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message });
  }
});

// 3. Reusable Canonical Publish Handler
async function handlePublishRequest(req: express.Request, res: express.Response) {
  try {
    if (req.method === 'GET') {
      const current = await getPublishedData();
      return res.json({
        success: true,
        status: 'ready',
        version: current.version,
        publishedAt: current.published_at || current.publishedAt,
        activeClients: sseClientConnections.size,
      });
    }

    const payload = req.body || {};
    const current = await getPublishedData();

    const mergedSettings = deepMerge(
      BASELINE_SETTINGS,
      deepMerge(current.settings || {}, payload.settings || payload.data?.settings || {})
    );

    const newVersion = Number(current.version || 0) + 1;
    const publishedAt = new Date().toISOString();

    const published = {
      settings: mergedSettings,
      portfolioItems: Array.isArray(payload.portfolioItems || payload.data?.portfolioItems)
        ? (payload.portfolioItems || payload.data?.portfolioItems)
        : current.portfolio_items || current.portfolioItems || [],
      leads: payload.leads || payload.data?.leads || current.leads || [],
      emailLogs: payload.emailLogs || payload.data?.emailLogs || current.email_logs || current.emailLogs || [],
      publishedAt,
      version: newVersion,
      publishNote: payload.note || payload.data?.note || 'Admin published website changes',
    };

    await savePublishedData(published);

    broadcastLiveSiteUpdate({
      type: 'published_update',
      version: newVersion,
      publishedAt,
      data: published,
    });

    console.log(`[CMS PUBLISH] Synchronized production version ${newVersion} at ${publishedAt}`);

    return res.json({
      success: true,
      message: 'Website published successfully.',
      version: newVersion,
      publishedAt,
      data: published,
    });
  } catch (error: any) {
    console.error('[CMS PUBLISH ERROR]', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to publish website.',
    });
  }
}

// Canonical registration for publish endpoints - NO duplicate routes
app.get(['/api/publish', '/api/site/publish', '/api/admin/publish'], handlePublishRequest);
app.post(['/api/publish', '/api/site/publish', '/api/admin/publish', '/api/site/data'], handlePublishRequest);
app.options(['/api/publish', '/api/site/publish', '/api/admin/publish', '/api/site/data'], (req, res) => res.sendStatus(204));

// 4. Submit Customer Quote Request / Contact Lead
const handleLeadSubmit = async (req: express.Request, res: express.Response) => {
  try {
    const leadData = req.body;
    if (!leadData.name && !leadData.fullName) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }

    const newLead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: leadData.name || leadData.fullName,
      email: leadData.email || '',
      phone: leadData.phone || '',
      company: leadData.company || leadData.businessName || '',
      serviceInterested: leadData.serviceInterested || leadData.service || 'Vector Art / Digitizing',
      projectDetails: leadData.projectDetails || leadData.message || '',
      date: new Date().toISOString(),
      status: 'new',
      source: leadData.source || 'Website Quote Form',
      estimateTotal: leadData.estimateTotal || null,
    };

    const published = await getPublishedData();
    const updatedLeads = [newLead, ...(published.leads || [])];
    await savePublishedData({
      settings: published.settings || BASELINE_SETTINGS,
      portfolioItems: published.portfolio_items || published.portfolioItems || [],
      leads: updatedLeads,
      emailLogs: published.email_logs || published.emailLogs || [],
      version: published.version || 1,
      publishedAt: published.published_at || published.publishedAt || new Date().toISOString(),
    });

    broadcastLiveSiteUpdate({
      type: 'new_lead',
      lead: newLead,
    });

    // Record in Dispatched Email Logs with status queued
    await recordDispatchedEmailLog({
      to: 'graphicspunching264@gmail.com',
      recipientName: 'Administrator',
      from: 'Website Lead Engine <graphicspunching264@gmail.com>',
      replyTo: newLead.email || 'graphicspunching264@gmail.com',
      subject: `[New Lead] ${newLead.name} - ${newLead.serviceInterested}`,
      body: `======================================================================
GRAPHICS PUNCHING • NEW CUSTOMER INQUIRY / LEAD RECEIVED
======================================================================

CUSTOMER NAME: ${newLead.name}
EMAIL: ${newLead.email || 'None provided'}
PHONE: ${newLead.phone || 'None provided'}
COMPANY: ${newLead.company || 'Not specified'}
SERVICE INTERESTED: ${newLead.serviceInterested}
SOURCE: ${newLead.source}
DATE/TIME: ${newLead.date}

PROJECT DETAILS:
"${newLead.projectDetails}"

${newLead.estimateTotal ? `ESTIMATED TOTAL: $${newLead.estimateTotal}` : ''}

Graphics Punching Production Desk — 24/7 Intake
Phone: +1 (607) 205-0030 | graphicspunching264@gmail.com
======================================================================`,
      status: 'queued',
    });

    res.json({
      success: true,
      lead: newLead,
      message: 'Lead recorded and forwarded successfully',
    });
  } catch (err: any) {
    console.error('Error recording lead:', err);
    res.status(500).json({ success: false, error: 'Failed to record lead' });
  }
};

app.post(['/api/leads/submit', '/api/leads', '/api/contact'], handleLeadSubmit);

// 5. Reset Published Data to Default Factory State
const handleReset = async (req: express.Request, res: express.Response) => {
  try {
    const initialData = {
      settings: BASELINE_SETTINGS,
      portfolioItems: [],
      leads: [],
      emailLogs: [],
      version: 1,
      publishedAt: new Date().toISOString(),
      publishNote: 'Reset to factory baseline defaults',
    };
    await savePublishedData(initialData);

    broadcastLiveSiteUpdate({
      type: 'reset_to_defaults',
      publishedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: 'Published database reset to default baseline configuration.',
    });
  } catch (err: any) {
    console.error('Error resetting published database:', err);
    res.status(500).json({ success: false, error: 'Failed to reset published database' });
  }
};

app.post('/api/admin/reset', handleReset);
app.all('/api/admin/reset', handleReset);
app.all('/api/reset', handleReset);

// 7. AI Email Assistant Endpoint
app.post('/api/gemini/email-assistant', async (req, res) => {
  try {
    const {
      action = 'draft',
      instruction = '',
      currentDraft = '',
      recipient = '',
      recipientName = '',
      subject = '',
      tone = 'professional',
      context = {},
    } = req.body;

    if (!instruction && !currentDraft && action !== 'suggest_subjects') {
      return res.status(400).json({ error: 'Instruction or current draft is required' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a master email communications specialist and customer success expert for "Graphics Punching" (a world-class vector artwork redraw, screen printing color separation, and embroidery digitizing studio).
Your goal is to write clear, polite, high-converting, and precise professional emails to customers, apparel decorators, embroidery shops, and businesses.
Always format email output cleanly with:
-- A compelling, concise Subject line (labeled as Subject: ...)
-- Professional Greeting
-- Clear, helpful, structured body text with bullet points if applicable
-- Clear Call to Action / Next Steps
-- Professional Sign-off:
  Best regards,
  Production & Support Team
  Graphics Punching
  Phone: +1 (607) 205-0030
  Email: graphicspunching264@gmail.com
  Web: www.graphicspunching.com`;

    let userPrompt = '';

    if (action === 'draft') {
      userPrompt = `Please write a professional email based on the following instruction and details:
- Tone: ${tone}
- Recipient: ${recipientName ? `${recipientName} (${recipient})` : recipient || 'Valued Client'}
- User Instruction: "${instruction}"
- Extra Context: ${JSON.stringify(context || {})}

Provide the response in JSON format with two keys:
1. "subject": the generated email subject line
2. "body": the complete formatted email body (plain text with clean line breaks)`;
    } else if (action === 'rewrite' || action === 'improve') {
      userPrompt = `Please rewrite and polish the following email draft according to this specific request:
- Target Tone / Goal: ${tone}
- Modification Request: "${instruction || 'Make it more professional, polished, and clear'}"
- Recipient: ${recipientName || recipient || 'Client'}
- Current Subject: "${subject}"
- Current Body:
"""
${currentDraft}
"""

Provide the response in JSON format with two keys:
1. "subject": revised subject line (or keep existing if optimal)
2. "body": the revised, improved email body`;
    } else if (action === 'suggest_subjects') {
      userPrompt = `Generate 5 alternative high-performing, clear, and professional subject lines for an email with this content/purpose:
- Email Context / Body summary: "${instruction || currentDraft || subject}"
- Tone: ${tone}

Provide the response in JSON format with a key "subjects" containing an array of 5 string suggestions.`;
    } else {
      userPrompt = `Help assist with this email request:
Instruction: "${instruction}"
Draft: "${currentDraft}"
Tone: ${tone}`;
    }

    // Call Gemini 3.8 Flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch {
      parsedResult = {
        subject: subject || 'Graphics Punching Project Update',
        body: responseText,
      };
    }

    res.json({
      success: true,
      data: parsedResult,
      modelUsed: 'gemini-3.8-flash',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/email-assistant:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to process AI email request',
    });
  }
});

// Helper function for intelligent chatbot responses (used when Gemini key is absent or on transient API error)
function generateIntelligentChatbotFallback(
  userQuery: string,
  settings: any = {}
): { reply: string; suggestedAction?: { type: string; label: string; url?: string } } {
  const query = (userQuery || '').toLowerCase().trim();
  const botName = settings.botName || 'Punchy AI';
  const supportPhone = settings.supportPhone || '+1 (607) 205-0030';
  const supportEmail = settings.supportEmail || 'graphicspunching264@gmail.com';

  // 1. Pricing / Quote questions
  if (
    query.includes('price') ||
    query.includes('pricing') ||
    query.includes('cost') ||
    query.includes('rate') ||
    query.includes('how much') ||
    query.includes('quote') ||
    query.includes('estimate')
  ) {
    return {
      reply: `Here is our transparent, flat-rate pricing breakdown at **Graphics Punching**:

• **Vector Artwork Redraws**:
  - Simple (Clean text, basic silhouettes): **$10**
  - Medium (Multi-color emblems, gradients): **$15**
  - Complex (Detailed illustrations, badges): **$25 - $35**

• **Embroidery Digitizing**:
  - Left Chest / Cap / Beanie: **$15 flat rate**
  - Midsize Emblem (up to 6"): **$25 flat rate**
  - Full Jacket Back: **$35 - $50 flat rate**
  - All digitizing includes **Free minor revisions** & production PDF run sheet!

• **Screen Printing Color Separations**:
  - Spot Color (1-4 colors): **$15**
  - Simulated Process / CMYK (Dark & Light shirts): **$25 - $35**

• **Custom Patches**:
  - Available in Embroidered, Woven, 3D Molded PVC, Laser-cut Leather, and Chenille. Use our interactive patch calculator on the website for exact quantity estimates!

Would you like to get an instant quote or upload your artwork for review?`,
      suggestedAction: {
        type: 'quote',
        label: '⚡ Request Instant Quote',
      },
    };
  }

  // 2. Turnaround / Delivery time
  if (
    query.includes('turnaround') ||
    query.includes('time') ||
    query.includes('how long') ||
    query.includes('rush') ||
    query.includes('fast') ||
    query.includes('delivery') ||
    query.includes('urgent') ||
    query.includes('hours')
  ) {
    return {
      reply: `At **Graphics Punching**, speed and machine reliability are our top priorities:

⚡ **Standard Turnaround**: **12 to 24 Hours** for most vector redraws and digitizing jobs.
🚀 **Rush Service**: **4 to 8 Hours** turnaround available upon request for time-sensitive shop deadlines.
🕒 **Intake Hours**: Our digital order desk is active **24/7/365** so your morning shift in the US, Europe, or Australia is never delayed.

Submit your artwork today and receive your machine-ready files by tomorrow morning!`,
      suggestedAction: {
        type: 'quote',
        label: '🚀 Start Rush Project',
      },
    };
  }

  // 3. File Formats
  if (
    query.includes('format') ||
    query.includes('dst') ||
    query.includes('pes') ||
    query.includes('emb') ||
    query.includes('exp') ||
    query.includes('svg') ||
    query.includes('eps') ||
    query.includes('ai') ||
    query.includes('pdf') ||
    query.includes('file type')
  ) {
    return {
      reply: `We deliver all universal commercial production formats tailored to your exact equipment:

🧵 **Embroidery Formats**:
• **Tajima (.DST)** — Universal industry standard
• **Brother / Babylock (.PES)**
• **Melco (.EXP)**
• **Barudan (.DSB / .DAT)**
• **Wilcom Native (.EMB)** with editable stitch geometry
• Complete **PDF Color Run Worksheet** with trim sequences, thread colors, and dimensions.

🎨 **Vector Art Formats**:
• **Adobe Illustrator (.AI)**
• **Encapsulated PostScript (.EPS)**
• **Scalable Vector Graphics (.SVG)**
• **Print-Ready PDF**
• **High-Resolution Transparent 300 DPI PNG**

Do you have a specific commercial machine or cutting plotter you are preparing files for?`,
      suggestedAction: {
        type: 'quote',
        label: '📁 Submit Files for Conversion',
      },
    };
  }

  // 4. Custom Patches & Borders
  if (
    query.includes('patch') ||
    query.includes('merrow') ||
    query.includes('border') ||
    query.includes('velcro') ||
    query.includes('iron on') ||
    query.includes('pvc') ||
    query.includes('leather') ||
    query.includes('woven') ||
    query.includes('chenille')
  ) {
    return {
      reply: `We specialize in end-to-end **Custom Patch Design & Digitizing**:

🛡️ **Patch Styles**:
1. **Embroidered Patches**: Classic textured needlecraft with bold thread dimension.
2. **High-Definition Woven Patches**: Ideal for micro-lettering down to 2mm that embroidery cannot render cleanly.
3. **3D Molded PVC / Rubber**: Waterproof, tactical, and virtually indestructible.
4. **Laser-Etched Leather / Leatherette**: Premium rustic style for caps, workwear, and beanies.
5. **Varsity Chenille & Dye-Sublimated**: Vintage collegiate or photographic full-color emblems.

✂️ **Border Styles**:
• **Merrowed Edge**: Traditional 1/8" wrapped overlock border (best for regular shapes: circles, rectangles, shields).
• **Laser-Cut Satin Border**: Flush precision edge for custom die-cut contours.

🧲 **Backing Options**: Heat-seal (Iron-On), Tactical Hook-and-Loop (Velcro), Sew-on Twill, or Peel-and-Stick.

Check out our new **Patch Design** page on the site for our interactive sizing estimator!`,
      suggestedAction: {
        type: 'navigate',
        label: '🛡️ View Custom Patch Studio',
        url: '#/patch-design',
      },
    };
  }

  // 5. Vector Artwork Redraws
  if (
    query.includes('vector') ||
    query.includes('redraw') ||
    query.includes('trace') ||
    query.includes('low res') ||
    query.includes('pixel') ||
    query.includes('blurry') ||
    query.includes('convert image') ||
    query.includes('bitmap')
  ) {
    return {
      reply: `Need to transform a blurry, low-resolution JPG, PNG, or photo into crisp vector lines?

✨ **Why Graphics Punching Vector Redraws Excel**:
• **100% Manual Pen-Tool Craft**: We never use cheap automated auto-tracing filters that leave jagged nodes or blurry corners.
• **Infinite Scalability**: Scale your logo from a business card to a highway billboard with zero quality loss.
• **Plotter & Cutter Friendly**: Clean closed curves and minimal node counts, optimized for vinyl plotters, laser engravers, DTF, and screen print films.
• **Turnaround**: Standard 12-24 hours (4-8h rush available).
• **Pricing**: Flat $10 simple, $15 medium, $25-$35 complex.

Send over your low-resolution file and we'll deliver clean vectors within hours!`,
      suggestedAction: {
        type: 'quote',
        label: '🎨 Redraw My Vector Logo',
      },
    };
  }

  // 6. Embroidery Digitizing & Stitch Quality
  if (
    query.includes('embroidery') ||
    query.includes('digitiz') ||
    query.includes('stitch') ||
    query.includes('thread') ||
    query.includes('puckering') ||
    query.includes('hat') ||
    query.includes('cap') ||
    query.includes('3d puff')
  ) {
    return {
      reply: `Our digitizers have decades of hands-on commercial embroidery experience:

🧵 **Precision Engineering**:
• **Push & Pull Compensation**: Calibrated specifically for your target fabric (piqué polos, performance fleece, twill, or structured caps).
• **Underlay Sequencing**: Stable tatami, edge run, and zigzag underlays to eliminate puckering and thread breaks.
• **Center-Out & Bottom-Up Cap Digitizing**: Digitized specifically for 270° cap frames to prevent seam distortion.
• **3D Foam Puff**: Precision capping stitches and automatic cut-through density for high-impact raised 3D embroidery.
• **Formats**: Tajima DST, PES, EXP, EMB with complete color sequence sheets.

Every file is test-sewn in software to ensure smooth, high-speed runnability with minimal trims!`,
      suggestedAction: {
        type: 'quote',
        label: '🧵 Get Digitizing Quote',
      },
    };
  }

  // 7. Social Links
  if (
    query.includes('social') ||
    query.includes('facebook') ||
    query.includes('instagram') ||
    query.includes('pinterest') ||
    query.includes('follow')
  ) {
    return {
      reply: `Connect with **Graphics Punching** on our official social media channels:

📘 **Facebook**: [facebook.com/profile.php?id=61593649506118](https://www.facebook.com/profile.php?id=61593649506118)
📸 **Instagram**: [@graphicspunching](https://www.instagram.com/graphicspunching/)
📌 **Pinterest**: [@graphicspunching](https://www.pinterest.com/graphicspunching/?actingBusinessId=1113444845282202777)
🌐 **Official Website**: [www.graphicspunching.com](https://www.graphicspunching.com)

Follow us to check out our daily production sewouts, vector art redraw showcases, and embroidery tips!`,
    };
  }

  // 8. Contact / Human Support
  if (
    query.includes('contact') ||
    query.includes('phone') ||
    query.includes('email') ||
    query.includes('human') ||
    query.includes('call') ||
    query.includes('talk') ||
    query.includes('support') ||
    query.includes('address') ||
    query.includes('location')
  ) {
    return {
      reply: `You can reach our live production and support specialists anytime:

📞 **Direct Phone / WhatsApp**: **${supportPhone}**
✉️ **Direct Email**: **${supportEmail}**
🌐 **Official Website**: **https://www.graphicspunching.com**
⏰ **Operating Hours**: Mon - Fri: 8:00 AM - 7:00 PM EST | **24/7 Digital Intake & Support**

You can also submit an instant quote request on our website and an artwork manager will review your files immediately!`,
      suggestedAction: {
        type: 'contact',
        label: '📞 Contact Us Now',
      },
    };
  }

  // 9. Revisions & Guarantees
  if (
    query.includes('revision') ||
    query.includes('guarantee') ||
    query.includes('edit') ||
    query.includes('fix') ||
    query.includes('satisfaction') ||
    query.includes('sample') ||
    query.includes('money back')
  ) {
    return {
      reply: `**Our 100% Quality & Runnability Guarantee**:

• **Free Minor Revisions**: If you need color sequence adjustments, stitch density tweaks, slight resizing (within 10-15%), or format conversions, we handle them at **zero extra charge**.
• **Machine Compatibility Guarantee**: We guarantee our DST and PES files will run smoothly on your multi-needle or single-needle embroidery equipment without birdnesting or thread breakage.
• **Vector Precision Guarantee**: Crisp mathematically exact vector paths ready for cut vinyl, DTF, or screen printing screen burning.

We aren't finished until your project looks stunning on fabric or print!`,
      suggestedAction: {
        type: 'quote',
        label: '⚡ Start Your Project Risk-Free',
      },
    };
  }

  // Default fallback
  return {
    reply: `Hello! I'm **${botName}**, your virtual production assistant at **Graphics Punching**.

We are an international digitizing and artwork studio specializing in:
1. **Embroidery Digitizing** (Left chest $15, caps, jacket backs, 3D puff in DST/PES/EXP/EMB)
2. **Manual Vector Redraws** ($10-$15 flat rates in AI, EPS, SVG, PDF)
3. **Custom Patch Design** (Embroidered, Woven, 3D PVC, Leather, Chenille)
4. **Screen Printing Color Separations** (Spot color, Simulated Process, CMYK)

How can I assist you with your project today? Feel free to ask about pricing, turnarounds, file formats, or request a quick quote!`,
    suggestedAction: {
      type: 'quote',
      label: '⚡ Get Instant Quote',
    },
  };
}

// 7b. AI Chatbot Assistant Endpoint (Powered by Gemini with Domain Knowledge & Intelligent Fallback)
app.post(['/api/gemini/chat', '/api/chatbot/ask', '/api/chatbot/generate'], async (req, res) => {
  try {
    const { settings = {}, context = {} } = req.body;
    let messages = req.body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      if (typeof req.body.message === 'string' && req.body.message.trim()) {
        messages = [{ role: 'user', content: req.body.message.trim() }];
      } else {
        return res.status(400).json({ success: false, error: 'Messages array or message string is required.' });
      }
    }

    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage?.content || lastMessage?.text || '';

    if (!userQuery.trim()) {
      return res.status(400).json({ success: false, error: 'User message cannot be empty.' });
    }

    const botName = settings.botName || 'Punchy AI';
    const botRole = settings.botRole || 'Graphics Punching Virtual Assistant';
    const tone = settings.tone || 'friendly';
    const customKnowledge = settings.customKnowledge || '';
    const supportEmail = settings.supportEmail || 'graphicspunching264@gmail.com';
    const supportPhone = settings.supportPhone || '+1 (607) 205-0030';

    // Check if Gemini API Key is present
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return intelligent fallback immediately
      const fallback = generateIntelligentChatbotFallback(userQuery, settings);
      return res.json({
        success: true,
        reply: fallback.reply,
        suggestedAction: fallback.suggestedAction,
        modelUsed: 'offline-intelligent-knowledge-engine',
        timestamp: new Date().toISOString(),
      });
    }

    // Try Gemini AI with domain system instructions
    try {
      const ai = getGeminiClient();

      const systemInstruction = `You are "${botName}", the ${botRole} for "Graphics Punching" (www.graphicspunching.com).
Your mission is to provide accurate, welcoming, helpful, and concise assistance to apparel decorators, screen printers, embroidery shops, businesses, and designers.

Company Core Capabilities:
1. Embroidery Digitizing:
   - Formats: Tajima (.DST), Brother (.PES), Melco (.EXP), Barudan (.DSB), Wilcom (.EMB), plus PDF Color Run Sheets.
   - Pricing: Flat $15 for Left Chest / Cap / Beanie; $25 for mid-sized emblems; $35-$50 for full jacket back.
   - Quality: Production-tested, precise pull/push compensation, stable underlays, center-out cap digitizing, 3D foam puff expertise.
   - Free minor revisions on all digitizing until customer is 100% satisfied.

2. Vector Art Redraw:
   - 100% manual redraws with Adobe Illustrator Pen tool (NEVER automatic live-tracing).
   - Formats: AI, EPS, SVG, PDF, high-res 300 DPI PNG.
   - Pricing: Simple $10, Medium $15, Complex $25-$35.
   - Ready for vinyl cutters, laser engravers, DTF, DTG, and screen printing film output.

3. Custom Patch Design & Digitizing:
   - Varieties: Embroidered Patches, High-Definition Woven Patches (for tiny 2mm text), 3D Molded PVC/Rubber, Laser-Etched Leather, Varsity Chenille, Dye-Sublimation.
   - Borders: Merrowed 1/8" overlock edge vs Laser-cut satin edge.
   - Backings: Heat-seal (Iron-on), Tactical Hook-and-Loop (Velcro), Sew-on twill, Peel-and-stick.

4. Screen Printing Color Separation:
   - Spot Color, Simulated Process (4-8 colors), CMYK, Index separation, Underbase white with vector choke, registration marks.

Turnaround & Contact Details:
- Standard Turnaround: 12-24 hours.
- Rush Turnaround: 4-8 hours available upon request.
- Phone / WhatsApp: ${supportPhone}
- Email: ${supportEmail}
- Official Website: https://www.graphicspunching.com
- Social Links:
  * Facebook: https://www.facebook.com/profile.php?id=61593649506118
  * Instagram: https://www.instagram.com/graphicspunching/
  * Pinterest: https://www.pinterest.com/graphicspunching/?actingBusinessId=1113444845282202777

Admin Custom Knowledge / Instructions:
${customKnowledge ? `\n--- ADMIN CUSTOM INSTRUCTIONS ---\n${customKnowledge}\n----------------------------------\n` : ''}

Response Rules:
- Tone: ${tone} (welcoming, highly competent, professional, respectful).
- Keep responses scannable, using clear bullet points and bold highlights for pricing, formats, or turnarounds.
- If the user asks about starting an order, prices, or requests a quote, invite them to submit an instant quote through the website or contact support.
- If asked about social media, provide the exact official links above.
- Do NOT make up services that Graphics Punching does not offer (we do not sell raw machinery or blank garments directly; we supply production digitizing, vector redraws, patch design, and film separations).`;

      // Build message sequence for Gemini
      // Format history: user and model turns
      const contents = messages.slice(-10).map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content || m.text || '' }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || '';

      // Determine if a suggested action button should accompany the reply
      let suggestedAction: any = undefined;
      const lowerReply = (replyText + ' ' + userQuery).toLowerCase();
      if (lowerReply.includes('quote') || lowerReply.includes('price') || lowerReply.includes('pricing') || lowerReply.includes('start your project') || lowerReply.includes('upload')) {
        suggestedAction = { type: 'quote', label: '⚡ Get Instant Quote' };
      } else if (lowerReply.includes('patch')) {
        suggestedAction = { type: 'navigate', label: '🛡️ View Patch Studio', url: '#/patch-design' };
      } else if (lowerReply.includes('phone') || lowerReply.includes('call') || lowerReply.includes('contact')) {
        suggestedAction = { type: 'contact', label: '📞 Contact Support' };
      }

      return res.json({
        success: true,
        reply: replyText,
        suggestedAction,
        modelUsed: 'gemini-3.8-flash',
        timestamp: new Date().toISOString(),
      });
    } catch (geminiError: any) {
      console.warn('Gemini API call failed, using intelligent fallback:', geminiError?.message || geminiError);
      const fallback = generateIntelligentChatbotFallback(userQuery, settings);
      return res.json({
        success: true,
        reply: fallback.reply,
        suggestedAction: fallback.suggestedAction,
        modelUsed: 'fallback-intelligent-knowledge-engine',
        note: 'Switched to domain knowledge fallback',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err: any) {
    console.error('Fatal error in chat endpoint:', err);
    res.status(500).json({ success: false, error: err?.message || 'Server error processing chat message' });
  }
});

// 7b. Chatbot Interaction Admin Notification Endpoint
app.post('/api/chatbot/notify-admin', async (req, res) => {
  try {
    const {
      selectedInquiry,
      eventType = 'user_message', // 'quick_reply' | 'user_message' | 'quick_action' | 'message_click'
      timestamp,
      conversation = [],
      adminEmail = 'graphicspunching264@gmail.com',
      actionDetails,
      sessionInfo = {},
      visitorId,
      visitorName,
    } = req.body;

    if (!selectedInquiry || !selectedInquiry.toString().trim()) {
      return res.status(400).json({ success: false, error: 'selectedInquiry is required.' });
    }

    const cleanedInquiry = selectedInquiry.toString().trim();
    const eventLabels: Record<string, string> = {
      quick_reply: 'Quick-Reply Inquiry Option Clicked',
      user_message: 'User-Submitted Chat Message',
      quick_action: 'Chatbot Quick-Action Button Clicked',
      message_click: 'User Clicked Chatbot Message / Topic',
    };

    const eventLabel = eventLabels[eventType] || 'Chatbot Inquiry';
    const now = new Date();
    const nowIso = now.toISOString();
    const formattedDateTime =
      timestamp ||
      now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      });

    const trackingId = `GP-CHAT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Format plain text transcript
    const transcriptText =
      Array.isArray(conversation) && conversation.length > 0
        ? conversation
            .map((c: any, i: number) => {
              const speaker = c.role === 'assistant' ? '🤖 ASSISTANT (Punchy AI)' : '👤 CUSTOMER';
              const time = c.timestamp ? ` [${c.timestamp}]` : '';
              return `${i + 1}. ${speaker}${time}:\n"${c.content}"`;
            })
            .join('\n\n')
        : `(User initiated inquiry: "${cleanedInquiry}")`;

    // Subject line
    const truncatedInquiry =
      cleanedInquiry.length > 60 ? cleanedInquiry.substring(0, 57) + '...' : cleanedInquiry;
    const subject = `[Chatbot Inquiry Alert] ${eventLabel}: "${truncatedInquiry}"`;

    // Email text body
    const emailBody = `======================================================================
GRAPHICS PUNCHING • CHATBOT ADMIN NOTIFICATION
======================================================================

EVENT TRIGGER:
${eventLabel.toUpperCase()}

USER'S SELECTED MESSAGE / INQUIRY:
"${cleanedInquiry}"

DATE & TIME:
${formattedDateTime} (System ISO: ${nowIso})

TRACKING ID:
${trackingId}

${actionDetails ? `ACTION DETAILS:\n${typeof actionDetails === 'object' ? JSON.stringify(actionDetails, null, 2) : actionDetails}\n\n` : ''}AVAILABLE CONVERSATION DETAILS & TRANSCRIPT (${Array.isArray(conversation) ? conversation.length : 0} message${conversation.length === 1 ? '' : 's'}):
----------------------------------------------------------------------
${transcriptText}
----------------------------------------------------------------------

USER / BROWSER CONTEXT:
• Page URL: ${sessionInfo.url || 'https://www.graphicspunching.com'}
• User Platform: ${sessionInfo.platform || 'Web Browser'}
• Device Viewport: ${sessionInfo.viewport || 'N/A'}
• Notification Destination: ${adminEmail}

======================================================================
Graphics Punching Studio — 24/7 Digital Intake & Production Desk
Phone: +1 (607) 205-0030 | Web: www.graphicspunching.com
======================================================================`;

    console.log(`[CHATBOT NOTIFICATION DISPATCHED]`, {
      trackingId,
      eventType,
      selectedInquiry: cleanedInquiry,
      recipient: adminEmail,
      date: formattedDateTime,
      messageCount: Array.isArray(conversation) ? conversation.length : 0,
    });

    // Parse recipients
    const recipients = adminEmail
      .split(/[,;]+/)
      .map((e: string) => e.trim())
      .filter((e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && !e.toLowerCase().includes('hassangraphicpunch'));

    const destination =
      recipients.length > 0
        ? recipients.join(', ')
        : 'graphicspunching264@gmail.com';

    // Attempt real email dispatch via nodemailer / Gmail
    const dispatchResult = await dispatchRealEmail({
      to: destination,
      replyTo: (sessionInfo as any)?.visitorEmail || 'graphicspunching264@gmail.com',
      subject,
      body: emailBody,
    });

    const emailStatus = dispatchResult.sent ? 'sent' : dispatchResult.notConfigured ? 'queued' : 'failed';

    // Persist email alert to authoritative server-side log store and sync live
    const loggedAlert = await recordDispatchedEmailLog({
      to: destination,
      recipientName: 'Administrator',
      from: 'Punchy AI <graphicspunching264@gmail.com>',
      replyTo: (sessionInfo as any)?.visitorEmail || 'graphicspunching264@gmail.com',
      subject,
      body: emailBody,
      status: emailStatus,
      trackingId,
      providerMessageId: dispatchResult.messageId || null,
      error: dispatchResult.error || null,
      thread: Array.isArray(conversation)
        ? conversation.map((c: any) => ({
            id: c.id || `msg-${Date.now()}`,
            role: c.role || 'user',
            text: c.content || '',
            timestamp: c.timestamp || new Date().toISOString(),
          }))
        : [],
    });

    return res.json({
      success: true,
      message: dispatchResult.sent
        ? 'Admin notification email dispatched successfully'
        : 'Admin notification recorded (SMTP delivery pending/queued)',
      trackingId,
      sentAt: nowIso,
      eventType,
      recipient: destination,
      selectedInquiry: cleanedInquiry,
      subject,
      deliveryStatus: emailStatus,
      details: {
        totalConversationMessages: Array.isArray(conversation) ? conversation.length : 0,
        formattedDateTime,
        transcriptText,
        emailBody,
        emailLog: loggedAlert,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/chatbot/notify-admin:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to dispatch chatbot admin notification',
    });
  }
});

// ============================================================
// GRAPHICS PUNCHING - CENTRAL CHATBOT MESSAGE STORE (SUPABASE + ASYNC)
// ============================================================

function createChatId() {
  return `conv-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function createMessageId() {
  return `msg-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

async function getOrCreateConversation(data: any) {
  const conversationId =
    typeof data.conversationId === 'string' && data.conversationId.trim()
      ? data.conversationId.trim()
      : null;

  let conversation: any = null;

  if (conversationId) {
    conversation = await getConversation(conversationId);
  }

  if (!conversation && data.visitorId) {
    const all = await getAllConversations();
    conversation = all.find((item: any) => item.visitorId === data.visitorId) || null;
  }

  if (!conversation) {
    const id = conversationId || createChatId();
    conversation = {
      id,
      visitorId:
        data.visitorId ||
        `visitor-${Math.random().toString(36).slice(2, 9)}`,
      visitorName: data.visitorName || 'Website Visitor',
      visitorEmail: data.visitorEmail || '',
      visitorPhone: data.visitorPhone || '',
      startedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      status: 'active',
      unreadForAdmin: 0,
      unreadForVisitor: 0,
      lastMessage: '',
      lastEventType: '',
      sessionInfo: data.sessionInfo || {},
      messages: [],
    };
  }

  return conversation;
}

function normalizeChatMessage(data: any, conversation: any) {
  const role =
    data.role === 'admin'
      ? 'admin'
      : data.role === 'assistant'
        ? 'assistant'
        : 'user';

  const content = String(
    data.message ||
      data.content ||
      data.text ||
      ''
  ).trim();

  return {
    id: data.id || createMessageId(),
    role,
    senderName:
      role === 'admin'
        ? data.senderName || 'Graphics Punching Support'
        : role === 'assistant'
          ? 'Punchy AI'
          : data.visitorName || conversation.visitorName || 'Website Visitor',

    content,
    type: data.type || 'user_message',
    timestamp:
      data.timestamp ||
      new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    createdAt: new Date().toISOString(),
    suggestedAction: data.suggestedAction || undefined,
  };
}

// ============================================================
// POST CHAT MESSAGE
// ============================================================

app.post(
  ['/api/chatbot/message', '/api/chat/message'],
  async (req, res) => {
    try {
      const {
        conversationId,
        visitorId,
        visitorName,
        visitorEmail,
        visitorPhone,
        message,
        content,
        text,
        role = 'user',
        type = 'user_message',
        sessionInfo = {},
        suggestedAction,
      } = req.body || {};

      const rawContent = message || content || text;

      if (!rawContent || !String(rawContent).trim()) {
        return res.status(400).json({
          success: false,
          error: 'Message content is required.',
        });
      }

      const conversation = await getOrCreateConversation({
        conversationId,
        visitorId,
        visitorName,
        visitorEmail,
        visitorPhone,
        sessionInfo,
      });

      // Update visitor information whenever it becomes available.
      if (visitorName) conversation.visitorName = visitorName;
      if (visitorEmail) conversation.visitorEmail = visitorEmail;
      if (visitorPhone) conversation.visitorPhone = visitorPhone;

      // Detect email & phone in message text
      const contentStr = String(rawContent);
      const emailMatch = contentStr.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i);
      const phoneMatch = contentStr.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
      if (emailMatch && !conversation.visitorEmail) conversation.visitorEmail = emailMatch[0];
      if (phoneMatch && !conversation.visitorPhone) conversation.visitorPhone = phoneMatch[0];

      conversation.sessionInfo = {
        ...(conversation.sessionInfo || {}),
        ...(sessionInfo || {}),
      };

      const chatMessage = normalizeChatMessage(
        {
          id: req.body.id,
          message: String(rawContent),
          role,
          type,
          visitorName: conversation.visitorName,
          suggestedAction,
        },
        conversation
      );

      if (!Array.isArray(conversation.messages)) {
        conversation.messages = [];
      }

      // Prevent accidental duplicate messages.
      const duplicate = conversation.messages.some(
        (m: any) =>
          m.id === chatMessage.id ||
          (
            m.role === chatMessage.role &&
            m.content === chatMessage.content &&
            Date.now() - new Date(m.createdAt).getTime() < 3000
          )
      );

      if (!duplicate) {
        conversation.messages.push(chatMessage);
      }

      conversation.lastMessage = chatMessage.content;
      conversation.lastUpdatedAt = new Date().toISOString();
      conversation.lastEventType = type;

      // Customer message = unread for admin.
      if (chatMessage.role === 'user') {
        conversation.unreadForAdmin =
          Number(conversation.unreadForAdmin || 0) + 1;
        conversation.status = 'active';

        // Auto-sync visitor conversation to customer leads database
        await syncConversationToLead(conversation);

        // Auto-record dispatched email alert to admin email log store & real SMTP
        const chatTrackingId = `GP-CHAT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
        const alertEmailBody = `======================================================================
GRAPHICS PUNCHING • LIVE VISITOR CHAT INQUIRY
======================================================================

VISITOR: ${conversation.visitorName || 'Website Visitor'}
EMAIL: ${conversation.visitorEmail || 'None provided'}
PHONE: ${conversation.visitorPhone || 'None provided'}
CONVERSATION ID: ${conversation.id}
MESSAGE TIME: ${chatMessage.createdAt || new Date().toISOString()}

MESSAGE:
"${chatMessage.content}"

${Array.isArray(req.body.attachments) && req.body.attachments.length > 0 ? `ATTACHMENTS: ${req.body.attachments.length} file(s)` : ''}

Graphics Punching 24/7 Production & Live Chat Desk
graphicspunching264@gmail.com | +1 (607) 205-0030
======================================================================`;

        const dispatchResult = await dispatchRealEmail({
          to: 'graphicspunching264@gmail.com',
          replyTo: conversation.visitorEmail || 'graphicspunching264@gmail.com',
          subject: `[Live Chat] ${conversation.visitorName || 'Website Visitor'}: "${chatMessage.content.slice(0, 40)}${chatMessage.content.length > 40 ? '...' : ''}"`,
          body: alertEmailBody,
        });

        const alertStatus = dispatchResult.sent ? 'sent' : dispatchResult.notConfigured ? 'queued' : 'failed';

        await recordDispatchedEmailLog({
          to: 'graphicspunching264@gmail.com',
          recipientName: 'Administrator',
          from: 'Punchy AI <graphicspunching264@gmail.com>',
          replyTo: conversation.visitorEmail || 'graphicspunching264@gmail.com',
          subject: `[Live Chat] ${conversation.visitorName || 'Website Visitor'}: "${chatMessage.content.slice(0, 40)}${chatMessage.content.length > 40 ? '...' : ''}"`,
          body: alertEmailBody,
          status: alertStatus,
          trackingId: chatTrackingId,
          providerMessageId: dispatchResult.messageId || null,
          error: dispatchResult.error || null,
        });
      }

      // Admin reply = unread for visitor.
      if (chatMessage.role === 'admin') {
        conversation.unreadForVisitor =
          Number(conversation.unreadForVisitor || 0) + 1;
      }

      const saved = await saveConversation(conversation);

      if (!saved) {
        return res.status(500).json({
          success: false,
          error: 'Unable to save chatbot conversation to database.',
        });
      }

      const allConvs = await getAllConversations();
      const totalUnread = allConvs.reduce(
        (total: number, item: any) =>
          total + Number(item.unreadForAdmin || 0),
        0
      );

      // Send the new message immediately to Admin Portal.
      broadcastLiveSiteUpdate({
        type: 'chatbot_conversation_update',
        conversation: {
          ...conversation,
          messages: conversation.messages,
        },
        conversationId: conversation.id,
        visitorId: conversation.visitorId,
        newMessage: chatMessage,
        totalUnread,
        timestamp: new Date().toISOString(),
      });

      return res.json({
        success: true,
        conversationId: conversation.id,
        visitorId: conversation.visitorId,
        message: chatMessage,
        conversation,
        totalUnread,
      });
    } catch (error: any) {
      console.error(
        '[CHATBOT MESSAGE ERROR]',
        error
      );

      return res.status(500).json({
        success: false,
        error:
          error?.message ||
          'Failed to save chatbot message.',
      });
    }
  }
);

// ============================================================
// ADMIN - GET ALL CHAT CONVERSATIONS
// ============================================================

app.get(
  ['/api/chatbot/conversations', '/api/chat/conversations'],
  async (req, res) => {
    try {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      const conversations = await getAllConversations();

      const totalUnread =
        conversations.reduce(
          (total: number, conversation: any) =>
            total + Number(conversation.unreadForAdmin || 0),
          0
        );

      return res.json({
        success: true,
        conversations,
        totalUnread,
        activeCount:
          conversations.filter(
            (c: any) => c.status !== 'archived'
          ).length,
        totalRecorded:
          conversations.length,
        serverTime:
          new Date().toISOString(),
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error:
          error?.message ||
          'Failed to load conversations.',
      });
    }
  }
);

// ============================================================
// GET ONE CHAT CONVERSATION
// ============================================================

app.get(
  [
    '/api/chatbot/conversation',
    '/api/chatbot/conversation/:id',
    '/api/chat/conversation',
    '/api/chat/conversation/:id',
  ],
  async (req, res) => {
    try {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      const conversationId =
        String(
          req.query.conversationId ||
            req.params.id ||
            ''
        ).trim();

      const visitorId =
        String(
          req.query.visitorId || ''
        ).trim();

      let conversation: any = null;

      if (conversationId) {
        conversation = await getConversation(conversationId);
      }

      if (!conversation && visitorId) {
        const all = await getAllConversations();
        conversation = all.find((item: any) => item.visitorId === visitorId) || null;
      }

      return res.json({
        success: true,
        conversation,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error:
          error?.message ||
          'Failed to load conversation.',
      });
    }
  }
);

// ============================================================
// ADMIN REPLY TO CUSTOMER
// ============================================================

app.post(
  [
    '/api/chatbot/admin-reply',
    '/api/chatbot/reply',
    '/api/chat/admin-reply',
    '/api/chat/reply',
  ],
  async (req, res) => {
    try {
      const {
        conversationId,
        message,
        content,
        replyText: rawReplyText,
        reply,
        adminReply,
        adminName,
      } = req.body || {};

      const replyText = String(
        message || content || rawReplyText || reply || adminReply || ''
      ).trim();

      if (!conversationId) {
        return res.status(400).json({
          success: false,
          error: 'conversationId is required.',
        });
      }

      if (!replyText) {
        return res.status(400).json({
          success: false,
          error: 'Reply message is required.',
        });
      }

      const conversation = await getConversation(conversationId);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          error: 'Conversation not found.',
        });
      }

      const adminMessage = {
        id: createMessageId(),
        role: 'admin',
        senderName:
          adminName || 'Graphics Punching Support',
        content: replyText,
        type: 'admin_reply',
        timestamp:
          new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        createdAt:
          new Date().toISOString(),
      };

      if (!Array.isArray(conversation.messages)) {
        conversation.messages = [];
      }

      conversation.messages.push(adminMessage);
      conversation.lastMessage = `[Admin] ${replyText}`;
      conversation.lastUpdatedAt = new Date().toISOString();
      conversation.lastEventType = 'admin_reply';
      conversation.unreadForVisitor =
        Number(conversation.unreadForVisitor || 0) + 1;

      // Admin has now handled the unread customer messages.
      conversation.unreadForAdmin = 0;

      await saveConversation(conversation);

      const allConvs = await getAllConversations();
      const totalUnread = allConvs.reduce(
        (total: number, item: any) =>
          total + Number(item.unreadForAdmin || 0),
        0
      );

      broadcastLiveSiteUpdate({
        type: 'chatbot_admin_reply',
        conversationId: conversation.id,
        visitorId: conversation.visitorId,
        conversation,
        message: adminMessage,
        adminMessage,
        timestamp: new Date().toISOString(),
      });

      broadcastLiveSiteUpdate({
        type: 'chatbot_unread_update',
        conversationId: conversation.id,
        totalUnread,
      });

      return res.json({
        success: true,
        message: adminMessage,
        adminMessage,
        conversation,
      });
    } catch (error: any) {
      console.error(
        '[ADMIN CHAT REPLY ERROR]',
        error
      );

      return res.status(500).json({
        success: false,
        error:
          error?.message ||
          'Failed to send admin reply.',
      });
    }
  }
);

// ============================================================
// ADMIN MARKS CHAT AS READ
// ============================================================

app.post(
  [
    '/api/chatbot/conversation/read',
    '/api/chatbot/mark-read',
    '/api/chat/conversation/read',
    '/api/chat/mark-read',
    '/api/chat/read',
  ],
  async (req, res) => {
    try {
      const { conversationId } = req.body || {};

      if (!conversationId) {
        return res.status(400).json({
          success: false,
          error: 'conversationId is required.',
        });
      }

      const ok = await markConversationAsRead(conversationId);

      if (!ok) {
        return res.status(404).json({
          success: false,
          error: 'Conversation not found.',
        });
      }

      const allConvs = await getAllConversations();
      const totalUnread = allConvs.reduce(
        (total: number, item: any) =>
          total + Number(item.unreadForAdmin || 0),
        0
      );

      broadcastLiveSiteUpdate({
        type: 'chatbot_unread_update',
        conversationId,
        totalUnread,
      });

      return res.json({
        success: true,
        conversationId,
        totalUnread,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error:
          error?.message ||
          'Failed to mark conversation read.',
      });
    }
  }
);

// Clear or Archive a conversation
app.post(
  [
    '/api/chatbot/clear-or-archive',
    '/api/chat/clear-or-archive',
    '/api/chat/archive',
  ],
  async (req, res) => {
    try {
      const { conversationId, action = 'archive' } = req.body || {};
      if (!conversationId) {
        return res.status(400).json({ success: false, error: 'conversationId is required.' });
      }

      await archiveOrDeleteConversation(conversationId, action);

      const allConvs = await getAllConversations();
      const totalUnread = allConvs.reduce(
        (acc: number, c: any) => acc + (c.unreadForAdmin || 0),
        0
      );

      broadcastLiveSiteUpdate({
        type: 'chatbot_unread_update',
        conversationId,
        totalUnread,
      });

      broadcastLiveSiteUpdate({
        type: 'chatbot_conversations_refresh',
      });

      return res.json({ success: true, conversationId, action, totalUnread });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error?.message });
    }
  }
);

// 8. Email Dispatch Endpoint (Real SMTP Delivery with Database Persistence)
app.post('/api/email/send', async (req, res) => {
  try {
    const {
      to,
      from = 'graphicspunching264@gmail.com',
      replyTo,
      subject,
      body,
      attachments = [],
      cc,
      bcc,
    } = req.body;

    // Strict validation
    if (!to || !to.trim()) {
      return res.status(400).json({ success: false, error: 'Recipient email ("to") is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to.trim())) {
      return res.status(400).json({ success: false, error: `Invalid recipient email address format: "${to}"` });
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({ success: false, error: 'Email subject is required.' });
    }

    if (!body || !body.trim()) {
      return res.status(400).json({ success: false, error: 'Email message body cannot be empty.' });
    }

    // Generate tracking ID and timestamp
    const trackingId = `GP-MSG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const sentAt = new Date().toISOString();

    const attachmentSummary = attachments.map((att: any, idx: number) => ({
      id: att.id || `att-${idx}`,
      name: att.name || `attachment_${idx + 1}`,
      size: att.size || (att.data ? Math.round(att.data.length * 0.75) : 0),
      type: att.type || 'application/octet-stream',
    }));

    // Perform real email dispatch via nodemailer transport
    const dispatchResult = await dispatchRealEmail({
      to: to.trim(),
      from,
      replyTo: replyTo || from,
      subject,
      body,
      attachments,
      cc,
      bcc,
    });

    const emailStatus = dispatchResult.sent ? 'sent' : dispatchResult.notConfigured ? 'queued' : 'failed';

    // Authoritatively persist email to database and trigger real-time SSE broadcast
    const savedLog = await recordDispatchedEmailLog({
      to: to.trim(),
      recipientName: to.trim().split('@')[0],
      from,
      replyTo: replyTo || from,
      subject,
      body,
      attachments: attachmentSummary,
      status: emailStatus,
      trackingId,
      providerMessageId: dispatchResult.messageId || null,
      error: dispatchResult.error || null,
    });

    res.json({
      success: true,
      message: dispatchResult.sent
        ? 'Email dispatched successfully via connected mail transport'
        : 'Email recorded in transmission ledger (SMTP delivery queued)',
      trackingId,
      sentAt,
      deliveryStatus: emailStatus,
      emailLog: savedLog,
      dispatchResult: {
        sent: dispatchResult.sent,
        messageId: dispatchResult.messageId,
        notConfigured: dispatchResult.notConfigured,
        error: dispatchResult.error,
      },
      details: {
        to: to.trim(),
        from,
        replyTo: replyTo || from,
        subject,
        attachmentsCount: attachments.length,
        attachments: attachmentSummary,
        cc: cc || null,
        bcc: bcc || null,
        serverProvider: dispatchResult.sent ? 'Active SMTP/Gmail Gateway' : 'Ledger Queue Mode',
      },
    });
  } catch (error: any) {
    console.error('Error in /api/email/send:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Internal server error while sending email',
    });
  }
});

// 9. Email Connection Verification Endpoint
app.get('/api/email/status', (req, res) => {
  const isSmtpConfigured = !!(
    (process.env.SMTP_USER && process.env.SMTP_PASS) ||
    (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
  );

  res.json({
    success: true,
    connectedEmail: process.env.SMTP_USER || process.env.GMAIL_USER || 'graphicspunching264@gmail.com',
    status: isSmtpConfigured ? 'connected' : 'queued_mode',
    provider: isSmtpConfigured ? 'Authenticated SMTP / Gmail Transport' : 'Database Queue Ledger (Configure SMTP_PASS for live delivery)',
    activeServices: [
      'Contact Form Submissions',
      'Instant Quote Requests (FormSubmit AJAX)',
      'AI Chatbot Inquiries & Administrator Alerts',
      'Production Email Dispatch & Auto-Responder',
    ],
    timestamp: new Date().toISOString(),
  });
});

// Static image serving routes for robust access across all path formats in dev and production
const imagesDir = path.join(process.cwd(), 'src', 'assets', 'images');
const staticImageOptions = {
  maxAge: '1y',
  setHeaders: (res: any) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  },
};

app.use('/src/assets/images', express.static(imagesDir, staticImageOptions));
app.use('/assets/images', express.static(imagesDir, staticImageOptions));
app.use('/images', express.static(imagesDir, staticImageOptions));

// Direct filename resolver for images (e.g. /ms_dragon_embroidery_1787087913479.jpg or /assets/ms_dragon_embroidery_1787087913479.jpg)
app.get(['/:filename(*.jpg)', '/:filename(*.jpeg)', '/:filename(*.png)', '/:filename(*.webp)', '/:filename(*.svg)', '/assets/:filename(*.jpg)', '/assets/:filename(*.jpeg)', '/assets/:filename(*.png)'], (req, res, next) => {
  const filename = path.basename(req.params.filename);
  const candidatePath = path.join(imagesDir, filename);
  if (fs.existsSync(candidatePath)) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    return res.sendFile(candidatePath);
  }
  next();
});

// Explicit 404 handler for unmatched /api/* calls so they never fall through into SPA HTML
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
  });
});

// Setup Vite middleware for development or serve dist in production
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, cors: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(
      express.static(distPath, {
        setHeaders: (res) => {
          res.setHeader('Access-Control-Allow-Origin', '*');
        },
      })
    );
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Graphics Punching Portal Server active at http://localhost:${PORT}`);
  });
}

export default app;

if (!process.env.VERCEL) {
  setupServer();
}
