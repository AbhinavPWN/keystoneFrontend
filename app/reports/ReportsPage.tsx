import Reports from "../components/Reports";
import type { ReportItem, PaginationMeta } from "../types/reports";

type ApiResponse = {
  data: ReportItem[];
  meta: {
    pagination: PaginationMeta;
  };
};

export const dynamic = "force-dynamic";

export default async function ReportsPageContent() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/reports?pagination[page]=1&pagination[pageSize]=4`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch reports: ${res.status}`);
    }

    const json: ApiResponse = await res.json();

    return (
      <Reports
        initialReports={json.data}
        initialMeta={json.meta.pagination}
      />
    );
  } catch (error) {
    console.error(error);
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load reports. Please try again later.
      </div>
    );
  }
}
