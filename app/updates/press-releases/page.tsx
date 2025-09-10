'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { getStrapiMedia } from '@/lib/getStrapiMedia';
import {
  mapStrapiPressRelease,
  StrapiPressRelease,
  StrapiResponseItem,
} from '@/lib/mapStrapiPressRelease';

const AttachmentViewer = dynamic(
  () =>
    import('../notices/[slug]/AttachmentViewer').then(
      (mod) => mod.AttachmentViewer
    ),
  { ssr: false }
);

export default function PressReleaseList() {
  const [pressReleases, setPressReleases] = useState<StrapiPressRelease[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const base = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:1337';

  useEffect(() => {
    const fetchPressReleases = async () => {
      try {
        const res = await fetch(
          `${base}/api/updates?filters[category][$eq]=Press%20Release&populate[0]=thumbnail&populate[1]=attachment.file`,
          { cache: 'no-store' }
        );

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Failed to fetch press releases: ${errText}`);
        }

        const json = await res.json();

        if (json.data && json.data.length > 0) {
          const mapped = (json.data as StrapiResponseItem[])
            .map((item) => {
              try {
                return mapStrapiPressRelease(item);
              } catch {
                return null;
              }
            })
            .filter(Boolean) as StrapiPressRelease[];

          setPressReleases(mapped);
        } else {
          // No data from API
          setPressReleases([]);
        }
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : 'Error fetching press releases.';
        console.error(msg);
        setError(msg);
        setPressReleases([]);
      }
    };

    fetchPressReleases();
  }, [base]);

  if (pressReleases === null) {
    // Loading state
    return <p className="text-center text-gray-500 mt-12">Loading press releases...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-12">{error}</p>;
  }

  if (pressReleases.length === 0) {
    return <p className="text-center text-gray-500 mt-12">No press releases yet. Please check back later.</p>;
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-16 space-y-12">
      {pressReleases.map((pr) => (
        <div key={pr.id} className="border rounded-2xl p-6 bg-gray-50">
          <h2 className="text-2xl font-bold mb-2 text-[#0B1E36]">{pr.title}</h2>
          <p className="text-sm text-gray-500 mb-4">{new Date(pr.date).toLocaleDateString('en-GB')}</p>

          {pr.thumbnail && (
            <Image
              src={getStrapiMedia(pr.thumbnail.url)}
              alt={pr.thumbnail.alternativeText || pr.title}
              width={1200}
              height={400}
              className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-2xl mb-4"
              priority
            />
          )}

          <div className="prose max-w-full text-gray-700 mb-4">
            {pr.content.map((block, idx) => (
              <p key={idx}>
                {block.children.map((child, cidx) => (
                  <span key={cidx}>{child.text}</span>
                ))}
              </p>
            ))}
          </div>

          <AttachmentViewer attachments={pr.attachments} />
        </div>
      ))}
    </div>
  );
}
