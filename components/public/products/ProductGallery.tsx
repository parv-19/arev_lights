"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductImage } from "@/types";

interface Props {
  images: ProductImage[];
  title: string;
}

export default function ProductGallery({ images, title }: Props) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeImages = images?.length > 0
    ? images
    : [{ url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", publicId: "", isPrimary: true }];

  const img = activeImages[current];

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div
          className="relative aspect-square rounded-sm overflow-hidden border border-border bg-surface group cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              <Image
                src={img.url}
                alt={`${title} — image ${current + 1}`}
                fill
                className="object-contain p-4"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Zoom hint */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 bg-primary/70 flex items-center justify-center backdrop-blur-sm">
            <ZoomIn size={14} className="text-accent" />
          </div>

          {/* Prev/Next arrows */}
          {activeImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setCurrent(c => (c - 1 + activeImages.length) % activeImages.length); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary/70 backdrop-blur-sm flex items-center justify-center text-neutral hover:text-accent opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setCurrent(c => (c + 1) % activeImages.length); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary/70 backdrop-blur-sm flex items-center justify-center text-neutral hover:text-accent opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {activeImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {activeImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`relative flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all duration-200 ${
                  i === current ? "border-accent" : "border-border hover:border-border-light"
                }`}
              >
                <Image src={img.url} alt={`thumb ${i + 1}`} fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary/95 backdrop-blur-md flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button className="absolute top-6 right-6 text-neutral hover:text-accent" onClick={() => setLightboxOpen(false)}>
              ✕
            </button>
            <div
              className="relative max-w-4xl max-h-[85vh] w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activeImages[current].url}
                alt={title}
                width={1200}
                height={900}
                className="object-contain max-h-[85vh] mx-auto"
              />
            </div>
            {activeImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrent(c => (c - 1 + activeImages.length) % activeImages.length); }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 border border-border bg-surface flex items-center justify-center text-neutral hover:text-accent"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrent(c => (c + 1) % activeImages.length); }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 border border-border bg-surface flex items-center justify-center text-neutral hover:text-accent"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
