import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CouponType } from "@prisma/client";

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    const mapped = coupons.map((c) => ({
      id: c.id,
      code: c.code,
      type: c.type,
      value: Number(c.value),
      minOrder: c.minOrderAmount ? Number(c.minOrderAmount) : 0,
      maxDiscount: c.maxDiscountAmount ? Number(c.maxDiscountAmount) : Number(c.value),
      usageCount: c.usageCount,
      expiryDate: c.expiresAt ? c.expiresAt.toISOString().split("T")[0] : "2026-12-31",
      status: c.isActive ? "ACTIVE" : "INACTIVE",
    }));

    return NextResponse.json({ success: true, coupons: mapped });
  } catch (error) {
    console.error("GET /api/admin/coupons error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, type, value, minOrder, maxDiscount, expiryDate } = body;

    if (!code || !value) {
      return NextResponse.json({ success: false, error: "Code and value are required" }, { status: 400 });
    }

    const couponType = type === "FIXED" ? CouponType.FIXED : CouponType.PERCENTAGE;

    const coupon = await prisma.coupon.create({
      data: {
        code: code.trim().toUpperCase(),
        type: couponType,
        value: Number(value),
        minOrderAmount: minOrder ? Number(minOrder) : null,
        maxDiscountAmount: maxDiscount ? Number(maxDiscount) : null,
        expiresAt: expiryDate ? new Date(expiryDate) : null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/coupons error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ success: false, error: "Coupon code already exists" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "Failed to create coupon" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Coupon ID is required" }, { status: 400 });
    }

    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    console.error("DELETE /api/admin/coupons error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete coupon" }, { status: 500 });
  }
}
