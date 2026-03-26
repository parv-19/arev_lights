import type { Metadata } from "next";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionReveal from "@/components/shared/SectionReveal";
import InquiryCTASection from "@/components/public/home/InquiryCTASection";
import { ShieldCheck, RefreshCw, Layers, Star, PenTool, ThumbsUp } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — AREV Lights",
  description:
    "Discover AREV Lights – your trusted partner for premium architectural and decorative lighting solutions, offering curated brands and customized designs.",
};

const WHY_CHOOSE_US = [
  { Icon: Layers, title: "Wide Range", desc: "Extensive collection of indoor and outdoor lighting options tailored for every aesthetic." },
  { Icon: Star, title: "Quality & Service", desc: "Premium products backed by prompt, efficient, and reliable customer service." },
  { Icon: ShieldCheck, title: "3-Year Total Warranty", desc: "2 years standard company warranty plus 1 year exclusive AREV backup warranty." },
  { Icon: RefreshCw, title: "Hassle-Free Replacement", desc: "No-questions-asked replacement policy valid for the first 2 years of purchase." },
  { Icon: PenTool, title: "Customization", desc: "Strong customization skills in bespoke lighting solutions and decorative fans." },
  { Icon: ThumbsUp, title: "The 'Wow' Experience", desc: "User-friendly, globally acclaimed products designed to leave a lasting impression." },
];

const PORTFOLIO = [
  { title: "Application Areas", items: ["Residential Lighting", "Commercial Spaces", "Hotel & Hospitality", "Healthcare Hospitals", "Landscape & Outdoor"] },
  { title: "Core Lighting", items: ["Architectural Lighting", "Decorative Lighting", "Stretch Ceiling Lighting", "Furniture Lighting", "Power Track Systems"] },
  { title: "Premium Additions", items: ["Designer Decorative Fans", "Smart Touch Switches", "Automation Integration", "Custom Chandelier Design", "Bespoke Fixtures"] },
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
              <span className="section-label">Established 2025</span>
              <div className="gold-line" />
            </div>
            <h1 className="font-display text-4xl sm:text-display-lg lg:text-display-xl font-semibold text-neutral mb-6">
              A Curated Portfolio of<br />
              <span className="gradient-text">Premium Lighting</span>
            </h1>
            <p className="text-neutral/80 text-lg max-w-2xl mx-auto leading-relaxed">
              AREV Lights is your one-stop solution for diverse lighting needs, emphasizing quality, deep customization, and undeniably reliable service.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 sm:py-16 bg-surface border-y border-border">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "2025", label: "Year Established" },
              { value: "15+", label: "Signature Projects" },
              { value: "3 Yrs", label: "Total Warranty" },
              { value: "100%", label: "Customization" },
            ].map((stat, i) => (
               <div key={stat.label} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <p className="font-display text-3xl sm:text-4xl lg:text-5xl gradient-text font-semibold mb-2">{stat.value}</p>
                <p className="text-muted text-xs sm:text-sm font-label uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
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
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/60 to-transparent" />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 sm:w-40 h-32 sm:h-40 border border-accent/30 rounded-sm hidden sm:block" />
                <div className="absolute -top-4 -left-4 w-20 sm:w-24 h-20 sm:h-24 bg-accent/10 rounded-sm hidden sm:block" />
              </div>
            </SectionReveal>

            <SectionReveal direction="right">
              <div className="flex items-center gap-3 mb-5">
                <div className="gold-line" />
                <span className="section-label">Who We Are</span>
              </div>
              <h2 className="heading-display mb-6">
                Illuminating India&apos;s<br />Discerning Spaces
              </h2>
              <div className="space-y-4 text-muted leading-relaxed text-sm sm:text-base">
                <p>
                  AREV Lights represents an exclusive, highly curated portfolio of well-known lighting brands. Since our inception in 2025, we have quickly become the partner of choice for creating unforgettable spaces.
                </p>
                <p>
                  We are partnered with recognized and acclaimed brands globally, known for their uncompromising quality, innovative designs, and consistent long-term performance.
                </p>
                <p>
                  Our unique strength lies in our deep customization skills — whether adapting architectural lighting solutions for tricky layouts, or sourcing the perfect designer decorative fans that tie a room together. We provide a genuine &quot;wow&quot; experience.
                </p>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-surface border-y border-border">
        <div className="container-custom">
          <SectionReveal className="text-center mb-12 sm:mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="gold-line" />
              <span className="section-label">Why AREV</span>
              <div className="gold-line" />
            </div>
            <h2 className="heading-display">The AREV Advantage</h2>
            <p className="text-muted mt-4 max-w-2xl mx-auto text-sm sm:text-base">
              We stand apart through our commitment to unmatched post-purchase support and relentless focus on quality.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {WHY_CHOOSE_US.map((v, i) => (
              <SectionReveal key={v.title} delay={i * 0.08}>
                <div className="group h-full p-6 border border-border rounded-sm hover:border-accent/40 bg-primary/50 hover:bg-surface-2 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full border border-accent/20 flex items-center justify-center mb-5 group-hover:border-accent group-hover:bg-accent/10 group-hover:-translate-y-1 transition-all duration-300">
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

      {/* Portfolio & Brands */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <SectionReveal className="text-center mb-12 sm:mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="gold-line" />
              <span className="section-label">Our Scope</span>
              <div className="gold-line" />
            </div>
            <h2 className="heading-display">Product & Service Portfolio</h2>
          </SectionReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {PORTFOLIO.map((category, i) => (
              <SectionReveal key={category.title} delay={i * 0.1}>
                <div className="p-8 bg-surface border border-border rounded-sm h-full hover:shadow-gold transition-all">
                  <h3 className="font-display text-2xl text-accent mb-6">{category.title}</h3>
                  <ul className="space-y-3">
                    {category.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-muted">
                        <span className="text-accent text-xs mt-1.5 opacity-70">◆</span>
                        <span className="leading-snug text-sm sm:text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Associated Brands Highlight */}
      <section className="section-padding bg-surface border-t border-border">
        <div className="container-custom max-w-4xl text-center">
          <SectionReveal>
            <ShieldCheck size={48} className="text-accent mx-auto mb-6" />
            <h2 className="heading-display mb-6">Partnered with the Best</h2>
            <p className="text-muted text-lg leading-relaxed mb-6">
              AREV Lights is proudly partnered with recognized and acclaimed brands known for top-tier quality, highly innovative designs, and consistent performance across years of use.
            </p>
            <p className="text-accent font-semibold text-lg font-display italic">
              "We don't just supply lights; we deliver a 'wow' experience."
            </p>
          </SectionReveal>
        </div>
      </section>

      <InquiryCTASection />
    </>
  );
}
