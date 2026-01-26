import { NextResponse } from "next/server";

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

interface ReportAttributes {
  title?: string | null;
  description?: DescriptionBlock[] | null;
  type?: string | null;
  datePublished?: string | null;
  publishedAt?: string | null;
  File?: {
    data?: {
      id: number;
      attributes: FileAttributes;
    } | null;
  } | null;
}

interface StrapiResponse {
  data: Array<{
    id: number;
    attributes?: ReportAttributes | null;
  }> | null;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface ProcessedReport {
  id: number;
  title: string;
  description: DescriptionBlock[];
  type: string;
  datePublished: string | null;
  File: FileAttributes | null;
}

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

    // ✅ SORT + FILTER AT STRAPI LEVEL
    const strapiUrl =
  `${CMS_URL}/api/reports` +
  `?pagination[page]=${page}` +
  `&pagination[pageSize]=${pageSize}` +
  `&sort=datePublished:desc` +
  `&filters[publishedAt][$notNull]=true` +
  `&populate=*`;


    const response = await fetch(strapiUrl, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Strapi fetch failed:", response.status);
      return NextResponse.json(
        { data: [], meta: null },
        { status: response.status }
      );
    }

    const strapiResponse: StrapiResponse = await response.json();
    const safeData = Array.isArray(strapiResponse.data)
      ? strapiResponse.data
      : [];

    const processedReports: ProcessedReport[] = safeData.map((item) => {
      const attr = item.attributes ?? {};
      const fileData = attr.File?.data?.attributes ?? null;

      return {
        id: item.id,
        title: attr.title?.trim() || "Untitled Report",
        description: Array.isArray(attr.description)
          ? attr.description
          : [],
        type: attr.type ?? "Report",
        // ✅ NEVER return fake strings for dates
        datePublished: attr.datePublished ?? attr.publishedAt ?? null,
        File: fileData,
      };
    });

    return NextResponse.json(
      {
        data: processedReports,
        meta: strapiResponse.meta,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { data: [], meta: null },
      { status: 500 }
    );
  }
}
