"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Star, ToggleLeft, ToggleRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { IProduct, ICategory } from "@/types";
import { getPrimaryImage } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 12;

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (search) params.set("search", search);
    if (categoryFilter) params.set("category", categoryFilter);
    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    if (data.success) {
      setProducts(data.data);
      setTotal(data.pagination?.total || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(d => { if (d.success) setCategories(d.data); });
  }, []);

  useEffect(() => { fetchProducts(); }, [page, search, categoryFilter]);

  const handleDelete = async (p: IProduct) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    const res = await fetch(`/api/products/${p._id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) { toast.success("Product deleted"); fetchProducts(); }
    else toast.error("Delete failed");
  };

  const toggleFeatured = async (p: IProduct) => {
    const res = await fetch(`/api/products/${p._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !p.isFeatured }),
    });
    const data = await res.json();
    if (data.success) fetchProducts();
  };

  const toggleActive = async (p: IProduct) => {
    const res = await fetch(`/api/products/${p._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !p.isActive }),
    });
    const data = await res.json();
    if (data.success) fetchProducts();
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-neutral text-xl font-semibold">Products</h1>
          <p className="text-muted text-sm mt-0.5">{total} total products</p>
        </div>
        <Link href="/admin/products/new" className="btn-gold text-sm py-2.5 px-5 inline-flex items-center gap-2">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className="admin-input pl-10"
            placeholder="Search products…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="admin-input max-w-[200px]"
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="admin-card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-32 text-muted text-sm">Loading…</div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-muted text-sm">
            No products found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3 text-muted text-xs font-label uppercase tracking-wider">Product</th>
                    <th className="text-left px-5 py-3 text-muted text-xs font-label uppercase tracking-wider hidden md:table-cell">Category</th>
                    <th className="text-center px-5 py-3 text-muted text-xs font-label uppercase tracking-wider">Featured</th>
                    <th className="text-center px-5 py-3 text-muted text-xs font-label uppercase tracking-wider">Active</th>
                    <th className="text-right px-5 py-3 text-muted text-xs font-label uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-b border-border/50 hover:bg-surface-2/50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded overflow-hidden border border-border flex-shrink-0">
                            <Image
                              src={getPrimaryImage(p.images)}
                              alt={p.title}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div>
                            <p className="text-neutral text-sm font-medium leading-tight">{p.title}</p>
                            <p className="text-muted text-xs mt-0.5 font-mono">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <span className="text-muted text-sm">{p.category?.name || "–"}</span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button onClick={() => toggleFeatured(p)} title={p.isFeatured ? "Unfeature" : "Feature"}>
                          <Star size={16} className={p.isFeatured ? "text-accent fill-accent" : "text-muted"} />
                        </button>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button onClick={() => toggleActive(p)}>
                          {p.isActive ? <ToggleRight size={22} className="text-success" /> : <ToggleLeft size={22} className="text-muted" />}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/products/${p._id}`} className="p-1.5 text-muted hover:text-accent transition-colors">
                            <Pencil size={14} />
                          </Link>
                          <button onClick={() => handleDelete(p)} className="p-1.5 text-muted hover:text-danger transition-colors">
                            <Trash2 size={14} />
                          </button>
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
                <p className="text-muted text-xs">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-xs border border-border text-muted hover:text-neutral hover:border-border-light disabled:opacity-40 transition-colors"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 text-xs border border-border text-muted hover:text-neutral hover:border-border-light disabled:opacity-40 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
