import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

// Inline schema – no separate model file needed for a simple leads store
const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: "" },
    brochureTitle: { type: String, trim: true, default: "" },
    source: { type: String, default: "brochure" },
  },
  { timestamps: true }
);

const Lead =
  (mongoose.models.Lead as mongoose.Model<any>) ||
  mongoose.model("Lead", leadSchema);

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, phone, email, brochureTitle } = body;

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { success: false, message: "Name and phone are required." },
        { status: 400 }
      );
    }

    await Lead.create({ name: name.trim(), phone: phone.trim(), email: email?.trim() || "", brochureTitle: brochureTitle?.trim() || "", source: "brochure" });

    return NextResponse.json({ success: true, message: "Lead saved." });
  } catch (err) {
    console.error("[/api/leads] Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const leads = await Lead.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: leads });
  } catch {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
