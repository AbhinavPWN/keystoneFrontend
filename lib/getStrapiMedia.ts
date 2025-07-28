// lib/getStrapiMedia.ts
export function getStrapiMedia(url?: string): string {
  const base = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:8080";

  if (!url) return "/fallback.jpg"; // You can replace with your actual fallback image path
  if (url.startsWith("http")) return url;

  return `${base}${url}`;
}

