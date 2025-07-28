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
  description: DescriptionBlock[];
  type: string;
  datePublished: string;
  File: FileAttributes | null;
}

interface StrapiResponse {
  data: Array<{
    id: number;
    attributes: ReportAttributes;
  }>;
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
  File: FileAttributes | null; // Align with ReportItem type
}

export async function GET(request: Request) {
  try {
    const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL;
    if (!CMS_URL) {
      console.error('CMS URL is not defined.');
      return NextResponse.json({ error: 'CMS URL not configured' }, { status: 500 });
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

    if (!response.ok) {
      throw new Error(`Failed to fetch reports: ${response.statusText}`);
    }

    const strapiResponse: StrapiResponse = await response.json();

    const processedReports: ProcessedReport[] = strapiResponse.data.map((item) => {
      const { id, attributes } = item;
      const { title, description, type, datePublished, File } = attributes;

      console.log(`Report ID ${id} File data:`, File);

      return {
        id,
        title,
        description,
        type,
        datePublished,
        File, // Pass the File object directly
      };
    });

    return NextResponse.json({
      data: processedReports,
      meta: strapiResponse.meta,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}