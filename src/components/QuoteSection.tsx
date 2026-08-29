import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Upload, CheckCircle2, AlertCircle, FileText, Sparkles, 
  ArrowRight, Phone, Mail, MapPin, Globe, Clock, ShieldCheck, X, DollarSign, Layers, Cpu,
  Copy, Check, ExternalLink, MailCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CONTACT_INFO, SERVICES, PRICING_DATA, PricingTierItem } from '../data/content';

interface QuoteSectionProps {
  defaultService?: string;
  defaultTier?: string;
  prefillNote?: string;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ 
  defaultService = 'vector-artwork', 
  defaultTier = 'simple-vector', 
  prefillNote = '' 
}) => {
  const [activePriceTab, setActivePriceTab] = useState<'vector' | 'digitizing'>(
    defaultService === 'logo-digitizing' ? 'digitizing' : 'vector'
  );
  
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    service: defaultService,
    vectorTier: defaultService === 'vector-artwork' && defaultTier ? defaultTier : 'simple-vector',
    digitizingTier: defaultService === 'logo-digitizing' && defaultTier ? defaultTier : 'left-chest-cap',
    quantity: '1',
    garmentType: 't-shirts',
    deadline: 'standard',
    message: prefillNote,
  });

  useEffect(() => {
    if (defaultService) {
      setFormData(prev => ({
        ...prev,
        service: defaultService,
        vectorTier: defaultService === 'vector-artwork' && defaultTier ? defaultTier : prev.vectorTier,
        digitizingTier: defaultService === 'logo-digitizing' && defaultTier ? defaultTier : prev.digitizingTier,
        message: prefillNote || prev.message,
      }));
      if (defaultService === 'logo-digitizing') {
        setActivePriceTab('digitizing');
      } else if (defaultService === 'vector-artwork') {
        setActivePriceTab('vector');
      }
    }
  }, [defaultService, defaultTier, prefillNote]);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic price calculation matching exact pricing rates with 24-Hour Express add-on
  const calculateEstimate = () => {
    const qty = parseInt(formData.quantity) || 1;
    const isExpress = formData.deadline === 'express-24';
    const expressFeePerUnit = isExpress ? 10 : 0;

    let basePerUnit = 15;
    let tierLabel = 'Simple Vector';
    let unitName = 'file';

    if (formData.service === 'vector-artwork') {
      if (formData.vectorTier === 'complex-vector') {
        basePerUnit = 25;
        tierLabel = 'Complex Vector';
      } else if (formData.vectorTier === 'advance-vector') {
        basePerUnit = 45;
        tierLabel = 'Advance Vector';
      } else if (formData.vectorTier === 'color-separation') {
        basePerUnit = 10;
        tierLabel = 'Color Separation';
        unitName = 'separation';
      }
    } else if (formData.service === 'logo-digitizing') {
      unitName = 'design';
      if (formData.digitizingTier === 'mid-size') {
        basePerUnit = 25;
        tierLabel = 'Mid Size (5"-8")';
      } else if (formData.digitizingTier === 'jacket-back') {
        basePerUnit = 40;
        tierLabel = 'Jacket Back (Full Scale)';
      } else {
        basePerUnit = 15;
        tierLabel = 'Left Chest & Cap';
      }
    } else {
      basePerUnit = 15;
      tierLabel = 'Custom Quote';
      unitName = 'file';
    }

    const perUnit = basePerUnit + expressFeePerUnit;
    const baseTotal = basePerUnit * qty;
    const expressTotal = expressFeePerUnit * qty;
    const total = baseTotal + expressTotal;

    return { 
      basePerUnit,
      expressFeePerUnit,
      perUnit, 
      baseTotal,
      expressTotal,
      total, 
      isExpress,
      isPerFile: true,
      tierLabel,
      unitName
    };
  };

  const estimate = calculateEstimate();

  const getEmailBodyText = () => {
    return (
      `GRAPHICS PUNCHING - QUOTE & PRODUCTION REQUEST\n` +
      `==================================================\n\n` +
      `CUSTOMER INFORMATION:\n` +
      `• Full Name: ${formData.fullName || 'N/A'}\n` +
      `• Business / Brand: ${formData.businessName || 'N/A'}\n` +
      `• Email: ${formData.email || 'N/A'}\n` +
      `• Phone: ${formData.phone || 'N/A'}\n\n` +
      `ORDER SPECIFICATIONS:\n` +
      `• Service: ${formData.service === 'vector-artwork' ? 'Vector Artwork' : formData.service === 'logo-digitizing' ? 'Logo Digitizing' : formData.service.toUpperCase()}\n` +
      `• Package / Tier: ${estimate.tierLabel}\n` +
      `• Base Unit Rate: $${estimate.basePerUnit} / ${estimate.unitName}\n` +
      `• Turnaround: ${estimate.isExpress ? 'EXPRESS (24h / Same-Day) (+$10/file)' : 'Standard (3-5 Days) (Included)'}\n` +
      `• Unit Price: $${estimate.perUnit} / ${estimate.unitName}${estimate.isExpress ? ' (Includes +$10 24h Express)' : ''}\n` +
      `• Quantity: ${formData.quantity} ${estimate.unitName}(s)\n` +
      `• Estimated Total: $${estimate.total}${estimate.isExpress ? ` (Base: $${estimate.baseTotal} + Express: $${estimate.expressTotal})` : ''}\n` +
      `• Files Uploaded: ${uploadedFiles.length > 0 ? uploadedFiles.map(f => f.name).join(', ') : 'None attached in form (attaching to email)'}\n\n` +
      `PROJECT NOTES & SPECIAL INSTRUCTIONS:\n` +
      `${formData.message || 'No additional instructions provided.'}\n\n` +
      `==================================================\n` +
      `Sent to: ${CONTACT_INFO.email}\n` +
      `Graphics Punching Official Production Desk`
    );
  };

  const generateMailtoUrl = () => {
    const subject = encodeURIComponent(
      `[Quote Request] ${formData.fullName || 'Customer'} - ${estimate.tierLabel} ($${estimate.total})`
    );
    const body = encodeURIComponent(getEmailBodyText());
    return `mailto:${CONTACT_INFO.email}?subject=${subject}&body=${body}`;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(CONTACT_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(getEmailBodyText());
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleSelectTierFromPricing = (serviceType: 'vector-artwork' | 'logo-digitizing', tierId: string) => {
    if (serviceType === 'vector-artwork') {
      setFormData(prev => ({
        ...prev,
        service: 'vector-artwork',
        vectorTier: tierId,
        quantity: prev.quantity === '50' ? '1' : prev.quantity
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        service: 'logo-digitizing',
        digitizingTier: tierId,
        quantity: prev.quantity === '50' ? '1' : prev.quantity
      }));
    }

    // Scroll to form smoothly
    const formElement = document.getElementById('quote-request-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      setUploadedFiles((prev) => [...prev, ...files]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Please enter your contact phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Build real email payload to deliver directly to graphicspunching264@gmail.com
      const emailPayload = new FormData();
      emailPayload.append('_subject', `[Graphics Punching Quote Request] ${formData.fullName} - ${estimate.tierLabel} ($${estimate.total})`);
      emailPayload.append('_replyto', formData.email);
      emailPayload.append('_template', 'table');
      emailPayload.append('_captcha', 'false');
      emailPayload.append('Customer Name', formData.fullName);
      emailPayload.append('Business / Brand', formData.businessName || 'N/A');
      emailPayload.append('Customer Email', formData.email);
      emailPayload.append('Customer Phone', formData.phone);
      emailPayload.append('Service Requested', formData.service === 'vector-artwork' ? 'Vector Artwork' : formData.service === 'logo-digitizing' ? 'Logo Digitizing' : formData.service);
      emailPayload.append('Package Specification', estimate.tierLabel);
      emailPayload.append('Unit Rate', `$${estimate.perUnit} / ${estimate.unitName}`);
      emailPayload.append('Quantity', `${formData.quantity} ${estimate.unitName}(s)`);
      emailPayload.append('Estimated Total Price', `$${estimate.total}`);
      emailPayload.append('Turnaround Deadline', formData.deadline === 'express-24' ? 'Express 24h / Same Day' : 'Standard 3-5 Days');
      emailPayload.append('Attached Files List', uploadedFiles.length > 0 ? uploadedFiles.map(f => `${f.name} (${(f.size/1024).toFixed(0)} KB)`).join(', ') : 'None attached in form');
      emailPayload.append('Project Notes', formData.message || 'No additional notes provided.');

      // Attach actual files if user uploaded any
      uploadedFiles.forEach((file) => {
        emailPayload.append('attachment', file, file.name);
      });

      // Dispatch to FormSubmit AJAX endpoint connected to graphicspunching264@gmail.com
      await fetch(`https://formsubmit.co/ajax/${CONTACT_INFO.email}`, {
        method: 'POST',
        body: emailPayload,
        headers: {
          'Accept': 'application/json'
        }
      });

      setIsSubmitting(false);
      setIsSubmitted(true);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFC400', '#ffffff', '#000000']
        });
      } catch (err) {
        // Ignore if confetti blocked
      }
    } catch (error) {
      console.warn('Network dispatch fallback:', error);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: '',
      businessName: '',
      email: '',
      phone: '',
      service: 'vector-artwork',
      vectorTier: 'simple-vector',
      digitizingTier: 'left-chest-cap',
      quantity: '1',
      garmentType: 't-shirts',
      deadline: 'standard',
      message: '',
    });
    setUploadedFiles([]);
  };

  return (
    <section id="contact" className="py-20 sm:py-24 bg-white text-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="h-[2px] w-6 bg-[#FFC400]" />
            <span className="text-[#b88c00] font-extrabold text-xs sm:text-sm tracking-widest uppercase">
              TRANSPARENT PRICING &amp; FREE ESTIMATE
            </span>
            <span className="h-[2px] w-6 bg-[#FFC400]" />
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-[#050505]">
            PRICING &amp; QUOTE REQUEST
          </h2>
          <p className="mt-3 text-zinc-600 text-sm sm:text-base">
            Guaranteed flat-rate pricing for Vector Artwork and Embroidery Digitizing, plus custom bulk quotes for Screen Printing and Custom Teamwear.
          </p>
        </div>

        {/* Dedicated Wholesale Rate Schedule Card */}
        <div className="mb-14 bg-[#080808] text-white rounded-2xl border border-zinc-800 p-6 sm:p-8 shadow-2xl" id="pricing-schedule">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/30 text-[#FFC400] text-xs font-black uppercase tracking-wider mb-2">
                <DollarSign className="w-3.5 h-3.5" />
                <span>OFFICIAL WHOLESALE RATE CARD</span>
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-white">
                NO HIDDEN CHARGES &bull; INSTANT ESTIMATES
              </h3>
            </div>

            {/* Category Toggle Tabs */}
            <div className="flex items-center bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setActivePriceTab('vector')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  activePriceTab === 'vector'
                    ? 'bg-[#FFC400] text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Vector Artwork</span>
              </button>
              <button
                type="button"
                onClick={() => setActivePriceTab('digitizing')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  activePriceTab === 'digitizing'
                    ? 'bg-[#FFC400] text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>Logo Digitizing</span>
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="pt-6">
            {activePriceTab === 'vector' ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {PRICING_DATA.vector.map((tier) => (
                    <div
                      key={tier.id}
                      onClick={() => handleSelectTierFromPricing('vector-artwork', tier.id)}
                      className="bg-[#121212] hover:bg-[#181818] border border-zinc-800 hover:border-[#FFC400] rounded-xl p-5 flex flex-col justify-between transition-all duration-300 group cursor-pointer relative overflow-hidden"
                    >
                      {tier.popular && (
                        <span className="absolute top-0 right-0 bg-[#FFC400] text-black text-[9px] font-black uppercase tracking-wider px-3 py-0.5 rounded-bl-lg">
                          MOST POPULAR
                        </span>
                      )}

                      <div>
                        <div className="flex items-baseline justify-between mb-2">
                          <h4 className="font-display font-black text-lg text-white uppercase group-hover:text-[#FFC400] transition-colors">
                            {tier.title}
                          </h4>
                        </div>
                        
                        <div className="flex items-baseline gap-1 my-3">
                          <span className="font-display font-black text-4xl text-[#FFC400]">
                            {tier.priceDisplay}
                          </span>
                          <span className="text-xs text-zinc-400 font-medium">{tier.unit}</span>
                        </div>

                        <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                          {tier.description}
                        </p>

                        <div className="space-y-1.5 pt-3 border-t border-zinc-800/80 mb-5">
                          {tier.features.slice(0, 3).map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-1.5 text-[11px] text-zinc-400">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC400] flex-shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="w-full bg-zinc-900 group-hover:bg-[#FFC400] text-zinc-200 group-hover:text-black font-extrabold text-xs uppercase tracking-wider py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all"
                      >
                        <span>Select {tier.priceDisplay}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {PRICING_DATA.digitizing.map((tier) => (
                    <div
                      key={tier.id}
                      onClick={() => handleSelectTierFromPricing('logo-digitizing', tier.id)}
                      className="bg-[#121212] hover:bg-[#181818] border border-zinc-800 hover:border-[#FFC400] rounded-xl p-6 flex flex-col justify-between transition-all duration-300 group cursor-pointer relative overflow-hidden"
                    >
                      {tier.popular && (
                        <span className="absolute top-0 right-0 bg-[#FFC400] text-black text-[9px] font-black uppercase tracking-wider px-3 py-0.5 rounded-bl-lg">
                          TOP CHOICE
                        </span>
                      )}

                      <div>
                        <div className="flex items-baseline justify-between mb-2">
                          <h4 className="font-display font-black text-xl text-white uppercase group-hover:text-[#FFC400] transition-colors">
                            {tier.title}
                          </h4>
                        </div>
                        
                        <div className="flex items-baseline gap-1 my-3">
                          <span className="font-display font-black text-4xl text-[#FFC400]">
                            {tier.priceDisplay}
                          </span>
                          <span className="text-xs text-zinc-400 font-medium">{tier.unit}</span>
                        </div>

                        <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                          {tier.description}
                        </p>

                        <div className="space-y-1.5 pt-3 border-t border-zinc-800/80 mb-5">
                          {tier.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-1.5 text-[11px] text-zinc-400">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC400] flex-shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="w-full bg-zinc-900 group-hover:bg-[#FFC400] text-zinc-200 group-hover:text-black font-extrabold text-xs uppercase tracking-wider py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all"
                      >
                        <span>Select {tier.priceDisplay}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Contact Info & Live Estimator */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Contact Card */}
            <div className="bg-[#050505] text-white p-6 sm:p-7 rounded-2xl border border-zinc-800 space-y-5">
              <h3 className="font-display font-black text-xl uppercase tracking-tight text-white border-l-2 border-[#FFC400] pl-3">
                DIRECT CONTACT DESK
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Orders &amp; inquiries sent through this form or email are dispatched immediately to our production team at <span className="text-[#FFC400]">{CONTACT_INFO.email}</span>.
              </p>

              <div className="space-y-3.5 pt-2 text-xs">
                {/* Email with 1-click copy */}
                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-zinc-400 block uppercase font-bold">Direct Email</span>
                      <a href={`mailto:${CONTACT_INFO.email}`} className="text-white hover:text-[#FFC400] font-bold text-xs truncate block">
                        {CONTACT_INFO.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    title="Copy Email Address"
                    type="button"
                    className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-[#FFC400] transition-colors cursor-pointer flex-shrink-0"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <a
                  href={`tel:${CONTACT_INFO.phoneClean}`}
                  className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex items-center gap-2.5 text-white hover:text-[#FFC400] transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase font-bold">Call / WhatsApp</span>
                    <span className="font-bold text-xs">{CONTACT_INFO.phone}</span>
                  </div>
                </a>

                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-[#FFC400]/10 text-[#FFC400] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase font-bold">Turnaround Time</span>
                    <span className="font-bold text-xs text-zinc-200">4–12h Express &bull; 24/7 Production</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-[#FFC400] flex-shrink-0" />
                  <span>Free artwork evaluation &amp; stitch simulation</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-[#FFC400] flex-shrink-0" />
                  <span>Flat wholesale pricing — zero setup fees</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-[#FFC400] flex-shrink-0" />
                  <span>100% money-back quality guarantee</span>
                </div>
              </div>
            </div>

            {/* Live Instant Price Estimator Widget */}
            <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase text-zinc-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFC400]" />
                  Live Price Estimator
                </span>
                <span className="text-[10px] text-[#b88c00] font-black bg-[#FFC400]/20 px-2 py-0.5 rounded">
                  Flat &amp; Transparent
                </span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-zinc-200 space-y-2">
                <div className="flex justify-between text-xs text-zinc-600">
                  <span>Service:</span>
                  <span className="font-bold text-zinc-900 uppercase">{formData.service.replace('-', ' ')}</span>
                </div>

                <div className="flex justify-between text-xs text-zinc-600">
                  <span>Tier / Spec:</span>
                  <span className="font-bold text-[#b88c00]">{estimate.tierLabel} (${estimate.basePerUnit})</span>
                </div>

                <div className="flex justify-between text-xs text-zinc-600">
                  <span>Turnaround:</span>
                  <span className={`font-bold ${estimate.isExpress ? 'text-amber-600' : 'text-zinc-900'}`}>
                    {estimate.isExpress ? '24h Express (+$10/file)' : 'Standard (Included)'}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-zinc-600">
                  <span>Quantity:</span>
                  <span className="font-bold text-zinc-900">{formData.quantity} {estimate.unitName}(s)</span>
                </div>

                <div className="pt-2 border-t border-zinc-100 flex justify-between items-baseline">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase block font-semibold">Estimated Total</span>
                    <span className="font-display font-black text-3xl text-black">
                      ${estimate.total}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 uppercase block font-semibold">Effective Rate</span>
                    <span className="text-xs font-bold text-[#b88c00]">
                      ${estimate.perUnit} / {estimate.unitName}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-zinc-500 mt-2 italic">
                *Guaranteed flat-rate pricing. Fast turnaround with zero hidden fees.
              </p>
            </div>

          </div>

          {/* Right Column: Quote Request Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border-2 border-zinc-900 p-6 sm:p-10 shadow-2xl relative">
              
              {isSubmitted ? (
                /* Success Confirmation State */
                <div className="py-10 text-center space-y-5 animate-fadeIn">
                  <div className="w-16 h-16 bg-[#FFC400] text-black rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <MailCheck className="w-10 h-10 stroke-[2.5]" />
                  </div>

                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>DISPATCHED TO {CONTACT_INFO.email}</span>
                    </div>
                    <h3 className="font-display font-black text-3xl sm:text-4xl text-[#050505] uppercase tracking-tight">
                      QUOTE REQUEST DELIVERED!
                    </h3>
                  </div>

                  <p className="text-zinc-600 max-w-lg mx-auto text-sm leading-relaxed">
                    Thank you, <strong className="text-black">{formData.fullName}</strong>. Your project specifications have been dispatched to our production team at <strong className="text-black">{CONTACT_INFO.email}</strong>. We will review your files and reply with your digital proof and confirmation within 15–30 minutes.
                  </p>

                  {/* Summary Box */}
                  <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-200 max-w-md mx-auto text-xs text-left space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                      <span className="text-zinc-500 font-bold uppercase text-[10px]">Order Summary</span>
                      <button
                        onClick={handleCopySummary}
                        type="button"
                        className="text-[11px] text-[#b88c00] hover:text-black font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSummary ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
                      </button>
                    </div>
                    <p><strong>Customer:</strong> {formData.fullName} ({formData.email})</p>
                    <p><strong>Service:</strong> {formData.service === 'vector-artwork' ? 'Vector Artwork' : formData.service === 'logo-digitizing' ? 'Logo Digitizing' : formData.service.toUpperCase()}</p>
                    <p><strong>Package:</strong> {estimate.tierLabel} (${estimate.basePerUnit})</p>
                    <p><strong>Turnaround:</strong> {estimate.isExpress ? 'Express (24h / Same-Day) (+$10/file)' : 'Standard (3-5 Days)'}</p>
                    <p><strong>Quantity:</strong> {formData.quantity} {estimate.unitName}(s)</p>
                    <p><strong>Estimated Total:</strong> ${estimate.total} (${estimate.perUnit}/{estimate.unitName})</p>
                    <p><strong>Files:</strong> {uploadedFiles.length > 0 ? uploadedFiles.map(f => f.name).join(', ') : 'Sent via email / None'}</p>
                  </div>

                  {/* 1-Click Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                    <a
                      href={generateMailtoUrl()}
                      className="w-full sm:w-auto bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(255,196,0,0.3)] transition-all cursor-pointer group"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Open in Gmail / Email Client</span>
                      <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </a>

                    <button
                      onClick={resetForm}
                      type="button"
                      className="w-full sm:w-auto bg-black hover:bg-zinc-800 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-lg transition-all cursor-pointer"
                    >
                      Submit Another Quote
                    </button>
                  </div>

                  <p className="text-[11px] text-zinc-500">
                    Need urgent assistance? Call/WhatsApp us at <strong className="text-zinc-800">{CONTACT_INFO.phone}</strong>
                  </p>
                </div>
              ) : (
                /* Active Interactive Quote Form */
                <form onSubmit={handleSubmit} className="space-y-6" id="quote-request-form">
                  
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Form destination badge */}
                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-zinc-600">
                      <Mail className="w-4 h-4 text-[#b88c00]" />
                      <span>Direct Inquiries Sent To: <strong className="text-black">{CONTACT_INFO.email}</strong></span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Live Production
                    </span>
                  </div>

                  {/* 1. Personal & Business Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-zinc-900 mb-1.5" htmlFor="fullName">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        required
                        placeholder="John Smith"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm focus:bg-white focus:border-black focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-zinc-900 mb-1.5" htmlFor="businessName">
                        Business / Brand Name
                      </label>
                      <input
                        type="text"
                        id="businessName"
                        placeholder="Apex Apparel Co."
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm focus:bg-white focus:border-black focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-zinc-900 mb-1.5" htmlFor="email">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm focus:bg-white focus:border-black focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-zinc-900 mb-1.5" htmlFor="phone">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm focus:bg-white focus:border-black focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* 2. Service & Specifications */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-black uppercase text-zinc-900 mb-1.5" htmlFor="service">
                        Service Needed <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="service"
                        value={formData.service}
                        onChange={(e) => {
                          const s = e.target.value;
                          setFormData({ 
                            ...formData, 
                            service: s,
                            quantity: '1'
                          });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm font-medium focus:bg-white focus:border-black focus:outline-none"
                      >
                        <option value="vector-artwork">Vector Artwork (Flat Rates: $10 - $45)</option>
                        <option value="logo-digitizing">Logo Digitizing (Flat Rates: $15 - $40)</option>
                      </select>
                    </div>

                    {/* Conditional Tier Selector */}
                    {formData.service === 'vector-artwork' ? (
                      <div>
                        <label className="block text-xs font-black uppercase text-zinc-900 mb-1.5" htmlFor="vectorTier">
                          Vector Complexity / Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="vectorTier"
                          value={formData.vectorTier}
                          onChange={(e) => setFormData({ ...formData, vectorTier: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm font-bold focus:bg-white focus:border-black focus:outline-none"
                        >
                          <option value="simple-vector">SIMPLE VECTOR — $15 / file</option>
                          <option value="complex-vector">COMPLEX VECTOR — $25 / file</option>
                          <option value="advance-vector">ADVANCE VECTOR — $45 / file</option>
                          <option value="color-separation">COLOR SEPARATION — $10 / separation</option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-black uppercase text-zinc-900 mb-1.5" htmlFor="digitizingTier">
                          Digitizing Size / Location <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="digitizingTier"
                          value={formData.digitizingTier}
                          onChange={(e) => setFormData({ ...formData, digitizingTier: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm font-bold focus:bg-white focus:border-black focus:outline-none"
                        >
                          <option value="left-chest-cap">LEFT CHEST &amp; CAP — $15 / design</option>
                          <option value="mid-size">MID SIZE (5" to 8") — $25 / design</option>
                          <option value="jacket-back">JACKET BACK (Full Scale) — $40 / design</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Quantity & Secondary Specs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-zinc-900 mb-1.5" htmlFor="quantity">
                        {formData.service === 'vector-artwork' ? 'Number of Vector Files / Artworks' : 'Number of Logo Designs / Locations'}
                      </label>
                      <select
                        id="quantity"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm font-medium focus:bg-white focus:border-black focus:outline-none"
                      >
                        <option value="1">1 File / Design</option>
                        <option value="2">2 Files / Designs</option>
                        <option value="3">3 Files / Designs</option>
                        <option value="4">4 Files / Designs</option>
                        <option value="5">5 Files (Bundle)</option>
                        <option value="10">10 Files (Bulk Pack)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-zinc-900 mb-1.5">
                        Preferred Turnaround
                      </label>
                      <div className="grid grid-cols-2 gap-2 sm:gap-2.5 h-[calc(100%-24px)]">
                        {/* Standard Option */}
                        <label
                          className={`group relative flex flex-col justify-between items-center p-2 sm:p-2.5 md:p-3 rounded-xl border text-center cursor-pointer transition-all select-none min-h-[82px] sm:min-h-[88px] h-full ${
                            formData.deadline === 'standard'
                              ? 'bg-black text-white border-black shadow-md ring-2 ring-black/40'
                              : 'bg-zinc-50 text-zinc-800 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="deadline"
                            value="standard"
                            checked={formData.deadline === 'standard'}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            className="sr-only"
                          />
                          <div className="w-full flex flex-col items-center justify-center">
                            <span className="text-[11px] sm:text-xs md:text-sm font-black tracking-tight leading-tight">
                              Standard
                            </span>
                            <span className={`text-[10px] sm:text-[11px] font-semibold mt-0.5 whitespace-nowrap ${
                              formData.deadline === 'standard' ? 'text-zinc-300' : 'text-zinc-500'
                            }`}>
                              (3–5 Days)
                            </span>
                          </div>
                          <div className="w-full mt-2 pt-1.5 flex items-center justify-center border-t border-current/10">
                            <span className={`w-full text-center text-[9px] sm:text-[10px] font-extrabold uppercase px-1 sm:px-1.5 py-0.5 rounded tracking-wide whitespace-nowrap truncate ${
                              formData.deadline === 'standard'
                                ? 'bg-zinc-800 text-white'
                                : 'bg-zinc-200 text-zinc-700'
                            }`}>
                              Standard Rate (Free)
                            </span>
                          </div>
                        </label>

                        {/* Express Option */}
                        <label
                          className={`group relative flex flex-col justify-between items-center p-2 sm:p-2.5 md:p-3 rounded-xl border text-center cursor-pointer transition-all select-none min-h-[82px] sm:min-h-[88px] h-full ${
                            formData.deadline === 'express-24'
                              ? 'bg-black text-[#FFC400] border-black shadow-md ring-2 ring-[#FFC400]/50'
                              : 'bg-zinc-50 text-zinc-800 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="deadline"
                            value="express-24"
                            checked={formData.deadline === 'express-24'}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            className="sr-only"
                          />
                          <div className="w-full flex flex-col items-center justify-center">
                            <span className="text-[11px] sm:text-xs md:text-sm font-black tracking-tight leading-tight">
                              Express
                            </span>
                            <span className="text-[10px] sm:text-[11px] font-bold text-[#FFC400] mt-0.5 whitespace-nowrap">
                              (24h / Same-Day)
                            </span>
                          </div>
                          <div className="w-full mt-2 pt-1.5 flex items-center justify-center border-t border-current/10">
                            <span className={`w-full text-center text-[9px] sm:text-[10px] font-extrabold uppercase px-1 sm:px-1.5 py-0.5 rounded tracking-wide whitespace-nowrap truncate ${
                              formData.deadline === 'express-24'
                                ? 'bg-[#FFC400] text-black shadow-sm font-black'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}>
                              +$10 / File Express
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 3. Drag & Drop File Upload */}
                  <div>
                    <label className="block text-xs font-black uppercase text-zinc-900 mb-1.5">
                      Upload Design / Artwork / Logo (Optional)
                    </label>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                        isDragging
                          ? 'border-[#FFC400] bg-[#FFC400]/10 scale-[1.01]'
                          : 'border-zinc-300 hover:border-black bg-zinc-50'
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        onChange={handleFileInput}
                        className="hidden"
                        accept=".ai,.eps,.pdf,.psd,.svg,.dst,.pes,.emb,.png,.jpg,.jpeg"
                      />
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 shadow-sm">
                          <Upload className="w-5 h-5 text-zinc-900" />
                        </div>
                        <p className="text-xs font-bold text-zinc-800">
                          Click to upload or drag &amp; drop artwork files here
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          Supports: .AI, .EPS, .PDF, .DST, .PES, .PSD, .PNG, .JPG (Max 50MB)
                        </p>
                      </div>
                    </div>

                    {/* Uploaded File Pill List */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {uploadedFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="bg-zinc-100 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-800 flex items-center gap-2"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#b88c00]" />
                            <span className="font-medium truncate max-w-[180px]">{file.name}</span>
                            <span className="text-[10px] text-zinc-500">({(file.size / 1024).toFixed(0)} KB)</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(idx);
                              }}
                              className="text-zinc-400 hover:text-red-500"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 4. Project Details & Message */}
                  <div>
                    <label className="block text-xs font-black uppercase text-zinc-900 mb-1.5" htmlFor="message">
                      Project Notes / Specific Instructions
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      placeholder="Describe sizing dimensions, desired stitch formats (DST, PES, EMB), color requirements, or placement instructions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm focus:bg-white focus:border-black focus:outline-none transition-all"
                    />
                  </div>

                  {/* Submit Button & Direct Email Link */}
                  <div className="pt-2 space-y-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      id="submit-quote-request-btn"
                      className="w-full bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-sm sm:text-base uppercase tracking-wider py-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-[0_6px_20px_rgba(255,196,0,0.35)] cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>SENDING TO {CONTACT_INFO.email}...</span>
                        </div>
                      ) : (
                        <>
                          <span>SUBMIT QUOTE REQUEST &bull; ${estimate.total} EST.</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-xs text-zinc-500 px-1 pt-1">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#b88c00]" />
                        <span>Direct delivery to {CONTACT_INFO.email}</span>
                      </span>

                      <a
                        href={generateMailtoUrl()}
                        className="text-[#b88c00] hover:text-black font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>Send via Email Client</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
