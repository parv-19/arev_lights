import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Brochure from "@/models/Brochure";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const visibleOnly = searchParams.get("visible") === "true";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (category) filter.category = category;
    if (visibleOnly) filter.isVisible = true;

    const brochures = await Brochure.find(filter)
      .populate("category", "name slug")
      .sort({ sortOrder: 1, createdAt: -1 });

    return NextResponse.json({ success: true, data: brochures });
  } catch (error) {
    console.error("[BROCHURES_GET]", error);
    return NextResponse.json({ success: false, message: "Failed to fetch brochures" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 });
    }
    const brochure = await Brochure.create(body);
    return NextResponse.json({ success: true, data: brochure }, { status: 201 });
  } catch (error: any) {
    console.error("[BROCHURES_POST]", error);
    return NextResponse.json({ success: false, message: "Failed to create brochure", error: error?.message, stack: error?.stack }, { status: 500 });
  }
}
