"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, X, ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react";
import SectionReveal from "@/components/shared/SectionReveal";
import { ProductCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { IProduct, ICategory, IBrand } from "@/types";
import { getPrimaryImage, truncate, cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "title_asc", label: "Name: A to Z" },
  { value: "title_desc", label: "Name: Z to A" },
  { value: "newest", label: "Newest First" },
];

const LIMIT = 12;

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(total / LIMIT);

  // Load filters
  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then(r => r.json()),
      fetch("/api/brands").then(r => r.json()),
    ]).then(([catData, brandData]) => {
      if (catData.success) setCategories(catData.data);
      if (brandData.success) setBrands(brandData.data);
    });
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT), isActive: "true" });
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (brand) params.set("brand", brand);
    if (sort) params.set("sort", sort);

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (data.success) { setProducts(data.data); setTotal(data.pagination?.total || 0); }
    } catch { setProducts([]); }
    setLoading(false);
  }, [page, search, category, brand, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const clearFilters = () => { setSearch(""); setCategory(""); setBrand(""); setSort(""); setPage(1); };
  const hasFilters = !!(search || category || brand || sort);

  return (
    <>
      {/* Hero */}
      <section className="pt-20 pb-14 bg-surface border-b border-border">
        <div className="container-custom">
          <SectionReveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="gold-line" />
              <span className="section-label">Our Products</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="heading-display">Product Catalogue</h1>
                <p className="text-muted mt-2">{total > 0 ? `${total} products found` : "Browse our full range"}</p>
              </div>
              <Link href="/brochures" className="btn-outline-gold text-sm py-2.5 whitespace-nowrap">
                Download Catalogue
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="section-padding bg-primary">
        <div className="container-custom">
          {/* Search + Filter Bar */}
          <div className="flex flex-wrap gap-3 mb-8">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                className="w-full bg-surface border border-border text-neutral placeholder-muted pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors rounded-sm"
                placeholder="Search products…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>

            {/* Category filter */}
            <select
              className="bg-surface border border-border text-neutral px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors rounded-sm min-w-[160px]"
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            >
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>

            {/* Brand filter */}
            {brands.length > 0 && (
              <select
                className="bg-surface border border-border text-neutral px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors rounded-sm min-w-[140px]"
                value={brand}
                onChange={(e) => { setBrand(e.target.value); setPage(1); }}
              >
                <option value="">All Brands</option>
                {brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            )}

            {/* Sort */}
            <select
              className="bg-surface border border-border text-neutral px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors rounded-sm min-w-[150px]"
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1.5 px-4 py-3 border border-danger/30 text-danger text-sm rounded-sm hover:bg-danger/10 transition-colors">
                <X size={14} /> Clear
              </button>
            )}
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 border border-border flex items-center justify-center">
                <Search size={24} className="text-muted" />
              </div>
              <p className="text-neutral font-semibold">No products found</p>
              <p className="text-muted text-sm">Try adjusting or clearing your filters</p>
              <button onClick={clearFilters} className="btn-outline-gold text-sm py-2.5 px-6">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((p, i) => (
                <SectionReveal key={p._id} delay={i * 0.04}>
                  <Link href={`/products/${p.slug}`} className="group block bg-surface border border-border rounded-sm hover:border-border-light hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={getPrimaryImage(p.images)}
                        alt={p.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {p.isFeatured && (
                        <div className="absolute top-3 left-3 bg-accent text-primary text-[10px] font-label font-bold uppercase tracking-widest px-2 py-1">
                          Featured
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="flex items-center gap-2 bg-primary/90 text-accent border border-accent/50 px-4 py-2 text-xs font-label uppercase tracking-wide">
                          View Details <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      {p.category && <span className="section-label text-[10px] block mb-1.5">{p.category.name}</span>}
                      <h3 className="font-display text-base text-neutral group-hover:text-accent transition-colors duration-200 leading-snug mb-2">
                        {p.title}
                      </h3>
                      {p.shortDesc && <p className="text-muted text-xs leading-relaxed">{truncate(p.shortDesc, 70)}</p>}
                      {p.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.tags.slice(0, 3).map(t => (
                            <span key={t} className="text-[10px] font-label text-muted border border-border/60 px-1.5 py-0.5 uppercase tracking-wide">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </Link>
                </SectionReveal>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 border border-border flex items-center justify-center text-muted hover:border-accent hover:text-accent disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                const pg = i + 1;
                return (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    className={cn(
                      "w-10 h-10 border text-sm font-label transition-all",
                      pg === page ? "border-accent bg-accent/10 text-accent" : "border-border text-muted hover:border-border-light hover:text-neutral"
                    )}
                  >
                    {pg}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 border border-border flex items-center justify-center text-muted hover:border-accent hover:text-accent disabled:opacity-30 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
