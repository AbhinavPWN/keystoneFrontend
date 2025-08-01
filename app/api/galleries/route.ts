
  import { NextRequest, NextResponse } from "next/server";

  export async function GET(req: NextRequest) {
    const page = req.nextUrl.searchParams.get("page") || "1";
    const pageSize = req.nextUrl.searchParams.get("pageSize") || "12";

    if (!process.env.STRAPI_API) {
      console.error("STRAPI_API environment variable is not set.");
      return NextResponse.json(
        { error: { status: 500, message: "Server configuration error" } },
        { status: 500 }
      );
    }

    try {
      const strapiUrl = `${process.env.STRAPI_API}/galleries?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=Image`;
      const res = await fetch(strapiUrl, {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        console.error(`Strapi error: ${res.status} ${res.statusText}`);
        return NextResponse.json(
          { error: { status: res.status, message: "Failed to fetch gallery data" } },
          { status: res.status }
        );
      }

      const data = await res.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error("Error fetching gallery data:", error);
      return NextResponse.json(
        { error: { status: 500, message: "Internal server error" } },
        { status: 500 }
      );
    }
  }
