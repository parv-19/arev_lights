import HeroCarousel from "@/components/public/home/HeroCarousel";
import WhyArev from "@/components/public/home/WhyArev";
import BrandLogosSlider from "@/components/public/home/BrandLogosSlider";
import GlimpsesSection from "@/components/public/home/GlimpsesSection";
import BrochuresSection from "@/components/public/home/BrochuresSection";
import TestimonialsSlider from "@/components/public/home/TestimonialsSlider";
import InstagramSection from "@/components/public/home/InstagramSection";
import InquiryCTASection from "@/components/public/home/InquiryCTASection";
import type { Metadata } from "next";
import dbConnect from "@/lib/db";
import { ISiteSettings } from "@/types";
import Brand from "@/models/Brand";
import Testimonial from "@/models/Testimonial";
import Brochure from "@/models/Brochure";
import Glimpse from "@/models/Glimpse";
import SiteSettings from "@/models/SiteSettings";
import HomepageSection from "@/models/HomepageSection";

interface HomepageSectionRecord {
  sectionKey: string;
  data?: {
    banners?: unknown[];
  };
  isActive?: boolean;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AREV Lights – Premium Lighting Solutions",
  description:
    "Discover premium architectural and decorative lighting solutions. Trusted by architects, interior designers, and builders across India.",
};

async function getHomepageData(): Promise<HomepageSectionRecord[]> {
  try {
    await dbConnect();
    const sections = await HomepageSection.find({}).sort({ sectionKey: 1 }).lean();
    return JSON.parse(JSON.stringify(sections)) as HomepageSectionRecord[];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const sections = await getHomepageData();

  const getSectionData = (key: string) =>
    sections.find((section) => section.sectionKey === key)?.data;
  const isSectionActive = (key: string) =>
    sections.find((section) => section.sectionKey === key)?.isActive !== false;

  const heroBannersData = getSectionData("hero_banners");
  const heroBanners = heroBannersData?.banners;

  await dbConnect();
  const cleanData = <T,>(data: T): T => JSON.parse(JSON.stringify(data)) as T;

  const [brands, testimonials, brochures, glimpses, instagramReels, settingsObj] = await Promise.all([
    Brand.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
    Testimonial.find({ isVisible: true }).sort({ sortOrder: 1 }).lean(),
    Brochure.find({ isVisible: true }).populate("category").sort({ sortOrder: 1 }).limit(6).lean(),
    Glimpse.find({ isVisible: true }).sort({ sortOrder: 1 }).limit(3).lean(),
    Glimpse.find({
      isVisible: true,
      videoUrl: { $regex: "instagram\\.com", $options: "i" },
    })
      .sort({ sortOrder: 1 })
      .limit(4)
      .lean(),
    SiteSettings.findOne({}).lean(),
  ]);

  const settings = settingsObj ? (cleanData(settingsObj) as ISiteSettings) : null;
  const showWhyArev = settings?.showWhyArev !== false;

  return (
    <>
      {isSectionActive("hero_banners") && <HeroCarousel banners={heroBanners} />}
      {isSectionActive("why_arev") && showWhyArev && <WhyArev />}
      {isSectionActive("partner_logos") && <BrandLogosSlider brands={cleanData(brands)} />}
      <GlimpsesSection glimpses={cleanData(glimpses)} />
      {isSectionActive("brochures") && <BrochuresSection brochures={cleanData(brochures)} />}
      {isSectionActive("testimonials") && <TestimonialsSlider testimonials={cleanData(testimonials)} />}
      <InstagramSection
        instagramReels={cleanData(instagramReels)}
        instagramProfileUrl={settings?.socialLinks?.instagram}
      />
      {isSectionActive("inquiry_cta") && <InquiryCTASection />}
    </>
  );
}
