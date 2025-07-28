import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page") || "1";
  const pageSize = req.nextUrl.searchParams.get("pageSize") || "12";

  const strapiRes = await fetch(
    `${process.env.STRAPI_API}/galleries?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      },
    }
  );

  if (!strapiRes.ok) {
    console.error(`Strapi error: ${strapiRes.status}`);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }

  const data = await strapiRes.json();
  return NextResponse.json(data);
}
