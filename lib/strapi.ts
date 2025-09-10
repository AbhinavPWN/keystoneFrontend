// lib/strapi.ts

// Use environment variable for Strapi URL
export const STRAPI_API =
  process.env.NEXT_PUBLIC_STRAPI_API || 'http://localhost:1337';

export function getStrapiMedia(url: string | undefined) {
  if (!url) return '/default-image.png';
  // If the URL is already absolute (starts with http), return as is
  return url.startsWith('http') ? url : `${STRAPI_API}${url}`;
}
