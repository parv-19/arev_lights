import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Brand from "@/models/Brand";
import { requireAdminSession } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unauthorized = await requireAdminSession();
    if (unauthorized) return unauthorized;

    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const brand = await Brand.findByIdAndUpdate(id, body, { new: true });
    if (!brand) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: brand });
  } catch (error) {
    console.error("[BRAND_PUT]", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unauthorized = await requireAdminSession();
    if (unauthorized) return unauthorized;

    await dbConnect();
    const { id } = await params;
    const brand = await Brand.findById(id);
    if (!brand) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    if (brand.logo?.publicId) await deleteFromCloudinary(brand.logo.publicId);
    await Brand.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error("[BRAND_DELETE]", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}
