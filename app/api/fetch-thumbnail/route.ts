import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ success: false, message: "URL is required" }, { status: 400 });

    // Handle YouTube specially to avoid scraping
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return NextResponse.json({ success: true, url: `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg` });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) throw new Error("Failed to fetch URL");

    const html = await response.text();
    const ogImageMatch = html.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i);
    const ogImageMatch2 = html.match(/<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:image["']/i);

    let thumbnailUrl = "";
    if (ogImageMatch && ogImageMatch[1]) {
      thumbnailUrl = ogImageMatch[1];
    } else if (ogImageMatch2 && ogImageMatch2[1]) {
      thumbnailUrl = ogImageMatch2[1];
    }

    // Attempt to parse out HTML entities just in case
    thumbnailUrl = thumbnailUrl.replace(/&amp;/g, "&");

    if (!thumbnailUrl) {
      return NextResponse.json({ success: false, message: "Thumbnail not found natively. You may need to manually upload one." });
    }

    return NextResponse.json({ success: true, url: thumbnailUrl });
  } catch (error) {
    console.error("[FETCH_THUMBNAIL]", error);
    return NextResponse.json({ success: false, message: "Failed to fetch thumbnail automatically" }, { status: 500 });
  }
}
