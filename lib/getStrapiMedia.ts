// lib/getStrapiMedia.ts

type StrapiImageFormats = {
  small?: { url: string }
  medium?: { url: string }
  large?: { url: string }
  thumbnail?: { url: string }
}

type StrapiImage = {
  url: string
  formats?: StrapiImageFormats
  alternativeText?: string
}

export function getStrapiMedia(
  image: StrapiImage | string | null | undefined,
  size: keyof StrapiImageFormats = "small"
): string {
  const base = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:1337"

  if (!image) return "/default-image.png"

  // ✅ Case 1: plain string (already a path like "/uploads/..." or full URL)
  if (typeof image === "string") {
    return image.startsWith("/") ? `${base}${image}` : image
  }

  // ✅ Case 2: Strapi object
  if (!image.url) return "/default-image.png"

  const variant = image.formats?.[size]?.url
  if (variant && process.env.NODE_ENV === "production") {
    return variant.startsWith("/") ? `${base}${variant}` : variant
  }

  return image.url.startsWith("/") ? `${base}${image.url}` : image.url
}
