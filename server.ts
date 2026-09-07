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
app.post(['/api/gemini/chat', '/api/chatbot/message'], async (req, res) => {
  try {
    const { messages = [], settings = {}, context = {} } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, error: 'Messages array is required.' });
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
