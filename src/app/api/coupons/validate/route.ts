import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;

    if (!code) {
      return NextResponse.json({ success: false, error: "কুপন কোড প্রদান করুন" }, { status: 400 });
    }

    const orderSubtotal = Number(subtotal) || 0;
    const cleanCode = code.trim().toUpperCase();

    // Check DB first
    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    // If not found in DB, check default mock coupons
    if (!coupon) {
      if (cleanCode === "PONCHO10") {
        const discountAmount = Math.min(300, Math.round(orderSubtotal * 0.1));
        return NextResponse.json({
          success: true,
          valid: true,
          discountAmount,
          code: cleanCode,
          message: "১০% ছাড় প্রয়োগ করা হয়েছে!",
        });
      }
      if (cleanCode === "WELCOME50") {
        const discountAmount = Math.min(orderSubtotal, 50);
        return NextResponse.json({
          success: true,
          valid: true,
          discountAmount,
          code: cleanCode,
          message: "৳৫০ ছাড় প্রয়োগ করা হয়েছে!",
        });
      }
      return NextResponse.json({ success: false, valid: false, error: "অবৈধ কুপন কোড" }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ success: false, valid: false, error: "এই কুপনটি বর্তমানে নিষ্ক্রিয়" }, { status: 400 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ success: false, valid: false, error: "কুপনটির মেয়াদ শেষ হয়ে গেছে" }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ success: false, valid: false, error: "কুপনটির ব্যবহারের সর্বোচ্চ সীমা শেষ হয়েছে" }, { status: 400 });
    }

    const minAmount = coupon.minOrderAmount ? Number(coupon.minOrderAmount) : 0;
    if (orderSubtotal < minAmount) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: `এই কুপনটি পেতে ন্যূনতম ৳${minAmount} এর অর্ডার করতে হবে`,
      }, { status: 400 });
    }

    let discountAmount = 0;
    const couponVal = Number(coupon.value);

    if (coupon.type === "PERCENTAGE") {
      discountAmount = Math.round(orderSubtotal * (couponVal / 100));
      if (coupon.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, Number(coupon.maxDiscountAmount));
      }
    } else {
      discountAmount = Math.min(orderSubtotal, couponVal);
    }

    return NextResponse.json({
      success: true,
      valid: true,
      couponId: coupon.id,
      code: coupon.code,
      discountAmount,
      message: `✓ ৳${discountAmount} ছাড় সফলভাবে প্রয়োগ করা হয়েছে!`,
    });
  } catch (error) {
    console.error("POST /api/coupons/validate error:", error);
    return NextResponse.json({ success: false, error: "কুপন যাচাইকরণে সমস্যা হয়েছে" }, { status: 500 });
  }
}
