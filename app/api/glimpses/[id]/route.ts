import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Glimpse from "@/models/Glimpse";
import { requireAdminSession } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unauthorized = await requireAdminSession();
    if (unauthorized) return unauthorized;

    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const glimpse = await Glimpse.findByIdAndUpdate(id, body, { new: true });
    if (!glimpse) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: glimpse });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unauthorized = await requireAdminSession();
    if (unauthorized) return unauthorized;

    await dbConnect();
    const { id } = await params;
    await Glimpse.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
