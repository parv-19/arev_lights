"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSafeEmailHref, getSafeTelHref } from "@/lib/safe-url";
import { ISiteSettings } from "@/types";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Brochures", href: "/brochures" },
  // { label: "Projects", href: "/projects" }, // Commented out for now
  { label: "Brands", href: "/brands" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar({ settings }: { settings?: ISiteSettings | null }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Top bar */}
      <div className="hidden lg:block bg-surface border-b border-border">
        <div className="container-custom flex justify-between items-center py-2">
          <p className="text-muted text-xs font-label tracking-wider">
            Premium Lighting Solutions — Since 2025
          </p>
          <div className="flex items-center gap-6 text-xs text-muted">
            <a href={getSafeTelHref("+919274776616")} className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Phone size={11} />
              +91 92747 76616
            </a>
            <span className="text-border">|</span>
            <a href={getSafeTelHref("+919824076616")} className="flex items-center gap-1.5 hover:text-accent transition-colors">
              +91 98240 76616
            </a>
            <a href={getSafeEmailHref(settings?.emails?.[0])} className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Mail size={11} />
              {settings?.emails?.[0] || "arev.lights@gmail.com"}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <motion.header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-500",
          isScrolled
            ? "bg-primary/95 backdrop-blur-md border-b border-border shadow-card"
            : "bg-transparent"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image src="/logo.png" alt="AREV Logo" width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
              <div className="flex flex-col leading-none">
                <span className="font-display text-2xl font-semibold text-neutral tracking-tight group-hover:text-accent transition-colors duration-300">
                  AREV
                </span>
                <span className="font-label text-[10px] uppercase tracking-[0.4em] text-accent font-medium mt-0.5">
                  Lights
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 font-label text-sm uppercase tracking-wider transition-colors duration-200",
                    pathname === link.href ? "text-accent" : "text-neutral/75 hover:text-accent"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/dealer-inquiry" className="btn-outline-gold text-xs px-5 py-2.5">
                Dealer Inquiry
              </Link>
              <Link href="/contact" className="btn-gold text-xs px-5 py-2.5">
                Get Quote
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 text-neutral hover:text-accent transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden bg-surface border-t border-border"
            >
              <nav className="container-custom py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block px-4 py-3 font-label text-sm uppercase tracking-wider border-b border-border/50 transition-colors duration-200",
                      pathname === link.href ? "text-accent" : "text-neutral/75 hover:text-accent"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex gap-3 pt-4">
                  <Link href="/dealer-inquiry" className="btn-outline-gold flex-1 justify-center text-xs py-2.5">
                    Dealer Inquiry
                  </Link>
                  <Link href="/contact" className="btn-gold flex-1 justify-center text-xs py-2.5">
                    Get Quote
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
