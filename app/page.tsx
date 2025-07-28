import Hero from "./components/Hero";
import AboutPreview from "./components/AboutPreview";
import Services from "./components/ServicesPreview";
import MissionVision from "./components/MissionVision";
import Cta from "./components/CTA";
import ContactInfo from "./components/ContactInfo";

import { defaultMetadata } from "../lib/seo";

export const metadata = {
  ...defaultMetadata,
  openGraph: {
    ...defaultMetadata.openGraph,
    url: `${defaultMetadata.metadataBase}`,
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="max-w-screen-xl mx-auto px-4 py-8 font-[playfair]">
        <AboutPreview />
        <MissionVision />
        <Services />
        <Cta />
        <ContactInfo />
      </section>
    </>
  );
}
