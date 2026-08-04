"use client";

import React, { useState, useRef } from "react";
import { 
  LayoutDashboard, ShoppingBag, Users, LineChart, CreditCard, Tag, 
  MessageSquare, Heart, HelpCircle, Settings, Search, Info, Download, ChevronDown 
} from "lucide-react";

// Mock Data for Recent Orders
interface OrderItem {
  id: string;
  orderDate: string;
  orderTime: string;
  productName: string;
  productCategory: string;
  productImage: string;
  invoice: string;
  price: number;
  sold: number;
  status: "New Order" | "Shipped" | "Processing" | "Completed";
}

const mockRecentOrders: OrderItem[] = [
  {
    id: "ord-1",
    orderDate: "Sep, 05 2023",
    orderTime: "14:23 AM",
    productName: "Savior Koil Part 2",
    productCategory: "Shoes",
    productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&auto=format&fit=crop&q=80",
    invoice: "INV-0293",
    price: 122.00,
    sold: 1100,
    status: "New Order"
  },
  {
    id: "ord-2",
    orderDate: "Sep, 04 2023",
    orderTime: "11:05 AM",
    productName: "EliteShield Performance Men's Jackets",
    productCategory: "Jacket",
    productImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=80&auto=format&fit=crop&q=80",
    invoice: "INV-0284",
    price: 255.00,
    sold: 50,
    status: "Shipped"
  },
  {
    id: "ord-3",
    orderDate: "Sep, 03 2023",
    orderTime: "09:12 AM",
    productName: "OptiZoom Camera Shoulder Bag",
    productCategory: "Bag",
    productImage: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=80&auto=format&fit=crop&q=80",
    invoice: "INV-0275",
    price: 250.00,
    sold: 120,
    status: "Processing"
  },
  {
    id: "ord-4",
    orderDate: "Sep, 02 2023",
    orderTime: "17:45 PM",
    productName: "Gentlemen's Summer Gray Hat",
    productCategory: "Cap",
    productImage: "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=80&auto=format&fit=crop&q=80",
    invoice: "INV-0266",
    price: 99.00,
    sold: 80,
    status: "New Order"
  }
];

// Interactive Chart Points Mapping
interface ChartPoint {
  x: number;
  y: number;
  label: string;
  dateStr: string;
  revenueStr: string;
}

const chartPoints: ChartPoint[] = [
  { x: 50, y: 170, label: "03/09", dateStr: "03 Sep 2023, 10:00", revenueStr: "$38.25K" },
  { x: 130, y: 165, label: "06/09", dateStr: "06 Sep 2023, 10:00", revenueStr: "$39.50K" },
  { x: 210, y: 155, label: "09/09", dateStr: "09 Sep 2023, 10:00", revenueStr: "$41.10K" },
  { x: 290, y: 160, label: "12/09", dateStr: "12 Sep 2023, 10:00", revenueStr: "$40.40K" },
  { x: 370, y: 148, label: "15/09", dateStr: "15 Sep 2023, 10:00", revenueStr: "$42.85K" },
  { x: 450, y: 135, label: "18/09", dateStr: "18 Sep 2023, 10:00", revenueStr: "$45.90K" },
  { x: 530, y: 130, label: "21/09", dateStr: "19 Sep 2023, 10:00", revenueStr: "$46.48K" }, // Match picture hover point
  { x: 610, y: 138, label: "24/09", dateStr: "24 Sep 2023, 10:00", revenueStr: "$44.90K" },
  { x: 690, y: 132, label: "27/09", dateStr: "27 Sep 2023, 10:00", revenueStr: "$46.10K" },
  { x: 770, y: 125, label: "30/09", dateStr: "30 Sep 2023, 10:00", revenueStr: "$47.50K" }
];

export default function AdminDashboard() {
  const [selectedStatus, setSelectedStatus] = useState<string>("All Status");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number>(6); // Default hover on point 19 Sep (index 6)
  const chartContainerRef = useRef<SVGSVGElement>(null);

  // Filter orders
  const filteredOrders = selectedStatus === "All Status"
    ? mockRecentOrders
    : mockRecentOrders.filter(o => o.status === selectedStatus);

  // Track hover coordinate index on SVG chart
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!chartContainerRef.current) return;
    const rect = chartContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    // Scale standard coordinate width (800) matching responsive rect container width
    const scaleFactor = 800 / rect.width;
    const svgMouseX = mouseX * scaleFactor;

    // Find nearest point index
    let nearestIdx = 0;
    let minDiff = Math.abs(chartPoints[0].x - svgMouseX);

    for (let i = 1; i < chartPoints.length; i++) {
      const diff = Math.abs(chartPoints[i].x - svgMouseX);
      if (diff < minDiff) {
        minDiff = diff;
        nearestIdx = i;
      }
    }
    setHoverIndex(nearestIdx);
  };

  const activePoint = chartPoints[hoverIndex];

  return (
    <div className="flex h-screen bg-[#F5F6F8] dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-550 transition-colors">
      
      {/* 1. Sidebar Panel */}
      <aside className="w-60 bg-white dark:bg-zinc-900 border-r border-zinc-150 dark:border-zinc-800 flex flex-col justify-between py-6 px-4 shrink-0">
        <div className="flex flex-col gap-8">
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 via-rose-500 to-amber-500 shadow-md shadow-rose-500/10 flex items-center justify-center text-white font-sans font-black text-xl">
              P
            </div>
            <span className="font-sans font-black text-xl tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-850 to-indigo-600 bg-clip-text text-transparent dark:from-white dark:to-indigo-400">
              Ponchomukh
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1">
            {/* Active Link: Dashboard */}
            <a 
              href="#" 
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white font-extrabold text-xs transition-colors group relative"
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="h-4 w-4 text-indigo-500" />
                <span>Dashboard</span>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-l-full bg-indigo-500" />
            </a>

            {[
              { label: "Products", icon: <ShoppingBag className="h-4 w-4" /> },
              { label: "Customers", icon: <Users className="h-4 w-4" /> },
              { label: "Analytics", icon: <LineChart className="h-4 w-4" /> },
              { label: "Transactions", icon: <CreditCard className="h-4 w-4" /> },
              { label: "Promo", icon: <Tag className="h-4 w-4" /> },
            ].map((link) => (
              <a 
                key={link.label}
                href="#" 
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white font-bold text-xs transition-all"
              >
                <div className="flex items-center gap-3">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
              </a>
            ))}

            {/* Chat link with badge */}
            <a 
              href="#" 
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white font-bold text-xs transition-all"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4" />
                <span>Chat</span>
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-950 text-[10px] font-black text-white dark:bg-white dark:text-zinc-950">
                8
              </span>
            </a>

            <a 
              href="#" 
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white font-bold text-xs transition-all"
            >
              <div className="flex items-center gap-3">
                <Heart className="h-4 w-4" />
                <span>Feedback</span>
              </div>
            </a>

            <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-4" />

            <a 
              href="#" 
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white font-bold text-xs transition-all"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="h-4 w-4" />
                <span>Help</span>
              </div>
            </a>

            <a 
              href="#" 
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white font-bold text-xs transition-all"
            >
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4" />
                <span>Setting</span>
              </div>
            </a>
          </nav>
        </div>

        {/* Sidebar Footer block */}
        <div className="flex items-center gap-3 px-2 border-t border-zinc-100 dark:border-zinc-800 pt-4 cursor-pointer group">
          <div className="h-8 w-8 rounded-full overflow-hidden shrink-0">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" alt="Avatar" className="h-full w-full object-cover" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-black text-zinc-850 dark:text-white group-hover:text-indigo-500 transition-colors">Zaheen Rakib</h4>
            <p className="text-[10px] text-zinc-400 font-semibold uppercase">Super Admin</p>
          </div>
        </div>
      </aside>

      {/* 2. Main Dashboard Area */}
      <main className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
        
        {/* Top Search bar row */}
        <div className="flex justify-between items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold transition-all outline-none focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
            />
          </div>
        </div>

        {/* Core metrics row of 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "New Order", val: "156" },
            { label: "Ready to Ship", val: "88" },
            { label: "New Review", val: "243" },
            { label: "New Discussion", val: "144" },
          ].map((metric) => (
            <div 
              key={metric.label}
              className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-800 shadow-sm flex flex-col gap-3 text-left"
            >
              <div className="flex items-center justify-between text-zinc-400 dark:text-zinc-500">
                <span className="text-[10px] uppercase font-bold tracking-wider">{metric.label}</span>
                <Info className="h-4 w-4 shrink-0 text-zinc-300 hover:text-zinc-500 transition-colors cursor-pointer" />
              </div>
              <h3 className="font-sans font-black text-3xl text-zinc-850 dark:text-white">
                {metric.val}
              </h3>
            </div>
          ))}
        </div>

        {/* Total Sales Revenue Chart Container */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-150 dark:border-zinc-800 shadow-sm flex flex-col gap-6 text-left relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Total Sales Revenue</span>
              <h2 className="mt-1 font-sans font-black text-2xl text-zinc-850 dark:text-white">
                $1,587,000
              </h2>
            </div>

            {/* Time Filter & Export buttons */}
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-50 p-1 text-[10px] font-bold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
                {["1H", "1D", "7D", "1M", "1Y"].map((t) => (
                  <button 
                    key={t}
                    className={`px-3 py-1 rounded-md transition-all ${
                      t === "1M" 
                        ? "bg-white font-black text-zinc-900 shadow-sm dark:bg-zinc-850 dark:text-white" 
                        : "hover:text-zinc-800"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button className="flex h-8 items-center gap-1.5 px-3 rounded-lg border border-zinc-250 hover:bg-zinc-50 text-[10px] font-bold text-zinc-700 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:text-zinc-300 transition-all shadow-sm">
                <Download className="h-3.5 w-3.5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="relative w-full h-[220px]">
            <svg 
              ref={chartContainerRef}
              className="w-full h-full cursor-crosshair overflow-visible" 
              viewBox="0 0 800 220" 
              preserveAspectRatio="none"
              onMouseMove={handleMouseMove}
            >
              <defs>
                {/* Line stroke gradient */}
                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="50%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
                {/* Area fill gradient */}
                <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#EC4899" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#EC4899" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              {[40, 76, 112, 148, 184].map((gridY) => (
                <line 
                  key={gridY}
                  x1="40" 
                  y1={gridY} 
                  x2="780" 
                  y2={gridY} 
                  className="stroke-zinc-100 dark:stroke-zinc-800/40"
                  strokeWidth="1" 
                />
              ))}

              {/* Chart line path */}
              <path 
                d="M 50 170 C 100 168, 110 166, 130 165 C 180 162, 190 157, 210 155 C 260 150, 270 162, 290 160 C 340 155, 350 150, 370 148 C 420 140, 430 137, 450 135 C 500 130, 510 131, 530 130 C 580 128, 590 139, 610 138 C 660 135, 670 133, 690 132 C 740 130, 750 126, 770 125"
                fill="none" 
                stroke="url(#line-gradient)" 
                strokeWidth="3.5"
                strokeLinecap="round" 
              />

              {/* Shaded Area underneath the line */}
              <path
                d="M 50 170 C 100 168, 110 166, 130 165 C 180 162, 190 157, 210 155 C 260 150, 270 162, 290 160 C 340 155, 350 150, 370 148 C 420 140, 430 137, 450 135 C 500 130, 510 131, 530 130 C 580 128, 590 139, 610 138 C 660 135, 670 133, 690 132 C 740 130, 750 126, 770 125 L 770 184 L 50 184 Z"
                fill="url(#area-gradient)"
              />

              {/* Active point hover cursor triggers */}
              {activePoint && (
                <>
                  {/* Vertical dotted track line */}
                  <line 
                    x1={activePoint.x} 
                    y1="40" 
                    x2={activePoint.x} 
                    y2="184" 
                    className="stroke-zinc-950 dark:stroke-white" 
                    strokeWidth="1.5" 
                    strokeDasharray="4,4" 
                  />
                  {/* Hover node circle */}
                  <circle 
                    cx={activePoint.x} 
                    cy={activePoint.y} 
                    r="5" 
                    className="fill-[#EC4899] stroke-white dark:stroke-zinc-900" 
                    strokeWidth="2.5" 
                  />
                </>
              )}
            </svg>

            {/* Floating Tooltip Box */}
            {activePoint && (
              <div 
                className="absolute z-20 rounded-xl bg-zinc-950 px-4 py-2.5 text-[11px] font-bold text-white shadow-lg pointer-events-none text-left flex flex-col gap-1 border border-zinc-800"
                style={{ 
                  left: `${(activePoint.x / 800) * 100}%`, 
                  top: `${((activePoint.y - 65) / 220) * 100}%`,
                  transform: "translateX(-50%)"
                }}
              >
                <span className="text-zinc-400 font-semibold">{activePoint.dateStr}</span>
                <span>Revenue : <span className="font-extrabold text-rose-450">{activePoint.revenueStr}</span></span>
              </div>
            )}
          </div>

          {/* X Axis labels */}
          <div className="flex justify-between items-center px-6 text-[10px] font-black text-zinc-400 dark:text-zinc-500 mt-2">
            {chartPoints.map((pt) => (
              <span key={pt.label}>{pt.label}</span>
            ))}
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-150 dark:border-zinc-800 shadow-sm p-6 flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between">
            <h2 className="font-sans font-black text-lg text-zinc-850 dark:text-white tracking-tight">
              Recent Orders
            </h2>

            {/* Dropdown status selector */}
            <div className="relative">
              <button 
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="flex h-8 items-center gap-1.5 px-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-[10px] font-bold text-zinc-700 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:text-zinc-300 transition-all shadow-sm"
              >
                <span>Status : {selectedStatus}</span>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              </button>

              {isStatusDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 z-30 w-36 rounded-lg border border-zinc-150 bg-white p-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in-50 slide-in-from-top-1">
                  {["All Status", "New Order", "Shipped", "Processing"].map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setSelectedStatus(st);
                        setIsStatusDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-md text-[10px] font-bold text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-850 dark:hover:text-white transition-colors"
                    >
                      {st}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] text-zinc-700 dark:text-zinc-300">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 text-left font-bold">Order Date</th>
                  <th className="pb-3 text-left font-bold">Product</th>
                  <th className="pb-3 text-left font-bold">Invoice</th>
                  <th className="pb-3 text-left font-bold">Price</th>
                  <th className="pb-3 text-left font-bold">Sold</th>
                  <th className="pb-3 text-right font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-semibold">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-400 font-bold">
                      No matching transaction entries found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-all">
                      <td className="py-4 text-left">
                        <div>{ord.orderDate}</div>
                        <div className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">{ord.orderTime}</div>
                      </td>
                      
                      <td className="py-4 text-left">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0">
                            <img src={ord.productImage} alt={ord.productName} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <h5 className="font-sans font-bold text-zinc-850 dark:text-white leading-tight">
                              {ord.productName}
                            </h5>
                            <p className="text-[9px] text-zinc-450 dark:text-zinc-500 mt-0.5">
                              {ord.productCategory}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 text-left font-mono">
                        {ord.invoice}
                      </td>

                      <td className="py-4 text-left font-mono">
                        ${ord.price.toFixed(2)}
                      </td>

                      <td className="py-4 text-left font-mono">
                        {ord.sold.toLocaleString()}
                      </td>

                      <td className="py-4 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black tracking-wide ${
                          ord.status === "New Order" 
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
                            : ord.status === "Shipped"
                            ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400"
                            : "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            ord.status === "New Order" 
                              ? "bg-blue-500" 
                              : ord.status === "Shipped" 
                              ? "bg-indigo-500" 
                              : "bg-amber-500"
                          }`} />
                          <span>{ord.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
