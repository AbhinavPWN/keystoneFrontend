// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const strapiRes = await fetch(`${process.env.STRAPI_API}/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, password }),
    });

    const data = await strapiRes.json();

    if (!strapiRes.ok || !data.jwt) {
      const errorMsg =
        data?.error?.message || "Invalid credentials or Strapi error";
      return NextResponse.json({ message: errorMsg }, { status: 401 });
    }

    const response = NextResponse.json({ message: "Login successful" });

    response.cookies.set("keystone_token", data.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
