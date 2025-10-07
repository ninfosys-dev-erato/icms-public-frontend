'use client';

import { useEffect, useState } from 'react';
import { ContentPageContainer } from '@/domains/content-management/components/ContentPageContainer';
import { resolveContentFromSlug } from '@/domains/content-management/services/ContentResolver';
import type { ContentResolution } from '@/domains/content-management/services/ContentResolver';

interface ClientFallbackProps {
  slug: string[];
  locale: 'en' | 'ne';
  searchParams: any;
}

export default function ClientFallback({ slug, locale, searchParams }: ClientFallbackProps) {
  const [contentData, setContentData] = useState<ContentResolution>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);
        const slugArray = slug.filter(Boolean);
        const data = await resolveContentFromSlug(slugArray, locale, searchParams);
        
        if (!data) {
          setError('Content not found');
          return;
        }
        
        setContentData(data);
      } catch (err) {
        console.error('Client-side content fetch failed:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [slug, locale, searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Content Unavailable</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!contentData) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Content Not Found</h2>
          <p className="text-gray-600">The requested content could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <ContentPageContainer
      contentData={contentData}
      locale={locale}
      searchParams={Promise.resolve(searchParams)}
    />
  );
}