"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { ITestimonial } from "@/types";

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<ITestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ITestimonial | null>(null);
  const [form, setForm] = useState({ clientName: "", designation: "", company: "", reviewText: "", rating: 5, sortOrder: 0 });
  const [saving, setSaving] = useState(false);

  const fetch_ = async () => {
    setLoading(true);
    const res = await fetch("/api/testimonials");
    const data = await res.json();
    if (data.success) setItems(data.data);
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ clientName: "", designation: "", company: "", reviewText: "", rating: 5, sortOrder: items.length });
    setShowForm(true);
  };

  const openEdit = (t: ITestimonial) => {
    setEditing(t);
    setForm({ clientName: t.clientName, designation: t.designation || "", company: t.company || "", reviewText: t.reviewText, rating: t.rating, sortOrder: t.sortOrder });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = editing ? `/api/testimonials/${editing._id}` : "/api/testimonials";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (data.success) { toast.success(editing ? "Updated!" : "Created!"); setShowForm(false); fetch_(); }
    else toast.error(data.message || "Error");
    setSaving(false);
  };

  const handleDelete = async (t: ITestimonial) => {
    if (!confirm(`Delete testimonial from "${t.clientName}"?`)) return;
    const res = await fetch(`/api/testimonials/${t._id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) { toast.success("Deleted"); fetch_(); }
  };

  const toggleVisibility = async (t: ITestimonial) => {
    const res = await fetch(`/api/testimonials/${t._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isVisible: !t.isVisible }) });
    const data = await res.json();
    if (data.success) fetch_();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-neutral text-xl font-semibold">Testimonials</h1><p className="text-muted text-sm mt-0.5">{items.length} entries</p></div>
        <button onClick={openNew} className="btn-gold text-sm py-2.5 px-5"><Plus size={16} /> Add Testimonial</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-neutral font-semibold">{editing ? "Edit Testimonial" : "New Testimonial"}</h2>
              <button onClick={() => setShowForm(false)} className="text-muted hover:text-neutral">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { key: "clientName", label: "Client Name *", required: true },
                { key: "designation", label: "Designation" },
                { key: "company", label: "Company" },
              ].map(({ key, label, required }) => (
                <div key={key}>
                  <label className="admin-label">{label}</label>
                  <input className="admin-input" value={(form as Record<string, string | number>)[key] as string} onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))} required={required} />
                </div>
              ))}
              <div>
                <label className="admin-label">Review Text *</label>
                <textarea className="admin-input resize-none h-24" value={form.reviewText} onChange={(e) => setForm(f => ({ ...f, reviewText: e.target.value }))} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Rating (1-5)</label>
                  <input type="number" min={1} max={5} className="admin-input" value={form.rating} onChange={(e) => setForm(f => ({ ...f, rating: parseInt(e.target.value) || 5 }))} />
                </div>
                <div>
                  <label className="admin-label">Sort Order</label>
                  <input type="number" className="admin-input" value={form.sortOrder} onChange={(e) => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-gold flex-1 justify-center py-2.5 text-sm">{saving ? "Saving…" : editing ? "Update" : "Create"}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline-gold px-5 py-2.5 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-32 text-muted text-sm">Loading…</div>
        ) : items.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted text-sm">No testimonials yet</div>
        ) : (
          <table className="w-full">
            <thead><tr className="border-b border-border">{["Client", "Company", "Rating", "Visible", "Actions"].map(h => <th key={h} className="text-left px-5 py-3 text-muted text-xs font-label uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody>
              {items.map(t => (
                <tr key={t._id} className="border-b border-border/50 hover:bg-surface-2/50 transition-colors">
                  <td className="px-5 py-3"><p className="text-neutral text-sm font-medium">{t.clientName}</p><p className="text-muted text-xs">{t.designation}</p></td>
                  <td className="px-5 py-3 text-muted text-sm">{t.company || "–"}</td>
                  <td className="px-5 py-3"><div className="flex gap-0.5">{Array.from({ length: t.rating }).map((_, i) => <span key={i} className="text-accent text-xs">★</span>)}</div></td>
                  <td className="px-5 py-3"><button onClick={() => toggleVisibility(t)}>{t.isVisible ? <ToggleRight size={22} className="text-success" /> : <ToggleLeft size={22} className="text-muted" />}</button></td>
                  <td className="px-5 py-3"><div className="flex gap-2"><button onClick={() => openEdit(t)} className="p-1.5 text-muted hover:text-accent transition-colors"><Pencil size={14} /></button><button onClick={() => handleDelete(t)} className="p-1.5 text-muted hover:text-danger transition-colors"><Trash2 size={14} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
