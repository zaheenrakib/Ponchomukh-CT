import { NextResponse } from "next/server";
import { getBanners } from "@/lib/services";
import { mockBanners } from "@/lib/mockData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position") || "HERO";

    let banners = await getBanners(position);

    if (!banners || banners.length === 0) {
      banners = mockBanners.filter((b) => b.position === position && b.isActive !== false) as any;
    }

    return NextResponse.json({ success: true, banners });
  } catch (error) {
    console.error("API /api/banners error:", error);
    // Graceful fallback on error
    const fallback = mockBanners.filter((b) => b.position === "HERO");
    return NextResponse.json({ success: true, banners: fallback });
  }
}
