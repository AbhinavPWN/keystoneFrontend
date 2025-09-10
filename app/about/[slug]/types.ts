// app/[slug]/types.ts
export type NormalizedStrapiImage = {
  url: string;
  alternativeText?: string | null;
  formats?: Record<string, { url: string }>;
};
// ---------------- Rich Text ----------------
export type RichTextNode = {
  type: string;
  children: { text: string; type: string }[];
};

// ---------------- Media ----------------
export type StrapiImage =
  | { id?: number; url?: string; alternativeText?: string | null; formats?: Record<string, { url: string }>; }
  | { data?: { attributes?: { url: string; alternativeText?: string | null; formats?: Record<string, { url: string }> } } | null; }
  | Array<{ id?: number; url?: string; alternativeText?: string | null; formats?: Record<string, { url: string }> }>
  | null;

// ---------------- Commitments ----------------
export type Commitment = {
  id?: number;
  title?: string;
  description?: RichTextNode[];
};

// ---------------- Investment ----------------
export type Investment = {
  id: number;
  title: string;
  description?: RichTextNode[];
  logo?: string; // normalized string after fetching
  url?: string;
};

// ---------------- About Content ----------------
export type AboutContent = {
  id?: number;
  documentId?: string;
  title?: string;
  slug?: string;
  heroText?: RichTextNode[];
  story?: RichTextNode[];
  image?: StrapiImage | string | null;
  Commitments?: Commitment[];
};

// ---------------- Board Member ----------------
export type BoardMember = {
  id: number;
  documentId: string;
  name: string;
  position: string;
  bio?: RichTextNode[] | null;
  image: string;
};

// ---------------- Advisory Member ----------------
export type AdvisoryMember = {
  id: number;
  documentId: string;
  name: string;
  image: string;
};

// ---------------- API Response Types ----------------
export interface StrapiResponse<T> {
  data: T[] | null;
  meta?: { pagination?: { page: number; pageSize: number; pageCount: number; total: number } };
}

export interface CompanyData {
  id: number;
  documentId?: string;
  name?: string;
  slug?: string;
  description?: RichTextNode[];
  about_content?: AboutContent;
  board_members?: Array<{
    id: number;
    documentId?: string;
    Name?: string;
    Bio?: RichTextNode[] | null;
    position?: { title: string } | string;
    Image?: StrapiImage;
    companies?: Array<{ id: number; slug: string }>; // Simplified relation
  }>;
  advisories?: Array<{
    id: number;
    documentId?: string;
    name?: string;
    Name?: string;
    Image?: StrapiImage;
    companies?: Array<{ id: number; slug: string }>; // Simplified relation
  }>;
  investments?: Array<{
    id: number;
    title?: string;
    description?: RichTextNode[];
    logo?: StrapiImage;
    url?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}