"use client";
import { useState, useEffect } from "react";
import { Eye, Check, RefreshCw, Download, Search, Filter } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { IInquiry } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  new: "badge-new",
  contacted: "badge-contacted",
  converted: "badge-converted",
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<IInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;

  const fetch_ = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    if (typeFilter) params.set("type", typeFilter);
    const res = await fetch(`/api/inquiries?${params}`);
    const data = await res.json();
    if (data.success) { setInquiries(data.data); setTotal(data.pagination?.total || 0); }
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, [page, search, statusFilter, typeFilter]);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) { toast.success("Status updated"); fetch_(); }
    else toast.error("Update failed");
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-neutral text-xl font-semibold">Inquiries</h1>
          <p className="text-muted text-sm mt-0.5">{total} total inquiries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input className="admin-input pl-10" placeholder="Search name, email, phone…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="admin-input max-w-[160px]" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
        </select>
        <select className="admin-input max-w-[160px]" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
          <option value="">All Types</option>
          <option value="general">General</option>
          <option value="dealer">Dealer</option>
          <option value="product">Product</option>
        </select>
      </div>

      {/* Table */}
      <div className="admin-card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-32 text-muted text-sm">Loading…</div>
        ) : inquiries.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted text-sm">No inquiries found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["Name", "Contact", "Type", "Date", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-muted text-xs font-label uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inq) => (
                    <tr key={inq._id} className="border-b border-border/50 hover:bg-surface-2/50 transition-colors">
                      <td className="px-5 py-3">
                        <p className="text-neutral text-sm font-medium">{inq.name}</p>
                        {inq.company && <p className="text-muted text-xs">{inq.company}</p>}
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-neutral text-xs">{inq.email}</p>
                        {inq.phone && <p className="text-muted text-xs mt-0.5">{inq.phone}</p>}
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-label text-xs uppercase tracking-wide text-muted border border-border px-2 py-0.5">
                          {inq.type}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-muted text-xs">
                          {format(new Date(inq.createdAt), "dd MMM yyyy")}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={STATUS_COLORS[inq.status] || ""}>{inq.status}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <Link href={`/admin/inquiries/${inq._id}`} className="p-1.5 text-muted hover:text-accent transition-colors" title="View">
                            <Eye size={14} />
                          </Link>
                          {inq.status !== "contacted" && (
                            <button onClick={() => updateStatus(inq._id, "contacted")} className="p-1.5 text-muted hover:text-warning transition-colors" title="Mark Contacted">
                              <RefreshCw size={14} />
                            </button>
                          )}
                          {inq.status !== "converted" && (
                            <button onClick={() => updateStatus(inq._id, "converted")} className="p-1.5 text-muted hover:text-success transition-colors" title="Mark Converted">
                              <Check size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                <p className="text-muted text-xs">Page {page} of {totalPages} · {total} total</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-xs border border-border text-muted hover:text-neutral disabled:opacity-40 transition-colors">Prev</button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-xs border border-border text-muted hover:text-neutral disabled:opacity-40 transition-colors">Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
