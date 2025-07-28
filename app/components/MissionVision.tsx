'use client'

export default function MissionVision() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold font-playfair mb-4 font-[playfair]">Our Mission & Vision</h2>

        <div className="grid md:grid-cols-2 gap-8 text-left mt-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-2 text-orange-500 text-center font-[playfair]" >Our Mission</h3>
            <p className="font-[roboto] text-justify">
              To empower our shareholders and stakeholders by delivering sustainable, transparent, and responsible investment solutions that contribute to long-term wealth creation and economic development.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-2 text-orange-500 text-center font-[playfair]">Our Vision</h3>
            <p className="font-[roboto] text-justify">
              To be Nepal’s most trusted and innovative multipurpose investment company, recognized for integrity, growth, and positive impact on society and the economy.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
