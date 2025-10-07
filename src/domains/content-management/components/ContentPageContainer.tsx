'use client';

import { useTranslations } from 'next-intl';
import { Suspense } from 'react';
import { ContentResolution } from '@/domains/content-management/services/ContentResolver';
import { ContentView } from './ContentView';
import CategoryListingView from './CategoryListingView';
import { ContentBreadcrumb } from './ContentBreadcrumb';

interface ContentPageContainerProps {
  contentData: ContentResolution;
  locale: 'en' | 'ne';
  searchParams: any;
}

function ContentSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb skeleton */}
        <div className="h-4 bg-gray-200 rounded w-64 mb-6 animate-pulse"></div>
        
        {/* Content skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-6 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotFoundContent({ locale }: { locale: 'en' | 'ne' }) {
  const t = useTranslations('content');
  
  return (
    <div className="min-h-screen bg-gray-50 content-page-container">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 mb-6">
            <svg 
              className="w-full h-full text-gray-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('notFound.title')}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {t('notFound.description')}
          </p>
          
          <a 
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {locale === 'ne' ? 'मुख्य पृष्ठमा फर्कनुहोस्' : 'Back to Home'}
          </a>
        </div>
      </div>
    </div>
  );
}

export function ContentPageContainer({ 
  contentData, 
  locale, 
  searchParams 
}: ContentPageContainerProps) {
  
  // Handle no content data
  if (!contentData) {
    return <NotFoundContent locale={locale} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 content-page-container">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb Navigation */}
        <Suspense fallback={<div className="h-4 bg-gray-200 rounded w-64 mb-6 animate-pulse"></div>}>
          <ContentBreadcrumb 
            breadcrumbs={contentData.breadcrumbs}
            locale={locale}
          />
        </Suspense>
        
        {/* Content Based on Type */}
        <div className="mt-6">
          <Suspense fallback={<ContentSkeleton />}>
            {contentData.type === 'single-content' && (
              <ContentView 
                content={contentData.content}
                category={contentData.category}
                categoryPath={contentData.categoryPath}
                locale={locale}
              />
            )}
            
            {contentData.type === 'category-listing' && (
              <CategoryListingView 
                category={contentData.category}
                contents={contentData.contents}
                pagination={contentData.pagination}
              />
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}