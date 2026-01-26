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
  title: string;
  description: DescriptionBlock[] | null;
  type: string;
  datePublished: string;
  File: FileAttributes | null;
}

interface StrapiResponse {
  data: Array<{
    id: number;
    attributes: ReportAttributes;
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
      return NextResponse.json(
        { data: [], meta: null },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('pagination[page]') || '1';
    const pageSize = searchParams.get('pagination[pageSize]') || '4';

    const response = await fetch(
      `${CMS_URL}/api/reports?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=File`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    // 🔹 CHANGE #1: Do NOT throw on non-200
    if (!response.ok) {
      console.error('Strapi response not OK:', response.status);
      return NextResponse.json(
        { data: [], meta: null },
        { status: response.status }
      );
    }

    const strapiResponse: StrapiResponse = await response.json();

    // 🔹 CHANGE #2: Defensive guard for pagination edge cases
    const safeData = Array.isArray(strapiResponse.data)
      ? strapiResponse.data
      : [];

    const processedReports: ProcessedReport[] = safeData.map((item) => {
      const { id, attributes } = item;

      return {
        id,
        title: attributes?.title ?? '',
        description: attributes?.description ?? [],
        type: attributes?.type ?? '',
        datePublished: attributes?.datePublished ?? '',
        File: attributes?.File ?? null,
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
    console.error('Error fetching reports:', error);

    // 🔹 CHANGE #3: Always return safe structure
    return NextResponse.json(
      { data: [], meta: null },
      { status: 500 }
    );
  }
}
