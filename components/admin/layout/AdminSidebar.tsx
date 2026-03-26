"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Home, FileText, Image as ImageIcon,
  Star, Globe, Inbox, Settings, BarChart2,
  ChevronLeft, ChevronRight, LogOut, Menu, X, UserCheck, Video,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Homepage CMS", href: "/admin/homepage", icon: Home },
  { label: "Brochures", href: "/admin/brochures", icon: FileText },
  // { label: "Projects", href: "/admin/projects", icon: ImageIcon }, // Commented out for now
  { label: "Glimpses", href: "/admin/glimpses", icon: Video },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star },
  { label: "Brands", href: "/admin/brands", icon: Globe },
  { label: "Inquiries", href: "/admin/inquiries", icon: Inbox },
  { label: "Leads", href: "/admin/leads", icon: UserCheck },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "SEO", href: "/admin/seo", icon: BarChart2 },
];

export default function AdminSidebar({ settings }: { settings?: any }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (item: typeof NAV_ITEMS[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 py-5 px-4 border-b border-border min-h-[72px]",
        collapsed && !isMobile && "justify-center px-3"
      )}>
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent flex items-center justify-center flex-shrink-0">
            <span className="font-display text-primary font-bold text-xs">AR</span>
          </div>
          {(!collapsed || isMobile) && (
            <div className="flex flex-col leading-none">
              <span className="font-display text-base font-semibold text-neutral">AREV Lights</span>
              <span className="text-[9px] font-label uppercase tracking-[0.3em] text-accent">Admin Panel</span>
            </div>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
        <div className="space-y-0.5 px-2">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md transition-all duration-200 group",
                  collapsed && !isMobile ? "px-0 py-2.5 justify-center" : "px-3 py-2.5",
                  active
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-muted-2 hover:bg-surface-2 hover:text-neutral border border-transparent"
                )}
                title={collapsed && !isMobile ? item.label : undefined}
              >
                <item.icon
                  size={17}
                  className={cn(
                    "flex-shrink-0 transition-colors",
                    active ? "text-accent" : "text-muted group-hover:text-neutral"
                  )}
                />
                {(!collapsed || isMobile) && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
                {active && !collapsed && !isMobile && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className={cn("border-t border-border p-4", collapsed && !isMobile && "px-2")}>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className={cn(
            "flex items-center gap-3 text-muted hover:text-danger transition-colors duration-200 w-full rounded-md py-2 px-2 hover:bg-danger/5",
            collapsed && !isMobile && "justify-center"
          )}
          title="Sign Out"
        >
          <LogOut size={16} className="flex-shrink-0" />
          {(!collapsed || isMobile) && <span className="text-sm">Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 240 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="hidden lg:flex flex-col bg-surface border-r border-border relative flex-shrink-0 overflow-hidden"
      >
        <SidebarContent />

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3.5 top-20 w-7 h-7 bg-surface border border-border rounded-full flex items-center justify-center text-muted hover:text-accent hover:border-accent transition-all duration-200 z-10"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </motion.aside>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-surface border border-border flex items-center justify-center text-neutral"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-primary/80 backdrop-blur-sm z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-surface border-r border-border z-50 flex flex-col"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 text-muted hover:text-neutral"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
