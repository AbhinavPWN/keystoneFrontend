import Reports from "../components/Reports";
import type { ReportItem, PaginationMeta } from "../types/reports";

type StrapiResponse = {
  data: ReportItem[];
  meta: {
    pagination: PaginationMeta;
  };
};

export const revalidate = 60;

export default async function ReportsPageContent() {
  const baseUrl = process.env.NEXT_PUBLIC_CMS_URL || "http://135.181.66.188:8080";

  try {
    const res = await fetch(
      `${baseUrl}/api/reports?pagination[page]=1&pagination[pageSize]=4&populate=File`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch initial reports:", res.status);
      return (
        <div className="text-center py-10 text-red-500">
          Failed to load reports. Please try again later.
        </div>
      );
    }

    const json: StrapiResponse = await res.json();

    return (
      <Reports
        initialReports={json.data}
        initialMeta={json.meta.pagination}
      />
    );
  } catch (error) {
    console.error("Error fetching reports:", error);
    return (
      <div className="text-center py-10 text-red-500">
        Something went wrong while loading reports. Please try again later.
      </div>
    );
  }
}