import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Building,
  Calendar,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useWebsiteSettings } from '../../context/AdminSettingsContext';
import { ContactLead } from '../../types/admin';

export const ContactsDatabase: React.FC<{ onDraftEmailTo?: (email: string, name: string, service: string) => void }> = ({
  onDraftEmailTo,
}) => {
  const { leads, addContactLead, updateContactLead, deleteContactLead } = useWebsiteSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<ContactLead | null>(null);

  const filteredLeads = leads.filter((l) => {
    const q = searchTerm.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      (l.company && l.company.toLowerCase().includes(q)) ||
      l.serviceInterested.toLowerCase().includes(q)
    );
  });

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;

    if (editingLead.id && leads.some((l) => l.id === editingLead.id)) {
      updateContactLead(editingLead.id, editingLead);
    } else {
      addContactLead({
        name: editingLead.name,
        email: editingLead.email,
        phone: editingLead.phone || '',
        company: editingLead.company || '',
        serviceInterested: editingLead.serviceInterested || 'Vector Artwork Redraw',
        projectDetails: editingLead.projectDetails || '',
        status: editingLead.status || 'new',
        source: 'Manual Admin Entry',
      });
    }
    setIsModalOpen(false);
    setEditingLead(null);
  };

  const getStatusBadge = (status: ContactLead['status']) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-black uppercase">New Lead</span>;
      case 'contacted':
        return <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-black uppercase">Contacted</span>;
      case 'quoted':
        return <span className="px-2 py-0.5 rounded bg-[#FFC400]/20 text-[#FFC400] border border-[#FFC400]/30 text-[10px] font-black uppercase">Quoted</span>;
      case 'closed':
        return <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">Order Completed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0e0e11] border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#FFC400]/15 text-[#FFC400] border border-[#FFC400]/30 text-[10px] font-black uppercase">
              Customer CRM
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Total Clients: {leads.length}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-display font-black text-white uppercase mt-1">
            Customer Leads &amp; Quote Inquiries
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage inquiries submitted via website forms, direct emails, and incoming quote requests.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingLead({
              id: '',
              name: '',
              email: '',
              phone: '',
              company: '',
              serviceInterested: 'Embroidery Digitizing (Cap & Left Chest)',
              projectDetails: '',
              date: new Date().toISOString(),
              status: 'new',
              source: 'Manual Entry',
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow cursor-pointer self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by customer name, company, email, or service..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#0c0c0e] border border-zinc-800 focus:border-[#FFC400] text-white rounded-xl text-xs sm:text-sm focus:outline-none"
        />
      </div>

      {/* Leads Table */}
      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <Users className="w-8 h-8 mx-auto text-zinc-700 mb-2" />
            <p className="text-xs">No client records found.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-850">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-4 sm:p-5 hover:bg-zinc-900/40 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(lead.status)}
                    <h3 className="text-sm font-bold text-white">{lead.name}</h3>
                    {lead.company && (
                      <span className="text-xs text-zinc-400 font-medium">
                        • {lead.company}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#FFC400]" />
                      <a href={`mailto:${lead.email}`} className="hover:underline text-zinc-300">
                        {lead.email}
                      </a>
                    </span>
                    {lead.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{lead.phone}</span>
                      </span>
                    )}
                    <span className="text-zinc-500">
                      Added: {new Date(lead.date).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 pt-1">
                    <span className="text-zinc-500 font-bold uppercase text-[10px]">Service:</span>{' '}
                    <span className="font-semibold text-[#FFC400]">{lead.serviceInterested}</span>
                    {lead.projectDetails && ` — "${lead.projectDetails}"`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                  {onDraftEmailTo && (
                    <button
                      type="button"
                      onClick={() => onDraftEmailTo(lead.email, lead.name, lead.serviceInterested)}
                      className="px-3 py-1.5 rounded-lg bg-[#FFC400] hover:bg-[#ffcd1a] text-black font-extrabold text-xs uppercase flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Draft AI Email</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setEditingLead({ ...lead });
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete lead "${lead.name}"?`)) {
                        deleteContactLead(lead.id);
                      }
                    }}
                    className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT / CREATE MODAL */}
      {isModalOpen && editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0e0e11] border border-zinc-800 rounded-3xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-display font-black text-white uppercase">
                {editingLead.id ? 'Edit Customer Lead' : 'Add New Client Record'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingLead(null);
                }}
                className="text-zinc-400 hover:text-white p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editingLead.name}
                  onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={editingLead.email}
                    onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFC400] text-white px-3.5 py-2 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editingLead.phone}
                    onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3.5 py-2 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Company / Brand
                  </label>
                  <input
                    type="text"
                    value={editingLead.company}
                    onChange={(e) => setEditingLead({ ...editingLead, company: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3.5 py-2 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Lead Status
                  </label>
                  <select
                    value={editingLead.status}
                    onChange={(e) =>
                      setEditingLead({
                        ...editingLead,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3.5 py-2 rounded-xl text-xs"
                  >
                    <option value="new">New Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="quoted">Quoted</option>
                    <option value="closed">Closed / Finished</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                  Service Interested
                </label>
                <input
                  type="text"
                  value={editingLead.serviceInterested}
                  onChange={(e) =>
                    setEditingLead({ ...editingLead, serviceInterested: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 text-white px-3.5 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                  Project Notes &amp; Specifications
                </label>
                <textarea
                  rows={3}
                  value={editingLead.projectDetails}
                  onChange={(e) =>
                    setEditingLead({ ...editingLead, projectDetails: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingLead(null);
                  }}
                  className="px-4 py-2 bg-zinc-900 text-zinc-300 text-xs font-bold uppercase rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FFC400] hover:bg-[#ffcd1a] text-black text-xs font-black uppercase rounded-xl cursor-pointer"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
