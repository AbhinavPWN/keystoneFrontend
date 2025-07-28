"use client";

import { ReactNode, useState } from "react";
import { Roboto, Playfair_Display } from "next/font/google";
import { Sidebar } from "./_components/sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

// Load fonts
const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className={`${roboto.variable} ${playfairDisplay.variable} flex bg-gray-50 min-h-screen`}
    >
      {/* Mobile Hamburger Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu />
        </Button>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 p-6 lg:ml-64 w-full">{children}</main>
    </div>
  );
}
