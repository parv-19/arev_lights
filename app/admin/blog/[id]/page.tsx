"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { uploadFile, slugify } from "@/lib/utils";

const EMPTY_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  metaTitle: "",
  metaDescription: "",
  author: "AREV Lights Team",
  tags: "",
  keywords: "",
  isPublished: true,
  coverImage: { url: "", publicId: "" },
};

export default function AdminBlogEditor({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [resolvedId, setResolvedId] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const isNew = useMemo(() => resolvedId === "new", [resolvedId]);

  useEffect(() => {
    params.then(({ id }) => setResolvedId(id));
  }, [params]);

  useEffect(() => {
    if (!resolvedId) return;
    if (resolvedId === "new") {
      setLoading(false);
      return;
    }

    fetch(`/api/blogs/${resolvedId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const post = data.data;
          setForm({
            title: post.title || "",
            slug: post.slug || "",
            excerpt: post.excerpt || "",
            content: post.content || "",
            metaTitle: post.metaTitle || "",
            metaDescription: post.metaDescription || "",
            author: post.author || "AREV Lights Team",
            tags: (post.tags || []).join(", "),
            keywords: (post.keywords || []).join(", "),
            isPublished: post.isPublished ?? true,
            coverImage: post.coverImage || { url: "", publicId: "" },
          });
        }
      })
      .finally(() => setLoading(false));
  }, [resolvedId]);

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      toast.error("Title, slug, and content are required");
      return;
    }

    setSaving(true);
    let coverImage = form.coverImage;
    if (coverFile) {
      try {
        coverImage = await uploadFile(coverFile, "arev-lights/blog");
      } catch {
        toast.error("Cover image upload failed");
        setSaving(false);
        return;
      }
    }

    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
      author: form.author,
      tags: form.tags.split(",").map((item) => item.trim()).filter(Boolean),
      keywords: form.keywords.split(",").map((item) => item.trim()).filter(Boolean),
      isPublished: form.isPublished,
      coverImage,
    };

    const url = isNew ? "/api/blogs" : `/api/blogs/${resolvedId}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.success) {
      toast.success(isNew ? "Blog post created" : "Blog post updated");
      router.push("/admin/blog");
      router.refresh();
    } else {
      toast.error(data.message || "Save failed");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted">Loading…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/blog" className="text-muted hover:text-accent transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-neutral text-xl font-semibold">{isNew ? "New Blog Post" : "Edit Blog Post"}</h1>
          <p className="text-muted text-sm mt-0.5">Write indexable Ahmedabad-focused articles and landing content.</p>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="admin-card space-y-4">
          <div>
            <label className="admin-label">Title *</label>
            <input
              className="admin-input"
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((f) => ({ ...f, title, slug: isNew ? slugify(title) : f.slug }));
              }}
            />
          </div>
          <div>
            <label className="admin-label">Slug *</label>
            <input className="admin-input" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} />
          </div>
          <div>
            <label className="admin-label">Excerpt</label>
            <textarea className="admin-input resize-none h-20" value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} />
          </div>
          <div>
            <label className="admin-label">Content *</label>
            <textarea className="admin-input resize-none h-[420px] font-mono text-sm" value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} />
            <p className="text-muted text-xs mt-2">Use blank lines to separate paragraphs and `##` / `###` for headings.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card space-y-4">
            <div>
              <label className="admin-label">Meta Title</label>
              <input className="admin-input" value={form.metaTitle} onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))} />
            </div>
            <div>
              <label className="admin-label">Meta Description</label>
              <textarea className="admin-input resize-none h-20" value={form.metaDescription} onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))} />
            </div>
            <div>
              <label className="admin-label">Keywords</label>
              <input className="admin-input" value={form.keywords} onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))} placeholder="lighting Ahmedabad, decorative lights, smart lighting" />
            </div>
            <div>
              <label className="admin-label">Tags</label>
              <input className="admin-input" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="Ahmedabad, Lighting, Interior Design" />
            </div>
            <div>
              <label className="admin-label">Author</label>
              <input className="admin-input" value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} />
            </div>
            <label className="flex items-center gap-3 text-sm text-neutral">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} />
              Publish this post
            </label>
          </div>

          <div className="admin-card space-y-4">
            <label className="admin-label">Cover Image</label>
            {form.coverImage.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.coverImage.url} alt="Cover" className="w-full aspect-video object-cover border border-border rounded" />
            )}
            <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
          </div>

          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="btn-gold py-3 px-6 text-sm">
              {saving ? "Saving…" : isNew ? "Create Post" : "Save Changes"}
            </button>
            <Link href="/admin/blog" className="btn-outline-gold py-3 px-6 text-sm">Cancel</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
