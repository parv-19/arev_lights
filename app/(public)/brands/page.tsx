import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import SectionReveal from "@/components/shared/SectionReveal";
import InquiryCTASection from "@/components/public/home/InquiryCTASection";
import { IBrand } from "@/types";

export const metadata: Metadata = {
  title: "Our Brands — AREV Lights",
  description: "AREV Lights partners with the world's finest lighting brands to bring you premium, certified products.",
};

const FALLBACK_BRANDS = [
  { _id: "1", name: "Philips Lighting", logo: { url: "", publicId: "" }, sortOrder: 0, isActive: true, websiteUrl: "https://www.signify.com" },
  { _id: "2", name: "Havells", logo: { url: "", publicId: "" }, sortOrder: 1, isActive: true, websiteUrl: "https://www.havells.com" },
  { _id: "3", name: "Osram", logo: { url: "", publicId: "" }, sortOrder: 2, isActive: true, websiteUrl: "https://www.osram.com" },
  { _id: "4", name: "Syska", logo: { url: "", publicId: "" }, sortOrder: 3, isActive: true, websiteUrl: "https://www.syska.in" },
  { _id: "5", name: "Wipro Lighting", logo: { url: "", publicId: "" }, sortOrder: 4, isActive: true },
  { _id: "6", name: "Orient Electric", logo: { url: "", publicId: "" }, sortOrder: 5, isActive: true },
  { _id: "7", name: "Anchor Electricals", logo: { url: "", publicId: "" }, sortOrder: 6, isActive: true },
  { _id: "8", name: "Surya Roshni", logo: { url: "", publicId: "" }, sortOrder: 7, isActive: true },
];

async function getBrands(): Promise<IBrand[]> {
  try {
    const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/brands?activeOnly=true`, { next: { revalidate: 120 } });
    const data = await res.json();
    return data.success && data.data.length > 0 ? data.data : [];
  } catch { return []; }
}

export default async function BrandsPage() {
  const dbBrands = await getBrands();
  const brands = dbBrands.length > 0 ? dbBrands : FALLBACK_BRANDS as unknown as IBrand[];

  return (
    <>
      {/* Hero */}
      <section className="pt-20 pb-14 bg-surface border-b border-border">
        <div className="container-custom text-center">
          <SectionReveal>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="gold-line" />
              <span className="section-label">Our Partners</span>
              <div className="gold-line" />
            </div>
            <h1 className="heading-display mb-4">Premium Brand Portfolio</h1>
            <p className="text-muted max-w-xl mx-auto">
              We partner exclusively with globally recognised, certified lighting brands to ensure every product meets the highest quality standards.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Brand Grid */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {brands.map((brand, i) => {
              const Wrapper = brand.websiteUrl ? "a" : "div";
              const wrapperProps = brand.websiteUrl
                ? { href: brand.websiteUrl, target: "_blank", rel: "noopener noreferrer" }
                : {};

              return (
                <SectionReveal key={brand._id} delay={i * 0.06}>
                  <Wrapper
                    {...(wrapperProps as Record<string, string>)}
                    className="group flex flex-col items-center justify-center gap-4 p-8 border border-border rounded-sm hover:border-accent/40 hover:bg-surface hover:-translate-y-1 hover:shadow-card transition-all duration-300 cursor-pointer"
                  >
                    {brand.logo?.url ? (
                      <div className="relative w-28 h-16">
                        <Image
                          src={brand.logo.url}
                          alt={brand.name}
                          fill
                          className="object-contain filter brightness-75 group-hover:brightness-100 transition-all duration-300"
                          sizes="112px"
                        />
                      </div>
                    ) : (
                      <div className="w-28 h-14 flex items-center justify-center">
                        <span className="font-label text-sm font-bold text-muted group-hover:text-accent transition-colors duration-300 text-center leading-tight">
                          {brand.name}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-accent text-[10px] font-label uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {brand.websiteUrl ? (
                        <>Visit Site <ExternalLink size={10} /></>
                      ) : (
                        <><Link href={`/products?brand=${brand._id}`} className="flex items-center gap-1">Browse Products</Link></>
                      )}
                    </div>
                  </Wrapper>
                </SectionReveal>
              );
            })}
          </div>

          {/* USP Note */}
          <SectionReveal className="mt-16">
            <div className="border border-accent/20 bg-accent/5 rounded-sm p-8 text-center">
              <p className="font-display text-2xl text-neutral mb-3">Every Brand. Every Certification.</p>
              <p className="text-muted max-w-xl mx-auto text-sm leading-relaxed">
                All brands in our portfolio carry ISI, CE, RoHS, or BEE star ratings. We never compromise on quality — because your project deserves the best.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      <InquiryCTASection />
    </>
  );
}
