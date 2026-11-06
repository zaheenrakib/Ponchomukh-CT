"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Download,
  Calendar,
  Search,
  Filter,
  Users,
  ShoppingBag,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  ArrowUpDown,
  RefreshCw,
  Eye,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  DollarSign,
  Wallet,
  Receipt,
  CalendarRange,
  X,
  PieChart
} from "lucide-react";

interface OrderItemProduct {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderRecord {
  orderId: string;
  id?: string;
  date: string;
  rawDate?: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  items: OrderItemProduct[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
}

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  joinedDate: string;
  rawJoinedDate?: string;
  totalOrders: number;
  totalSpent: number;
  status: string;
}

interface LedgerRecord {
  id: string;
  type: "EXPENSE" | "PURCHASE" | "COLLECTION";
  title: string;
  category: string;
  amount: number;
  date: string;
  staffName?: string;
  staffRole?: string;
}

// Fallback orders if API is empty
const fallbackOrders: OrderRecord[] = [
  {
    orderId: "PN10025",
    date: "০৪ সেপ্টেম্বর, ২০২৬",
    rawDate: "2026-09-04",
    customer: {
      name: "তানভীর আহমেদ",
      phone: "01712-345678",
      email: "tanvir.ahmed@example.com",
      address: "বাড়ি ১২, রোড ৪, ধানমন্ডি, ঢাকা",
    },
    items: [
      {
        name: "Sonifer SF-350 Portable Rechargeable Juicer & Blender",
        quantity: 2,
        price: 1299,
      },
      {
        name: "Joyroom JR-T03S Pro ANC True Wireless Earbuds",
        quantity: 1,
        price: 1899,
      },
    ],
    subtotal: 4497,
    discount: 100,
    shippingFee: 60,
    total: 4457,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "PENDING",
    status: "PROCESSING",
  },
  {
    orderId: "PN10024",
    date: "০৪ সেপ্টেম্বর, ২০২৬",
    rawDate: "2026-09-04",
    customer: {
      name: "সুমাইয়া আক্তার",
      phone: "01823-456789",
      email: "sumaiya.akter@example.com",
      address: "সেক্টর ৩, উত্তরা, ঢাকা",
    },
    items: [
      {
        name: "Joyroom JR-T03S Pro ANC True Wireless Earbuds",
        quantity: 1,
        price: 1899,
      },
    ],
    subtotal: 1899,
    discount: 0,
    shippingFee: 60,
    total: 1959,
    paymentMethod: "bKash Online",
    paymentStatus: "PAID",
    status: "DELIVERED",
  },
  {
    orderId: "PN10023",
    date: "০৩ সেপ্টেম্বর, ২০২৬",
    rawDate: "2026-09-03",
    customer: {
      name: "রফিকুল ইসলাম",
      phone: "01934-567890",
      email: "rafiqul.islam@example.com",
      address: "জিইসি মোড়, চট্টগ্রাম",
    },
    items: [
      {
        name: "Sonifer SF-350 Portable Rechargeable Juicer & Blender",
        quantity: 1,
        price: 1299,
      },
    ],
    subtotal: 1299,
    discount: 0,
    shippingFee: 120,
    total: 1419,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "PENDING",
    status: "SHIPPED",
  },
  {
    orderId: "PN10022",
    date: "০২ সেপ্টেম্বর, ২০২৬",
    rawDate: "2026-09-02",
    customer: {
      name: "নাজমুল হোসেন",
      phone: "01645-678901",
      email: "nazmul.hossain@example.com",
      address: "চৌহাট্টা, সিলেট",
    },
    items: [
      {
        name: "Ultra Smartwatch Series 9 with AMOLED Display",
        quantity: 1,
        price: 1999,
      },
      {
        name: "Sonifer SF-350 Portable Rechargeable Juicer & Blender",
        quantity: 1,
        price: 1299,
      },
    ],
    subtotal: 3298,
    discount: 200,
    shippingFee: 120,
    total: 3218,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "PENDING",
    status: "CONFIRMED",
  },
  {
    orderId: "PN10021",
    date: "০১ সেপ্টেম্বর, ২০২৬",
    rawDate: "2026-09-01",
    customer: {
      name: "তানভীর আহমেদ",
      phone: "01712-345678",
      email: "tanvir.ahmed@example.com",
      address: "বাড়ি ১২, রোড ৪, ধানমন্ডি, ঢাকা",
    },
    items: [
      {
        name: "Ultra Smartwatch Series 9 with AMOLED Display",
        quantity: 1,
        price: 1999,
      },
    ],
    subtotal: 1999,
    discount: 0,
    shippingFee: 60,
    total: 2059,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "PAID",
    status: "DELIVERED",
  },
];

const fallbackCustomers: CustomerRecord[] = [
  {
    id: "cust-1",
    name: "তানভীর আহমেদ",
    phone: "01712-345678",
    email: "tanvir.ahmed@example.com",
    joinedDate: "০১ আগস্ট, ২০২৬",
    rawJoinedDate: "2026-08-01",
    totalOrders: 4,
    totalSpent: 6450,
    status: "ACTIVE",
  },
  {
    id: "cust-2",
    name: "সুমাইয়া আক্তার",
    phone: "01823-456789",
    email: "sumaiya.akter@example.com",
    joinedDate: "১৫ আগস্ট, ২০২৬",
    rawJoinedDate: "2026-08-15",
    totalOrders: 2,
    totalSpent: 3850,
    status: "ACTIVE",
  },
  {
    id: "cust-3",
    name: "রফিকুল ইসলাম",
    phone: "01934-567890",
    email: "rafiqul.islam@example.com",
    joinedDate: "২০ আগস্ট, ২০২৬",
    rawJoinedDate: "2026-08-20",
    totalOrders: 1,
    totalSpent: 1419,
    status: "ACTIVE",
  },
  {
    id: "cust-4",
    name: "নাজমুল হোসেন",
    phone: "01645-678901",
    email: "nazmul.hossain@example.com",
    joinedDate: "২৫ আগস্ট, ২০২৬",
    rawJoinedDate: "2026-08-25",
    totalOrders: 2,
    totalSpent: 3218,
    status: "ACTIVE",
  },
];

const fallbackLedger: LedgerRecord[] = [
  {
    id: "acc-1",
    type: "EXPENSE",
    title: "ফেসবুক মেটা বিজ্ঞাপন খরচ (Ad Spend)",
    category: "MARKETING_ADS",
    amount: 3500,
    date: "2026-09-04",
    staffName: "Zaheen Rakib",
    staffRole: "SUPER_ADMIN",
  },
  {
    id: "acc-2",
    type: "EXPENSE",
    title: "স্টিকার ও প্যাকেজিং বক্স প্রিন্ট",
    category: "PACKAGING",
    amount: 1800,
    date: "2026-09-03",
    staffName: "আরিফুল ইসলাম (Staff)",
    staffRole: "STAFF",
  },
  {
    id: "acc-3",
    type: "PURCHASE",
    title: "৫০ পিস সনিফার ব্লেন্ডার স্টক ক্রয় (কেনা দাম)",
    category: "PRODUCT_PURCHASE",
    amount: 47500,
    date: "2026-09-02",
    staffName: "Zaheen Rakib",
    staffRole: "SUPER_ADMIN",
  },
  {
    id: "acc-4",
    type: "EXPENSE",
    title: "স্টেডফাস্ট ও পাঠাও কুরিয়ার পরিবহন চার্জ",
    category: "DELIVERY",
    amount: 1200,
    date: "2026-09-01",
    staffName: "সাদিয়া জাহান (Admin)",
    staffRole: "ADMIN",
  },
  {
    id: "acc-5",
    type: "COLLECTION",
    title: "কুরিয়ার ক্যাশ অন ডেলিভারি পেমেন্ট কালেকশন",
    category: "COD_COLLECTION",
    amount: 22400,
    date: "2026-09-04",
    staffName: "আরিফুল ইসলাম (Staff)",
    staffRole: "STAFF",
  },
];

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<"ORDERS" | "ACCOUNTS" | "CUSTOMERS" | "PRODUCTS">("ORDERS");
  const [isLoading, setIsLoading] = useState(true);

  const [orders, setOrders] = useState<OrderRecord[]>(fallbackOrders);
  const [customers, setCustomers] = useState<CustomerRecord[]>(fallbackCustomers);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerRecord[]>(fallbackLedger);

  // ==========================================
  // DATE-TO-DATE (তাং – তাং) FILTER CONTROLS
  // ==========================================
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Filters for Order Report
  const [selectedProduct, setSelectedProduct] = useState<string>("ALL");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("ALL");
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>("");

  // Filters for Accounts Report
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<string>("ALL");

  // Filters for Customer Report
  const [customerSearch, setCustomerSearch] = useState<string>("");

  // Load live data from APIs
  const fetchAllData = async () => {
    setIsLoading(true);

    // 1. Fetch Orders
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
          const mappedOrders: OrderRecord[] = data.orders.map((o: any) => ({
            orderId: o.orderNumber || o.id?.slice(0, 8),
            id: o.id,
            date: new Date(o.createdAt).toLocaleDateString("bn-BD", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            rawDate: o.createdAt ? o.createdAt.slice(0, 10) : undefined,
            customer: {
              name: o.shippingAddress?.name || o.user?.name || "Customer",
              phone: o.shippingAddress?.phone || o.user?.phoneNumber || "N/A",
              email: o.user?.email || "N/A",
              address: `${o.shippingAddress?.addressLine1 || ""}, ${o.shippingAddress?.district || ""}`.trim() || "Dhaka, BD",
            },
            items: (o.items || []).map((item: any) => ({
              name: item.variant?.product?.name || "Product Item",
              quantity: item.quantity,
              price: item.price,
              image: item.variant?.product?.images?.[0]?.imageUrl,
            })),
            subtotal: o.subtotal,
            discount: o.discount || 0,
            shippingFee: o.shippingFee || 60,
            total: o.total,
            paymentMethod: o.paymentMethod === "COD" ? "Cash on Delivery" : o.paymentMethod,
            paymentStatus: o.paymentStatus,
            status: o.status,
          }));

          // Merge with localStorage orders if any
          try {
            const localStored = JSON.parse(localStorage.getItem("ponchomukh_all_orders") || "[]");
            const existingIds = new Set(mappedOrders.map((o) => o.orderId));
            localStored.forEach((s: any) => {
              if (!existingIds.has(s.orderId)) {
                mappedOrders.push({
                  ...s,
                  rawDate: s.rawDate ? s.rawDate.slice(0, 10) : new Date().toISOString().slice(0, 10)
                });
              }
            });
          } catch (e) {
            console.error(e);
          }

          setOrders(mappedOrders);
        }
      }
    } catch (err) {
      console.warn("Could not fetch orders from DB API, using fallback:", err);
    }

    // 2. Fetch Customers
    try {
      const res = await fetch("/api/admin/customers");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.customers) && data.customers.length > 0) {
          setCustomers(data.customers);
        }
      }
    } catch (err) {
      console.warn("Could not fetch customers from DB API, using fallback:", err);
    }

    // 3. Fetch Accounts Ledger
    try {
      const res = await fetch("/api/admin/accounts");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.entries) && data.entries.length > 0) {
          setLedgerEntries(data.entries);
        }
      }
    } catch (err) {
      console.warn("Could not fetch accounts ledger, using fallback:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Quick Date Presets Helper
  const setQuickRange = (preset: "ALL" | "TODAY" | "LAST_7" | "THIS_MONTH" | "LAST_MONTH") => {
    const today = new Date().toISOString().slice(0, 10);
    if (preset === "ALL") {
      setStartDate("");
      setEndDate("");
    } else if (preset === "TODAY") {
      setStartDate(today);
      setEndDate(today);
    } else if (preset === "LAST_7") {
      const past = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      setStartDate(past);
      setEndDate(today);
    } else if (preset === "THIS_MONTH") {
      const now = new Date();
      const firstDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
      setStartDate(firstDay);
      setEndDate(today);
    } else if (preset === "LAST_MONTH") {
      const now = new Date();
      const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 10);
      const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().slice(0, 10);
      setStartDate(firstDayLastMonth);
      setEndDate(lastDayLastMonth);
    }
  };

  // Date In-Range Checker
  const isDateInRange = (dateStr?: string) => {
    if (!startDate && !endDate) return true;
    if (!dateStr) return true;

    let formatted = "";
    if (dateStr.includes("T")) {
      formatted = dateStr.slice(0, 10);
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      formatted = dateStr;
    } else {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        formatted = d.toISOString().slice(0, 10);
      } else {
        return true;
      }
    }

    if (startDate && formatted < startDate) return false;
    if (endDate && formatted > endDate) return false;
    return true;
  };

  // Filtered Orders strictly within date range
  const dateFilteredOrders = useMemo(() => {
    return orders.filter((o) => isDateInRange(o.rawDate || o.date));
  }, [orders, startDate, endDate]);

  // Filtered Ledger strictly within date range
  const dateFilteredLedger = useMemo(() => {
    return ledgerEntries.filter((l) => isDateInRange(l.date));
  }, [ledgerEntries, startDate, endDate]);

  // ==========================================
  // EXECUTIVE FINANCIAL LEDGER (তাং – তাং সারাংশ)
  // ==========================================
  const financialSummary = useMemo(() => {
    // 1. Total Sales (মোট বিক্রয়)
    const sales = dateFilteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    // 2. Purchases & COGS (কেনা দাম / পণ্য ক্রয়)
    const purchasesFromLedger = dateFilteredLedger
      .filter((l) => l.type === "PURCHASE")
      .reduce((sum, l) => sum + l.amount, 0);

    // Estimate COGS from orders (~65% if no purchase bills entered in period)
    const estimatedCOGS = Math.round(sales * 0.65);
    const totalPurchasesCOGS = purchasesFromLedger > 0 ? purchasesFromLedger : estimatedCOGS;

    // 3. Operating Expenses (পরিচালন খরচ)
    const totalExpenses = dateFilteredLedger
      .filter((l) => l.type === "EXPENSE")
      .reduce((sum, l) => sum + l.amount, 0);

    // 4. Net Profit (নিট মুনাফা = বিক্রয় - কেনা দাম - খরচ)
    const netProfit = sales - totalPurchasesCOGS - totalExpenses;

    return {
      sales,
      purchases: totalPurchasesCOGS,
      expenses: totalExpenses,
      netProfit,
      ordersCount: dateFilteredOrders.length,
      marginPercent: sales > 0 ? Math.round((netProfit / sales) * 100) : 0,
    };
  }, [dateFilteredOrders, dateFilteredLedger]);

  // Extract all unique product names across all orders for the product selector
  const productList = useMemo(() => {
    const pSet = new Set<string>();
    orders.forEach((o) => {
      (o.items || []).forEach((item) => {
        if (item.name) pSet.add(item.name);
      });
    });
    return Array.from(pSet).sort();
  }, [orders]);

  // ==========================================
  // PRODUCT-WISE ORDER REPORT COMPUTATIONS
  // ==========================================
  const productFilteredData = useMemo(() => {
    if (selectedProduct === "ALL") {
      // General order view within date range
      const list = dateFilteredOrders.filter((o) => {
        const matchesStatus =
          orderStatusFilter === "ALL" || o.status === orderStatusFilter;
        const matchesSearch =
          !orderSearchQuery ||
          o.orderId.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
          o.customer.name.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
          o.customer.phone.includes(orderSearchQuery);
        return matchesStatus && matchesSearch;
      });

      return {
        isProductSpecific: false,
        productName: "সকল পণ্য (All Products)",
        uniqueBuyersCount: 0,
        totalUnitsSold: 0,
        totalProductRevenue: 0,
        ordersList: list,
        buyersList: [],
      };
    }

    // A specific product is selected in this date range!
    const relevantOrders = dateFilteredOrders.filter((o) =>
      (o.items || []).some(
        (item) => item.name.toLowerCase() === selectedProduct.toLowerCase()
      )
    );

    // Collect buyer details
    const buyers: {
      customerName: string;
      phone: string;
      email: string;
      address: string;
      orderId: string;
      orderDate: string;
      quantityBought: number;
      unitPrice: number;
      lineTotal: number;
      orderStatus: string;
      paymentMethod: string;
    }[] = [];

    const uniqueBuyerIdentities = new Set<string>();
    let totalQty = 0;
    let totalRev = 0;

    relevantOrders.forEach((o) => {
      const matchingItems = (o.items || []).filter(
        (item) => item.name.toLowerCase() === selectedProduct.toLowerCase()
      );

      matchingItems.forEach((mItem) => {
        totalQty += mItem.quantity;
        const lineTotal = mItem.price * mItem.quantity;
        totalRev += lineTotal;

        const idKey = o.customer.phone || o.customer.email || o.customer.name;
        uniqueBuyerIdentities.add(idKey);

        buyers.push({
          customerName: o.customer.name,
          phone: o.customer.phone,
          email: o.customer.email,
          address: o.customer.address,
          orderId: o.orderId,
          orderDate: o.date,
          quantityBought: mItem.quantity,
          unitPrice: mItem.price,
          lineTotal: lineTotal,
          orderStatus: o.status,
          paymentMethod: o.paymentMethod,
        });
      });
    });

    return {
      isProductSpecific: true,
      productName: selectedProduct,
      uniqueBuyersCount: uniqueBuyerIdentities.size,
      totalUnitsSold: totalQty,
      totalProductRevenue: totalRev,
      ordersList: relevantOrders,
      buyersList: buyers,
    };
  }, [dateFilteredOrders, selectedProduct, orderStatusFilter, orderSearchQuery]);

  // ==========================================
  // CSV EXPORT GENERATOR (WITH UTF-8 BOM FOR EXCEL)
  // ==========================================
  const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    let csvContent = "\uFEFF";
    csvContent += headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(",") + "\n";

    rows.forEach((row) => {
      csvContent +=
        row
          .map((val) => `"${String(val ?? "").replace(/"/g, '""')}"`)
          .join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export Product-Wise Buyer Report
  const handleExportProductBuyerReport = () => {
    if (!productFilteredData.isProductSpecific) {
      handleExportAllOrders();
      return;
    }

    const safeSlug = selectedProduct.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    const dateSuffix = startDate || endDate ? `_${startDate || "start"}_to_${endDate || "end"}` : `_${new Date().toISOString().slice(0, 10)}`;
    const filename = `ponchomukh_product_buyers_${safeSlug}${dateSuffix}.csv`;

    const headers = [
      "Customer Name (গ্রাহকের নাম)",
      "Mobile Phone (মোবাইল নম্বর)",
      "Email Address (ইমেইল)",
      "Delivery Address (ডেলিভারি ঠিকানা)",
      "Order ID (অর্ডার নম্বর)",
      "Order Date (অর্ডারের তারিখ)",
      "Quantity (পরিমাণ)",
      "Unit Price (৳ এককের দাম)",
      "Line Total (৳ মোট মূল্য)",
      "Order Status (অর্ডার স্ট্যাটাস)",
      "Payment Method (পেমেন্ট পদ্ধতি)",
    ];

    const rows = productFilteredData.buyersList.map((b) => [
      b.customerName,
      b.phone,
      b.email,
      b.address,
      b.orderId,
      b.orderDate,
      b.quantityBought,
      b.unitPrice,
      b.lineTotal,
      b.orderStatus,
      b.paymentMethod,
    ]);

    downloadCSV(filename, headers, rows);
  };

  // Export Orders Report
  const handleExportAllOrders = () => {
    const dateSuffix = startDate || endDate ? `_${startDate || "start"}_to_${endDate || "end"}` : `_${new Date().toISOString().slice(0, 10)}`;
    const filename = `ponchomukh_order_report${dateSuffix}.csv`;
    const headers = [
      "Order ID",
      "Date",
      "Customer Name",
      "Customer Phone",
      "Customer Email",
      "Address",
      "Purchased Products",
      "Subtotal (৳)",
      "Discount (৳)",
      "Shipping Fee (৳)",
      "Total Amount (৳)",
      "Payment Method",
      "Payment Status",
      "Order Status",
    ];

    const rows = productFilteredData.ordersList.map((o) => [
      o.orderId,
      o.date,
      o.customer.name,
      o.customer.phone,
      o.customer.email,
      o.customer.address,
      (o.items || []).map((i) => `${i.name} (x${i.quantity})`).join(" | "),
      o.subtotal,
      o.discount,
      o.shippingFee,
      o.total,
      o.paymentMethod,
      o.paymentStatus,
      o.status,
    ]);

    downloadCSV(filename, headers, rows);
  };

  // Export Accounts Ledger Report
  const handleExportAccountsLedger = () => {
    const dateSuffix = startDate || endDate ? `_${startDate || "start"}_to_${endDate || "end"}` : `_${new Date().toISOString().slice(0, 10)}`;
    const filename = `ponchomukh_accounts_ledger${dateSuffix}.csv`;
    const headers = [
      "Date (তারিখ)",
      "Transaction Title (বিবরণ)",
      "Type (ধরণ)",
      "Category (ক্যাটাগরি)",
      "Amount (৳ পরিমাণ)",
      "Staff / Admin (অ্যাডমিন)",
    ];

    const rows = dateFilteredLedger.map((l) => [
      l.date,
      l.title,
      l.type === "EXPENSE" ? "খরচ (Expense)" : l.type === "PURCHASE" ? "ক্রয় (Purchase)" : "আদায় (Collection)",
      l.category,
      l.amount,
      l.staffName || "Admin",
    ]);

    downloadCSV(filename, headers, rows);
  };

  // Export Customer Report
  const handleExportCustomers = () => {
    const filename = `ponchomukh_customers_report_${new Date().toISOString().slice(0, 10)}.csv`;
    const headers = [
      "Customer ID",
      "Full Name (নাম)",
      "Mobile Number (ফোন)",
      "Email Address (ইমেইল)",
      "Registration Date (যোগদানের তারিখ)",
      "Total Orders (মোট অর্ডার)",
      "Lifetime Spend (৳ মোট ব্যয়)",
      "Customer Status (স্ট্যাটাস)",
    ];

    const rows = customers.map((c) => [
      c.id,
      c.name,
      c.phone,
      c.email,
      c.joinedDate,
      c.totalOrders,
      c.totalSpent,
      c.status,
    ]);

    downloadCSV(filename, headers, rows);
  };

  // Export Products Summary Report
  const handleExportProductSummary = () => {
    const dateSuffix = startDate || endDate ? `_${startDate || "start"}_to_${endDate || "end"}` : `_${new Date().toISOString().slice(0, 10)}`;
    const filename = `ponchomukh_product_sales_ledger${dateSuffix}.csv`;
    const headers = [
      "Product Name (পণ্যের নাম)",
      "Total Quantity Sold (মোট বিক্রি হয়েছে)",
      "Total Revenue Generated (৳ মোট আয়)",
      "Unique Buyers Count (ক্রেতার সংখ্যা)",
    ];

    const rows = productList.map((pName) => {
      let qty = 0;
      let rev = 0;
      const buyers = new Set<string>();

      dateFilteredOrders.forEach((o) => {
        (o.items || []).forEach((item) => {
          if (item.name.toLowerCase() === pName.toLowerCase()) {
            qty += item.quantity;
            rev += item.price * item.quantity;
            buyers.add(o.customer.phone || o.customer.email || o.customer.name);
          }
        });
      });

      return [pName, qty, rev, buyers.size];
    });

    downloadCSV(filename, headers, rows);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#3B0C04] flex items-center gap-2.5">
            <span>কাস্টমাইজড রিপোর্ট ও অ্যানালিটিক্স হাব</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#16834A] text-white font-bold flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span>CSV/Excel Export</span>
            </span>
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            তাং – তাং বিক্রয়, কেনা দাম (ক্রয়), পরিচালন খরচ, লাভ-ক্ষতি এবং পণ্যভিত্তিক ক্রেতা তালিকা
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={fetchAllData}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-[#E8DCD2] bg-white hover:bg-[#FFF7EE] text-[#3B0C04] text-xs font-bold shadow-xs transition-colors"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          {activeTab === "ORDERS" && (
            <button
              onClick={handleExportProductBuyerReport}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>
                {productFilteredData.isProductSpecific
                  ? "পণ্য ক্রেতা রিপোর্ট ডাউনলোড (CSV)"
                  : "অর্ডার রিপোর্ট ডাউনলোড (CSV)"}
              </span>
            </button>
          )}

          {activeTab === "ACCOUNTS" && (
            <button
              onClick={handleExportAccountsLedger}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>হিসাব ও খরচ রিপোর্ট ডাউনলোড (CSV)</span>
            </button>
          )}

          {activeTab === "CUSTOMERS" && (
            <button
              onClick={handleExportCustomers}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>গ্রাহক রিপোর্ট ডাউনলোড (CSV)</span>
            </button>
          )}

          {activeTab === "PRODUCTS" && (
            <button
              onClick={handleExportProductSummary}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>প্রোডাক্ট সেলস রিপোর্ট ডাউনলোড (CSV)</span>
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MASTER DATE-TO-DATE (তাং – তাং) RANGE PICKER */}
      {/* ======================================================== */}
      <div className="p-5 rounded-3xl bg-white border-2 border-[#3B0C04]/20 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CalendarRange className="w-4 h-4 text-[#3B0C04]" />
              <h2 className="text-sm font-black text-[#3B0C04]">
                কাস্টমাইজড তারিখ ফিল্টার (তাং – তাং রেঞ্জ সিলেক্টর)
              </h2>
            </div>
            <p className="text-xs text-[#6B5A52]">
              নির্দিষ্ট তারিখ হতে তারিখ পর্যন্ত বিক্রয়, কেনা দাম, খরচ ও ক্রেতাদের ফিল্টার করুন
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setQuickRange("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !startDate && !endDate
                  ? "bg-[#3B0C04] text-[#FFC40E]"
                  : "bg-[#FFF7EE] text-[#3B0C04] border border-[#E8DCD2] hover:bg-[#3B0C04] hover:text-[#FFC40E]"
              }`}
            >
              সব সময় (All)
            </button>
            <button
              onClick={() => setQuickRange("TODAY")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FFF7EE] text-[#3B0C04] border border-[#E8DCD2] hover:bg-[#3B0C04] hover:text-[#FFC40E] transition-all"
            >
              আজকে
            </button>
            <button
              onClick={() => setQuickRange("LAST_7")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FFF7EE] text-[#3B0C04] border border-[#E8DCD2] hover:bg-[#3B0C04] hover:text-[#FFC40E] transition-all"
            >
              গত ৭ দিন
            </button>
            <button
              onClick={() => setQuickRange("THIS_MONTH")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FFF7EE] text-[#3B0C04] border border-[#E8DCD2] hover:bg-[#3B0C04] hover:text-[#FFC40E] transition-all"
            >
              চলতি মাস
            </button>
            <button
              onClick={() => setQuickRange("LAST_MONTH")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FFF7EE] text-[#3B0C04] border border-[#E8DCD2] hover:bg-[#3B0C04] hover:text-[#FFC40E] transition-all"
            >
              গত মাস
            </button>
          </div>
        </div>

        {/* Inputs row */}
        <div className="pt-3 border-t border-[#E8DCD2]/60 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-5 flex items-center gap-2">
            <label className="text-xs font-bold text-[#3B0C04] whitespace-nowrap min-w-16">
              শুরুর তাং:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-semibold text-[#2B160F] focus:outline-none focus:border-[#3B0C04]"
            />
          </div>

          <div className="sm:col-span-5 flex items-center gap-2">
            <label className="text-xs font-bold text-[#3B0C04] whitespace-nowrap min-w-16">
              শেষের তাং:
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-semibold text-[#2B160F] focus:outline-none focus:border-[#3B0C04]"
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-2">
            {(startDate || endDate) && (
              <button
                onClick={() => setQuickRange("ALL")}
                className="w-full h-10 px-3 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>রিসেট</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Range Summary Pill */}
        <div className="flex items-center gap-2 text-[11px] font-bold text-[#3B0C04] bg-[#FFF7EE] px-3.5 py-2 rounded-xl border border-[#E8DCD2]">
          <span className="w-2 h-2 rounded-full bg-[#16834A] animate-pulse" />
          <span>
            {startDate || endDate
              ? `ফিল্টার সক্রিয়: ${startDate ? startDate : "সূচনা"} হতে ${endDate ? endDate : "আজ পর্যন্ত"} (মোট ${dateFilteredOrders.length} টি অর্ডার পাওয়া গেছে)`
              : `সকল সময়ের সর্বমোট হিসাব ও রিপোর্ট প্রদর্শিত হচ্ছে (মোট ${dateFilteredOrders.length} টি অর্ডার)`}
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4-PILLAR EXECUTIVE FINANCIAL SUMMARY (তাং – তাং হিসাব) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Sales (বিক্রয়) */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#16834A]/10 text-[#16834A] flex items-center justify-center font-bold text-xl">
            ৳
          </div>
          <div>
            <p className="text-[11px] text-[#8C7B72] font-bold uppercase tracking-wider">
              মোট বিক্রয় (Sales)
            </p>
            <h3 className="text-2xl font-black text-[#16834A]">
              ৳{financialSummary.sales.toLocaleString()}
            </h3>
            <span className="text-[10px] text-[#6B5A52] font-semibold">
              {financialSummary.ordersCount} টি সফল অর্ডার হতে
            </span>
          </div>
        </div>

        {/* Metric 2: Product Purchases / COGS (কেনা দাম / পণ্য ক্রয়) */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFC40E]/20 text-[#3B0C04] flex items-center justify-center font-bold text-xl">
            📦
          </div>
          <div>
            <p className="text-[11px] text-[#8C7B72] font-bold uppercase tracking-wider">
              কেনা দাম / ক্রয় (Purchases)
            </p>
            <h3 className="text-2xl font-black text-[#3B0C04]">
              ৳{financialSummary.purchases.toLocaleString()}
            </h3>
            <span className="text-[10px] text-[#8C7B72] font-semibold">
              পণ্য ক্রয় ও কাঁচামাল খরচ
            </span>
          </div>
        </div>

        {/* Metric 3: Operational Expenses (পরিচালন খরচ) */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xl">
            📉
          </div>
          <div>
            <p className="text-[11px] text-[#8C7B72] font-bold uppercase tracking-wider">
              মোট খরচ (Expenses)
            </p>
            <h3 className="text-2xl font-black text-rose-700">
              ৳{financialSummary.expenses.toLocaleString()}
            </h3>
            <span className="text-[10px] text-[#8C7B72] font-semibold">
              বিজ্ঞাপন, কুরিয়ার, প্যাকেজিং
            </span>
          </div>
        </div>

        {/* Metric 4: Net Profit (নিট মুনাফা = বিক্রয় - কেনা দাম - খরচ) */}
        <div className="p-5 rounded-2xl bg-[#3B0C04] text-[#FFFDF9] shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFC40E] text-[#3B0C04] flex items-center justify-center font-black text-xl">
            🏆
          </div>
          <div>
            <p className="text-[11px] text-[#FFC40E] font-bold uppercase tracking-wider">
              নিট মুনাফা (Net Profit)
            </p>
            <h3 className="text-2xl font-black text-[#FFC40E]">
              ৳{financialSummary.netProfit.toLocaleString()}
            </h3>
            <span className="text-[10px] text-zinc-300 font-semibold">
              বিক্রি - কেনা দাম - খরচ ({financialSummary.marginPercent}%)
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8DCD2] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("ORDERS")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "ORDERS"
              ? "bg-[#3B0C04] text-[#FFC40E] shadow-xs"
              : "text-[#6B5A52] hover:bg-[#FFF7EE]"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>অর্ডার ও পণ্যভিত্তিক ক্রেতা রিপোর্ট (Orders & Product Buyers)</span>
        </button>

        <button
          onClick={() => setActiveTab("ACCOUNTS")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "ACCOUNTS"
              ? "bg-[#3B0C04] text-[#FFC40E] shadow-xs"
              : "text-[#6B5A52] hover:bg-[#FFF7EE]"
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>আর্থিক লেজার: বিক্রয়, ক্রয় ও খরচ (Accounts Ledger)</span>
        </button>

        <button
          onClick={() => setActiveTab("CUSTOMERS")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "CUSTOMERS"
              ? "bg-[#3B0C04] text-[#FFC40E] shadow-xs"
              : "text-[#6B5A52] hover:bg-[#FFF7EE]"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>গ্রাহক রিপোর্ট (Customer Report)</span>
        </button>

        <button
          onClick={() => setActiveTab("PRODUCTS")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "PRODUCTS"
              ? "bg-[#3B0C04] text-[#FFC40E] shadow-xs"
              : "text-[#6B5A52] hover:bg-[#FFF7EE]"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>পণ্য বিক্রয় লেজার (Product Sales Ledger)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ORDER REPORT WITH PRODUCT-WISE FILTERING SYSTEM */}
      {/* ======================================================== */}
      {activeTab === "ORDERS" && (
        <div className="space-y-6">
          {/* PRODUCT FILTER DROPDOWN BAR */}
          <div className="p-5 rounded-3xl bg-white border border-[#E8DCD2] shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-[#3B0C04] flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#FFC40E]" />
                  <span>পণ্যভিত্তিক ফিল্টার নির্বাচন করুন (Select Product Wise):</span>
                </label>
                <p className="text-[11px] text-[#6B5A52]">
                  কোন পণ্যটি কতজন ক্রেতা কিনেছেন এবং তাদের বিস্তারিত তালিকা দেখতে নিচের তালিকা হতে পণ্য নির্বাচন করুন
                </p>
              </div>

              {/* Product Select Dropdown */}
              <div className="w-full md:w-96">
                <div className="relative">
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full h-11 pl-4 pr-10 rounded-xl border border-[#3B0C04] bg-[#FFF7EE] text-xs font-bold text-[#3B0C04] shadow-xs outline-none cursor-pointer appearance-none"
                  >
                    <option value="ALL">📦 সকল পণ্য (All Products - সকল অর্ডার দেখুন)</option>
                    {productList.map((pName, idx) => (
                      <option key={idx} value={pName}>
                        🔍 {pName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#3B0C04] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* General Filters row (Search & Status) */}
            <div className="pt-3 border-t border-[#E8DCD2]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#8C7B72] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="অর্ডার আইডি, গ্রাহকের নাম বা ফোন..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs focus:outline-none focus:border-[#3B0C04]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-[11px] font-bold text-[#6B5A52] shrink-0">স্ট্যাটাস:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-semibold text-[#2B160F] outline-none"
                >
                  <option value="ALL">সব স্ট্যাটাস</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* KPI CARDS (Dramatically Changes When Product is Selected) */}
          {productFilteredData.isProductSpecific ? (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* Stat 1: Total Unique Customers */}
              <div className="p-5 rounded-2xl bg-white border-2 border-[#3B0C04] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center font-bold text-lg">
                  👥
                </div>
                <div>
                  <p className="text-[11px] text-[#8C7B72] font-bold uppercase">
                    পণ্যটি মোট ক্রেতা কিনেছেন
                  </p>
                  <h3 className="text-2xl font-black text-[#3B0C04]">
                    {productFilteredData.uniqueBuyersCount} জন গ্রাহক
                  </h3>
                  <span className="text-[10px] text-[#16834A] font-bold">অনন্য ক্রেতার সংখ্যা</span>
                </div>
              </div>

              {/* Stat 2: Total Units Sold */}
              <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFC40E]/20 text-[#3B0C04] flex items-center justify-center font-bold text-lg">
                  📦
                </div>
                <div>
                  <p className="text-[11px] text-[#8C7B72] font-bold uppercase">
                    মোট বিক্রি পরিমাণ
                  </p>
                  <h3 className="text-2xl font-black text-[#3B0C04]">
                    {productFilteredData.totalUnitsSold} টি
                  </h3>
                  <span className="text-[10px] text-[#6B5A52]">মোট ইউনিট সম্পন্ন</span>
                </div>
              </div>

              {/* Stat 3: Total Product Revenue */}
              <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#16834A]/10 text-[#16834A] flex items-center justify-center font-bold text-lg">
                  ৳
                </div>
                <div>
                  <p className="text-[11px] text-[#8C7B72] font-bold uppercase">
                    পণ্যটির মোট বিক্রয় রাজস্ব
                  </p>
                  <h3 className="text-2xl font-black text-[#16834A]">
                    ৳{productFilteredData.totalProductRevenue.toLocaleString()}
                  </h3>
                  <span className="text-[10px] text-[#16834A] font-bold">নির্বাচিত সময়সীমায় রাজস্ব</span>
                </div>
              </div>

              {/* Stat 4: Included in Orders */}
              <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#3B0C04]/10 text-[#3B0C04] flex items-center justify-center font-bold text-lg">
                  📑
                </div>
                <div>
                  <p className="text-[11px] text-[#8C7B72] font-bold uppercase">
                    অর্ডারে অন্তর্ভুক্ত
                  </p>
                  <h3 className="text-2xl font-black text-[#3B0C04]">
                    {productFilteredData.ordersList.length} টি অর্ডারে
                  </h3>
                  <span className="text-[10px] text-[#6B5A52]">আলাদা অর্ডার সংখ্যা</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#3B0C04]/10 text-[#3B0C04] flex items-center justify-center font-bold text-lg">
                  📑
                </div>
                <div>
                  <p className="text-[11px] text-[#8C7B72] font-bold">মোট অর্ডার সংখ্যা</p>
                  <h3 className="text-2xl font-black text-[#3B0C04]">
                    {productFilteredData.ordersList.length} টি
                  </h3>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#16834A]/10 text-[#16834A] flex items-center justify-center font-bold text-lg">
                  ৳
                </div>
                <div>
                  <p className="text-[11px] text-[#8C7B72] font-bold">মোট বিক্রয় রাজস্ব</p>
                  <h3 className="text-2xl font-black text-[#16834A]">
                    ৳{productFilteredData.ordersList.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()}
                  </h3>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFC40E]/20 text-[#3B0C04] flex items-center justify-center font-bold text-lg">
                  🛒
                </div>
                <div>
                  <p className="text-[11px] text-[#8C7B72] font-bold">গড় অর্ডার মূল্য (AOV)</p>
                  <h3 className="text-2xl font-black text-[#3B0C04]">
                    ৳
                    {productFilteredData.ordersList.length > 0
                      ? Math.round(
                          productFilteredData.ordersList.reduce((sum, o) => sum + (o.total || 0), 0) /
                            productFilteredData.ordersList.length
                        ).toLocaleString()
                      : 0}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {/* DETAILED TABLE: PRODUCT BUYERS TABLE OR ALL ORDERS TABLE */}
          {productFilteredData.isProductSpecific ? (
            <div className="bg-white rounded-3xl border border-[#E8DCD2] shadow-xs overflow-hidden">
              <div className="p-5 border-b border-[#E8DCD2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-[#3B0C04] flex items-center gap-2">
                    <span>"{selectedProduct}" এর ক্রেতাদের বিস্তারিত তালিকা</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#3B0C04] text-[#FFC40E] font-bold">
                      {productFilteredData.buyersList.length} টি কেনাকাটা
                    </span>
                  </h3>
                  <p className="text-xs text-[#6B5A52]">
                    এই নির্দিষ্ট পণ্যটি ক্রয়কারী গ্রাহকদের নাম, মোবাইল ফোন, ঠিকানা, অর্ডার নম্বর এবং পেমেন্ট বিস্তারিত
                  </p>
                </div>

                <button
                  onClick={handleExportProductBuyerReport}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFF7EE] border border-[#E8DCD2] hover:bg-[#3B0C04] hover:text-[#FFC40E] text-[#3B0C04] text-xs font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>তালিকাসহ এক্সপোর্ট করুন (CSV)</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#E8DCD2] bg-[#FFFDF9] text-[#8C7B72] font-bold">
                      <th className="py-3 px-4">গ্রাহকের নাম (Customer)</th>
                      <th className="py-3 px-4">মোবাইল ফোন ও যোগাযোগ</th>
                      <th className="py-3 px-4">ডেলিভারি ঠিকানা</th>
                      <th className="py-3 px-4">অর্ডার আইডি ও তারিখ</th>
                      <th className="py-3 px-4 text-center">পরিমাণ</th>
                      <th className="py-3 px-4 text-right">একক মূল্য</th>
                      <th className="py-3 px-4 text-right">মোট মূল্য</th>
                      <th className="py-3 px-4 text-center">অর্ডার স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DCD2]/60">
                    {productFilteredData.buyersList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-[#8C7B72] font-semibold">
                          নির্বাচিত তারিখের পরিসীমায় এই পণ্যের কোনো কেনাকাটার তথ্য পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      productFilteredData.buyersList.map((buyer, idx) => (
                        <tr key={idx} className="hover:bg-[#FFF7EE]/30 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#2B160F]">
                            {buyer.customerName}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-[#3B0C04]">{buyer.phone}</div>
                            <div className="text-[11px] text-[#8C7B72]">{buyer.email}</div>
                          </td>
                          <td className="py-3.5 px-4 text-[#6B5A52] max-w-xs truncate" title={buyer.address}>
                            {buyer.address}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-mono font-bold text-[#3B0C04]">#{buyer.orderId}</span>
                            <div className="text-[10px] text-[#8C7B72]">{buyer.orderDate}</div>
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-[#2B160F]">
                            {buyer.quantityBought} টি
                          </td>
                          <td className="py-3.5 px-4 text-right font-medium text-[#6B5A52]">
                            ৳{buyer.unitPrice.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-right font-black text-[#16834A]">
                            ৳{buyer.lineTotal.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F6F1] text-[#16834A]">
                              {buyer.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* ALL ORDERS TABLE */
            <div className="bg-white rounded-3xl border border-[#E8DCD2] shadow-xs overflow-hidden">
              <div className="p-5 border-b border-[#E8DCD2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-[#3B0C04]">
                    অর্ডার রিপোর্ট ({productFilteredData.ordersList.length} টি অর্ডার)
                  </h3>
                  <p className="text-xs text-[#6B5A52]">
                    নির্বাচিত তারিখের সকল অর্ডারের সমন্বিত রিপোর্ট এক্সেল ও সিএসভি আকারে ডাউনলোডযোগ্য
                  </p>
                </div>
                <button
                  onClick={handleExportAllOrders}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFF7EE] border border-[#E8DCD2] hover:bg-[#3B0C04] hover:text-[#FFC40E] text-[#3B0C04] text-xs font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>সম্পূর্ণ তালিকা এক্সপোর্ট করুন (CSV)</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#E8DCD2] bg-[#FFFDF9] text-[#8C7B72] font-bold">
                      <th className="py-3 px-4">অর্ডার আইডি</th>
                      <th className="py-3 px-4">তারিখ</th>
                      <th className="py-3 px-4">গ্রাহকের নাম ও ফোন</th>
                      <th className="py-3 px-4">অর্ডারকৃত পণ্যসমূহ</th>
                      <th className="py-3 px-4 text-right">মোট টাকা</th>
                      <th className="py-3 px-4">পেমেন্ট</th>
                      <th className="py-3 px-4 text-center">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DCD2]/60">
                    {productFilteredData.ordersList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-[#8C7B72] font-semibold">
                          নির্বাচিত তারিখ বা ফিল্টারে কোনো অর্ডার পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      productFilteredData.ordersList.map((order, idx) => (
                        <tr key={idx} className="hover:bg-[#FFF7EE]/30 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-[#3B0C04]">
                            #{order.orderId}
                          </td>
                          <td className="py-3.5 px-4 text-[#6B5A52] whitespace-nowrap">
                            {order.date}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#2B160F]">{order.customer.name}</div>
                            <div className="text-[11px] text-[#8C7B72]">{order.customer.phone}</div>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs text-[#6B5A52]">
                            {(order.items || [])
                              .map((i) => `${i.name} (x${i.quantity})`)
                              .join(", ")}
                          </td>
                          <td className="py-3.5 px-4 text-right font-black text-[#16834A]">
                            ৳{order.total.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-[#6B5A52]">
                            {order.paymentMethod}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF7EE] text-[#3B0C04] border border-[#E8DCD2]">
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: FINANCIAL ACCOUNTS LEDGER (বিক্রয়, ক্রয় ও খরচ) */}
      {/* ======================================================== */}
      {activeTab === "ACCOUNTS" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#E8DCD2] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#E8DCD2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-[#3B0C04]">
                  আর্থিক লেজার রিপোর্ট (ক্রয়, খরচ ও কালেকশন)
                </h3>
                <p className="text-xs text-[#6B5A52]">
                  নির্বাচিত তারিখের সকল ব্যয়, ক্রয় ও আয়ের সমন্বিত হিসাব
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={ledgerTypeFilter}
                  onChange={(e) => setLedgerTypeFilter(e.target.value)}
                  className="h-9 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-semibold text-[#2B160F]"
                >
                  <option value="ALL">সকল লেনদেন</option>
                  <option value="EXPENSE">শুধু খরচ (Expenses)</option>
                  <option value="PURCHASE">শুধু ক্রয় (Purchases)</option>
                  <option value="COLLECTION">শুধু আদায় (Collections)</option>
                </select>

                <button
                  onClick={handleExportAccountsLedger}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#3B0C04] text-[#FFC40E] text-xs font-bold hover:bg-[#260700] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>লেজার এক্সপোর্ট (CSV)</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E8DCD2] bg-[#FFFDF9] text-[#8C7B72] font-bold">
                    <th className="py-3 px-4">তারিখ (Date)</th>
                    <th className="py-3 px-4">বিবরণ / শিরোনাম</th>
                    <th className="py-3 px-4">ধরণ (Type)</th>
                    <th className="py-3 px-4">ক্যাটাগরি</th>
                    <th className="py-3 px-4">রেকর্ডকারী স্টাফ</th>
                    <th className="py-3 px-4 text-right">পরিমাণ (Amount)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DCD2]/60">
                  {dateFilteredLedger
                    .filter((l) => ledgerTypeFilter === "ALL" || l.type === ledgerTypeFilter)
                    .map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#FFF7EE]/30 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-[#6B5A52] whitespace-nowrap">
                          {item.date}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#2B160F]">
                          {item.title}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.type === "EXPENSE"
                                ? "bg-rose-50 text-rose-700"
                                : item.type === "PURCHASE"
                                ? "bg-amber-50 text-amber-800"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {item.type === "EXPENSE"
                              ? "পরিচালন খরচ"
                              : item.type === "PURCHASE"
                              ? "পণ্য ক্রয়"
                              : "আদায়"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#8C7B72]">
                          {item.category}
                        </td>
                        <td className="py-3.5 px-4 text-[#6B5A52]">
                          {item.staffName || "Admin"}
                        </td>
                        <td className="py-3.5 px-4 text-right font-black text-sm">
                          <span
                            className={
                              item.type === "COLLECTION"
                                ? "text-[#16834A]"
                                : item.type === "PURCHASE"
                                ? "text-[#3B0C04]"
                                : "text-rose-700"
                            }
                          >
                            {item.type === "EXPENSE" ? "-" : item.type === "PURCHASE" ? "-" : "+"}৳
                            {item.amount.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: CUSTOMER REPORT & DOWNLOAD */}
      {/* ======================================================== */}
      {activeTab === "CUSTOMERS" && (
        <div className="space-y-6">
          {/* Customer Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#3B0C04]/10 text-[#3B0C04] flex items-center justify-center font-bold text-lg">
                👥
              </div>
              <div>
                <p className="text-[11px] text-[#8C7B72] font-bold">মোট নিবন্ধিত গ্রাহক</p>
                <h3 className="text-2xl font-black text-[#3B0C04]">{customers.length} জন</h3>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#16834A]/10 text-[#16834A] flex items-center justify-center font-bold text-lg">
                ✅
              </div>
              <div>
                <p className="text-[11px] text-[#8C7B72] font-bold">সক্রিয় গ্রাহক</p>
                <h3 className="text-2xl font-black text-[#16834A]">
                  {customers.filter((c) => c.status === "ACTIVE").length} জন
                </h3>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFC40E]/20 text-[#3B0C04] flex items-center justify-center font-bold text-lg">
                ৳
              </div>
              <div>
                <p className="text-[11px] text-[#8C7B72] font-bold">গ্রাহকদের মোট ব্যয়</p>
                <h3 className="text-2xl font-black text-[#3B0C04]">
                  ৳{customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0).toLocaleString()}
                </h3>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center font-bold text-lg">
                📊
              </div>
              <div>
                <p className="text-[11px] text-[#8C7B72] font-bold">গড় গ্রাহক মূল্য (CLV)</p>
                <h3 className="text-2xl font-black text-[#3B0C04]">
                  ৳
                  {customers.length > 0
                    ? Math.round(
                        customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0) /
                          customers.length
                      ).toLocaleString()
                    : 0}
                </h3>
              </div>
            </div>
          </div>

          {/* Customer Search & Filter */}
          <div className="bg-white p-4 rounded-3xl border border-[#E8DCD2] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#8C7B72] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="গ্রাহকের নাম, ফোন বা ইমেইল খুঁজুন..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs focus:outline-none focus:border-[#3B0C04]"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCustomers}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16834A] text-white text-xs font-bold hover:bg-[#11693a] transition-all shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>গ্রাহক রিপোর্ট ডাউনলোড (CSV)</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E8DCD2] bg-[#FFFDF9] text-[#8C7B72] font-bold">
                    <th className="py-3 px-4">গ্রাহকের নাম (Customer)</th>
                    <th className="py-3 px-4">মোবাইল ফোন</th>
                    <th className="py-3 px-4">ইমেইল</th>
                    <th className="py-3 px-4">যোগদানের তারিখ</th>
                    <th className="py-3 px-4 text-center">মোট অর্ডার</th>
                    <th className="py-3 px-4 text-right">মোট ব্যয় (৳)</th>
                    <th className="py-3 px-4 text-center">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DCD2]/60">
                  {customers
                    .filter((c) => {
                      const q = customerSearch.toLowerCase();
                      return (
                        c.name.toLowerCase().includes(q) ||
                        c.phone.includes(q) ||
                        c.email.toLowerCase().includes(q)
                      );
                    })
                    .map((cust) => (
                      <tr key={cust.id} className="hover:bg-[#FFF7EE]/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#2B160F]">{cust.name}</td>
                        <td className="py-3.5 px-4 font-semibold text-[#3B0C04]">{cust.phone}</td>
                        <td className="py-3.5 px-4 text-[#6B5A52]">{cust.email}</td>
                        <td className="py-3.5 px-4 text-[#8C7B72]">{cust.joinedDate}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-[#2B160F]">
                          {cust.totalOrders} টি
                        </td>
                        <td className="py-3.5 px-4 text-right font-black text-[#16834A]">
                          ৳{cust.totalSpent.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              cust.status === "ACTIVE"
                                ? "bg-[#E8F6F1] text-[#16834A]"
                                : "bg-rose-50 text-rose-700"
                            }`}
                          >
                            {cust.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: PRODUCT SALES LEDGER */}
      {/* ======================================================== */}
      {activeTab === "PRODUCTS" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#E8DCD2] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#E8DCD2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-[#3B0C04]">
                  পণ্যভিত্তিক সর্বমোট বিক্রয় ও ক্রেতা লেজার
                </h3>
                <p className="text-xs text-[#6B5A52]">
                  নির্বাচিত তারিখের পরিসীমায় প্রতিটি পণ্যের মোট বিক্রিত পরিমাণ, রাজস্ব এবং ক্রেতার সংখ্যা
                </p>
              </div>
              <button
                onClick={handleExportProductSummary}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#3B0C04] text-[#FFC40E] text-xs font-bold hover:bg-[#260700] transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>লেজার এক্সপোর্ট করুন (CSV)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E8DCD2] bg-[#FFFDF9] text-[#8C7B72] font-bold">
                    <th className="py-3 px-4">পণ্যের নাম (Product Title)</th>
                    <th className="py-3 px-4 text-center">মোট বিক্রিত ইউনিট</th>
                    <th className="py-3 px-4 text-center">মোট অনন্য ক্রেতা (Buyers)</th>
                    <th className="py-3 px-4 text-right">মোট বিক্রয় মূল্য (Revenue)</th>
                    <th className="py-3 px-4 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DCD2]/60">
                  {productList.map((pName, idx) => {
                    let units = 0;
                    let revenue = 0;
                    const buyerSet = new Set<string>();

                    dateFilteredOrders.forEach((o) => {
                      (o.items || []).forEach((item) => {
                        if (item.name.toLowerCase() === pName.toLowerCase()) {
                          units += item.quantity;
                          revenue += item.price * item.quantity;
                          buyerSet.add(o.customer.phone || o.customer.email || o.customer.name);
                        }
                      });
                    });

                    return (
                      <tr key={idx} className="hover:bg-[#FFF7EE]/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#2B160F]">{pName}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-[#3B0C04]">
                          {units} টি
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-[#16834A]">
                          {buyerSet.size} জন
                        </td>
                        <td className="py-3.5 px-4 text-right font-black text-[#16834A]">
                          ৳{revenue.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedProduct(pName);
                              setActiveTab("ORDERS");
                            }}
                            className="px-3 py-1 rounded-lg bg-[#FFF7EE] text-[#3B0C04] hover:bg-[#3B0C04] hover:text-[#FFC40E] text-[11px] font-bold border border-[#E8DCD2] transition-colors"
                          >
                            ক্রেতাদের দেখুন →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
