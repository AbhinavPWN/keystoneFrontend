// lib/getStrapiMedia.ts

type StrapiImageFormats = {
  small?: { url: string }
  medium?: { url: string }
  large?: { url: string }
  thumbnail?: { url: string }
}

// Updated to match your types.ts StrapiImage definition
type StrapiImage = 
  | { id?: number; url?: string; alternativeText?: string | null; formats?: Record<string, { url: string }> }
  | { data?: { attributes?: { url: string; alternativeText?: string | null; formats?: Record<string, { url: string }> } } | null }
  | Array<{ id?: number; url?: string; alternativeText?: string | null; formats?: Record<string, { url: string }> }>
  | null;

export function getStrapiMedia(
  image: StrapiImage | string | null | undefined,
  size: keyof StrapiImageFormats = "small"
): string {
  const base = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:1337"

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === "development") {
    console.log("getStrapiMedia input:", { image, size, base });
  }

  if (!image) {
    console.warn("No image provided to getStrapiMedia");
    return "/default-image.png";
  }

  // ✅ Case 1: plain string (already a path like "/uploads/..." or full URL)
  if (typeof image === "string") {
    const result = image.startsWith("/") ? `${base}${image}` : image;
    console.log("String image result:", result);
    return result;
  }

  // ✅ Case 2: Array format - take first image
  if (Array.isArray(image)) {
    const firstImage = image[0]
    if (!firstImage || !firstImage.url) {
      console.warn("Array image has no valid first element");
      return "/default-image.png";
    }
    
    const variant = firstImage.formats?.[size]?.url
    if (variant) {
      const result = variant.startsWith("/") ? `${base}${variant}` : variant;
      console.log("Array image variant result:", result);
      return result;
    }
    const result = firstImage.url.startsWith("/") ? `${base}${firstImage.url}` : firstImage.url;
    console.log("Array image original result:", result);
    return result;
  }

  // ✅ Case 3: Nested data.attributes format
  if ("data" in image && image.data?.attributes) {
    const attrs = image.data.attributes
    if (!attrs.url) {
      console.warn("Nested image has no URL in attributes");
      return "/default-image.png";
    }
    
    const variant = attrs.formats?.[size]?.url
    if (variant) {
      const result = variant.startsWith("/") ? `${base}${variant}` : variant;
      console.log("Nested image variant result:", result);
      return result;
    }
    const result = attrs.url.startsWith("/") ? `${base}${attrs.url}` : attrs.url;
    console.log("Nested image original result:", result);
    return result;
  }

  // ✅ Case 4: Direct object format with optional url
  if ("url" in image || "id" in image) {
    if (!image.url) {
      console.warn("Direct object image has no URL");
      return "/default-image.png";
    }
    
    const variant = image.formats?.[size]?.url
    if (variant) {
      const result = variant.startsWith("/") ? `${base}${variant}` : variant;
      console.log("Direct object variant result:", result);
      return result;
    }
    const result = image.url.startsWith("/") ? `${base}${image.url}` : image.url;
    console.log("Direct object original result:", result);
    return result;
  }

  console.warn("Unknown image format:", image);
  return "/default-image.png";
}