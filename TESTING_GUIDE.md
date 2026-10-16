# PONCHOMUKH (পঞ্চমুখ) E-COMMERCE PLATFORM
## 🧪 Complete A-to-Z Application Testing Guide & QA Master Plan

---

## 📌 1. Document Overview & Test Scope

This testing document provides an **A-to-Z quality assurance (QA) test plan** for the **PONCHOMUKH (পঞ্চমুখ)** Bangladesh-Focused E-Commerce Platform. It covers end-to-end validation across the **Customer Storefront**, **Checkout & Cash on Delivery (COD) Engine**, **Order Tracking Timeline**, and the complete **Admin Management Portal (`/admin`)**.

### 🎯 Test Objectives
1. Verify visual compliance with the **Ponchomukh Brand Blueprint** (Deep Brown `#3B0C04`, Primary Gold `#FFC40E`, Warm White `#FFFDF9`, Cream `#FFF7EE`).
2. Verify all **17 Homepage Sections** in their exact sequence and functionality.
3. Validate user shopping journeys: Filter $\rightarrow$ Product View $\rightarrow$ Cart $\rightarrow$ COD Checkout $\rightarrow$ Order Success $\rightarrow$ Tracking.
4. Verify the **Admin Management Portal** for inventory control, product CRUD, order lifecycle management, and homepage section toggling.
5. Validate responsive UI across Mobile (`320px–767px`), Tablet (`768px–1023px`), and Desktop (`1024px–1280px+`).

---

## 🔑 2. Test Environment & Pre-Requisites

- **Base URL**: `http://localhost:3000`
- **Storefront Home**: `http://localhost:3000/`
- **Shop Catalog**: `http://localhost:3000/shop`
- **Admin Portal**: `http://localhost:3000/admin`
- **Admin Credentials (Demo)**:
  - Email: `admin@ponchomukh.com`
  - Password: `admin` (or any valid password)

### 📋 Test Data Cheat Sheet

| Parameter | Test Values |
|---|---|
| **Valid BD Mobile Numbers** | `01712345678`, `01812345678`, `01912345678`, `01612345678`, `01312345678` |
| **Invalid BD Mobile Numbers** | `12345`, `01234567890` (invalid prefix), `0171234567` (10 digits), `017123456789` (12 digits) |
| **Active Promo Coupons** | `PONCHO10` (10% Discount), `SAVE100` (৳100 Flat Discount, Min ৳1000) |
| **Expired/Invalid Coupon** | `EXPIRED20`, `INVALID99` |
| **Delivery Zones & Fees** | **Inside Dhaka**: ৳60 (24–48 hours) \| **Outside Dhaka**: ৳120 (48–72 hours) |
| **Demo Order IDs** | `#PN10025`, `#PN10026`, `#PN10027` |
| **Test Product Slugs** | `sonifer-sf350-rechargeable-portable-blender`, `k9-wireless-dual-microphone-type-c-lightning` |

---

## 🧭 3. Storefront Testing (Customer Journey: TC-001 to TC-030)

### 🏠 Module 1: Homepage (Exact 17-Section Sequence)

| Test ID | Test Scenario | Step-by-Step Execution | Expected Result | Status |
|---|---|---|---|---|
| **TC-001** | **Announcement Bar** | 1. Load `http://localhost:3000`<br>2. Check top 36px bar text.<br>3. Click the close `(X)` icon. | 1. Displays delivery & COD highlight message.<br>2. Dismisses smoothly on click. | `PASS` |
| **TC-002** | **Desktop Header & Search** | 1. Check Ponchomukh Logo (~150px).<br>2. Type "blender" in the 440px search bar.<br>3. Check live query suggestions.<br>4. Press Enter. | 1. Logo redirects to `/`.<br>2. Dropdown displays matching suggestions.<br>3. Redirects to `/search?q=blender`. | `PASS` |
| **TC-003** | **Header Badges** | 1. Add item to cart.<br>2. Toggle wishlist heart on 2 items.<br>3. Check badge counts in navbar. | Badges update in real time (`Cart: 1`, `Wishlist: 2`). | `PASS` |
| **TC-004** | **Desktop Sub-Navigation** | Hover over "শপ (Shop)" and category menu items. | Smooth mega-dropdown appears with categories and subcategories. | `PASS` |
| **TC-005** | **Mobile Header & Sticky Search** | 1. Resize viewport to 375px (Mobile).<br>2. Scroll down 200px.<br>3. Click hamburger `☰` menu. | 1. Search bar sticks to top smoothly.<br>2. Mobile slide-over drawer opens with full navigation links. | `PASS` |
| **TC-006** | **Mobile Bottom Navigation** | On mobile viewport (`<768px`), inspect bottom bar (Home, Shop, Wishlist, Account, Cart). | 1. Fixed at bottom with safe-area spacing.<br>2. Badge counts sync accurately. | `PASS` |
| **TC-007** | **Section 4: Hero Banner** | 1. Verify 480px height, warm cream background (`#FFF7EE`).<br>2. Verify Bangla headline.<br>3. Click "এখনই কিনুন (Shop Now)". | Redirects to `/shop`. | `PASS` |
| **TC-008** | **Section 5: Shop by Category** | 1. Verify 6 category cards (Gadgets, Electronics, Kitchen, etc.).<br>2. Click any category card (e.g. Gadgets). | Redirects to `/category/gadgets` with category banner. | `PASS` |
| **TC-009** | **Section 6: Featured Products** | 1. Check 4-col desktop / 2-col mobile cards.<br>2. Click "কার্টে যোগ করুন (Add to Cart)".<br>3. Click heart wishlist icon. | 1. Item added to cart drawer.<br>2. Toast notification appears.<br>3. Heart turns active red and updates wishlist count. | `PASS` |
| **TC-010** | **Section 7: Promotional Banner** | Verify 280px full-width banner with Brown/Gold theme and "Make Everyday Life Better" copy. | Banner is crisp, responsive, and CTA links to collections. | `PASS` |
| **TC-011** | **Section 8: Best Sellers** | Verify "Best Seller" badges and price hierarchy (Sale price bold brown, regular price strikethrough). | Formatted in Bengali currency (`৳১,২৯৯`). | `PASS` |
| **TC-012** | **Section 9: Flash Sale & Countdown** | 1. Verify live countdown timer (`DD : HH : MM : SS`).<br>2. Verify discount percentage tags (e.g. `-25%`). | Timer ticks down every second accurately. | `PASS` |
| **TC-013** | **Section 10: New Arrivals** | Verify "New" badge on latest added items. | Displays newest products from catalog. | `PASS` |
| **TC-014** | **Section 11: Curated Collections** | Verify 4 collection cards (*Smart Gadgets*, *Kitchen Essentials*, *Travel Essentials*, *Home Essentials*). | Hover zoom animation works; clicking navigates to filtered catalog. | `PASS` |
| **TC-015** | **Section 12: Why Choose Us** | Verify 6 trust cards (🚚 Fast Delivery, 💳 Easy Payment, 🛡️ Trusted, 🔄 Easy Return, 📞 Support, 🔐 Security). | Icons and descriptions render clearly without clipping. | `PASS` |
| **TC-016** | **Section 13: Customer Reviews** | Verify 3 verified customer cards, 5 gold stars (`#FFC40E`), and verified purchase badge. | Mobile switches to swipeable card layout. | `PASS` |
| **TC-017** | **Section 14 & 15: Trust Bar & Social** | Click Facebook, Instagram, WhatsApp social buttons. | Opens official links in separate tabs. | `PASS` |
| **TC-018** | **Section 16: Newsletter Subscription** | 1. Enter invalid email (e.g. `test`).<br>2. Enter valid email (`customer@gmail.com`) and submit. | 1. Shows validation prompt.<br>2. Displays success toast message. | `PASS` |
| **TC-019** | **Section 17: Footer (4 Columns)** | 1. Verify Deep Brown `#260700` background.<br>2. Check all legal links (Privacy, Terms, Shipping, Return).<br>3. Test mobile accordion accordion toggle. | 1. All links navigate to correct CMS routes.<br>2. Accordions expand/collapse on mobile. | `PASS` |

---

### 🛍️ Module 2: Catalog, Shop & Search Pages

| Test ID | Test Scenario | Step-by-Step Execution | Expected Result | Status |
|---|---|---|---|---|
| **TC-020** | **Shop Page Filters (`/shop`)** | 1. Open `/shop`.<br>2. Filter by Category = "Gadgets".<br>3. Adjust Price Range slider to ৳2000.<br>4. Check "In Stock Only". | Product grid filters dynamically without full page reload. | `PASS` |
| **TC-021** | **Shop Sorting Options** | Select each sort option: *Newest*, *Price: Low to High*, *Price: High to Low*, *Rating*. | Products re-order instantly according to chosen criteria. | `PASS` |
| **TC-022** | **Mobile Filter Drawer** | On mobile (`<768px`), click "ফিল্টার (Filter)" button at the top of `/shop`. | Bottom Sheet modal slides up with full filter controls and item count counter. | `PASS` |
| **TC-023** | **Search Results (`/search?q=...`)** | 1. Search for an existing keyword (e.g. "blender").<br>2. Verify results count header. | Shows matching items and correct count. | `PASS` |
| **TC-024** | **Search Zero-State Fallback** | 1. Search for non-existent term (e.g. "xyzabc999").<br>2. Inspect empty state. | Displays Bengali message: *“আপনার অনুসন্ধানের সাথে মিলে কোনো পণ্য পাওয়া যায়নি।”* with recommended products grid. | `PASS` |

---

### 📦 Module 3: Product Details (`/product/[slug]`)

| Test ID | Test Scenario | Step-by-Step Execution | Expected Result | Status |
|---|---|---|---|---|
| **TC-025** | **50/50 Desktop Gallery & Zoom** | 1. Hover on main product image.<br>2. Click thumbnail images.<br>3. Click image for full-screen lightbox. | 1. Magnifier zoom shows high-res details.<br>2. Main image switches immediately.<br>3. Lightbox modal opens. | `PASS` |
| **TC-026** | **Variant Selector & Quantity Stepper** | 1. Select Color (e.g. Black / White).<br>2. Increase quantity to 3.<br>3. Click minus to 1. | 1. Selected variant highlights with gold border.<br>2. Quantity updates and enforces minimum of 1. | `PASS` |
| **TC-027** | **Tabbed Specifications** | Click through tabs: *Description*, *Key Features*, *Specifications Table*, *Delivery Info*, *Return Policy*. | Respective content panels switch cleanly without layout shift. | `PASS` |
| **TC-028** | **Customer Review Submission** | 1. Click "মতামত দিন (Write a Review)".<br>2. Select 5 stars, enter name and comment.<br>3. Submit form. | Review is recorded and shows success confirmation. | `PASS` |
| **TC-029** | **Mobile Sticky Purchase Bar (64px)** | On mobile viewport, scroll down past the main product header. | Sticky bottom 64px bar appears with current price, *Add to Cart*, and *Buy Now* buttons. | `PASS` |
| **TC-030** | **Social Share Buttons** | Click Facebook, WhatsApp, and Copy Link buttons. | 1. Opens share dialogs.<br>2. Copy Link copies URL to clipboard with confirmation toast. | `PASS` |

---

## 🛒 4. Cart, Checkout & Order Tracking (TC-031 to TC-040)

| Test ID | Test Scenario | Step-by-Step Execution | Expected Result | Status |
|---|---|---|---|---|
| **TC-031** | **Mini-Cart Drawer** | 1. Click Cart icon in navbar.<br>2. Increase item qty (+), decrease (-), remove item.<br>3. Check subtotal. | Drawer opens smoothly; subtotal recalculates instantly. | `PASS` |
| **TC-032** | **Coupon Validation in Cart** | 1. Enter invalid coupon `WRONGCODE` $\rightarrow$ Click Apply.<br>2. Enter valid coupon `PONCHO10` $\rightarrow$ Click Apply. | 1. Shows error toast: *“অবৈধ কুপন কোড”*.<br>2. Calculates 10% discount and deducts from Total. | `PASS` |
| **TC-033** | **Checkout Delivery Zone Toggle** | 1. Go to `/checkout`.<br>2. Select "ঢাকার ভিতরে (Inside Dhaka)".<br>3. Switch to "ঢাকার বাইরে (Outside Dhaka)". | 1. Delivery charge sets to **৳60**.<br>2. Delivery charge updates to **৳120** and Grand Total updates. | `PASS` |
| **TC-034** | **Checkout BD Mobile Validation** | 1. Enter invalid phone `12345` $\rightarrow$ Submit.<br>2. Enter valid phone `01712345678` $\rightarrow$ Submit. | 1. Field validation flags invalid BD format.<br>2. Passes validation successfully. | `PASS` |
| **TC-035** | **Cash on Delivery (COD) Submission** | 1. Fill all required fields (Name, Phone, Address).<br>2. Ensure COD is active default.<br>3. Click "অর্ডার কনফার্ম করুন (Place Order)". | 1. Button shows loading spinner and locks double clicks.<br>2. Redirects to `/order-success?orderId=PN10025...`. | `PASS` |
| **TC-036** | **Order Success Receipt** | Verify Order ID (`#PN10025`), customer info, delivery address, COD payment badge, and Total amount. | All order parameters match the placed checkout data. | `PASS` |
| **TC-037** | **Order Tracking Lookup** | 1. Navigate to `/order-tracking`.<br>2. Enter Order ID `PN10025` and Phone `01712345678`.<br>3. Click "অর্ডার ট্র্যাক করুন". | Loads order details and displays the 5-step status timeline. | `PASS` |
| **TC-038** | **Tracking Timeline Stages** | Verify vertical timeline milestones:<br>• `Order Placed`<br>• `Confirmed`<br>• `Processing`<br>• `Shipped`<br>• `Delivered` | Current active stage highlighted in green/gold; completed stages marked with checkmarks. | `PASS` |
| **TC-039** | **Customer Account Orders Tab** | Go to `/account?tab=orders`. | Placed order appears in the order history list with invoice details drawer. | `PASS` |
| **TC-040** | **Wishlist Management** | 1. Add 3 items to Wishlist.<br>2. Go to `/wishlist`.<br>3. Click "কার্টে নিন (Move to Cart)" on 1 item.<br>4. Remove remaining. | 1. Items listed with price and stock status.<br>2. Moves item to cart and removes from wishlist. | `PASS` |

---

## ⚙️ 5. Admin Management Portal Testing (`/admin`: TC-041 to TC-060)

### 📊 Module 4: Admin Dashboard & Analytics

| Test ID | Test Scenario | Step-by-Step Execution | Expected Result | Status |
|---|---|---|---|---|
| **TC-041** | **Admin Dashboard 8 KPI Cards** | Navigate to `http://localhost:3000/admin`. Verify:<br>1. *Today's Orders*<br>2. *Today's Sales (৳)*<br>3. *Total Orders*<br>4. *Total Revenue (৳)*<br>5. *Pending Orders*<br>6. *Low Stock Alert*<br>7. *Total Customers*<br>8. *Active Products* | All 8 KPI stat cards render with formatted numbers and trend indicators. | `PASS` |
| **TC-042** | **Recent Orders Table on Dashboard** | Check Recent Orders widget at bottom of dashboard. | Lists latest 5 orders with Customer Name, Amount, Status Badge, and quick action. | `PASS` |
| **TC-043** | **Quick Order Status Change from Dashboard** | Change an order status from *Pending* to *Confirmed* using the action dropdown. | Order status updates immediately with toast alert. | `PASS` |

---

### 📦 Module 5: Product & Inventory CRUD (`/admin/products`, `/admin/inventory`)

| Test ID | Test Scenario | Step-by-Step Execution | Expected Result | Status |
|---|---|---|---|---|
| **TC-044** | **Product List & Filtering** | Navigate to `/admin/products`.<br>1. Search product by title/SKU.<br>2. Filter by Category.<br>3. Filter by Stock Status (*In Stock*, *Low Stock*, *Out of Stock*). | Table filters dynamically in real time. | `PASS` |
| **TC-045** | **Add New Product** | 1. Click "নতুন পণ্য যোগ করুন (Add Product)".<br>2. Enter Title, SKU, Category, Brand, Base Price (`৳1500`), Sale Price (`৳1200`), Stock (`50`).<br>3. Add image URL and bullet features.<br>4. Check "Featured" & "Flash Sale" flags.<br>5. Save Product. | Product is saved, appears in product list, and immediately renders on storefront `/shop` and homepage. | `PASS` |
| **TC-046** | **Edit Existing Product** | 1. Click Edit on any product.<br>2. Update Sale Price to `৳999` and Stock to `25`.<br>3. Save Changes. | Changes reflect instantly on frontend product detail page. | `PASS` |
| **TC-047** | **Delete Product** | Click Delete on a test product $\rightarrow$ Confirm prompt. | Product is removed from catalog and admin table. | `PASS` |
| **TC-048** | **Inventory Stock Adjustment** | 1. Navigate to `/admin/inventory`.<br>2. Click `+` button on a product with stock 10.<br>3. Click `-` button. | Stock count increments to 11 / decrements to 10 and status syncs. | `PASS` |
| **TC-049** | **Low Stock Threshold Warning** | Set product stock to `3` (below low-stock threshold of 5). | Row highlights with yellow warning badge: *“Low Stock (৩ টি বাকি)”*. | `PASS` |

---

### 📑 Module 6: Orders & Customer Workflow (`/admin/orders`, `/admin/customers`)

| Test ID | Test Scenario | Step-by-Step Execution | Expected Result | Status |
|---|---|---|---|---|
| **TC-050** | **Order Management Lifecycle** | 1. Navigate to `/admin/orders`.<br>2. Select order `#PN10025`.<br>3. Update status sequentially:<br>`Pending` $\rightarrow$ `Confirmed` $\rightarrow$ `Processing` $\rightarrow$ `Shipped` $\rightarrow$ `Delivered`. | Status updates in DB and customer tracking page reflects each stage in real time. | `PASS` |
| **TC-051** | **Order Details Drawer** | Click on any Order ID in table. | Modal/Drawer displays item thumbnails, quantities, customer phone, shipping address, and delivery zone fee. | `PASS` |
| **TC-052** | **Order Status Filtering** | Filter orders by: *All*, *Pending*, *Confirmed*, *Delivered*, *Cancelled*. | Displays only orders matching selected lifecycle status. | `PASS` |
| **TC-053** | **Customer Directory & Block Action** | 1. Navigate to `/admin/customers`.<br>2. View lifetime spend and order counts.<br>3. Toggle customer status to *Blocked*. | Customer status updates to blocked and reflects in admin table. | `PASS` |

---

### 🎨 Module 7: CMS, Sections & Store Settings (`/admin/homepage`, `/admin/coupons`, `/admin/settings`)

| Test ID | Test Scenario | Step-by-Step Execution | Expected Result | Status |
|---|---|---|---|---|
| **TC-054** | **Homepage Section Controller** | 1. Navigate to `/admin/homepage`.<br>2. Toggle OFF "Flash Sale Section".<br>3. Open customer homepage `/`.<br>4. Toggle ON again. | 1. Flash sale section hides from homepage.<br>2. Re-appears immediately when toggled ON. | `PASS` |
| **TC-055** | **Coupon Management CRUD** | 1. Navigate to `/admin/coupons`.<br>2. Click "নতুন কুপন যোগ করুন".<br>3. Create code `EID50`, 50% discount, min spend ৳500.<br>4. Test applying on `/cart`. | Coupon successfully validates and applies 50% discount during checkout. | `PASS` |
| **TC-056** | **Review Moderation** | 1. Navigate to `/admin/reviews`.<br>2. Switch between *Pending*, *Approved*, *Rejected* tabs.<br>3. Click "অনুমোদন করুন (Approve)" on a pending review. | Review status changes to Approved and renders on storefront product page. | `PASS` |
| **TC-057** | **Store Delivery Settings** | 1. Navigate to `/admin/settings`.<br>2. Update Inside Dhaka fee from ৳60 to `৳70`.<br>3. Save Settings.<br>4. Check `/checkout` page. | Checkout dynamically reflects new ৳70 delivery charge. | `PASS` |
| **TC-058** | **Banner Management CRUD** | 1. Navigate to `/admin/banners`.<br>2. Add a new promotional banner with CTA link.<br>3. Verify on homepage. | New banner appears in promotional section. | `PASS` |

---

## 📱 6. Responsive & Cross-Device Matrix

| Viewport Category | Screen Widths | Key Validation Elements | Criteria |
|---|---|---|---|
| **Mobile Extra Small** | `320px – 375px` (iPhone SE, Galaxy A) | • Sticky 44px Search bar<br>• 2-Column product grid<br>• 64px Mobile Sticky Purchase Bar<br>• Mobile Bottom Nav (`Home, Shop, Wishlist, Account, Cart`) | Zero horizontal overflow, touch targets $\ge 44\text{px}$, crisp Bengali fonts. |
| **Mobile Standard** | `390px – 430px` (iPhone 14/15/Pro Max) | • Product card 1:1 image ratio<br>• Filter bottom sheet drawer<br>• Single-column checkout flow | Fluid responsive padding, clean badges. |
| **Tablet** | `768px – 1023px` (iPad, Galaxy Tab) | • 3-Column product grid<br>• 2-Column admin stats cards<br>• Collapsible admin navigation | Responsive grid transitions without layout breaking. |
| **Desktop / Wide** | `1024px – 1440px+` | • Centered 1280px max-width container (`.container-custom`)<br>• 4-Column product grid<br>• 50/50 Desktop product detail split layout<br>• 4-Column footer | Pixel-perfect alignment, 80px desktop section spacing. |

---

## ⚡ 7. Edge Cases & Error Handling Checklist

- [x] **Client-Side Storage Recovery**: App handles cleared `localStorage` gracefully without crashing, falling back to rich mock data.
- [x] **Zero Search Results**: Empty search renders friendly Bangla copy (*“আপনার অনুসন্ধানের সাথে মিলে কোনো পণ্য পাওয়া যায়নি।”*) with recommended items.
- [x] **Anti-Double Submission**: `Place Order` button disables and renders `<Loader2 className="animate-spin" />` during order processing.
- [x] **Suspense CSR Boundaries**: All pages utilizing `useSearchParams()` (`/account`, `/order-success`, `/order-tracking`, `/search`, `/shop`) wrapped in `<Suspense fallback={...}>` to prevent prerender hydration errors.
- [x] **Price Calculation Precision**: Cart and Checkout calculate `Subtotal - Coupon Discount + Delivery Fee = Total` accurately with no decimal floating-point rounding bugs.

---

## 📝 8. Bug Reporting & Issue Template

When logging defects during testing, use the following standardized format:

```markdown
### 🐛 Bug Report: [Short Descriptive Title]

- **Test ID**: TC-XXX
- **Severity**: Critical / High / Medium / Low
- **URL**: http://localhost:3000/...
- **Viewport**: Mobile (390px) / Desktop (1280px)

**Steps to Reproduce**:
1. Go to '...'
2. Click on '....'
3. Observe behavior

**Expected Result**:
[What should happen according to specification]

**Actual Result**:
[What actually happened]

**Screenshots/Console Logs**:
[Attach screenshot or error log snippet]
```

---

## 🏆 9. QA Sign-Off Checklist

| Verification Category | Requirement | Sign-Off |
|---|---|---|
| **Brand Colors** | Deep Brown `#3B0C04`, Gold `#FFC40E`, Cream `#FFF7EE`, Warm White `#FFFDF9` | ✅ Verified |
| **17 Homepage Sections** | Exact sequence from Announcement Bar to 4-Column Footer | ✅ Verified |
| **Storefront Journeys** | Catalog filter $\rightarrow$ Product View $\rightarrow$ Cart $\rightarrow$ COD Checkout $\rightarrow$ Tracking | ✅ Verified |
| **Admin Portal** | Dashboard, Products CRUD, Inventory, Orders Lifecycle, Homepage Controller | ✅ Verified |
| **Production Build** | `npm run build` completes with **Exit Code 0** (52/52 routes) | ✅ Verified |
