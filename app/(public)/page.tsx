import HeroCarousel from "@/components/public/home/HeroCarousel";
import FeaturedCategories from "@/components/public/home/FeaturedCategories";
import WhyArev from "@/components/public/home/WhyArev";
import FeaturedProducts from "@/components/public/home/FeaturedProducts";
import BrandLogosSlider from "@/components/public/home/BrandLogosSlider";
import ProjectsShowcase from "@/components/public/home/ProjectsShowcase";
import BrochuresSection from "@/components/public/home/BrochuresSection";
import TestimonialsSlider from "@/components/public/home/TestimonialsSlider";
import InquiryCTASection from "@/components/public/home/InquiryCTASection";
import type { Metadata } from "next";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Brand from "@/models/Brand";
import Project from "@/models/Project";
import Testimonial from "@/models/Testimonial";
import Brochure from "@/models/Brochure";

export const metadata: Metadata = {
  title: "AREV Lights – Premium Lighting Solutions",
  description:
    "Discover premium architectural and decorative lighting solutions. Trusted by architects, interior designers, and builders across India.",
};

async function getHomepageData() {
  try {
    const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
    // Using no-store for immediate reflection of changes
    const res = await fetch(`${base}/api/homepage`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const sections = await getHomepageData();

  const getSectionData = (key: string) => sections.find((s: any) => s.sectionKey === key)?.data;
  const isSectionActive = (key: string) => sections.find((s: any) => s.sectionKey === key)?.isActive !== false;

  const heroBannersData = getSectionData("hero_banners");
  const heroBanners = heroBannersData?.banners;

  await dbConnect();
  const cleanData = (d: any) => JSON.parse(JSON.stringify(d));

  const [categories, products, brands, projects, testimonials, brochures] = await Promise.all([
    Category.find({ isActive: true }).sort({ sortOrder: 1 }).limit(8).lean(),
    Product.find({ isActive: true, isFeatured: true }).populate("category").limit(8).lean(),
    Brand.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
    Project.find({ isActive: true, isFeatured: true }).limit(6).lean(),
    Testimonial.find({ isVisible: true }).sort({ sortOrder: 1 }).lean(),
    Brochure.find({ isVisible: true }).populate("category").sort({ sortOrder: 1 }).limit(6).lean(),
  ]);

  return (
    <>
      {isSectionActive("hero_banners") && <HeroCarousel banners={heroBanners} />}
      {isSectionActive("featured_categories") && <FeaturedCategories categories={cleanData(categories)} />}
      {isSectionActive("why_arev") && <WhyArev />}
      {isSectionActive("featured_products") && <FeaturedProducts products={cleanData(products)} />}
      {isSectionActive("partner_logos") && <BrandLogosSlider brands={cleanData(brands)} />}
      {isSectionActive("projects_showcase") && <ProjectsShowcase projects={cleanData(projects)} />}
      {isSectionActive("brochures") && <BrochuresSection brochures={cleanData(brochures)} />}
      {isSectionActive("testimonials") && <TestimonialsSlider testimonials={cleanData(testimonials)} />}
      {isSectionActive("inquiry_cta") && <InquiryCTASection />}
    </>
  );
}
