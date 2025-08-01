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
}

export default function AnnouncementModal() {
  const pathname = usePathname();
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;

    const seen = sessionStorage.getItem("announcementShown");
    if (seen) return;

    // ✅ Move fallbackAnnouncement inside useEffect
    const fallbackAnnouncement: AnnouncementData = {
      id: 0,
      title: "Welcome to Keystone!",
      message:
        "Our services are currently experiencing issues. Please check back later.",
      ctaText: "Contact Us",
      ctaLink: "/#contact-info",
      image: {
        url: "/fallback.jpg", // Put fallback.jpg in the public folder
        alternativeText: "Fallback Announcement",
      },
    };

    const fetchAnnouncement = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_URL}/api/announcements?populate=image`,
          {
            headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();

        const activeAnnouncement = (json?.data as ApiAnnouncement[]).find(
          (a) => a.active
        );

        if (activeAnnouncement) {
          setAnnouncement({
            id: activeAnnouncement.id,
            title: activeAnnouncement.title,
            message: activeAnnouncement.message,
            ctaText: activeAnnouncement.ctaText,
            ctaLink: activeAnnouncement.ctaLink,
            image: activeAnnouncement.image
              ? {
                  url: activeAnnouncement.image.url,
                  alternativeText:
                    activeAnnouncement.image.alternativeText || null,
                }
              : undefined,
          });
        } else {
          // No active announcement → use fallback
          setAnnouncement(fallbackAnnouncement);
        }

        setIsOpen(true);
      } catch (err) {
        console.warn("Failed to fetch announcement:", err);
        // Server down → use fallback
        setAnnouncement(fallbackAnnouncement);
        setIsOpen(true);
      }
    };

    fetchAnnouncement();
  }, [pathname]);

  // ✅ Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(false);
    sessionStorage.setItem("announcementShown", "true");
  };

  if (!announcement) return null;

  const { title, message, ctaText, ctaLink, image } = announcement;
  const imageUrl = image?.url ? getStrapiMedia(image.url) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 pt-12 md:pt-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 md:p-8 max-w-lg md:max-w-2xl w-full text-center relative shadow-2xl"
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
            <h2 className="text-lg md:text-2xl font-bold mb-2">{title}</h2>
            <p className="text-sm md:text-base text-gray-600 mb-4">{message}</p>

            {/* CTA Button */}
            {ctaLink && (
              <motion.a
                href={ctaLink}
                className="inline-block bg-orange-500 text-white px-4 py-2 md:px-6 md:py-3 rounded hover:bg-orange-600 transition text-sm md:text-base"
                onClick={closeModal}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {ctaText || "Learn More"}
              </motion.a>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
