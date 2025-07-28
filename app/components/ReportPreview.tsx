'use client';

import Link from 'next/link';
import { FiFileText } from 'react-icons/fi';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';

const mockReports = [
  {
    title: 'Quarterly Financial Report - Q1 2024',
    date: 'April 15, 2024',
    fileType: 'pdf',
    fileUrl: '/keystone_report.pdf',
  },
  {
    title: 'Images 2024',
    date: 'January 5, 2024',
    fileType: 'pdf',
    fileUrl: '/Images.pdf',
  },
  {
    title: 'Shareholder Data - 2025',
    date: 'June 10, 2025',
    fileType: 'excel',
    fileUrl: '/Book.xlsx',
  },
];

export default function ReportsPreview() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-screen-xl mx-auto px-4">
        
        {/* Section header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold font-playfair text-gray-800 dark:text-white">
            Reports
          </h2>
          <Link
            href="/reports"
            className="text-orange-500 hover:text-orange-600 transition"
          >
            View All →
          </Link>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
          Stay informed with our latest financial, strategic, and operational
          reports crafted to keep our investors and stakeholders up-to-date.
        </p>

        {/* Reports grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockReports.map((report, idx) => {
            const fileIcon =
              report.fileType === 'pdf' ? (
                <FaFilePdf className="text-red-500 text-2xl" />
              ) : report.fileType === 'excel' ? (
                <FaFileExcel className="text-green-600 text-2xl" />
              ) : (
                <FiFileText className="text-blue-500 text-2xl" />
              );

            return (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-6 flex flex-col justify-between"
              >
                <div className="flex gap-3 items-start">
                  <div>{fileIcon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {report.date}
                    </p>
                  </div>
                </div>

                <a
                  href={report.fileUrl}
                  download
                  className="mt-4 inline-block px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
                >
                  Download →
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
