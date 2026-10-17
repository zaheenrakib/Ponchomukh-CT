import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ProductStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const products = await prisma.product.findMany({
      where: {
        deletedAt: null,
        ...(category && category !== "ALL" ? { category: { slug: category } } : {}),
        ...(search ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { sku: { contains: search, mode: "insensitive" } },
          ],
        } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        brand: true,
        images: true,
        variants: true,
      },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("API /api/admin/products GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products." }, { status: 500 });
  }
}

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

    if (!name || !description || !basePrice || !sku) {
      return NextResponse.json({ success: false, error: "Required fields are missing." }, { status: 400 });
    }

    // Resolve or fallback category
    let resolvedCategoryId = categoryId;
    if (!resolvedCategoryId) {
      const firstCat = await prisma.category.findFirst();
      resolvedCategoryId = firstCat?.id;
    }

    if (!resolvedCategoryId) {
      return NextResponse.json({ success: false, error: "Valid category is required." }, { status: 400 });
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
        categoryId: resolvedCategoryId,
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
      include: {
        category: true,
        brand: true,
        images: true,
        variants: true,
      },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("API /api/admin/products POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to create product." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, name, basePrice, salePrice, stock, description } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required." }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(basePrice ? { basePrice: parseFloat(basePrice) } : {}),
        ...(salePrice !== undefined ? { salePrice: salePrice ? parseFloat(salePrice) : null } : {}),
        ...(stock !== undefined ? { stock: parseInt(stock, 10) } : {}),
        ...(description ? { description } : {}),
      },
      include: {
        category: true,
        brand: true,
        images: true,
        variants: true,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("API /api/admin/products PATCH error:", error);
    return NextResponse.json({ success: false, error: "Failed to update product." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required." }, { status: 400 });
    }

    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date(), status: ProductStatus.ARCHIVED },
    });

    return NextResponse.json({ success: true, message: "Product archived successfully." });
  } catch (error) {
    console.error("API /api/admin/products DELETE error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete product." }, { status: 500 });
  }
}
