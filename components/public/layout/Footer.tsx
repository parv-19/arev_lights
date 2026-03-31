import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Linkedin, Youtube, Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { getSafeEmailHref, getSafeExternalHref, getSafeTelHref } from "@/lib/safe-url";
import { ISiteSettings } from "@/types";

const footerLinks = {
  Explore: [
    { label: "Blog", href: "/blog" },
    { label: "Brochures", href: "/brochures" },
    { label: "Brands", href: "/brands" },
    { label: "Project Glimpses", href: "/glimpses" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Projects & Gallery", href: "/projects" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Contact Us", href: "/contact" },
  ],
  Business: [
    { label: "Dealer Inquiry", href: "/dealer-inquiry" },
    { label: "Request Brochure", href: "/brochures" },
    { label: "Get a Quote", href: "/contact" },
  ],
};

export default function Footer({ settings }: { settings?: ISiteSettings | null }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border">
      {/* Inquiry CTA Bar */}
      <div className="bg-accent">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="font-display text-lg sm:text-xl text-primary font-semibold">
            Ready to illuminate your space?
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-accent px-5 py-2.5 font-label text-xs uppercase tracking-widest font-semibold hover:bg-surface transition-colors duration-200 min-h-[44px]"
            >
              Get Quote <ArrowUpRight size={14} />
            </Link>
            <Link
              href="/brochures"
              className="inline-flex items-center gap-2 border border-primary/30 text-primary px-5 py-2.5 font-label text-xs uppercase tracking-widest font-semibold hover:border-primary transition-colors duration-200 min-h-[44px]"
            >
              Brochures
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
              <Image src="/logo.png" alt="AREV Logo" width={36} height={36} className="w-9 h-9 rounded-full object-cover" />
              <div className="flex flex-col leading-none">
                <span className="font-display text-2xl sm:text-3xl font-semibold text-neutral">AREV</span>
                <span className="font-label text-[10px] uppercase tracking-[0.4em] text-accent font-medium mt-0.5">Lights</span>
              </div>
            </Link>
            <p className="text-muted text-sm leading-relaxed mb-5 max-w-xs">
              Inspiring creativity for designers — your trusted partner for curated, premium lighting solutions since 2025.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { Icon: Instagram, href: settings?.socialLinks?.instagram || "#", label: "Instagram" },
                { Icon: Facebook, href: settings?.socialLinks?.facebook || "#", label: "Facebook" },
                { Icon: Linkedin, href: settings?.socialLinks?.linkedin || "#", label: "LinkedIn" },
                { Icon: Youtube, href: settings?.socialLinks?.youtube || "#", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={getSafeExternalHref(href)}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center border border-border rounded-sm text-muted hover:text-accent hover:border-accent transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="section-label mb-4">{heading}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted text-sm hover:text-accent transition-colors duration-200 flex items-center gap-1 group min-h-[36px]"
                    >
                      <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 text-accent text-xs">→</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info Strip */}
        <div className="mt-10 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-accent mt-0.5 flex-shrink-0" />
            <p className="text-muted text-sm whitespace-pre-line">{settings?.address || "AREV Lights, India"}</p>
          </div>
          <div className="flex flex-col gap-2">
            <a href={getSafeTelHref("+919274776616")} className="flex items-center gap-2 text-muted text-sm hover:text-accent transition-colors min-h-[36px]">
              <Phone size={14} className="text-accent flex-shrink-0" /> +91 92747 76616
            </a>
            <a href={getSafeTelHref("+919824076616")} className="flex items-center gap-2 text-muted text-sm hover:text-accent transition-colors min-h-[36px]">
              <Phone size={14} className="text-muted flex-shrink-0" /> +91 98240 76616
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-accent flex-shrink-0" />
            <a href={getSafeEmailHref(settings?.emails?.[0])} className="text-muted text-sm hover:text-accent transition-colors break-all">
              {settings?.emails?.[0] || "arev.lights@gmail.com"}
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-border">
        <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-muted text-xs">© {year} AREV Lights. All rights reserved.</p>
          <p className="text-muted/50 text-xs">Premium Lighting Solutions · arevlights.com</p>
        </div>
      </div>
    </footer>
  );
}
