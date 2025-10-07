import { Suspense } from 'react';
import { HomepageContainer } from '@/domains/homepage/components/HomepageContainer';
import { HomepageService } from '@/domains/homepage/services/homepage-service';

// Enable ISR with tag-based revalidation
export const revalidate = 300; // 5 minutes

// Generate static params for all locales
export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'ne' }
  ];
}

// Pre-fetch and cache homepage data at build time
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  return {
    title: locale === 'ne' ? 'नेपाल सरकार पोर्टल' : 'Nepal Government Portal',
    description: locale === 'ne' 
      ? 'नेपाल सरकारको आधिकारिक पोर्टल - सूचनाहरू, सेवाहरू, र दस्तावेजहरू'
      : 'Official Portal of Government of Nepal - Notices, Services, and Documents',
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Components now handle their own data fetching via TanStack Query
  // No need to pre-fetch here - let the hooks handle caching and retries
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomepageContainer />
    </Suspense>
  );
}