import Link from "next/link";

export default function Cta() {
  return (
    <section className="py-12 bg-[#0B1E36] dark:bg-gray-800 text-white text-center">
      <h2 className="text-2xl md:text-3xl font-bold font-[playfair]">
        Ready to Partner With Keystone?
      </h2>
      <p className="mt-2 text-sm md:text-base font-[roboto]">
        Discover how we can help grow your investments and provide sustainable value.
      </p>
      <div className="mt-4">
        <Link
          href="/reports"
          className="inline-block px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          View Our Reports →
        </Link>
      </div>
    </section>
  );
}