import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { requireAdminSession } from "@/lib/auth";
import { enforceContentLength, enforceUploadSize, sanitizeString } from "@/lib/security";

const ALLOWED_RESOURCE_TYPES = new Set(["image", "raw", "auto"]);

export async function POST(req: NextRequest) {
  try {
    const unauthorized = await requireAdminSession();
    if (unauthorized) return unauthorized;

    const oversized = enforceContentLength(req, 8 * 1024 * 1024);
    if (oversized) return oversized;

    await dbConnect();
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = sanitizeString((formData.get("folder") as string) || "arev-lights");
    const requestedType = sanitizeString((formData.get("resourceType") as string) || "image");
    const resourceType = ALLOWED_RESOURCE_TYPES.has(requestedType)
      ? (requestedType as "image" | "raw" | "auto")
      : "image";

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    if (!file.type || (!file.type.startsWith("image/") && resourceType === "image")) {
      return NextResponse.json({ success: false, message: "Unsupported file type" }, { status: 400 });
    }

    const uploadTooLarge = enforceUploadSize(file.size);
    if (uploadTooLarge) return uploadTooLarge;

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await uploadToCloudinary(dataUri, folder, resourceType);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[UPLOAD_API]", error);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}
