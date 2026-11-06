import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminToken } from "@/lib/auth";

// Initial mock ledger entries for initial setup
let mockLedgerEntries = [
  {
    id: "acc-1",
    type: "EXPENSE",
    title: "ফেসবুক মেটা বিজ্ঞাপন খরচ (Ad Spend)",
    category: "MARKETING_ADS",
    amount: 3500,
    date: "2026-09-04",
    staffId: "user-super-admin",
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
    staffId: "staff-01",
    staffName: "আরিফুল ইসলাম (Staff)",
    staffRole: "STAFF",
  },
  {
    id: "acc-3",
    type: "PURCHASE",
    title: "৫০ পিস সনিফার ব্লেন্ডার স্টক ক্রয়",
    category: "PRODUCT_PURCHASE",
    amount: 47500,
    date: "2026-09-02",
    staffId: "user-super-admin",
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
    staffId: "staff-02",
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
    staffId: "staff-01",
    staffName: "আরিফুল ইসলাম (Staff)",
    staffRole: "STAFF",
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filterStaffId = searchParams.get("staffId");

    // Check caller session
    const authCookie = request.headers.get("cookie")?.split("; ").find((row) => row.startsWith("ponchomukh_admin_session="));
    const token = authCookie?.split("=")[1];
    const session = await verifyAdminToken(token);

    const isSuperAdmin = session?.role === "SUPER_ADMIN";
    const currentUserId = session?.userId || "user-super-admin";

    // Non-Super Admins can ONLY see their own entries
    let entries = [...mockLedgerEntries];

    if (!isSuperAdmin) {
      entries = entries.filter((e) => e.staffId === currentUserId);
    } else if (filterStaffId && filterStaffId !== "ALL") {
      entries = entries.filter((e) => e.staffId === filterStaffId);
    }

    return NextResponse.json({
      success: true,
      isSuperAdmin,
      currentUserId,
      entries,
    });
  } catch (error) {
    console.error("GET /api/admin/accounts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch accounts data." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, title, category, amount, date, staffId, staffName, staffRole } = body;

    if (!title || !amount || Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, error: "বিবরণ এবং সঠিক টাকার পরিমাণ প্রদান করুন।" },
        { status: 400 }
      );
    }

    const newEntry = {
      id: `acc-${Date.now()}`,
      type: type || "EXPENSE",
      title: title.trim(),
      category: category || "OTHER",
      amount: Number(amount),
      date: date || new Date().toISOString().slice(0, 10),
      staffId: staffId || "user-super-admin",
      staffName: staffName || "Admin",
      staffRole: staffRole || "ADMIN",
    };

    mockLedgerEntries.unshift(newEntry);

    return NextResponse.json({ success: true, entry: newEntry }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/accounts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save account entry." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Entry ID is required." },
        { status: 400 }
      );
    }

    mockLedgerEntries = mockLedgerEntries.filter((e) => e.id !== id);

    return NextResponse.json({ success: true, message: "Entry deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/admin/accounts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete account entry." },
      { status: 500 }
    );
  }
}

