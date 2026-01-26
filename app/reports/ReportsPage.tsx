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
    const siteUrl =
      process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const res = await fetch(
      `${siteUrl}/api/reports?pagination[page]=1&pagination[pageSize]=4`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error(`Fetch failed with status ${res.status}`);
    }

    const json: ApiResponse = await res.json();

    return (
      <Reports
        initialReports={json.data}
        initialMeta={json.meta.pagination}
      />
    );
  } catch (error) {
    console.error("ReportsPageContent fetch error:", error);
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load reports. Please try again later.
      </div>
    );
  }
}
