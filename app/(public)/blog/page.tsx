import Link from "next/link";
import type { Metadata } from "next";
import dbConnect from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Lighting Blog Ahmedabad | AREV Lights",
  description:
    "Read the AREV Lights blog for lighting ideas, smart lighting guidance, decorative trends, and Ahmedabad-focused design inspiration.",
  path: "/blog",
  keywords: [
    "lighting blog Ahmedabad",
    "home lighting ideas Ahmedabad",
    "AREV Lights blog",
  ],
});

async function getPosts() {
  await dbConnect();
  const posts = await BlogPost.find({ isPublished: true }).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(posts));
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <section className="pt-20 pb-14 bg-surface border-b border-border">
        <div className="container-custom text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="gold-line" />
            <span className="section-label">SEO Blog</span>
            <div className="gold-line" />
          </div>
          <h1 className="heading-display mb-4">Lighting Ideas and Insights for Ahmedabad</h1>
          <p className="text-muted max-w-3xl mx-auto">
            Explore practical articles on decorative lighting, smart controls, styling ideas, and
            product inspiration curated for Ahmedabad homes, offices, and hospitality spaces.
          </p>
        </div>
      </section>

      <section className="section-padding bg-primary">
        <div className="container-custom">
          {posts.length === 0 ? (
            <div className="admin-card text-center text-muted">Blog posts will appear here once they are published.</div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {posts.map((post: any) => (
                <article key={post._id} className="admin-card overflow-hidden p-0">
                  {post.coverImage?.url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.coverImage.url} alt={post.title} className="w-full aspect-[16/10] object-cover" />
                  )}
                  <div className="p-6">
                    <p className="text-accent text-xs font-label uppercase tracking-wider mb-3">
                      {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <h2 className="font-display text-2xl text-neutral mb-3 leading-snug">
                      <Link href={`/blog/${post.slug}`} className="hover:text-accent transition-colors">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-muted text-sm leading-relaxed mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted text-xs">{post.author}</span>
                      <Link href={`/blog/${post.slug}`} className="text-accent text-sm hover:text-accent-light transition-colors">
                        Read article
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
