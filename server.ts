import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

// Body parsing with generous limit for attachments and portfolio image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
    'Connection': 'keep-alive',
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

// 4. Publish Live Website Updates (Called from Admin Portal)
app.post('/api/admin/publish', (req, res) => {
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

    console.log(`[CMS PUBLISH] Live website synchronized successfully at ${publishedAt} (v${currentVersion})`);

    res.json({
      success: true,
      message: 'Website published and synchronized live to all visitors in real-time.',
      publishedAt,
      version: currentVersion,
      activeClientsNotified: sseClients.size,
    });
  } catch (error: any) {
    console.error('Error in /api/admin/publish:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Server error while publishing website updates',
    });
  }
});

// 5. Submit Customer Quote Request / Contact Lead
app.post('/api/leads/submit', (req, res) => {
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
});

// 6. Reset Published Data to Default Factory State
app.post('/api/admin/reset', (req, res) => {
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
      message: 'Published data successfully reset to factory defaults.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to reset data on server' });
  }
});

// 2. AI Email Assistant Endpoint
app.post('/api/gemini/email-assistant', async (req, res) => {
