import { Product } from "@/lib/mockData";

export function mapPrismaProductToFrontend(p: any): Product {
  const images = (p.images && p.images.length > 0)
    ? p.images.map((img: any) => ({
        id: img.id,
        productId: img.productId,
        imageUrl: img.imageUrl,
        altText: img.altText || p.name,
        isPrimary: img.isPrimary,
      }))
    : [{
        id: `img-${p.id}`,
        productId: p.id,
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
        isPrimary: true,
      }];

  const variants = (p.variants && p.variants.length > 0)
    ? p.variants.map((v: any) => ({
        id: v.id,
        productId: v.productId,
        sku: v.sku,
        price: v.price,
        stock: v.stock,
        imageUrl: v.imageUrl || undefined,
        selectedOptions: v.options?.map((o: any) => ({
          id: o.attributeValue?.id || o.id,
          attributeId: o.attributeValue?.attributeId || "",
          attributeName: o.attributeValue?.attributeName || "Option",
          value: o.attributeValue?.value || "",
          meta: o.attributeValue?.meta || "",
        })) || [],
      }))
    : [{
        id: `var-${p.id}`,
        productId: p.id,
        sku: p.sku || `SKU-${p.id.slice(0, 8)}`,
        price: p.salePrice || p.basePrice,
        stock: p.stock ?? 10,
        selectedOptions: [],
      }];

  const category = p.category
    ? {
        id: p.category.id,
        name: p.category.name,
        slug: p.category.slug,
        description: p.category.description || undefined,
        imageUrl: p.category.imageUrl || undefined,
      }
    : {
        id: p.categoryId || "general",
        name: "General",
        slug: "general",
      };

  const brand = p.brand
    ? {
        id: p.brand.id,
        name: p.brand.name,
        slug: p.brand.slug,
        logoUrl: p.brand.logoUrl || undefined,
        description: p.brand.description || undefined,
      }
    : undefined;

  const reviews = p.reviews?.map((r: any) => ({
    id: r.id,
    userName: r.user?.name || "Customer",
    rating: r.rating,
    date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("bn-BD") : "আজকে",
    comment: r.comment || "",
    verified: true,
  })) || [];

  return {
    id: p.id,
    name: p.name,
    nameEn: p.nameEn || undefined,
    slug: p.slug,
    description: p.description || "",
    shortDescription: p.shortDescription || undefined,
    basePrice: p.basePrice,
    salePrice: p.salePrice || undefined,
    costPrice: p.costPrice || undefined,
    sku: p.sku || "",
    stock: p.stock ?? 0,
    lowStockThreshold: p.lowStockThreshold || undefined,
    status: p.status || "ACTIVE",
    averageRating: p.averageRating || 5.0,
    reviewsCount: p.reviewsCount || reviews.length,
    isFeatured: p.isFeatured ?? true,
    isBestSeller: p.isBestSeller ?? false,
    isNewArrival: p.isNewArrival ?? true,
    isFlashSale: p.isFlashSale ?? false,
    categoryId: p.categoryId || category.id,
    brandId: p.brandId || undefined,
    category,
    brand,
    images,
    variants,
    reviews: reviews.length > 0 ? reviews : undefined,
  };
}
