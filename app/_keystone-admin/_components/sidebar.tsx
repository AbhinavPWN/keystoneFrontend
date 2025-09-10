"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const navItems = [
  { label: "Dashboard", href: "/keystone-admin/dashboard" },
  { label: "Announcements", href: "/keystone-admin/announcement" },
  { label: "Gallery", href: "/keystone-admin/gallery" },
  { label: "Board Members", href: "/keystone-admin/board-member" },
  { label: "Investments", href: "/keystone-admin/investment" },
  { label: "Reports", href: "/keystone-admin/report" },
  { label: "Services", href: "/keystone-admin/services" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Automatically close sidebar on route change (mobile only)
    useEffect(() => {
    // Only auto-close on small screens
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
        onClose?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);


  return (
    <>
      {/* Background overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 lg:z-0 w-64 h-full bg-white shadow-md border-r flex flex-col justify-between transform transition-transform duration-300",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
            "lg:translate-x-0": true,
          }
        )}
      >
        {/* Mobile close button */}
        <div className="flex justify-end lg:hidden p-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X />
          </Button>
        </div>

        {/* Sidebar content */}
        <nav className="p-4 flex-grow overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Admin Panel</h2>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm font-medium",
                    pathname === item.href
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t">
          <form action="/api/logout" method="POST">
            <Button
              type="submit"
              variant="destructive"
              className="w-full flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </form>
        </div>
      </aside>
    </>
  );
}
