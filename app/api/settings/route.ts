import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

export async function GET() {
  try {
    await dbConnect();
    let settings = await SiteSettings.findOne({});
    if (!settings) {
      settings = await SiteSettings.create({
        address: "AREV Lights, India",
        phones: [],
        emails: [],
        whatsappNumber: "",
        footerTagline: "Illuminating Spaces, Inspiring Lives.",
        showNavbar: true,
        showWhyArev: true,
        showProjects: true,
      });
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("[SETTINGS_GET]", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const settings = await SiteSettings.findOneAndUpdate({}, { $set: body }, { new: true, upsert: true });
    
    // Purge caches immediately so UI reflects toggles
    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("[SETTINGS_PUT]", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}
