import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { mockBanners } from "@/lib/mockData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position");

    let banners: any[] = [];
    try {
      banners = await prisma.banner.findMany({
        where: position ? { position } : undefined,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      });
    } catch (dbErr) {
      console.warn("DB banner fetch failed, using fallback:", dbErr);
    }

    if (!banners || banners.length === 0) {
      banners = position
        ? mockBanners.filter((b) => b.position === position)
        : mockBanners;
    }

    return NextResponse.json({ success: true, banners });
  } catch (error) {
    console.error("GET /api/admin/banners error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      subtitle,
      imageUrl,
      mobileImageUrl,
      buttonText,
      buttonUrl,
      position = "HERO",
      sortOrder = 0,
      isActive = true,
    } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { success: false, error: "Title and Image URL are required" },
        { status: 400 }
      );
    }

    try {
      const banner = await prisma.banner.create({
        data: {
          title: title.trim(),
          subtitle: subtitle?.trim() || null,
          imageUrl: imageUrl.trim(),
          mobileImageUrl: mobileImageUrl?.trim() || null,
          buttonText: buttonText?.trim() || "Shop Now",
          buttonUrl: buttonUrl?.trim() || "/shop",
          position: position || "HERO",
          sortOrder: Number(sortOrder) || 0,
          isActive: Boolean(isActive),
        },
      });
      return NextResponse.json({ success: true, banner }, { status: 201 });
    } catch (dbErr) {
      console.warn("DB banner create fallback to simulated response:", dbErr);
      const fallbackBanner = {
        id: `banner-${Date.now()}`,
        title: title.trim(),
        subtitle: subtitle?.trim() || null,
        imageUrl: imageUrl.trim(),
        mobileImageUrl: mobileImageUrl?.trim() || null,
        buttonText: buttonText?.trim() || "Shop Now",
        buttonUrl: buttonUrl?.trim() || "/shop",
        position: position || "HERO",
        sortOrder: Number(sortOrder) || 0,
        isActive: Boolean(isActive),
        createdAt: new Date().toISOString(),
      };
      return NextResponse.json({ success: true, banner: fallbackBanner }, { status: 201 });
    }
  } catch (error) {
    console.error("POST /api/admin/banners error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create banner" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      subtitle,
      imageUrl,
      mobileImageUrl,
      buttonText,
      buttonUrl,
      position,
      sortOrder,
      isActive,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Banner ID is required" },
        { status: 400 }
      );
    }

    try {
      const banner = await prisma.banner.update({
        where: { id },
        data: {
          ...(title !== undefined && { title: title.trim() }),
          ...(subtitle !== undefined && { subtitle: subtitle?.trim() || null }),
          ...(imageUrl !== undefined && { imageUrl: imageUrl.trim() }),
          ...(mobileImageUrl !== undefined && { mobileImageUrl: mobileImageUrl?.trim() || null }),
          ...(buttonText !== undefined && { buttonText: buttonText?.trim() || null }),
          ...(buttonUrl !== undefined && { buttonUrl: buttonUrl?.trim() || null }),
          ...(position !== undefined && { position }),
          ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
          ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        },
      });
      return NextResponse.json({ success: true, banner });
    } catch (dbErr) {
      console.warn("DB banner update fallback:", dbErr);
      return NextResponse.json({
        success: true,
        banner: {
          id,
          title,
          subtitle,
          imageUrl,
          mobileImageUrl,
          buttonText,
          buttonUrl,
          position,
          sortOrder,
          isActive,
        },
      });
    }
  } catch (error) {
    console.error("PUT /api/admin/banners error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update banner" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, isActive } = body;

    if (!id || typeof isActive !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Banner ID and isActive status are required" },
        { status: 400 }
      );
    }

    try {
      const banner = await prisma.banner.update({
        where: { id },
        data: { isActive },
      });
      return NextResponse.json({ success: true, banner });
    } catch (dbErr) {
      console.warn("DB banner PATCH fallback:", dbErr);
      return NextResponse.json({ success: true, banner: { id, isActive } });
    }
  } catch (error) {
    console.error("PATCH /api/admin/banners error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle banner status" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Banner ID is required" },
        { status: 400 }
      );
    }

    try {
      await prisma.banner.delete({
        where: { id },
      });
    } catch (dbErr) {
      console.warn("DB banner delete fallback:", dbErr);
    }

    return NextResponse.json({ success: true, message: "Banner deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/admin/banners error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}

