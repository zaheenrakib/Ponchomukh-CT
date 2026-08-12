import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: "orderId and status are required." }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as OrderStatus },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("API /api/admin/orders PATCH error:", error);
    return NextResponse.json({ success: false, error: "Failed to update order status." }, { status: 500 });
  }
}
