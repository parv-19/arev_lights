import Image from "next/image";
import Link from "next/link";
import SectionReveal from "@/components/shared/SectionReveal";
import { ArrowRight } from "lucide-react";

import { ICategory } from "@/types";

const DEFAULT_CATEGORIES = [
  { name: "Indoor Lighting", slug: "indoor-lighting", image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600&q=80", count: "120+ Products" },
  { name: "Outdoor Lighting", slug: "outdoor-lighting", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", count: "80+ Products" },
  { name: "Architectural", slug: "architectural", image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&q=80", count: "60+ Products" },
  { name: "Decorative", slug: "decorative", image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=600&q=80", count: "90+ Products" },
];

export default function FeaturedCategories({ categories: propCategories }: { categories?: ICategory[] }) {
  const cats = propCategories?.length ? propCategories : DEFAULT_CATEGORIES;
  return (
    <section className="section-padding bg-primary">
      <div className="container-custom">
        {/* Header */}
        <SectionReveal className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="gold-line" />
            <span className="section-label">Browse by Category</span>
            <div className="gold-line" />
          </div>
          <h2 className="heading-display">Our Product Range</h2>
          <p className="text-muted mt-4 max-w-xl mx-auto">
            Explore our curated collection of premium lighting solutions, designed and sourced for every application and aesthetic.
          </p>
        </SectionReveal>

        {/* Category Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cats.map((cat, i) => (
            <SectionReveal key={cat.slug} delay={i * 0.1}>
              <Link
                href={`/products?category=${cat.slug}`}
                className="group relative block overflow-hidden rounded-sm aspect-[3/4]"
              >
                <Image
                  src={(cat as any).image?.url || (cat as any).image || "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600&q=80"}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="font-label text-[10px] uppercase tracking-widest text-accent mb-1">{(cat as any).count || ''}</p>
                  <h3 className="font-display text-xl text-neutral leading-tight group-hover:text-accent transition-colors duration-200">
                    {cat.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-accent font-label text-xs uppercase tracking-wider">Explore</span>
                    <ArrowRight size={12} className="text-accent" />
                  </div>
                </div>

                {/* Gold border on hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/30 transition-colors duration-300" />
              </Link>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal className="text-center mt-10">
          <Link href="/categories" className="btn-outline-gold">
            View All Categories <ArrowRight size={16} />
          </Link>
        </SectionReveal>
      </div>
    </section>
  );
}
