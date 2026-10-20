export type Language = "bn" | "en";

export interface Translations {
  common: {
    brandName: string;
    tagline: string;
    currency: string;
    hotline: string;
    hotlineNumber: string;
    whatsapp: string;
    officialStore: string;
    allRightsReserved: string;
    close: string;
    back: string;
    save: string;
    loading: string;
  };
  announcement: {
    text: string;
    officialStore: string;
  };
  nav: {
    home: string;
    categories: string;
    allCategories: string;
    viewAllProducts: string;
    shop: string;
    allProducts: string;
    newArrivals: string;
    bestSellers: string;
    specialOffers: string;
    about: string;
    contact: string;
    searchPlaceholder: string;
    searchBtn: string;
    searchResults: string;
    pressEnter: string;
    noResults: string;
    wishlist: string;
    account: string;
    welcome: string;
    manageAccount: string;
    myAccount: string;
    myOrders: string;
    orderTracking: string;
    adminPanel: string;
    cart: string;
    hotline: string;
    subcategoriesCount: string;
    mobileMenu: string;
  };
  hero: {
    badge: string;
    titlePart1: string;
    titlePart2: string;
    subtitle: string;
    shopNow: string;
    exploreProducts: string;
    view: string;
    homeDelivery: string;
    cashOnDelivery: string;
    originalProducts: string;
    featuredWatchTitle: string;
  };
  trustBanner: {
    fastDelivery: string;
    fastDeliverySub: string;
    cod: string;
    codSub: string;
    returns: string;
    returnsSub: string;
    trusted: string;
    trustedSub: string;
  };
  categoriesSection: {
    title: string;
    subtitle: string;
    itemsCount: string;
    gadgets: string;
    electronics: string;
    homeKitchen: string;
    travel: string;
    lifestyle: string;
  };
  flashSale: {
    title: string;
    subtitle: string;
    endsIn: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    viewAllOffers: string;
    sold: string;
  };
  featured: {
    title: string;
    subtitle: string;
    all: string;
    gadgets: string;
    electronics: string;
    lifestyle: string;
    viewAll: string;
  };
  whyChoose: {
    title: string;
    fastShippingTitle: string;
    fastShippingDesc: string;
    codTitle: string;
    codDesc: string;
    originalTitle: string;
    originalDesc: string;
    replacementTitle: string;
    replacementDesc: string;
  };
  reviews: {
    title: string;
    subtitle: string;
    verifiedPurchase: string;
  };
  newsletter: {
    title: string;
    subtitle: string;
    placeholder: string;
    button: string;
    success: string;
  };
  productCard: {
    addToCart: string;
    added: string;
    quickView: string;
    bestSeller: string;
    newBadge: string;
    reviews: string;
    off: string;
  };
  productModal: {
    sku: string;
    inStock: string;
    outOfStock: string;
    color: string;
    quantity: string;
    addToCart: string;
    addedToCart: string;
    viewFullDetails: string;
  };
  cart: {
    title: string;
    emptyTitle: string;
    emptySubtitle: string;
    startShopping: string;
    codNotice: string;
    subtotal: string;
    discount: string;
    shipping: string;
    total: string;
    checkout: string;
    viewCart: string;
    couponPlaceholder: string;
    applyCoupon: string;
    appliedCoupon: string;
    removeCoupon: string;
    insideDhaka: string;
    outsideDhaka: string;
    deliveryZone: string;
    freeShippingRemaining: string;
    freeShippingQualified: string;
    items: string;
    clearCart: string;
  };
  footer: {
    brandStory: string;
    quote: string;
    customerService: string;
    quickLinks: string;
    policies: string;
    contactInfo: string;
    supportTime: string;
    address: string;
    phone: string;
    email: string;
    terms: string;
    privacy: string;
    returnRefund: string;
    shipping: string;
    faq: string;
    allCategories: string;
    myOrders: string;
    trackOrder: string;
    paymentMethods: string;
  };
  mobileNav: {
    home: string;
    shop: string;
    wishlist: string;
    profile: string;
    cart: string;
  };
  language: {
    switcherLabel: string;
    bangla: string;
    english: string;
    currentLang: string;
    switchPrompt: string;
  };
}

export const translations: Record<Language, Translations> = {
  bn: {
    common: {
      brandName: "পঞ্চমুখ",
      tagline: "পছন্দে, প্রয়োজনে, প্রাপ্তিতে — পঞ্চমুখ",
      currency: "৳",
      hotline: "হটলাইন",
      hotlineNumber: "01700-000000",
      whatsapp: "হোয়াটসঅ্যাপ",
      officialStore: "অফিসিয়াল স্টোর",
      allRightsReserved: "সর্বস্বত্ব সংরক্ষিত পঞ্চমুখ।",
      close: "বন্ধ করুন",
      back: "ফিরে যান",
      save: "সংরক্ষণ করুন",
      loading: "লোড হচ্ছে...",
    },
    announcement: {
      text: "🚚 সারা বাংলাদেশে হোম ডেলিভারি | Cash on Delivery Available",
      officialStore: "অফিসিয়াল স্টোর",
    },
    nav: {
      home: "হোম",
      categories: "ক্যাটাগরি সমূহ",
      allCategories: "সকল ক্যাটাগরি",
      viewAllProducts: "সব পণ্য দেখুন →",
      shop: "সকল পণ্য",
      allProducts: "সকল পণ্য",
      newArrivals: "নতুন পণ্য",
      bestSellers: "বেস্ট সেলার",
      specialOffers: "স্পেশাল অফার",
      about: "আমাদের সম্পর্কে",
      contact: "যোগাযোগ",
      searchPlaceholder: "আপনি কী খুঁজছেন? (পণ্য বা ক্যাটাগরি)",
      searchBtn: "খুঁজুন",
      searchResults: "অনুসন্ধান ফলাফল",
      pressEnter: "Enter চাপুন",
      noResults: "কোনো ফলাফল পাওয়া যায়নি।",
      wishlist: "উইশলিস্ট",
      account: "অ্যাকাউন্ট",
      welcome: "স্বাগতম!",
      manageAccount: "আপনার অ্যাকাউন্ট পরিচালনা করুন",
      myAccount: "মাই অ্যাকাউন্ট",
      myOrders: "আমার অর্ডারসমূহ",
      orderTracking: "অর্ডার ট্র্যাকিং",
      adminPanel: "অ্যাডমিন প্যানেল",
      cart: "কার্ট",
      hotline: "হটলাইন: 01700-000000",
      subcategoriesCount: "সাব-ক্যাটাগরি",
      mobileMenu: "মেনু",
    },
    hero: {
      badge: "বাংলাদেশের নির্ভরযোগ্য অনলাইন স্টোর",
      titlePart1: "আপনার পছন্দের পণ্য,",
      titlePart2: "এখন এক ঠিকানায়।",
      subtitle: "দৈনন্দিন জীবনের প্রয়োজনীয় গ্যাজেট, ইলেকট্রনিক্স ও লাইফস্টাইল পণ্য নির্বাচন করুন পঞ্চমুখ থেকে। বিশ্বস্ত সেবা ও দ্রুততম হোম ডেলিভারি।",
      shopNow: "Shop Now",
      exploreProducts: "Explore Products",
      view: "দেখুন",
      homeDelivery: "সারা দেশে হোম ডেলিভারি",
      cashOnDelivery: "ক্যাশ অন ডেলিভারি",
      originalProducts: "১০০% অরিজিনাল পণ্য",
      featuredWatchTitle: "Hoco Y12 Ultra Smartwatch",
    },
    trustBanner: {
      fastDelivery: "দ্রুত ডেলিভারি",
      fastDeliverySub: "সারা বাংলাদেশে হোম ডেলিভারি",
      cod: "ক্যাশ অন ডেলিভারি",
      codSub: "পণ্য হাতে পেয়ে মূল্য পরিশোধ",
      returns: "৭ দিনের রিটার্ন",
      returnsSub: "সহজ রিটার্ন ও রিপ্লেসমেন্ট",
      trusted: "১০০% বিশ্বস্ত শপিং",
      trustedSub: "যাচাইকৃত ও অরিজিনাল পণ্য",
    },
    categoriesSection: {
      title: "ক্যাটাগরি ব্রাউজ করুন",
      subtitle: "আপনার প্রয়োজনীয় পণ্য সহজেই খুঁজে পেতে ক্যাটাগরি বেছে নিন",
      itemsCount: "টি পণ্য",
      gadgets: "গ্যাজেটস",
      electronics: "ইলেকট্রনিক্স",
      homeKitchen: "হোম ও কিচেন",
      travel: "ট্রাভেল এক্সেসরিজ",
      lifestyle: "লাইফস্টাইল",
    },
    flashSale: {
      title: "ফ্ল্যাশ সেল ও বিশেষ অফার",
      subtitle: "সীমিত সময়ের জন্য অবিশ্বাস্য মূল্যে আপনার পছন্দের পণ্য লুফে নিন!",
      endsIn: "অফার শেষ হতে বাকি:",
      days: "দিন",
      hours: "ঘণ্টা",
      minutes: "মিনিট",
      seconds: "সেকেন্ড",
      viewAllOffers: "সকল অফার দেখুন",
      sold: "বিক্রি হয়েছে",
    },
    featured: {
      title: "জনপ্রিয় ও সেরা পণ্যসমূহ",
      subtitle: "গ্রাহকদের সর্বোচ্চ রেটিং প্রাপ্ত ও সবচেয়ে বেশি বিক্রিত প্রিমিয়াম পণ্য",
      all: "সব পণ্য",
      gadgets: "স্মার্ট গ্যাজেটস",
      electronics: "ইলেকট্রনিক্স",
      lifestyle: "লাইফস্টাইল",
      viewAll: "সব পণ্য দেখুন",
    },
    whyChoose: {
      title: "কেন পঞ্চমুখ থেকে কিনবেন?",
      fastShippingTitle: "সারা দেশে দ্রুত ডেলিভারি",
      fastShippingDesc: "আমরা ঢাকা ও ঢাকার বাইরে অত্যন্ত যত্নসহকারে দ্রুততম সময়ে পণ্য পৌঁছে দেই।",
      codTitle: "ক্যাশ অন ডেলিভারি সুবিধা",
      codDesc: "কোনো অগ্রিম পেমেন্টের ঝুঁকি ছাড়াই পণ্য হাতে পেয়ে যাচাই করে মূল্য পরিশোধ করুন।",
      originalTitle: "১০০% অরিজিনাল পণ্যের নিশ্চয়তা",
      originalDesc: "প্রতিটি পণ্য সরাসরি প্রস্তুতকারক ও অথোরাইজড ডিস্ট্রিবিউটর থেকে সংগৃহীত।",
      replacementTitle: "৭ দিনের সহজ রিটার্ন পলিসি",
      replacementDesc: "পণ্য পাওয়ার পর কোনো সমস্যা থাকলে খুব সহজেই রিপ্লেসমেন্ট বা রিটার্ন পান।",
    },
    reviews: {
      title: "গ্রাহকদের বিশ্বস্ত মতামত",
      subtitle: "আমাদের সন্তুষ্ট গ্রাহকরা পঞ্চমুখ সম্পর্কে যা বলছেন",
      verifiedPurchase: "যাচাইকৃত ক্রেতা",
    },
    newsletter: {
      title: "বিশেষ অফারের আপডেট পেতে চান?",
      subtitle: "আমাদের নিউজলেটারে যুক্ত হয়ে এক্সক্লুসিভ ডিসকাউন্ট ও নতুন পণ্যের খবর পান সবার আগে।",
      placeholder: "আপনার ইমেইল অ্যাড্রেস লিখুন...",
      button: "সাবস্ক্রাইব করুন",
      success: "ধন্যবাদ! আপনি সফলভাবে যুক্ত হয়েছেন।",
    },
    productCard: {
      addToCart: "Add to Cart",
      added: "যোগ হয়েছে ✓",
      quickView: "কুইক ভিউ",
      bestSeller: "বেস্ট সেলার",
      newBadge: "New",
      reviews: "রিভিউ",
      off: "ছাড়",
    },
    productModal: {
      sku: "SKU:",
      inStock: "স্টকে আছে",
      outOfStock: "স্টক শেষ",
      color: "কালার / ভ্যারিয়েন্ট:",
      quantity: "পরিমাণ:",
      addToCart: "কার্টে যোগ করুন",
      addedToCart: "কার্টে যোগ হয়েছে ✓",
      viewFullDetails: "সম্পূর্ণ বিবরণ দেখুন →",
    },
    cart: {
      title: "আপনার কার্ট",
      emptyTitle: "আপনার কার্ট এখনো খালি",
      emptySubtitle: "আপনার পছন্দের পণ্য খুঁজে শপিং শুরু করুন।",
      startShopping: "এখনই শপিং শুরু করুন",
      codNotice: "সারা বাংলাদেশে ১০০% ক্যাশ অন ডেলিভারি সুবিধা!",
      subtotal: "সাবটোটাল",
      discount: "ছাড় / ডিসকাউন্ট",
      shipping: "ডেলিভারি চার্জ",
      total: "সর্বমোট",
      checkout: "চেকআউটে এগিয়ে যান",
      viewCart: "কার্ট পেজে যান",
      couponPlaceholder: "কুপন কোড (যেমন: PONCHO10)",
      applyCoupon: "প্রয়োগ",
      appliedCoupon: "প্রযুক্ত কুপন",
      removeCoupon: "বাতিল",
      insideDhaka: "ঢাকার ভেতরে (৳৬০)",
      outsideDhaka: "ঢাকার বাইরে (৳১২০)",
      deliveryZone: "ডেলিভারি এরিয়া",
      freeShippingRemaining: "ফ্রি ডেলিভারির জন্য আরও ৳{amount} এর পণ্য যোগ করুন!",
      freeShippingQualified: "অভিনন্দন! আপনি ফ্রি ডেলিভারি পেয়েছেন 🎉",
      items: "টি পণ্য",
      clearCart: "কার্ট খালি করুন",
    },
    footer: {
      brandStory: "পঞ্চমুখ একটি আধুনিক ও বিশ্বস্ত বাংলাদেশি ই-কমার্স প্ল্যাটফর্ম। দৈনন্দিন প্রয়োজনীয় গ্যাজেট, ইলেকট্রনিক্স, হোম-কিচেন ও লাইফস্টাইল পণ্য পৌঁছে দিচ্ছি আপনার দোরগোড়ায়।",
      quote: "“পছন্দে, প্রয়োজনে, প্রাপ্তিতে — পঞ্চমুখ।”",
      customerService: "গ্রাহক সেবা",
      quickLinks: "প্রয়োজনীয় লিংক",
      policies: "পলিসি ও নীতিমালা",
      contactInfo: "যোগাযোগ",
      supportTime: "সকাল ৯:০০ - রাত ১০:০০ (প্রতিদিন)",
      address: "ঢাকা, বাংলাদেশ",
      phone: "+880 1700-000000",
      email: "support@ponchomukh.com",
      terms: "শর্তাবলী ও নিয়মাবলী",
      privacy: "গোপনীয়তা নীতি",
      returnRefund: "রিটার্ন ও রিফান্ড নীতি",
      shipping: "ডেলিভারি ও শিপিং নীতি",
      faq: "সাধারণ জিজ্ঞাসা (FAQ)",
      allCategories: "ক্যাটাগরি সমূহ",
      myOrders: "আমার অর্ডারসমূহ",
      trackOrder: "অর্ডার ট্র্যাকিং",
      paymentMethods: "পেমেন্ট মাধ্যমসমূহ",
    },
    mobileNav: {
      home: "হোম",
      shop: "শপ",
      wishlist: "উইশলিস্ট",
      profile: "প্রোফাইল",
      cart: "কার্ট",
    },
    language: {
      switcherLabel: "ভাষা নির্বাচন",
      bangla: "বাংলা",
      english: "English",
      currentLang: "বাংলা",
      switchPrompt: "ভাষা পরিবর্তন করুন",
    },
  },
  en: {
    common: {
      brandName: "Ponchomukh",
      tagline: "Ponchomukh — Choice, Need, Fulfillment",
      currency: "৳",
      hotline: "Hotline",
      hotlineNumber: "01700-000000",
      whatsapp: "WhatsApp",
      officialStore: "Official Store",
      allRightsReserved: "All rights reserved by Ponchomukh.",
      close: "Close",
      back: "Back",
      save: "Save",
      loading: "Loading...",
    },
    announcement: {
      text: "🚚 Nationwide Home Delivery | Cash on Delivery Available",
      officialStore: "Official Store",
    },
    nav: {
      home: "Home",
      categories: "Categories",
      allCategories: "All Categories",
      viewAllProducts: "View All Products →",
      shop: "All Products",
      allProducts: "All Products",
      newArrivals: "New Arrivals",
      bestSellers: "Best Sellers",
      specialOffers: "Special Offers",
      about: "About Us",
      contact: "Contact",
      searchPlaceholder: "What are you looking for? (Product or Category)",
      searchBtn: "Search",
      searchResults: "Search Results",
      pressEnter: "Press Enter",
      noResults: "No products found matching your search.",
      wishlist: "Wishlist",
      account: "Account",
      welcome: "Welcome!",
      manageAccount: "Manage your account",
      myAccount: "My Account",
      myOrders: "My Orders",
      orderTracking: "Order Tracking",
      adminPanel: "Admin Panel",
      cart: "Cart",
      hotline: "Hotline: 01700-000000",
      subcategoriesCount: "sub-categories",
      mobileMenu: "Menu",
    },
    hero: {
      badge: "Bangladesh's Trusted Online Store",
      titlePart1: "Your Favorite Products,",
      titlePart2: "Now at One Destination.",
      subtitle: "Explore daily essential gadgets, electronics, and lifestyle accessories at Ponchomukh. Reliable service with fast nationwide home delivery.",
      shopNow: "Shop Now",
      exploreProducts: "Explore Products",
      view: "View",
      homeDelivery: "Home Delivery Nationwide",
      cashOnDelivery: "Cash on Delivery",
      originalProducts: "100% Genuine Products",
      featuredWatchTitle: "Hoco Y12 Ultra Smartwatch",
    },
    trustBanner: {
      fastDelivery: "Fast Delivery",
      fastDeliverySub: "Nationwide doorstep delivery",
      cod: "Cash on Delivery",
      codSub: "Pay after inspecting product",
      returns: "7 Days Return",
      returnsSub: "Easy return & replacement",
      trusted: "100% Trusted Shopping",
      trustedSub: "Verified & authentic products",
    },
    categoriesSection: {
      title: "Browse by Categories",
      subtitle: "Discover your desired products organized by category",
      itemsCount: "items",
      gadgets: "Gadgets",
      electronics: "Electronics",
      homeKitchen: "Home & Kitchen",
      travel: "Travel Accessories",
      lifestyle: "Lifestyle",
    },
    flashSale: {
      title: "Flash Sale & Limited Offers",
      subtitle: "Grab your favorite items at unbeatable discount prices before time runs out!",
      endsIn: "Offer ends in:",
      days: "Days",
      hours: "Hours",
      minutes: "Mins",
      seconds: "Secs",
      viewAllOffers: "View All Offers",
      sold: "Sold",
    },
    featured: {
      title: "Popular & Featured Products",
      subtitle: "Top-rated and best-selling premium picks handpicked for you",
      all: "All Products",
      gadgets: "Smart Gadgets",
      electronics: "Electronics",
      lifestyle: "Lifestyle",
      viewAll: "View All Products",
    },
    whyChoose: {
      title: "Why Choose Ponchomukh?",
      fastShippingTitle: "Fast Nationwide Delivery",
      fastShippingDesc: "Carefully packaged and delivered quickly to every district across Bangladesh.",
      codTitle: "Cash on Delivery",
      codDesc: "Shop with peace of mind. Pay safely in cash only when you receive your order.",
      originalTitle: "100% Genuine Assurance",
      originalDesc: "Every product is directly sourced from trusted manufacturers & authorized distributors.",
      replacementTitle: "7-Day Easy Replacement",
      replacementDesc: "Fast and hassle-free returns or replacements if any defect occurs.",
    },
    reviews: {
      title: "Customer Reviews & Feedback",
      subtitle: "See what satisfied shoppers across Bangladesh say about Ponchomukh",
      verifiedPurchase: "Verified Buyer",
    },
    newsletter: {
      title: "Stay Tuned for Exclusive Deals",
      subtitle: "Subscribe to our newsletter and be the first to know about flash discounts and new releases.",
      placeholder: "Enter your email address...",
      button: "Subscribe",
      success: "Thank you! You have been successfully subscribed.",
    },
    productCard: {
      addToCart: "Add to Cart",
      added: "Added ✓",
      quickView: "Quick View",
      bestSeller: "Best Seller",
      newBadge: "New",
      reviews: "Reviews",
      off: "OFF",
    },
    productModal: {
      sku: "SKU:",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      color: "Color / Variant:",
      quantity: "Quantity:",
      addToCart: "Add to Cart",
      addedToCart: "Added to Cart ✓",
      viewFullDetails: "View Full Details →",
    },
    cart: {
      title: "Your Shopping Cart",
      emptyTitle: "Your cart is currently empty",
      emptySubtitle: "Browse our collections and find great items you love.",
      startShopping: "Start Shopping Now",
      codNotice: "100% Cash on Delivery available all over Bangladesh!",
      subtotal: "Subtotal",
      discount: "Discount",
      shipping: "Delivery Fee",
      total: "Total",
      checkout: "Proceed to Checkout",
      viewCart: "View Cart Page",
      couponPlaceholder: "Coupon code (e.g. PONCHO10)",
      applyCoupon: "Apply",
      appliedCoupon: "Applied Coupon",
      removeCoupon: "Remove",
      insideDhaka: "Inside Dhaka (৳60)",
      outsideDhaka: "Outside Dhaka (৳120)",
      deliveryZone: "Delivery Zone",
      freeShippingRemaining: "Add ৳{amount} more to unlock Free Delivery!",
      freeShippingQualified: "Congratulations! You have unlocked Free Delivery 🎉",
      items: "items",
      clearCart: "Clear Cart",
    },
    footer: {
      brandStory: "Ponchomukh is a modern and reliable Bangladeshi e-commerce platform delivering daily essential gadgets, electronics, home-kitchen solutions, and lifestyle accessories right to your doorstep.",
      quote: "“Ponchomukh — In Choice, in Need, in Fulfillment.”",
      customerService: "Customer Care",
      quickLinks: "Quick Links",
      policies: "Policies",
      contactInfo: "Contact",
      supportTime: "9:00 AM - 10:00 PM (Everyday)",
      address: "Dhaka, Bangladesh",
      phone: "+880 1700-000000",
      email: "support@ponchomukh.com",
      terms: "Terms & Conditions",
      privacy: "Privacy Policy",
      returnRefund: "Return & Refund Policy",
      shipping: "Shipping & Delivery Policy",
      faq: "Frequently Asked Questions (FAQ)",
      allCategories: "All Categories",
      myOrders: "My Orders",
      trackOrder: "Order Tracking",
      paymentMethods: "Accepted Payments",
    },
    mobileNav: {
      home: "Home",
      shop: "Shop",
      wishlist: "Wishlist",
      profile: "Profile",
      cart: "Cart",
    },
    language: {
      switcherLabel: "Language Selector",
      bangla: "বাংলা",
      english: "English",
      currentLang: "English",
      switchPrompt: "Switch Language",
    },
  },
};
