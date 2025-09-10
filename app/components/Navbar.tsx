'use client'

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { Menu, ChevronDown, Download } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { getStrapiMedia } from "@/lib/getStrapiMedia"

// Types
interface StrapiFile { id: number; url: string; name: string; ext: string; size: number }
interface StrapiDownload { id: number; title: string; category?: string; description?: string; file: StrapiFile[] }
interface ApiResponse { data: StrapiDownload[] }
interface DownloadFile { url: string; name: string; ext: string; size: number }
interface DownloadItem { id: number; title: string; category?: string; description?: string; file: DownloadFile[] }

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [downloadsOpen, setDownloadsOpen] = useState(false)
  const [updatesOpen, setUpdatesOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  const [mobileDownloadsOpen, setMobileDownloadsOpen] = useState(false)
  const [mobileUpdatesOpen, setMobileUpdatesOpen] = useState(false)
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false)

  const [error, setError] = useState(false)

  const downloadsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const updatesTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const aboutTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // About Us dropdown items
  const aboutLinks = [
    { href: '/about/keystone', label: 'Main Company' },
    { href: '/about/keystone-tours', label: 'Sister Company' },
  ]

  const navLinks = [
    { href: '/', label: 'Home' },
    // About is handled as dropdown now
    { href: '/gallery', label: 'Gallery' },
    { href: '/reports', label: 'Reports' },
  ]

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    async function fetchDownloads() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:1337"
        const res = await fetch(`${baseUrl}/api/downloads?populate=*`, {
          headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}` },
        })
        if (!res.ok) throw new Error("Failed to fetch")
        const data: ApiResponse = await res.json()
        const items: DownloadItem[] = data.data.map(d => ({
          id: d.id,
          title: d.title,
          category: d.category,
          description: d.description,
          file: d.file.map(f => ({ url: f.url, name: f.name, ext: f.ext, size: f.size })),
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

  const handleMouseEnter = (setOpen: (v: boolean) => void, ref: React.MutableRefObject<NodeJS.Timeout | null>) => {
    if (ref.current) clearTimeout(ref.current)
    setOpen(true)
  }

  const handleMouseLeave = (setOpen: (v: boolean) => void, ref: React.MutableRefObject<NodeJS.Timeout | null>) => {
    ref.current = setTimeout(() => setOpen(false), 300)
  }

  if (!mounted) return null

  function formatSize(size: number) {
    return size > 1024 ? `${(size / 1024).toFixed(1)} MB` : `${size.toFixed(0)} KB`
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-[#0B1E36] py-2 font-[playfair] transition-shadow ${scrolled ? 'shadow-xs' : ''}`}>
      <div className="relative max-w-screen-xl mx-auto px-4 flex items-center h-16 justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center h-full px-2 md:px-0">
          <Image
            src="/Company_Logo.png"
            alt="Keystone Logo"
            width={200}
            height={50}
            priority
            className="object-contain h-12 md:h-16 w-auto"
          />
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex flex-1 justify-center gap-x-16 text-white text-lg items-center flex-wrap">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:text-orange-500 ${
                pathname === link.href ? 'after:w-full' : 'after:w-0 hover:after:w-full'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* About Us Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter(setAboutOpen, aboutTimeoutRef)}
            onMouseLeave={() => handleMouseLeave(setAboutOpen, aboutTimeoutRef)}
          >
            <button className="flex items-center gap-1 hover:text-orange-500">
              About Us <ChevronDown size={18} />
            </button>
            {aboutOpen && (
              <div className="absolute left-0 mt-1 bg-gray-800 text-white rounded-md shadow-lg w-48 z-50">
                <ul>
                  {aboutLinks.map(item => (
                    <li key={item.href}>
                      <Link href={item.href} className="block px-4 py-2 hover:bg-gray-700">{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Downloads Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter(setDownloadsOpen, downloadsTimeoutRef)}
            onMouseLeave={() => handleMouseLeave(setDownloadsOpen, downloadsTimeoutRef)}
          >
            <button className="flex items-center gap-1 hover:text-orange-500">
              Downloads <ChevronDown size={18} />
            </button>
            {downloadsOpen && (
              <div className="absolute left-0 mt-1 bg-gray-800 text-white rounded-md shadow-lg w-48 z-50">
                {error ? (
                  <div className="px-4 py-2 text-sm text-red-600">Unable to load downloads</div>
                ) : downloads.length > 0 ? (
                  <ul>
                    {downloads.map(item => (
                      <li key={item.id} className="border-b last:border-none">
                        <a href={getStrapiMedia(item.file[0]?.url)} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-1 px-4 py-2 hover:bg-gray-700 rounded">
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
                  <div className="px-4 py-2 text-sm text-gray-500">No downloads available</div>
                )}
              </div>
            )}
          </div>

          {/* Updates Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter(setUpdatesOpen, updatesTimeoutRef)}
            onMouseLeave={() => handleMouseLeave(setUpdatesOpen, updatesTimeoutRef)}
          >
            <button className="flex items-center gap-1 hover:text-orange-500">
              Updates <ChevronDown size={18} />
            </button>
            {updatesOpen && (
              <div className="absolute left-0 mt-1 bg-gray-800 text-white rounded-md shadow-lg w-40 z-50">
                <ul>
                  <li><Link href="/updates/notices" className="block px-4 py-2 hover:bg-gray-700">Notices</Link></li>
                  <li><Link href="/updates/press-releases" className="block px-4 py-2 hover:bg-gray-700">Press Releases</Link></li>
                </ul>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger */}
        <button className="md:hidden p-2 text-white" onClick={() => setMobileOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-64 bg-gray-800 text-white p-4 flex flex-col transform transition-transform duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <Image src="/Company_Logo.png" alt="Keystone Logo" width={200} height={50} className="object-contain h-12 w-auto" />
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded hover:bg-blue-800 text-white">✖</button>
            </div>

            <nav className="flex flex-col gap-4">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={`relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:text-orange-500 ${pathname === link.href ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`}>
                  {link.label}
                </Link>
              ))}

              {/* Mobile About Us */}
              <div className="w-full">
                <button onClick={() => setMobileAboutOpen(prev => !prev)} className="flex items-center justify-between w-full px-2 py-2 hover:text-orange-500">
                  About Us <ChevronDown size={18} />
                </button>
                {mobileAboutOpen && (
                  <ul className="mt-2">
                    {aboutLinks.map(item => (
                      <li key={item.href}>
                        <Link href={item.href} onClick={() => setMobileOpen(false)} className="block px-4 py-2 hover:bg-gray-700">{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Mobile Downloads */}
              <div className="w-full">
                <button onClick={() => setMobileDownloadsOpen(prev => !prev)} className="flex items-center justify-between w-full px-2 py-2 hover:text-orange-500">
                  Downloads <ChevronDown size={18} />
                </button>
                {mobileDownloadsOpen && (
                  <div className="mt-2">
                    {error ? <div className="px-2 py-2 text-sm text-red-400">Unable to load downloads</div> :
                      downloads.map(item => (
                        <a key={item.id} href={getStrapiMedia(item.file[0]?.url)} target="_blank" rel="noopener noreferrer" className="block px-2 py-2 hover:bg-gray-700 rounded">
                          {item.title} <span className="text-xs text-gray-300 ml-2">{item.file[0]?.ext?.toUpperCase().replace('.', '')} · {formatSize(item.file[0]?.size)}</span>
                        </a>
                      ))
                    }
                  </div>
                )}
              </div>

              {/* Mobile Updates */}
              <div className="w-full">
                <button onClick={() => setMobileUpdatesOpen(prev => !prev)} className="flex items-center justify-between w-full px-2 py-2 hover:text-orange-500">
                  Updates <ChevronDown size={18} />
                </button>
                {mobileUpdatesOpen && (
                  <ul className="mt-2">
                    <li><Link href="/updates/notices" onClick={() => setMobileOpen(false)} className="block px-4 py-2 hover:bg-gray-700">Notices</Link></li>
                    <li><Link href="/updates/press-releases" onClick={() => setMobileOpen(false)} className="block px-4 py-2 hover:bg-gray-700">Press Releases</Link></li>
                  </ul>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
