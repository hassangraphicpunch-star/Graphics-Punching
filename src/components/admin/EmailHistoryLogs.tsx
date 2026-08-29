import React, { useState } from 'react';
import {
  Mail,
  Search,
  CheckCircle2,
  Clock,
  Paperclip,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Send,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { useWebsiteSettings } from '../../context/AdminSettingsContext';
import { EmailLog } from '../../types/admin';

export const EmailHistoryLogs: React.FC<{ onComposeTo?: (email: string, name: string) => void }> = ({
  onComposeTo,
}) => {
  const { emailLogs, deleteEmailLog, clearEmailLogs } = useWebsiteSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLogs = emailLogs.filter((l) => {
    const query = searchTerm.toLowerCase();
    return (
      l.to.toLowerCase().includes(query) ||
      (l.recipientName && l.recipientName.toLowerCase().includes(query)) ||
      l.subject.toLowerCase().includes(query) ||
      l.trackingId.toLowerCase().includes(query)
    );
  });

  const copyTracking = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0e0e11] border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">
              Audit &amp; Dispatch History
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Total Logs: {emailLogs.length}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-display font-black text-white uppercase mt-1">
            Connected Email Outbox &amp; Logs
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Complete audit trail of all quotes, proofs, delivery packages, and auto-responder notifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {emailLogs.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm('Clear all email history logs?')) {
                  clearEmailLogs();
                }
              }}
              className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 text-xs font-bold uppercase transition-colors cursor-pointer"
            >
              Clear Logs
            </button>
          )}
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by recipient, customer name, subject, or tracking ID..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#0c0c0e] border border-zinc-800 focus:border-[#FFC400] text-white rounded-xl text-xs sm:text-sm focus:outline-none"
        />
      </div>

      {/* Logs Table / Cards */}
      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 space-y-2">
            <Mail className="w-8 h-8 mx-auto text-zinc-700" />
            <p className="text-xs">No email dispatch logs found matching "{searchTerm}".</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-850">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 sm:p-5 hover:bg-zinc-900/40 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Send className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 text-[10px] font-black uppercase">
                        {log.status}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {log.recipientName ? `${log.recipientName} ` : ''}
                        <span className="text-zinc-400 font-mono font-normal">({log.to})</span>
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {new Date(log.sentAt).toLocaleString()}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-zinc-200 truncate max-w-xl">
                      {log.subject}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400">
                      <span className="font-mono text-zinc-500 flex items-center gap-1">
                        ID: {log.trackingId}
                        <button
                          type="button"
                          onClick={() => copyTracking(log.id, log.trackingId)}
                          className="hover:text-white cursor-pointer"
                        >
                          {copiedId === log.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </span>

                      {log.attachments && log.attachments.length > 0 && (
                        <span className="flex items-center gap-1 text-[#FFC400] font-mono">
                          <Paperclip className="w-3 h-3" />
                          {log.attachments.length} attachment{log.attachments.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedLog(log)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#FFC400]" />
                    <span>View Email</span>
                  </button>

                  {onComposeTo && (
                    <button
                      type="button"
                      onClick={() => onComposeTo(log.to, log.recipientName || '')}
                      className="px-3 py-1.5 rounded-lg bg-[#FFC400]/20 hover:bg-[#FFC400]/30 text-[#FFC400] text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Reply</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Delete this email log record?')) {
                        deleteEmailLog(log.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0e0e11] border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 font-bold">
                  Tracking: {selectedLog.trackingId}
                </span>
                <h3 className="text-base font-display font-black text-white uppercase">
                  {selectedLog.subject}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="text-zinc-400 hover:text-white p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono bg-zinc-950 p-3.5 rounded-xl border border-zinc-850">
              <div>
                <span className="text-zinc-500">To: </span>
                <span className="text-white">
                  {selectedLog.recipientName} &lt;{selectedLog.to}&gt;
                </span>
              </div>
              <div>
                <span className="text-zinc-500">From: </span>
                <span className="text-zinc-300">{selectedLog.from}</span>
              </div>
              <div>
                <span className="text-zinc-500">Timestamp: </span>
                <span className="text-zinc-400">{new Date(selectedLog.sentAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-zinc-500">Gateway Status: </span>
                <span className="text-emerald-400 font-bold uppercase">{selectedLog.status}</span>
              </div>
            </div>

            {/* Email Body */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 text-zinc-200 text-xs whitespace-pre-wrap font-sans leading-relaxed">
              {selectedLog.body}
            </div>

            {/* Attachments list */}
            {selectedLog.attachments && selectedLog.attachments.length > 0 && (
              <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-xl space-y-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase">
                  Attachments Included:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedLog.attachments.map((att, i) => (
                    <div
                      key={i}
                      className="px-2.5 py-1 rounded bg-zinc-900 text-xs font-mono text-zinc-300 border border-zinc-800 flex items-center gap-1.5"
                    >
                      <Paperclip className="w-3 h-3 text-[#FFC400]" />
                      <span>{att.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
