import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PaymentMethod, OrderStatus, PaymentStatus, DeliveryType } from "@prisma/client";

// 1. GET Handler: Lookup order for tracking or customer history
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");
    const phone = searchParams.get("phone");

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: "Order number is required." },
        { status: 400 }
      );
    }

    const cleanOrderNumber = orderNumber.trim().replace(/^#/, "");

    const order = await prisma.order.findFirst({
      where: {
        orderNumber: { equals: cleanOrderNumber, mode: "insensitive" },
        ...(phone ? { shippingAddress: { phone: { contains: phone.trim() } } } : {}),
      },
      include: {
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
        shippingAddress: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("API /api/orders GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve order." },
      { status: 500 }
    );
  }
}

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
      items, // array of { productVariantId, quantity, price? }
      couponCode,
      orderNotes,
    } = body;

    if (!name || !phone || !addressLine || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Required order fields are missing." },
        { status: 400 }
      );
    }

    // 1. Calculate shipping fee
    const isInsideDhaka = deliveryArea === "INSIDE_DHAKA" || division?.toLowerCase().includes("dhaka");
    const shippingFee = isInsideDhaka ? 60 : 120;

    // 2. SERVER-SIDE PRICE & STOCK VERIFICATION
    let subtotal = 0;
    const validatedItems: Array<{
      productVariantId?: string;
      quantity: number;
      price: number;
      name: string;
      image?: string;
      variantExistsInDb: boolean;
    }> = [];

    for (const item of items) {
      const qty = Math.max(1, parseInt(String(item.quantity || 1), 10));
      let unitPrice = typeof item.price === "number" && item.price > 0 ? item.price : 0;
      let itemName = item.name || "Product Item";
      let itemImage = item.image || "";
      let variantExistsInDb = false;

      if (item.productVariantId) {
        try {
          const dbVariant = await prisma.productVariant.findUnique({
            where: { id: item.productVariantId },
            include: { product: { include: { images: true } } },
          });

          if (dbVariant) {
            variantExistsInDb = true;
            // ENFORCE SERVER-SIDE VERIFIED PRICE
            unitPrice = Number(dbVariant.price || dbVariant.product.salePrice || dbVariant.product.basePrice);
            itemName = dbVariant.product.name;
            itemImage = dbVariant.product.images?.[0]?.imageUrl || "";

            // Check stock availability
            if (dbVariant.stock < qty) {
              return NextResponse.json(
                {
                  success: false,
                  error: `"${itemName}" পর্যাপ্ত পরিমাণে স্টকে নেই (স্টক: ${dbVariant.stock})।`,
                },
                { status: 400 }
              );
            }
          }
        } catch (dbErr) {
          console.warn("Could not query DB variant for price verification:", dbErr);
        }
      }

      subtotal += unitPrice * qty;
      validatedItems.push({
        productVariantId: item.productVariantId,
        quantity: qty,
        price: unitPrice,
        name: itemName,
        image: itemImage,
        variantExistsInDb,
      });
    }

    // 3. Coupon Verification
    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });
      if (coupon && coupon.isActive) {
        if (!coupon.minOrderAmount || subtotal >= Number(coupon.minOrderAmount)) {
          if (coupon.type === "PERCENTAGE") {
            discount = (subtotal * Number(coupon.value)) / 100;
            if (coupon.maxDiscountAmount && discount > Number(coupon.maxDiscountAmount)) {
              discount = Number(coupon.maxDiscountAmount);
            }
          } else {
            discount = Number(coupon.value);
          }
        }
      } else if (couponCode.trim().toUpperCase() === "PONCHO10") {
        discount = Math.min((subtotal * 10) / 100, 300);
      } else if (couponCode.trim().toUpperCase() === "WELCOME50") {
        discount = 50;
      }
    }

    const total = Math.max(0, subtotal - discount + shippingFee);

    // 4. Collision-Safe Human-Readable Order ID (e.g. PN10852)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `PN${Date.now().toString().slice(-4)}${randomSuffix.toString().slice(-1)}`;

    // 5. Find or Create Customer
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { phoneNumber: phone },
          ...(email ? [{ email }] : []),
        ],
      },
    });

    if (!user) {
      const tempEmail = email || `guest-${Date.now()}-${randomSuffix}@ponchomukh.com`;
      user = await prisma.user.create({
        data: {
          name,
          phoneNumber: phone,
          email: tempEmail,
        },
      });
    }

    // 6. Create Address Record
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

    // 7. Create Order & Order Items in Prisma Transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      // Filter items with valid database variants for DB relation
      const dbRelationItems = validatedItems.filter((i) => i.variantExistsInDb && i.productVariantId);

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
            create: dbRelationItems.map((item) => ({
              productVariantId: item.productVariantId!,
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

      // Safely decrement stock for DB variants
      for (const item of dbRelationItems) {
        await tx.productVariant.update({
          where: { id: item.productVariantId! },
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
