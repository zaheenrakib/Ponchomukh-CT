import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const orders = await prisma.order.findMany({
      where: status && status !== "ALL" ? { status: status as OrderStatus } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        shippingAddress: true,
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

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("API /api/admin/orders GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, orderNumber, status } = body;

    if ((!orderId && !orderNumber) || !status) {
      return NextResponse.json({ success: false, error: "orderId/orderNumber and status are required." }, { status: 400 });
    }

    const whereClause = orderId
      ? { id: orderId }
      : { orderNumber: String(orderNumber).replace(/^#/, "").trim() };

    const updatedOrder = await prisma.order.update({
      where: whereClause as any,
      data: { status: status as OrderStatus },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("API /api/admin/orders PATCH error:", error);
    return NextResponse.json({ success: false, error: "Failed to update order status." }, { status: 500 });
  }
}

