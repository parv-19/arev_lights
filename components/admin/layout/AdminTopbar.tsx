"use client";
import { usePathname } from "next/navigation";
import { Bell, ExternalLink } from "lucide-react";
import Link from "next/link";

const BREADCRUMBS: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/homepage": "Homepage CMS",
  "/admin/categories": "Categories",
  "/admin/products": "Products",
  "/admin/brochures": "Brochures",
  "/admin/projects": "Projects",
  "/admin/testimonials": "Testimonials",
  "/admin/brands": "Brands",
  "/admin/inquiries": "Inquiries",
  "/admin/settings": "Settings",
  "/admin/seo": "SEO Management",
};

export default function AdminTopbar() {
  const pathname = usePathname();
  const crumb = BREADCRUMBS[pathname] || "Admin";
  const basePath = "/" + pathname.split("/").slice(1, 3).join("/");
  const parentCrumb = BREADCRUMBS[basePath];

  return (
    <header className="h-16 flex items-center justify-between px-6 lg:px-8 bg-surface border-b border-border flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted font-label uppercase tracking-wider text-xs">Admin</span>
        <span className="text-border-light">/</span>
        {parentCrumb && parentCrumb !== crumb && (
          <>
            <Link href={basePath} className="text-muted hover:text-neutral transition-colors font-label text-xs uppercase tracking-wider">
              {parentCrumb}
            </Link>
            <span className="text-border-light">/</span>
          </>
        )}
        <span className="text-neutral font-label text-xs uppercase tracking-wider">{crumb}</span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-muted text-xs hover:text-accent transition-colors font-label"
        >
          <ExternalLink size={13} />
          View Site
        </Link>

        <div className="w-px h-5 bg-border" />

        <button className="relative w-8 h-8 flex items-center justify-center text-muted hover:text-neutral transition-colors">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full" />
        </button>

        <div className="w-8 h-8 bg-accent/20 border border-accent/30 rounded-full flex items-center justify-center">
          <span className="text-accent font-bold text-xs">A</span>
        </div>
      </div>
    </header>
  );
}
