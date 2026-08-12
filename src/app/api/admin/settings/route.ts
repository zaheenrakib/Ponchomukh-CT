import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json(); // Array of { key, value, group } or key-value map

    if (typeof body === "object") {
      for (const [key, value] of Object.entries(body)) {
        await prisma.siteSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API /api/admin/settings POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to update site settings." }, { status: 500 });
  }
}
