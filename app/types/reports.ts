export interface DescriptionChild {
  text: string;
  type: string;
}

export interface DescriptionBlock {
  type: string;
  children: DescriptionChild[];
}

export interface FileAttributes {
  id: number;
  name: string;
  url: string;
  ext: string;
  mime: string;
}

export interface ReportItem {
  id: number;
  title: string;
  description: DescriptionBlock[];
  type: string;
  datePublished: string;
  File: FileAttributes | null; // Use File instead of fileUrl
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}