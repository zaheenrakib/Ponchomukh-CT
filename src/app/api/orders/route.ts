import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PaymentMethod, OrderStatus, PaymentStatus, DeliveryType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      division,
      district,
      upazila,
      addressLine,
      deliveryArea, // "INSIDE_DHAKA" | "OUTSIDE_DHAKA"
      items, // array of { productVariantId, quantity, price }
      couponCode,
      orderNotes,
    } = body;

    if (!name || !phone || !addressLine || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Required order fields are missing." },
        { status: 400 }
      );
    }

    // 1. Calculate shipping fee & totals
    const isInsideDhaka = deliveryArea === "INSIDE_DHAKA" || division?.toLowerCase().includes("dhaka");
    const shippingFee = isInsideDhaka ? 60 : 120;

    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price * item.quantity;
    }

    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });
      if (coupon && coupon.isActive) {
        if (coupon.type === "PERCENTAGE") {
          discount = (subtotal * Number(coupon.value)) / 100;
          if (coupon.maxDiscountAmount && discount > Number(coupon.maxDiscountAmount)) {
            discount = Number(coupon.maxDiscountAmount);
          }
        } else {
          discount = Number(coupon.value);
        }
      }
    }

    const total = Math.max(0, subtotal - discount + shippingFee);

    // 2. Generate human readable Order Number (e.g. PN-10025)
    const orderCount = await prisma.order.count();
    const orderNumber = `PN-${10000 + orderCount + 1}`;

    // 3. Find or Create User by Phone/Email
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { phoneNumber: phone },
          ...(email ? [{ email }] : []),
        ],
      },
    });

    if (!user) {
      const tempEmail = email || `guest-${Date.now()}@ponchomukh.com`;
      user = await prisma.user.create({
        data: {
          name,
          phoneNumber: phone,
          email: tempEmail,
        },
      });
    }

    // 4. Create Address Record
    const shippingAddress = await prisma.address.create({
      data: {
        userId: user.id,
        title: "Shipping Address",
        name,
        phone,
        division: division || "Dhaka",
        district: district || "Dhaka",
        area: upazila || "City",
        addressLine1: addressLine,
      },
    });

    // 5. Create Order & Order Items in a Prisma Transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          paymentMethod: PaymentMethod.COD,
          subtotal,
          discount,
          shippingFee,
          total,
          shippingAddressId: shippingAddress.id,
          billingAddressId: shippingAddress.id,
          deliveryType: DeliveryType.CUSTOM,
          orderNotes,
          items: {
            create: items.map((item: { productVariantId: string; quantity: number; price: number }) => ({
              productVariantId: item.productVariantId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
          shippingAddress: true,
        },
      });

      // Decrement product variant stock
      for (const item of items) {
        await tx.productVariant.update({
          where: { id: item.productVariantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    });

    return NextResponse.json({
      success: true,
      orderNumber: newOrder.orderNumber,
      order: newOrder,
    });
  } catch (error) {
    console.error("API /api/orders POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to place order." },
      { status: 500 }
    );
  }
}
