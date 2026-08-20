import React, { useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { QuoteSection } from './QuoteSection';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  initialTier?: string;
  initialItem?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  initialService = 'vector-artwork',
  initialTier = '',
  initialItem = '',
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="Quote Request Modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 lg:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 animate-scaleUp border border-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Bar */}
        <div className="bg-[#050505] text-white px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2 sm:gap-3">
            <Logo size="sm" showSubtext={false} />
            <span className="hidden sm:inline-block text-zinc-500 font-bold">•</span>
            <span className="hidden sm:inline-block font-display font-bold text-xs uppercase tracking-wider text-zinc-300">
              FREE ESTIMATE REQUEST
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close quote modal"
            className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center justify-center transition-colors cursor-pointer min-h-[40px] min-w-[40px]"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Content Form */}
        <div className="max-h-[82vh] sm:max-h-[84vh] overflow-y-auto p-1 sm:p-4">
          <QuoteSection
            defaultService={initialService}
            defaultTier={initialTier}
            prefillNote={initialItem ? `Inquiry regarding portfolio design: "${initialItem}"` : ''}
          />
        </div>
      </div>
    </div>
  );
};
