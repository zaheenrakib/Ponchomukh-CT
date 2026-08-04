export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  iconName?: string; // To render Lucide icon dynamically
}

export interface AttributeValue {
  id: string;
  attributeId: string;
  attributeName: string;
  value: string;
  meta?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  price: number;
  stock: number;
  imageUrl?: string;
  selectedOptions: AttributeValue[];
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  altText?: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  basePrice: number;
  salePrice?: number;
  sku: string;
  stock: number;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  averageRating: number;
  reviewsCount: number;
  isFeatured: boolean;
  categoryId: string;
  brandId?: string;
  
  // Flash Sale helpers
  isFlashSale?: boolean;
  soldCount?: number;
  limitCount?: number;
  soldPercent?: number;

  // Relations
  category: Category;
  brand?: Brand;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface StoreProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export interface Store {
  id: string;
  name: string;
  tagline: string;
  logoUrl: string;
  isVerified: boolean;
  products: StoreProduct[];
}

// Mock Categories - matching the circle grid in the image
export const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "T-Shirt",
    slug: "t-shirt",
    iconName: "Shirt"
  },
  {
    id: "cat-2",
    name: "Jacket",
    slug: "jacket",
    iconName: "Flame" // Or custom rendering representation
  },
  {
    id: "cat-3",
    name: "Shirt",
    slug: "shirt",
    iconName: "Briefcase"
  },
  {
    id: "cat-4",
    name: "Jeans",
    slug: "jeans",
    iconName: "Scissors"
  },
  {
    id: "cat-5",
    name: "Bag",
    slug: "bag",
    iconName: "ShoppingBag"
  },
  {
    id: "cat-6",
    name: "Shoes",
    slug: "shoes",
    iconName: "Footprints"
  },
  {
    id: "cat-7",
    name: "Watches",
    slug: "watches",
    iconName: "Watch"
  },
  {
    id: "cat-8",
    name: "Cap",
    slug: "cap",
    iconName: "Crown"
  }
];

// Mock Brands
export const mockBrands: Brand[] = [
  { id: "brand-1", name: "EliteShield", slug: "eliteshield" },
  { id: "brand-2", name: "Gentlemen's Co", slug: "gentlemens-co" },
  { id: "brand-3", name: "OptiZoom", slug: "optizoom" },
  { id: "brand-4", name: "Cloudy Chic", slug: "cloudy-chic" },
  { id: "brand-5", name: "UrbanEdge", slug: "urbanedge" },
  { id: "brand-6", name: "StyleHaven", slug: "stylehaven" },
  { id: "brand-7", name: "ClassicGent", slug: "classicgent" },
  { id: "brand-8", name: "UrbanFlex", slug: "urbanflex" },
  { id: "brand-9", name: "ChicCarry", slug: "chiccarry" },
  { id: "brand-10", name: "Sophisticated", slug: "sophisticated" }
];

// Mock Products - matching screenshot images and pricing details
export const mockProducts: Product[] = [
  // --- FLASH SALE ITEMS ---
  {
    id: "fs-1",
    name: "EliteShield Performance Men's Jackets",
    slug: "eliteshield-performance-mens-jackets",
    description: "Premium windbreaker and weather shielding outdoor active jacket designed for men. Features water resistant fabrics and lightweight mesh liners.",
    basePrice: 330000,
    salePrice: 255000,
    sku: "ES-PMJ-01",
    stock: 10,
    status: "ACTIVE",
    averageRating: 4.8,
    reviewsCount: 120,
    isFeatured: true,
    categoryId: "cat-2", // Jacket
    brandId: "brand-1",
    isFlashSale: true,
    soldCount: 5,
    limitCount: 10,
    soldPercent: 50,
    category: mockCategories[1],
    brand: mockBrands[0],
    images: [
      { id: "img-fs-1-1", productId: "fs-1", imageUrl: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-fs-1-1",
        productId: "fs-1",
        sku: "ES-PMJ-01-BLK",
        price: 255000,
        stock: 5,
        selectedOptions: [{ id: "val-c-blk", attributeId: "attr-color", attributeName: "Color", value: "Matte Black", meta: "#111111" }]
      }
    ]
  },
  {
    id: "fs-2",
    name: "Gentlemen's Summer Gray Hat - Premium Blend",
    slug: "gentlemens-summer-gray-hat",
    description: "Exquisite warm weather gray fedora hat. Designed with high-breathability organic cotton and linen fiber blend.",
    basePrice: 150000,
    salePrice: 99000,
    sku: "GC-SGH-02",
    stock: 10,
    status: "ACTIVE",
    averageRating: 4.7,
    reviewsCount: 95,
    isFeatured: true,
    categoryId: "cat-8", // Cap
    brandId: "brand-2",
    isFlashSale: true,
    soldCount: 3,
    limitCount: 10,
    soldPercent: 30,
    category: mockCategories[7],
    brand: mockBrands[1],
    images: [
      { id: "img-fs-2-1", productId: "fs-2", imageUrl: "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=500&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-fs-2-1",
        productId: "fs-2",
        sku: "GC-SGH-02-GRY",
        price: 99000,
        stock: 7,
        selectedOptions: [{ id: "val-c-gry", attributeId: "attr-color", attributeName: "Color", value: "Summer Gray", meta: "#8E8E8E" }]
      }
    ]
  },
  {
    id: "fs-3",
    name: "OptiZoom Camera Shoulder Bag",
    slug: "optizoom-camera-shoulder-bag",
    description: "Shockproof heavy padding DSLR and mirrorless camera courier carry case. Features multiple accessory chambers and quick lock buckles.",
    basePrice: 320000,
    salePrice: 250000,
    sku: "OZ-CSB-03",
    stock: 10,
    status: "ACTIVE",
    averageRating: 4.9,
    reviewsCount: 110,
    isFeatured: true,
    categoryId: "cat-5", // Bag
    brandId: "brand-3",
    isFlashSale: true,
    soldCount: 2,
    limitCount: 10,
    soldPercent: 20,
    category: mockCategories[4],
    brand: mockBrands[2],
    images: [
      { id: "img-fs-3-1", productId: "fs-3", imageUrl: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-fs-3-1",
        productId: "fs-3",
        sku: "OZ-CSB-03-BLK",
        price: 250000,
        stock: 8,
        selectedOptions: [{ id: "val-c-blk", attributeId: "attr-color", attributeName: "Color", value: "Matte Black", meta: "#111111" }]
      }
    ]
  },
  {
    id: "fs-4",
    name: "Cloudy Chic - Grey Peep Toe Heeled Sandals",
    slug: "cloudy-chic-grey-peep-toe-heels",
    description: "Elegantly sculpted grey suede block heels with comfort insoles. Perfect accent for both formal wear and evening cocktail setups.",
    basePrice: 550000,
    salePrice: 270000,
    sku: "CC-GPH-04",
    stock: 10,
    status: "ACTIVE",
    averageRating: 4.6,
    reviewsCount: 75,
    isFeatured: true,
    categoryId: "cat-6", // Shoes
    brandId: "brand-4",
    isFlashSale: true,
    soldCount: 8,
    limitCount: 10,
    soldPercent: 80,
    category: mockCategories[5],
    brand: mockBrands[3],
    images: [
      { id: "img-fs-4-1", productId: "fs-4", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-fs-4-1",
        productId: "fs-4",
        sku: "CC-GPH-04-GRY",
        price: 270000,
        stock: 2,
        selectedOptions: [{ id: "val-c-gry", attributeId: "attr-color", attributeName: "Color", value: "Suede Grey", meta: "#8C8C8C" }]
      }
    ]
  },

  // --- TODAYS FOR YOU ITEMS ---
  {
    id: "tfy-1",
    name: "UrbanEdge Men's Jeans Collection",
    slug: "urbanedge-mens-jeans-collection",
    description: "Premium comfort-stretch raw indigo denim jeans. Tapered fit with double stitched rivets for lasting daily wear.",
    basePrice: 370000,
    salePrice: 253000,
    sku: "UE-MJ-01",
    stock: 35,
    status: "ACTIVE",
    averageRating: 4.9,
    reviewsCount: 1240,
    isFeatured: false,
    categoryId: "cat-4", // Jeans
    brandId: "brand-5",
    category: mockCategories[3],
    brand: mockBrands[4],
    images: [
      { id: "img-tfy-1-1", productId: "tfy-1", imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-tfy-1-1",
        productId: "tfy-1",
        sku: "UE-MJ-01-IND",
        price: 253000,
        stock: 35,
        selectedOptions: [{ id: "val-s-std", attributeId: "attr-size", attributeName: "Size", value: "32W x 32L" }]
      }
    ]
  },
  {
    id: "tfy-2",
    name: "Essentials Men's Long-Sleeve Oxford Shirt",
    slug: "essentials-mens-oxford-shirt",
    description: "Crisp 100% long-staple cotton checkered and solid oxford button downs. Structured collar and clean adjustable barrel cuffs.",
    basePrice: 179000,
    sku: "ES-OS-02",
    stock: 50,
    status: "ACTIVE",
    averageRating: 4.8,
    reviewsCount: 950,
    isFeatured: false,
    categoryId: "cat-3", // Shirt
    brandId: "brand-2",
    category: mockCategories[2],
    brand: mockBrands[1],
    images: [
      { id: "img-tfy-2-1", productId: "tfy-2", imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-tfy-2-1",
        productId: "tfy-2",
        sku: "ES-OS-02-WHT",
        price: 179000,
        stock: 50,
        selectedOptions: [{ id: "val-s-med", attributeId: "attr-size", attributeName: "Size", value: "Medium" }]
      }
    ]
  },
  {
    id: "tfy-3",
    name: "StyleHaven Men's Fashionable Brogues",
    slug: "stylehaven-mens-fashionable-brogues",
    description: "Classic wingtip brogue detailing crafted in top-grain calfskin leather. Comfortable padded soles engineered for all-day office comfort.",
    basePrice: 355000,
    salePrice: 199000,
    sku: "SH-MFB-03",
    stock: 28,
    status: "ACTIVE",
    averageRating: 4.9,
    reviewsCount: 88,
    isFeatured: false,
    categoryId: "cat-6", // Shoes
    brandId: "brand-6",
    category: mockCategories[5],
    brand: mockBrands[5],
    images: [
      { id: "img-tfy-3-1", productId: "tfy-3", imageUrl: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-tfy-3-1",
        productId: "tfy-3",
        sku: "SH-MFB-03-BRN",
        price: 199000,
        stock: 28,
        selectedOptions: [{ id: "val-c-brn", attributeId: "attr-color", attributeName: "Color", value: "Chestnut Brown", meta: "#8B4513" }]
      }
    ]
  },
  {
    id: "tfy-4",
    name: "Essential Long Sleeve Crewneck Shirt for Men",
    slug: "essential-long-sleeve-crewneck",
    description: "Soft combed cotton jersey crewnecks. Lightweight construction makes it an ideal year-round casual layering base.",
    basePrice: 120000,
    sku: "ES-LSC-04",
    stock: 45,
    status: "ACTIVE",
    averageRating: 4.8,
    reviewsCount: 512,
    isFeatured: false,
    categoryId: "cat-1", // T-Shirt
    brandId: "brand-2",
    category: mockCategories[0],
    brand: mockBrands[1],
    images: [
      { id: "img-tfy-4-1", productId: "tfy-4", imageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-tfy-4-1",
        productId: "tfy-4",
        sku: "ES-LSC-04-GRY",
        price: 120000,
        stock: 45,
        selectedOptions: [{ id: "val-s-med", attributeId: "attr-size", attributeName: "Size", value: "Medium" }]
      }
    ]
  },
  {
    id: "tfy-5",
    name: "ClassicGent Men's Formal Shoes",
    slug: "classicgent-mens-formal-shoes",
    description: "Sleek and polished black derby dress shoes. Crafted with hand-finished genuine leather and durable non-slip rubber outsoles.",
    basePrice: 159000,
    sku: "CG-MFS-05",
    stock: 22,
    status: "ACTIVE",
    averageRating: 4.9,
    reviewsCount: 180,
    isFeatured: false,
    categoryId: "cat-6", // Shoes
    brandId: "brand-7",
    category: mockCategories[5],
    brand: mockBrands[6],
    images: [
      { id: "img-tfy-5-1", productId: "tfy-5", imageUrl: "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?w=500&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-tfy-5-1",
        productId: "tfy-5",
        sku: "CG-MFS-05-BLK",
        price: 159000,
        stock: 22,
        selectedOptions: [{ id: "val-c-blk", attributeId: "attr-color", attributeName: "Color", value: "Matte Black", meta: "#111111" }]
      }
    ]
  },
  {
    id: "tfy-6",
    name: "UrbanFlex Men's Short Pants Collection",
    slug: "urbanflex-mens-short-pants",
    description: "Lightweight utility cargo and drawstring shorts. Features heavy duty zipper systems and utility pockets for smart travel accessories.",
    basePrice: 162000,
    sku: "UF-MSP-06",
    stock: 30,
    status: "ACTIVE",
    averageRating: 4.8,
    reviewsCount: 240,
    isFeatured: false,
    categoryId: "cat-4", // Jeans
    brandId: "brand-8",
    category: mockCategories[3],
    brand: mockBrands[7],
    images: [
      { id: "img-tfy-6-1", productId: "tfy-6", imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-tfy-6-1",
        productId: "tfy-6",
        sku: "UF-MSP-06-GRY",
        price: 162000,
        stock: 30,
        selectedOptions: [{ id: "val-s-med", attributeId: "attr-size", attributeName: "Size", value: "Medium" }]
      }
    ]
  },
  {
    id: "tfy-7",
    name: "ChicCarry - Elegant Women's Tote Collection",
    slug: "chiccarry-womens-tote-collection",
    description: "Stately saffiano faux-leather handbags with reinforced handles. Generous space options mapping laptops and cosmetic travel accessories.",
    basePrice: 550000,
    sku: "CC-EWT-07",
    stock: 12,
    status: "ACTIVE",
    averageRating: 4.9,
    reviewsCount: 60,
    isFeatured: false,
    categoryId: "cat-5", // Bag
    brandId: "brand-9",
    category: mockCategories[4],
    brand: mockBrands[8],
    images: [
      { id: "img-tfy-7-1", productId: "tfy-7", imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-tfy-7-1",
        productId: "tfy-7",
        sku: "CC-EWT-07-BLK",
        price: 550000,
        stock: 12,
        selectedOptions: [{ id: "val-c-blk", attributeId: "attr-color", attributeName: "Color", value: "Onyx Black", meta: "#1A1A1A" }]
      }
    ]
  },
  {
    id: "tfy-8",
    name: "Sophisticated Women's Parka Line",
    slug: "sophisticated-womens-parka-line",
    description: "Padded thermal coat featuring adjustable toggle waist draws and faux fur lining hoods. Perfect wind and rain shield for the outdoors.",
    basePrice: 550000,
    salePrice: 324000,
    sku: "SP-WPL-08",
    stock: 18,
    status: "ACTIVE",
    averageRating: 4.9,
    reviewsCount: 105,
    isFeatured: false,
    categoryId: "cat-2", // Jacket
    brandId: "brand-10",
    category: mockCategories[1],
    brand: mockBrands[9],
    images: [
      { id: "img-tfy-8-1", productId: "tfy-8", imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-tfy-8-1",
        productId: "tfy-8",
        sku: "SP-WPL-08-GRY",
        price: 324000,
        stock: 18,
        selectedOptions: [{ id: "val-s-med", attributeId: "attr-size", attributeName: "Size", value: "Medium" }]
      }
    ]
  }
];

// Mock Stores data for "Best Selling Store" section in image
export const mockStores: Store[] = [
  {
    id: "store-1",
    name: "Nike Solo Mall",
    tagline: "Just do it first",
    logoUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80", // Sneaker
    isVerified: true,
    products: [
      { id: "sp-1-1", name: "Red Runner Sneaker", price: 650000, imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80" },
      { id: "sp-1-2", name: "Grey Peep Block Heels", price: 270000, imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&auto=format&fit=crop&q=80" },
      { id: "sp-1-3", name: "Gentlemen Fedora Hat", price: 99000, imageUrl: "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=200&auto=format&fit=crop&q=80" }
    ]
  },
  {
    id: "store-2",
    name: "Barudak Disaster Mall",
    tagline: "Unleash Your Fashion",
    logoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80", // Coat/Model
    isVerified: true,
    products: [
      { id: "sp-2-1", name: "Women Parka Coat", price: 324000, imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80" },
      { id: "sp-2-2", name: "Genuine Derby Shoes", price: 159000, imageUrl: "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?w=200&auto=format&fit=crop&q=80" },
      { id: "sp-2-3", name: "Grey LS Crewneck Shirt", price: 120000, imageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=200&auto=format&fit=crop&q=80" }
    ]
  },
  {
    id: "store-3",
    name: "Galaxy Galleria Mall",
    tagline: "Be Extraordinary",
    logoUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&auto=format&fit=crop&q=80", // Shirt
    isVerified: true,
    products: [
      { id: "sp-3-1", name: "L-S Oxford Shirt", price: 179000, imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&auto=format&fit=crop&q=80" },
      { id: "sp-3-2", name: "Calfskin Wing Brogues", price: 199000, imageUrl: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=200&auto=format&fit=crop&q=80" },
      { id: "sp-3-3", name: "Indigo Denim Jeans", price: 253000, imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&auto=format&fit=crop&q=80" }
    ]
  },
  {
    id: "store-4",
    name: "Aurora Well Mall",
    tagline: "Chic, Bold, Confident",
    logoUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&auto=format&fit=crop&q=80", // Handbag
    isVerified: true,
    products: [
      { id: "sp-4-1", name: "Camera Courier Case", price: 250000, imageUrl: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=200&auto=format&fit=crop&q=80" },
      { id: "sp-4-2", name: "Grey Drawstring Shorts", price: 162000, imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=200&auto=format&fit=crop&q=80" },
      { id: "sp-4-3", name: "Elite Windbreaker Coat", price: 255000, imageUrl: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=200&auto=format&fit=crop&q=80" }
    ]
  }
];
