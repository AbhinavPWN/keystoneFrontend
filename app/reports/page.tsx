import React, { Suspense } from "react";
import ReportsPageContent from "./ReportsPage";
import ReportsSkeleton from "../components/ReportsSkeleton";
import { defaultMetadata } from "../../lib/seo";
import ClientErrorBoundary from "../components/ClientErrorBoundary"; // new wrapper

export const metadata = {
  ...defaultMetadata,
  title: "Reports - Keystone",
  description: "Read detailed reports and updates from Keystone.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Reports - Keystone",
    description: "Read detailed reports and updates from Keystone.",
    url: `${defaultMetadata.metadataBase}report`,
  },
  twitter: {
    ...defaultMetadata.twitter,
    title: "Reports - Keystone",
    description: "Read detailed reports and updates from Keystone.",
  },
};

export const revalidate = 60;
export const dynamic = "error";

export default function ReportsPage() {
  return (
    <Suspense fallback={<ReportsSkeleton />}>
      <ClientErrorBoundary>
        <ReportsPageContent />
      </ClientErrorBoundary>
    </Suspense>
  );
}
