import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_CMS_URL || "http://135.181.66.188:8080";

export const dynamic = "force-dynamic";

type RichTextNode = {
  type: string;
  children: { text: string; type: string }[];
};

type StrapiImageFormat = {
  url: string;
};

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

type StrapiBoardMember = {
  id: number;
  documentId: string;
  Name: string;
  Position: string;
  Bio: RichTextNode[] | null;
  Image: StrapiImage[];
};

type StrapiResponse<T> = {
  data: T | null;
  error?: {
    status: number;
    name: string;
    message: string;
  };
};

// ✅ Explicit props type for dynamic route
interface PageProps {
  params: Promise<{ documentId: string }>;
}

/** Render rich text (Bio) */
function renderRichText(bio: RichTextNode[]) {
  return (
    <div className="space-y-2 mt-4 text-justify">
      {bio.map((node, idx) => {
        if (node.type === "paragraph") {
          const text = node.children.map((child) => child.text).join("");
          return (
            <p key={idx} className="leading-relaxed">
              {text}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
}

/** Dynamic Metadata for SEO */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { documentId } = await params; // Await the params Promise

  const res = await fetch(
    `${process.env.STRAPI_API}/board-members/${documentId}?populate=*`,
    {
      headers: { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return {
      title: "Board Member - Keystone",
      description: "Keystone board member details.",
    };
  }

  const data: StrapiResponse<StrapiBoardMember> = await res.json();

  if (!data.data) {
    return {
      title: "Board Member - Keystone",
      description: "Keystone board member details.",
    };
  }

  const member = data.data;

  return {
    title: `${member.Name} - Board Member | Keystone`,
    description: `Learn more about ${member.Name}, serving as ${member.Position} at Keystone.`,
    openGraph: {
      title: `${member.Name} - Keystone`,
      description: `Learn more about ${member.Name}, serving as ${member.Position} at Keystone.`,
      images: [
        {
          url:
            member.Image?.[0]?.formats?.medium?.url ||
            member.Image?.[0]?.url ||
            "/default-avatar.png",
        },
      ],
    },
  };
}

/** Main page */
export default async function BoardMemberPage({ params }: PageProps) {
  const { documentId } = await params; // Await the params Promise

  const res = await fetch(
    `${process.env.STRAPI_API}/board-members/${documentId}?populate=*`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      },
    }
  );

  if (!res.ok) {
    notFound();
  }

  const data: StrapiResponse<StrapiBoardMember> = await res.json();

  if (!data.data) {
    notFound();
  }

  const member = data.data;
  const img = member.Image?.[0];
  const imageUrl =
    img?.formats?.medium?.url ||
    img?.formats?.small?.url ||
    img?.url ||
    "/default-avatar.png";

  return (
    <main className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 rounded shadow">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-48 h-48 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={
              imageUrl.startsWith("/")
                ? `${STRAPI_BASE_URL}${imageUrl}`
                : imageUrl
            }
            alt={member.Name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold font-[playfair]">
            {member.Name}
          </h1>
          <h2 className="text-xl text-orange-500 font-semibold mt-2 font-[playfair]">
            {member.Position}
          </h2>
          {Array.isArray(member.Bio) && member.Bio.length > 0 ? (
            <div className="prose dark:prose-invert mt-4 text-justify font-[roboto]">
              {renderRichText(member.Bio)}
            </div>
          ) : (
            <p className="mt-4 italic text-gray-600 dark:text-gray-400">
              No bio available.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}