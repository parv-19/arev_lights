import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "arev-lights";
    const resourceType = (formData.get("resourceType") as "image" | "raw" | "auto") || "image";

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

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
