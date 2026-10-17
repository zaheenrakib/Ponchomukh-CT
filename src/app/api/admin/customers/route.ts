import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { UserRole } from "@prisma/client";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: UserRole.CUSTOMER,
      },
      orderBy: { createdAt: "desc" },
      include: {
        orders: {
          select: { total: true },
        },
      },
    });

    const customers = users.map((u) => {
      const totalSpent = u.orders.reduce((sum: number, o: { total: any }) => sum + Number(o.total || 0), 0);
      return {
        id: u.id,
        name: u.name,
        phone: u.phoneNumber || "N/A",
        email: u.email,
        joinedDate: new Date(u.createdAt).toLocaleDateString("bn-BD"),
        totalOrders: u.orders.length,
        totalSpent,
        status: u.isActive ? "ACTIVE" : "BLOCKED",
      };
    });

    return NextResponse.json({ success: true, customers });
  } catch (error) {
    console.error("GET /api/admin/customers error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Customer ID is required" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        isActive: status === "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, customer: updated });
  } catch (error) {
    console.error("PATCH /api/admin/customers error:", error);
    return NextResponse.json({ success: false, error: "Failed to update customer" }, { status: 500 });
  }
}
