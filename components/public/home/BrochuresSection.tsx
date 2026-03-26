"use client";
import { useState } from "react";
import Image from "next/image";
import SectionReveal from "@/components/shared/SectionReveal";
import LeadCaptureModal from "@/components/shared/LeadCaptureModal";
import { FileText } from "lucide-react";
import Link from "next/link";
import { IBrochure } from "@/types";

// Real AREV Lights brochure categories from their product portfolio
const DUMMY_BROCHURES = [
  {
    _id: "1",
    title: "Residential Lighting Catalogue",
    categoryName: "Residential",
    previewUrl: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&q=80",
  },
  {
    _id: "2",
    title: "Commercial & Architectural Lighting",
    categoryName: "Commercial",
    previewUrl: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=400&q=80",
  },
  {
    _id: "3",
    title: "Hotel & Hospitality Lighting Guide",
    categoryName: "Hospitality",
    previewUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  },
];

export default function BrochuresSection({ brochures: propBrochures }: { brochures?: IBrochure[] }) {
  const brochures = propBrochures?.length ? propBrochures : DUMMY_BROCHURES as unknown as IBrochure[];
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <section className="section-padding bg-surface border-y border-border">
      <div className="container-custom">
        {/* Header */}
        <SectionReveal className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="gold-line" />
            <span className="section-label">Product Literature</span>
            <div className="gold-line" />
          </div>
          <h2 className="heading-display">Request Our Brochures</h2>
          <p className="text-muted mt-4 max-w-lg mx-auto">
            Get detailed catalogues for Residential, Commercial, Hospitality, and Landscape lighting — shared personally by our team on WhatsApp.
          </p>
        </SectionReveal>

        {/* Brochure Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brochures.map((b, i) => (
            <SectionReveal key={b._id} delay={i * 0.1}>
              <div className="group card-surface card-hover overflow-hidden">
                {/* Preview Thumbnail */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={(b as any).previewUrl || b.previewImage?.url || "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&q=80"}
                    alt={b.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/20 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-accent/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90 group-hover:scale-100">
                      <FileText size={20} className="text-primary" />
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-display text-lg text-neutral mb-4 leading-snug">{b.title}</h3>

                  <button
                    onClick={() => setActiveModal(b._id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-accent text-primary text-xs font-label font-semibold uppercase tracking-wide hover:bg-accent-light transition-colors duration-200"
                  >
                    <FileText size={13} /> Request Brochure
                  </button>
                </div>
              </div>

              {activeModal === b._id && (
                <LeadCaptureModal
                  brochureTitle={b.title}
                  onClose={() => setActiveModal(null)}
                />
              )}
            </SectionReveal>
          ))}
        </div>

        <SectionReveal className="text-center mt-10">
          <Link href="/brochures" className="btn-outline-gold">
            View All Brochures
          </Link>
        </SectionReveal>
      </div>
    </section>
  );
}
