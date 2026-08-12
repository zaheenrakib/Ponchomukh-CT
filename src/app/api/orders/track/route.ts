import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query) {
      return NextResponse.json({ success: false, error: "Search query is required." }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: { equals: query, mode: "insensitive" } },
          { user: { phoneNumber: { contains: query } } },
        ],
      },
      include: {
        items: true,
        shippingAddress: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("API /api/orders/track error:", error);
    return NextResponse.json({ success: false, error: "Tracking error." }, { status: 500 });
  }
}
