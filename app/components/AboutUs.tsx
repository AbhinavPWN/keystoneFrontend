'use client';

import Image from 'next/image';
import Link from 'next/link';

type RichTextNode = {
  type: string;
  children: { text: string; type: string }[];
};

type BoardMember = {
  id: number;
  documentId: string;
  name: string;
  position: string;
  image: string;
  bio?: RichTextNode[] | null;
};

type Investment = {
  id: number;
  title: string;
  description?: string;
  url?: string;
  logo: string;
};

type AdvisoryMember = {
  id: number;
  documentId: string;
  name: string;
  image: string;
};

export default function AboutUs({
  boardMembers = [],
  investments = [],
  advisoryMembers = [],
  hasError = false,
}: {
  boardMembers?: BoardMember[];
  investments?: Investment[];
  advisoryMembers?: AdvisoryMember[];
  hasError?: boolean;
}) {
  const STRAPI_BASE_URL =
    process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:8080';

  if (hasError) {
    return (
      <main className="text-center py-20">
        <h1 className="text-2xl font-bold text-red-600">
          Something went wrong while loading this page.
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Please try again later.
        </p>
      </main>
    );
  }

  return (
    <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-[roboto]">
      {/* Hero */}
      <section className="relative bg-[#0B1E36] dark:bg-gray-800 text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-[playfair]">About Keystone</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto font-[roboto]">
          Building sustainable growth for our investors and stakeholders with trust, vision, and expertise.
        </p>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-screen-xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 order-2 md:order-1">
            <h2 className="text-3xl font-bold font-[playfair]">Who We Are</h2>
            <p className="leading-relaxed text-justify font-[roboto]">
              <strong>Keystone Multipurpose Company Pvt. Ltd.</strong> is a trusted Nepali firm helping shareholders and investors grow their wealth by strategically investing in the stock market — both through short-term trading and long-term holdings.
            </p>
            <p className="leading-relaxed text-justify font-[roboto]">
              With a commitment to transparency and sustainable growth, Keystone also manages two Mahindra Scorpio vehicles under our travel & booking subsidiary, <strong>Key-Stone Travels & Tours Pvt. Ltd.</strong>, providing additional value to our stakeholders.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <Image
              src="/about-stock.webp"
              alt="Stock market illustration"
              width={600}
              height={400}
              className="rounded-lg shadow-lg w-full h-auto"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-[playfair] mb-8">Our Commitment</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Sustainable Growth', desc: 'We aim for long-term, steady returns for our investors while minimizing risk and ensuring transparency.' },
              { title: 'Transparency', desc: 'Open communication and clear reporting to maintain the trust of our shareholders and partners.' },
              { title: 'Stakeholder Value', desc: 'Delivering tangible benefits not just to investors, but to the broader community through diverse ventures.' },
            ].map((item) => (
              <div key={item.title} className="p-6 bg-gray-50 dark:bg-gray-900 rounded shadow hover:shadow-md transition">
                <h3 className="font-semibold text-xl mb-2 font-[playfair]">{item.title}</h3>
                <p className="font-[roboto]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Board Members */}
      {boardMembers.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold font-[playfair] mb-8">Our Board</h2>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              {boardMembers.map((member) => (
                <Link
                  key={member.id}
                  href={`/board-members/${member.documentId}`}
                  className="p-4 bg-white dark:bg-gray-800 rounded shadow hover:shadow-md transition text-center block"
                >
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <Image
                      src={
                        member.image.startsWith('/')
                          ? `${STRAPI_BASE_URL}${member.image}`
                          : member.image
                      }
                      alt={member.name}
                      fill
                      className="rounded-full object-cover"
                      sizes="(max-width: 640px) 128px, 192px"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-orange-500">{member.position}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Advisory Committee */}
      {advisoryMembers.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold font-[playfair] mb-8">Advisory Committee</h2>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              {advisoryMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-4 bg-white dark:bg-gray-800 rounded shadow hover:shadow-md transition text-center"
                >
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <Image
                      src={
                        member.image.startsWith('/')
                          ? `${STRAPI_BASE_URL}${member.image}`
                          : member.image
                      }
                      alt={member.name}
                      fill
                      className="rounded-full object-cover"
                      sizes="(max-width: 640px) 128px, 192px"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Investments */}
      {investments.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold font-[playfair] mb-8">Our Investments</h2>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              {investments.map((inv) => (
                <div
                  key={inv.id}
                  className="p-4 bg-white dark:bg-gray-800 rounded shadow hover:shadow-md transition text-center"
                >
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <Image
                      src={
                        inv.logo.startsWith('/')
                          ? `${STRAPI_BASE_URL}${inv.logo}`
                          : inv.logo
                      }
                      alt={inv.title}
                      fill
                      className="object-contain rounded"
                      sizes="(max-width: 640px) 128px, 192px"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{inv.title}</h3>
                  {inv.description && (
                    <p className="text-sm mt-1">{inv.description}</p>
                  )}
                  {inv.url && (
                    <a
                      href={inv.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:underline mt-2 inline-block"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-12 bg-[#0B1E36] dark:bg-gray-800 text-white text-center">
        <h2 className="text-2xl font-bold font-[playfair]">Ready to Partner With Keystone?</h2>
        <Link
          href="/reports"
          className="inline-block mt-4 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          View Our Reports →
        </Link>
      </section>
    </main>
  );
}
