import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/services";
import { mapPrismaProductToFrontend } from "@/lib/product-mapper";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ success: false, error: "Slug is required" }, { status: 400 });
    }

    const dbProduct = await getProductBySlug(slug);
    if (!dbProduct) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const mapped = mapPrismaProductToFrontend(dbProduct);
    return NextResponse.json({ success: true, product: mapped });
  } catch (error) {
    console.error("API /api/products/[slug] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 });
  }
}
