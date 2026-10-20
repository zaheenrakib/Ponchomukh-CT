"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { ProductCard } from "@/components/product-card";
import { ProductModal } from "@/components/product-modal";
import { CartDrawer } from "@/components/cart-drawer";
import { useLanguage } from "@/context/language-context";
import { mockProducts, mockCategories, mockBrands, Product, Category } from "@/lib/mockData";
import {
  Filter,
  SlidersHorizontal,
  ChevronRight,
  X,
  Star,
  Check,
  RotateCcw
} from "lucide-react";

function ShopContent() {
  const { language, t, formatPrice, formatNumber } = useLanguage();
  const searchParams = useSearchParams();
  const filterQuery = searchParams.get("filter");

  // Products and Categories Data
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  useEffect(() => {
    async function loadShopData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products?limit=100"),
          fetch("/api/categories")
        ]);

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (prodData.success && Array.isArray(prodData.products) && prodData.products.length > 0) {
            const dbIds = new Set(prodData.products.map((p: any) => p.id));
            const remainingMocks = mockProducts.filter((m) => !dbIds.has(m.id));
            setProducts([...prodData.products, ...remainingMocks]);
          }
        }

        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData.success && Array.isArray(catData.categories) && catData.categories.length > 0) {
            const mappedCats: Category[] = catData.categories.map((c: any) => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              description: c.description || "",
              imageUrl: c.imageUrl,
              subcategories: (c.children || []).map((ch: any) => ({
                id: ch.id,
                name: ch.name,
                slug: ch.slug
              }))
            }));
            setCategories(mappedCats);
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic shop catalog:", err);
      }
    }
    loadShopData();
  }, []);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(6000);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [hasDiscountOnly, setHasDiscountOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>(
    filterQuery === "new" ? "newest" : filterQuery === "bestseller" ? "popular" : "featured"
  );
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Toggle category
  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  // Toggle brand
  const toggleBrand = (slug: string) => {
    setSelectedBrands((prev) =>
      prev.includes(slug) ? prev.filter((b) => b !== slug) : [...prev, slug]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange(6000);
    setMinRating(null);
    setInStockOnly(false);
    setHasDiscountOnly(false);
    setSortBy("featured");
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter query param presets
    if (filterQuery === "new") {
      result = result.filter((p) => p.isNewArrival || !p.isBestSeller);
    } else if (filterQuery === "bestseller") {
      result = result.filter((p) => p.isBestSeller);
    } else if (filterQuery === "featured") {
      result = result.filter((p) => p.isFeatured);
    } else if (filterQuery === "offers") {
      result = result.filter((p) => p.isFlashSale || (p.salePrice && p.salePrice < p.basePrice));
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category.slug));
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter((p) => p.brand && selectedBrands.includes(p.brand.slug));
    }

    // Price filter
    result = result.filter((p) => {
      const price = p.salePrice ?? p.basePrice;
      return price <= priceRange;
    });

    // Rating filter
    if (minRating !== null) {
      result = result.filter((p) => p.averageRating >= minRating);
    }

    // In stock
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Has discount
    if (hasDiscountOnly) {
      result = result.filter((p) => p.salePrice && p.salePrice < p.basePrice);
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => (a.salePrice ?? a.basePrice) - (b.salePrice ?? b.basePrice));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => (b.salePrice ?? b.basePrice) - (a.salePrice ?? a.basePrice));
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.averageRating - a.averageRating);
    } else if (sortBy === "popular") {
      result.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else if (sortBy === "newest") {
      result.reverse();
    }

    return result;
  }, [
    products,
    filterQuery,
    selectedCategories,
    selectedBrands,
    priceRange,
    minRating,
    inStockOnly,
    hasDiscountOnly,
    sortBy
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Breadcrumb & Shop Header */}
        <div className="bg-[#FFF7EE] border-b border-[#E8DCD2] py-6">
          <div className="container-custom">
            <div className="flex items-center gap-1.5 text-xs text-[#8C7B72] mb-2">
              <Link href="/" className="hover:text-[#3B0C04]">{t("nav.home")}</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#3B0C04] font-semibold">{t("nav.shop")}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#3B0C04]">
                  {language === "bn" ? "সকল পণ্য সম্ভার" : "All Products Catalog"}
                </h1>
                <p className="text-xs sm:text-sm text-[#6B5A52] mt-0.5">
                  {language === "bn"
                    ? `মোট ${formatNumber(filteredProducts.length)}টি পণ্য পাওয়া গেছে`
                    : `Found ${filteredProducts.length} items`}
                </p>
              </div>

              {/* Mobile Filter & Sort Bar */}
              <div className="flex items-center gap-2 sm:hidden">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="flex-1 h-10 px-4 rounded-lg bg-white border border-[#E8DCD2] text-xs font-bold text-[#3B0C04] flex items-center justify-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>
                    {language === "bn"
                      ? `ফিল্টার (${formatNumber(selectedCategories.length + selectedBrands.length)})`
                      : `Filters (${selectedCategories.length + selectedBrands.length})`}
                  </span>
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 h-10 px-3 rounded-lg bg-white border border-[#E8DCD2] text-xs font-semibold text-[#2B160F] focus:outline-none"
                >
                  <option value="featured">{language === "bn" ? "Featured (প্রস্তাবিত)" : "Featured"}</option>
                  <option value="newest">{language === "bn" ? "নতুন পণ্য" : "Newest Arrivals"}</option>
                  <option value="popular">{language === "bn" ? "জনপ্রিয়" : "Most Popular"}</option>
                  <option value="price-low">{language === "bn" ? "দাম: কম থেকে বেশি" : "Price: Low to High"}</option>
                  <option value="price-high">{language === "bn" ? "দাম: বেশি থেকে কম" : "Price: High to Low"}</option>
                  <option value="rating">{language === "bn" ? "সেরা রেটিং" : "Top Rated"}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content Container (Sidebar Filter + Product Grid) */}
        <div className="container-custom py-8">
          <div className="flex gap-8">
            {/* DESKTOP FILTER SIDEBAR (240px-260px) */}
            <aside className="hidden lg:block w-64 shrink-0 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DCD2]">
                <div className="flex items-center gap-2 font-bold text-sm text-[#3B0C04]">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>{language === "bn" ? "ফিল্টার অপশন" : "Filter Options"}</span>
                </div>
                {(selectedCategories.length > 0 ||
                  selectedBrands.length > 0 ||
                  minRating !== null ||
                  inStockOnly ||
                  hasDiscountOnly ||
                  priceRange < 6000) && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-[#D64545] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{language === "bn" ? "রিসেট" : "Reset"}</span>
                  </button>
                )}
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#3B0C04] mb-3">
                  {t("nav.categories")}
                </h3>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2.5 text-xs text-[#2B160F] hover:text-[#3B0C04] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.slug)}
                        onChange={() => toggleCategory(cat.slug)}
                        className="w-4 h-4 rounded text-[#3B0C04] focus:ring-[#3B0C04] border-[#E8DCD2]"
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="pt-4 border-t border-[#E8DCD2]/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#3B0C04] mb-3">
                  {language === "bn" ? "ব্র্যান্ড" : "Brands"}
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {mockBrands.map((brand) => (
                    <label
                      key={brand.id}
                      className="flex items-center gap-2.5 text-xs text-[#2B160F] hover:text-[#3B0C04] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand.slug)}
                        onChange={() => toggleBrand(brand.slug)}
                        className="w-4 h-4 rounded text-[#3B0C04] focus:ring-[#3B0C04] border-[#E8DCD2]"
                      />
                      <span>{brand.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-4 border-t border-[#E8DCD2]/60">
                <div className="flex items-center justify-between text-xs font-bold text-[#3B0C04] mb-2">
                  <span className="uppercase tracking-wider">{language === "bn" ? "সর্বোচ্চ বাজেট" : "Max Budget"}</span>
                  <span className="text-[#3B0C04] font-black">{formatPrice(priceRange)}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="6000"
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#3B0C04]"
                />
                <div className="flex justify-between text-[11px] text-[#8C7B72] mt-1">
                  <span>{formatPrice(500)}</span>
                  <span>{formatPrice(6000)}+</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="pt-4 border-t border-[#E8DCD2]/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#3B0C04] mb-3">
                  {language === "bn" ? "রেটিং" : "Rating"}
                </h3>
                <div className="space-y-1.5">
                  {[4, 3, 2].map((stars) => (
                    <button
                      key={stars}
                      onClick={() => setMinRating(minRating === stars ? null : stars)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold transition-colors ${
                        minRating === stars
                          ? "bg-[#3B0C04] text-[#FFC40E]"
                          : "hover:bg-[#FFF7EE] text-[#2B160F]"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-current text-[#FFC40E]" />
                        <span>
                          {language === "bn"
                            ? `${formatNumber(stars)} স্টার ও তদূর্ধ্ব`
                            : `${stars} Stars & up`}
                        </span>
                      </div>
                      {minRating === stars && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability & Offers */}
              <div className="pt-4 border-t border-[#E8DCD2]/60 space-y-2">
                <label className="flex items-center gap-2.5 text-xs text-[#2B160F] font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[#3B0C04] focus:ring-[#3B0C04] border-[#E8DCD2]"
                  />
                  <span>{language === "bn" ? "শুধুমাত্র ইন-স্টক পণ্য" : "In-stock items only"}</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-[#2B160F] font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasDiscountOnly}
                    onChange={(e) => setHasDiscountOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[#3B0C04] focus:ring-[#3B0C04] border-[#E8DCD2]"
                  />
                  <span>{language === "bn" ? "ডিসকাউন্ট অফার যুক্ত পণ্য" : "Discounted items only"}</span>
                </label>
              </div>
            </aside>

            {/* PRODUCT GRID AREA */}
            <div className="flex-1">
              {/* Desktop Sort & Active Count Toolbar */}
              <div className="hidden sm:flex items-center justify-between pb-4 mb-6 border-b border-[#E8DCD2]">
                <p className="text-xs text-[#6B5A52]">
                  {language === "bn"
                    ? <>দেখাচ্ছে <span className="font-bold text-[#2B160F]">{formatNumber(filteredProducts.length)}</span> টি পণ্য</>
                    : <>Showing <span className="font-bold text-[#2B160F]">{filteredProducts.length}</span> items</>}
                </p>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#6B5A52] font-semibold">{language === "bn" ? "সর্ট করুন:" : "Sort By:"}</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-9 px-3 rounded-lg bg-white border border-[#E8DCD2] text-xs font-semibold text-[#2B160F] focus:outline-none focus:border-[#3B0C04]"
                  >
                    <option value="featured">{language === "bn" ? "Featured (প্রস্তাবিত)" : "Featured"}</option>
                    <option value="newest">{language === "bn" ? "নতুন পণ্য (Newest First)" : "Newest Arrivals"}</option>
                    <option value="popular">{language === "bn" ? "জনপ্রিয় (Most Popular)" : "Most Popular"}</option>
                    <option value="price-low">{language === "bn" ? "দাম: কম থেকে বেশি" : "Price: Low to High"}</option>
                    <option value="price-high">{language === "bn" ? "দাম: বেশি থেকে কম" : "Price: High to Low"}</option>
                    <option value="rating">{language === "bn" ? "সেরা রেটিং (Top Rated)" : "Top Rated"}</option>
                  </select>
                </div>
              </div>

              {/* Product Grid (4 desktop, 3 tablet, 2 mobile) */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 md:gap-5">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="p-12 text-center rounded-2xl bg-white border border-[#E8DCD2] space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#FFF7EE] text-[#3B0C04] mx-auto flex items-center justify-center">
                    <Filter className="w-8 h-8 text-[#3B0C04]" />
                  </div>
                  <h3 className="text-base font-bold text-[#2B160F]">
                    {language === "bn" ? "কোনো পণ্য খুঁজে পাওয়া যায়নি" : "No products found"}
                  </h3>
                  <p className="text-xs text-[#8C7B72] max-w-sm mx-auto">
                    {language === "bn"
                      ? "আপনার ফিল্টার অপশন পরিবর্তন করে আবার চেষ্টা করুন অথবা রিসেট করুন।"
                      : "Try adjusting your filter options or clear filters to see all products."}
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-2.5 rounded-lg bg-[#3B0C04] text-[#FFC40E] text-xs font-bold hover:bg-[#260700] transition-colors"
                  >
                    {language === "bn" ? "সকল ফিল্টার মুছুন" : "Clear All Filters"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE BOTTOM SHEET FILTER DRAWER */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end lg:hidden animate-in fade-in duration-200">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <div className="relative w-full max-h-[80vh] bg-white rounded-t-2xl shadow-2xl p-5 z-10 flex flex-col overflow-y-auto animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DCD2] mb-4">
                <h3 className="font-bold text-sm text-[#3B0C04] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>{language === "bn" ? "ফিল্টার অপশন" : "Filter Options"}</span>
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-md text-[#8C7B72] hover:text-[#2B160F]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Options */}
              <div className="space-y-5 pb-6">
                <div>
                  <h4 className="text-xs font-bold uppercase text-[#3B0C04] mb-2">
                    {t("nav.categories")}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.slug)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border text-left truncate transition-colors ${
                          selectedCategories.includes(cat.slug)
                            ? "bg-[#3B0C04] text-[#FFC40E] border-[#3B0C04]"
                            : "bg-[#FFFDF9] text-[#2B160F] border-[#E8DCD2]"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase text-[#3B0C04] mb-2">
                    {language === "bn" ? "সর্বোচ্চ বাজেট" : "Max Budget"}
                  </h4>
                  <div className="flex justify-between text-xs font-bold text-[#3B0C04] mb-1">
                    <span>{formatPrice(500)}</span>
                    <span>{formatPrice(priceRange)}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="6000"
                    step="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-[#3B0C04]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-[#E8DCD2]">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 h-11 rounded-lg bg-[#FFF7EE] border border-[#E8DCD2] text-xs font-bold text-[#3B0C04]"
                >
                  {language === "bn" ? "রিসেট" : "Reset"}
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 h-11 rounded-lg bg-[#3B0C04] text-[#FFC40E] text-xs font-bold"
                >
                  {language === "bn"
                    ? `ফিল্টার প্রয়োগ করুন (${formatNumber(filteredProducts.length)})`
                    : `Apply Filters (${filteredProducts.length})`}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <MobileBottomNav />
      <ProductModal />
      <CartDrawer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center p-8 text-[#3B0C04] font-bold">লোড হচ্ছে...</div>}>
      <ShopContent />
    </Suspense>
  );
}
