import { NextResponse } from "next/server";

/* =========================
   STRAPI RESPONSE TYPES
   ========================= */

interface DescriptionChild {
  text: string;
  type: string;
}

interface DescriptionBlock {
  type: string;
  children: DescriptionChild[];
}

interface FileAttributes {
  id: number;
  name: string;
  url: string;
  ext: string;
  mime: string;
}

/**
 * This matches YOUR Strapi response:
 * - Flat fields (NO attributes wrapper)
 * - populate=* already flattens relations
 */
interface StrapiReport {
  id: number;
  title?: string | null;
  description?: DescriptionBlock[] | null;
  type?: string | null;
  datePublished?: string | null;
  publishedAt?: string | null;
  File?: FileAttributes | null;
}

interface StrapiResponse {
  data: StrapiReport[] | null;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/* =========================
   FRONTEND SAFE SHAPE
   ========================= */

interface ProcessedReport {
  id: number;
  title: string;
  description: DescriptionBlock[];
  type: string;
  datePublished: string | null;
  File: FileAttributes | null;
}

/* =========================
   API HANDLER
   ========================= */

export async function GET(request: Request) {
  try {
    const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL;

    if (!CMS_URL) {
      console.error("CMS URL is not defined");
      return NextResponse.json(
        { data: [], meta: null },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("pagination[page]") ?? "1";
    const pageSize = searchParams.get("pagination[pageSize]") ?? "4";

    // ✅ SINGLE SOURCE OF TRUTH:
    // Sorting + filtering happens ONLY in Strapi
    const strapiUrl =
      `${CMS_URL}/api/reports` +
      `?pagination[page]=${page}` +
      `&pagination[pageSize]=${pageSize}` +
      `&sort=datePublished:desc` +
      `&filters[publishedAt][$notNull]=true` +
      `&populate=*`;

    const response = await fetch(strapiUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Strapi fetch failed:", response.status);
      return NextResponse.json(
        { data: [], meta: null },
        { status: response.status }
      );
    }

    const strapiResponse: StrapiResponse = await response.json();

    const safeData: StrapiReport[] = Array.isArray(strapiResponse.data)
      ? strapiResponse.data
      : [];

    const processedReports: ProcessedReport[] = safeData.map((item) => ({
      id: item.id,
      title: item.title?.trim() || "Untitled Report",
      description: Array.isArray(item.description)
        ? item.description
        : [],
      type: item.type ?? "Report",
      // ✅ Never inject fake strings into dates
      datePublished: item.datePublished ?? item.publishedAt ?? null,
      File: item.File ?? null,
    }));

    return NextResponse.json(
      {
        data: processedReports,
        meta: strapiResponse.meta,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reports API error:", error);
    return NextResponse.json(
      { data: [], meta: null },
      { status: 500 }
    );
  }
}
