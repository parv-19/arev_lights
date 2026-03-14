import Link from "next/link";
import { Instagram, Facebook, Linkedin, Youtube, Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";

const footerLinks = {
  Products: [
    { label: "All Products", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "Brochures", href: "/brochures" },
    { label: "Brands", href: "/brands" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Projects & Gallery", href: "/projects" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Contact Us", href: "/contact" },
  ],
  Business: [
    { label: "Dealer Inquiry", href: "/dealer-inquiry" },
    { label: "Download Brochures", href: "/brochures" },
    { label: "Get a Quote", href: "/contact" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border">
      {/* Inquiry CTA Bar */}
      <div className="bg-accent">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-display text-xl text-primary font-semibold">
            Ready to illuminate your space?
          </p>
          <div className="flex gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-accent px-6 py-2.5 font-label text-xs uppercase tracking-widest font-semibold hover:bg-surface transition-colors duration-200"
            >
              Get Quote <ArrowUpRight size={14} />
            </Link>
            <Link
              href="/brochures"
              className="inline-flex items-center gap-2 border border-primary/30 text-primary px-6 py-2.5 font-label text-xs uppercase tracking-widest font-semibold hover:border-primary transition-colors duration-200"
            >
              Brochures
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex flex-col mb-6">
              <span className="font-display text-3xl font-semibold text-neutral">AREV</span>
              <span className="font-label text-[10px] uppercase tracking-[0.4em] text-accent font-medium -mt-1">
                Lights
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed mb-6 max-w-xs">
              Illuminating Spaces, Inspiring Lives. Your trusted partner for premium architectural and decorative lighting solutions.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Instagram, href: "#", label: "Instagram" },
                { Icon: Facebook, href: "#", label: "Facebook" },
                { Icon: Linkedin, href: "#", label: "LinkedIn" },
                { Icon: Youtube, href: "#", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center border border-border rounded-sm text-muted hover:text-accent hover:border-accent transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="section-label mb-5">{heading}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted text-sm hover:text-accent transition-colors duration-200 flex items-center gap-1 group"
                    >
                      <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 text-accent text-xs">
                        →
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info Strip */}
        <div className="mt-12 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-accent mt-0.5 flex-shrink-0" />
            <p className="text-muted text-sm">AREV Lights, India</p>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={16} className="text-accent flex-shrink-0" />
            <a href="tel:+911234567890" className="text-muted text-sm hover:text-accent transition-colors">
              +91 12345 67890
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-accent flex-shrink-0" />
            <a href="mailto:info@arevlights.com" className="text-muted text-sm hover:text-accent transition-colors">
              info@arevlights.com
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-border">
        <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-muted text-xs">
            © {year} AREV Lights. All rights reserved.
          </p>
          <p className="text-muted/50 text-xs">
            Premium Lighting Solutions
          </p>
        </div>
      </div>
    </footer>
  );
}
