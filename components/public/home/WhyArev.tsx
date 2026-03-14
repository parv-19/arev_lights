import SectionReveal from "@/components/shared/SectionReveal";
import { Lightbulb, ShieldCheck, Wrench, Clock, Globe, Award } from "lucide-react";

const REASONS = [
  {
    Icon: Lightbulb,
    title: "Premium Quality",
    desc: "Every product meets the highest quality standards with rigorous testing and certified materials.",
  },
  {
    Icon: ShieldCheck,
    title: "Trusted Brand",
    desc: "Trusted by 1000+ architects, designers, and contractors across India for over a decade.",
  },
  {
    Icon: Wrench,
    title: "Expert Support",
    desc: "Our technical team provides end-to-end support from product selection to installation.",
  },
  {
    Icon: Clock,
    title: "On-Time Delivery",
    desc: "Reliable supply chain ensures your orders are fulfilled on schedule, every time.",
  },
  {
    Icon: Globe,
    title: "Wide Product Range",
    desc: "From indoor elegance to outdoor durability — over 500+ SKUs across all lighting categories.",
  },
  {
    Icon: Award,
    title: "Certified Products",
    desc: "ISI, CE, and RoHS certified products meeting international safety and quality benchmarks.",
  },
];

export default function WhyArev() {
  return (
    <section className="section-padding bg-surface border-y border-border">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <div>
            <SectionReveal>
              <div className="flex items-center gap-3 mb-5">
                <div className="gold-line" />
                <span className="section-label">Why Choose Us</span>
              </div>
              <h2 className="heading-display mb-6">
                Why Leading Designers <br />
                <span className="gradient-text">Choose AREV Lights</span>
              </h2>
              <p className="text-muted leading-relaxed mb-8 max-w-lg">
                We are more than a lighting supplier. We are your creative partner — providing premium, certified products with the expertise and support to bring your vision to life.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 py-6 border-y border-border">
                {[
                  { value: "500+", label: "Products" },
                  { value: "1000+", label: "Projects" },
                  { value: "15+", label: "Years" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-3xl gradient-text font-semibold">{stat.value}</p>
                    <p className="text-muted text-xs font-label uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </div>

          {/* Right — Reasons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {REASONS.map((r, i) => (
              <SectionReveal key={r.title} delay={i * 0.08}>
                <div className="group flex gap-4 p-5 rounded-sm border border-border hover:border-accent/30 hover:bg-surface-2 transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 border border-accent/30 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all duration-300">
                    <r.Icon size={18} className="text-accent" />
                  </div>
                  <div>
                    <h4 className="text-neutral font-semibold text-sm mb-1.5">{r.title}</h4>
                    <p className="text-muted text-xs leading-relaxed">{r.desc}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
