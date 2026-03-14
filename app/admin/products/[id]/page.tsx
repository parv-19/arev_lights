"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { ArrowLeft, Plus, Trash2, Upload, X, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { ICategory, IBrand } from "@/types";
import { slugify, uploadFile } from "@/lib/utils";

interface SpecRow { key: string; value: string; }

interface ProductForm {
  title: string;
  slug: string;
  shortDesc: string;
  description: string;
  category: string;
  brand: string;
  tags: string;
  isFeatured: boolean;
  isActive: boolean;
}

export default function AdminProductFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";

  const [form, setForm] = useState<ProductForm>({
    title: "", slug: "", shortDesc: "", description: "", category: "", brand: "", tags: "", isFeatured: false, isActive: true,
  });
  const [specs, setSpecs] = useState<SpecRow[]>([{ key: "", value: "" }]);
  const [images, setImages] = useState<{ url: string; publicId: string; isPrimary: boolean }[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then(r => r.json()),
      fetch("/api/brands").then(r => r.json()),
    ]).then(([catData, brandData]) => {
      if (catData.success) setCategories(catData.data);
      if (brandData.success) setBrands(brandData.data);
    });

    if (!isNew) {
      fetch(`/api/products/${params.id}`)
        .then(r => r.json())
        .then(d => {
          if (d.success) {
            const p = d.data;
            setForm({
              title: p.title, slug: p.slug, shortDesc: p.shortDesc || "", description: p.description || "",
              category: p.category?._id || "", brand: p.brand?._id || "", tags: (p.tags || []).join(", "),
              isFeatured: p.isFeatured, isActive: p.isActive,
            });
            setImages(p.images || []);
            setSpecs(p.specs?.length ? p.specs : [{ key: "", value: "" }]);
          }
          setLoading(false);
        });
    }
  }, [isNew, params.id]);

  const onDrop = useCallback((files: File[]) => {
    setNewImageFiles(prev => [...prev, ...files]);
    setNewImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "image/*": [] } });

  const removeNewImage = (i: number) => { setNewImageFiles(f => f.filter((_, idx) => idx !== i)); setNewImagePreviews(f => f.filter((_, idx) => idx !== i)); };
  const removeExistingImage = (i: number) => setImages(f => f.filter((_, idx) => idx !== i));
  const setPrimary = (i: number) => setImages(f => f.map((img, idx) => ({ ...img, isPrimary: idx === i })));

  const addSpec = () => setSpecs(prev => [...prev, { key: "", value: "" }]);
  const removeSpec = (i: number) => setSpecs(f => f.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, field: "key" | "value", val: string) => setSpecs(f => f.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const uploaded: typeof images = [...images];

    for (const file of newImageFiles) {
      try {
        const r = await uploadFile(file, "arev-lights/products");
        uploaded.push({ url: r.url, publicId: r.publicId, isPrimary: uploaded.length === 0 });
      } catch { toast.error(`Upload failed: ${file.name}`); }
    }

    if (!uploaded.some(img => img.isPrimary)) { if (uploaded.length > 0) uploaded[0].isPrimary = true; }

    const payload = {
      ...form,
      images: uploaded,
      specs: specs.filter(s => s.key.trim()),
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      category: form.category || undefined,
      brand: form.brand || undefined,
    };

    const url = isNew ? "/api/products" : `/api/products/${params.id}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();

    if (data.success) { toast.success(isNew ? "Product created!" : "Product updated!"); router.push("/admin/products"); }
    else toast.error(data.message || "Save failed");
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-muted">Loading product…</div>;

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="text-muted hover:text-accent transition-colors"><ArrowLeft size={18} /></Link>
        <h1 className="text-neutral text-xl font-semibold">{isNew ? "New Product" : "Edit Product"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="admin-card space-y-4">
          <h2 className="text-neutral font-medium text-sm uppercase tracking-wider">Basic Information</h2>
          <div><label className="admin-label">Product Title *</label><input className="admin-input" value={form.title} onChange={(e) => { const t = e.target.value; setForm(f => ({ ...f, title: t, slug: isNew ? slugify(t) : f.slug })); }} required /></div>
          <div><label className="admin-label">Slug</label><input className="admin-input" value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} /></div>
          <div><label className="admin-label">Short Description</label><textarea className="admin-input resize-none h-16" value={form.shortDesc} onChange={(e) => setForm(f => ({ ...f, shortDesc: e.target.value }))} /></div>
          <div><label className="admin-label">Full Description</label><textarea className="admin-input resize-none h-32" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} /></div>
        </div>

        {/* Classification */}
        <div className="admin-card space-y-4">
          <h2 className="text-neutral font-medium text-sm uppercase tracking-wider">Classification</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="admin-label">Category</label><select className="admin-input" value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}><option value="">-- None --</option>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
            <div><label className="admin-label">Brand</label><select className="admin-input" value={form.brand} onChange={(e) => setForm(f => ({ ...f, brand: e.target.value }))}><option value="">-- None --</option>{brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}</select></div>
          </div>
          <div><label className="admin-label">Tags (comma separated)</label><input className="admin-input" value={form.tags} onChange={(e) => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="LED, Indoor, 10W, Warm White" /></div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm(f => ({ ...f, isFeatured: e.target.checked }))} className="accent-accent" /><span className="text-neutral text-sm">Featured on Homepage</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm(f => ({ ...f, isActive: e.target.checked }))} className="accent-accent" /><span className="text-neutral text-sm">Active (visible)</span></label>
          </div>
        </div>

        {/* Images */}
        <div className="admin-card space-y-4">
          <h2 className="text-neutral font-medium text-sm uppercase tracking-wider">Product Images</h2>

          {/* Existing images */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={i} className={`relative border-2 rounded overflow-hidden ${img.isPrimary ? "border-accent" : "border-border"}`}>
                  <Image src={img.url} alt="" width={80} height={80} className="object-cover w-20 h-20" />
                  <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 p-1 bg-primary/70">
                    <button type="button" onClick={() => setPrimary(i)} title="Set Primary" className="text-accent hover:text-accent-light"><Star size={11} className={img.isPrimary ? "fill-accent" : ""} /></button>
                    <button type="button" onClick={() => removeExistingImage(i)} className="text-danger"><X size={11} /></button>
                  </div>
                  {img.isPrimary && <div className="absolute top-1 left-1 bg-accent rounded text-[8px] text-primary px-1 font-bold">PRIMARY</div>}
                </div>
              ))}
            </div>
          )}

          {/* New image previews */}
          {newImagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {newImagePreviews.map((prev, i) => (
                <div key={i} className="relative border border-accent/30 rounded overflow-hidden">
                  <Image src={prev} alt="" width={80} height={80} className="object-cover w-20 h-20" />
                  <button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 w-4 h-4 bg-danger rounded-full flex items-center justify-center"><X size={9} className="text-white" /></button>
                </div>
              ))}
            </div>
          )}

          {/* Dropzone */}
          <div {...getRootProps()} className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${isDragActive ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"}`}>
            <input {...getInputProps()} />
            <Upload size={22} className="text-muted mx-auto mb-2" />
            <p className="text-muted text-sm">{isDragActive ? "Drop images here" : "Drop product images or click to browse"}</p>
            <p className="text-muted/60 text-xs mt-1">Multiple images supported. Click ★ to set primary image.</p>
          </div>
        </div>

        {/* Specs */}
        <div className="admin-card space-y-4">
          <div className="flex items-center justify-between"><h2 className="text-neutral font-medium text-sm uppercase tracking-wider">Specifications</h2><button type="button" onClick={addSpec} className="flex items-center gap-1 text-accent text-xs border border-accent/30 px-2.5 py-1 rounded hover:bg-accent/10 transition-colors"><Plus size={12} /> Add Row</button></div>
          <div className="space-y-2">
            {specs.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input className="admin-input flex-1" placeholder="e.g. Wattage" value={s.key} onChange={(e) => updateSpec(i, "key", e.target.value)} />
                <input className="admin-input flex-1" placeholder="e.g. 10W" value={s.value} onChange={(e) => updateSpec(i, "value", e.target.value)} />
                <button type="button" onClick={() => removeSpec(i)} className="text-muted hover:text-danger transition-colors flex-shrink-0"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-gold py-3 px-8 text-sm">{saving ? "Saving…" : isNew ? "Create Product" : "Update Product"}</button>
          <Link href="/admin/products" className="btn-outline-gold py-3 px-6 text-sm">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
