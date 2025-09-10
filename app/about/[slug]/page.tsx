// app/[slug]/page.tsx
import AboutUsContent from './AboutUsContent';
import AboutSkeleton from '@/app/components/AboutSkeleton';
import { Suspense } from 'react';

type ParamsType = { slug: string };

type Props = { params: Promise<ParamsType> };

// ---------------- Page Component ----------------
export default async function AboutPage({ params }: Props) {
  const { slug } = await params;

  return (
    <Suspense fallback={<AboutSkeleton />}>
      <AboutUsContent slug={slug} />
    </Suspense>
  );
}

// ---------------- Metadata ----------------
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const companyMap: Record<string, string> = {
    'sister-company': 'Sister Company',
    'keystone': 'Keystone Multipurpose Company',
  };

  return {
    title: companyMap[slug] || 'About Us',
  };
}
