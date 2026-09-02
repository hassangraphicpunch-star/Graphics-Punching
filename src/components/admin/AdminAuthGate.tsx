import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useWebsiteSettings } from '../../context/AdminSettingsContext';

interface AdminAuthGateProps {
  onSuccess?: () => void;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({ onSuccess }) => {
  const { loginAdmin } = useWebsiteSettings();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || isLocked) return;

    setLoading(true);
    setError(false);

    setTimeout(() => {
      const ok = loginAdmin(password);
      if (ok) {
        setFailedAttempts(0);
        if (onSuccess) onSuccess();
      } else {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        setError(true);
        if (nextAttempts >= 5) {
          setIsLocked(true);
          setTimeout(() => {
            setIsLocked(false);
            setFailedAttempts(0);
          }, 15000);
        }
      }
      setLoading(false);
    }, 350);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-[#0c0c0e] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative overflow-hidden text-center">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#FFC400]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Logo & Security Badge */}
        <div className="relative mx-auto mb-5 w-20 h-20">
          <div className="absolute -inset-1 bg-gradient-to-tr from-[#FFC400]/40 to-transparent rounded-full blur-md" />
          <div className="w-20 h-20 rounded-full bg-zinc-950 border-2 border-[#FFC400]/80 p-1 shadow-2xl relative flex items-center justify-center overflow-hidden">
            <img 
              src="/logo.png" 
              alt="Graphics Punching Logo" 
              className="w-full h-full object-contain rounded-full" 
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#FFC400] text-black flex items-center justify-center shadow-lg border border-black font-bold">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight">
          Admin Portal Authentication
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xs mx-auto">
          Authorized personnel only. Enter your administrator password to manage website settings, portfolio files, and email automations.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
              <KeyRound className="w-4 h-4" />
            </div>

            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              disabled={isLocked}
              placeholder="••••••••••••"
              autoFocus
              autoComplete="current-password"
              className={`w-full pl-10 pr-11 py-3 bg-zinc-950 border ${
                error ? 'border-red-500 text-red-300' : 'border-zinc-800 focus:border-[#FFC400] text-white'
              } rounded-xl text-sm font-mono tracking-widest text-center focus:outline-none transition-all placeholder:text-zinc-700 disabled:opacity-50`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-red-400 animate-shake">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>
                {isLocked
                  ? 'Too many failed attempts. Temporary cooldown active.'
                  : 'Access denied. Invalid administrator credentials.'}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || isLocked || !password.trim()}
            className="w-full bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(255,196,0,0.25)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{loading ? 'Verifying...' : 'Unlock Admin Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security Assurance Footer */}
        <div className="mt-6 pt-5 border-t border-zinc-850 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/80" />
          <span>Encrypted SHA-256 Administrative Session Gate</span>
        </div>
      </div>
    </div>
  );
};
