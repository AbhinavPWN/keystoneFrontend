import AboutUs from "../components/AboutUs";

type RichTextNode = {
  type: string;
  children: { text: string; type: string }[];
};

type BoardMember = {
  id: number;
  documentId: string;
  name: string;
  position: string;
  image: string;
  bio?: RichTextNode[] | null;
};

type Investment = {
  id: number;
  title: string;
  description?: string;
  url?: string;
  logo: string;
};

type AdvisoryMember = {
  id: number;
  documentId: string;
  name: string;
  image: string;
};

type StrapiImageFormat = { url: string };

type StrapiImage = {
  id: number;
  url: string;
  formats?: {
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
    thumbnail?: StrapiImageFormat;
  };
};

type StrapiPosition = {
  id: number;
  title: string;
  Rank: number;
};

type StrapiBoardMember = {
  id: number;
  documentId: string;
  Name: string;
  Bio?: RichTextNode[] | null;
  Image: StrapiImage[];
  position: StrapiPosition;
};

type StrapiInvestment = {
  id: number;
  title: string;
  description?: string | null;
  url?: string | null;
  logo?: StrapiImage[];
};

type StrapiAdvisory = {
  id: number;
  documentId: string;
  name: string;
  Image?: StrapiImage;
};

type StrapiResponse<T> = { data: T[] };

const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:8080";

export default async function AboutUsContent() {
  let boardMembers: BoardMember[] = [];
  let investments: Investment[] = [];
  let advisoryMembers: AdvisoryMember[] = [];
  let hasError = false;

  try {
    const [boardRes, investmentsRes, advisoryRes] = await Promise.all([
      fetch(`${process.env.STRAPI_API}/board-members?populate=*`, {
        next: { revalidate: 60 },
        headers: { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` },
      }),
      fetch(`${process.env.STRAPI_API}/investments?populate=*`, {
        next: { revalidate: 60 },
        headers: { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` },
      }),
      fetch(`${process.env.STRAPI_API}/advisories?populate=*`, {
        next: { revalidate: 60 },
        headers: { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` },
      }),
    ]);

    if (!boardRes.ok || !investmentsRes.ok || !advisoryRes.ok) {
      throw new Error("API error");
    }

    const boardData: StrapiResponse<StrapiBoardMember> = await boardRes.json();
    const investmentsData: StrapiResponse<StrapiInvestment> =
      await investmentsRes.json();
    const advisoryData: StrapiResponse<StrapiAdvisory> =
      await advisoryRes.json();

    boardMembers = boardData.data
      .map((member) => {
        const img = member.Image?.[0];
        return {
          id: member.id,
          documentId: member.documentId,
          name: member.Name || "Unknown",
          position: member.position?.title || "Unknown",
          bio: member.Bio ?? null,
          image: img?.formats?.small?.url || img?.url || "/default-avatar.png",
          rank: member.position?.Rank ?? 9999,
        };
      })
      .sort((a, b) => a.rank - b.rank)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ rank, ...rest }) => rest);

    investments = investmentsData.data.map((inv) => {
      const logoImg = inv.logo?.[0];
      const logoUrl =
        logoImg?.formats?.small?.url || logoImg?.url || "/default-logo.png";

      return {
        id: inv.id,
        title: inv.title,
        description: inv.description ?? undefined,
        url: inv.url ?? undefined,
        logo: logoUrl.startsWith("/")
          ? `${STRAPI_BASE_URL}${logoUrl}`
          : logoUrl,
      };
    });

    advisoryMembers = advisoryData.data.map((adv) => {
      const img = adv.Image;
      return {
        id: adv.id,
        documentId: adv.documentId,
        name: adv.name || "Unknown",
        image:
          img?.formats?.small?.url ||
          img?.formats?.thumbnail?.url ||
          img?.url ||
          "/default-avatar.png",
      };
    });
  } catch (err) {
    console.error(err);
    hasError = true;
  }

  return (
    <AboutUs
      boardMembers={boardMembers}
      investments={investments}
      advisoryMembers={advisoryMembers}
      hasError={hasError}
    />
  );
}
