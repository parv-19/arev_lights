import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const t = await Testimonial.findByIdAndUpdate(id, body, { new: true });
    if (!t) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: t });
  } catch (error) {
    console.error("[TESTIMONIAL_PUT]", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const t = await Testimonial.findById(id);
    if (!t) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    if (t.image?.publicId) await deleteFromCloudinary(t.image.publicId);
    await Testimonial.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error("[TESTIMONIAL_DELETE]", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}
