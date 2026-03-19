import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, MessageCircle, Phone, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import SectionReveal from "@/components/shared/SectionReveal";
import { IProduct } from "@/types";
import { buildWhatsAppLink, getPrimaryImage } from "@/lib/utils";
import ProductGallery from "@/components/public/products/ProductGallery";
import RelatedProducts from "@/components/public/products/RelatedProducts";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<IProduct | null> {
  try {
    const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/products/${slug}`, { next: { revalidate: 60 } });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found — AREV Lights" };
  return {
    title: `${product.seoTitle || product.title} — AREV Lights`,
    description: product.seoDescription || product.shortDesc || `Buy ${product.title} from AREV Lights.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const whatsappLink = buildWhatsAppLink(
    "919274776616",
    `Hello! I'm interested in "${product.title}" from AREV Lights. Please share more details.`
  );

  return (
    <>
      <section className="section-padding bg-primary">
        <div className="container-custom">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted mb-8 font-label uppercase tracking-wider">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/products" className="hover:text-accent transition-colors">Products</Link>
            {product.category && (
              <>
                <ChevronRight size={12} />
                <Link href={`/products?category=${product.category._id}`} className="hover:text-accent transition-colors">
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight size={12} />
            <span className="text-neutral">{product.title}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-14 items-start">
            {/* Image Gallery */}
            <ProductGallery images={product.images} title={product.title} />

            {/* Product Info */}
            <SectionReveal direction="right">
              <div className="sticky top-24">
                {/* Labels */}
                <div className="flex items-center gap-3 mb-3">
                  {product.category && (
                    <Link
                      href={`/products?category=${product.category._id}`}
                      className="section-label text-[10px] hover:text-accent-light transition-colors"
                    >
                      {product.category.name}
                    </Link>
                  )}
                  {product.brand && (
                    <span className="section-label text-[10px] text-muted border-l border-border pl-3">{product.brand.name}</span>
                  )}
                </div>

                {/* Title */}
                <h1 className="font-display text-3xl lg:text-4xl text-neutral font-semibold leading-tight mb-4">
                  {product.title}
                </h1>

                {/* Gold divider */}
                <div className="gold-line mb-5" />

                {/* Short Description */}
                {product.shortDesc && (
                  <p className="text-muted leading-relaxed mb-6 text-base">{product.shortDesc}</p>
                )}

                {/* Tags */}
                {product.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {product.tags.map((tag) => (
                      <span key={tag} className="text-xs font-label text-muted border border-border px-2.5 py-1 uppercase tracking-wide hover:border-accent/50 hover:text-accent transition-colors cursor-default">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Specs Table */}
                {product.specs?.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-neutral font-semibold text-sm uppercase tracking-wider mb-3 font-label">Specifications</h3>
                    <div className="border border-border rounded-sm overflow-hidden">
                      {product.specs.map((spec, i) => (
                        <div
                          key={spec.key}
                          className={`flex items-start gap-3 px-4 py-2.5 ${i % 2 === 0 ? "bg-surface" : "bg-surface-2"} border-b border-border/50 last:border-0`}
                        >
                          <span className="text-muted text-xs font-label uppercase tracking-wide w-32 flex-shrink-0 pt-0.5">{spec.key}</span>
                          <span className="text-neutral text-sm">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTAs */}
                <div className="space-y-3">
                  <Link href="/contact" className="btn-gold w-full justify-center py-4">
                    Request a Quote <ChevronRight size={16} />
                  </Link>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full border border-[#25D366]/40 text-[#25D366] py-4 font-label text-sm uppercase tracking-widest hover:bg-[#25D366]/10 transition-colors duration-200"
                  >
                    <MessageCircle size={17} /> Chat on WhatsApp
                  </a>
                  {product.brochure?.pdfUrl && (
                    <a href={product.brochure.pdfUrl} download target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full border border-border text-muted py-3.5 font-label text-sm uppercase tracking-wider hover:border-accent hover:text-accent transition-colors duration-200"
                    >
                      <Download size={15} /> Download Brochure
                    </a>
                  )}
                </div>

                {/* Helpline */}
                <div className="mt-6 flex items-center gap-2 text-muted text-sm border-t border-border pt-5">
                  <Phone size={14} className="text-accent" />
                  <span>Need help? Call us: </span>
                  <a href="tel:+919274776616" className="text-accent hover:underline">+91 92747 76616</a>
                </div>
              </div>
            </SectionReveal>
          </div>

          {/* Full Description */}
          {product.description && (
            <SectionReveal>
              <div className="mt-16 pt-12 border-t border-border max-w-3xl">
                <h2 className="font-display text-2xl text-neutral mb-5">Product Description</h2>
                <div className="prose prose-invert prose-sm max-w-none text-muted leading-relaxed">
                  {product.description.split("\n").map((p, i) => p.trim() && <p key={i} className="mb-3">{p}</p>)}
                </div>
              </div>
            </SectionReveal>
          )}
        </div>
      </section>

      {/* Related Products */}
      <RelatedProducts currentId={product._id} categoryId={product.category?._id} />

      {/* Bottom CTA */}
      <section className="py-16 bg-surface border-t border-border">
        <div className="container-custom text-center">
          <p className="font-display text-2xl text-neutral mb-4">Interested in this product?</p>
          <p className="text-muted mb-8">Our team is ready to help with pricing, specs, and installation guidance.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact" className="btn-gold">Send Enquiry</Link>
            <Link href="/products" className="btn-outline-gold">
              <ArrowLeft size={15} /> Back to Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
