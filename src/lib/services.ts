import { prisma } from "@/lib/db";
import { ProductStatus } from "@prisma/client";

export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    return settingsMap;
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
    return {};
  }
}

export async function getBanners(position: string = "HERO") {
  try {
    return await prisma.banner.findMany({
      where: {
        position,
        isActive: true,
      },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error(`Failed to fetch banners for position ${position}:`, error);
    return [];
  }
}

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function getBrands() {
  try {
    return await prisma.brand.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return [];
  }
}

export async function getProducts(params?: {
  categorySlug?: string | null;
  searchQuery?: string | null;
  isFeatured?: boolean;
  limit?: number;
  sortBy?: string;
}) {
  try {
    const whereClause: Record<string, unknown> = {
      status: ProductStatus.ACTIVE,
      deletedAt: null,
    };

    if (params?.isFeatured) {
      whereClause.isFeatured = true;
    }

    if (params?.categorySlug) {
      whereClause.category = {
        slug: params.categorySlug,
      };
    }

    if (params?.searchQuery) {
      const q = params.searchQuery.trim();
      whereClause.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { sku: { contains: q, mode: "insensitive" } },
      ];
    }

    let orderByClause: Record<string, string> = { createdAt: "desc" };
    if (params?.sortBy === "price_asc") {
      orderByClause = { basePrice: "asc" };
    } else if (params?.sortBy === "price_desc") {
      orderByClause = { basePrice: "desc" };
    } else if (params?.sortBy === "rating") {
      orderByClause = { averageRating: "desc" };
    }

    return await prisma.product.findMany({
      where: whereClause,
      take: params?.limit || 40,
      orderBy: orderByClause,
      include: {
        category: true,
        brand: true,
        images: true,
        variants: {
          include: {
            options: {
              include: { attributeValue: true },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        images: true,
        variants: {
          include: {
            options: {
              include: { attributeValue: true },
            },
          },
        },
        reviews: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } catch (error) {
    console.error(`Failed to fetch product for slug ${slug}:`, error);
    return null;
  }
}

export async function getCollections() {
  try {
    return await prisma.collection.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        products: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch collections:", error);
    return [];
  }
}
