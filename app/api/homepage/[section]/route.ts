import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import HomepageSection from "@/models/HomepageSection";
import { requireAdminSession } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ section: string }> }) {
  try {
    await dbConnect();
    const { section } = await params;
    const data = await HomepageSection.findOne({ sectionKey: section });
    return NextResponse.json({ success: true, data: data || null });
  } catch (error) {
    console.error("[HOMEPAGE_SECTION_GET]", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ section: string }> }) {
  try {
    const unauthorized = await requireAdminSession();
    if (unauthorized) return unauthorized;

    await dbConnect();
    const { section } = await params;
    const body = await req.json();

    const updated = await HomepageSection.findOneAndUpdate(
      { sectionKey: section },
      { $set: { data: body.data, isActive: body.isActive } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[HOMEPAGE_SECTION_PUT]", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}
