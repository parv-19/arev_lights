"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { IBrochure, ICategory } from "@/types";
import { uploadFile } from "@/lib/utils";

interface BrochureForm {
  title: string;
  categoryId: string;
  sortOrder: number;
  isVisible: boolean;
}

export default function AdminBrochuresPage() {
  const [brochures, setBrochures] = useState<IBrochure[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<IBrochure | null>(null);
  const [form, setForm] = useState<BrochureForm>({ title: "", categoryId: "", sortOrder: 0, isVisible: true });
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const fetch_ = async () => {
    setLoading(true);
    const [br, cat] = await Promise.all([fetch("/api/brochures").then(r => r.json()), fetch("/api/categories").then(r => r.json())]);
    if (br.success) setBrochures(br.data);
    if (cat.success) setCategories(cat.data);
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", categoryId: "", sortOrder: brochures.length, isVisible: true });
    setPreviewFile(null); setPreviewUrl(""); setShowForm(true);
  };

  const openEdit = (b: IBrochure) => {
    setEditing(b);
    setForm({ title: b.title, categoryId: (b.category as ICategory)?._id || "", sortOrder: b.sortOrder, isVisible: b.isVisible });
    setPreviewUrl(b.previewImage?.url || ""); setPreviewFile(null); setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let pdfUrl = editing?.pdfUrl || "";
    let pdfPublicId = editing?.pdfPublicId || "";
    let previewImage = editing?.previewImage || { url: "", publicId: "" };
    if (previewFile) {
      try { previewImage = await uploadFile(previewFile, "arev-lights/brochures/previews"); }
      catch { toast.error("Preview upload failed"); }
    }

    const payload = { ...form, category: form.categoryId || undefined, pdfUrl, pdfPublicId, previewImage };
    const url = editing ? `/api/brochures/${editing._id}` : "/api/brochures";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (data.success) { toast.success(editing ? "Updated!" : "Created!"); setShowForm(false); fetch_(); }
    else toast.error(data.message || "Error");
    setSaving(false);
  };

  const handleDelete = async (b: IBrochure) => {
    if (!confirm(`Delete "${b.title}"?`)) return;
    const res = await fetch(`/api/brochures/${b._id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) { toast.success("Deleted"); fetch_(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-neutral text-xl font-semibold">Brochures</h1><p className="text-muted text-sm mt-0.5">{brochures.length} brochures</p></div>
        <button onClick={openNew} className="btn-gold text-sm py-2.5 px-5"><Plus size={16} /> Add Brochure</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-neutral font-semibold">{editing ? "Edit Brochure" : "New Brochure"}</h2>
              <button onClick={() => setShowForm(false)} className="text-muted hover:text-neutral">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div><label className="admin-label">Title *</label><input className="admin-input" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
              <div><label className="admin-label">Category</label><select className="admin-input" value={form.categoryId} onChange={(e) => setForm(f => ({ ...f, categoryId: e.target.value }))}><option value="">None</option>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>

              {/* Preview Image */}
              <div>
                <label className="admin-label">Preview Image</label>
                <div className="flex items-center gap-3">
                  {previewUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={previewUrl} alt="preview" width={80} height={60} className="object-cover border border-border rounded" />
                  )}
                  <label className="cursor-pointer btn-outline-gold text-xs py-2 px-4">
                    Choose Image
                    <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setPreviewFile(f); setPreviewUrl(URL.createObjectURL(f)); } }} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="admin-label">Sort Order</label><input type="number" className="admin-input" value={form.sortOrder} onChange={(e) => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} /></div>
                <div className="flex items-center gap-3 pt-5">
                  <label className="admin-label mb-0">Visible</label>
                  <button type="button" onClick={() => setForm(f => ({ ...f, isVisible: !f.isVisible }))}>{form.isVisible ? <ToggleRight size={22} className="text-success" /> : <ToggleLeft size={22} className="text-muted" />}</button>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="admin-card h-40 animate-pulse" />)
        ) : brochures.map(b => (
          <div key={b._id} className={`admin-card flex flex-col gap-3 ${!b.isVisible ? "opacity-50" : ""}`}>
            {b.previewImage?.url && (
              <div className="relative h-28 rounded overflow-hidden">
                <Image src={b.previewImage.url} alt={b.title} fill className="object-cover" sizes="300px" />
              </div>
            )}
            <div className="flex-1">
              {b.category && <p className="text-accent text-[10px] font-label uppercase tracking-wider mb-1">{(b.category as ICategory).name}</p>}
              <p className="text-neutral text-sm font-medium leading-snug">{b.title}</p>
              <p className="text-muted text-xs mt-1">Order: {b.sortOrder} · {b.isVisible ? "Visible" : "Hidden"}</p>
            </div>
            <div className="flex gap-2 border-t border-border pt-2">
              <button onClick={() => openEdit(b)} className="p-1.5 text-muted hover:text-accent transition-colors ml-auto"><Pencil size={13} /></button>
              <button onClick={() => handleDelete(b)} className="p-1.5 text-muted hover:text-danger transition-colors"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
