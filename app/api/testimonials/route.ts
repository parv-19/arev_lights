import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { requireAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const visibleOnly = searchParams.get("visible") === "true";
    const filter = visibleOnly ? { isVisible: true } : {};
    const testimonials = await Testimonial.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    console.error("[TESTIMONIALS_GET]", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const unauthorized = await requireAdminSession();
    if (unauthorized) return unauthorized;

    await dbConnect();
    const body = await req.json();
    if (!body.clientName || !body.reviewText) {
      return NextResponse.json({ success: false, message: "Name and review required" }, { status: 400 });
    }
    const testimonial = await Testimonial.create(body);
    revalidatePath("/");
    return NextResponse.json({ success: true, data: testimonial }, { status: 201 });
  } catch (error) {
    console.error("[TESTIMONIALS_POST]", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}
