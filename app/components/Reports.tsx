"use client";

import { useState, useCallback } from "react";
import { HiDownload, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import type { ReportItem, PaginationMeta, DescriptionBlock, DescriptionChild } from "../types/reports";
import ReportsSkeleton from "./ReportsSkeleton";

export default function Reports({
  initialReports,
  initialMeta,
}: {
  initialReports: ReportItem[];
  initialMeta: PaginationMeta;
}) {
  const [reports, setReports] = useState<ReportItem[]>(
    // Sort initial reports by datePublished in descending order (newest first)
    initialReports
      ? [...initialReports].sort(
          (a, b) =>
            new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
        )
      : []
  );
  const [meta, setMeta] = useState<PaginationMeta>(
    initialMeta || { page: 1, pageCount: 1, total: 0, pageSize: 4 }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDescriptionSnippet = (desc: DescriptionBlock[]) => {
    if (!desc?.length) return "No description available.";
    return (
      desc
        .map((block) =>
          block.children?.map((child: DescriptionChild) => child.text).join(" ")
        )
        .join("\n")
        .slice(0, 150) + "..."
    );
  };

  const fetchPage = useCallback(
    async (page: number) => {
      if (page < 1 || page > meta.pageCount) return;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/reports?pagination[page]=${page}&pagination[pageSize]=${meta.pageSize}&populate=File`
        );
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

        const json: {
          data: ReportItem[];
          meta: { pagination: PaginationMeta };
        } = await res.json();

        // Sort fetched reports by datePublished in descending order
        const sortedReports = json.data
          ? [...json.data].sort(
              (a, b) =>
                new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
            )
          : [];

        setReports(sortedReports);
        setMeta(json.meta?.pagination || meta);
      } catch (err) {
        console.error("Pagination fetch error:", err);
        setError("Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    },
    [meta]
  );

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-10 text-center font-[playfair] text-black">
        Reports
      </h1>

      {error && (
        <p className="text-center text-red-500 mb-6 font-semibold">{error}</p>
      )}

      {loading && <ReportsSkeleton />}

      {!loading && reports.length === 0 && (
        <p className="text-center text-slate-500 dark:text-slate-300">
          No reports available.
        </p>
      )}

      {!loading && (
        <ul className="space-y-8">
          {reports.map((report) => {
            const cmsBaseUrl = process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/$/, "") || "";
            const fileUrl = report.File?.url ? `${cmsBaseUrl}${report.File.url}` : null;

            // Only log in development mode to avoid cluttering production build output
            if (process.env.NODE_ENV !== 'production') {
              console.log(`Report ID ${report.id} fileUrl:`, fileUrl);
              console.log(`Report ID ${report.id} File data:`, report.File);
            }

            return (
              <li
                key={report.id}
                className="border border-gray-700 rounded-lg p-5 shadow-sm hover:shadow-md transition dark:bg-gray-900"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                  <div>
                    {fileUrl ? (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl font-semibold dark:text-slate-200 hover:underline text-blue-950"
                      >
                        {report.title || "Untitled Report"}
                      </a>
                    ) : (
                      <span className="text-xl font-semibold dark:text-slate-400 text-slate-800">
                        {report.title || "Untitled Report"}
                      </span>
                    )}

                    <p className="text-sm text-slate-500 mt-1">
                      Published:{" "}
                      {report.datePublished
                        ? new Date(report.datePublished).toLocaleDateString()
                        : "Unknown date"}
                    </p>
                  </div>

                  {fileUrl ? (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={report.File?.name || "report.pdf"}
                      className="inline-flex items-center gap-1 px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition border border-black"
                      title="Download report"
                    >
                      <HiDownload className="w-5 h-5" />
                      Download
                    </a>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center gap-1 px-4 py-1.5 bg-gray-400 text-white text-sm rounded cursor-not-allowed"
                      title="No file available"
                    >
                      No File
                    </button>
                  )}
                </div>

                <p className="mt-3 text-slate-600 dark:text-slate-400 whitespace-pre-line">
                  {getDescriptionSnippet(report.description)}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      {!loading && meta.pageCount > 1 && (
        <div className="flex justify-center mt-10 gap-6">
          <button
            onClick={() => fetchPage(meta.page - 1)}
            disabled={meta.page <= 1 || loading}
            aria-label="Previous page"
            className="p-2 rounded disabled:opacity-40 disabled:cursor-not-allowed bg-gray-800 hover:bg-gray-700 text-white transition"
          >
            <HiChevronLeft className="w-6 h-6" />
          </button>

          <span className="text-orange-500 text-lg font-semibold select-none self-center">
            Page {meta.page} of {meta.pageCount}
          </span>

          <button
            onClick={() => fetchPage(meta.page + 1)}
            disabled={meta.page >= meta.pageCount || loading}
            aria-label="Next page"
            className="p-2 rounded disabled:opacity-40 disabled:cursor-not-allowed bg-gray-800 hover:bg-gray-700 text-white transition"
          >
            <HiChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </main>
  );
}
