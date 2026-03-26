import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SeoMetadata from "@/models/SeoMetadata";
import { requireAdminSession } from "@/lib/auth";

const DEFAULT_PAGES = [
  { pageKey: "home", pageLabel: "Home Page", title: "AREV Lights – Premium Lighting Solutions", description: "Discover AREV Lights, your trusted partner for premium architectural and decorative lighting solutions." },
  { pageKey: "about", pageLabel: "About Page", title: "About AREV Lights", description: "Learn about our journey, mission, and commitment to premium lighting excellence." },
  { pageKey: "products", pageLabel: "Products Page", title: "Products – AREV Lights", description: "Browse our complete range of premium lighting products." },
  { pageKey: "projects", pageLabel: "Projects Page", title: "Projects & Gallery – AREV Lights", description: "Explore our completed lighting installation projects across India." },
  { pageKey: "brochures", pageLabel: "Brochures Page", title: "Brochures – AREV Lights", description: "Download our product brochures and catalogs." },
  { pageKey: "brands", pageLabel: "Brands Page", title: "Our Brands – AREV Lights", description: "Explore the premium lighting brands we carry." },
  { pageKey: "contact", pageLabel: "Contact Page", title: "Contact AREV Lights", description: "Get in touch with our team for inquiries, quotes, and support." },
];

export async function GET() {
  try {
    const unauthorized = await requireAdminSession();
    if (unauthorized) return unauthorized;

    await dbConnect();
    const existing = await SeoMetadata.find({});

    for (const page of DEFAULT_PAGES) {
      const found = existing.find((e) => e.pageKey === page.pageKey);
      if (!found) {
        await SeoMetadata.create(page);
      }
    }

    const seoPages = await SeoMetadata.find({}).sort({ pageKey: 1 });
    return NextResponse.json({ success: true, data: seoPages });
  } catch (error) {
    console.error("[SEO_GET]", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const unauthorized = await requireAdminSession();
    if (unauthorized) return unauthorized;

    await dbConnect();
    const body = await req.json();

    const updated = await SeoMetadata.findOneAndUpdate(
      { pageKey: body.pageKey },
      { $set: body },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[SEO_PUT]", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}
