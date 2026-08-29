import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Send,
  Paperclip,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  MessageSquare,
  Mail,
  User,
  ShieldCheck,
  AlertCircle,
  FileText,
  Clock,
  ArrowRight,
  ChevronDown,
  Layers,
  Wand2,
  CheckCircle2,
  Maximize2,
  FileSpreadsheet,
  FileCode,
  FileImage,
} from 'lucide-react';
import { useWebsiteSettings } from '../../context/AdminSettingsContext';
import { EmailAttachment, EmailLog } from '../../types/admin';

interface EmailAssistantResponse {
  subject?: string;
  body?: string;
  subjects?: string[];
}

export const EmailChatbotWorkspace: React.FC = () => {
  const { settings, leads, addEmailLog, emailLogs } = useWebsiteSettings();

  // Assistant & Chat State
  const [instruction, setInstruction] = useState('');
  const [tone, setTone] = useState<string>('professional & persuasive');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiHistory, setAiHistory] = useState<
    Array<{ id: string; role: 'user' | 'assistant'; text: string; timestamp: string }>
  >([
    {
      id: 'msg-init',
      role: 'assistant',
      text: `Hello! I am your Graphics Punching AI Email Assistant. I can draft quotes, vector delivery messages, stitch proof worksheets, and follow-ups. Tell me what you'd like to compose or pick a template accelerator below.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Composer Form State
  const [to, setTo] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [previewTab, setPreviewTab] = useState<'editor' | 'rendered'>('editor');
  const [attachments, setAttachments] = useState<EmailAttachment[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccessToast, setSendSuccessToast] = useState<{
    show: boolean;
    trackingId: string;
    recipient: string;
  }>({ show: false, trackingId: '', recipient: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [subjectAlternatives, setSubjectAlternatives] = useState<string[]>([]);
  const [isGeneratingSubjects, setIsGeneratingSubjects] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Quick Prompt Chips
  const promptAccelerators = [
    {
      label: '⚡ 3D Puff Snapback Quote',
      prompt: 'Draft an urgent, professional quote for 3D puff embroidery digitizing on structured snapback caps ($15, Tajima DST & Wilcom EMB files, 4-hour express delivery).',
      defaultTo: 'm.henderson@apexathletics.com',
      defaultName: 'Michael Henderson',
      defaultSubject: 'Your 3D Puff Cap Digitizing Quote - Graphics Punching',
    },
    {
      label: '📦 Vector Artwork Delivery',
      prompt: 'Write an email delivering completed manual vector redraw files (.AI, .EPS, .PDF, 300 DPI transparent PNG). Highlight 100% clean Bézier nodes, zero auto-trace, and free minor adjustments.',
      defaultTo: 'david@lonestarprint.com',
      defaultName: 'David Torres',
      defaultSubject: 'Production-Ready Vector Artwork Master Files - Graphics Punching',
    },
    {
      label: '🧵 Stitch Proof Ready (DST/EMB)',
      prompt: 'Draft an email notifying the client that their left-chest embroidery digitizing proof (14,500 stitches) is ready for test sewout. Mention calibrated pull compensation and center-out pathing.',
      defaultTo: 'emily@coastlinemerch.com',
      defaultName: 'Emily Watson',
      defaultSubject: 'Embroidery Digitizing Proof & Thread Run Worksheet #GP-884',
    },
    {
      label: '🎨 Simulated Process Films Delivery',
      prompt: 'Write an email delivering 6-color simulated process color separations for black garments with Pantone solid coated callouts, white underbase channel, and film positives.',
      defaultTo: 'sjenkins@urbanthreadprint.com',
      defaultName: 'Sarah Jenkins',
      defaultSubject: 'Simulated Process Color Separations Complete - Film Positives Attached',
    },
    {
      label: '🔍 High-Res Artwork Request',
      prompt: 'Politely inform a customer that their uploaded photo is low resolution (72 DPI thumbnail) and request an original high-resolution logo or sketch so our vector artists can redraw it with zero distortion.',
      defaultTo: 'client@apparelshop.com',
      defaultName: 'Valued Client',
      defaultSubject: 'Artwork Review: High-Resolution File Request for Your Quote',
    },
    {
      label: '💰 Friendly Quote Follow-up',
      prompt: 'Draft a brief, courteous follow-up asking if the client had any questions on the digitizing rate card or wants us to begin digitizing their jacket back order today.',
      defaultTo: '',
      defaultName: '',
      defaultSubject: 'Following up on your custom embroidery inquiry - Graphics Punching',
    },
  ];

  // Preloaded Sample Attachments
  const sampleAttachments: EmailAttachment[] = [
    { id: 'att-sample-1', name: 'Vector_Artwork_Master.ai', size: 1420000, type: 'application/illustrator', isSample: true },
    { id: 'att-sample-2', name: 'Cap_3DPuff_Simulation_Proof.png', size: 854000, type: 'image/png', isSample: true },
    { id: 'att-sample-3', name: 'Machine_Stitch_Data_Tajima.dst', size: 184000, type: 'application/octet-stream', isSample: true },
    { id: 'att-sample-4', name: 'Graphics_Punching_Price_Schedule.pdf', size: 320000, type: 'application/pdf', isSample: true },
  ];

  // Gemini AI Assistant Call
  const handleGenerateAiEmail = async (customPrompt?: string, actionType = 'draft') => {
    const promptToUse = customPrompt || instruction;
    if (!promptToUse && !body) return;

    setIsGenerating(true);
    setErrorMessage('');

    // Add user message to local chat log
    const userMsgId = `user-${Date.now()}`;
    if (promptToUse) {
      setAiHistory((prev) => [
        ...prev,
        {
          id: userMsgId,
          role: 'user',
          text: promptToUse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }

    try {
      const response = await fetch('/api/gemini/email-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionType,
          instruction: promptToUse,
          currentDraft: body,
          recipient: to,
          recipientName: recipientName,
          subject: subject,
          tone: tone,
          context: {
            connectedEmail: settings.emailSettings.connectedEmail,
            companyPhone: settings.contact.phone,
            primaryServices: 'Vector Redraws, Embroidery Digitizing, Screen Printing Color Separation',
          },
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const result: EmailAssistantResponse = data.data;

        if (result.subject && !subject) {
          setSubject(result.subject);
        }

        if (result.body) {
          setBody(result.body);
        }

        // Add assistant reply to conversation
        setAiHistory((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            text: `Generated email draft in ${tone} tone with subject: "${result.subject || subject}". The composer has been populated.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setInstruction('');
      } else {
        throw new Error(data.error || 'Failed to generate email');
      }
    } catch (err: any) {
      console.error('Error generating AI email:', err);
      // Fallback local intelligent generator if offline
      const fallbackDraft = `Hello ${recipientName || 'there'},\n\nThank you for choosing Graphics Punching. Regarding your project inquiry:\n\n${promptToUse}\n\nOur master vector artists and digitizers are ready to produce your machine-tested files with guaranteed 2-6 hour express turnaround.\n\nPlease reply directly to this email if you would like us to begin production right away.\n\nBest regards,\nProduction & Support Team\nGraphics Punching\nPhone: ${settings.contact.phone}\nEmail: ${settings.emailSettings.connectedEmail}`;

      setBody(fallbackDraft);
      if (!subject) {
        setSubject(`Graphics Punching Project Update: ${recipientName || 'Valued Client'}`);
      }

      setAiHistory((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          text: `Draft generated (Local Fast Engine). You can edit details in the composer panel.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Generate Subject Alternatives
  const handleGenerateSubjectAlternatives = async () => {
    setIsGeneratingSubjects(true);
    try {
      const response = await fetch('/api/gemini/email-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'suggest_subjects',
          instruction: subject || body || 'Graphics Punching quote and file delivery',
          tone: tone,
        }),
      });
      const resData = await response.json();
      if (resData.success && resData.data?.subjects) {
        setSubjectAlternatives(resData.data.subjects);
      } else {
        setSubjectAlternatives([
          `⚡ Fast Turnaround: Your Graphics Punching Quote is Ready`,
          `Production Master Files: Review Your Digitizing Proof`,
          `Urgent Update: Next Steps for Your Custom Artwork Redraw`,
          `Graphics Punching Express Dispatch & Order Confirmation`,
          `Your Custom Embroidery Digitizing Worksheet is Attached`,
        ]);
      }
    } catch {
      setSubjectAlternatives([
        `⚡ Fast Turnaround: Your Graphics Punching Quote is Ready`,
        `Production Master Files: Review Your Digitizing Proof`,
        `Urgent Update: Next Steps for Your Custom Artwork Redraw`,
      ]);
    } finally {
      setIsGeneratingSubjects(false);
    }
  };

  // Handle File Attachments
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: EmailAttachment[] = Array.from(files).map((f: File) => ({
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: f.name,
      size: f.size,
      type: f.type || 'application/octet-stream',
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const addPresetSampleAttachment = (sample: EmailAttachment) => {
    if (!attachments.some((a) => a.name === sample.name)) {
      setAttachments((prev) => [...prev, { ...sample, id: `att-${Date.now()}` }]);
    }
  };

  // Send Email Dispatch
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!to.trim()) {
      setErrorMessage('Please specify a recipient email address.');
      return;
    }
    if (!subject.trim()) {
      setErrorMessage('Please provide an email subject line.');
      return;
    }
    if (!body.trim()) {
      setErrorMessage('Please write your email message body.');
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: to.trim(),
          from: settings.emailSettings.connectedEmail,
          replyTo: settings.emailSettings.connectedEmail,
          subject: subject.trim(),
          body: body.trim(),
          attachments: attachments,
          cc: cc.trim() || undefined,
          bcc: bcc.trim() || undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Log to Admin Settings Context History
        const createdLog = addEmailLog({
          to: to.trim(),
          recipientName: recipientName || to.trim(),
          from: settings.emailSettings.connectedEmail,
          replyTo: settings.emailSettings.connectedEmail,
          subject: subject.trim(),
          body: body.trim(),
          attachments: attachments,
          status: 'delivered',
        });

        // Trigger Success Toast
        setSendSuccessToast({
          show: true,
          trackingId: result.trackingId || createdLog.trackingId,
          recipient: to.trim(),
        });

        // Reset composer but keep chat log
        setTo('');
        setRecipientName('');
        setSubject('');
        setBody('');
        setAttachments([]);
        setTimeout(() => {
          setSendSuccessToast({ show: false, trackingId: '', recipient: '' });
        }, 5000);
      } else {
        throw new Error(result.error || 'Failed to dispatch email');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while sending email.');
    } finally {
      setIsSending(false);
    }
  };

  // Copy Body Text Helper
  const handleCopyBody = () => {
    navigator.clipboard.writeText(body);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  // Lead Picker Handler
  const handleSelectLead = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (lead) {
      setTo(lead.email);
      setRecipientName(lead.name);
      setSubject(`Graphics Punching Quote - ${lead.serviceInterested}`);
      setInstruction(`Draft a personalized quote response for ${lead.name} regarding "${lead.serviceInterested}". Notes: ${lead.projectDetails || 'Interested in fast turnaround.'}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Notification Banner */}
      {sendSuccessToast.show && (
        <div className="bg-emerald-500 text-black p-4 rounded-2xl font-bold shadow-2xl flex items-center justify-between animate-slideUp">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="text-sm font-extrabold">
                Email Sent Successfully to {sendSuccessToast.recipient}
              </div>
              <div className="text-xs opacity-90 font-mono">
                Tracking ID: {sendSuccessToast.trackingId} • Sent via Connected Account ({settings.emailSettings.connectedEmail})
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSendSuccessToast({ show: false, trackingId: '', recipient: '' })}
            className="text-xs uppercase bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-lg cursor-pointer font-black"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Connected Account & Gateway Status Header */}
      <div className="bg-[#0e0e11] border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#FFC400]/15 border border-[#FFC400]/30 text-[#FFC400] flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-display font-black text-white uppercase tracking-tight">
                AI Email Chatbot &amp; Gmail Dispatch
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">
                Ready
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Powered by Google Gemini 3.7 Flash &amp; Connected Gmail Gateway: <span className="text-white font-mono">{settings.emailSettings.connectedEmail}</span>
            </p>
          </div>
        </div>

        {/* Quick Customer Leads Autocomplete Dropdown */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <span className="text-xs text-zinc-400 font-bold uppercase">Quick Lead Pick:</span>
          <select
            onChange={(e) => handleSelectLead(e.target.value)}
            defaultValue=""
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs px-3 py-2 rounded-xl focus:border-[#FFC400] focus:outline-none cursor-pointer"
          >
            <option value="" disabled>
              Select customer lead...
            </option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.serviceInterested})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Dual-Panel Workspace: Left AI Chatbot, Right Composer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Conversational AI Assistant & Prompt Accelerator */}
        <div className="lg:col-span-5 bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-5 flex flex-col h-[740px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-850 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#FFC400]" />
              <span className="text-xs font-black uppercase text-white tracking-wider">
                AI Email Copilot
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-zinc-400 uppercase font-bold">Tone:</span>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-white text-[11px] px-2 py-1 rounded-lg focus:outline-none"
              >
                <option value="professional & persuasive">Professional &amp; Persuasive</option>
                <option value="friendly & concise">Friendly &amp; Warm</option>
                <option value="urgent rush turnaround">Rush 2-Hour Express</option>
                <option value="technical machine precision">Technical &amp; Machine Specs</option>
                <option value="diplomatic & polite">Diplomatic &amp; Helpful</option>
              </select>
            </div>
          </div>

          {/* Quick Accelerator Chips */}
          <div className="mb-3 space-y-1.5">
            <div className="text-[10px] font-black uppercase text-zinc-500 tracking-wider flex items-center gap-1">
              <Wand2 className="w-3 h-3 text-[#FFC400]" />
              <span>Prompt Accelerators</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {promptAccelerators.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInstruction(acc.prompt);
                    if (acc.defaultTo && !to) setTo(acc.defaultTo);
                    if (acc.defaultName && !recipientName) setRecipientName(acc.defaultName);
                    if (acc.defaultSubject && !subject) setSubject(acc.defaultSubject);
                    handleGenerateAiEmail(acc.prompt, 'draft');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 text-zinc-300 hover:text-white text-[11px] font-medium transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <span>{acc.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Conversation Thread */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {aiHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#FFC400] text-black font-semibold rounded-tr-none'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[9px] text-zinc-500 font-mono mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isGenerating && (
              <div className="flex items-center gap-2 p-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl rounded-tl-none w-max animate-pulse">
                <Sparkles className="w-4 h-4 text-[#FFC400] animate-spin" />
                <span className="text-xs text-zinc-300 font-medium">Gemini 3.7 Flash composing email...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Prompt Input Form */}
          <div className="mt-3 pt-3 border-t border-zinc-850 space-y-2">
            <div className="relative">
              <textarea
                rows={2}
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerateAiEmail();
                  }
                }}
                placeholder="Instruct AI: e.g. 'Draft a rush quote for 25 left chest embroidery files with Tajima DST output'..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white p-3 pr-10 rounded-xl text-xs resize-none focus:outline-none placeholder:text-zinc-600"
              />
              <button
                type="button"
                disabled={isGenerating || !instruction.trim()}
                onClick={() => handleGenerateAiEmail()}
                className="absolute right-2.5 bottom-3.5 p-1.5 rounded-lg bg-[#FFC400] hover:bg-[#ffcd1a] text-black disabled:opacity-40 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>

            {/* Polish & Rewrite Quick Actions */}
            {body && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleGenerateAiEmail('Make this email more concise, clean, and direct with bullet points', 'rewrite')}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  ✨ Make More Concise
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerateAiEmail('Add technical embroidery & vector file format specifications (DST, PES, EMB, AI, EPS)', 'rewrite')}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  🧵 Add Tech Specs
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Email Composer & Rendered Preview */}
        <div className="lg:col-span-7 bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-5 flex flex-col h-[740px]">
          {/* Header Controls */}
          <div className="flex items-center justify-between border-b border-zinc-850 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#FFC400]" />
              <span className="text-xs font-black uppercase text-white tracking-wider">
                Gmail Dispatch Composer
              </span>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setPreviewTab('editor')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  previewTab === 'editor'
                    ? 'bg-[#FFC400] text-black shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Source Editor
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('rendered')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  previewTab === 'rendered'
                    ? 'bg-[#FFC400] text-black shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Rendered Preview
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSendEmail} className="flex-1 flex flex-col min-h-0 space-y-3.5">
            {/* To & Recipient Name */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-7">
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-zinc-500 font-mono font-bold">
                    To:
                  </span>
                  <input
                    type="email"
                    required
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="recipient@domain.com"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white pl-10 pr-3.5 py-2 rounded-xl text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-zinc-500">
                    <User className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Recipient Name"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-1 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setShowCcBcc(!showCcBcc)}
                  className="text-[11px] font-bold text-zinc-400 hover:text-white uppercase p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 w-full text-center cursor-pointer"
                >
                  CC
                </button>
              </div>
            </div>

            {/* CC / BCC expandable */}
            {showCcBcc && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 animate-fadeIn">
                <input
                  type="email"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  placeholder="CC: email@domain.com"
                  className="bg-zinc-950 border border-zinc-800 text-white px-3 py-1.5 rounded-lg text-xs font-mono"
                />
                <input
                  type="email"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  placeholder="BCC: audit@domain.com"
                  className="bg-zinc-950 border border-zinc-800 text-white px-3 py-1.5 rounded-lg text-xs font-mono"
                />
              </div>
            )}

            {/* Subject Line & AI Alternatives */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase text-zinc-400">Subject</label>
                <button
                  type="button"
                  onClick={handleGenerateSubjectAlternatives}
                  disabled={isGeneratingSubjects}
                  className="text-[11px] text-[#FFC400] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isGeneratingSubjects ? 'Thinking...' : 'AI Subject Alternatives'}</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject line..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold focus:outline-none"
              />

              {/* Subject Alternative Choices */}
              {subjectAlternatives.length > 0 && (
                <div className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl space-y-1.5 animate-fadeIn">
                  <span className="text-[10px] font-black uppercase text-[#FFC400]">Click to apply AI Subject:</span>
                  <div className="space-y-1 max-h-28 overflow-y-auto">
                    {subjectAlternatives.map((sub, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setSubject(sub);
                          setSubjectAlternatives([]);
                        }}
                        className="w-full text-left text-xs text-zinc-300 hover:text-white p-1.5 rounded bg-zinc-900/60 hover:bg-zinc-850 truncate cursor-pointer"
                      >
                        • {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Body Editor vs Rendered HTML Preview */}
            <div className="flex-1 min-h-[220px] flex flex-col relative">
              {previewTab === 'editor' ? (
                <div className="relative flex-1 flex flex-col">
                  <textarea
                    required
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your email message here or ask AI to generate..."
                    className="w-full flex-1 bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white p-3.5 rounded-xl text-xs sm:text-sm font-sans leading-relaxed focus:outline-none resize-none font-mono"
                  />
                  {body && (
                    <button
                      type="button"
                      onClick={handleCopyBody}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                    >
                      {copiedBody ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[10px]">{copiedBody ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
              ) : (
                /* Rendered Preview Card */
                <div className="flex-1 bg-white text-zinc-900 rounded-xl p-5 overflow-y-auto font-sans text-xs border border-zinc-300 shadow-inner">
                  {/* Email Header Brand */}
                  <div className="border-b border-zinc-200 pb-3 mb-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-sm tracking-tight text-zinc-950">
                        {settings.branding.logoText}
                      </h4>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase">
                        {settings.branding.logoSubtext}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 font-mono text-zinc-600">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-2 whitespace-pre-wrap leading-relaxed text-zinc-800 text-xs">
                    {body || <span className="text-zinc-400 italic">No email body content entered yet.</span>}
                  </div>

                  {/* Email Signature */}
                  <div className="mt-6 pt-4 border-t border-zinc-200 text-[11px] text-zinc-600 space-y-1">
                    <p className="font-bold text-zinc-900">Graphics Punching Production Desk</p>
                    <p>Direct Phone: {settings.contact.phone}</p>
                    <p>Production Email: {settings.emailSettings.connectedEmail}</p>
                    <p>Official Website: www.graphicspunching.com</p>
                  </div>
                </div>
              )}
            </div>

            {/* Attachments Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-3.5 h-3.5 text-[#FFC400]" />
                  <span className="text-[11px] font-bold uppercase text-zinc-400">
                    Attachments ({attachments.length})
                  </span>
                </div>

                {/* Preload Sample Attachment Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-[10px] text-zinc-500">Quick Samples:</span>
                  {sampleAttachments.slice(0, 2).map((sa, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => addPresetSampleAttachment(sa)}
                      className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 cursor-pointer"
                    >
                      + {sa.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attachments Pill List */}
              <div className="flex flex-wrap gap-2 items-center">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-mono"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#FFC400]" />
                    <span className="truncate max-w-[140px]">{att.name}</span>
                    <span className="text-[10px] text-zinc-500">
                      ({Math.round(att.size / 1024)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      className="text-zinc-500 hover:text-red-400 ml-1 p-0.5 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* Upload Button */}
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-dashed border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Paperclip className="w-3 h-3" />
                  <span>Attach File</span>
                </button>
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Footer Submit Action Bar */}
            <div className="pt-2 border-t border-zinc-850 flex items-center justify-between">
              <div className="text-[11px] text-zinc-500 font-mono">
                From: <span className="text-zinc-300">{settings.emailSettings.connectedEmail}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Clear current email draft?')) {
                      setSubject('');
                      setBody('');
                      setAttachments([]);
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-bold uppercase cursor-pointer"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={isSending}
                  className="px-5 py-2.5 bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-[0_4px_14px_rgba(255,196,0,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSending ? 'Sending via Gmail...' : 'Send Email Now'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
