"use client";

import React, { useEffect, useCallback } from "react";
import { useNotice } from "./NoticeContext";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// ESC handler stack shared with AnnouncementModal
const escHandlerStack: Set<(e: KeyboardEvent) => void> = new Set();

export const NoticeModal: React.FC = () => {
  const { featuredNotice, hideNotice } = useNotice();

  // Close modal function
  const closeModal = useCallback(() => {
    hideNotice();
  }, [hideNotice]);

  // ESC key handling
  useEffect(() => {
    if (!featuredNotice) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
        e.stopImmediatePropagation();
      }
    };

    escHandlerStack.add(handleEsc);
    window.addEventListener("keydown", handleEsc, true);

    return () => {
      escHandlerStack.delete(handleEsc);
      window.removeEventListener("keydown", handleEsc, true);
    };
  }, [featuredNotice, closeModal]);

  if (!featuredNotice) return null;

  const contentBlocks = featuredNotice.content ?? [];

  return (
    <AnimatePresence>
      {featuredNotice && (
        <motion.div
          className="fixed top-0 inset-x-0 z-[9999]"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-yellow-100 dark:bg-yellow-700 text-black dark:text-white border-b border-yellow-300 dark:border-yellow-600 shadow-md w-full">
            <div className="max-w-screen-xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              {/* Notice content */}
              <div className="flex-1">
                <strong className="block text-sm sm:text-base">
                  {featuredNotice.title || "Untitled Notice"}
                </strong>
                {contentBlocks.length > 0 && (
                  <div className="mt-1 text-xs sm:text-sm">
                    {contentBlocks.map((block, idx) => (
                      <p key={idx} className="mb-1 leading-snug">
                        {block.children.map((c) => c.text).join(" ")}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <Link
                  href={`/updates/notices/${featuredNotice.slug}`}
                  onClick={closeModal} // <-- Close modal when navigating
                  className="px-3 py-1 bg-white text-yellow-800 dark:text-yellow-200 font-semibold rounded hover:bg-gray-100 transition text-xs sm:text-sm"
                >
                  Read More
                </Link>
                <button
                  onClick={closeModal}
                  className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-bold text-lg"
                  aria-label="Dismiss notice"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Spacer to prevent overlap */}
          <div className="h-[calc(3rem+1rem)] sm:h-[calc(4rem+1rem)]"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
