import type { Metadata } from "next";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionReveal from "@/components/shared/SectionReveal";
import InquiryCTASection from "@/components/public/home/InquiryCTASection";
import { Users, Award, Globe, Lightbulb, ShieldCheck, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — AREV Lights",
  description:
    "Learn about AREV Lights — our story, mission, values, and why we are India's trusted name in premium architectural and decorative lighting.",
};

const TIMELINE = [
  { year: "2010", title: "Founded", desc: "AREV Lights was established with a vision to bring premium international lighting solutions to India." },
  { year: "2013", title: "First 100 Projects", desc: "Crossed 100 completed installations across commercial and residential spaces." },
  { year: "2016", title: "Brand Expansion", desc: "Partnered with 10+ global lighting brands, significantly expanding our product portfolio." },
  { year: "2019", title: "Pan-India Presence", desc: "Established a network of dealers and distributors across 15+ cities in India." },
  { year: "2022", title: "1000+ Projects", desc: "Completed over 1,000 projects for architects, builders, and interior designers." },
  { year: "2025", title: "Digital Platform", desc: "Launched our CMS-driven website and online dealer portal for modern trade." },
];

const VALUES = [
  { Icon: Lightbulb, title: "Innovation", desc: "We continuously source the latest in LED and smart lighting technology for our clients." },
  { Icon: ShieldCheck, title: "Quality Assurance", desc: "Every product undergoes rigorous quality checks before reaching your space." },
  { Icon: Users, title: "Customer First", desc: "We build long-term relationships built on trust, service, and excellence." },
  { Icon: Globe, title: "Global Standards", desc: "ISI, CE, and RoHS-certified products meeting international benchmarks." },
  { Icon: Award, title: "Proven Excellence", desc: "1000+ projects across hospitality, commercial, and residential sectors." },
  { Icon: Clock, title: "Reliable Delivery", desc: "On-time supply chain management ensuring your project stays on schedule." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1920&q=80"
            alt="AREV Lights Story"
            fill
            className="object-cover opacity-30"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary" />
        </div>
        <div className="relative container-custom text-center py-24">
          <SectionReveal>
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="gold-line" />
              <span className="section-label">Our Story</span>
              <div className="gold-line" />
            </div>
            <h1 className="font-display text-display-lg lg:text-display-xl font-semibold text-neutral mb-6">
              Illuminating India&apos;s<br />
              <span className="gradient-text">Finest Spaces</span>
            </h1>
            <p className="text-neutral/60 text-lg max-w-2xl mx-auto leading-relaxed">
              For over 15 years, AREV Lights has been the trusted partner for architects, designers, and builders who believe that great lighting transforms spaces.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "15+", label: "Years of Excellence" },
              { value: "1000+", label: "Projects Completed" },
              { value: "500+", label: "Products in Range" },
              { value: "50+", label: "Brand Partners" },
            ].map((stat, i) => (
              <SectionReveal key={stat.label} delay={i * 0.1}>
                <p className="font-display text-4xl lg:text-5xl gradient-text font-semibold mb-2">{stat.value}</p>
                <p className="text-muted text-sm font-label uppercase tracking-wide">{stat.label}</p>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <SectionReveal direction="left">
              <div className="relative">
                <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80"
                    alt="AREV Lights showroom"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-40 h-40 border border-accent/30 rounded-sm hidden lg:block" />
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/10 rounded-sm hidden lg:block" />
              </div>
            </SectionReveal>

            <SectionReveal direction="right">
              <div className="flex items-center gap-3 mb-5">
                <div className="gold-line" />
                <span className="section-label">Who We Are</span>
              </div>
              <h2 className="heading-display mb-6">
                A Legacy Built on<br />Light and Trust
              </h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  Founded in 2010, AREV Lights began with a simple yet powerful mission: to bring the world&rsquo;s finest lighting solutions to India&rsquo;s most discerning spaces. What started as a boutique lighting consultancy has grown into one of India&rsquo;s most trusted names in premium architectural and decorative lighting.
                </p>
                <p>
                  We work closely with architects, interior designers, builders, and hospitality groups to deliver lighting that doesn&rsquo;t just illuminate — it transforms. Our carefully curated portfolio spans over 500 products across indoor, outdoor, architectural, and decorative categories.
                </p>
                <p>
                  Today, with a presence across 15+ cities, a dealer network spanning the country, and 1,000+ projects to our name, AREV Lights continues to be the go-to partner for those who demand excellence.
                </p>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="section-padding bg-surface border-y border-border">
        <div className="container-custom">
          <SectionReveal className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="gold-line" />
              <span className="section-label">Mission & Vision</span>
              <div className="gold-line" />
            </div>
            <h2 className="heading-display">What Drives Us Forward</h2>
          </SectionReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                label: "Our Mission",
                title: "To Illuminate Every Space with Purpose",
                desc: "We are committed to sourcing and supplying premium, certified lighting solutions that combine beauty, performance, and sustainability. Our mission is to make world-class lighting accessible to every project in India.",
                gradient: "from-accent/20 to-transparent",
              },
              {
                label: "Our Vision",
                title: "India's Most Trusted Lighting Partner",
                desc: "We envision a future where every architect, designer, and builder chooses AREV Lights as their first and only lighting partner — because of our unmatched range, service, and commitment to excellence.",
                gradient: "from-info/10 to-transparent",
              },
            ].map((item, i) => (
              <SectionReveal key={item.label} delay={i * 0.15}>
                <div className={`relative p-8 border border-border rounded-sm bg-gradient-to-br ${item.gradient} overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <span className="section-label block mb-4">{item.label}</span>
                  <h3 className="font-display text-2xl text-neutral mb-4 leading-snug">{item.title}</h3>
                  <p className="text-muted leading-relaxed">{item.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <SectionReveal className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="gold-line" />
              <span className="section-label">Our Values</span>
              <div className="gold-line" />
            </div>
            <h2 className="heading-display">The Principles We Live By</h2>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <SectionReveal key={v.title} delay={i * 0.08}>
                <div className="group p-6 border border-border rounded-sm hover:border-accent/30 hover:bg-surface transition-all duration-300">
                  <div className="w-12 h-12 border border-accent/30 flex items-center justify-center mb-5 group-hover:border-accent group-hover:bg-accent/10 transition-all duration-300">
                    <v.Icon size={20} className="text-accent" />
                  </div>
                  <h4 className="text-neutral font-semibold mb-2">{v.title}</h4>
                  <p className="text-muted text-sm leading-relaxed">{v.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-surface border-y border-border">
        <div className="container-custom">
          <SectionReveal className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="gold-line" />
              <span className="section-label">Our Journey</span>
              <div className="gold-line" />
            </div>
            <h2 className="heading-display">15 Years of Growth</h2>
          </SectionReveal>

          <div className="relative">
            {/* Center line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

            <div className="space-y-8 lg:space-y-0">
              {TIMELINE.map((item, i) => (
                <SectionReveal key={item.year} delay={i * 0.1}>
                  <div className={`lg:flex items-center gap-8 lg:gap-16 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                    <div className={`flex-1 ${i % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                      <div className="lg:max-w-sm ml-auto">
                        <span className="text-accent font-display text-3xl font-bold">{item.year}</span>
                        <h4 className="text-neutral font-semibold text-lg mt-1 mb-2">{item.title}</h4>
                        <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>

                    {/* Center dot */}
                    <div className="hidden lg:flex flex-shrink-0 w-10 h-10 rounded-full border-2 border-accent bg-primary items-center justify-center z-10">
                      <div className="w-3 h-3 rounded-full bg-accent" />
                    </div>

                    <div className="flex-1 hidden lg:block" />
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <InquiryCTASection />
    </>
  );
}
