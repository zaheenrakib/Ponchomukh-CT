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
}

export interface AttributeValue {
  id: string;
  attributeId: string;
  attributeName: string; // Helper for easy frontend display
  value: string;
  meta?: string; // e.g., hex code for colors
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
  
  // Relations
  category: Category;
  brand?: Brand;
  images: ProductImage[];
  variants: ProductVariant[];
}

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Electronics",
    slug: "electronics",
    description: "Gadgets, audio devices, and smart accessories.",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "cat-2",
    name: "Fashion & Accessories",
    slug: "fashion",
    description: "Premium leather bags, apparel, and accents.",
    imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "cat-3",
    name: "Home & Living",
    slug: "home-living",
    description: "Ergonomic furniture, workspace setups, and decor.",
    imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "cat-4",
    name: "Wellness & Selfcare",
    slug: "wellness",
    description: "Essential diffusers, fitness, and lifestyle products.",
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format&fit=crop&q=80"
  }
];

// Mock Brands
export const mockBrands: Brand[] = [
  { id: "brand-1", name: "AeroSound", slug: "aerosound", description: "Pioneers in high-fidelity wireless audio." },
  { id: "brand-2", name: "Hide & Sole", slug: "hide-sole", description: "Handcrafted top-grain leather goods." },
  { id: "brand-3", name: "ErgoForm", slug: "ergoform", description: "Designing ergonomics for daily comfort." },
  { id: "brand-4", name: "KeyChronicle", slug: "keychronicle", description: "Premium mechanical keyboards for creators." },
  { id: "brand-5", name: "AuraMist", slug: "auramist", description: "Natural wellness and sensory experiences." },
  { id: "brand-6", name: "FitPulse", slug: "fitpulse", description: "Track your health and daily performance." }
];

// Helper Attribute Values
const colorAttrs = {
  black: { id: "val-c-blk", attributeId: "attr-color", attributeName: "Color", value: "Matte Black", meta: "#111111" },
  silver: { id: "val-c-slv", attributeId: "attr-color", attributeName: "Color", value: "Platinum Silver", meta: "#E5E5E5" },
  brown: { id: "val-c-brn", attributeId: "attr-color", attributeName: "Color", value: "Tan Brown", meta: "#B45309" },
  navy: { id: "val-c-nvy", attributeId: "attr-color", attributeName: "Color", value: "Navy Blue", meta: "#1E3A8A" }
};

const sizeAttrs = {
  standard: { id: "val-s-std", attributeId: "attr-size", attributeName: "Size", value: "Standard" },
  medium: { id: "val-s-med", attributeId: "attr-size", attributeName: "Size", value: "Medium" },
  large: { id: "val-s-lrg", attributeId: "attr-size", attributeName: "Size", value: "Large" }
};

const switchAttrs = {
  red: { id: "val-sw-red", attributeId: "attr-switch", attributeName: "Switch Type", value: "Linear Red" },
  brown: { id: "val-sw-brn", attributeId: "attr-switch", attributeName: "Switch Type", value: "Tactile Brown" },
  blue: { id: "val-sw-blu", attributeId: "attr-switch", attributeName: "Switch Type", value: "Clicky Blue" }
};

// Mock Products
export const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Wireless Noise-Cancelling Headphones",
    slug: "wireless-noise-cancelling-headphones",
    description: "Immerse yourself in pure audio bliss with the AeroSound WH-1000. Featuring industry-leading active noise cancellation (ANC), 40 hours of battery life, and high-resolution sound drivers, these over-ear headphones are designed for audiophiles and travelers alike.",
    shortDescription: "Industry-leading noise cancellation with 40h battery life.",
    basePrice: 299.99,
    salePrice: 249.99,
    sku: "AERO-WH1000",
    stock: 24,
    status: "ACTIVE",
    averageRating: 4.8,
    reviewsCount: 154,
    isFeatured: true,
    categoryId: "cat-1",
    brandId: "brand-1",
    category: mockCategories[0],
    brand: mockBrands[0],
    images: [
      { id: "img-1-1", productId: "prod-1", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80", isPrimary: true },
      { id: "img-1-2", productId: "prod-1", imageUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80", isPrimary: false }
    ],
    variants: [
      {
        id: "var-1-blk",
        productId: "prod-1",
        sku: "AERO-WH1000-BLK",
        price: 249.99,
        stock: 15,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
        selectedOptions: [colorAttrs.black]
      },
      {
        id: "var-1-slv",
        productId: "prod-1",
        sku: "AERO-WH1000-SLV",
        price: 249.99,
        stock: 9,
        imageUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80",
        selectedOptions: [colorAttrs.silver]
      }
    ]
  },
  {
    id: "prod-2",
    name: "Premium Leather Messenger Bag",
    slug: "premium-leather-messenger-bag",
    description: "Crafted from 100% full-grain cowhide leather, the Hide & Sole Courier is the ultimate companion for the modern professional. Equipped with a padded 15-inch laptop compartment, heavy-duty brass hardware, and a comfortable adjustable shoulder strap that patinas beautifully over time.",
    shortDescription: "Handcrafted full-grain leather bag for laptops up to 15\".",
    basePrice: 189.99,
    salePrice: 169.99,
    sku: "HIDE-COURIER",
    stock: 12,
    status: "ACTIVE",
    averageRating: 4.9,
    reviewsCount: 88,
    isFeatured: true,
    categoryId: "cat-2",
    brandId: "brand-2",
    category: mockCategories[1],
    brand: mockBrands[1],
    images: [
      { id: "img-2-1", productId: "prod-2", imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-2-brn",
        productId: "prod-2",
        sku: "HIDE-COURIER-BRN",
        price: 169.99,
        stock: 12,
        selectedOptions: [colorAttrs.brown]
      }
    ]
  },
  {
    id: "prod-3",
    name: "Ergonomic Mesh Office Chair",
    slug: "ergonomic-mesh-office-chair",
    description: "Redefine your workspace comfort with the ErgoForm Pro. Engineered with dynamic lumbar support, highly breathable 3D mesh, 4D adjustable armrests, and a multi-angle tilt lock mechanism. Designed to maintain posture and prevent back strains during long hours.",
    shortDescription: "High-back mesh chair with adjustable 3D lumbar support.",
    basePrice: 349.99,
    sku: "ERGO-PRO-CHAIR",
    stock: 8,
    status: "ACTIVE",
    averageRating: 4.6,
    reviewsCount: 42,
    isFeatured: false,
    categoryId: "cat-3",
    brandId: "brand-3",
    category: mockCategories[2],
    brand: mockBrands[2],
    images: [
      { id: "img-3-1", productId: "prod-3", imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-3-blk",
        productId: "prod-3",
        sku: "ERGO-PRO-BLK",
        price: 349.99,
        stock: 8,
        selectedOptions: [colorAttrs.black]
      }
    ]
  },
  {
    id: "prod-4",
    name: "Minimalist Mechanical Keyboard",
    slug: "minimalist-mechanical-keyboard",
    description: "Write and code in absolute comfort and precision. The KeyChronicle K8 is a 75% layout, hot-swappable mechanical keyboard featuring high-grade PBT keycaps, dual Bluetooth/USB-C connection, and custom pre-lubed mechanical switches that deliver a satisfying sound and feel.",
    shortDescription: "75% layout hot-swappable mechanical keyboard with PBT keycaps.",
    basePrice: 129.99,
    salePrice: 109.99,
    sku: "KEY-K8-KEYS",
    stock: 18,
    status: "ACTIVE",
    averageRating: 4.7,
    reviewsCount: 65,
    isFeatured: true,
    categoryId: "cat-1",
    brandId: "brand-4",
    category: mockCategories[0],
    brand: mockBrands[3],
    images: [
      { id: "img-4-1", productId: "prod-4", imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-4-red",
        productId: "prod-4",
        sku: "KEY-K8-RED",
        price: 109.99,
        stock: 8,
        selectedOptions: [switchAttrs.red]
      },
      {
        id: "var-4-brn",
        productId: "prod-4",
        sku: "KEY-K8-BRN",
        price: 109.99,
        stock: 10,
        selectedOptions: [switchAttrs.brown]
      }
    ]
  },
  {
    id: "prod-5",
    name: "Aromatherapy Essential Oil Diffuser",
    slug: "aromatherapy-essential-oil-diffuser",
    description: "Transform your home into a soothing sanctuary. The AuraMist Zen diffuser utilizes ultrasonic vibrations to disperse fine mist infused with essential oils. Designed with a hand-crafted ceramic casing, 7-color warm ambient LEDs, and automatic shut-off timers.",
    shortDescription: "Ceramic ultrasonic diffuser with 7-color ambient lighting.",
    basePrice: 59.99,
    salePrice: 44.99,
    sku: "AURA-ZEN-DF",
    stock: 30,
    status: "ACTIVE",
    averageRating: 4.5,
    reviewsCount: 112,
    isFeatured: false,
    categoryId: "cat-4",
    brandId: "brand-5",
    category: mockCategories[3],
    brand: mockBrands[4],
    images: [
      { id: "img-5-1", productId: "prod-5", imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-5-std",
        productId: "prod-5",
        sku: "AURA-ZEN-STD",
        price: 44.99,
        stock: 30,
        selectedOptions: [sizeAttrs.standard]
      }
    ]
  },
  {
    id: "prod-6",
    name: "Active Smart Fitness Watch",
    slug: "active-smart-fitness-watch",
    description: "Track your goals, stay connected, and elevate your fitness. The FitPulse Active monitors heart rate, blood oxygen (SpO2), sleep quality, and offers over 15 built-in sports modes. Features a brilliant 1.4-inch AMOLED display and up to 10 days of battery life.",
    shortDescription: "AMOLED screen smartwatch with SpO2 and heart-rate tracking.",
    basePrice: 89.99,
    sku: "FITP-ACTIVE-W",
    stock: 15,
    status: "ACTIVE",
    averageRating: 4.4,
    reviewsCount: 50,
    isFeatured: false,
    categoryId: "cat-1",
    brandId: "brand-6",
    category: mockCategories[0],
    brand: mockBrands[5],
    images: [
      { id: "img-6-1", productId: "prod-6", imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-6-blk",
        productId: "prod-6",
        sku: "FITP-ACT-BLK",
        price: 89.99,
        stock: 8,
        selectedOptions: [colorAttrs.black]
      },
      {
        id: "var-6-nvy",
        productId: "prod-6",
        sku: "FITP-ACT-NVY",
        price: 89.99,
        stock: 7,
        selectedOptions: [colorAttrs.navy]
      }
    ]
  }
];
