'use client'

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { Menu, ChevronDown, Download } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { getStrapiMedia } from "@/lib/getStrapiMedia"

// Types for downloads (matches Strapi response)
interface StrapiFile {
  id: number
  url: string
  name: string
  ext: string
  size: number
}

interface StrapiDownload {
  id: number
  title: string
  category?: string
  description?: string
  file: StrapiFile[]
}

interface ApiResponse {
  data: StrapiDownload[]
}

interface DownloadFile {
  url: string
  name: string
  ext: string
  size: number
}

interface DownloadItem {
  id: number
  title: string
  category?: string
  description?: string
  file: DownloadFile[]
}

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)
  const [error, setError] = useState(false)

  // Add a ref to manage the timeout
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/reports', label: 'Reports' },
  ]

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch downloads from Strapi
  useEffect(() => {
    async function fetchDownloads() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:8080"}/api/downloads?populate=*`,
          {
              headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}` },
            }
        )

        if (!res.ok) throw new Error("Failed to fetch")

        const data: ApiResponse = await res.json()

        const items: DownloadItem[] = data.data.map((d) => ({
          id: d.id,
          title: d.title,
          category: d.category,
          description: d.description,
          file: d.file.map((fileData) => ({
            url: fileData.url,
            name: fileData.name,
            ext: fileData.ext,
            size: fileData.size,
          })),
        }))

        setDownloads(items)
        setError(false)
      } catch (err) {
        console.error("Error fetching downloads:", err)
        setError(true)
      }
    }

    fetchDownloads()
  }, [])

  // Handle mouse enter for dropdown
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setDropdownOpen(true)
  }

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false)
    }, 300) // 300ms delay before closing
  }

  if (!mounted) {
    return null
  }

  function formatSize(size: number): string {
    if (size > 1024) return `${(size / 1024).toFixed(1)} MB`
    return `${size.toFixed(0)} KB`
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-[#0B1E36] py-2 font-[playfair] text-shadow-white transition-shadow ${
        scrolled ? 'shadow-xs' : ''
      }`}
    >
      <div className="relative max-w-screen-xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="absolute left-0 flex items-center h-full px-3">
          <Image
            src="/Company_Logo.png"
            alt="Keystone Logo"
            width={664}
            height={150}
            priority
            quality={100}
            className="object-contain max-h-16 w-auto"
          />
        </Link>

        {/* Desktop Links */}
        <nav
          className="flex-1 hidden md:flex gap-x-16 m-2 p-2 text-xl text-white justify-center"
          role="navigation"
          aria-label="Main menu"
        >
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-white
                 hover:text-orange-500 after:transition-all after:duration-300 ${
                pathname === link.href
                  ? 'after:w-full'
                  : 'after:w-0 hover:after:w-full'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Downloads Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className="flex items-center gap-1 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-expanded={dropdownOpen}
              onFocus={handleMouseEnter}
              onBlur={handleMouseLeave}
            >
              Downloads <ChevronDown size={18} />
            </button>

            {dropdownOpen && (
              <div
                className="absolute left-0 mt-1 bg-gray-800 text-white rounded-md shadow-lg w-46 z-50 transition-opacity duration-200"
                style={{ opacity: dropdownOpen ? 1 : 0, top: '100%' }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {error ? (
                  <div className="px-4 py-2 text-sm text-red-600">
                    Unable to load downloads
                  </div>
                ) : downloads.length > 0 ? (
                  <ul>
                    {downloads.map((item) => (
                      <li key={item.id} className="border-b last:border-none">
                        <a
                          href={getStrapiMedia(item.file[0]?.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col gap-1 px-4 py-2 hover:bg-gray-700 rounded"
                        >
                          <div className="flex items-center gap-2 p-2">
                            <Download size={16} />
                            <span>{item.title}</span>
                          </div>
                          {item.file[0] && (
                            <span className="text-xs text-gray-300 ml-8">
                              {item.file[0].ext?.toUpperCase().replace('.', '')} · {formatSize(item.file[0].size)}
                            </span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No downloads available
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger */}
        <div
          className="absolute right-0 flex items-center gap-4"
          id="mobile-menu"
          role="navigation"
          aria-label="Mobile menu"
        >
          <button
            className="md:hidden rounded p-2 text-white"
            onClick={() => setMobileOpen(true)}
            aria-label="Open mobile menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <Menu />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className={`fixed inset-y-0 right-0 w-64 bg-gray-800 text-white z-50 p-4 flex flex-col transform transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          id="mobile-menu"
          role="navigation"
          aria-label="Mobile menu"
        >
          <div className="flex justify-between items-center mb-6">
            {/* Logo in mobile drawer */}
            <Link href="/" onClick={() => setMobileOpen(false)}>
              <Image
                src="/Company_Logo.png"
                alt="Keystone Logo"
                width={265}
                height={60}
                priority
                quality={100}
                className="object-contain"
              />
            </Link>

            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded hover:bg-blue-800 text-white"
              aria-label="Close mobile menu"
            >
              ✖
            </button>
          </div>

          <nav className="flex flex-col gap-4 items-center">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-white after:transition-all after:duration-300 ${
                  pathname === link.href
                    ? 'after:w-full'
                    : 'after:w-0 hover:after:w-full'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Downloads Dropdown */}
            <div className="w-full">
              <button
                onClick={() => setMobileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 w-full justify-center hover:text-orange-500"
              >
                Downloads <ChevronDown size={18} />
              </button>
              {mobileDropdownOpen && (
                <div className="mt-2 w-full">
                  {error ? (
                    <div className="px-2 py-2 text-sm text-red-400">
                      Unable to load downloads
                    </div>
                  ) : downloads.length > 0 ? (
                    <ul>
                      {downloads.map((item) => (
                        <li key={item.id} className="border-b last:border-none">
                          <a
                            href={getStrapiMedia(item.file[0]?.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col gap-1 px-2 py-2 hover:bg-gray-700"
                          >
                            <div className="flex items-center gap-2">
                              <Download size={16} />
                              <span>{item.title}</span>
                            </div>
                            {item.file[0] && (
                              <span className="text-xs text-gray-300 ml-6">
                                {item.file[0].ext?.toUpperCase().replace('.', '')} · {formatSize(item.file[0].size)}
                              </span>
                            )}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-2 py-2 text-sm text-gray-400">
                      No downloads available
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}