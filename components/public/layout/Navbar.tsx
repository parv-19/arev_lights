"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Products",
    href: "/products",
    children: [
      { label: "All Products", href: "/products" },
      { label: "Categories", href: "/categories" },
      { label: "Brochures", href: "/brochures" },
    ],
  },
  { label: "Projects", href: "/projects" },
  { label: "Brands", href: "/brands" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className="hidden lg:block bg-surface border-b border-border">
        <div className="container-custom flex justify-between items-center py-2">
          <p className="text-muted text-xs font-label tracking-wider">
            Premium Lighting Solutions — Since 2010
          </p>
          <div className="flex items-center gap-6 text-xs text-muted">
            <a href="tel:+911234567890" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Phone size={11} />
              +91 12345 67890
            </a>
            <a href="mailto:info@arevlights.com" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Mail size={11} />
              info@arevlights.com
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
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex flex-col leading-none">
                <span className="font-display text-2xl font-semibold text-neutral tracking-tight group-hover:text-accent transition-colors duration-300">
                  AREV
                </span>
                <span className="font-label text-[10px] uppercase tracking-[0.4em] text-accent font-medium">
                  Lights
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label} className="relative">
                    <button
                      onClick={() =>
                        setActiveDropdown(activeDropdown === link.label ? null : link.label)
                      }
                      className={cn(
                        "flex items-center gap-1 px-4 py-2 font-label text-sm uppercase tracking-wider transition-colors duration-200",
                        pathname.startsWith(link.href) ? "text-accent" : "text-neutral/75 hover:text-accent"
                      )}
                    >
                      {link.label}
                      <ChevronDown
                        size={13}
                        className={cn(
                          "transition-transform duration-200",
                          activeDropdown === link.label ? "rotate-180 text-accent" : ""
                        )}
                      />
                    </button>

                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-52 bg-surface border border-border shadow-card rounded-sm overflow-hidden"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-5 py-3 text-sm text-neutral/75 hover:text-accent hover:bg-surface-2 border-b border-border/50 last:border-0 transition-colors duration-150 font-label tracking-wide"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
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
                )
              )}
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
                  <div key={link.label}>
                    <Link
                      href={link.href}
                      className={cn(
                        "block px-4 py-3 font-label text-sm uppercase tracking-wider border-b border-border/50 transition-colors duration-200",
                        pathname === link.href ? "text-accent" : "text-neutral/75 hover:text-accent"
                      )}
                    >
                      {link.label}
                    </Link>
                    {link.children?.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block pl-8 pr-4 py-2.5 text-xs text-muted hover:text-accent transition-colors duration-150 font-label tracking-wide"
                      >
                        — {child.label}
                      </Link>
                    ))}
                  </div>
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
