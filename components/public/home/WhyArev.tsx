import SectionReveal from "@/components/shared/SectionReveal";
import { Lightbulb, ShieldCheck, Wrench, RefreshCcw, Globe, Award } from "lucide-react";

const REASONS = [
  {
    Icon: Globe,
    title: "Wide Range of Solutions",
    desc: "Indoor, outdoor, architectural, decorative, and landscape lighting — all from one trusted partner.",
  },
  {
    Icon: ShieldCheck,
    title: "3-Year Warranty",
    desc: "2-year company warranty plus 1-year AREV backup warranty on every product — zero hassle.",
  },
  {
    Icon: RefreshCcw,
    title: "Hassle-Free Replacement",
    desc: "No-questions-asked replacement policy. If there's an issue, we resolve it — simply and swiftly.",
  },
  {
    Icon: Lightbulb,
    title: "Curated Brand Portfolio",
    desc: "We represent well-known brands known for innovative design, consistent quality, and reliable performance.",
  },
  {
    Icon: Wrench,
    title: "End-to-End Support",
    desc: "From product selection to installation guidance — our team is with you at every step of your project.",
  },
  {
    Icon: Award,
    title: "Inspiring Designers",
    desc: "Trusted by architects, interior designers, and builders to inspire creative lighting solutions since 2025.",
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
                AREV Lights is more than a lighting supplier — we are your creative partner, representing a curated portfolio of well-known brands and specializing in customized lighting solutions that inspire designers and exceed client expectations.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 py-6 border-y border-border">
                {[
                  { value: "3 Yrs", label: "Warranty" },
                  { value: "7+", label: "Service Areas" },
                  { value: "Since 2025", label: "Established" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-2xl gradient-text font-semibold">{stat.value}</p>
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
