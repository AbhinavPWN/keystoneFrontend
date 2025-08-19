"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getStrapiMedia } from "@/lib/getStrapiMedia";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface AnnouncementData {
  id: number;
  title: string;
  message: string;
  ctaText?: string;
  ctaLink?: string;
  image?: {
    url: string;
    alternativeText?: string | null;
  };
}

interface ApiAnnouncement {
  id: number;
  active: boolean;
  title: string;
  message: string;
  ctaText?: string;
  ctaLink?: string;
  image?: {
    url: string;
    alternativeText?: string | null;
  };
  attributes: {
    createdAt: string;
  };
}

export default function AnnouncementModal() {
  const pathname = usePathname();
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;

    const seen = sessionStorage.getItem("announcementShown");
    if (seen) return;

    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_URL}/api/announcements?populate=image`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch announcements");

        const json = await res.json();

        const activeAnnouncements = (json?.data as ApiAnnouncement[]).filter(
          (a) => a.active
        );

        // Sort by recently added first
        activeAnnouncements.sort(
          (a, b) =>
            new Date(b.attributes.createdAt).getTime() -
            new Date(a.attributes.createdAt).getTime()
        );

        if (activeAnnouncements.length > 0) {
          setAnnouncements(
            activeAnnouncements.map((a) => ({
              id: a.id,
              title: a.title,
              message: a.message,
              ctaText: a.ctaText,
              ctaLink: a.ctaLink,
              image: a.image
                ? {
                    url: a.image.url,
                    alternativeText: a.image.alternativeText || null,
                  }
                : undefined,
            }))
          );
          setIsOpen(true);
        }
      } catch (err) {
        console.warn("Failed to fetch announcements:", err);
      }
    };

    fetchAnnouncements();
  }, [pathname]);

  const closeModal = () => {
    if (currentIndex < announcements.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsOpen(false);
      sessionStorage.setItem("announcementShown", "true");
    }
  };

  if (!isOpen || announcements.length === 0) return null;

  const announcement = announcements[currentIndex];
  const { title, message, ctaText, ctaLink, image } = announcement;
  const imageUrl = image?.url ? getStrapiMedia(image.url) : null;

  const isVacancy =
    title?.toLowerCase().includes("vacancy") ||
    ctaLink?.toLowerCase().endsWith(".pdf");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 md:p-8 w-full max-w-lg md:max-w-2xl text-center relative shadow-2xl overflow-y-auto max-h-[90vh] my-8"
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ rotate: 90, scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl font-bold"
              onClick={closeModal}
            >
              ×
            </motion.button>

            {/* Vacancy Layout vs Default Layout */}
            {isVacancy ? (
              <>
                <h2 className="text-xl md:text-2xl font-bold mb-4">{title}</h2>
                <p className="text-sm md:text-base text-gray-600 mb-4">
                  {message}
                </p>
                {imageUrl && (
                  <div className="mb-4">
                    <Image
                      src={imageUrl}
                      alt={image?.alternativeText || "Vacancy Notice"}
                      width={800}
                      height={400}
                      className="rounded-lg object-cover w-full max-h-[300px] md:max-h-[400px]"
                    />
                  </div>
                )}
                {ctaLink && (
                  <motion.a
                    href={ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-orange-500 text-white px-4 py-2 md:px-6 md:py-3 rounded hover:bg-orange-600 transition text-sm md:text-base"
                    onClick={closeModal}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {ctaText || "View PDF"}
                  </motion.a>
                )}
              </>
            ) : (
              <>
                {imageUrl && (
                  <div className="mb-4">
                    <Image
                      src={imageUrl}
                      alt={image?.alternativeText || "Announcement"}
                      width={800}
                      height={400}
                      className="rounded-lg object-cover w-full max-h-[300px] md:max-h-[400px]"
                    />
                  </div>
                )}
                <h2 className="text-lg md:text-2xl font-bold mb-2">{title}</h2>
                <p className="text-sm md:text-base text-gray-600 mb-4">
                  {message}
                </p>
                {ctaLink && (
                  <motion.a
                    href={ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-orange-500 text-white px-4 py-2 md:px-6 md:py-3 rounded hover:bg-orange-600 transition text-sm md:text-base"
                    onClick={closeModal}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {ctaText || "Learn More"}
                  </motion.a>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
