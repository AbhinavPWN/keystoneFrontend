'use client'

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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

  if (!mounted) {
    return null
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
          <div className="relative w-30 h-16">
            <Image
              src="/logo_light.png"
              alt="Keystone Logo"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 112px, 120px"
            />
          </div>
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
        </nav>

        {/* Mobile Hamburger only */}
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
              <div className="relative w-28 h-8">
                <Image
                  src="/logo_light.png"
                  alt="Keystone Logo"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 112px, 120px"
                />
              </div>
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
          </nav>
        </div>
      )}
    </header>
  )
}
