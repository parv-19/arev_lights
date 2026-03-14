"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";
import { IBrand } from "@/types";
import { uploadFile } from "@/lib/utils";
import Image from "next/image";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<IBrand | null>(null);
  const [form, setForm] = useState({ name: "", websiteUrl: "", sortOrder: 0 });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [saving, setSaving] = useState(false);

  const fetch_ = async () => {
    setLoading(true);
    const res = await fetch("/api/brands");
    const data = await res.json();
    if (data.success) setBrands(data.data);
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", websiteUrl: "", sortOrder: brands.length });
    setLogoFile(null); setLogoPreview(""); setShowForm(true);
  };

  const openEdit = (b: IBrand) => {
    setEditing(b);
    setForm({ name: b.name, websiteUrl: b.websiteUrl || "", sortOrder: b.sortOrder });
    setLogoPreview(b.logo?.url || ""); setLogoFile(null); setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    let logo = editing?.logo || { url: "", publicId: "" };
    if (logoFile) {
      try { logo = await uploadFile(logoFile, "arev-lights/brands"); }
      catch { toast.error("Logo upload failed"); setSaving(false); return; }
    }
    const payload = { ...form, logo };
    const url = editing ? `/api/brands/${editing._id}` : "/api/brands";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (data.success) { toast.success(editing ? "Updated!" : "Created!"); setShowForm(false); fetch_(); }
    else toast.error(data.message || "Error");
    setSaving(false);
  };

  const handleDelete = async (b: IBrand) => {
    if (!confirm(`Delete brand "${b.name}"?`)) return;
    const res = await fetch(`/api/brands/${b._id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) { toast.success("Deleted"); fetch_(); }
  };

  const toggleActive = async (b: IBrand) => {
    const res = await fetch(`/api/brands/${b._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !b.isActive }) });
    const data = await res.json();
    if (data.success) fetch_();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-neutral text-xl font-semibold">Brands</h1><p className="text-muted text-sm mt-0.5">{brands.length} brands</p></div>
        <button onClick={openNew} className="btn-gold text-sm py-2.5 px-5"><Plus size={16} /> Add Brand</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-neutral font-semibold">{editing ? "Edit Brand" : "New Brand"}</h2>
              <button onClick={() => setShowForm(false)} className="text-muted hover:text-neutral">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="admin-label">Logo</label>
                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <div className="relative w-16 h-16 border border-border rounded overflow-hidden flex-shrink-0 bg-white/5">
                      <Image src={logoPreview} alt="logo" fill className="object-contain p-1" sizes="64px" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 border-2 border-dashed border-border rounded flex items-center justify-center text-muted text-xs flex-shrink-0">Logo</div>
                  )}
                  <label className="cursor-pointer btn-outline-gold text-xs py-2 px-4">
                    Choose Logo
                    <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); } }} className="hidden" />
                  </label>
                </div>
              </div>
              <div><label className="admin-label">Brand Name *</label><input className="admin-input" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
              <div><label className="admin-label">Website URL</label><input className="admin-input" type="url" value={form.websiteUrl} onChange={(e) => setForm(f => ({ ...f, websiteUrl: e.target.value }))} placeholder="https://…" /></div>
              <div><label className="admin-label">Sort Order</label><input type="number" className="admin-input" value={form.sortOrder} onChange={(e) => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} /></div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-gold flex-1 justify-center py-2.5 text-sm">{saving ? "Saving…" : editing ? "Update" : "Create"}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline-gold px-5 py-2.5 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <div key={i} className="admin-card aspect-[4/3] animate-pulse" />)
        ) : brands.map(b => (
          <div key={b._id} className={`admin-card flex flex-col items-center gap-3 text-center ${!b.isActive ? "opacity-50" : ""}`}>
            <div className="relative w-20 h-14 flex items-center justify-center">
              {b.logo?.url ? (
                <Image src={b.logo.url} alt={b.name} fill className="object-contain" sizes="80px" />
              ) : (
                <div className="w-full h-full bg-surface-2 border border-border rounded flex items-center justify-center text-muted text-xs">{b.name[0]}</div>
              )}
            </div>
            <p className="text-neutral text-sm font-medium">{b.name}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(b)} className="p-1.5 text-muted hover:text-accent transition-colors"><Pencil size={13} /></button>
              <button onClick={() => toggleActive(b)}>{b.isActive ? <ToggleRight size={18} className="text-success" /> : <ToggleLeft size={18} className="text-muted" />}</button>
              <button onClick={() => handleDelete(b)} className="p-1.5 text-muted hover:text-danger transition-colors"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
