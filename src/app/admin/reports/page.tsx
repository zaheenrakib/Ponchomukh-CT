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
  Store,
  Globe
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
  source?: string;
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

const fallbackOrders: OrderRecord[] = [
  {
    orderId: "POS-10025",
    date: "Sep 04, 2026",
    rawDate: "2026-09-04",
    source: "POS",
    customer: {
      name: "Retail Walk-in Customer",
      phone: "01700-000000",
      email: "pos@ponchomukh.com",
      address: "In-Store Counter #01, Dhaka",
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
    shippingFee: 0,
    total: 4397,
    paymentMethod: "Cash",
    paymentStatus: "PAID",
    status: "DELIVERED",
  },
  {
    orderId: "PN10024",
    date: "Sep 04, 2026",
    rawDate: "2026-09-04",
    source: "STOREFRONT",
    customer: {
      name: "Sumaiya Akter",
      phone: "01823-456789",
      email: "sumaiya.akter@example.com",
      address: "Sector 3, Uttara, Dhaka",
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
    date: "Sep 03, 2026",
    rawDate: "2026-09-03",
    source: "LANDING_PAGE",
    customer: {
      name: "Rafiqul Islam",
      phone: "01934-567890",
      email: "rafiqul.islam@example.com",
      address: "GEC Circle, Chattogram",
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
    date: "Sep 02, 2026",
    rawDate: "2026-09-02",
    source: "STOREFRONT",
    customer: {
      name: "Nazmul Hossain",
      phone: "01645-678901",
      email: "nazmul.hossain@example.com",
      address: "Chouhatta, Sylhet",
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
    date: "Sep 01, 2026",
    rawDate: "2026-09-01",
    source: "STOREFRONT",
    customer: {
      name: "Tanvir Ahmed",
      phone: "01712-345678",
      email: "tanvir.ahmed@example.com",
      address: "House 12, Road 4, Dhanmondi, Dhaka",
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
    name: "Tanvir Ahmed",
    phone: "01712-345678",
    email: "tanvir.ahmed@example.com",
    joinedDate: "Aug 01, 2026",
    rawJoinedDate: "2026-08-01",
    totalOrders: 4,
    totalSpent: 6450,
    status: "ACTIVE",
  },
  {
    id: "cust-2",
    name: "Sumaiya Akter",
    phone: "01823-456789",
    email: "sumaiya.akter@example.com",
    joinedDate: "Aug 15, 2026",
    rawJoinedDate: "2026-08-15",
    totalOrders: 2,
    totalSpent: 3850,
    status: "ACTIVE",
  },
  {
    id: "cust-3",
    name: "Rafiqul Islam",
    phone: "01934-567890",
    email: "rafiqul.islam@example.com",
    joinedDate: "Aug 20, 2026",
    rawJoinedDate: "2026-08-20",
    totalOrders: 1,
    totalSpent: 1419,
    status: "ACTIVE",
  },
  {
    id: "cust-4",
    name: "Nazmul Hossain",
    phone: "01645-678901",
    email: "nazmul.hossain@example.com",
    joinedDate: "Aug 25, 2026",
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
    title: "Facebook Meta Ad Spend Campaign",
    category: "MARKETING_ADS",
    amount: 3500,
    date: "2026-09-04",
    staffName: "Zaheen Rakib",
    staffRole: "SUPER_ADMIN",
  },
  {
    id: "acc-2",
    type: "EXPENSE",
    title: "Sticker & Packaging Boxes Print",
    category: "PACKAGING",
    amount: 1800,
    date: "2026-09-03",
    staffName: "Ariful Islam (Staff)",
    staffRole: "STAFF",
  },
  {
    id: "acc-3",
    type: "PURCHASE",
    title: "50 Pcs Sonifer Blender Stock Purchase (COGS)",
    category: "PRODUCT_PURCHASE",
    amount: 47500,
    date: "2026-09-02",
    staffName: "Zaheen Rakib",
    staffRole: "SUPER_ADMIN",
  },
  {
    id: "acc-4",
    type: "EXPENSE",
    title: "Steadfast & Pathao Courier Transport Charge",
    category: "DELIVERY",
    amount: 1200,
    date: "2026-09-01",
    staffName: "Sadia Jahan (Admin)",
    staffRole: "ADMIN",
  },
  {
    id: "acc-5",
    type: "COLLECTION",
    title: "Courier Cash On Delivery Collection",
    category: "COD_COLLECTION",
    amount: 22400,
    date: "2026-09-04",
    staffName: "Ariful Islam (Staff)",
    staffRole: "STAFF",
  },
];

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<"ORDERS" | "ACCOUNTS" | "CUSTOMERS" | "PRODUCTS">("ORDERS");
  const [isLoading, setIsLoading] = useState(true);

  const [orders, setOrders] = useState<OrderRecord[]>(fallbackOrders);
  const [customers, setCustomers] = useState<CustomerRecord[]>(fallbackCustomers);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerRecord[]>(fallbackLedger);

  // Date Range Filters
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Sales Channel Filter
  const [channelFilter, setChannelFilter] = useState<"ALL" | "ECOMMERCE" | "POS">("ALL");

  // Filters for Order Report
  const [selectedProduct, setSelectedProduct] = useState<string>("ALL");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("ALL");
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>("");

  // Filters for Accounts Report
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<string>("ALL");

  // Filters for Customer Report
  const [customerSearch, setCustomerSearch] = useState<string>("");

  const fetchAllData = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
          const mappedOrders: OrderRecord[] = data.orders.map((o: any) => ({
            orderId: o.orderNumber || o.id?.slice(0, 8),
            id: o.id,
            date: new Date(o.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            rawDate: o.createdAt ? o.createdAt.slice(0, 10) : undefined,
            source: o.orderNotes?.includes("[POS]")
              ? "POS"
              : o.orderNotes?.includes("[LANDING_PAGE]")
              ? "LANDING_PAGE"
              : (o.source || "STOREFRONT"),
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

          // Merge local orders
          try {
            const localStored = JSON.parse(localStorage.getItem("ponchomukh_all_orders") || "[]");
            const existingIds = new Set(mappedOrders.map((o) => o.orderId));
            localStored.forEach((s: any) => {
              if (!existingIds.has(s.orderId)) {
                mappedOrders.push({
                  ...s,
                  rawDate: s.rawDate ? s.rawDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
                  source: s.source || (s.orderNotes?.includes("[POS]") ? "POS" : "STOREFRONT"),
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
      console.warn("Could not fetch orders from API:", err);
    }

    try {
      const res = await fetch("/api/admin/customers");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.customers) && data.customers.length > 0) {
          setCustomers(data.customers);
        }
      }
    } catch (err) {
      console.warn("Could not fetch customers from API:", err);
    }

    try {
      const res = await fetch("/api/admin/accounts");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.entries) && data.entries.length > 0) {
          setLedgerEntries(data.entries);
        }
      }
    } catch (err) {
      console.warn("Could not fetch accounts ledger:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

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

  // Filtered Orders strictly within Date Range AND Sales Channel
  const dateFilteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesDate = isDateInRange(o.rawDate || o.date);
      let matchesChannel = true;
      if (channelFilter === "ECOMMERCE") {
        matchesChannel = o.source === "STOREFRONT" || o.source === "LANDING_PAGE" || !o.source;
      } else if (channelFilter === "POS") {
        matchesChannel = o.source === "POS";
      }
      return matchesDate && matchesChannel;
    });
  }, [orders, startDate, endDate, channelFilter]);

  // Filtered Ledger strictly within date range
  const dateFilteredLedger = useMemo(() => {
    return ledgerEntries.filter((l) => isDateInRange(l.date));
  }, [ledgerEntries, startDate, endDate]);

  // Financial Metrics Summary
  const financialSummary = useMemo(() => {
    const sales = dateFilteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const purchasesFromLedger = dateFilteredLedger
      .filter((l) => l.type === "PURCHASE")
      .reduce((sum, l) => sum + l.amount, 0);

    const estimatedCOGS = Math.round(sales * 0.65);
    const totalPurchasesCOGS = purchasesFromLedger > 0 ? purchasesFromLedger : estimatedCOGS;

    const totalExpenses = dateFilteredLedger
      .filter((l) => l.type === "EXPENSE")
      .reduce((sum, l) => sum + l.amount, 0);

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

  // Unique product list
  const productList = useMemo(() => {
    const pSet = new Set<string>();
    orders.forEach((o) => {
      (o.items || []).forEach((item) => {
        if (item.name) pSet.add(item.name);
      });
    });
    return Array.from(pSet).sort();
  }, [orders]);

  // Product-wise filtered computations
  const productFilteredData = useMemo(() => {
    if (selectedProduct === "ALL") {
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
        productName: "All Products",
        uniqueBuyersCount: 0,
        totalUnitsSold: 0,
        totalProductRevenue: 0,
        ordersList: list,
        buyersList: [],
      };
    }

    const relevantOrders = dateFilteredOrders.filter((o) =>
      (o.items || []).some(
        (item) => item.name.toLowerCase() === selectedProduct.toLowerCase()
      )
    );

    const buyers: {
      customerName: string;
      phone: string;
      email: string;
      address: string;
      orderId: string;
      orderDate: string;
      source: string;
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
          source: o.source === "POS" ? "POS In-Store" : "E-Commerce",
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

  // CSV Generator
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
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportProductBuyerReport = () => {
    if (!productFilteredData.isProductSpecific) {
      handleExportAllOrders();
      return;
    }

    const safeSlug = selectedProduct.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    const dateSuffix = startDate || endDate ? `_${startDate || "start"}_to_${endDate || "end"}` : `_${new Date().toISOString().slice(0, 10)}`;
    const filename = `product_buyers_${safeSlug}${dateSuffix}.csv`;

    const headers = [
      "Customer Name",
      "Mobile Phone",
      "Email Address",
      "Delivery / Store Address",
      "Order ID",
      "Order Date",
      "Sales Channel",
      "Quantity Bought",
      "Unit Price (৳)",
      "Line Total (৳)",
      "Order Status",
      "Payment Mode",
    ];

    const rows = productFilteredData.buyersList.map((b) => [
      b.customerName,
      b.phone,
      b.email,
      b.address,
      b.orderId,
      b.orderDate,
      b.source,
      b.quantityBought,
      b.unitPrice,
      b.lineTotal,
      b.orderStatus,
      b.paymentMethod,
    ]);

    downloadCSV(filename, headers, rows);
  };

  const handleExportAllOrders = () => {
    const dateSuffix = startDate || endDate ? `_${startDate || "start"}_to_${endDate || "end"}` : `_${new Date().toISOString().slice(0, 10)}`;
    const filename = `order_sales_report${dateSuffix}.csv`;
    const headers = [
      "Order ID",
      "Date",
      "Sales Channel",
      "Customer Name",
      "Customer Phone",
      "Customer Email",
      "Address",
      "Products",
      "Subtotal",
      "Discount",
      "Shipping",
      "Total Amount",
      "Payment Method",
      "Payment Status",
      "Order Status",
    ];

    const rows = productFilteredData.ordersList.map((o) => [
      o.orderId,
      o.date,
      o.source === "POS" ? "POS In-Store" : "E-Commerce",
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

  const handleExportAccountsLedger = () => {
    const dateSuffix = startDate || endDate ? `_${startDate || "start"}_to_${endDate || "end"}` : `_${new Date().toISOString().slice(0, 10)}`;
    const filename = `financial_ledger${dateSuffix}.csv`;
    const headers = [
      "Date",
      "Transaction Description",
      "Type",
      "Category",
      "Amount (৳)",
      "Staff Admin",
    ];

    const rows = dateFilteredLedger.map((l) => [
      l.date,
      l.title,
      l.type === "EXPENSE" ? "Operational Expense" : l.type === "PURCHASE" ? "Stock Purchase (COGS)" : "Cash Collection",
      l.category,
      l.amount,
      l.staffName || "Admin",
    ]);

    downloadCSV(filename, headers, rows);
  };

  const handleExportCustomers = () => {
    const filename = `customers_directory_${new Date().toISOString().slice(0, 10)}.csv`;
    const headers = [
      "Customer ID",
      "Full Name",
      "Mobile Phone",
      "Email Address",
      "Registered Date",
      "Total Orders",
      "Lifetime Spend (৳)",
      "Status",
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

  const handleExportProductSummary = () => {
    const dateSuffix = startDate || endDate ? `_${startDate || "start"}_to_${endDate || "end"}` : `_${new Date().toISOString().slice(0, 10)}`;
    const filename = `product_sales_ledger${dateSuffix}.csv`;
    const headers = [
      "Product Name",
      "Total Quantity Sold",
      "Total Revenue Generated (৳)",
      "Unique Customer Buyers",
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#3B0C04] flex items-center gap-2">
            <span>Executive Reports & BI Analytics</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#16834A] text-white font-bold flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span>CSV / Excel</span>
            </span>
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            Real-time Sales, COGS, Operating Expenses, Net Margin & Product Customer Directory
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={fetchAllData}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-[#E8DCD2] bg-white hover:bg-[#FFF7EE] text-[#3B0C04] text-xs font-bold shadow-xs transition-colors"
            title="Refresh Data"
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
                  ? "Download Product Buyers (CSV)"
                  : "Download Orders Report (CSV)"}
              </span>
            </button>
          )}

          {activeTab === "ACCOUNTS" && (
            <button
              onClick={handleExportAccountsLedger}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download Ledger CSV</span>
            </button>
          )}

          {activeTab === "CUSTOMERS" && (
            <button
              onClick={handleExportCustomers}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download Customers CSV</span>
            </button>
          )}

          {activeTab === "PRODUCTS" && (
            <button
              onClick={handleExportProductSummary}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download Products CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* MASTER DATE-TO-DATE RANGE PICKER & CHANNEL SELECTOR */}
      <div className="p-5 rounded-3xl bg-white border border-[#E8DCD2] shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CalendarRange className="w-4 h-4 text-[#3B0C04]" />
              <h2 className="text-sm font-black text-[#3B0C04]">
                Custom Date Range & Channel Filter
              </h2>
            </div>
            <p className="text-xs text-[#6B5A52]">
              Select custom date boundaries and sales channels to generate reports
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
              All Time
            </button>
            <button
              onClick={() => setQuickRange("TODAY")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FFF7EE] text-[#3B0C04] border border-[#E8DCD2] hover:bg-[#3B0C04] hover:text-[#FFC40E] transition-all"
            >
              Today
            </button>
            <button
              onClick={() => setQuickRange("LAST_7")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FFF7EE] text-[#3B0C04] border border-[#E8DCD2] hover:bg-[#3B0C04] hover:text-[#FFC40E] transition-all"
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setQuickRange("THIS_MONTH")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FFF7EE] text-[#3B0C04] border border-[#E8DCD2] hover:bg-[#3B0C04] hover:text-[#FFC40E] transition-all"
            >
              This Month
            </button>
            <button
              onClick={() => setQuickRange("LAST_MONTH")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FFF7EE] text-[#3B0C04] border border-[#E8DCD2] hover:bg-[#3B0C04] hover:text-[#FFC40E] transition-all"
            >
              Last Month
            </button>
          </div>
        </div>

        {/* Date Inputs & Channel Dropdown */}
        <div className="pt-3 border-t border-[#E8DCD2]/60 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-4 flex items-center gap-2">
            <label className="text-xs font-bold text-[#3B0C04] whitespace-nowrap min-w-16">
              Start Date:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-semibold text-[#2B160F] focus:outline-none focus:border-[#3B0C04]"
            />
          </div>

          <div className="sm:col-span-4 flex items-center gap-2">
            <label className="text-xs font-bold text-[#3B0C04] whitespace-nowrap min-w-16">
              End Date:
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-semibold text-[#2B160F] focus:outline-none focus:border-[#3B0C04]"
            />
          </div>

          <div className="sm:col-span-3 flex items-center gap-2">
            <label className="text-xs font-bold text-[#3B0C04] whitespace-nowrap">
              Channel:
            </label>
            <select
              value={channelFilter}
              onChange={(e: any) => setChannelFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-bold text-[#3B0C04] outline-none"
            >
              <option value="ALL">All Sales Channels</option>
              <option value="ECOMMERCE">🛒 E-Commerce Only</option>
              <option value="POS">🏪 POS In-Store Only</option>
            </select>
          </div>

          <div className="sm:col-span-1 flex items-center">
            {(startDate || endDate || channelFilter !== "ALL") && (
              <button
                onClick={() => {
                  setQuickRange("ALL");
                  setChannelFilter("ALL");
                }}
                className="w-full h-10 px-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                title="Reset Filters"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Range Pill */}
        <div className="flex items-center gap-2 text-[11px] font-bold text-[#3B0C04] bg-[#FFF7EE] px-3.5 py-2 rounded-xl border border-[#E8DCD2]">
          <span className="w-2 h-2 rounded-full bg-[#16834A] animate-pulse" />
          <span>
            {startDate || endDate || channelFilter !== "ALL"
              ? `Filter Active: ${startDate || "Earliest"} to ${endDate || "Present"} | Channel: ${channelFilter} (${dateFilteredOrders.length} orders matched)`
              : `Viewing consolidated lifetime data across all channels (${dateFilteredOrders.length} orders)`}
          </span>
        </div>
      </div>

      {/* 4-PILLAR EXECUTIVE FINANCIAL SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#16834A]/10 text-[#16834A] flex items-center justify-center font-bold text-xl">
            ৳
          </div>
          <div>
            <p className="text-[11px] text-[#8C7B72] font-bold uppercase tracking-wider">
              Total Gross Sales
            </p>
            <h3 className="text-2xl font-black text-[#16834A]">
              ৳{financialSummary.sales.toLocaleString()}
            </h3>
            <span className="text-[10px] text-[#6B5A52] font-semibold">
              From {financialSummary.ordersCount} completed orders
            </span>
          </div>
        </div>

        {/* Cost of Goods / Purchases */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFC40E]/20 text-[#3B0C04] flex items-center justify-center font-bold text-xl">
            📦
          </div>
          <div>
            <p className="text-[11px] text-[#8C7B72] font-bold uppercase tracking-wider">
              Purchases / COGS
            </p>
            <h3 className="text-2xl font-black text-[#3B0C04]">
              ৳{financialSummary.purchases.toLocaleString()}
            </h3>
            <span className="text-[10px] text-[#8C7B72] font-semibold">
              Inventory procurement cost
            </span>
          </div>
        </div>

        {/* Operating Expenses */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xl">
            📉
          </div>
          <div>
            <p className="text-[11px] text-[#8C7B72] font-bold uppercase tracking-wider">
              Operating Expenses
            </p>
            <h3 className="text-2xl font-black text-rose-700">
              ৳{financialSummary.expenses.toLocaleString()}
            </h3>
            <span className="text-[10px] text-[#8C7B72] font-semibold">
              Marketing, packaging, courier
            </span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="p-5 rounded-2xl bg-[#3B0C04] text-[#FFFDF9] shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFC40E] text-[#3B0C04] flex items-center justify-center font-black text-xl">
            🏆
          </div>
          <div>
            <p className="text-[11px] text-[#FFC40E] font-bold uppercase tracking-wider">
              Net Profit
            </p>
            <h3 className="text-2xl font-black text-[#FFC40E]">
              ৳{financialSummary.netProfit.toLocaleString()}
            </h3>
            <span className="text-[10px] text-zinc-300 font-semibold">
              Margin: {financialSummary.marginPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8DCD2] pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("ORDERS")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "ORDERS"
              ? "bg-[#3B0C04] text-[#FFC40E] shadow-2xs"
              : "text-[#6B5A52] hover:bg-[#FFF7EE]"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders & Product Buyer Directory</span>
        </button>

        <button
          onClick={() => setActiveTab("ACCOUNTS")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "ACCOUNTS"
              ? "bg-[#3B0C04] text-[#FFC40E] shadow-2xs"
              : "text-[#6B5A52] hover:bg-[#FFF7EE]"
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Financial Accounts Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab("CUSTOMERS")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "CUSTOMERS"
              ? "bg-[#3B0C04] text-[#FFC40E] shadow-2xs"
              : "text-[#6B5A52] hover:bg-[#FFF7EE]"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customer CRM Directory</span>
        </button>

        <button
          onClick={() => setActiveTab("PRODUCTS")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "PRODUCTS"
              ? "bg-[#3B0C04] text-[#FFC40E] shadow-2xs"
              : "text-[#6B5A52] hover:bg-[#FFF7EE]"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Product Sales Ledger</span>
        </button>
      </div>

      {/* TAB 1: ORDER & PRODUCT-WISE BUYERS */}
      {activeTab === "ORDERS" && (
        <div className="space-y-6">
          {/* PRODUCT FILTER DROPDOWN */}
          <div className="p-5 rounded-3xl bg-white border border-[#E8DCD2] shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-[#3B0C04] flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#FFC40E]" />
                  <span>Product-Wise Customer Buyer Filter:</span>
                </label>
                <p className="text-[11px] text-[#6B5A52]">
                  Select any product to see exactly which customers purchased it, contact details, quantity, and sales channel
                </p>
              </div>

              <div className="w-full md:w-96">
                <div className="relative">
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full h-11 pl-4 pr-10 rounded-xl border border-[#3B0C04] bg-[#FFF7EE] text-xs font-bold text-[#3B0C04] shadow-xs outline-none cursor-pointer appearance-none"
                  >
                    <option value="ALL">📦 All Products (Consolidated View)</option>
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

            <div className="pt-3 border-t border-[#E8DCD2]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#8C7B72] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Order ID, Customer Name, or Phone..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs focus:outline-none focus:border-[#3B0C04]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-[11px] font-bold text-[#6B5A52] shrink-0">Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-semibold text-[#2B160F] outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Specific KPIs */}
          {productFilteredData.isProductSpecific ? (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border-2 border-[#3B0C04] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center font-bold text-lg">
                  👥
                </div>
                <div>
                  <p className="text-[11px] text-[#8C7B72] font-bold uppercase">Unique Buyers</p>
                  <h3 className="text-2xl font-black text-[#3B0C04]">
                    {productFilteredData.uniqueBuyersCount} Customers
                  </h3>
                  <span className="text-[10px] text-[#16834A] font-bold">Distinct individuals</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFC40E]/20 text-[#3B0C04] flex items-center justify-center font-bold text-lg">
                  📦
                </div>
                <div>
                  <p className="text-[11px] text-[#8C7B72] font-bold uppercase">Units Sold</p>
                  <h3 className="text-2xl font-black text-[#3B0C04]">
                    {productFilteredData.totalUnitsSold} Pcs
                  </h3>
                  <span className="text-[10px] text-[#6B5A52]">Fulfilled items</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#16834A]/10 text-[#16834A] flex items-center justify-center font-bold text-lg">
                  ৳
                </div>
                <div>
                  <p className="text-[11px] text-[#8C7B72] font-bold uppercase">Product Revenue</p>
                  <h3 className="text-2xl font-black text-[#16834A]">
                    ৳{productFilteredData.totalProductRevenue.toLocaleString()}
                  </h3>
                  <span className="text-[10px] text-[#16834A] font-bold">Sales generated</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#3B0C04]/10 text-[#3B0C04] flex items-center justify-center font-bold text-lg">
                  📑
                </div>
                <div>
                  <p className="text-[11px] text-[#8C7B72] font-bold uppercase">Orders Count</p>
                  <h3 className="text-2xl font-black text-[#3B0C04]">
                    {productFilteredData.ordersList.length} Orders
                  </h3>
                  <span className="text-[10px] text-[#6B5A52]">Order records</span>
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
                  <p className="text-[11px] text-[#8C7B72] font-bold">Total Orders</p>
                  <h3 className="text-2xl font-black text-[#3B0C04]">
                    {productFilteredData.ordersList.length}
                  </h3>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#16834A]/10 text-[#16834A] flex items-center justify-center font-bold text-lg">
                  ৳
                </div>
                <div>
                  <p className="text-[11px] text-[#8C7B72] font-bold">Total Sales Volume</p>
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
                  <p className="text-[11px] text-[#8C7B72] font-bold">Average Order Value (AOV)</p>
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

          {/* TABLE */}
          {productFilteredData.isProductSpecific ? (
            <div className="bg-white rounded-3xl border border-[#E8DCD2] shadow-xs overflow-hidden">
              <div className="p-5 border-b border-[#E8DCD2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-[#3B0C04] flex items-center gap-2">
                    <span>Customer Buyers of "{selectedProduct}"</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#3B0C04] text-[#FFC40E] font-bold">
                      {productFilteredData.buyersList.length} Transactions
                    </span>
                  </h3>
                  <p className="text-xs text-[#6B5A52]">
                    Complete list of buyers including contact phone, channel, delivery address, price, and status
                  </p>
                </div>

                <button
                  onClick={handleExportProductBuyerReport}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFF7EE] border border-[#E8DCD2] hover:bg-[#3B0C04] hover:text-[#FFC40E] text-[#3B0C04] text-xs font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Buyer List (CSV)</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#E8DCD2] bg-[#FFFDF9] text-[#8C7B72] font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Customer Name</th>
                      <th className="py-3 px-4">Contact Phone & Email</th>
                      <th className="py-3 px-4">Channel</th>
                      <th className="py-3 px-4">Delivery Address</th>
                      <th className="py-3 px-4">Order ID & Date</th>
                      <th className="py-3 px-4 text-center">Qty</th>
                      <th className="py-3 px-4 text-right">Unit Price</th>
                      <th className="py-3 px-4 text-right">Line Total</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DCD2]/60">
                    {productFilteredData.buyersList.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-[#8C7B72] font-semibold">
                          No buyer transactions recorded for this product in the selected period.
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
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                buyer.source.includes("POS")
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {buyer.source}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-[#6B5A52] max-w-xs truncate" title={buyer.address}>
                            {buyer.address}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-mono font-bold text-[#3B0C04]">#{buyer.orderId}</span>
                            <div className="text-[10px] text-[#8C7B72]">{buyer.orderDate}</div>
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-[#2B160F]">
                            {buyer.quantityBought}
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
            <div className="bg-white rounded-3xl border border-[#E8DCD2] shadow-xs overflow-hidden">
              <div className="p-5 border-b border-[#E8DCD2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-[#3B0C04]">
                    Orders Report ({productFilteredData.ordersList.length} Orders)
                  </h3>
                  <p className="text-xs text-[#6B5A52]">
                    All transactions in the selected date range & channel filter
                  </p>
                </div>
                <button
                  onClick={handleExportAllOrders}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFF7EE] border border-[#E8DCD2] hover:bg-[#3B0C04] hover:text-[#FFC40E] text-[#3B0C04] text-xs font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Report (CSV)</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#E8DCD2] bg-[#FFFDF9] text-[#8C7B72] font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Channel</th>
                      <th className="py-3 px-4">Customer Details</th>
                      <th className="py-3 px-4">Purchased Items</th>
                      <th className="py-3 px-4 text-right">Total Amount</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DCD2]/60">
                    {productFilteredData.ordersList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-[#8C7B72] font-semibold">
                          No orders found matching the filter criteria.
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
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                order.source === "POS"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {order.source === "POS" ? "POS IN-STORE" : "E-COMMERCE"}
                            </span>
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

      {/* TAB 2: FINANCIAL ACCOUNTS LEDGER */}
      {activeTab === "ACCOUNTS" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#E8DCD2] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#E8DCD2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-[#3B0C04]">
                  Financial Accounts & General Ledger
                </h3>
                <p className="text-xs text-[#6B5A52]">
                  Consolidated tracking of operating expenses, COGS procurement, and collections
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={ledgerTypeFilter}
                  onChange={(e) => setLedgerTypeFilter(e.target.value)}
                  className="h-9 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-semibold text-[#2B160F]"
                >
                  <option value="ALL">All Entries</option>
                  <option value="EXPENSE">Operating Expenses</option>
                  <option value="PURCHASE">Procurement Purchases</option>
                  <option value="COLLECTION">Cash Collections</option>
                </select>

                <button
                  onClick={handleExportAccountsLedger}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#3B0C04] text-[#FFC40E] text-xs font-bold hover:bg-[#260700] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Ledger (CSV)</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E8DCD2] bg-[#FFFDF9] text-[#8C7B72] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Title / Description</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Staff Admin</th>
                    <th className="py-3 px-4 text-right">Amount (৳)</th>
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

      {/* TAB 3: CUSTOMER CRM */}
      {activeTab === "CUSTOMERS" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#3B0C04]/10 text-[#3B0C04] flex items-center justify-center font-bold text-lg">
                👥
              </div>
              <div>
                <p className="text-[11px] text-[#8C7B72] font-bold uppercase">Total Accounts</p>
                <h3 className="text-2xl font-black text-[#3B0C04]">{customers.length}</h3>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#16834A]/10 text-[#16834A] flex items-center justify-center font-bold text-lg">
                ✅
              </div>
              <div>
                <p className="text-[11px] text-[#8C7B72] font-bold uppercase">Active Status</p>
                <h3 className="text-2xl font-black text-[#16834A]">
                  {customers.filter((c) => c.status === "ACTIVE").length}
                </h3>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFC40E]/20 text-[#3B0C04] flex items-center justify-center font-bold text-lg">
                ৳
              </div>
              <div>
                <p className="text-[11px] text-[#8C7B72] font-bold uppercase">Customer Lifetime Spend</p>
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
                <p className="text-[11px] text-[#8C7B72] font-bold uppercase">Average CLV</p>
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

          <div className="bg-white p-4 rounded-3xl border border-[#E8DCD2] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#8C7B72] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search customer by name, phone, or email..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs focus:outline-none focus:border-[#3B0C04]"
                />
              </div>

              <button
                onClick={handleExportCustomers}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16834A] text-white text-xs font-bold hover:bg-[#11693a] transition-all shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Export Customers (CSV)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E8DCD2] bg-[#FFFDF9] text-[#8C7B72] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Mobile Phone</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-center">Total Orders</th>
                    <th className="py-3 px-4 text-right">Lifetime Value (৳)</th>
                    <th className="py-3 px-4 text-center">Status</th>
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
                          {cust.totalOrders}
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

      {/* TAB 4: PRODUCT SALES LEDGER */}
      {activeTab === "PRODUCTS" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#E8DCD2] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#E8DCD2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-[#3B0C04]">
                  Product Inventory & Sales Ledger
                </h3>
                <p className="text-xs text-[#6B5A52]">
                  Units sold, generated revenue, and customer buyer count per catalog item
                </p>
              </div>
              <button
                onClick={handleExportProductSummary}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#3B0C04] text-[#FFC40E] text-xs font-bold hover:bg-[#260700] transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Product Ledger (CSV)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E8DCD2] bg-[#FFFDF9] text-[#8C7B72] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4 text-center">Units Sold</th>
                    <th className="py-3 px-4 text-center">Customer Buyers</th>
                    <th className="py-3 px-4 text-right">Revenue Generated</th>
                    <th className="py-3 px-4 text-center">Action</th>
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
                          {units} Pcs
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-[#16834A]">
                          {buyerSet.size} Buyers
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
                            View Buyers →
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
