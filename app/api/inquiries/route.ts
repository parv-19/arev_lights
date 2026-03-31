import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import { requireAdminSession } from "@/lib/auth";
import { z } from "zod";
import { checkRateLimit, enforceContentLength, escapeRegex, sanitizeUnknown } from "@/lib/security";

const inquirySchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().trim().min(7).max(30).optional().or(z.literal("")),
  company: z.string().max(160).optional().or(z.literal("")),
  message: z.string().min(10).max(5000),
  type: z.enum(["general", "dealer", "product"]).default("general"),
  productRef: z.string().trim().optional(),
  city: z.string().max(120).optional().or(z.literal("")),
  state: z.string().max(120).optional().or(z.literal("")),
  businessType: z.string().max(120).optional().or(z.literal("")),
});

export async function GET(req: NextRequest) {
  try {
    const unauthorized = await requireAdminSession();
    if (unauthorized) return unauthorized;

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (search) {
      const safeSearch = escapeRegex(search.trim());
      filter.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { email: { $regex: safeSearch, $options: "i" } },
        { phone: { $regex: safeSearch, $options: "i" } },
        { company: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const total = await Inquiry.countDocuments(filter);
    const inquiries = await Inquiry.find(filter)
      .populate("productRef", "title slug")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: inquiries,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[INQUIRIES_GET]", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateLimited = checkRateLimit(req, "public-inquiries", 10);
    if (rateLimited) return rateLimited;

    const oversized = enforceContentLength(req);
    if (oversized) return oversized;

    await dbConnect();
    const parsed = inquirySchema.safeParse(sanitizeUnknown(await req.json()));

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Please submit valid inquiry details." }, { status: 400 });
    }

    const inquiry = await Inquiry.create(parsed.data);
    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch (error) {
    console.error("[INQUIRIES_POST]", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}
