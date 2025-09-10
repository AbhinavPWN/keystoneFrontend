'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { getStrapiMedia } from '@/lib/getStrapiMedia'

// ---------------- Types ----------------
interface StrapiTextNode {
  text: string
}

interface StrapiContentBlock {
  type: string
  children: StrapiTextNode[]
}

interface StrapiThumbnail {
  url: string
  alternativeText?: string | null
}

interface StrapiNotice {
  id: number
  title: string
  slug: string
  date: string
  content: StrapiContentBlock[]
  thumbnail?: StrapiThumbnail
}

interface NestedNoticeResponse {
  id: number
  attributes: {
    title: string
    slug: string
    date: string
    content: StrapiContentBlock[]
    thumbnail?: StrapiThumbnail
  }
}

type StrapiResponseItem = StrapiNotice | NestedNoticeResponse

interface StrapiApiResponse {
  data: StrapiResponseItem[]
}

// ---------------- Component ----------------
export default function NoticesPage() {
  const [notices, setNotices] = useState<StrapiNotice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNotices() {
      try {
        const base =
          process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:1337'

        const res = await fetch(
          `${base}/api/updates?populate=thumbnail&filters[category][$eq]=notice&sort[0]=date:desc`
        )
        if (!res.ok) throw new Error('Failed to fetch notices')

        const json: StrapiApiResponse = await res.json()
        console.log('API Response:', json)

        const items: StrapiNotice[] = json.data.map((item) => {
          if ('attributes' in item) {
            const attrs = item.attributes
            return {
              id: item.id,
              title: attrs.title,
              slug: attrs.slug,
              date: attrs.date,
              content: attrs.content || [],
              thumbnail: attrs.thumbnail,
            }
          } else {
            return {
              id: item.id,
              title: item.title,
              slug: item.slug,
              date: item.date,
              content: item.content || [],
              thumbnail: item.thumbnail,
            }
          }
        })

        setNotices(items)
      } catch (err) {
        console.error('Failed to load notices:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotices()
  }, [])

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12 text-[#0B1E36] font-[playfair]">
        Notices
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 font-[roboto]">Loading notices...</p>
      ) : notices.length === 0 ? (
        <p className="text-center text-gray-500 font-[roboto]">No notices available.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {notices.map((notice, index) => (
            <Link
              key={notice.id}
              href={`/updates/notices/${notice.slug}`}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden cursor-pointer"
              >
                {notice.thumbnail && (
                  <Image
                    src={getStrapiMedia(notice.thumbnail.url)}
                    alt={notice.thumbnail.alternativeText || notice.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-6">
                  <p className="text-sm text-gray-500">
                    {new Date(notice.date).toLocaleDateString('en-GB')}
                  </p>
                  <h2 className="text-xl font-semibold text-[#0B1E36] mt-2 mb-3">
                    {notice.title}
                  </h2>
                  <p className="text-gray-600 line-clamp-3">
                    {notice.content?.[0]?.children?.[0]?.text || ''}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
