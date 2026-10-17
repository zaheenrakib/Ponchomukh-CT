import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { UserRole } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, name, rating, comment, email } = body;

    if (!productId || !name || !rating || !comment) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const reviewerEmail = email?.trim() || `guest_${Date.now()}@ponchomukh.local`;

    // Find or create customer user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: reviewerEmail },
          { name: name.trim() },
        ],
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: reviewerEmail,
          name: name.trim(),
          role: UserRole.CUSTOMER,
        },
      });
    }

    const newReview = await prisma.review.create({
      data: {
        productId,
        userId: user.id,
        rating: Math.max(1, Math.min(5, parseInt(rating, 10))),
        comment: comment.trim(),
        images: [],
        isVerifiedPurchase: false,
        isModerated: false,
        isApproved: true, // auto-approve for instant storefront feedback
      },
    });

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ success: false, error: "Failed to submit review" }, { status: 500 });
  }
}
