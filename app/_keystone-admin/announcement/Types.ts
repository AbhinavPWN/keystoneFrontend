export interface Announcement {
  id: number;
  documentId: string;
  title: string;
  message: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
