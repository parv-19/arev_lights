"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

const BRANDS = [
  { name: "Philips", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&q=80" },
  { name: "Havells", logo: "https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=200&q=80" },
  { name: "Osram", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&q=80" },
  { name: "Syska", logo: "https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=200&q=80" },
  { name: "Wipro", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&q=80" },
  { name: "Anchor", logo: "https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=200&q=80" },
];

// Duplicate for seamless loop
const BRANDS_DOUBLED = [...BRANDS, ...BRANDS];

export default function BrandLogosSlider() {
  return (
    <section className="py-14 bg-surface border-y border-border overflow-hidden">
      <div className="container-custom mb-8">
        <div className="flex items-center justify-center gap-3">
          <div className="gold-line" />
          <span className="section-label">Our Premium Brands</span>
          <div className="gold-line" />
        </div>
      </div>

      {/* Marquee */}
      <div className="relative">
        <div
          className="flex gap-12 animate-marquee"
          style={{ width: `${BRANDS_DOUBLED.length * 200}px` }}
        >
          {BRANDS_DOUBLED.map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex-none w-40 h-16 flex items-center justify-center border border-border/50 bg-primary/50 px-6 hover:border-accent/50 transition-colors duration-200 group"
            >
              <p className="font-label text-sm uppercase tracking-widest text-muted group-hover:text-accent transition-colors duration-200 whitespace-nowrap">
                {brand.name}
              </p>
            </div>
          ))}
        </div>

        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-surface to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-surface to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
}
