"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Play, X, Link as LinkIcon, Image as ImageIcon, Search, Upload } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { uploadFile } from "@/lib/utils";

interface IGlimpse {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnail?: { url: string; publicId?: string };
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
}

function getEmbedUrl(url: string): string {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0&modestbranding=1`;
  // Instagram — just return as is (can't embed directly; show thumbnail + link)
  return url;
}

function isYouTube(url: string) {
  return /youtube\.com|youtu\.be/.test(url);
}
function isInstagram(url: string) {
  return /instagram\.com/.test(url);
}

export default function AdminGlimpsesPage() {
  const [glimpses, setGlimpses] = useState<IGlimpse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<IGlimpse | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    isVisible: true,
    sortOrder: 0,
    thumbnail: { url: "", publicId: "" },
  });
  const [fetchingOg, setFetchingOg] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetch_ = async () => {
    setLoading(true);
    const res = await fetch("/api/glimpses");
    const data = await res.json();
    if (data.success) setGlimpses(data.data);
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", description: "", videoUrl: "", isVisible: true, sortOrder: glimpses.length, thumbnail: { url: "", publicId: "" } });
    setShowForm(true);
  };

  const openEdit = (g: IGlimpse) => {
    setEditing(g);
    setForm({ title: g.title, description: g.description || "", videoUrl: g.videoUrl, isVisible: g.isVisible, sortOrder: g.sortOrder, thumbnail: { url: g.thumbnail?.url || "", publicId: g.thumbnail?.publicId || "" } });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.videoUrl.trim()) { toast.error("Video URL is required"); return; }
    setSaving(true);
    const url = editing ? `/api/glimpses/${editing._id}` : "/api/glimpses";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (data.success) { toast.success(editing ? "Updated!" : "Created!"); setShowForm(false); fetch_(); }
    else toast.error(data.message || "Error");
    setSaving(false);
  };

  const handleDelete = async (g: IGlimpse) => {
    if (!confirm(`Delete "${g.title}"?`)) return;
    const res = await fetch(`/api/glimpses/${g._id}`, { method: "DELETE" });
    if ((await res.json()).success) { toast.success("Deleted"); fetch_(); }
  };

  const toggleVisibility = async (g: IGlimpse) => {
    await fetch(`/api/glimpses/${g._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isVisible: !g.isVisible }) });
    fetch_();
  };

  const attemptFetchThumbnail = async () => {
    if (!form.videoUrl) return toast.error("Enter a video URL first");
    setFetchingOg(true);
    try {
      const res = await fetch("/api/fetch-thumbnail", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: form.videoUrl }) });
      const data = await res.json();
      if (data.success) {
        setForm(f => ({ ...f, thumbnail: { url: data.url, publicId: "" } }));
        toast.success("Thumbnail fetched!");
      } else {
        toast.error(data.message || "Could not fetch thumbnail natively");
      }
    } catch {
      toast.error("Network error fetching thumbnail");
    }
    setFetchingOg(false);
  };

  const handleUploadThumbnail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const result = await uploadFile(file, "arev-lights/glimpses");
      setForm(f => ({ ...f, thumbnail: { url: result.url, publicId: result.publicId } }));
      toast.success("Custom thumbnail uploaded!");
    } catch {
      toast.error("Failed to upload custom thumbnail");
    }
    setUploadingImage(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-neutral text-xl font-semibold">Glimpses & Reels</h1>
          <p className="text-muted text-sm mt-0.5">{glimpses.length} video{glimpses.length !== 1 ? "s" : ""} — paste a YouTube or Instagram link</p>
        </div>
        <button onClick={openNew} className="btn-gold text-sm py-2.5 px-5 flex items-center gap-2">
          <Plus size={16} /> Add Video
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-lg w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-neutral font-semibold">{editing ? "Edit Glimpse" : "Add Video / Reel"}</h2>
              <button onClick={() => setShowForm(false)} className="text-muted hover:text-neutral"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="admin-label">Title *</label>
                <input className="admin-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Luxury Villa Project — Ahmedabad" required />
              </div>

              <div>
                <label className="admin-label flex items-center gap-1.5"><LinkIcon size={12} /> Video URL *</label>
                <input
                  className="admin-input font-mono text-xs"
                  value={form.videoUrl}
                  onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=... or https://www.instagram.com/reel/..."
                  required
                />
                <p className="text-muted text-xs mt-1">Supports: YouTube videos, YouTube Shorts, Instagram Reels</p>
              </div>

              <div>
                <label className="admin-label">Description (optional)</label>
                <textarea className="admin-input resize-none h-16 text-sm" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Lighting design for a 5-star hotel lobby..." />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="admin-label">Sort Order</label>
                  <input type="number" className="admin-input" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} min={0} />
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <input type="checkbox" id="vis" checked={form.isVisible} onChange={e => setForm(f => ({ ...f, isVisible: e.target.checked }))} className="accent-accent w-4 h-4" />
                  <label htmlFor="vis" className="text-neutral text-sm cursor-pointer">Visible on site</label>
                </div>
              </div>

              <div className="border border-border p-4 rounded bg-surface-2 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="admin-label mb-0 flex items-center gap-1.5"><ImageIcon size={14} /> Thumbnail Image</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={attemptFetchThumbnail} disabled={fetchingOg} className="btn-outline-gold px-3 py-1.5 text-xs flex items-center gap-1">
                      {fetchingOg ? <div className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" /> : <Search size={12} />} Fetch from URL
                    </button>
                    <label className="cursor-pointer bg-neutral hover:bg-neutral/90 text-primary text-xs font-semibold px-3 py-1.5 rounded transition-colors flex items-center gap-1">
                      {uploadingImage ? "Uploading..." : <><Upload size={12} /> Upload Custom</>}
                      <input type="file" accept="image/*" className="hidden" onChange={handleUploadThumbnail} disabled={uploadingImage} />
                    </label>
                  </div>
                </div>
                
                {form.thumbnail?.url ? (
                  <div className="relative aspect-video rounded overflow-hidden border border-border">
                    <Image src={form.thumbnail.url} alt="Thumbnail preview" fill className="object-cover" sizes="(max-width: 400px) 100vw, 400px" />
                    <button type="button" onClick={() => setForm(f => ({ ...f, thumbnail: { url: "", publicId: "" } }))} className="absolute top-2 right-2 bg-danger text-white rounded-full p-1 hover:bg-danger/80">
                      <X size={14} />
                    </button>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white">
                        <Play size={20} className="ml-1 text-white shadow-sm" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-primary/30 border-2 border-dashed border-border rounded flex flex-col items-center justify-center text-muted gap-2">
                    <ImageIcon size={24} className="opacity-50" />
                    <span className="text-xs">No thumbnail. Video will fall back to native embed (if YouTube) or a generic placeholder.</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-gold flex-1 justify-center py-2.5 text-sm">
                  {saving ? "Saving…" : editing ? "Update" : "Add Video"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline-gold px-5 py-2.5 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="admin-card aspect-video animate-pulse" />)}
        </div>
      ) : glimpses.length === 0 ? (
        <div className="admin-card flex flex-col items-center justify-center h-48 gap-3">
          <Play size={32} className="text-muted" />
          <p className="text-muted text-sm">No videos yet. Click "Add Video" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {glimpses.map(g => (
            <div key={g._id} className="admin-card overflow-hidden p-0">
              {/* Video Preview */}
              <div className="relative aspect-video bg-surface-2">
                {g.thumbnail?.url ? (
                  <a href={g.videoUrl} target="_blank" rel="noopener noreferrer" className="relative group block h-full">
                    <img src={g.thumbnail.url} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center">
                        <Play size={20} className="text-white ml-1 shadow-sm" />
                      </div>
                    </div>
                  </a>
                ) : isYouTube(g.videoUrl) ? (
                  <iframe src={getEmbedUrl(g.videoUrl)} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                ) : (
                  <a href={g.videoUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center h-full gap-2 group">
                    <div className="w-12 h-12 rounded-full bg-[#E1306C]/20 border border-[#E1306C]/40 flex items-center justify-center group-hover:bg-[#E1306C]/30 transition-all">
                      <Play size={20} className="text-[#E1306C]" />
                    </div>
                    <span className="text-muted text-xs">Open External Link ↗</span>
                  </a>
                )}
                {!g.isVisible && (
                  <div className="absolute inset-0 bg-primary/60 flex items-center justify-center pointer-events-none">
                    <span className="text-muted text-xs font-label uppercase tracking-wider bg-primary/90 px-3 py-1 rounded">Hidden</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <p className="text-neutral text-sm font-medium leading-snug truncate">{g.title}</p>
                {g.description && <p className="text-muted text-xs truncate">{g.description}</p>}
                <div className="flex gap-2 pt-1">
                  <button onClick={() => openEdit(g)} className="flex-1 py-1.5 text-xs border border-border text-muted hover:text-accent hover:border-accent/50 transition-colors flex items-center justify-center gap-1">
                    <Pencil size={11} /> Edit
                  </button>
                  <button onClick={() => toggleVisibility(g)} className={`py-1.5 px-3 text-xs border transition-colors ${g.isVisible ? "border-border text-muted hover:text-warning" : "border-accent/30 text-accent"}`} title={g.isVisible ? "Hide" : "Show"}>
                    {g.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>
                  <button onClick={() => handleDelete(g)} className="py-1.5 px-3 text-xs border border-border text-muted hover:text-danger hover:border-danger/30 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
