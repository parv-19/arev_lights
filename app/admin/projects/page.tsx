"use client";
import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Plus, Pencil, Trash2, Star, Upload, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { IProject } from "@/types";
import { uploadFile } from "@/lib/utils";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<IProject | null>(null);
  const [form, setForm] = useState({ title: "", description: "", location: "", tags: "", isFeatured: false });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<{ url: string; publicId: string }[]>([]);
  const [saving, setSaving] = useState(false);

  const fetch_ = async () => {
    setLoading(true);
    const res = await fetch("/api/projects");
    const data = await res.json();
    if (data.success) setProjects(data.data);
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const onDrop = useCallback((files: File[]) => {
    setImageFiles(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "image/*": [] } });

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", description: "", location: "", tags: "", isFeatured: false });
    setImageFiles([]); setImagePreviews([]); setExistingImages([]); setShowForm(true);
  };

  const openEdit = (p: IProject) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description, location: p.location || "", tags: p.tags.join(", "), isFeatured: p.isFeatured });
    setExistingImages(p.images); setImageFiles([]); setImagePreviews([]); setShowForm(true);
  };

  const removeNewImage = (i: number) => { setImageFiles(f => f.filter((_, idx) => idx !== i)); setImagePreviews(f => f.filter((_, idx) => idx !== i)); };
  const removeExistingImage = (i: number) => setExistingImages(f => f.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const uploadedImages: { url: string; publicId: string }[] = [...existingImages];
    for (const file of imageFiles) {
      try { const r = await uploadFile(file, "arev-lights/projects"); uploadedImages.push(r); }
      catch { toast.error(`Upload failed: ${file.name}`); }
    }
    const payload = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean), images: uploadedImages };
    const url = editing ? `/api/projects/${editing._id}` : "/api/projects";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (data.success) { toast.success(editing ? "Updated!" : "Created!"); setShowForm(false); fetch_(); }
    else toast.error(data.message || "Error");
    setSaving(false);
  };

  const handleDelete = async (p: IProject) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    const res = await fetch(`/api/projects/${p._id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) { toast.success("Deleted"); fetch_(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-neutral text-xl font-semibold">Projects & Gallery</h1><p className="text-muted text-sm mt-0.5">{projects.length} projects</p></div>
        <button onClick={openNew} className="btn-gold text-sm py-2.5 px-5"><Plus size={16} /> Add Project</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-neutral font-semibold">{editing ? "Edit Project" : "New Project"}</h2>
              <button onClick={() => setShowForm(false)} className="text-muted hover:text-neutral">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="admin-label">Project Title *</label><input className="admin-input" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
              <div><label className="admin-label">Description</label><textarea className="admin-input resize-none h-20" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="admin-label">Location</label><input className="admin-input" value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Mumbai" /></div>
                <div><label className="admin-label">Tags (comma separated)</label><input className="admin-input" value={form.tags} onChange={(e) => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="Hotel, Lobby" /></div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="featured" checked={form.isFeatured} onChange={(e) => setForm(f => ({ ...f, isFeatured: e.target.checked }))} className="accent-accent" />
                <label htmlFor="featured" className="text-neutral text-sm cursor-pointer">Mark as Featured</label>
              </div>

              {/* Images */}
              <div>
                <label className="admin-label">Images</label>
                {/* Existing */}
                {existingImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {existingImages.map((img, i) => (
                      <div key={i} className="relative"><Image src={img.url} alt="" width={64} height={64} className="object-cover rounded border border-border" /><button type="button" onClick={() => removeExistingImage(i)} className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-danger rounded-full flex items-center justify-center"><X size={9} className="text-white" /></button></div>
                    ))}
                  </div>
                )}
                {/* New */}
                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {imagePreviews.map((prev, i) => (
                      <div key={i} className="relative"><Image src={prev} alt="" width={64} height={64} className="object-cover rounded border border-accent/30" /><button type="button" onClick={() => removeNewImage(i)} className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-danger rounded-full flex items-center justify-center"><X size={9} className="text-white" /></button></div>
                    ))}
                  </div>
                )}
                <div {...getRootProps()} className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${isDragActive ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"}`}>
                  <input {...getInputProps()} />
                  <Upload size={20} className="text-muted mx-auto mb-1" />
                  <p className="text-muted text-xs">{isDragActive ? "Drop images here" : "Drop images or click to add"}</p>
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
        {loading ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="admin-card aspect-video animate-pulse" />) :
          projects.map(p => (
            <div key={p._id} className="admin-card overflow-hidden p-0">
              {p.images?.[0]?.url && (
                <div className="relative aspect-video"><Image src={p.images[0].url} alt={p.title} fill className="object-cover" sizes="350px" /></div>
              )}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-neutral text-sm font-medium leading-snug">{p.title}</p>
                    {p.location && <p className="text-muted text-xs mt-0.5">{p.location}</p>}
                  </div>
                  {p.isFeatured && <Star size={13} className="text-accent fill-accent flex-shrink-0 mt-0.5" />}
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => openEdit(p)} className="flex-1 py-1.5 text-xs border border-border text-muted hover:text-accent hover:border-accent/50 transition-colors"><Pencil size={12} className="inline mr-1" />Edit</button>
                  <button onClick={() => handleDelete(p)} className="py-1.5 px-3 text-xs border border-border text-muted hover:text-danger hover:border-danger/30 transition-colors"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
