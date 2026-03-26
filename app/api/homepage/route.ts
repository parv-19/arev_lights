import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import HomepageSection from "@/models/HomepageSection";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const sections = await HomepageSection.find({}).sort({ sectionKey: 1 });
    return NextResponse.json({ success: true, data: sections });
  } catch (error) {
    console.error("[HOMEPAGE_GET]", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const unauthorized = await requireAdminSession();
    if (unauthorized) return unauthorized;

    await dbConnect();
    const body = await req.json();
    const section = await HomepageSection.findOneAndUpdate(
      { sectionKey: body.sectionKey },
      { $set: body },
      { new: true, upsert: true }
    );
    return NextResponse.json({ success: true, data: section });
  } catch (error) {
    console.error("[HOMEPAGE_POST]", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}
