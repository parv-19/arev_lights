import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";

export default function InquiryCTASection() {
  return (
    <section className="relative py-28 overflow-hidden bg-surface border-t border-border">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #C9A84C 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Gold accent strip */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gold-gradient" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gold-gradient" />

      <div className="container-custom relative text-center">
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="gold-line" />
          <span className="section-label">Get in Touch</span>
          <div className="gold-line" />
        </div>

        <h2 className="font-display text-display-md lg:text-display-lg font-semibold text-neutral mb-6 max-w-2xl mx-auto">
          Have a Project in Mind? <br />
          <span className="gradient-text">Let&apos;s Illuminate It.</span>
        </h2>

        <p className="text-muted text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Whether you&apos;re an architect, designer, builder, or business owner — our team is ready to help you find the perfect lighting solution.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact" className="btn-gold text-base px-8 py-4">
            Send Inquiry <ArrowRight size={18} />
          </Link>
          <a
            href="tel:+911234567890"
            className="btn-outline-gold text-base px-8 py-4 flex items-center gap-2"
          >
            <PhoneCall size={17} />
            Call Us Now
          </a>
          <Link href="/dealer-inquiry" className="btn-ghost">
            Become a Dealer →
          </Link>
        </div>
      </div>
    </section>
  );
}
