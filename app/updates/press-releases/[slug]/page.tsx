// app/updates/press-releases/[slug]/page.tsx

import { notFound } from "next/navigation";
import { AttachmentViewer } from "@/app/updates/notices/[slug]/AttachmentViewer";
import {
  StrapiPressRelease,
  StrapiResponseItem,
  mapStrapiPressRelease,
} from "@/lib/mapStrapiPressRelease";
import Image from "next/image";
import React from "react";

async function getPressRelease(slug: string): Promise<StrapiPressRelease | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/updates?filters[slug][$eq]=${slug}&populate[attachments][populate]=file&populate=thumbnail&populate=tags`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    console.error("Failed to fetch press release", res.status);
    return null;
  }

  const data = await res.json();
  if (!data?.data?.length) return null;

  try {
    return mapStrapiPressRelease(data.data[0] as StrapiResponseItem);
  } catch (err) {
    console.error("Mapping error:", err);
    return null;
  }
}

export default async function PressReleasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const pressRelease = await getPressRelease(slug);
  if (!pressRelease) return notFound();

  return (
    <article className="max-w-4xl mx-auto p-6">
      {/* Title + Date */}
      <h1 className="text-3xl font-bold mb-2">{pressRelease.title}</h1>
      <p className="text-gray-500 mb-6">
        {new Date(pressRelease.date).toLocaleDateString()}
      </p>

      {/* Tags */}
          {pressRelease.tags?.length ? (
      <div className="flex gap-2 mb-6 flex-wrap">
        {pressRelease.tags.map((tag) => (
          <span
            key={tag.id}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
          >
            {tag.name}
          </span>
        ))}
      </div>
    ) : null}

      {/* Content */}
      {pressRelease.content?.length > 0 && (
        <div className="prose dark:prose-invert mb-8">
          {pressRelease.content.map((block, i) => (
            <p key={i}>
              {block.children.map((node, j) => (
                <span key={j}>{node.text}</span>
              ))}
            </p>
          ))}
        </div>
      )}

      {/* Thumbnail */}
      {pressRelease.thumbnail?.url && (
        <div className="relative w-full max-w-3xl h-64 md:h-96 mb-8">
          <Image
            src={pressRelease.thumbnail.url}
            alt={pressRelease.thumbnail.alternativeText || pressRelease.title}
            fill
            className="rounded-xl shadow object-cover"
            priority
          />
        </div>
      )}

      {/* Attachments */}
      <AttachmentViewer attachments={pressRelease.attachments} />
    </article>
  );
}