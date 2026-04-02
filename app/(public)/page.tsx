import HeroCarousel from "@/components/public/home/HeroCarousel";
import WhyArev from "@/components/public/home/WhyArev";
import BrandLogosSlider from "@/components/public/home/BrandLogosSlider";
import ProjectsShowcase from "@/components/public/home/ProjectsShowcase";
import GlimpsesSection from "@/components/public/home/GlimpsesSection";
import BrochuresSection from "@/components/public/home/BrochuresSection";
import TestimonialsSlider from "@/components/public/home/TestimonialsSlider";
import InquiryCTASection from "@/components/public/home/InquiryCTASection";
import type { Metadata } from "next";
import dbConnect from "@/lib/db";
import Brand from "@/models/Brand";
import Project from "@/models/Project";
import Testimonial from "@/models/Testimonial";
import Brochure from "@/models/Brochure";
import Glimpse from "@/models/Glimpse";
import SiteSettings from "@/models/SiteSettings";
import HomepageSection from "@/models/HomepageSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AREV Lights – Premium Lighting Solutions",
  description:
    "Discover premium architectural and decorative lighting solutions. Trusted by architects, interior designers, and builders across India.",
};

async function getHomepageData() {
  try {
    await dbConnect();
    const sections = await HomepageSection.find({}).sort({ sectionKey: 1 }).lean();
    return JSON.parse(JSON.stringify(sections));
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

  const [brands, projects, testimonials, brochures, glimpses, settingsObj] = await Promise.all([
    Brand.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
    Project.find({ isActive: true, isFeatured: true }).limit(6).lean(),
    Testimonial.find({ isVisible: true }).sort({ sortOrder: 1 }).lean(),
    Brochure.find({ isVisible: true }).populate("category").sort({ sortOrder: 1 }).limit(6).lean(),
    Glimpse.find({ isVisible: true }).sort({ sortOrder: 1 }).limit(3).lean(),
    SiteSettings.findOne({}).lean(),
  ]);

  const showWhyArev = (settingsObj as any)?.showWhyArev !== false;
  const showProjects = (settingsObj as any)?.showProjects !== false;

  return (
    <>
      {isSectionActive("hero_banners") && <HeroCarousel banners={heroBanners} />}
      {isSectionActive("why_arev") && showWhyArev && <WhyArev />}
      {isSectionActive("partner_logos") && <BrandLogosSlider brands={cleanData(brands)} />}
      {/* {isSectionActive("projects_showcase") && showProjects && <ProjectsShowcase projects={cleanData(projects)} />} */}
      <GlimpsesSection glimpses={cleanData(glimpses)} />
      {isSectionActive("brochures") && <BrochuresSection brochures={cleanData(brochures)} />}
      {isSectionActive("testimonials") && <TestimonialsSlider testimonials={cleanData(testimonials)} />}
      {isSectionActive("inquiry_cta") && <InquiryCTASection />}
    </>
  );
}
