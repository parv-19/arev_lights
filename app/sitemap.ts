import type { MetadataRoute } from "next";
import dbConnect from "@/lib/db";
import { getSiteUrl } from "@/lib/env";
import { localLandingPages } from "@/lib/seo";
import BlogPost from "@/models/BlogPost";

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
  "/blog",
  ...localLandingPages.map((page) => `/${page.slug}`),
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();
  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    await dbConnect();
    const posts = await BlogPost.find({ isPublished: true }).select("slug createdAt updatedAt").lean();
    blogRoutes = posts.map((post: any) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.createdAt || now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    blogRoutes = [];
  }

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => {
    const changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] =
      route === "" || route === "/blog" ? "weekly" : "monthly";

    return {
      url: `${siteUrl}${route}`,
      lastModified: now,
      changeFrequency,
      priority: route === "" ? 1 : route === "/blog" ? 0.9 : 0.7,
    };
  });

  return [...staticEntries, ...blogRoutes];
}
