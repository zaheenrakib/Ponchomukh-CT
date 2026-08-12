import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const customers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        orders: {
          select: {
            id: true,
            total: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    const formattedCustomers = customers.map((c) => ({
      id: c.id,
      name: c.name || "Guest Customer",
      email: c.email,
      phoneNumber: c.phoneNumber,
      role: c.role,
      ordersCount: c.orders.length,
      totalSpent: c.orders.reduce((sum, ord) => sum + Number(ord.total), 0),
      createdAt: c.createdAt,
    }));

    return NextResponse.json({ success: true, customers: formattedCustomers });
  } catch (error) {
    console.error("API /api/admin/customers error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch customers" }, { status: 500 });
  }
}
