import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { requireAdminSession } from "@/lib/auth";
import { sanitizeUnknown } from "@/lib/security";

const blogUpdateSchema = z.object({
  title: z.string().min(3).max(180).optional(),
  slug: z.string().min(3).max(180).optional(),
  excerpt: z.string().max(320).optional().or(z.literal("")),
  content: z.string().min(20).optional(),
  coverImage: z.object({
    url: z.string().optional().or(z.literal("")),
    publicId: z.string().optional().or(z.literal("")),
  }).optional(),
  metaTitle: z.string().max(180).optional().or(z.literal("")),
  metaDescription: z.string().max(320).optional().or(z.literal("")),
  keywords: z.array(z.string()).optional(),
  author: z.string().max(120).optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id.includes("-")) {
      const unauthorized = await requireAdminSession();
      if (unauthorized) return unauthorized;
    }

    await dbConnect();
    const query = id.includes("-")
      ? BlogPost.findOne({ slug: id, isPublished: true })
      : BlogPost.findById(id);
    const post = await query.lean();

    if (!post) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error("[BLOG_GET]", error);
    return NextResponse.json({ success: false, message: "Failed to fetch blog post" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unauthorized = await requireAdminSession();
    if (unauthorized) return unauthorized;

    await dbConnect();
    const { id } = await params;
    const parsed = blogUpdateSchema.safeParse(sanitizeUnknown(await req.json()));
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Invalid blog post data" }, { status: 400 });
    }

    if (parsed.data.slug) {
      const existing = await BlogPost.findOne({ slug: parsed.data.slug, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json({ success: false, message: "Slug already exists" }, { status: 409 });
      }
    }

    const post = await BlogPost.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true });
    if (!post) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error("[BLOG_PUT]", error);
    return NextResponse.json({ success: false, message: "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unauthorized = await requireAdminSession();
    if (unauthorized) return unauthorized;

    await dbConnect();
    const { id } = await params;
    const post = await BlogPost.findByIdAndDelete(id);
    if (!post) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Blog post deleted" });
  } catch (error) {
    console.error("[BLOG_DELETE]", error);
    return NextResponse.json({ success: false, message: "Failed to delete blog post" }, { status: 500 });
  }
}
