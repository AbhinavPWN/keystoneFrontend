import type { Metadata } from "next";

const isProd = process.env.NODE_ENV === "production";

export const baseURL = isProd
  ? "https://www.keystonemc.com.np"
  : "http://localhost:3000";

export const metadataBase = new URL(baseURL);

export const defaultMetadata: Metadata = {
  metadataBase,
  title: "Keystone - Investment & Travel",
  description:
    "Keystone helps you grow wealth and plan journeys. Learn more about our investments, travel services, and vision.",
  openGraph: {
    title: "Keystone - Investment & Travel",
    description:
      "Keystone helps you grow wealth and plan journeys. Learn more about our investments, travel services, and vision.",
    url: baseURL,
    siteName: "Keystone",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Keystone - Investment & Travel",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Keystone - Investment & Travel",
    description:
      "Keystone helps you grow wealth and plan journeys. Learn more about our investments, travel services, and vision.",
    images: ["/og-image.png"],
  },
};
