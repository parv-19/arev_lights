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

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <FeaturedCategories />
      <WhyArev />
      <FeaturedProducts />
      <BrandLogosSlider />
      <ProjectsShowcase />
      <BrochuresSection />
      <TestimonialsSlider />
      <InquiryCTASection />
    </>
  );
}
