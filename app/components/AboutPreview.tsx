import Image from "next/image"
import Link from "next/link"

export default function AboutPreview() {
  return (
    <section className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white py-16 transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">

        {/* Left: Image */}
        <div className="order-2 md:order-1">
          <Image
            src="/about-stock.webp"
            alt="Stock market illustration"
            width={600}
            height={400}
            className="rounded-lg shadow-lg w-full h-auto"
            priority
          />
        </div>

        {/* Right: Text */}
        <div className="space-y-4 order-1 md:order-2">
          <h2 className="text-3xl font-bold font-playfair">
            About Keystone
          </h2>
          <p className="leading-relaxed">
            <strong>Keystone Multipurpose Company Pvt. Ltd.</strong> is a trusted Nepali firm helping shareholders and investors grow their wealth by strategically investing in the stock market — both through short-term trading and long-term holdings.
          </p>
          <p className="leading-relaxed">
            With a commitment to transparency and sustainable growth, Keystone also manages two Mahindra Scorpio vehicles under our travel & booking subsidiary, <strong>Key-Stone Travels & Tours Pvt. Ltd.</strong>, providing additional value to our stakeholders.
          </p>
          <Link
            href="/about"
            className="inline-block mt-4 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors duration-200"
          >
            Learn More →
          </Link>
        </div>

      </div>
    </section>
  );
}