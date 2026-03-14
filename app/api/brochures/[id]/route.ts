import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Brochure from "@/models/Brochure";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const brochure = await Brochure.findById(id).populate("category", "name slug");
    if (!brochure) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: brochure });
  } catch (error) {
    console.error("[BROCHURE_GET]", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const brochure = await Brochure.findByIdAndUpdate(id, body, { new: true });
    if (!brochure) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: brochure });
  } catch (error) {
    console.error("[BROCHURE_PUT]", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const brochure = await Brochure.findById(id);
    if (!brochure) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    if (brochure.pdfPublicId) await deleteFromCloudinary(brochure.pdfPublicId, "raw");
    if (brochure.previewImage?.publicId) await deleteFromCloudinary(brochure.previewImage.publicId);

    await Brochure.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error("[BROCHURE_DELETE]", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}
