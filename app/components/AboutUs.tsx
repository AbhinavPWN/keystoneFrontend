"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AboutContent,
  BoardMember,
  AdvisoryMember,
  Investment,
  RichTextNode,
  StrapiImage,
} from "../about/[slug]/types";
import { getStrapiMedia } from "@/lib/getStrapiMedia";


// ---------------- Helper: Normalize Strapi image ----------------
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getStrapiImageUrl(image?: StrapiImage | string): string {
  if (!image) return "/default-avatar.png";

  if (typeof image === "string") return image;

  if (Array.isArray(image) && image.length > 0 && image[0]?.url) {
    return image[0].url;
  }

  if ("url" in image && image.url) {
    return image.url;
  }

  if ("data" in image && image.data?.attributes?.url) {
    return image.data.attributes.url;
  }

  return "/default-avatar.png";
}

export default function AboutUs({
  aboutContent,
  boardMembers = [],
  advisoryMembers = [],
  investments = [],
  hasError = false,
}: {
  aboutContent?: AboutContent | null;
  boardMembers?: BoardMember[];
  advisoryMembers?: AdvisoryMember[];
  investments?: Investment[];
  hasError?: boolean;
}) {
  if (hasError) {
    return (
      <main className="text-center py-20">
        <h1 className="text-2xl font-bold text-red-600">
          Something went wrong while loading this page.
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Please try again later.
        </p>
      </main>
    );
  }

  return (
    <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-[roboto]">
      {/* Hero */}
      {aboutContent?.heroText?.length && (
        <section className="relative bg-[#0B1E36] dark:bg-gray-800 text-white py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-[playfair]">
            {aboutContent.title || "About Us"}
          </h1>
          <div className="mt-4 text-lg max-w-2xl mx-auto font-[roboto] space-y-2">
            {aboutContent.heroText.map((block: RichTextNode, idx: number) =>
              block.children?.map((child, i) => <p key={`${idx}-${i}`}>{child.text}</p>)
            )}
          </div>
        </section>
      )}

      {/* Story & Image */}
     {/* Story & Image */}
        {(aboutContent?.story?.length || aboutContent?.image) && (
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-screen-xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
              {/* Story */}
              {aboutContent?.story?.length && (
                <div className="space-y-4 order-2 md:order-1 font-[roboto] text-justify text-xl">
                  {aboutContent.story.map((block: RichTextNode, idx: number) => {
                    switch (block.type) {
                      case "paragraph":
                        return (
                          <p key={idx} className="leading-relaxed text-justify font-[roboto]">
                            {block.children.map((c) => c.text).join(" ")}
                          </p>
                        );
                      case "heading":
                        return (
                          <h3 key={idx} className="text-xl font-semibold my-4">
                            {block.children.map((c) => c.text).join(" ")}
                          </h3>
                        );
                      case "list":
                        return (
                          <ul key={idx} className="list-disc list-inside ml-4 my-2">
                            {block.children.map((c, i) => (
                              <li key={i}>{c.text}</li>
                            ))}
                          </ul>
                        );
                      default:
                        return (
                          <p key={idx} className="leading-relaxed text-justify font-[roboto]">
                            {block.children.map((c) => c.text).join(" ")}
                          </p>
                        );
                    }
                  })}
                </div>
              )}

              {/* Image */}
              {aboutContent?.image && (
                <div className="order-1 md:order-2 max-w-[400px] mx-auto">
                  <Image
                    src={getStrapiMedia(aboutContent.image as never, "medium")}
                    alt={aboutContent.title || "About image"}
                    width={400} // smaller width
                    height={240} // keep aspect ratio
                    className="rounded-lg shadow-lg w-full h-auto"
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  />
                </div>
              )}
            </div>
          </section>
        )}


      {/* Commitments */}
      {aboutContent?.Commitments && aboutContent.Commitments.length > 0 && (
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold font-[playfair] mb-8 text-center">
              Our Commitments
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              {aboutContent.Commitments.map((c, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-gray-50 dark:bg-gray-800 rounded shadow hover:shadow-md transition text-center"
                >
                  <h3 className="text-xl font-semibold mb-2">{c.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {c.description?.map((block: RichTextNode, i: number) =>
                      block.children?.map((child, j) => (
                        <span key={`${i}-${j}`}>{child.text}</span>
                      ))
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Advisory */}
      {advisoryMembers.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold font-[playfair] mb-8">Advisory Committee</h2>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              {advisoryMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-4 bg-white dark:bg-gray-800 rounded shadow hover:shadow-md transition text-center"
                >
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <Image
                      src={getStrapiMedia(member.image)}
                      alt={member.name}
                      fill
                      className="rounded-full object-cover"
                      unoptimized
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Board */}
      {boardMembers.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold font-[playfair] mb-8">Our Board</h2>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              {boardMembers.map((member) => (
                <Link
                  key={member.id}
                  href={`/board-members/${member.documentId}`}
                  className="p-4 bg-white dark:bg-gray-800 rounded shadow hover:shadow-md transition text-center block"
                >
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <Image
                      src={getStrapiMedia(member.image)}
                      alt={member.name}
                      fill
                      className="rounded-full object-cover"
                      unoptimized
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-orange-500">{member.position}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Investments */}
      {investments.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold font-[playfair] mb-8">Our Investments</h2>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              {investments.map((investment) => (
                <div
                  key={investment.id}
                  className="p-4 bg-white dark:bg-gray-800 rounded shadow hover:shadow-md transition text-center"
                >
                  {investment.logo && (
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <Image
                        src={getStrapiMedia(investment.logo)}
                        alt={investment.title}
                        fill
                        className="object-contain rounded"
                        unoptimized
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold">{investment.title}</h3>
                  {investment.url && (
                    <a
                      href={investment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:underline mt-2 inline-block"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 bg-[#0B1E36] dark:bg-gray-800 text-white text-center">
        <h2 className="text-2xl font-bold font-[playfair]">
          Ready to Partner With Us?
        </h2>
        <Link
          href="/reports"
          className="inline-block mt-4 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          View Our Reports →
        </Link>
      </section>
    </main>
  );
}
