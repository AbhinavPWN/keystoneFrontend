'use client';

import Link from 'next/link';
import Image from 'next/image';

const mockImages = [
  { src: '/Image1.jpg', alt: 'Gallery Image 1' },
  { src: '/Image2.jpg', alt: 'Gallery Image 2' },
  { src: '/Image3.jpg', alt: 'Gallery Image 3' },
  { src: '/Image4.jpg', alt: 'Gallery Image 4' },
//   { src: '/gallery5.jpg', alt: 'Gallery Image 5' },
//   { src: '/gallery6.jpg', alt: 'Gallery Image 6' },
];

export default function GalleryPreview() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold font-playfair text-gray-800 dark:text-white">
            Gallery
          </h2>
          <Link href="/gallery" className="text-orange-500 hover:text-orange-600 transition">
            View All →
          </Link>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl lg:text-2xl">
          Explore moments and highlights from our work, events, and services.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {mockImages.map((img, idx) => (
            <div key={idx} className="relative overflow-hidden rounded-lg shadow hover:shadow-lg transition">
              <Image
                src={img.src}
                alt={img.alt}
                width={400}
                height={300}
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
