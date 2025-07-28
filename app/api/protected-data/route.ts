// app/api/protected-data/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("keystone_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized - No token" }, { status: 401 });
  }

  try {
    const res = await fetch(`${process.env.STRAPI_API}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = await res.json();

    if (!res.ok) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
