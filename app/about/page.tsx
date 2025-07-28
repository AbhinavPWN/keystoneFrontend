import { Suspense } from "react";
import AboutSkeleton from "../components/AboutSkeleton";
import AboutUsContent from "./AboutUsContent";
import { defaultMetadata } from "../../lib/seo";

export const metadata = {
  ...defaultMetadata,
  title: "About Us - Keystone",
  description:
    "Learn more about Keystone, our mission, vision, board members, and investments.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "About Us - Keystone",
    description:
      "Learn more about Keystone, our mission, vision, board members, and investments.",
    url: `${defaultMetadata.metadataBase}about`,
  },
  twitter: {
    ...defaultMetadata.twitter,
    title: "About Us - Keystone",
    description:
      "Learn more about Keystone, our mission, vision, board members, and investments.",
  },
};

export const revalidate = 60; // revalidate every 60s
export const dynamic = "force-dynamic";


export default function AboutPage() {
  return (
    <Suspense fallback={<AboutSkeleton />}>
      <AboutUsContent />
    </Suspense>
  );
}
