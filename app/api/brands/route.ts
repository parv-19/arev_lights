import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Brand from "@/models/Brand";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active") === "true";
    const filter = activeOnly ? { isActive: true } : {};
    const brands = await Brand.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: brands });
  } catch (error) {
    console.error("[BRANDS_GET]", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    if (!body.name) return NextResponse.json({ success: false, message: "Name required" }, { status: 400 });
    const brand = await Brand.create(body);
    return NextResponse.json({ success: true, data: brand }, { status: 201 });
  } catch (error) {
    console.error("[BRANDS_POST]", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}
