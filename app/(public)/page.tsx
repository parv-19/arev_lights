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

  return (
    <>
      {isSectionActive("hero_banners") && <HeroCarousel banners={heroBanners} />}
      {isSectionActive("featured_categories") && <FeaturedCategories />}
      {isSectionActive("why_arev") && <WhyArev />}
      {isSectionActive("featured_products") && <FeaturedProducts />}
      {isSectionActive("partner_logos") && <BrandLogosSlider />}
      {isSectionActive("projects_showcase") && <ProjectsShowcase />}
      {isSectionActive("brochures") && <BrochuresSection />}
      {isSectionActive("testimonials") && <TestimonialsSlider />}
      {isSectionActive("inquiry_cta") && <InquiryCTASection />}
    </>
  );
}
