"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function NavbarFooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/keystone-admin");

  // Wrap with flex column to push footer to bottom
  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      {/* main content grows to fill remaining space */}
      <div className="flex-grow">{children}</div>
      {!isAdminRoute && <Footer />}
    </div>
  );
}
