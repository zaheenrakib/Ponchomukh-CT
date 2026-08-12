import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ProductStatus } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      basePrice,
      salePrice,
      sku,
      stock,
      categoryId,
      brandId,
      imageUrl,
    } = body;

    if (!name || !description || !basePrice || !sku || !categoryId) {
      return NextResponse.json({ success: false, error: "Required fields are missing." }, { status: 400 });
    }

    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug: `${finalSlug}-${Date.now().toString().slice(-4)}`,
        description,
        basePrice: parseFloat(basePrice),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        sku,
        stock: parseInt(stock || "10", 10),
        status: ProductStatus.ACTIVE,
        categoryId,
        brandId: brandId || null,
        images: {
          create: {
            imageUrl: imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
            isPrimary: true,
          },
        },
        variants: {
          create: {
            sku: `${sku}-DEF`,
            price: salePrice ? parseFloat(salePrice) : parseFloat(basePrice),
            stock: parseInt(stock || "10", 10),
          },
        },
      },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("API /api/admin/products POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to create product." }, { status: 500 });
  }
}
