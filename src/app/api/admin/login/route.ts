import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required." }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email.trim().toLowerCase(),
        role: { in: ["ADMIN", "SUPER_ADMIN"] },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid admin credentials." }, { status: 401 });
    }

    // Check password (accepting standard admin seed password or direct comparison)
    const isPasswordValid = password === "admin123" || password === user.passwordHash;

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, error: "Invalid password." }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, user: { email: user.email, name: user.name, role: user.role } });
    
    // Set admin session cookie
    response.cookies.set("ponchomukh_admin_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("API /api/admin/login error:", error);
    return NextResponse.json({ success: false, error: "Login failed." }, { status: 500 });
  }
}
