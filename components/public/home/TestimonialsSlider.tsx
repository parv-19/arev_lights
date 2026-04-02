"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import Image from "next/image";
import SectionReveal from "@/components/shared/SectionReveal";

const TESTIMONIALS: any[] = [];

import { ITestimonial } from "@/types";

export default function TestimonialsSlider({ testimonials: propTestimonials }: { testimonials?: ITestimonial[] }) {
  const testimonials = propTestimonials?.length ? propTestimonials : TESTIMONIALS as unknown as ITestimonial[];
  const [current, setCurrent] = useState(0);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const t = testimonials[current];

  return (
    <section className="section-padding bg-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 rounded-full border border-accent" />
        <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full border border-accent" />
      </div>

      <div className="container-custom relative">
        <SectionReveal className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="gold-line" />
            <span className="section-label">Client Stories</span>
            <div className="gold-line" />
          </div>
          <h2 className="heading-display">What Our Clients Say</h2>
        </SectionReveal>

        {/* Testimonial Card */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Quote Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 border border-accent/30 flex items-center justify-center">
                  <Quote size={20} className="text-accent" />
                </div>
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} className="text-accent fill-accent" />
                ))}
              </div>

              {/* Review */}
              <p className="font-display text-xl lg:text-2xl text-neutral/90 leading-relaxed italic mb-8">
                &ldquo;{t.reviewText}&rdquo;
              </p>

              {/* Client Info */}
              <div>
                <p className="text-neutral font-semibold text-sm">{t.clientName}</p>
                <p className="text-muted text-xs mt-1 font-label tracking-wide">
                  {t.designation} — {t.company}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={() => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)}
              className="w-10 h-10 border border-border flex items-center justify-center text-muted hover:border-accent hover:text-accent transition-all duration-200"
              aria-label="Previous"
            >
              <ChevronLeft size={17} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${i === current ? "w-6 h-1.5 bg-accent" : "w-1.5 h-1.5 bg-border-light hover:bg-muted"}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrent((c) => (c + 1) % testimonials.length)}
              className="w-10 h-10 border border-border flex items-center justify-center text-muted hover:border-accent hover:text-accent transition-all duration-200"
              aria-label="Next"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
