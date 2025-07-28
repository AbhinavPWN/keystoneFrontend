import { Suspense } from "react";
import Gallery from "../components/Gallery";
import GallerySkeleton from "../components/GallerySkeleton";
import { defaultMetadata } from "../../lib/seo";

export const metadata = {
  ...defaultMetadata,
  title: "Gallery - Keystone",
  description: "Browse our gallery of memorable moments and events.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Gallery - Keystone",
    description: "Browse our gallery of memorable moments and events.",
    url: `${defaultMetadata.metadataBase}gallery`,
  },
  twitter: {
    ...defaultMetadata.twitter,
    title: "Gallery - Keystone",
    description: "Browse our gallery of memorable moments and events.",
  },
};

export const revalidate = 60;
export const dynamic = "force-dynamic";


export default function GalleryPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center text-black font-[playfair]">
        Gallery
      </h1>

      <Suspense fallback={<GallerySkeleton />}>
        <Gallery />
      </Suspense>
    </main>
  );
}
