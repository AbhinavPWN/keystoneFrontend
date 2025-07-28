'use client'

import { FaChartLine, FaHandsHelping, FaGlobe } from 'react-icons/fa'

export default function Services() {
  return (
    <section className="bg-white dark:bg-gray-800 py-16">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold font-[playfair] mb-8">Our Services</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded shadow hover:shadow-md transition">
            <FaChartLine className="text-4xl text-orange-500 mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2 font-[playfair]">Stock Market Investments</h3>
            <p className='font-[roboto]'>
              Strategic trading and long-term investments for consistent shareholder returns.
            </p>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded shadow hover:shadow-md transition">
            <FaHandsHelping className="text-4xl text-orange-500 mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2 font-[playfair]">Stakeholder Value</h3>
            <p className='font-[roboto]'>
              Transparent management, trust, and benefits delivered to our partners and community.
            </p>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded shadow hover:shadow-md transition">
            <FaGlobe className="text-4xl text-orange-500 mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2 font-[playfair]">Travel & Tourism</h3>
            <p className='font-[roboto]'>
              Vehicle reservation and tour services under Keystone Travels & Tours Pvt. Ltd.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
