import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Glimpse from "@/models/Glimpse";
import { requireAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const publicOnly = searchParams.get("public") === "1";
    const query = publicOnly ? { isVisible: true } : {};
    const glimpses = await Glimpse.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: glimpses });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const unauthorized = await requireAdminSession();
    if (unauthorized) return unauthorized;

    await dbConnect();
    const body = await req.json();
    const { title, videoUrl, description, thumbnail, isVisible, sortOrder } = body;
    if (!title?.trim() || !videoUrl?.trim()) {
      return NextResponse.json({ success: false, message: "Title and video URL are required." }, { status: 400 });
    }
    const glimpse = await Glimpse.create({ title: title.trim(), videoUrl: videoUrl.trim(), description: description?.trim() || "", thumbnail: thumbnail || { url: "", publicId: "" }, isVisible: isVisible ?? true, sortOrder: sortOrder ?? 0 });
    return NextResponse.json({ success: true, data: glimpse }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
