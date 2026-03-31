import Link from "next/link";
import type { Metadata } from "next";
import dbConnect from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import BlogContent from "@/components/public/blog/BlogContent";
import StructuredData from "@/components/shared/StructuredData";
import { buildMetadata, getArticleSchema } from "@/lib/seo";

async function getPost(slug: string) {
  await dbConnect();
  const post = await BlogPost.findOne({ slug, isPublished: true }).lean();
  return post ? JSON.parse(JSON.stringify(post)) : null;
}

async function getRelatedPosts(slug: string, tags: string[]) {
  await dbConnect();
  const posts = await BlogPost.find({
    slug: { $ne: slug },
    isPublished: true,
    ...(tags.length ? { tags: { $in: tags } } : {}),
  })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  return JSON.parse(JSON.stringify(posts));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return buildMetadata({
      title: "Blog | AREV Lights Ahmedabad",
      description: "Lighting ideas and insights from AREV Lights Ahmedabad.",
      path: "/blog",
    });
  }

  return buildMetadata({
    title: post.metaTitle || `${post.title} | AREV Lights Ahmedabad`,
    description: post.metaDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage?.url,
    keywords: post.keywords || [],
    type: "article",
  });
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="admin-card text-center">
            <h1 className="font-display text-3xl text-neutral mb-3">Article not found</h1>
            <Link href="/blog" className="text-accent hover:text-accent-light transition-colors">Back to blog</Link>
          </div>
        </div>
      </section>
    );
  }

  const relatedPosts = await getRelatedPosts(post.slug, post.tags || []);

  return (
    <>
      <StructuredData data={getArticleSchema({
        title: post.title,
        description: post.metaDescription || post.excerpt,
        slug: post.slug,
        image: post.coverImage?.url,
        datePublished: post.createdAt,
        dateModified: post.updatedAt,
        author: post.author,
        keywords: post.keywords,
      })} />

      <section className="pt-20 pb-14 bg-surface border-b border-border">
        <div className="container-custom max-w-4xl">
          <Link href="/blog" className="text-accent text-sm hover:text-accent-light transition-colors">
            Back to Blog
          </Link>
          <p className="text-accent text-xs font-label uppercase tracking-wider mt-6 mb-3">
            {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <h1 className="heading-display mb-4">{post.title}</h1>
          <p className="text-muted text-lg leading-relaxed">{post.excerpt}</p>
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 border border-border text-xs text-muted rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-padding bg-primary">
        <div className="container-custom max-w-4xl">
          {post.coverImage?.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.coverImage.url} alt={post.title} className="w-full rounded-sm border border-border aspect-[16/8] object-cover mb-10" />
          )}

          <BlogContent content={post.content} />

          <div className="admin-card mt-10">
            <h2 className="font-display text-2xl text-neutral mb-3">Need help selecting lights in Ahmedabad?</h2>
            <p className="text-muted mb-4">
              Explore AREV Lights products, browse brochures, or contact our team for project-specific recommendations.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn-gold">Contact AREV Lights</Link>
              <Link href="/brochures" className="btn-outline-gold">View Brochures</Link>
            </div>
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="pb-16 bg-primary">
          <div className="container-custom max-w-5xl">
            <h2 className="font-display text-3xl text-neutral mb-6">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((related: any) => (
                <article key={related._id} className="admin-card">
                  <h3 className="font-display text-xl text-neutral mb-3">
                    <Link href={`/blog/${related.slug}`} className="hover:text-accent transition-colors">
                      {related.title}
                    </Link>
                  </h3>
                  <p className="text-muted text-sm">{related.excerpt}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
