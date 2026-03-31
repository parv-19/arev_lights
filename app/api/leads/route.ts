import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";
import { requireAdminSession } from "@/lib/auth";
import { z } from "zod";
import { checkRateLimit, enforceContentLength, sanitizeUnknown } from "@/lib/security";

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

const leadInputSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().trim().min(7).max(30),
  email: z.string().email().max(160).optional().or(z.literal("")),
  brochureTitle: z.string().max(200).optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  try {
    const rateLimited = checkRateLimit(req, "public-leads", 8);
    if (rateLimited) return rateLimited;

    const oversized = enforceContentLength(req);
    if (oversized) return oversized;

    await dbConnect();
    const parsed = leadInputSchema.safeParse(sanitizeUnknown(await req.json()));
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Name and phone are required." },
        { status: 400 }
      );
    }

    const { name, phone, email, brochureTitle } = parsed.data;
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
    const unauthorized = await requireAdminSession();
    if (unauthorized) return unauthorized;

    await dbConnect();
    const leads = await Lead.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: leads });
  } catch {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
