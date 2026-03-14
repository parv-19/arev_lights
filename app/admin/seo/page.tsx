"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ISeoMetadata } from "@/types";
import { uploadFile } from "@/lib/utils";

export default function AdminSeoPage() {
  const [pages, setPages] = useState<ISeoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ISeoMetadata | null>(null);
  const [form, setForm] = useState({ title: "", description: "", canonical: "" });
  const [ogFile, setOgFile] = useState<File | null>(null);
  const [ogPreview, setOgPreview] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/seo").then(r => r.json()).then(d => {
      if (d.success) setPages(d.data);
      setLoading(false);
    });
  }, []);

  const startEdit = (page: ISeoMetadata) => {
    setEditing(page);
    setForm({ title: page.title, description: page.description, canonical: page.canonical || "" });
    setOgPreview(page.ogImage?.url || "");
    setOgFile(null);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);

    let ogImage = editing.ogImage || { url: "", publicId: "" };
    if (ogFile) {
      try { ogImage = await uploadFile(ogFile, "arev-lights/seo"); }
      catch { toast.error("Image upload failed"); setSaving(false); return; }
    }

    const payload = { pageKey: editing.pageKey, ...form, ogImage };
    const res = await fetch("/api/seo", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();

    if (data.success) {
      toast.success("SEO updated!");
      setPages(prev => prev.map(p => p.pageKey === editing.pageKey ? data.data : p));
      setEditing(null);
    } else toast.error("Failed to save");
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-muted">Loading…</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-neutral text-xl font-semibold">SEO Management</h1>
      <p className="text-muted text-sm">Manage meta titles, descriptions, and OG images for each page.</p>

      <div className="space-y-3">
        {pages.map(page => (
          <div key={page.pageKey} className="admin-card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-accent font-label text-xs uppercase tracking-wider mb-1">{page.pageLabel}</p>
                <p className="text-neutral text-sm font-medium">{page.title}</p>
                {page.description && <p className="text-muted text-xs mt-1 leading-relaxed line-clamp-2">{page.description}</p>}
              </div>
              <button onClick={() => startEdit(page)} className="text-muted hover:text-accent transition-colors text-xs border border-border px-3 py-1.5 rounded whitespace-nowrap">Edit SEO</button>
            </div>

            {editing?.pageKey === page.pageKey && (
              <div className="mt-5 pt-5 border-t border-border space-y-4">
                <div>
                  <label className="admin-label">Meta Title</label>
                  <input className="admin-input" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} />
                  <p className="text-muted text-xs mt-1">{form.title.length}/60 characters</p>
                </div>
                <div>
                  <label className="admin-label">Meta Description</label>
                  <textarea className="admin-input resize-none h-20" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
                  <p className="text-muted text-xs mt-1">{form.description.length}/160 characters</p>
                </div>
                <div>
                  <label className="admin-label">OG Image</label>
                  <div className="flex items-center gap-3">
                    {ogPreview && <img src={ogPreview} alt="og" className="w-24 h-14 object-cover border border-border rounded" />}
                    <label className="cursor-pointer btn-outline-gold text-xs py-2 px-4">
                      Choose Image
                      <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setOgFile(f); setOgPreview(URL.createObjectURL(f)); } }} className="hidden" />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="admin-label">Canonical URL (optional)</label>
                  <input className="admin-input" value={form.canonical} onChange={(e) => setForm(f => ({ ...f, canonical: e.target.value }))} placeholder="https://arevlights.com/…" />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSave} disabled={saving} className="btn-gold py-2.5 px-6 text-sm">{saving ? "Saving…" : "Save"}</button>
                  <button onClick={() => setEditing(null)} className="btn-outline-gold py-2.5 px-5 text-sm">Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
