// components/NoticeContext.tsx
"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { Notice } from "../types/notices";
import { fetchFeaturedNotice } from "@/lib/noticeApi";

type NoticeContextType = {
  featuredNotice: Notice | null;
  hideNotice: () => void;
};

const NoticeContext = createContext<NoticeContextType>({
  featuredNotice: null,
  hideNotice: () => {},
});

export const NoticeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [featuredNotice, setFeaturedNotice] = useState<Notice | null>(null);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("dismissed-featured-notice");
    console.log("Dismissed flag:", dismissed);

    if (dismissed) return;

    const loadNotice = async () => {
      try {
        const notice = await fetchFeaturedNotice();
        console.log("Loaded featured notice:", notice);

        if (notice) setFeaturedNotice(notice);
        else console.log("No featured notice found.");
      } catch (err) {
        console.error("Error loading featured notice:", err);
      }
    };

    loadNotice();
  }, []);

  const hideNotice = () => {
    sessionStorage.setItem("dismissed-featured-notice", "true");
    setFeaturedNotice(null);
  };

  return (
    <NoticeContext.Provider value={{ featuredNotice, hideNotice }}>
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotice = () => useContext(NoticeContext);
