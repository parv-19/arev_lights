"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, GripVertical } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { ICategory } from "@/types";
import { slugify, uploadFile } from "@/lib/utils";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ICategory | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", sortOrder: 0, seoTitle: "", seoDescription: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    const res = await fetch("/api/categories");
    const data = await res.json();
    if (data.success) setCategories(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", sortOrder: categories.length, seoTitle: "", seoDescription: "" });
    setImageFile(null);
    setImagePreview("");
    setShowForm(true);
  };

  const openEdit = (cat: ICategory) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || "", sortOrder: cat.sortOrder, seoTitle: cat.seoTitle || "", seoDescription: cat.seoDescription || "" });
    setImagePreview(cat.image?.url || "");
    setImageFile(null);
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let image = editing?.image || { url: "", publicId: "" };

    if (imageFile) {
      try {
        image = await uploadFile(imageFile, "arev-lights/categories");
      } catch {
        toast.error("Image upload failed");
        setSaving(false);
        return;
      }
    }

    const payload = { ...form, image };

    const url = editing ? `/api/categories/${editing._id}` : "/api/categories";
    const method = editing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      toast.success(editing ? "Category updated!" : "Category created!");
      setShowForm(false);
      fetchCategories();
    } else {
      toast.error(data.message || "Something went wrong");
    }

    setSaving(false);
  };

  const handleDelete = async (cat: ICategory) => {
    if (!confirm(`Delete "${cat.name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/categories/${cat._id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      toast.success("Category deleted");
      fetchCategories();
    } else {
      toast.error("Delete failed");
    }
  };

  const toggleActive = async (cat: ICategory) => {
    const res = await fetch(`/api/categories/${cat._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !cat.isActive }),
    });
    const data = await res.json();
    if (data.success) {
      fetchCategories();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-neutral text-xl font-semibold">Categories</h1>
          <p className="text-muted text-sm mt-0.5">{categories.length} total categories</p>
        </div>
        <button onClick={openNew} className="btn-gold text-sm py-2.5 px-5">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-neutral font-semibold">{editing ? "Edit Category" : "New Category"}</h2>
              <button onClick={() => setShowForm(false)} className="text-muted hover:text-neutral">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Image Upload */}
              <div>
                <label className="admin-label">Category Image</label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <div className="relative w-20 h-20 rounded overflow-hidden border border-border flex-shrink-0">
                      <Image src={imagePreview} alt="preview" fill className="object-cover" sizes="80px" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 border-2 border-dashed border-border rounded flex items-center justify-center flex-shrink-0 text-muted text-xs">
                      No image
                    </div>
                  )}
                  <label className="cursor-pointer btn-outline-gold text-xs py-2 px-4">
                    Choose Image
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="admin-label">Category Name *</label>
                <input className="admin-input" value={form.name} onChange={(e) => { setForm(f => ({ ...f, name: e.target.value, slug: editing ? f.slug : slugify(e.target.value) })); }} required />
              </div>

              {/* Slug */}
              <div>
                <label className="admin-label">Slug *</label>
                <input className="admin-input" value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} required />
              </div>

              {/* Description */}
              <div>
                <label className="admin-label">Description</label>
                <textarea className="admin-input resize-none h-20" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>

              {/* Sort Order */}
              <div>
                <label className="admin-label">Sort Order</label>
                <input type="number" className="admin-input" value={form.sortOrder} onChange={(e) => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} />
              </div>

              {/* SEO */}
              <div className="border-t border-border pt-4">
                <p className="text-muted text-xs font-label uppercase tracking-wider mb-3">SEO Fields</p>
                <div className="space-y-3">
                  <div>
                    <label className="admin-label">SEO Title</label>
                    <input className="admin-input" value={form.seoTitle} onChange={(e) => setForm(f => ({ ...f, seoTitle: e.target.value }))} />
                  </div>
                  <div>
                    <label className="admin-label">SEO Description</label>
                    <textarea className="admin-input resize-none h-16" value={form.seoDescription} onChange={(e) => setForm(f => ({ ...f, seoDescription: e.target.value }))} />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-gold flex-1 justify-center py-2.5 text-sm">
                  {saving ? "Saving…" : editing ? "Update Category" : "Create Category"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline-gold px-5 py-2.5 text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="admin-card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-32 text-muted text-sm">Loading categories…</div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <p className="text-muted text-sm">No categories yet</p>
            <button onClick={openNew} className="text-accent text-sm hover:underline">Add your first category</button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-3 text-muted text-xs font-label uppercase tracking-wider">Category</th>
                <th className="text-left px-6 py-3 text-muted text-xs font-label uppercase tracking-wider hidden sm:table-cell">Slug</th>
                <th className="text-center px-6 py-3 text-muted text-xs font-label uppercase tracking-wider">Order</th>
                <th className="text-center px-6 py-3 text-muted text-xs font-label uppercase tracking-wider">Active</th>
                <th className="text-right px-6 py-3 text-muted text-xs font-label uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-b border-border/50 hover:bg-surface-2/50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      {cat.image?.url ? (
                        <div className="relative w-9 h-9 rounded overflow-hidden border border-border flex-shrink-0">
                          <Image src={cat.image.url} alt={cat.name} fill className="object-cover" sizes="36px" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 bg-surface-2 border border-border rounded flex-shrink-0" />
                      )}
                      <span className="text-neutral text-sm font-medium">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 hidden sm:table-cell">
                    <span className="text-muted text-xs font-mono">{cat.slug}</span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className="text-muted text-sm">{cat.sortOrder}</span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button onClick={() => toggleActive(cat)} className="transition-colors">
                      {cat.isActive ? <ToggleRight size={22} className="text-success" /> : <ToggleLeft size={22} className="text-muted" />}
                    </button>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(cat)} className="p-1.5 text-muted hover:text-accent transition-colors" title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(cat)} className="p-1.5 text-muted hover:text-danger transition-colors" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
