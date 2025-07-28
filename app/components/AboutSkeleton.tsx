export default function AboutSkeleton() {
  return (
    <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-[roboto] animate-pulse">
      <section className="relative bg-[#0B1E36] dark:bg-gray-800 text-white py-20 text-center">
        <div className="h-8 bg-gray-700 w-1/2 mx-auto rounded"></div>
        <div className="mt-4 h-4 bg-gray-600 w-1/3 mx-auto rounded"></div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-screen-xl mx-auto px-4 grid md:grid-cols-2 gap-8">
          <div className="space-y-4 order-2 md:order-1">
            <div className="h-6 bg-gray-300 w-1/3 rounded"></div>
            <div className="h-4 bg-gray-200 w-full rounded"></div>
            <div className="h-4 bg-gray-200 w-5/6 rounded"></div>
            <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
          </div>
          <div className="order-1 md:order-2 bg-gray-200 rounded-lg shadow-lg w-full h-64"></div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <div className="h-6 bg-gray-300 w-1/4 mx-auto rounded mb-8"></div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 bg-gray-100 dark:bg-gray-900 rounded shadow"
              >
                <div className="h-4 bg-gray-300 w-1/2 mx-auto mb-2 rounded"></div>
                <div className="h-3 bg-gray-200 w-2/3 mx-auto rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
