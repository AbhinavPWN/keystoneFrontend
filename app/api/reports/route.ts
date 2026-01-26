import { NextResponse } from 'next/server';

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
  publishedAt?: string | null; // 🔹 Added fallback if datePublished missing
  File?: FileAttributes | null;
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
  datePublished: string;
  File: FileAttributes | null;
}

export async function GET(request: Request) {
  try {
    const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL;

    if (!CMS_URL) {
      console.error('CMS URL is not defined.');
      return NextResponse.json({ data: [], meta: null }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('pagination[page]') || '1';
    const pageSize = searchParams.get('pagination[pageSize]') || '4';

    const response = await fetch(
      `${CMS_URL}/api/reports?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=File`,
      { headers: { 'Content-Type': 'application/json' }, cache: 'no-store' }
    );

    // 🔹 Safe guard for non-OK response
    if (!response.ok) {
      console.error('Strapi response not OK:', response.status);
      return NextResponse.json({ data: [], meta: null }, { status: response.status });
    }

    const strapiResponse: StrapiResponse = await response.json();

    // 🔹 Ensure we always have an array
    const safeData = Array.isArray(strapiResponse.data) ? strapiResponse.data : [];

    const processedReports: ProcessedReport[] = safeData.map((item) => {
      const attr = item.attributes ?? {};

      // 🔹 Fallbacks for missing data
      return {
        id: item.id,
        title: attr.title ?? 'Untitled Report', // Default title
        description: attr.description ?? [], // Always an array
        type: attr.type ?? 'Report',
        datePublished: attr.datePublished || attr.publishedAt || 'Unknown date', // 🔹 fallback
        File: attr.File ?? null,
      };
    });

    return NextResponse.json({ data: processedReports, meta: strapiResponse.meta }, { status: 200 });

  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ data: [], meta: null }, { status: 500 });
  }
}
