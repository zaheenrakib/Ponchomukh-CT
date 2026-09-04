export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  iconName?: string;
  subcategories?: SubCategory[];
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

export interface SpecificationItem {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  userAvatar?: string;
}

export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  slug: string;
  description: string;
  shortDescription?: string;
  basePrice: number;
  salePrice?: number;
  costPrice?: number;
  sku: string;
  stock: number;
  lowStockThreshold?: number;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  averageRating: number;
  reviewsCount: number;
  isFeatured: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFlashSale?: boolean;
  categoryId: string;
  brandId?: string;
  
  // Rich details
  features?: string[];
  specifications?: SpecificationItem[];
  deliveryInfo?: string;
  returnPolicy?: string;
  reviews?: ProductReview[];
  tags?: string[];

  // Flash Sale helpers
  soldCount?: number;
  limitCount?: number;
  soldPercent?: number;

  // Relations
  category: Category;
  brand?: Brand;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface Collection {
  id: string;
  title: string;
  titleBn: string;
  slug: string;
  description: string;
  imageUrl: string;
  productCount: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
  imageUrl: string;
  mobileImageUrl?: string;
  position: 'HERO' | 'PROMOTIONAL' | 'CATEGORY';
  isActive: boolean;
  sortOrder: number;
}

// Categories
export const mockCategories: Category[] = [
  {
    id: "cat-gadgets",
    name: "Gadgets",
    slug: "gadgets",
    description: "স্মার্ট লাইফস্টাইলের জন্য প্রয়োজনীয় স্মার্ট গ্যাজেট সমূহ",
    imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80",
    iconName: "Smartphone",
    subcategories: [
      { id: "sub-smartwatch", name: "Smartwatches", slug: "smartwatches" },
      { id: "sub-earbuds", name: "Wireless Earbuds", slug: "earbuds" },
      { id: "sub-powerbank", name: "Power Banks", slug: "powerbanks" },
      { id: "sub-cables", name: "Cables & Hubs", slug: "cables-hubs" }
    ]
  },
  {
    id: "cat-electronics",
    name: "Electronics",
    slug: "electronics",
    description: "প্রয়োজনীয় সকল ইলেকট্রনিক্স সরঞ্জাম এবং এক্সেসরিজ",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    iconName: "Headphones",
    subcategories: [
      { id: "sub-audio", name: "Bluetooth Speakers", slug: "speakers" },
      { id: "sub-lighting", name: "Smart Lighting", slug: "smart-lights" },
      { id: "sub-chargers", name: "Fast Chargers", slug: "fast-chargers" }
    ]
  },
  {
    id: "cat-home-kitchen",
    name: "Home & Kitchen",
    slug: "home-kitchen",
    description: "দৈনন্দিন রান্না ও গৃহস্থালি কাজের স্মার্ট সব সল্যুশন",
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=500&auto=format&fit=crop&q=80",
    iconName: "Utensils",
    subcategories: [
      { id: "sub-blender", name: "Portable Blenders", slug: "portable-blenders" },
      { id: "sub-cookware", name: "Electric Choppers", slug: "electric-choppers" },
      { id: "sub-storage", name: "Vacuum Sealers", slug: "vacuum-sealers" },
      { id: "sub-cleaner", name: "Mini Cleaners", slug: "mini-cleaners" }
    ]
  },
  {
    id: "cat-travel",
    name: "Travel Accessories",
    slug: "travel",
    description: "ভ্রমণ ও ট্যুরের জন্য প্রয়োজনীয় প্রিমিয়াম এক্সেসরিজ",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
    iconName: "Luggage",
    subcategories: [
      { id: "sub-backpack", name: "Waterproof Backpacks", slug: "backpacks" },
      { id: "sub-bottles", name: "Thermal Bottles", slug: "thermal-bottles" },
      { id: "sub-organizer", name: "Packing Cubes", slug: "packing-cubes" }
    ]
  },
  {
    id: "cat-lifestyle",
    name: "Lifestyle",
    slug: "lifestyle",
    description: "আপনার আধুনিক জীবনের প্রতিটি মুহূর্তকে সহজ করার পণ্য",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
    iconName: "Sparkles",
    subcategories: [
      { id: "sub-grooming", name: "Personal Grooming", slug: "grooming" },
      { id: "sub-desk", name: "Desk Accessories", slug: "desk-accessories" },
      { id: "sub-fitness", name: "Fitness Gear", slug: "fitness-gear" }
    ]
  },
  {
    id: "cat-daily-essentials",
    name: "Daily Essentials",
    slug: "daily-essentials",
    description: "দৈনন্দিন জীবনের প্রয়োজনীয় দরকারি পণ্য সামগ্রী",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80",
    iconName: "Package",
    subcategories: [
      { id: "sub-hygiene", name: "Personal Care", slug: "personal-care" },
      { id: "sub-homecare", name: "Home Utilities", slug: "home-utilities" }
    ]
  }
];

// Brands
export const mockBrands: Brand[] = [
  { id: "brand-sonifer", name: "Sonifer", slug: "sonifer" },
  { id: "brand-joyroom", name: "Joyroom", slug: "joyroom" },
  { id: "brand-hoco", name: "Hoco", slug: "hoco" },
  { id: "brand-baseus", name: "Baseus", slug: "baseus" },
  { id: "brand-remax", name: "Remax", slug: "remax" },
  { id: "brand-xiaomi", name: "Xiaomi Eco", slug: "xiaomi-eco" },
  { id: "brand-kensen", name: "Kensen", slug: "kensen" }
];

// Curated Collections
export const mockCollections: Collection[] = [
  {
    id: "col-1",
    title: "Smart Gadgets",
    titleBn: "স্মার্ট গ্যাজেট কর্নার",
    slug: "smart-gadgets",
    description: "দৈনন্দিন জীবনকে গতিশীল করতে সেরা স্মার্ট গ্যাজেট কালেকশন।",
    imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80",
    productCount: 18
  },
  {
    id: "col-2",
    title: "Kitchen Essentials",
    titleBn: "কিচেন এসেনশিয়ালস",
    slug: "kitchen-essentials",
    description: "সহজ ও দ্রুত রান্নার আধুনিক ও কার্যকর গৃহস্থালি সরঞ্জাম।",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
    productCount: 14
  },
  {
    id: "col-3",
    title: "Travel Essentials",
    titleBn: "ট্রাভেল এসেনশিয়ালস",
    slug: "travel-essentials",
    description: "ট্যুর ও জার্নির সঙ্গী হতে প্রস্তুত টেকসই সব এক্সেসরিজ।",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    productCount: 12
  },
  {
    id: "col-4",
    title: "Home Essentials",
    titleBn: "হোম কমফোর্ট & কেয়ার",
    slug: "home-essentials",
    description: "আপনার ঘরকে পরিপাটি ও স্মার্ট রাখতে দরকারি সব সমাধান।",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    productCount: 16
  }
];

// Reviews Sample
const sampleReviews: ProductReview[] = [
  {
    id: "rev-1",
    userName: "তানভীর আহমেদ",
    rating: 5,
    date: "৩ দিন আগে",
    comment: "প্রোডাক্ট কোয়ালিটি অসাধারণ! অর্ডার করার পরদিন ঢাকায় হোম ডেলিভারি পেয়েছি। খুব সন্তুষ্ট।",
    verified: true
  },
  {
    id: "rev-2",
    userName: "সুমাইয়া আক্তার",
    rating: 5,
    date: "১ সপ্তাহ আগে",
    comment: "দাম অনুযায়ী খুবই ভালো পণ্য। একদম ছবির মতোই পেয়েছি। ক্যাশ অন ডেলিভারিতে চেক করে নিতে পেরেছি।",
    verified: true
  },
  {
    id: "rev-3",
    userName: "রফিকুল ইসলাম",
    rating: 4,
    date: "২ সপ্তাহ আগে",
    comment: "প্যাকেজিং খুব চমৎকার ছিল। পারফর্মেন্স একদম পারফেক্ট। ধন্যবাদ পঞ্চমুখকে।",
    verified: true
  }
];

// Comprehensive Mock Products
export const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Sonifer SF-350 Portable Rechargeable Juicer & Blender (350ml)",
    nameEn: "Sonifer SF-350 Portable Rechargeable Juicer & Blender",
    slug: "sonifer-sf-350-portable-blender",
    description: "Sonifer SF-350 পোর্টেবল রিচার্জেবল জুসার ও ব্লেন্ডার দিয়ে যেকোনো ফলমূল, মিল্কশেক ও স্মুদি খুব সহজে যেকোনো স্থানে বানিয়ে উপভোগ করুন। শক্তিশালী ৬-ব্লেড স্টেইনলেস স্টিল কাটার ও বিল্ট-ইন ২০০০mAh রিচার্জেবল ব্যাটারি থাকায় এটি বহন করা অত্যন্ত সহজ।",
    shortDescription: "শক্তিশালী ৬-ব্লেড মোটর, USB রিচার্জেবল ও ফুট-গ্রেড ম্যাটেরিয়াল।",
    basePrice: 1599,
    salePrice: 1299,
    costPrice: 950,
    sku: "SNF-BL-350",
    stock: 35,
    lowStockThreshold: 5,
    status: "ACTIVE",
    averageRating: 4.8,
    reviewsCount: 42,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    categoryId: "cat-home-kitchen",
    brandId: "brand-sonifer",
    category: mockCategories[2],
    brand: mockBrands[0],
    features: [
      "উচ্চ ক্ষমতাসম্পন্ন ৬-ব্লেড 3D স্টেইনলেস স্টিল কাটার",
      "ফুট-গ্রেড নন-টক্সিক ও ইকো-ফ্রেন্ডলি PCTG ম্যাটেরিয়াল",
      "২০০০mAh লিথিয়াম আয়ন ব্যাটারি (এক চার্জে ১০-১২ বার ব্লেন্ডিং)",
      "স্মার্ট সেফটি ম্যাগনেটিক সেন্সর প্রোটেকশন",
      "USB Type-C চার্জিং সুবিধা"
    ],
    specifications: [
      { label: "ব্র্যান্ড", value: "Sonifer" },
      { label: "মডেল", value: "SF-350" },
      { label: "ক্যাপাসিটি", value: "350 ml" },
      { label: "পাওয়ার", value: "150W" },
      { label: "ব্যাটারি", value: "2000 mAh Li-ion" },
      { label: "ম্যাটেরিয়াল", value: "Food-Grade ABS + Stainless Steel" },
      { label: "ওয়ারেন্টি", value: "7 Days Replacement Guarantee" }
    ],
    deliveryInfo: "ঢাকা সিটির মধ্যে ২৪-৪৮ ঘণ্টার মধ্যে ডেলিভারি (৳৬০)। ঢাকার বাইরে ২-৩ কার্যদিবসের মধ্যে হোম ডেলিভারি (৳১২০)।",
    returnPolicy: "পণ্য হাতে পাওয়ার পর ত্রুটি থাকলে ৭ দিনের মধ্যে সহজ রিটার্ন ও রিপ্লেসমেন্ট সুবিধা।",
    reviews: sampleReviews,
    images: [
      { id: "img-1-1", productId: "prod-1", imageUrl: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&auto=format&fit=crop&q=80", isPrimary: true },
      { id: "img-1-2", productId: "prod-1", imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80", isPrimary: false }
    ],
    variants: [
      {
        id: "var-1-1",
        productId: "prod-1",
        sku: "SNF-BL-350-MINT",
        price: 1299,
        stock: 20,
        selectedOptions: [{ id: "opt-color-mint", attributeId: "attr-color", attributeName: "কালার", value: "Mint Green", meta: "#98FB98" }]
      },
      {
        id: "var-1-2",
        productId: "prod-1",
        sku: "SNF-BL-350-PINK",
        price: 1299,
        stock: 15,
        selectedOptions: [{ id: "opt-color-pink", attributeId: "attr-color", attributeName: "কালার", value: "Pastel Pink", meta: "#FFB6C1" }]
      }
    ]
  },
  {
    id: "prod-2",
    name: "Joyroom JR-T03S Pro ANC True Wireless Earbuds with Wireless Charging",
    nameEn: "Joyroom JR-T03S Pro ANC True Wireless Earbuds",
    slug: "joyroom-jr-t03s-pro-anc-earbuds",
    description: "অরিজিনাল অ্যাক্টিভ নয়েজ ক্যান্সেলেশন (ANC) প্রযুক্তির সাথে জয়রুম T03S প্রো ইয়ারবাডস। পরিষ্কার ক্রিস্টাল ক্লিয়ার সাউন্ড ও ডিপ ব্যাস মিউজিক লাভারদের জন্য পারফেক্ট। ওয়্যারলেস চার্জিং কেস ও লং লাস্টিং ব্যাটারি লাইফ।",
    shortDescription: "অ্যাক্টিভ নয়েজ ক্যান্সেলেশন, ব্লুটুথ ৫.২ এবং ডিপ ব্যাস সাউন্ড।",
    basePrice: 2499,
    salePrice: 1899,
    costPrice: 1450,
    sku: "JR-T03S-PRO",
    stock: 28,
    status: "ACTIVE",
    averageRating: 4.9,
    reviewsCount: 78,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    categoryId: "cat-gadgets",
    brandId: "brand-joyroom",
    category: mockCategories[0],
    brand: mockBrands[1],
    features: [
      "অ্যাক্টিভ নয়েজ ক্যান্সেলেশন (ANC) ও ট্রান্সপারেন্সি মোড",
      "১৩ মিমি ডাইনামিক ড্রাইভার ডিপ ব্যাস অডিও",
      "স্মার্ট টাচ কন্ট্রোল ও অটো পেয়ারিং",
      "এক চার্জে টানা ৫ ঘণ্টা এবং কেস সহ ২৫ ঘণ্টা প্লেব্যাক"
    ],
    specifications: [
      { label: "ব্র্যান্ড", value: "Joyroom" },
      { label: "মডেল", value: "JR-T03S Pro" },
      { label: "ব্লুটুথ ভার্সন", value: "V5.2" },
      { label: "ব্যাটারি লাইফ", value: "Up to 25 Hours with Case" },
      { label: "চার্জিং মোড", value: "Type-C & Qi Wireless" },
      { label: "ওয়ারেন্টি", value: "6 Months Official Warranty" }
    ],
    deliveryInfo: "সারা বাংলাদেশে হোম ডেলিভারি ও ক্যাশ অন ডেলিভারি প্রযোজ্য।",
    returnPolicy: "৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি।",
    reviews: sampleReviews,
    images: [
      { id: "img-2-1", productId: "prod-2", imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80", isPrimary: true },
      { id: "img-2-2", productId: "prod-2", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80", isPrimary: false }
    ],
    variants: [
      {
        id: "var-2-1",
        productId: "prod-2",
        sku: "JR-T03S-WHT",
        price: 1899,
        stock: 28,
        selectedOptions: [{ id: "opt-c-wht", attributeId: "attr-color", attributeName: "কালার", value: "Pure White", meta: "#FFFFFF" }]
      }
    ]
  },
  {
    id: "prod-3",
    name: "Baseus Blade 100W Ultra-Slim Digital Display Fast Charging Power Bank 20000mAh",
    nameEn: "Baseus Blade 100W Ultra-Slim Power Bank",
    slug: "baseus-blade-100w-powerbank",
    description: "ল্যাপটপ, ট্যাবলেট ও স্মার্টফোনের জন্য আল্ট্রা-স্লিম ১০০ ওয়াট ফাস্ট চার্জিং পাওয়ার ব্যাংক। একসাথে ৪টি ডিভাইস সুপার ফাস্ট স্পিডে চার্জ করা সম্ভব। প্রিমিয়াম ডিজিটাল ডিসপ্লেতে চার্জিং ভোল্টেজ ও শতাংশ দেখা যায়।",
    shortDescription: "১০০W ল্যাপটপ চার্জিং সাপোর্ট, ২০০০০mAh ক্ষমতা এবং ডিজিটাল ডিসপ্লে।",
    basePrice: 5499,
    salePrice: 4299,
    costPrice: 3400,
    sku: "BAS-BLADE-100W",
    stock: 14,
    status: "ACTIVE",
    averageRating: 4.9,
    reviewsCount: 36,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    categoryId: "cat-gadgets",
    brandId: "brand-baseus",
    category: mockCategories[0],
    brand: mockBrands[3],
    features: [
      "১০০W PD হাই-স্পিড ডুয়েল টাইপ-সি আউটপুট",
      "ম্যাকবুক, ডেল, এইচপি ও সকল ল্যাপটপ চার্জিং উপযোগী",
      "১৮মিমি স্লিম প্রফেশনাল পোর্টফোলিও ডিজাইন",
      "HD ডিজিটাল স্ট্যাটাস স্ক্রিন"
    ],
    specifications: [
      { label: "ব্র্যান্ড", value: "Baseus" },
      { label: "মডেল", value: "Blade 100W" },
      { label: "ক্যাপাসিটি", value: "20,000 mAh / 74Wh" },
      { label: "ম্যাক্স আউটপুট", value: "100W (PD 3.0 / QC 4+)" },
      { label: "ওয়ারেন্টি", value: "1 Year Official Warranty" }
    ],
    reviews: sampleReviews,
    images: [
      { id: "img-3-1", productId: "prod-3", imageUrl: "https://images.unsplash.com/photo-1609592424368-8a0b0d36c535?w=600&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-3-1",
        productId: "prod-3",
        sku: "BAS-BLADE-BLK",
        price: 4299,
        stock: 14,
        selectedOptions: [{ id: "opt-c-blk", attributeId: "attr-color", attributeName: "কালার", value: "Matte Black", meta: "#1A1A1A" }]
      }
    ]
  },
  {
    id: "prod-4",
    name: "Multi-Functional Electric Vegetable Cutter & Meat Chopper (2L Stainless Steel)",
    nameEn: "Multi-Functional Electric Chopper & Meat Grinder",
    slug: "electric-vegetable-meat-chopper-2l",
    description: "রান্নাঘরের কাজকে কয়েক মিনিটে সহজ করে তুলতে শক্তিশালী ২ লিটার স্টেইনলেস স্টিল ইলেকট্রিক চপার। মাংস কিমা করা, পেঁয়াজ, রসুন ও সবজি কুচি করা যাবে চোখের পলকে।",
    shortDescription: "২ লিটার বাটি, ৪০০W শক্তিশালী কপার মোটর ও ৪-লেয়ার ব্লেড।",
    basePrice: 1999,
    salePrice: 1499,
    costPrice: 1050,
    sku: "ELC-CHP-2L",
    stock: 45,
    status: "ACTIVE",
    averageRating: 4.7,
    reviewsCount: 54,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    categoryId: "cat-home-kitchen",
    brandId: "brand-sonifer",
    category: mockCategories[2],
    brand: mockBrands[0],
    features: [
      "৪০০ ওয়াট পিওর কপার মোটর ও ২-স্পিড কন্ট্রোল",
      "মজবুত ও হাইজিনিক ৩০৪ ফুড-গ্রেড স্টেইনলেস স্টিল বোল",
      "৪-পিস এস-শেপ শার্প স্টেইনলেস স্টিল ব্লেডস",
      "সহজ ও দ্রুত পরিষ্কারযোগ্য ডিজাইন"
    ],
    specifications: [
      { label: "ক্যাপাসিটি", value: "2.0 Liters" },
      { label: "পাওয়ার", value: "400 Watts" },
      { label: "স্পিড", value: "Dual Speed Level" },
      { label: "ম্যাটেরিয়াল", value: "Stainless Steel Bowl & Blades" },
      { label: "ওয়ারেন্টি", value: "7 Days Replacement" }
    ],
    reviews: sampleReviews,
    images: [
      { id: "img-4-1", productId: "prod-4", imageUrl: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-4-1",
        productId: "prod-4",
        sku: "ELC-CHP-2L-SLV",
        price: 1499,
        stock: 45,
        selectedOptions: [{ id: "opt-c-slv", attributeId: "attr-color", attributeName: "মডেল", value: "Stainless Steel 2L", meta: "#C0C0C0" }]
      }
    ]
  },
  // --- FLASH SALE PRODUCTS ---
  {
    id: "fs-1",
    name: "Hoco Y12 Ultra Smartwatch with Bluetooth Calling & Fitness Tracker",
    nameEn: "Hoco Y12 Ultra Smartwatch",
    slug: "hoco-y12-ultra-smartwatch",
    description: "২.০২ ইঞ্চি এইচডি ফুল টাচ স্ক্রিন ডিসপ্লে, ব্লুটুথ কলিং, হার্ট রেট ও স্লিপ মনিটরিং সমৃদ্ধ আধুনিক আল্ট্রা স্মার্টওয়াচ। সাথে পাবেন একাধিক ফ্যাশনেবল স্ট্র্যাপ।",
    shortDescription: "২.০২ ইঞ্চি HD ডিসপ্লে, ব্লুটুথ কলিং ও ফুল হেলথ ট্র্যাকিং।",
    basePrice: 2899,
    salePrice: 1999,
    costPrice: 1400,
    sku: "HOCO-Y12-ULTRA",
    stock: 12,
    status: "ACTIVE",
    averageRating: 4.8,
    reviewsCount: 89,
    isFeatured: true,
    isFlashSale: true,
    soldCount: 18,
    limitCount: 30,
    soldPercent: 60,
    categoryId: "cat-gadgets",
    brandId: "brand-hoco",
    category: mockCategories[0],
    brand: mockBrands[2],
    features: [
      "২.০২ ইঞ্চি ব্রাইট ট্রু-কালার ডিসপ্লে",
      "সরাসরি ঘড়ি থেকেই কল রিসিভ ও ডায়াল করার সুবিধা",
      "১০০+ স্পোর্টস মোড ও IP67 ওয়াটার রেজিস্ট্যান্স",
      "ওয়্যারলেস ম্যাগনেটিক চার্জিং ডক"
    ],
    specifications: [
      { label: "ব্র্যান্ড", value: "Hoco" },
      { label: "মডেল", value: "Y12 Ultra" },
      { label: "ডিসপ্লে", value: "2.02 Inch HD Display" },
      { label: "ব্যাটারি", value: "280mAh (4-6 Days backup)" },
      { label: "ওয়ারেন্টি", value: "6 Months Warranty" }
    ],
    reviews: sampleReviews,
    images: [
      { id: "img-fs-1-1", productId: "fs-1", imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-fs-1-1",
        productId: "fs-1",
        sku: "HOCO-Y12-ORANGE",
        price: 1999,
        stock: 12,
        selectedOptions: [{ id: "opt-strap-orange", attributeId: "attr-color", attributeName: "স্ট্র্যাপ", value: "Orange Ocean", meta: "#FFA500" }]
      }
    ]
  },
  {
    id: "fs-2",
    name: "Kensen 5-in-1 Professional Electric Grooming Kit & Body Trimmer (IPX7 Waterproof)",
    nameEn: "Kensen 5-in-1 Electric Grooming Trimmer Kit",
    slug: "kensen-5-in-1-electric-grooming-kit",
    description: "দাড়ি, চুল, নাক-কান ও ফুল বডি ট্রিম করার কমপ্লিট ৫-ইন-১ মাল্টিফাংশনাল গ্রুমিং কিট। ওয়াটারপ্রুফ হওয়ায় গোসলের সময়ও নিরাপদে ব্যবহার করা যায়।",
    shortDescription: "IPX7 ওয়াটারপ্রুফ, টাইটেনিয়াম সিরামিক ব্লেড ও ৯০ মিনিট ব্যাকআপ।",
    basePrice: 2200,
    salePrice: 1550,
    costPrice: 1100,
    sku: "KSN-TRM-5IN1",
    stock: 15,
    status: "ACTIVE",
    averageRating: 4.9,
    reviewsCount: 65,
    isFeatured: true,
    isFlashSale: true,
    soldCount: 22,
    limitCount: 35,
    soldPercent: 63,
    categoryId: "cat-lifestyle",
    brandId: "brand-kensen",
    category: mockCategories[4],
    brand: mockBrands[6],
    features: [
      "৫টি পরিবর্তনযোগ্য নোজেল ও বডি গার্ড",
      "IPX7 ১০০% ওয়াটারপ্রুফ বডি",
      "LED ব্যাটারি পার্সেন্টেজ ডিসপ্লে",
      "USB ফাস্ট চার্জিং"
    ],
    specifications: [
      { label: "ব্র্যান্ড", value: "Kensen" },
      { label: "মডেল", value: "5-in-1 Pro Groomer" },
      { label: "ব্যাটারি", value: "90 Mins Cordless Runtime" },
      { label: "চার্জিং", value: "Type-C Fast Charge" },
      { label: "ওয়ারেন্টি", value: "7 Days Replacement" }
    ],
    reviews: sampleReviews,
    images: [
      { id: "img-fs-2-1", productId: "fs-2", imageUrl: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-fs-2-1",
        productId: "fs-2",
        sku: "KSN-TRM-BLK",
        price: 1550,
        stock: 15,
        selectedOptions: [{ id: "opt-c-gr", attributeId: "attr-color", attributeName: "কালার", value: "Matte Gunmetal", meta: "#2A2A2A" }]
      }
    ]
  },
  {
    id: "fs-3",
    name: "Remax RT-Cup01 Smart Temperature Display Vacuum Insulated Thermal Flask (500ml)",
    nameEn: "Remax Smart Temperature Display Thermal Flask",
    slug: "remax-smart-temp-flask-500ml",
    description: "স্মার্ট টাচ এলইডি ডিসপ্লে সমৃদ্ধ ভ্যাকুয়াম ফ্লাস্ক। পানীয়ের সঠিক তাপমাত্রা জানা যায় এক স্পর্শেই। ২৪ ঘণ্টা গরম এবং ১২ ঘণ্টা ঠান্ডা ধরে রাখে।",
    shortDescription: "টাচ টেম্পারেচার ডিসপ্লে, ডাবল-ওয়াল ভ্যাকুয়াম ও ফুড-গ্রেড স্টেইনলেস স্টিল।",
    basePrice: 950,
    salePrice: 650,
    costPrice: 420,
    sku: "RMX-FLSK-500",
    stock: 40,
    status: "ACTIVE",
    averageRating: 4.8,
    reviewsCount: 112,
    isFeatured: true,
    isFlashSale: true,
    soldCount: 38,
    limitCount: 50,
    soldPercent: 76,
    categoryId: "cat-travel",
    brandId: "brand-remax",
    category: mockCategories[3],
    brand: mockBrands[4],
    features: [
      "টাচ সেন্সর এইচডি টেম্পারেচার ডিসপ্লে",
      "ডাবল লেয়ার ৩০৪ স্টেইনলেস স্টিল ইনসুলেশন",
      "লিক-প্রুফ সিলিকন সিলিং ক্যাপ",
      "টি ফিল্টার স্ট্রেইনার ইনক্লুডেড"
    ],
    specifications: [
      { label: "ব্র্যান্ড", value: "Remax" },
      { label: "ক্যাপাসিটি", value: "500 ml" },
      { label: "ম্যাটেরিয়াল", value: "SUS 304 Stainless Steel" },
      { label: "ইনসুলেশন", value: "12-24 Hours Hot/Cold" }
    ],
    reviews: sampleReviews,
    images: [
      { id: "img-fs-3-1", productId: "fs-3", imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-fs-3-1",
        productId: "fs-3",
        sku: "RMX-FLSK-BLK",
        price: 650,
        stock: 40,
        selectedOptions: [{ id: "opt-flsk-c-blk", attributeId: "attr-color", attributeName: "কালার", value: "Midnight Black", meta: "#000000" }]
      }
    ]
  },
  {
    id: "fs-4",
    name: "Xiaomi Eco Smart LED Motion Sensor Night Light (Rechargeable Magnetic Base)",
    nameEn: "Xiaomi Eco Smart Motion Sensor Night Light",
    slug: "xiaomi-eco-motion-sensor-light",
    description: "স্বয়ংক্রিয় মোশন সেন্সর বিশিষ্ট রিচার্জেবল নাইট লাইট। রাতে হাঁটাচলা করার সময় স্বয়ংক্রিয়ভাবে আলো জ্বলে উঠবে। দেওয়ালে বা আলমারিতে ম্যাগনেট দিয়ে সহজে লাগানো যায়।",
    shortDescription: "ডুয়াল সেন্সর প্রযুক্তি, ওয়ার্ম আই-প্রটেক্টিভ লাইট ও ম্যাগনেটিক মাউন্ট।",
    basePrice: 850,
    salePrice: 550,
    costPrice: 350,
    sku: "MI-ECO-NL-01",
    stock: 50,
    status: "ACTIVE",
    averageRating: 4.9,
    reviewsCount: 94,
    isFeatured: true,
    isFlashSale: true,
    soldCount: 45,
    limitCount: 60,
    soldPercent: 75,
    categoryId: "cat-electronics",
    brandId: "brand-xiaomi",
    category: mockCategories[1],
    brand: mockBrands[5],
    features: [
      "১০০ ডিগ্রি ওয়াইড অ্যাঙ্গেল ইনফ্রারেড মোশন সেন্সর",
      "চোখের জন্য আরামদায়ক ওয়ার্ম হোয়াইট আলো",
      "ম্যাগনেটিক বেস থাকায় যেকোনো স্থানে স্থাপন করা সহজ",
      "এক চার্জে ৯০ দিন পর্যন্ত ব্যাকআপ"
    ],
    specifications: [
      { label: "ব্র্যান্ড", value: "Xiaomi Eco" },
      { label: "সেন্সর রেঞ্জ", value: "0-3 Meters, 120°" },
      { label: "ব্যাটারি", value: "Rechargeable 500mAh" },
      { label: "চার্জিং", value: "Micro USB" }
    ],
    reviews: sampleReviews,
    images: [
      { id: "img-fs-4-1", productId: "fs-4", imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-fs-4-1",
        productId: "fs-4",
        sku: "MI-NL-WARM",
        price: 550,
        stock: 50,
        selectedOptions: [{ id: "opt-c-warm", attributeId: "attr-color", attributeName: "আলোর ধরন", value: "Warm Yellow", meta: "#FFD700" }]
      }
    ]
  },
  // --- NEW ARRIVALS & BEST SELLERS ---
  {
    id: "prod-5",
    name: "Waterproof Multi-Compartment Laptop Backpack with USB Charging Port",
    nameEn: "Waterproof Travel & Laptop Backpack",
    slug: "waterproof-laptop-travel-backpack",
    description: "অফিস, ইউনিভার্সিটি এবং ভ্রমণের জন্য প্রিমিয়াম ওয়াটারপ্রুফ ব্যাকপ্যাক। এতে ১৫.৬ ইঞ্চি ল্যাপটপ কমপার্টমেন্ট, হিডেন অ্যান্টি-থেফট পকেট এবং এক্সটার্নাল USB চার্জিং পোর্ট রয়েছে।",
    shortDescription: "১৫.৬ ইঞ্চি ল্যাপটপ স্লট, ওয়াটারপ্রুফ অক্সফোর্ড ফেব্রিক ও এর্গোনমিক ডিজাইন।",
    basePrice: 2200,
    salePrice: 1650,
    costPrice: 1100,
    sku: "TRV-BPK-15",
    stock: 22,
    status: "ACTIVE",
    averageRating: 4.8,
    reviewsCount: 29,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    categoryId: "cat-travel",
    brandId: "brand-remax",
    category: mockCategories[3],
    brand: mockBrands[4],
    features: [
      "উচ্চমানের ওয়াটারপ্রুফ হাই-ডেনসিটি পলিয়েস্টার ম্যাটেরিয়াল",
      "প্যাডেড শকপ্রুফ ল্যাপটপ সেকশন",
      "বিল্ট-ইন এক্সটার্নাল USB চার্জিং পোর্ট",
      "ল্যাগিজ স্ট্র্যাপ সুবিধা"
    ],
    specifications: [
      { label: "ক্যাপাসিটি", value: "25 Liters" },
      { label: "ল্যাপটপ সাইজ", value: "Up to 15.6 Inches" },
      { label: "ম্যাটেরিয়াল", value: "Waterproof Oxford Fabric" }
    ],
    reviews: sampleReviews,
    images: [
      { id: "img-5-1", productId: "prod-5", imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-5-1",
        productId: "prod-5",
        sku: "TRV-BPK-GRY",
        price: 1650,
        stock: 22,
        selectedOptions: [{ id: "opt-bpk-gry", attributeId: "attr-color", attributeName: "কালার", value: "Charcoal Gray", meta: "#36454F" }]
      }
    ]
  },
  {
    id: "prod-6",
    name: "Automatic Electric Water Dispenser Pump (Rechargeable USB)",
    nameEn: "Automatic Electric Water Dispenser Pump",
    slug: "automatic-electric-water-dispenser-pump",
    description: "ভারী মিনারেল ওয়াটার জার তোলা বা উল্টানোর ঝামেলা ছাড়াই সহজে এক ক্লিকে পানি তুলুন। ফুড-গ্রেড সিলিকন পাইপ ও ১২০০mAh রিচার্জেবল ব্যাটারি সমৃদ্ধ।",
    shortDescription: "এক টাচে পানি বের করার সুবিধা, USB রিচার্জেবল ও ফুট-গ্রেড সিলিকন।",
    basePrice: 750,
    salePrice: 499,
    costPrice: 310,
    sku: "HOM-WTR-PMP",
    stock: 60,
    status: "ACTIVE",
    averageRating: 4.7,
    reviewsCount: 140,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    categoryId: "cat-home-kitchen",
    category: mockCategories[2],
    features: [
      "এক ক্লিকে স্বয়ংক্রিয় দ্রুত পানি পাম্প করার ব্যবস্থা",
      "বিপিএ ফ্রি ফুড গ্রেড সিলিকন হোস",
      "একবার ফুল চার্জে ৪-৬টি বড় পানির জার ব্যবহার উপযোগী"
    ],
    specifications: [
      { label: "ব্যাটারি", value: "1200 mAh USB Rechargeable" },
      { label: "ম্যাটেরিয়াল", value: "Food-grade ABS + Silicon Tube" },
      { label: "উপযোগী", value: "Standard 19-20L Water Jars" }
    ],
    reviews: sampleReviews,
    images: [
      { id: "img-6-1", productId: "prod-6", imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80", isPrimary: true }
    ],
    variants: [
      {
        id: "var-6-1",
        productId: "prod-6",
        sku: "HOM-WTR-PMP-WHT",
        price: 499,
        stock: 60,
        selectedOptions: [{ id: "opt-c-pmp-wht", attributeId: "attr-color", attributeName: "কালার", value: "Arctic White", meta: "#FFFFFF" }]
      }
    ]
  }
];

// Hero and Promotional Banners
export const mockBanners: Banner[] = [
  {
    id: "banner-hero-1",
    title: "আপনার পছন্দের পণ্য, এখন এক ঠিকানায়।",
    subtitle: "দৈনন্দিন জীবনের প্রয়োজনীয় গ্যাজেট, ইলেকট্রনিক্স ও লাইফস্টাইল পণ্য নির্বাচন করুন পঞ্চমুখ থেকে।",
    buttonText: "Shop Now",
    buttonUrl: "/shop",
    imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1920&auto=format&fit=crop&q=80",
    mobileImageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
    position: "HERO",
    isActive: true,
    sortOrder: 1
  },
  {
    id: "banner-promo-1",
    title: "Make Everyday Life Better",
    subtitle: "Discover our curated collections designed for modern Bangladeshi homes.",
    buttonText: "Explore Collection",
    buttonUrl: "/shop",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1280&auto=format&fit=crop&q=80",
    position: "PROMOTIONAL",
    isActive: true,
    sortOrder: 2
  }
];

// Initial mock site settings
export const initialSiteSettings = {
  announcementText: "🚚 সারা বাংলাদেশে হোম ডেলিভারি | Cash on Delivery Available",
  announcementActive: true,
  brandName: "PONCHOMUKH",
  brandNameBn: "পঞ্চমুখ",
  tagline: "পছন্দে, প্রয়োজনে, প্রাপ্তিতে — পঞ্চমুখ।",
  phone: "+880 1700-000000",
  whatsapp: "+880 1700-000000",
  email: "support@ponchomukh.com",
  address: "House 12, Road 4, Dhanmondi, Dhaka-1205, Bangladesh",
  insideDhakaFee: 60,
  outsideDhakaFee: 120,
  socialLinks: {
    facebook: "https://facebook.com/ponchomukh",
    instagram: "https://instagram.com/ponchomukh",
    whatsapp: "https://wa.me/8801700000000",
    tiktok: "https://tiktok.com/@ponchomukh",
    youtube: "https://youtube.com/@ponchomukh"
  }
};
