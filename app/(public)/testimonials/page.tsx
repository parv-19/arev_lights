import type { Metadata } from "next";
import Image from "next/image";
import SectionReveal from "@/components/shared/SectionReveal";
import { ITestimonial } from "@/types";
import { Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Client Testimonials — AREV Lights",
  description: "What our clients say about AREV Lights — trusted by architects, designers, and builders across India.",
};

const FALLBACK: ITestimonial[] = [
  { _id: "1", clientName: "Rajesh Mehta", designation: "Principal Architect", company: "Design House Mumbai", reviewText: "AREV Lights transformed our hotel lobby project completely. The quality and range of products is unmatched, and the team's guidance made specification so much easier.", rating: 5, isVisible: true, sortOrder: 0 },
  { _id: "2", clientName: "Priya Sharma", designation: "Interior Designer", company: "PS Interiors", reviewText: "I've been specifying AREV Lights products for over 5 years now. Their product quality, timely delivery, and after-sales support is consistently excellent.", rating: 5, isVisible: true, sortOrder: 1 },
  { _id: "3", clientName: "Vikram Patel", designation: "Director", company: "Patel Builders", reviewText: "For our luxury villa project, AREV delivered exactly what they promised — premium quality at competitive pricing with zero compromise.", rating: 5, isVisible: true, sortOrder: 2 },
  { _id: "4", clientName: "Ananya Krishnan", designation: "VP Projects", company: "Hyatt Hotels India", reviewText: "AREV has been our go-to lighting partner for hospitality projects. Their understanding of hotel lighting requirements is exceptional.", rating: 5, isVisible: true, sortOrder: 3 },
  { _id: "5", clientName: "Suresh Gupta", designation: "Electrician Contractor", company: "Gupta Electricals", reviewText: "As a contractor, I've trusted AREV products for reliability. No call-backs, no customer complaints — that's what I need on every project.", rating: 4, isVisible: true, sortOrder: 4 },
  { _id: "6", clientName: "Deepika Nair", designation: "Project Manager", company: "Office Spaces Co.", reviewText: "Their smart lighting solutions for our client's corporate office were delivered on time, within budget, and look absolutely stunning.", rating: 5, isVisible: true, sortOrder: 5 },
];

async function getTestimonials(): Promise<ITestimonial[]> {
  try {
    const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/testimonials?visible=true`, { next: { revalidate: 120 } });
    const data = await res.json();
    return data.success && data.data.length > 0 ? data.data : [];
  } catch { return []; }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} className={i < rating ? "text-accent fill-accent" : "text-border"} />
      ))}
    </div>
  );
}

export default async function TestimonialsPage() {
  const dbTestimonials = await getTestimonials();
  const testimonials = dbTestimonials.length > 0 ? dbTestimonials : FALLBACK;

  return (
    <>
      {/* Hero */}
      <section className="pt-20 pb-14 bg-surface border-b border-border">
        <div className="container-custom text-center">
          <SectionReveal>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="gold-line" />
              <span className="section-label">Client Stories</span>
              <div className="gold-line" />
            </div>
            <h1 className="heading-display mb-4">What Our Clients Say</h1>
            <p className="text-muted max-w-xl mx-auto">
              Trusted by over 500 architects, designers, builders, and hospitality groups across India. Here are their stories.
            </p>
          </SectionReveal>

          {/* Stats bar */}
          <SectionReveal delay={0.2}>
            <div className="flex items-center justify-center gap-8 mt-10">
              {[
                { value: "500+", label: "Happy Clients" },
                { value: "1000+", label: "Projects" },
                { value: "4.9★", label: "Average Rating" },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-2xl gradient-text font-semibold">{stat.value}</p>
                  <p className="text-muted text-xs font-label uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="section-padding bg-primary">
        <div className="container-custom">
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <SectionReveal key={t._id} delay={i * 0.07}>
                <div className={`group relative flex flex-col border border-border rounded-sm p-6 hover:border-accent/30 hover:bg-surface hover:shadow-card transition-all duration-300 ${i === 0 ? "lg:row-span-1" : ""}`}>
                  {/* Quote mark */}
                  <span className="font-display text-6xl text-accent/15 leading-none absolute top-3 right-5 pointer-events-none select-none">&ldquo;</span>

                  <StarRating rating={t.rating} />

                  <blockquote className="flex-1 text-muted text-sm leading-relaxed mt-4 mb-5 italic">
                    &ldquo;{t.reviewText}&rdquo;
                  </blockquote>

                  <div className="flex items-center gap-3 border-t border-border/50 pt-4">
                    {t.image?.url ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-border flex-shrink-0">
                        <Image src={t.image.url} alt={t.clientName} width={40} height={40} className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-accent text-sm font-semibold font-display">{t.clientName[0]}</span>
                      </div>
                    )}
                    <div>
                      <p className="text-neutral text-sm font-semibold">{t.clientName}</p>
                      {(t.designation || t.company) && (
                        <p className="text-muted text-xs">{[t.designation, t.company].filter(Boolean).join(" · ")}</p>
                      )}
                    </div>
                    <div className="ml-auto">
                      <div className="gold-line w-6" />
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
