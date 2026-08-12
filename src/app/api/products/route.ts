import { NextResponse } from "next/server";
import { getProducts } from "@/lib/services";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const searchQuery = searchParams.get("q");
    const isFeatured = searchParams.get("featured") === "true";
    const sortBy = searchParams.get("sort");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;

    const products = await getProducts({
      categorySlug,
      searchQuery,
      isFeatured,
      sortBy: sortBy || undefined,
      limit,
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("API /api/products error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}
