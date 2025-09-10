// lib/mapStrapiNotice.ts

// ---------------- Text & Content Types ----------------
export interface StrapiTextNode {
  text: string
}

export interface StrapiContentBlock {
  type: string
  children: StrapiTextNode[]
}

// ---------------- Media Types ----------------
export interface StrapiThumbnail {
  url: string
  alternativeText?: string | null
}

export interface StrapiAttachmentFile {
  id: number
  name: string
  url: string
  mime?: string
  size?: number // Added size property
}

export interface StrapiAttachment {
  id: number
  label: string
  file?: StrapiAttachmentFile
}

export interface StrapiTag {
  id: number
  name: string
  slug: string
}

// ---------------- Notice Type ----------------
export interface StrapiNotice {
  id: number
  title: string
  slug: string
  date: string
  content: StrapiContentBlock[]
  thumbnail?: StrapiThumbnail
  attachments?: StrapiAttachment[]
  tags?: StrapiTag
  is_featured?: boolean
  priority?: number
  pinned_until?: string | null
}

// ---------------- Raw API Types ----------------
interface RawAttachment {
  id: number
  label: string
  file?: {
    id: number
    name: string
    url: string
    mime?: string
    size?: number // Added size to match API response
  }
}

interface RawTag {
  id: number
  name: string
  slug: string
}

// Flat response from older Strapi
interface FlatNoticeResponse {
  id: number
  title: string
  slug: string
  date: string
  content: StrapiContentBlock[]
  thumbnail?: StrapiThumbnail
  attachment?: RawAttachment[]
  tags?: RawTag
  is_featured?: boolean
  priority?: number
  pinned_until?: string | null
}

// Nested response from newer Strapi
interface NestedNoticeResponse {
  id: number
  attributes: {
    title: string
    slug: string
    date: string
    content: StrapiContentBlock[]
    thumbnail?: StrapiThumbnail
    attachment?: RawAttachment[]
    tags?: RawTag
    is_featured?: boolean
    priority?: number
    pinned_until?: string | null
  }
}

type StrapiResponseItem = FlatNoticeResponse | NestedNoticeResponse

// ---------------- Mapper Function ----------------
export function mapStrapiNotice(item: StrapiResponseItem): StrapiNotice {
  const attrs = 'attributes' in item ? item.attributes : item

  const attachments: StrapiAttachment[] | undefined = attrs.attachment?.map(
    (att: RawAttachment) => ({
      id: att.id,
      label: att.label || '',
      file: att.file
        ? {
            id: att.file.id,
            name: att.file.name,
            url: att.file.url.startsWith('http')
              ? att.file.url
              : `${process.env.NEXT_PUBLIC_CMS_URL}${att.file.url}`,
            mime: att.file.mime,
            size: att.file.size, // Map the size property
          }
        : undefined,
    })
  )

  const thumbnail: StrapiThumbnail | undefined = attrs.thumbnail
    ? {
        url: attrs.thumbnail.url.startsWith('http')
          ? attrs.thumbnail.url
          : `${process.env.NEXT_PUBLIC_CMS_URL}${attrs.thumbnail.url}`,
        alternativeText: attrs.thumbnail.alternativeText || null,
      }
    : undefined

  const tags: StrapiTag | undefined = attrs.tags
    ? {
        id: attrs.tags.id,
        name: attrs.tags.name,
        slug: attrs.tags.slug,
      }
    : undefined

  return {
    id: item.id,
    title: attrs.title,
    slug: attrs.slug,
    date: attrs.date,
    content: attrs.content || [],
    thumbnail,
    attachments,
    tags,
    is_featured: attrs.is_featured,
    priority: attrs.priority,
    pinned_until: attrs.pinned_until || null,
  }
}