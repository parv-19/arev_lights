import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { requireAdminSession } from "@/lib/auth";
import { sanitizeUnknown } from "@/lib/security";

const blogSchema = z.object({
  title: z.string().min(3).max(180),
  slug: z.string().min(3).max(180),
  excerpt: z.string().max(320).optional().or(z.literal("")),
  content: z.string().min(20),
  coverImage: z.object({
    url: z.string().optional().or(z.literal("")),
    publicId: z.string().optional().or(z.literal("")),
  }).optional(),
  metaTitle: z.string().max(180).optional().or(z.literal("")),
  metaDescription: z.string().max(320).optional().or(z.literal("")),
  keywords: z.array(z.string()).default([]),
  author: z.string().max(120).default("AREV Lights Team"),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "9", 10);
    const wantsDrafts = searchParams.get("published") === "false";

    if (wantsDrafts) {
      const unauthorized = await requireAdminSession();
      if (unauthorized) return unauthorized;
    }

    await dbConnect();
    const filter = wantsDrafts ? {} : { isPublished: true };
    const total = await BlogPost.countDocuments(filter);
    const posts = await BlogPost.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[BLOGS_GET]", error);
    return NextResponse.json({ success: false, message: "Failed to fetch blog posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const unauthorized = await requireAdminSession();
    if (unauthorized) return unauthorized;

    await dbConnect();
    const parsed = blogSchema.safeParse(sanitizeUnknown(await req.json()));
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Invalid blog post data" }, { status: 400 });
    }

    const existing = await BlogPost.findOne({ slug: parsed.data.slug });
    if (existing) {
      return NextResponse.json({ success: false, message: "Slug already exists" }, { status: 409 });
    }

    const post = await BlogPost.create(parsed.data);
    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    console.error("[BLOGS_POST]", error);
    return NextResponse.json({ success: false, message: "Failed to create blog post" }, { status: 500 });
  }
}
