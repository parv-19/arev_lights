"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Tag, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import SectionReveal from "@/components/shared/SectionReveal";
import { IProject } from "@/types";
import type { Metadata } from "next";

const FALLBACK_PROJECTS: IProject[] = [
  { _id: "1", title: "5-Star Hotel Lobby", description: "Complete lobby lighting transformation with warm ambient layers and accent fixtures.", location: "Mumbai", images: [{ url: "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=800&q=80", publicId: "" }], tags: ["Hospitality", "Luxury"], isFeatured: true, isActive: true, createdAt: "" },
  { _id: "2", title: "Corporate HQ Atrium", description: "Energy-efficient LED transformation of a 10-storey corporate atrium.", location: "Pune", images: [{ url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80", publicId: "" }], tags: ["Corporate", "LED"], isFeatured: false, isActive: true, createdAt: "" },
  { _id: "3", title: "Luxury Villa Exterior", description: "Architectural facade lighting with IP65-rated outdoor fixtures.", location: "Goa", images: [{ url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", publicId: "" }], tags: ["Residential", "Outdoor"], isFeatured: true, isActive: true, createdAt: "" },
  { _id: "4", title: "Retail Flagship Store", description: "Premium track and display lighting for a luxury retail experience.", location: "Delhi", images: [{ url: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80", publicId: "" }], tags: ["Retail"], isFeatured: false, isActive: true, createdAt: "" },
  { _id: "5", title: "Heritage Banquet Hall", description: "Warm decorative lighting blending tradition with modern efficiency.", location: "Jaipur", images: [{ url: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80", publicId: "" }], tags: ["Hospitality", "Decorative"], isFeatured: false, isActive: true, createdAt: "" },
  { _id: "6", title: "Smart Office Complex", description: "Human-centric tunable white LED system with DALI controls.", location: "Bangalore", images: [{ url: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80", publicId: "" }], tags: ["Corporate", "Smart"], isFeatured: false, isActive: true, createdAt: "" },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [filtered, setFiltered] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("All");
  const [modal, setModal] = useState<{ project: IProject; imgIdx: number } | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then(r => r.json())
      .then(data => {
        const list = data.success && data.data.length > 0 ? data.data : FALLBACK_PROJECTS;
        setProjects(list);
        setFiltered(list);
        setLoading(false);
      })
      .catch(() => { setProjects(FALLBACK_PROJECTS); setFiltered(FALLBACK_PROJECTS); setLoading(false); });
  }, []);

  const allTags = ["All", ...Array.from(new Set(projects.flatMap(p => p.tags)))];

  const filterByTag = (tag: string) => {
    setActiveTag(tag);
    setFiltered(tag === "All" ? projects : projects.filter(p => p.tags.includes(tag)));
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-20 pb-14 bg-surface border-b border-border">
        <div className="container-custom text-center">
          <SectionReveal>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="gold-line" />
              <span className="section-label">Our Work</span>
              <div className="gold-line" />
            </div>
            <h1 className="heading-display mb-4">Project Gallery</h1>
            <p className="text-muted max-w-xl mx-auto">
              Over 1,000 completed installations across India — from luxury hospitality to cutting-edge commercial spaces.
            </p>
          </SectionReveal>
        </div>
      </section>

      <section className="section-padding bg-primary">
        <div className="container-custom">
          {/* Tag Filters */}
          {allTags.length > 1 && (
            <SectionReveal>
              <div className="flex flex-wrap gap-2 mb-10">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => filterByTag(tag)}
                    className={`px-4 py-2 text-xs font-label uppercase tracking-wider border transition-all duration-200 ${
                      activeTag === tag
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border text-muted hover:border-border-light hover:text-neutral"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </SectionReveal>
          )}

          {/* Masonry-style Grid */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`bg-surface border border-border rounded-sm animate-pulse ${i === 0 ? "row-span-2" : ""}`} style={{ height: i === 0 ? "480px" : "240px" }} />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTag}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
              >
                {filtered.map((project, i) => (
                  <SectionReveal key={project._id} delay={i * 0.06} className="break-inside-avoid mb-4">
                    <div
                      className="group relative overflow-hidden rounded-sm cursor-pointer border border-border hover:border-accent/30 transition-all duration-300"
                      onClick={() => setModal({ project, imgIdx: 0 })}
                    >
                      <div className={`relative overflow-hidden ${i % 3 === 0 ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                        <Image
                          src={project.images[0]?.url || ""}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />

                        {/* Overlay on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-12 h-12 border border-accent/50 flex items-center justify-center bg-primary/60 backdrop-blur-sm">
                            <Maximize2 size={18} className="text-accent" />
                          </div>
                        </div>
                      </div>

                      {/* Caption */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center gap-1.5 mb-1">
                          <MapPin size={11} className="text-accent" />
                          <span className="text-accent font-label text-[10px] uppercase tracking-wider">{project.location}</span>
                        </div>
                        <h3 className="font-display text-base text-neutral group-hover:text-accent transition-colors duration-200">
                          {project.title}
                        </h3>
                        {project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.tags.slice(0, 2).map(t => (
                              <span key={t} className="text-[9px] font-label text-muted border border-border/50 px-1.5 py-0.5 uppercase">{t}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      {project.isFeatured && (
                        <div className="absolute top-3 right-3 bg-accent text-primary text-[9px] font-label font-bold uppercase tracking-widest px-2 py-0.5">
                          Featured
                        </div>
                      )}
                    </div>
                  </SectionReveal>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setModal(null)}
          >
            <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col gap-4" onClick={e => e.stopPropagation()}>
              {/* Close */}
              <button onClick={() => setModal(null)} className="absolute -top-10 right-0 text-muted hover:text-accent transition-colors text-xl">✕</button>

              {/* Image */}
              <div className="relative flex-1 min-h-0 max-h-[65vh]">
                <Image
                  src={modal.project.images[modal.imgIdx]?.url || ""}
                  alt={modal.project.title}
                  width={1200}
                  height={800}
                  className="object-contain max-h-[65vh] mx-auto rounded-sm"
                />
                {/* Multi-image nav */}
                {modal.project.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setModal(m => m ? { ...m, imgIdx: (m.imgIdx - 1 + m.project.images.length) % m.project.images.length } : null); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary/80 border border-border flex items-center justify-center text-neutral hover:text-accent"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setModal(m => m ? { ...m, imgIdx: (m.imgIdx + 1) % m.project.images.length } : null); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary/80 border border-border flex items-center justify-center text-neutral hover:text-accent"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </div>

              {/* Meta */}
              <div className="bg-surface border border-border rounded-sm p-5">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={13} className="text-accent" />
                  <span className="text-accent font-label text-xs uppercase tracking-wide">{modal.project.location}</span>
                </div>
                <h2 className="font-display text-xl text-neutral mb-2">{modal.project.title}</h2>
                {modal.project.description && <p className="text-muted text-sm leading-relaxed">{modal.project.description}</p>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
