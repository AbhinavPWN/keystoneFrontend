// types/notice.ts
import { RichTextNode } from "@/app/about/[slug]/types";

export type NoticeAttachment = {
  label: string;
  file?: {
    id: number;
    name: string;
    url: string;
    alternativeText?: string | null;
    mime?: string;
    size?: number;
  };
};

export type Notice = {
  id: number;
  title: string;
  slug: string;
  category?: string;
  date?: string;
  content?: RichTextNode[];
  thumbnail?: string;
  attachment?: NoticeAttachment[]; // ✅ no more 'any'
  is_featured: boolean;
  priority?: number;
  pinned_until?: string;
};
