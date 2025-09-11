// app/about/[slug]/AboutUsContent.tsx

import AboutUs from "@/app/components/AboutUs";
import {
  AboutContent,
  BoardMember,
  AdvisoryMember,
  Investment,
  CompanyData,
  StrapiImage,
  StrapiResponse,
  RichTextNode,
} from "./types";

type Props = { slug: string };

// ---------------- Helper: Normalize Strapi image ----------------
function getStrapiImageUrl(image?: StrapiImage | string): string {
  if (!image) return "/default-avatar.png";

  if (typeof image === "string") return image;

  if (Array.isArray(image) && image.length > 0 && image[0]?.url) return image[0].url;

  if ("url" in image && image.url) return image.url;

  if ("data" in image && image.data?.attributes?.url) return image.data.attributes.url;

  return "/default-avatar.png";
}

// ---------------- Helper: Normalize Bio to RichTextNode[] | null ----------------
function normalizeBio(bio?: string | RichTextNode[] | null): RichTextNode[] | null {
  if (!bio) return null;
  
  if (typeof bio === "string") {
    // Convert string to RichTextNode[]
    return [
      {
        type: "paragraph" as const,
        children: [{ text: bio, type: "text" as const }],
      },
    ];
  }
  
  // If it's already an array, ensure it has the correct structure
  if (Array.isArray(bio)) {
    return bio.map(node => ({
      type: "paragraph" as const,
      children: Array.isArray(node.children) 
        ? node.children.map(child => ({
            text: typeof child === 'string' ? child : (child.text || ''),
            type: "text" as const,
          }))
        : [{ text: '', type: "text" as const }],
    }));
  }
  
  return null;
}

export default async function AboutUsContent({ slug }: Props) {
  const apiUrl = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:1337";
  const token = process.env.STRAPI_TOKEN;

  let aboutContent: AboutContent | null = null;
  let boardMembers: BoardMember[] = [];
  let advisoryMembers: AdvisoryMember[] = [];
  let investments: Investment[] = [];
  let hasError = false;

  try {
    const res = await fetch(
      `${apiUrl}/api/companies?filters[slug][$eq]=${encodeURIComponent(
        slug
      )}&populate[about_content][populate]=*&populate[board_members][populate]=*&populate[advisories][populate]=*&populate[investments][populate]=*`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch company data");

    const json: StrapiResponse<CompanyData> = await res.json();
    const companyData = json.data?.[0];

    if (!companyData) {
      console.warn("No company data found for slug:", slug);
      return (
        <AboutUs
          aboutContent={null}
          boardMembers={[]}
          advisoryMembers={[]}
          investments={[]}
          hasError={false}
        />
      );
    }

    aboutContent = companyData.about_content || null;

    // ---------------- Board Members ----------------
    boardMembers = (companyData.board_members || []).map((member) => ({
      id: member.id,
      documentId: member.documentId || `board-${member.id}`,
      name: member.Name || "Unknown",
      position:
        typeof member.position === "object" ? member.position?.title || "Unknown" : member.position || "Unknown",
      bio: normalizeBio(member.Bio),
      image: getStrapiImageUrl(member.Image || ""),
    }));

    // ---------------- Advisory Members ----------------
    advisoryMembers = (companyData.advisories || []).map((adv) => ({
      id: adv.id,
      documentId: adv.documentId || `adv-${adv.id}`,
      name: adv.name || adv.Name || "Unknown",
      image: getStrapiImageUrl(adv.Image || ""),
    }));

    // ---------------- Investments ----------------
    investments = (companyData.investments || []).map((inv) => ({
      id: inv.id,
      title: inv.title || "Unknown",
      logo: getStrapiImageUrl(inv.logo),
      url: inv.url || "",
    }));
  } catch (err) {
    console.error("Failed to fetch AboutUs data:", err);
    hasError = true;
  }

  return (
    <AboutUs
      aboutContent={aboutContent}
      boardMembers={boardMembers}
      advisoryMembers={advisoryMembers}
      investments={investments}
      hasError={hasError}
    />
  );
}