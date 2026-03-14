"use client";
import { useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import SectionReveal from "@/components/shared/SectionReveal";

const DUMMY_PRODUCTS = [
  { _id: "1", title: "Aurora LED Panel", slug: "aurora-led-panel", shortDesc: "Ultra-slim, high-efficiency LED panel for commercial and residential ceilings.", images: [{ url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80", publicId: "", isPrimary: true }], category: { _id: "1", name: "Indoor Lighting", slug: "indoor-lighting", image: { url: "", publicId: "" }, sortOrder: 0, isActive: true, createdAt: "", updatedAt: "" }, specs: [], tags: ["LED", "Panel", "Commercial"], isFeatured: true, isActive: true, brand: undefined, brochure: undefined, description: "", createdAt: "", updatedAt: "" },
  { _id: "2", title: "Luxor Pendant Series", slug: "luxor-pendant", shortDesc: "Handcrafted pendant lights for luxury interiors and statement spaces.", images: [{ url: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=500&q=80", publicId: "", isPrimary: true }], category: { _id: "2", name: "Decorative", slug: "decorative", image: { url: "", publicId: "" }, sortOrder: 0, isActive: true, createdAt: "", updatedAt: "" }, specs: [], tags: ["Pendant", "Luxury"], isFeatured: true, isActive: true, brand: undefined, brochure: undefined, description: "", createdAt: "", updatedAt: "" },
  { _id: "3", title: "Stellar Flood Light", slug: "stellar-flood", shortDesc: "High-lumen outdoor flood lights built for commercial facades and landscapes.", images: [{ url: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=500&q=80", publicId: "", isPrimary: true }], category: { _id: "3", name: "Outdoor Lighting", slug: "outdoor", image: { url: "", publicId: "" }, sortOrder: 0, isActive: true, createdAt: "", updatedAt: "" }, specs: [], tags: ["Outdoor", "Flood", "Commercial"], isFeatured: true, isActive: true, brand: undefined, brochure: undefined, description: "", createdAt: "", updatedAt: "" },
  { _id: "4", title: "Nova Track System", slug: "nova-track", shortDesc: "Modular track lighting for retail, galleries, and modern living spaces.", images: [{ url: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=500&q=80", publicId: "", isPrimary: true }], category: { _id: "4", name: "Architectural", slug: "architectural", image: { url: "", publicId: "" }, sortOrder: 0, isActive: true, createdAt: "", updatedAt: "" }, specs: [], tags: ["Track", "Retail"], isFeatured: false, isActive: true, brand: undefined, brochure: undefined, description: "", createdAt: "", updatedAt: "" },
];

import ProductCard from "@/components/public/products/ProductCard";
import type { IProduct } from "@/types";

export default function FeaturedProducts() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  return (
    <section className="section-padding bg-primary">
      <div className="container-custom">
        {/* Header */}
        <SectionReveal className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="gold-line" />
              <span className="section-label">Handpicked for You</span>
            </div>
            <h2 className="heading-display">Featured Products</h2>
          </div>
          <Link href="/products" className="btn-outline-gold whitespace-nowrap">
            All Products <ArrowRight size={15} />
          </Link>
        </SectionReveal>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-5">
              {DUMMY_PRODUCTS.map((p) => (
                <div key={p._id} className="flex-none w-72 sm:w-80 lg:w-[calc(25%-15px)]">
                  <ProductCard product={p as unknown as IProduct} />
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="w-10 h-10 border border-border flex items-center justify-center text-muted hover:border-accent hover:text-accent transition-all duration-200"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="w-10 h-10 border border-border flex items-center justify-center text-muted hover:border-accent hover:text-accent transition-all duration-200"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
