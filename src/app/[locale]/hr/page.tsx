import React from 'react';
import { getTranslations } from 'next-intl/server';
import { HRPageContainer } from '@/domains/media/components/HRPageContainer';

interface HRPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    search?: string;
    department?: string;
  }>;
}

export async function generateMetadata({ params }: HRPageProps) {
  const resolvedParams = await params;
  const t = await getTranslations('hr');
  
  // Helper function to safely extract text values that might be objects with {en, ne} keys
  const getLocalizedText = (text: any, fallback: string = ''): string => {
    if (typeof text === 'string') {
      return text;
    }
    if (text && typeof text === 'object') {
      // Handle case where text is {en: "...", ne: "..."}
      const locale = resolvedParams.locale;
      if (locale === 'ne' && text.ne) {
        return text.ne;
      }
      if (locale === 'en' && text.en) {
        return text.en;
      }
      // Fallback to any available text
      return text.ne || text.en || fallback;
    }
    return fallback;
  };
  
  return {
    title: getLocalizedText(t('title')),
    description: getLocalizedText(t('description')),
  };
}

export default async function HRPage({ params, searchParams }: HRPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const search = resolvedSearchParams.search || '';
  const department = resolvedSearchParams.department || '';

  return (
    <HRPageContainer
      locale={resolvedParams.locale as 'en' | 'ne'}
      initialSearch={search}
      initialDepartment={department}
    />
  );
}
