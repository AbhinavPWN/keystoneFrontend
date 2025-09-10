// lib/fallbackData.ts

// ---------------- Types ----------------
type RichTextNode = {
  type: string;
  children: { text: string; type: string }[];
};

type StrapiImage = {
  url: string;
  formats?: Record<string, { url: string }>;
  alternativeText?: string;
};

type BoardMember = {
  id: number;
  documentId: string;
  name: string;
  position: string;
  image: StrapiImage | string | null;
  bio?: RichTextNode[] | null;
};

type Investment = {
  id: number;
  title: string;
  description?: string;
  url?: string;
  logo: StrapiImage | string | null;
};

type AdvisoryMember = {
  id: number;
  documentId: string;
  name: string;
  image: StrapiImage | string | null;
};

// ---------------- Fallback Data ----------------

// ✅ Matches BoardMember shape
export const fallbackBoard: BoardMember[] = [
  {
    id: 1,
    documentId: "board-1",
    name: "Fallback Director",
    position: "Managing Director",
    image: "/default-avatar.png",
    bio: [
      {
        type: "paragraph",
        children: [
          { text: "Experienced leader with fallback data.", type: "text" }, // 👈 fixed
        ],
      },
    ],
  },
];

// ✅ Matches Investment shape
export const fallbackInvestments: Investment[] = [
  {
    id: 1,
    title: "Fallback Investment",
    description: "Example project for fallback state.",
    url: "https://example.com",
    logo: "/default-logo.png",
  },
];

// ✅ Matches AdvisoryMember shape
export const fallbackAdvisory: AdvisoryMember[] = [
  {
    id: 1,
    documentId: "adv-1",
    name: "Fallback Advisor",
    image: "/default-avatar.png",
  },
];
