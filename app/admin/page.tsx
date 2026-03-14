import { ShoppingBag, Tag, FileText, Image as ImageIcon, Inbox, Users } from "lucide-react";
import Link from "next/link";

const STATS = [
  { label: "Products", value: "–", icon: ShoppingBag, href: "/admin/products", color: "text-accent" },
  { label: "Categories", value: "–", icon: Tag, href: "/admin/categories", color: "text-info" },
  { label: "Brochures", value: "–", icon: FileText, href: "/admin/brochures", color: "text-success" },
  { label: "Projects", value: "–", icon: ImageIcon, href: "/admin/projects", color: "text-warning" },
  { label: "Inquiries", value: "–", icon: Inbox, href: "/admin/inquiries", color: "text-danger" },
];

const QUICK_LINKS = [
  { label: "Add Product", href: "/admin/products?action=new" },
  { label: "Add Category", href: "/admin/categories?action=new" },
  { label: "Upload Brochure", href: "/admin/brochures?action=new" },
  { label: "Add Project", href: "/admin/projects?action=new" },
  { label: "Manage Homepage", href: "/admin/homepage" },
  { label: "View Inquiries", href: "/admin/inquiries" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-neutral text-2xl font-semibold">Dashboard Overview</h1>
        <p className="text-muted text-sm mt-1">Manage your AREV Lights website content</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {STATS.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="admin-card hover:border-border-light transition-colors duration-200 group"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={20} className={`${stat.color} opacity-80`} />
            </div>
            <p className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</p>
            <p className="text-muted text-xs font-label uppercase tracking-wider">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="admin-card">
        <h2 className="text-neutral font-semibold mb-4 text-sm uppercase tracking-wider">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-2 px-4 py-3 bg-surface-2 border border-border rounded-md text-sm text-muted hover:text-accent hover:border-accent/30 transition-all duration-200"
            >
              <span className="text-accent">+</span>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Notice */}
      <div className="admin-card border-accent/20 bg-accent/5">
        <p className="text-accent text-sm font-semibold mb-1">Connect MongoDB to see live stats</p>
        <p className="text-muted text-xs leading-relaxed">
          Add your <code className="bg-surface px-1.5 py-0.5 rounded text-accent/80">MONGODB_URI</code> in{" "}
          <code className="bg-surface px-1.5 py-0.5 rounded text-accent/80">.env.local</code> and restart the server.
          All stats, tables, and content management will become fully functional.
        </p>
      </div>
    </div>
  );
}
