"use client";
import { useState, useEffect } from "react";
import { Search, RefreshCw, MessageCircle, Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface ILead {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  brochureTitle?: string;
  source: string;
  createdAt: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<ILead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (data.success) setLeads(data.data);
    } catch {
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const filtered = leads.filter((l) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      (l.email?.toLowerCase().includes(q) ?? false) ||
      (l.brochureTitle?.toLowerCase().includes(q) ?? false)
    );
  });

  const waLink = (phone: string, brochure?: string) => {
    const clean = phone.replace(/\D/g, "");
    const msg = encodeURIComponent(
      brochure
        ? `Hi, I saw your request for "${brochure}". Here is the brochure for you.`
        : `Hi, thank you for your interest in AREV Lights!`
    );
    return `https://wa.me/${clean}?text=${msg}`;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-neutral text-lg sm:text-xl font-semibold">Brochure Leads</h1>
          <p className="text-muted text-sm mt-0.5">{filtered.length} lead{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={fetchLeads}
          className="flex items-center gap-2 px-4 py-2.5 border border-border text-muted text-xs font-label uppercase tracking-wide hover:text-accent hover:border-accent transition-all self-start sm:self-auto min-h-[44px]"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          className="admin-input pl-10"
          placeholder="Search name, phone, brochure…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Mobile: cards | Desktop: table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="admin-card h-28 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-card flex flex-col items-center justify-center h-40 gap-2">
          <p className="text-muted text-sm">No leads yet.</p>
          <p className="text-muted text-xs">Leads appear when visitors request brochures.</p>
        </div>
      ) : (
        <>
          {/* ── Mobile card view (hidden on lg+) ── */}
          <div className="space-y-3 lg:hidden">
            {filtered.map((lead) => (
              <div key={lead._id} className="admin-card p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-neutral font-semibold text-sm">{lead.name}</p>
                    <p className="text-muted text-xs mt-0.5">{format(new Date(lead.createdAt), "dd MMM yyyy, hh:mm a")}</p>
                  </div>
                  {lead.brochureTitle && (
                    <span className="text-[10px] px-2 py-0.5 border border-accent/30 bg-accent/5 text-accent font-label tracking-wide truncate max-w-[120px]">
                      {lead.brochureTitle}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-xs text-muted">
                  <span>{lead.phone}</span>
                  {lead.email && <span>{lead.email}</span>}
                </div>
                <div className="flex gap-2 flex-wrap pt-1">
                  <a
                    href={waLink(lead.phone, lead.brochureTitle)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-xs font-label uppercase tracking-wide min-h-[40px]"
                  >
                    <MessageCircle size={12} /> WhatsApp
                  </a>
                  <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 px-3 py-2 border border-border text-muted text-xs hover:text-accent transition-colors min-h-[40px]">
                    <Phone size={12} /> Call
                  </a>
                  {lead.email && (
                    <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 px-3 py-2 border border-border text-muted text-xs hover:text-accent transition-colors min-h-[40px]">
                      <Mail size={12} /> Email
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── Desktop table view (hidden on mobile) ── */}
          <div className="admin-card p-0 overflow-hidden hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["Name", "Phone / WhatsApp", "Email", "Brochure Requested", "Date", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-muted text-xs font-label uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead) => (
                    <tr key={lead._id} className="border-b border-border/50 hover:bg-surface-2/50 transition-colors">
                      <td className="px-5 py-3"><p className="text-neutral text-sm font-medium">{lead.name}</p></td>
                      <td className="px-5 py-3"><p className="text-neutral text-sm">{lead.phone}</p></td>
                      <td className="px-5 py-3"><p className="text-muted text-xs">{lead.email || "—"}</p></td>
                      <td className="px-5 py-3">
                        <span className="inline-block px-2 py-0.5 border border-accent/30 bg-accent/5 text-accent text-xs font-label tracking-wide max-w-[200px] truncate">
                          {lead.brochureTitle || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3"><span className="text-muted text-xs whitespace-nowrap">{format(new Date(lead.createdAt), "dd MMM yyyy, hh:mm a")}</span></td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <a href={waLink(lead.phone, lead.brochureTitle)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-xs font-label uppercase tracking-wide hover:bg-[#25D366]/20 transition-all">
                            <MessageCircle size={12} /> WhatsApp
                          </a>
                          <a href={`tel:${lead.phone}`} className="p-1.5 text-muted hover:text-accent transition-colors"><Phone size={14} /></a>
                          {lead.email && <a href={`mailto:${lead.email}`} className="p-1.5 text-muted hover:text-accent transition-colors"><Mail size={14} /></a>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
