import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionReveal from "@/components/shared/SectionReveal";
import InquiryCTASection from "@/components/public/home/InquiryCTASection";
import { ICategory } from "@/types";

export const metadata: Metadata = {
  title: "Product Categories — AREV Lights",
  description: "Browse all AREV Lights product categories — indoor, outdoor, architectural, decorative, and more.",
};

async function getCategories(): Promise<ICategory[]> {
  try {
    const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/categories?activeOnly=true`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

const FALLBACK_CATEGORIES = [
  { _id: "1", name: "Indoor Lighting", slug: "indoor-lighting", image: { url: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600&q=80", publicId: "" }, description: "Ceiling lights, wall lights, panel lights and more for elegant interiors.", sortOrder: 0, isActive: true, createdAt: "", updatedAt: "" },
  { _id: "2", name: "Outdoor Lighting", slug: "outdoor-lighting", image: { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", publicId: "" }, description: "Weatherproof floodlights, garden lights, street lights and facade lighting.", sortOrder: 1, isActive: true, createdAt: "", updatedAt: "" },
  { _id: "3", name: "Architectural Lighting", slug: "architectural", image: { url: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&q=80", publicId: "" }, description: "Linear lighting, cove lighting, spotlights for premium architectural projects.", sortOrder: 2, isActive: true, createdAt: "", updatedAt: "" },
  { _id: "4", name: "Decorative Lighting", slug: "decorative", image: { url: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=600&q=80", publicId: "" }, description: "Chandeliers, pendants, and statement pieces for luxury interiors.", sortOrder: 3, isActive: true, createdAt: "", updatedAt: "" },
  { _id: "5", name: "Track Lighting", slug: "track-lighting", image: { url: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600&q=80", publicId: "" }, description: "Flexible modular track systems for retail, galleries, and commercial spaces.", sortOrder: 4, isActive: true, createdAt: "", updatedAt: "" },
  { _id: "6", name: "Smart Lighting", slug: "smart-lighting", image: { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", publicId: "" }, description: "Dimmable and color-tunable LED systems with smart control integration.", sortOrder: 5, isActive: true, createdAt: "", updatedAt: "" },
];

export default async function CategoriesPage() {
  const dbCategories = await getCategories();
  const categories = dbCategories.length > 0 ? dbCategories : FALLBACK_CATEGORIES as unknown as ICategory[];

  return (
    <>
      {/* Page Hero */}
      <section className="pt-20 pb-14 bg-surface border-b border-border">
        <div className="container-custom text-center">
          <SectionReveal>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="gold-line" />
              <span className="section-label">Product Range</span>
              <div className="gold-line" />
            </div>
            <h1 className="heading-display mb-4">Browse All Categories</h1>
            <p className="text-muted max-w-xl mx-auto">
              Explore our curated collection of premium lighting solutions, designed and certified for India&apos;s finest installations.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <SectionReveal key={cat._id} delay={i * 0.08}>
                <Link
                  href={`/products?category=${cat._id}`}
                  className="group relative block rounded-sm overflow-hidden border border-border hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={cat.image?.url || `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80`}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-xl text-neutral group-hover:text-accent transition-colors duration-200 leading-tight mb-2">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="text-neutral/60 text-sm leading-relaxed line-clamp-2 mb-3 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        {cat.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-accent font-label text-xs uppercase tracking-wider">
                      <span>View Products</span>
                      <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </div>

                  {/* Gold border reveal */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/20 transition-colors duration-300 pointer-events-none" />
                </Link>
              </SectionReveal>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted">No categories available yet.</p>
            </div>
          )}
        </div>
      </section>

      <InquiryCTASection />
    </>
  );
}
