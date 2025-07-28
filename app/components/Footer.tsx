'use client'

import Link from 'next/link'
import { SiFacebook, SiTiktok, SiInstagram } from 'react-icons/si'

export default function Footer() {
  return (
    <footer className="bg-[#0B1E36] text-gray-100 mt-16 font-[roboto]">
      <div className="max-w-screen-xl mx-auto px-4 py-10 sm:px-6 lg:px-4 ">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-8 md:gap-16">

          {/* Company Info */}
          <div className=''>
            <h2 className="text-xl font-bold font-playfair">Keystone</h2>
            <p className="mt-2 text-sm text-gray-300">
              Empowering your financial future with smart investments.
            </p>
          </div>

          {/* Spacer */}
          <div className="hidden md:block"></div>


          {/* Right: Quick Links + Follow Us */}
          <div>
            <div className="flex flex-col gap-8 md:flex-row md:gap-16">
          {/* Navigation */}
          <div className=''>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-2 text-sm ">
              <li><Link href="/" className="hover:text-orange-500 transition-colors duration-300">Home</Link></li>
              <li><Link href="/about" className="hover:text-orange-500 transition-colors duration-300">About Us</Link></li>
              <li><Link href="/gallery" className="hover:text-orange-500 transition-colors duration-300">Gallery</Link></li>
              <li><Link href="/reports" className="hover:text-orange-500 transition-colors duration-300">Reports</Link></li>
              {/* <li><Link href="/privacy" className="hover:text-orange-500 transition-colors duration-300">Privacy Policy</Link></li> */}
            </ul>
          </div>

          {/* Social / CTA */}
          <div className=''>
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="mt-2 flex gap-4">
              <Link href="#" aria-label="Facebook" className="hover:text-orange-500 transition-transform duration-300 hover:scale-110">
                <SiFacebook className="text-2xl" />
              </Link>
              <Link href="#" aria-label="TikTok" className="hover:text-orange-500 transition-transform duration-300 hover:scale-110">
                <SiTiktok className="text-2xl" />
              </Link>

              <Link href="#" aria-label="Instagram" className="hover:text-orange-500 transition-transform duration-300 hover:scale-110">
                <SiInstagram className="text-2xl" />
              </Link>
            </div>

            <div className="mt-4">
              <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-4 text-sm text-center text-gray-400 space-y-1">
          <p>&copy; {new Date().getFullYear()} Keystone. All rights reserved.</p>
          <p>
            Developed by{' '}
            <a
              href="https://abhinavkarki.com.np"
              className="hover:text-orange-500 transition-colors duration-300"
              target='_blank'
            >
              Abhinav karki
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
