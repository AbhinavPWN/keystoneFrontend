import Reports from "./Reports";
import type { ReportItem, PaginationMeta } from "../types/reports";

type StrapiResponse = {
  data: ReportItem[];
  meta: {
    pagination: PaginationMeta;
  };
};

export const revalidate = 60;

export default async function ReportsSkeleton() {
  const baseUrl = process.env.NEXT_PUBLIC_CMS_URL || "http://135.181.66.188:8080";

  try {
    const res = await fetch(
      `${baseUrl}/api/reports?pagination[page]=1&pagination[pageSize]=4&populate=File`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch fallback reports:", res.status);
      return (
        <div className="text-center text-red-500 mt-10">
          Failed to load fallback reports.
        </div>
      );
    }

    const json: StrapiResponse = await res.json();

    return (
      <Reports
        initialReports={json.data || []}
        initialMeta={json.meta?.pagination || { page: 1, pageCount: 1, total: 0, pageSize: 4 }}
      />
    );
  } catch (error) {
    console.error("Error loading fallback reports:", error);
    return (
      <div className="text-center text-red-500 mt-10">
        Could not load reports at this time.
      </div>
    );
  }
}