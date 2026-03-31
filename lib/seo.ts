import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/env";

const siteUrl = getSiteUrl();

export const businessInfo = {
  name: "AREV Lights",
  description:
    "AREV Lights is a premium lighting store in Ahmedabad offering decorative lights, smart lighting, designer fans, and curated architectural lighting solutions.",
  city: "Ahmedabad",
  region: "Gujarat",
  country: "India",
  phone: "+91 92747 76616",
  email: "arev.lights@gmail.com",
  url: siteUrl,
  image: `${siteUrl}/logo.png`,
};

type MetadataInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
};

export function buildMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  image,
  type = "website",
}: MetadataInput): Metadata {
  const canonical = new URL(path, siteUrl).toString();
  const ogImage = image ? new URL(image, siteUrl).toString() : `${siteUrl}/logo.png`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: businessInfo.name,
      locale: "en_IN",
      type,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function getGlobalSchemas() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: businessInfo.name,
    image: businessInfo.image,
    url: businessInfo.url,
    telephone: businessInfo.phone,
    email: businessInfo.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: businessInfo.city,
      addressRegion: businessInfo.region,
      addressCountry: businessInfo.country,
    },
    areaServed: [
      {
        "@type": "City",
        name: businessInfo.city,
      },
    ],
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: businessInfo.name,
    url: businessInfo.url,
    logo: businessInfo.image,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: businessInfo.phone,
        contactType: "customer service",
        areaServed: "IN",
      },
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: businessInfo.name,
    url: businessInfo.url,
    inLanguage: "en-IN",
  };

  return [localBusiness, organization, website];
}

export function getArticleSchema(input: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  datePublished: string | Date;
  dateModified: string | Date;
  author?: string;
  keywords?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    image: input.image ? [input.image] : [businessInfo.image],
    datePublished: new Date(input.datePublished).toISOString(),
    dateModified: new Date(input.dateModified).toISOString(),
    author: {
      "@type": "Person",
      name: input.author || "AREV Lights Team",
    },
    publisher: {
      "@type": "Organization",
      name: businessInfo.name,
      logo: {
        "@type": "ImageObject",
        url: businessInfo.image,
      },
    },
    mainEntityOfPage: `${siteUrl}/blog/${input.slug}`,
    keywords: input.keywords?.join(", "),
  };
}

export const localLandingPages = [
  {
    slug: "lighting-store-ahmedabad",
    title: "Lighting Store in Ahmedabad for Premium Home and Commercial Spaces",
    description:
      "Visit AREV Lights, a premium lighting store in Ahmedabad for decorative lighting, architectural fixtures, and expert product guidance.",
    heading: "Lighting Store in Ahmedabad",
    intro:
      "AREV Lights helps homeowners, interior designers, architects, and builders source statement lighting for residences, hospitality spaces, offices, and retail projects across Ahmedabad.",
    highlights: [
      "Curated decorative lights and architectural fittings",
      "Expert support for residential and commercial lighting selections",
      "Design-focused showroom experience for Ahmedabad projects",
    ],
    keywords: [
      "lighting store Ahmedabad",
      "lights showroom Ahmedabad",
      "premium lighting Ahmedabad",
    ],
  },
  {
    slug: "decorative-lights-ahmedabad",
    title: "Decorative Lights in Ahmedabad for Elegant Interiors",
    description:
      "Explore decorative lights in Ahmedabad with AREV Lights, including chandeliers, wall lights, pendant lights, and statement fixtures for premium interiors.",
    heading: "Decorative Lights Ahmedabad",
    intro:
      "From modern apartments to luxury villas, AREV Lights helps Ahmedabad clients choose decorative lights that elevate living rooms, dining spaces, bedrooms, and hospitality projects.",
    highlights: [
      "Pendant lights, chandeliers, wall sconces, and accent pieces",
      "Styles matched to modern, classic, and contemporary interiors",
      "Consultation support for designers and homeowners in Ahmedabad",
    ],
    keywords: [
      "decorative lights Ahmedabad",
      "chandeliers Ahmedabad",
      "designer lighting Ahmedabad",
    ],
  },
  {
    slug: "smart-lighting-ahmedabad",
    title: "Smart Lighting Ahmedabad Solutions for Modern Homes",
    description:
      "Discover smart lighting in Ahmedabad with AREV Lights for automation-ready homes, mood scenes, efficient controls, and future-ready living spaces.",
    heading: "Smart Lighting Ahmedabad",
    intro:
      "AREV Lights supports Ahmedabad homeowners and project consultants with smart lighting plans that balance convenience, ambience, and energy efficiency.",
    highlights: [
      "Automation-ready lighting recommendations",
      "Mood-based zoning for living, dining, and bedroom spaces",
      "Practical guidance for premium modern homes in Ahmedabad",
    ],
    keywords: [
      "smart lighting Ahmedabad",
      "home automation lighting Ahmedabad",
      "modern lighting Ahmedabad",
    ],
  },
  {
    slug: "designer-fans-ahmedabad",
    title: "Designer Fans Ahmedabad for Premium Homes and Offices",
    description:
      "Shop designer fans in Ahmedabad with AREV Lights for stylish, high-performance air circulation that complements premium residential and commercial interiors.",
    heading: "Designer Fans Ahmedabad",
    intro:
      "AREV Lights offers designer fan options for Ahmedabad spaces where comfort, aesthetics, and premium finishing matter just as much as performance.",
    highlights: [
      "Designer fans selected for modern and luxury interiors",
      "Suitable options for homes, hospitality spaces, and offices",
      "Finish, size, and styling support from the AREV team",
    ],
    keywords: [
      "designer fans Ahmedabad",
      "premium fans Ahmedabad",
      "decorative ceiling fans Ahmedabad",
    ],
  },
] as const;
