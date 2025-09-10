"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { getStrapiMedia } from "@/lib/getStrapiMedia";

// ---------- Types ----------
type GalleryItem = {
  id: number;
  documentId: string;
  title: string;
  uploaded: string;
  image: string;
  fullImage: string;
};

type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

type StrapiImageFormats = {
  small?: { url: string };
  medium?: { url: string };
  large?: { url: string };
  thumbnail?: { url: string };
};

type StrapiImage = {
  url: string;
  formats?: StrapiImageFormats;
  alternativeText?: string;
};

type StrapiGalleryData = {
  id: number;
  documentId: string;
  title: string;
  Uploaded: string;
  Image: StrapiImage;
};

type StrapiResponse = {
  data: StrapiGalleryData[];
  meta: {
    pagination: Pagination;
  };
};

// ---------- Config ----------
const pageSize = 12;
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:1337";

// ---------- Component ----------
export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (page: number) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${CMS_URL}/api/galleries?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=Image`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch gallery: ${res.status}`);
        }

        const json: StrapiResponse = await res.json();

        const newItems: GalleryItem[] = json.data.map((item) => {
          return {
            id: item.id,
            documentId: item.documentId,
            title: item.title || "Untitled",
            uploaded: item.Uploaded,
            image: getStrapiMedia(item.Image, "small"),
            fullImage: getStrapiMedia(item.Image, "large"),
          };
        });

        setItems(newItems);
        setMeta(json.meta.pagination);
        setCurrentPage(page);
      } catch (err) {
        console.error("Error fetching gallery:", err);
        setError("Failed to load gallery. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {loading && <p className="text-center">Loading…</p>}

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.fullImage}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block rounded shadow hover:shadow-lg overflow-hidden"
            aria-label={`View ${item.title}`}
          >
            <Image
              src={item.image}
              alt={item.title}
              width={300}
              height={200}
              className="object-cover w-full h-full"
              priority={currentPage === 1 && item.id <= 4}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1">
              {item.title}
            </div>
          </a>
        ))}
      </div>

      {meta && (
        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={() => fetchPage(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
            aria-label="Previous page"
          >
            <HiChevronLeft className="w-6 h-6" />
          </button>
          <span className="px-2 py-2 text-orange-500">
            Page {currentPage} of {meta.pageCount}
          </span>
          <button
            onClick={() => fetchPage(currentPage + 1)}
            disabled={currentPage >= meta.pageCount || loading}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
            aria-label="Next page"
          >
            <HiChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </main>
  );
}
