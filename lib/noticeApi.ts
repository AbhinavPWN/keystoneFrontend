// lib/noticeApi.ts
import { Notice, NoticeAttachment } from "@/app/types/notices";
import { RichTextNode } from "@/app/about/[slug]/types";

// Strapi notice type
interface StrapiNoticeFile {
  id: number;
  name?: string;
  url?: string;
  alternativeText?: string | null;
  mime?: string;
  size?: number;
}

interface StrapiNoticeAttachment {
  id: number;
  label?: string;
  title?: string;
  file?: StrapiNoticeFile;
}

interface StrapiNoticeThumbnail {
  url?: string;
  alternativeText?: string | null;
}

interface StrapiNotice {
  id: number;
  title?: string;
  slug?: string;
  content?: RichTextNode[];
  is_featured?: boolean;
  thumbnail?: StrapiNoticeThumbnail;
  attachment?: StrapiNoticeAttachment[];
  priority?: number;
  pinned_until?: string;
}

interface StrapiResponse {
  data: StrapiNotice[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export async function fetchFeaturedNotice(): Promise<Notice | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_URL}/api/updates?filters[is_featured][$eq]=true&sort[0]=priority:desc&populate=*`
    );

    if (!res.ok) {
      console.error("Failed to fetch featured notice:", res.status, res.statusText);
      return null;
    }

    const data: StrapiResponse = await res.json();
    if (!data?.data || data.data.length === 0) return null;

    const featured = data.data[0];

    const mappedAttachments: NoticeAttachment[] =
      (featured.attachment ?? []).map((att) => ({
        id: att.id,
        label: att.label ?? att.title ?? `Attachment ${att.id}`,
        title: att.title ?? "",
        file: att.file
          ? {
              id: att.file.id,
              name: att.file.name ?? `File ${att.file.id}`,
              url: att.file.url ?? "",
              alternativeText: att.file.alternativeText ?? null,
              mime: att.file.mime,
              size: att.file.size,
            }
          : undefined, // optional file
      }));

    const notice: Notice = {
      id: featured.id,
      title: featured.title ?? "Untitled Notice",
      slug: featured.slug ?? "",
      content: featured.content ?? [],
      is_featured: featured.is_featured ?? false,
      thumbnail: featured.thumbnail?.url,
      attachment: mappedAttachments,
      priority: featured.priority,
      pinned_until: featured.pinned_until,
    };

    return notice;
  } catch (err) {
    console.error("Error fetching featured notice:", err);
    return null;
  }
}
