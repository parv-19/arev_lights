import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { requireAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const tag = searchParams.get("tag");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "50");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = { isActive: true };
    if (tag) filter.tags = tag;
    if (featured === "true") filter.isFeatured = true;

    const projects = await Project.find(filter).sort({ createdAt: -1 }).limit(limit);
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("[PROJECTS_GET]", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const unauthorized = await requireAdminSession();
    if (unauthorized) return unauthorized;

    await dbConnect();
    const body = await req.json();
    if (!body.title) return NextResponse.json({ success: false, message: "Title required" }, { status: 400 });
    const project = await Project.create(body);
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    console.error("[PROJECTS_POST]", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}
