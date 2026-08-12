import { PrismaClient, UserRole, ProductStatus, AttributeType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Ponchomukh database seeding...");

  // 1. Seed Site Settings
  const defaultSettings = [
    { key: "announcement_text", value: "🚚 সারা বাংলাদেশে হোম ডেলিভারি | Cash on Delivery Available", group: "HEADER" },
    { key: "announcement_enabled", value: "true", group: "HEADER" },
    { key: "delivery_inside_dhaka", value: "60", group: "DELIVERY" },
    { key: "delivery_outside_dhaka", value: "120", group: "DELIVERY" },
    { key: "contact_phone", value: "+880 1700-000000", group: "GENERAL" },
    { key: "contact_email", value: "support@ponchomukh.com", group: "GENERAL" },
    { key: "contact_address", value: "Dhaka, Bangladesh", group: "GENERAL" },
    { key: "social_facebook", value: "https://facebook.com/ponchomukh", group: "SOCIAL" },
    { key: "social_instagram", value: "https://instagram.com/ponchomukh", group: "SOCIAL" },
    { key: "social_whatsapp", value: "https://wa.me/8801700000000", group: "SOCIAL" },
  ];

  for (const setting of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, group: setting.group },
      create: setting,
    });
  }
  console.log("Site settings seeded.");

  // 2. Seed Default Super Admin User
  const adminEmail = "admin@ponchomukh.com";
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: UserRole.SUPER_ADMIN, name: "Zaheen Rakib" },
    create: {
      email: adminEmail,
      name: "Zaheen Rakib",
      phoneNumber: "+8801700000000",
      passwordHash: "admin123456", // In production, bcrypt hash should be used
      role: UserRole.SUPER_ADMIN,
    },
  });
  console.log(`Default Super Admin seeded: ${adminUser.email}`);

  // 3. Seed Categories
  const categoriesData = [
    { name: "T-Shirt", slug: "t-shirt", description: "Men and women casual t-shirts" },
    { name: "Jacket", slug: "jacket", description: "Winter jackets and windbreakers" },
    { name: "Shirt", slug: "shirt", description: "Formal and casual shirts" },
    { name: "Jeans", slug: "jeans", description: "Denim jeans and trousers" },
    { name: "Bag", slug: "bag", description: "Backpacks, totes, and camera bags" },
    { name: "Shoes", slug: "shoes", description: "Sneakers, dress shoes, and heels" },
    { name: "Watches", slug: "watches", description: "Analog and smartwatch collection" },
    { name: "Cap", slug: "cap", description: "Hats, caps, and fedoras" },
    { name: "Gadgets", slug: "gadgets", description: "Smart gadgets and electronics" },
    { name: "Home & Kitchen", slug: "home-kitchen", description: "Home appliances and kitchenware" },
    { name: "Travel Accessories", slug: "travel-accessories", description: "Luggage, organizers, and travel kits" },
    { name: "Lifestyle", slug: "lifestyle", description: "Everyday lifestyle products" },
  ];

  const categoryMap: Record<string, string> = {};

  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
    categoryMap[cat.slug] = createdCat.id;
  }
  console.log("Categories seeded.");

  // 4. Seed Brands
  const brandsData = [
    { name: "EliteShield", slug: "eliteshield" },
    { name: "Gentlemen's Co", slug: "gentlemens-co" },
    { name: "OptiZoom", slug: "optizoom" },
    { name: "Cloudy Chic", slug: "cloudy-chic" },
    { name: "UrbanEdge", slug: "urbanedge" },
    { name: "StyleHaven", slug: "stylehaven" },
    { name: "ClassicGent", slug: "classicgent" },
    { name: "Sonifer", slug: "sonifer" },
  ];

  const brandMap: Record<string, string> = {};

  for (const b of brandsData) {
    const createdBrand = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name },
      create: b,
    });
    brandMap[b.slug] = createdBrand.id;
  }
  console.log("Brands seeded.");

  // 5. Seed Banners
  const bannersData = [
    {
      title: "আপনার পছন্দের পণ্য, এখন এক ঠিকানায়।",
      subtitle: "দৈনন্দিন জীবনের প্রয়োজনীয় পণ্য নির্বাচন করুন পঞ্চমুখ থেকে।",
      imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&auto=format&fit=crop&q=80",
      buttonText: "Shop Now",
      buttonUrl: "/#products-section",
      position: "HERO",
      sortOrder: 1,
      isActive: true,
    },
    {
      title: "Limited Time Offer! Up to 50% OFF!",
      subtitle: "Redefine Your Everyday Style with Ponchomukh",
      imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop&q=80",
      buttonText: "Explore Collection",
      buttonUrl: "/shop",
      position: "HERO",
      sortOrder: 2,
      isActive: true,
    },
    {
      title: "Upgrade Your Everyday Life",
      subtitle: "Premium products at affordable prices.",
      imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&auto=format&fit=crop&q=80",
      buttonText: "Shop Sale",
      buttonUrl: "/shop",
      position: "PROMOTIONAL",
      sortOrder: 1,
      isActive: true,
    },
  ];

  for (const b of bannersData) {
    await prisma.banner.create({
      data: b,
    });
  }
  console.log("Banners seeded.");

  // 6. Seed Sample Products
  const productsData = [
    {
      name: "EliteShield Performance Men's Jackets",
      slug: "eliteshield-performance-mens-jackets",
      description: "Premium windbreaker and weather shielding outdoor active jacket designed for men. Features water resistant fabrics and lightweight mesh liners.",
      shortDescription: "Water resistant active windbreaker jacket",
      basePrice: 330.00,
      salePrice: 255.00,
      sku: "ES-PMJ-01",
      stock: 25,
      status: ProductStatus.ACTIVE,
      averageRating: 4.8,
      reviewsCount: 120,
      isFeatured: true,
      categoryId: categoryMap["jacket"],
      brandId: brandMap["eliteshield"],
      imageUrl: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&auto=format&fit=crop&q=80",
    },
    {
      name: "Gentlemen's Summer Gray Hat - Premium Blend",
      slug: "gentlemens-summer-gray-hat",
      description: "Exquisite warm weather gray fedora hat. Designed with high-breathability organic cotton and linen fiber blend.",
      shortDescription: "Organic cotton fedora hat",
      basePrice: 150.00,
      salePrice: 99.00,
      sku: "GC-SGH-02",
      stock: 30,
      status: ProductStatus.ACTIVE,
      averageRating: 4.7,
      reviewsCount: 95,
      isFeatured: true,
      categoryId: categoryMap["cap"],
      brandId: brandMap["gentlemens-co"],
      imageUrl: "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600&auto=format&fit=crop&q=80",
    },
    {
      name: "OptiZoom Camera Shoulder Bag",
      slug: "optizoom-camera-shoulder-bag",
      description: "Shockproof heavy padding DSLR and mirrorless camera courier carry case. Features multiple accessory chambers and quick lock buckles.",
      shortDescription: "Shockproof DSLR camera courier bag",
      basePrice: 320.00,
      salePrice: 250.00,
      sku: "OZ-CSB-03",
      stock: 18,
      status: ProductStatus.ACTIVE,
      averageRating: 4.9,
      reviewsCount: 110,
      isFeatured: true,
      categoryId: categoryMap["bag"],
      brandId: brandMap["optizoom"],
      imageUrl: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop&q=80",
    },
    {
      name: "UrbanEdge Men's Jeans Collection",
      slug: "urbanedge-mens-jeans-collection",
      description: "Premium comfort-stretch raw indigo denim jeans. Tapered fit with double stitched rivets for lasting daily wear.",
      shortDescription: "Tapered raw indigo denim jeans",
      basePrice: 370.00,
      salePrice: 253.00,
      sku: "UE-MJ-01",
      stock: 40,
      status: ProductStatus.ACTIVE,
      averageRating: 4.9,
      reviewsCount: 1240,
      isFeatured: false,
      categoryId: categoryMap["jeans"],
      brandId: brandMap["urbanedge"],
      imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
    },
    {
      name: "Essentials Men's Long-Sleeve Oxford Shirt",
      slug: "essentials-mens-oxford-shirt",
      description: "Crisp 100% long-staple cotton checkered and solid oxford button downs. Structured collar and clean adjustable barrel cuffs.",
      shortDescription: "Long staple cotton oxford shirt",
      basePrice: 179.00,
      salePrice: 159.00,
      sku: "ES-OS-02",
      stock: 50,
      status: ProductStatus.ACTIVE,
      averageRating: 4.8,
      reviewsCount: 950,
      isFeatured: false,
      categoryId: categoryMap["shirt"],
      brandId: brandMap["gentlemens-co"],
      imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
    },
    {
      name: "Portable Mini Electric Blender 350ml",
      slug: "portable-mini-electric-blender-350ml",
      description: "Sonifer 350ml portable USB rechargeable blender for smoothies, juices, and baby food. Powerful 150W motor and stainless steel blades.",
      shortDescription: "Portable USB rechargeable blender 350ml",
      basePrice: 180.00,
      salePrice: 129.00,
      sku: "SNF-PMB-01",
      stock: 35,
      status: ProductStatus.ACTIVE,
      averageRating: 4.8,
      reviewsCount: 430,
      isFeatured: true,
      categoryId: categoryMap["home-kitchen"],
      brandId: brandMap["sonifer"],
      imageUrl: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&auto=format&fit=crop&q=80",
    },
  ];

  for (const prod of productsData) {
    const { imageUrl, ...prodFields } = prod;
    const existing = await prisma.product.findUnique({ where: { slug: prod.slug } });
    
    if (!existing) {
      const createdProd = await prisma.product.create({
        data: prodFields,
      });

      // Primary Product Image
      await prisma.productImage.create({
        data: {
          productId: createdProd.id,
          imageUrl: imageUrl,
          isPrimary: true,
          sortOrder: 0,
        },
      });

      // Default Variant
      await prisma.productVariant.create({
        data: {
          productId: createdProd.id,
          sku: `${prod.sku}-DEFAULT`,
          price: prod.salePrice || prod.basePrice,
          stock: prod.stock,
          imageUrl: imageUrl,
        },
      });
    }
  }

  console.log("Sample products and variants seeded.");
  console.log("Ponchomukh database seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
