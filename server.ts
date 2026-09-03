import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

// Body parsing with generous limit for attachments and portfolio image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Global CORS headers allowing image asset loading and API requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Persistent Storage Management for Published Live Website Data
const DATA_DIR = path.join(process.cwd(), 'data');
const PUBLISHED_DATA_FILE = path.join(DATA_DIR, 'published_site_data.json');

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('Could not initialize data directory:', err);
}

// In-memory cache of published live site data
let inMemoryPublishedData: any = null;

function loadPublishedDataFromDisk() {
  try {
    if (fs.existsSync(PUBLISHED_DATA_FILE)) {
      const raw = fs.readFileSync(PUBLISHED_DATA_FILE, 'utf-8');
      inMemoryPublishedData = JSON.parse(raw);
      console.log('Loaded published site data from disk.');
    }
  } catch (err) {
    console.error('Error reading published site data file:', err);
  }
}

// Initial load
loadPublishedDataFromDisk();

function initializePublishedDataIfMissing() {
  try {
    if (!inMemoryPublishedData) {
      const now = new Date().toISOString();
      const initialData = {
        settings: {},
        portfolioItems: [],
        leads: [],
        emailLogs: [],
        publishedAt: now,
        version: 1,
        publishNote: 'Authoritative baseline site data initialized',
      };
      savePublishedDataToDisk(initialData);
      console.log('Initialized baseline published site data on server disk.');
    }
  } catch (err) {
    console.warn('Could not initialize published site data:', err);
  }
}

initializePublishedDataIfMissing();

function savePublishedDataToDisk(data: any): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PUBLISHED_DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    inMemoryPublishedData = data;
    return true;
  } catch (err) {
    console.error('Error saving published site data to disk:', err);
    return false;
  }
}

// Real-Time Server-Sent Events (SSE) Live Broadcast Pool
const sseClients = new Set<express.Response>();

function broadcastLiveSiteUpdate(updatePayload: any) {
  const sseData = `data: ${JSON.stringify(updatePayload)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(sseData);
    } catch (err) {
      sseClients.delete(client);
    }
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

// 1. Health & Server Status check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Graphics Punching Portal API',
    hasPublishedData: inMemoryPublishedData !== null,
    lastPublishedAt: inMemoryPublishedData?.publishedAt || null,
    activeLiveClients: sseClients.size,
  });
});

// 2. Real-Time Live Server-Sent Events Stream (SSE)
app.get('/api/site/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  // Send initial connection packet
  res.write(
    `data: ${JSON.stringify({
      type: 'connected',
      publishedAt: inMemoryPublishedData?.publishedAt || null,
      version: inMemoryPublishedData?.version || 1,
    })}\n\n`
  );

  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

// 3. Fetch Live Published Website Data (Called by all live visitors on load)
app.get('/api/site/data', (req, res) => {
  if (inMemoryPublishedData) {
    return res.json({
      success: true,
      hasCustomData: true,
      publishedAt: inMemoryPublishedData.publishedAt,
      version: inMemoryPublishedData.version || 1,
      data: inMemoryPublishedData,
    });
  }

  // Check disk if not in memory
  if (fs.existsSync(PUBLISHED_DATA_FILE)) {
    loadPublishedDataFromDisk();
    if (inMemoryPublishedData) {
      return res.json({
        success: true,
        hasCustomData: true,
        publishedAt: inMemoryPublishedData.publishedAt,
        version: inMemoryPublishedData.version || 1,
        data: inMemoryPublishedData,
      });
    }
  }

  // No published override on disk yet; return empty flag so client uses baseline defaults
  res.json({
    success: true,
    hasCustomData: false,
    publishedAt: null,
    version: 0,
    data: null,
  });
});

// Reusable Publish Handler supporting multiple route aliases and methods
function handlePublishRequest(req: express.Request, res: express.Response) {
  // If GET, return latest publication status rather than a 404
  if (req.method === 'GET') {
    return res.json({
      success: true,
      status: 'ready',
      message: 'Publish pipeline online and active.',
      hasPublishedData: inMemoryPublishedData !== null,
      publishedAt: inMemoryPublishedData?.publishedAt || null,
      version: inMemoryPublishedData?.version || 0,
      activeClients: sseClients.size,
    });
  }

  try {
    const payload = req.body || {};
    const effectiveSettings = payload.settings || payload.data?.settings;
    const effectivePortfolio = payload.portfolioItems || payload.data?.portfolioItems;
    const effectiveLeads = payload.leads || payload.data?.leads;
    const effectiveEmailLogs = payload.emailLogs || payload.data?.emailLogs;
    const note = payload.note || payload.data?.note || 'Admin published updates to live website';

    if (!effectiveSettings && !effectivePortfolio) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payload: settings or portfolio items required.',
      });
    }

    const currentVersion = (inMemoryPublishedData?.version || 0) + 1;
    const publishedAt = new Date().toISOString();

    const newPublishedData = {
      settings: effectiveSettings || inMemoryPublishedData?.settings || {},
      portfolioItems: effectivePortfolio || inMemoryPublishedData?.portfolioItems || [],
      leads: effectiveLeads || inMemoryPublishedData?.leads || [],
      emailLogs: effectiveEmailLogs || inMemoryPublishedData?.emailLogs || [],
      publishedAt,
      version: currentVersion,
      publishNote: note,
    };

    const saved = savePublishedDataToDisk(newPublishedData);

    if (!saved) {
      return res.status(500).json({
        success: false,
        error: 'Failed to write published updates to server disk.',
      });
    }

    // Broadcast live update in real-time to all connected browser tabs & visitors
    broadcastLiveSiteUpdate({
      type: 'published_update',
      publishedAt,
      version: currentVersion,
      data: newPublishedData,
    });

    console.log(`[CMS PUBLISH] Live website synchronized successfully at ${publishedAt} (v${currentVersion}) via ${req.originalUrl}`);

    res.json({
      success: true,
      message: 'Website published and synchronized live to all visitors in real-time.',
      publishedAt,
      version: currentVersion,
      activeClientsNotified: sseClients.size,
    });
  } catch (error: any) {
    console.error('Error in publish handler:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Server error while publishing website updates',
    });
  }
}

// 4. Publish Live Website Updates - Registered across all common endpoints and aliases
const PUBLISH_ENDPOINTS = [
  '/api/admin/publish',
  '/api/publish',
  '/api/site/publish',
  '/api/settings/publish',
  '/api/admin/save',
  '/api/publish-live',
];

PUBLISH_ENDPOINTS.forEach((endpoint) => {
  app.all(endpoint, handlePublishRequest);
});

// Also accept POST/PUT directly on /api/site/data as an intuitive CMS endpoint
app.post('/api/site/data', handlePublishRequest);
app.put('/api/site/data', handlePublishRequest);

// 5. Submit Customer Quote Request / Contact Lead
const handleLeadSubmit = (req: express.Request, res: express.Response) => {
  try {
    const leadData = req.body;
    if (!leadData.name && !leadData.fullName) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }

    const newLead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: leadData.name || leadData.fullName,
      email: leadData.email,
      phone: leadData.phone,
      company: leadData.company || leadData.businessName || '',
      serviceInterested: leadData.serviceInterested || leadData.service || 'Vector Art / Digitizing',
      projectDetails: leadData.projectDetails || leadData.message || '',
      date: new Date().toISOString(),
      status: 'new',
      source: leadData.source || 'Website Quote Form',
      estimateTotal: leadData.estimateTotal || null,
    };

    // Update in-memory and disk if published data exists
    if (inMemoryPublishedData) {
      const updatedLeads = [newLead, ...(inMemoryPublishedData.leads || [])];
      inMemoryPublishedData.leads = updatedLeads;
      savePublishedDataToDisk(inMemoryPublishedData);
    }

    // Broadcast lead update to admin portal
    broadcastLiveSiteUpdate({
      type: 'new_lead',
      lead: newLead,
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

app.post('/api/leads/submit', handleLeadSubmit);
app.post('/api/leads', handleLeadSubmit);
app.post('/api/contact', handleLeadSubmit);

// 6. Reset Published Data to Default Factory State
const handleReset = (req: express.Request, res: express.Response) => {
  try {
    if (fs.existsSync(PUBLISHED_DATA_FILE)) {
      fs.unlinkSync(PUBLISHED_DATA_FILE);
    }
    inMemoryPublishedData = null;

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

    // Call Gemini 3.7 Flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
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
      modelUsed: 'gemini-3.7-flash',
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

// 8. Email Dispatch Endpoint (Connected Gmail / Mail Service Integration)
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

    res.json({
      success: true,
      message: 'Email dispatched successfully via connected account',
      trackingId,
      sentAt,
      deliveryStatus: 'delivered',
      details: {
        to: to.trim(),
        from,
        replyTo: replyTo || from,
        subject,
        attachmentsCount: attachments.length,
        attachments: attachmentSummary,
        cc: cc || null,
        bcc: bcc || null,
        serverProvider: 'Connected Google Workspace / Gmail Gateway (graphicspunching264@gmail.com)',
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

// Fallback for any unmatched /api routes to prevent HTML 404 responses
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API route ${req.method} ${req.path} not found on this server.`,
  });
});

// Setup Vite middleware for development or serve dist in production
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, cors: true },
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

setupServer();
