"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Check } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { IInquiry } from "@/types";

export default function InquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [inquiry, setInquiry] = useState<IInquiry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/inquiries/${params.id}`)
      .then(r => r.json())
      .then(d => { if (d.success) setInquiry(d.data); setLoading(false); });
  }, [params.id]);

  const updateStatus = async (status: string) => {
    const res = await fetch(`/api/inquiries/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) { toast.success("Status updated"); setInquiry(data.data); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-muted">Loading…</div>;
  if (!inquiry) return <div className="flex items-center justify-center h-64 text-muted">Inquiry not found</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/inquiries" className="text-muted hover:text-accent transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-neutral text-xl font-semibold">Inquiry Detail</h1>
      </div>

      <div className="admin-card space-y-5">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Name", value: inquiry.name },
            { label: "Email", value: inquiry.email },
            { label: "Phone", value: inquiry.phone || "–" },
            { label: "Company", value: inquiry.company || "–" },
            { label: "Type", value: inquiry.type },
            { label: "Status", value: inquiry.status },
            { label: "Date", value: format(new Date(inquiry.createdAt), "dd MMM yyyy, HH:mm") },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="admin-label">{label}</p>
              <p className="text-neutral text-sm capitalize">{value}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="admin-label">Message</p>
          <p className="text-neutral text-sm leading-relaxed bg-surface-2 rounded p-4 border border-border">{inquiry.message}</p>
        </div>

        {(inquiry.city || inquiry.state || inquiry.businessType) && (
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
            {inquiry.city && <div><p className="admin-label">City</p><p className="text-neutral text-sm">{inquiry.city}</p></div>}
            {inquiry.state && <div><p className="admin-label">State</p><p className="text-neutral text-sm">{inquiry.state}</p></div>}
            {inquiry.businessType && <div><p className="admin-label">Business Type</p><p className="text-neutral text-sm">{inquiry.businessType}</p></div>}
          </div>
        )}

        <div className="flex gap-3 pt-3 border-t border-border">
          {inquiry.status !== "contacted" && (
            <button onClick={() => updateStatus("contacted")} className="flex items-center gap-2 px-4 py-2.5 border border-warning/30 text-warning text-sm hover:bg-warning/10 transition-colors rounded-md">
              <RefreshCw size={14} /> Mark Contacted
            </button>
          )}
          {inquiry.status !== "converted" && (
            <button onClick={() => updateStatus("converted")} className="flex items-center gap-2 px-4 py-2.5 border border-success/30 text-success text-sm hover:bg-success/10 transition-colors rounded-md">
              <Check size={14} /> Mark Converted
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
