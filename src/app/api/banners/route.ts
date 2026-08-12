import { NextResponse } from "next/server";
import { getBanners } from "@/lib/services";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position") || "HERO";

    const banners = await getBanners(position);
    return NextResponse.json({ success: true, banners });
  } catch (error) {
    console.error("API /api/banners error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch banners" }, { status: 500 });
  }
}
