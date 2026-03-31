"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { getSafeHref } from "@/lib/safe-url";

interface HeroBanner {
  _id?: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

const DEFAULT_BANNERS: HeroBanner[] = [
  {
    title: "Illuminate Your World",
    subtitle: "Premium architectural and decorative lighting solutions crafted for those who demand excellence.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=85",
    ctaLabel: "Explore Products",
    ctaHref: "/products",
    secondaryCtaLabel: "Download Brochure",
    secondaryCtaHref: "/brochures",
  },
  {
    title: "Light That Speaks",
    subtitle: "Where design meets illumination. Transform every space into a signature experience.",
    imageUrl: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=1920&q=85",
    ctaLabel: "View Projects",
    ctaHref: "/projects",
    secondaryCtaLabel: "Contact Us",
    secondaryCtaHref: "/contact",
  },
  {
    title: "Crafted for Excellence",
    subtitle: "Every fixture tells a story of precision engineering and timeless design.",
    imageUrl: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=1920&q=85",
    ctaLabel: "Our Categories",
    ctaHref: "/categories",
    secondaryCtaLabel: "Dealer Inquiry",
    secondaryCtaHref: "/dealer-inquiry",
  },
];

export default function HeroCarousel({ banners: propBanners }: { banners?: HeroBanner[] }) {
  const banners = propBanners?.length ? propBanners : DEFAULT_BANNERS;
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  const banner = banners[current];
  const primaryHref = getSafeHref(banner.ctaHref, "/products");
  const secondaryHref = getSafeHref(banner.secondaryCtaHref, "/contact");

  return (
    <div
      className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden bg-primary"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image - Optimized for LCP */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: current === 0 ? 1 : 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={banner.imageUrl}
            alt={banner.title}
            fill
            priority={current === 0}
            fetchPriority={current === 0 ? "high" : "auto"}
            className="object-cover"
            sizes="100vw"
            quality={current === 0 ? 90 : 80}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container-custom">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="max-w-2xl"
            >
              {/* Label */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="gold-line" />
                <span className="section-label">AREV Lights</span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-display text-display-lg lg:text-display-xl font-semibold text-neutral leading-tight mb-6"
              >
                {banner.title}
              </motion.h1>

              {/* Subtitle */}
              {banner.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.6 }}
                  className="text-neutral/65 text-lg leading-relaxed mb-10 max-w-lg"
                >
                  {banner.subtitle}
                </motion.p>
              )}

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                {banner.ctaHref && (
                  <Link href={primaryHref} className="btn-gold">
                    {banner.ctaLabel || "Explore"} <ArrowRight size={16} />
                  </Link>
                )}
                {banner.secondaryCtaHref && (
                  <Link href={secondaryHref} className="btn-outline-gold">
                    {banner.secondaryCtaLabel}
                  </Link>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 border border-neutral/20 bg-primary/40 backdrop-blur-sm text-neutral hover:border-accent hover:text-accent transition-all duration-200 flex items-center justify-center z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 border border-neutral/20 bg-primary/40 backdrop-blur-sm text-neutral hover:border-accent hover:text-accent transition-all duration-200 flex items-center justify-center z-10"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === current ? "w-8 h-1.5 bg-accent" : "w-1.5 h-1.5 bg-neutral/30 hover:bg-neutral/60"
            }`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 right-6 flex items-center gap-2 z-10">
        <span className="text-accent font-label text-sm font-bold">{String(current + 1).padStart(2, "0")}</span>
        <div className="w-12 h-px bg-neutral/20">
          <motion.div
            className="h-full bg-accent"
            key={current}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5.5, ease: "linear" }}
          />
        </div>
        <span className="text-muted font-label text-sm">{String(banners.length).padStart(2, "0")}</span>
      </div>
    </div>
  );
}
