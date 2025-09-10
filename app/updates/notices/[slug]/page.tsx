'use client'

import Image from 'next/image';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getStrapiMedia } from '@/lib/getStrapiMedia';
import { mapStrapiNotice, StrapiNotice } from '@/lib/mapStrapiNotice';
import React from 'react';

// Dynamically import AttachmentViewer with SSR disabled
const AttachmentViewer = dynamic(
  () => import('./AttachmentViewer').then((mod) => mod.AttachmentViewer),
  { ssr: false }
);

interface Props {
  params: Promise<{ slug: string }>;
}

export default function NoticeDetail({ params: paramsPromise }: Props) {
  const params = React.use(paramsPromise);
  const [notice, setNotice] = useState<StrapiNotice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const base = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:1337';

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await fetch(
          `${base}/api/updates?filters[slug][$eq]=${params.slug}&populate[0]=thumbnail&populate[1]=attachment.file`,
          { cache: 'no-store' }
        );
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch notice: ${errorText}`);
        }
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setNotice(mapStrapiNotice(json.data[0]));
        } else {
          setError('No notice found for this slug.');
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching the notice.';
        console.error('Failed to fetch notice:', errorMessage);
        setError(errorMessage);
      }
    };

    fetchNotice();
  }, [params.slug, base]);

  if (error) {
    return <p className="text-center mt-12 text-red-500">{error}</p>;
  }

  if (!notice) {
    return <p className="text-center mt-12 text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-2 text-[#0B1E36] font-[playfair]">{notice.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {new Date(notice.date).toLocaleDateString('en-GB')}
      </p>
      {notice.thumbnail && (
        <Image
          src={getStrapiMedia(notice.thumbnail.url)}
          alt={notice.thumbnail.alternativeText || notice.title}
          width={1200}
          height={400}
          className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-2xl mb-8"
          priority
        />
      )}
      <div className="prose max-w-full text-gray-700 mb-8">
        {notice.content.map((block, index) => (
          <p key={index}>
            {block.children.map((child, idx) => (
              <span key={idx}>{child.text}</span>
            ))}
          </p>
        ))}
      </div>
      <AttachmentViewer attachments={notice.attachments} />
    </div>
  );
}