import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

export async function GET() {
  try {
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({
      where: { status: OrderStatus.PENDING },
    });
    const totalProducts = await prisma.product.count({
      where: { deletedAt: null },
    });
    const lowStockProducts = await prisma.product.count({
      where: {
        stock: { lte: 5 },
        deletedAt: null,
      },
    });

    const revenueResult = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
    });

    const totalRevenue = Number(revenueResult._sum.total || 0);

    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: { images: true },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        totalProducts,
        lowStockProducts,
        totalRevenue,
      },
      recentOrders,
    });
  } catch (error) {
    console.error("API /api/admin/stats error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch admin stats" }, { status: 500 });
  }
}
