'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
      {/* Hero Image */}
      <Image
        src="/HeroImage_3000.webp"
        alt="Professional investment hero"
        fill
        priority
        className="object-cover"
      />

      {/* Optional overlay content */}
      <div className="absolute inset-0 bg-black/30 flex flex-col justify-center px-4 md:px-8 border-amber-50">
        <div className='max-w-screen-xl mx-auto px-4 md:px-8'>
            <h1 className="text-3xl md:text-5xl font-bold text-white max-w-3xl font-[playfair]">
            Your Trusted Partner For Investment And Travel
            </h1>
            <p className="text-lg md:text-xl text-white mt-4 max-w-2xl font-[roboto]">
            Managing wealth. Moving journeys.
            </p>

            {/* Call to Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-4">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/#contact-info" className="px-6 py-3 bg-orange-500 text-white font-semibold rounded hover:bg-orange-800 transition inline-block text-center">
            Get Started
            </a>

            <Link href="/about" className="px-6 py-3 bg-white text-blue-800 font-semibold rounded hover:bg-gray-100 transition inline-block text-center">
              Learn More
            </Link>
          </div>


        </div>
      </div>
    </section>
  )
}
