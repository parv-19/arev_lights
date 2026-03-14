"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Download, Eye, Search } from "lucide-react";
import SectionReveal from "@/components/shared/SectionReveal";
import { IBrochure, ICategory } from "@/types";

const FALLBACK: IBrochure[] = [
  { _id: "1", title: "Indoor Lighting Catalogue 2025", category: undefined, pdfUrl: "#", pdfPublicId: "", previewImage: { url: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&q=70", publicId: "" }, isVisible: true, sortOrder: 0, createdAt: "" },
  { _id: "2", title: "Outdoor & Architectural Brochure", category: undefined, pdfUrl: "#", pdfPublicId: "", previewImage: { url: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=400&q=70", publicId: "" }, isVisible: true, sortOrder: 1, createdAt: "" },
  { _id: "3", title: "Decorative Lighting Lookbook", category: undefined, pdfUrl: "#", pdfPublicId: "", previewImage: { url: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&q=70", publicId: "" }, isVisible: true, sortOrder: 2, createdAt: "" },
  { _id: "4", title: "Smart Lighting Solutions Guide", category: undefined, pdfUrl: "#", pdfPublicId: "", previewImage: { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70", publicId: "" }, isVisible: true, sortOrder: 3, createdAt: "" },
];

export default function BrochuresPage() {
  const [brochures, setBrochures] = useState<IBrochure[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/brochures").then(r => r.json()),
      fetch("/api/categories").then(r => r.json()),
    ]).then(([br, cat]) => {
      const list = br.success && br.data.length > 0 ? br.data : FALLBACK;
      setBrochures(list);
      if (cat.success) setCategories(cat.data);
      setLoading(false);
    }).catch(() => { setBrochures(FALLBACK); setLoading(false); });
  }, []);

  const filtered = brochures.filter(b => {
    const matchCat = activeCategory === "all" || (b.category as ICategory)?._id === activeCategory;
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      {/* Hero */}
      <section className="pt-20 pb-14 bg-surface border-b border-border">
        <div className="container-custom text-center">
          <SectionReveal>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="gold-line" />
              <span className="section-label">Downloads</span>
              <div className="gold-line" />
            </div>
            <h1 className="heading-display mb-4">Product Brochures</h1>
            <p className="text-muted max-w-lg mx-auto">
              Download our product catalogues and brochures. All documents are updated regularly with our latest offerings.
            </p>
          </SectionReveal>
        </div>
      </section>

      <section className="section-padding bg-primary">
        <div className="container-custom">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-10">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                className="w-full bg-surface border border-border text-neutral placeholder-muted pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors rounded-sm"
                placeholder="Search brochures…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2.5 text-xs font-label uppercase tracking-wider border transition-all ${activeCategory === "all" ? "border-accent bg-accent/10 text-accent" : "border-border text-muted hover:border-border-light hover:text-neutral"}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat._id)}
                className={`px-4 py-2.5 text-xs font-label uppercase tracking-wider border transition-all ${activeCategory === cat._id ? "border-accent bg-accent/10 text-accent" : "border-border text-muted hover:border-border-light hover:text-neutral"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="admin-card aspect-[3/4] animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted">No brochures found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((b, i) => (
                <SectionReveal key={b._id} delay={i * 0.07}>
                  <div className="group bg-surface border border-border rounded-sm overflow-hidden hover:border-border-light hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300">
                    {/* Preview */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-surface-2">
                      {b.previewImage?.url ? (
                        <Image
                          src={b.previewImage.url}
                          alt={b.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Download size={32} className="text-muted" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <a
                          href={b.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-primary/80 border border-accent/50 text-accent hover:bg-accent hover:text-primary transition-all"
                          title="Preview"
                        >
                          <Eye size={16} />
                        </a>
                        <a
                          href={b.pdfUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-accent text-primary hover:bg-accent-light transition-all"
                          title="Download"
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      {b.category && (
                        <span className="section-label text-[10px] block mb-1.5">{(b.category as ICategory).name}</span>
                      )}
                      <h3 className="font-display text-sm text-neutral leading-snug mb-3">{b.title}</h3>
                      <div className="flex gap-2">
                        <a
                          href={b.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-border text-muted text-xs font-label uppercase tracking-wide hover:border-accent hover:text-accent transition-all"
                        >
                          <Eye size={12} /> View
                        </a>
                        <a
                          href={b.pdfUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-accent text-primary text-xs font-label uppercase tracking-wide hover:bg-accent-light transition-all"
                        >
                          <Download size={12} /> Download
                        </a>
                      </div>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
