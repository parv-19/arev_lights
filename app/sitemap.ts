import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";

const staticRoutes = [
  "",
  "/about",
  "/brands",
  "/brochures",
  "/contact",
  "/dealer-inquiry",
  "/glimpses",
  "/projects",
  "/testimonials",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
