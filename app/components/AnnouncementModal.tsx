"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { getStrapiMedia } from "@/lib/getStrapiMedia";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface AnnouncementData {
  id: number;
  title: string;
  message: string;
  ctaText?: string | null;
  ctaLink?: string | null;
  image?: {
    url: string;
    alternativeText?: string | null;
  } | null;
  createdAt?: string | null;
}

interface ApiAnnouncement {
  id: number;
  active: boolean;
  title: string;
  message: string;
  ctaText?: string | null;
  ctaLink?: string | null;
  image?: {
    url: string;
    alternativeText?: string | null;
  } | null;
  createdAt?: string | null;
}

export default function AnnouncementModal() {
  const pathname = usePathname();
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch announcements
  useEffect(() => {
    if (pathname !== "/") return;

    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_URL}/api/announcements?populate=image&sort=createdAt:desc`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
            cache: "no-store",
          }
        );

        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

        const json = await res.json();
        if (!Array.isArray(json?.data)) return;

        const activeAnnouncements = json.data
          .filter((a: ApiAnnouncement) => a.active)
          .map((a: ApiAnnouncement) => ({
            id: a.id,
            title: a.title || "",
            message: a.message || "",
            ctaText: a.ctaText || null,
            ctaLink: a.ctaLink
              ? a.ctaLink.startsWith("http")
                ? a.ctaLink
                : a.ctaLink.startsWith("#")
                ? a.ctaLink
                : `${process.env.NEXT_PUBLIC_CMS_URL}${a.ctaLink}`
              : null,
            image: a.image
              ? {
                  url: a.image.url || "",
                  alternativeText: a.image.alternativeText || null,
                }
              : null,
            createdAt: a.createdAt || new Date().toISOString(),
          })) as AnnouncementData[];

        if (activeAnnouncements.length > 0) {
          const announcementHash = JSON.stringify(activeAnnouncements.map((a) => a.id));
          const storedHash = sessionStorage.getItem("announcementHash");

          if (announcementHash !== storedHash) {
            setAnnouncements(activeAnnouncements);
            setIsOpen(true);
            sessionStorage.setItem("announcementHash", announcementHash);
            sessionStorage.removeItem("announcementShown");
          }
        }
      } catch (err) {
        console.warn("Failed to fetch announcements:", err);
      }
    };

    fetchAnnouncements();
  }, [pathname]);

  // Close modal function
  const closeModal = useCallback(() => {
    if (currentIndex < announcements.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsOpen(false);
      setCurrentIndex(0);
      sessionStorage.setItem("announcementShown", "true");
    }
  }, [currentIndex, announcements.length]);

  // ESC key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeModal]);

  // Anchor link scrolling
  const handleAnchorClick = (anchor: string) => {
    const el = document.querySelector(anchor);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      closeModal();
    }
  };

  if (!isOpen || announcements.length === 0) return null;

  const announcement = announcements[currentIndex];
  const { title, message, ctaText, ctaLink, image } = announcement;
  const imageUrl = image?.url ? getStrapiMedia(image.url) : null;

  const isVacancy =
    !!ctaLink &&
    (title?.toLowerCase().includes("vacancy") || ctaLink.toLowerCase().endsWith(".pdf"));

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
            className="bg-white rounded-xl p-6 md:p-8 w-full max-w-lg md:max-w-2xl text-center relative shadow-2xl overflow-y-auto max-h-screen my-8"
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

            {/* Image */}
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

            {/* Title & Message */}
            <h2 className="text-xl md:text-2xl font-bold mb-2">{title}</h2>
            <p className="text-sm md:text-base text-gray-600 mb-4">{message}</p>

            {/* CTA Button */}
            {ctaLink ? (
              ctaLink.startsWith("#") ? (
                <motion.button
                  onClick={() => handleAnchorClick(ctaLink)}
                  className="inline-block bg-orange-500 text-white px-4 py-2 md:px-6 md:py-3 rounded hover:bg-orange-600 transition text-sm md:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {ctaText || "Go to Section"}
                </motion.button>
              ) : (
                <motion.a
                  href={ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-orange-500 text-white px-4 py-2 md:px-6 md:py-3 rounded hover:bg-orange-600 transition text-sm md:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {ctaText || (isVacancy ? "View PDF" : "Learn More")}
                </motion.a>
              )
            ) : (
              <span className="inline-block bg-gray-300 text-white px-4 py-2 md:px-6 md:py-3 rounded text-sm md:text-base cursor-not-allowed">
                {isVacancy ? "No PDF Available" : "No Link Available"}
              </span>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
