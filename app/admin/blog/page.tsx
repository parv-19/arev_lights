"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { IBlogPost } from "@/types";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const res = await fetch("/api/blogs?published=false&limit=100");
    const data = await res.json();
    if (data.success) setPosts(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (post: IBlogPost) => {
    if (!confirm(`Delete "${post.title}"?`)) return;
    const res = await fetch(`/api/blogs/${post._id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      toast.success("Blog post deleted");
      fetchPosts();
    } else {
      toast.error(data.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-neutral text-xl font-semibold">Blog Posts</h1>
          <p className="text-muted text-sm mt-0.5">Manage SEO content and Ahmedabad blog articles.</p>
        </div>
        <Link href="/admin/blog/new" className="btn-gold text-sm py-2.5 px-5 inline-flex items-center gap-2">
          <Plus size={16} /> New Post
        </Link>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-32 text-muted text-sm">Loading…</div>
        ) : posts.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted text-sm">No blog posts yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-muted text-xs font-label uppercase tracking-wider">Title</th>
                  <th className="text-left px-5 py-3 text-muted text-xs font-label uppercase tracking-wider hidden md:table-cell">Slug</th>
                  <th className="text-left px-5 py-3 text-muted text-xs font-label uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 text-muted text-xs font-label uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id} className="border-b border-border/50 hover:bg-surface-2/50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-neutral text-sm font-medium">{post.title}</p>
                      <p className="text-muted text-xs mt-1 line-clamp-2">{post.excerpt}</p>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className="text-muted text-xs font-mono">{post.slug}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs ${post.isPublished ? "text-success" : "text-warning"}`}>
                        {post.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/blog/${post._id}`} className="p-1.5 text-muted hover:text-accent transition-colors">
                          <Pencil size={14} />
                        </Link>
                        <button onClick={() => handleDelete(post)} className="p-1.5 text-muted hover:text-danger transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
