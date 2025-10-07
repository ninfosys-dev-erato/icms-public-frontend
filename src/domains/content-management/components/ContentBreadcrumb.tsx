'use client';


import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { BreadcrumbItem } from '@/domains/content-management/services/ContentResolver';
import { Breadcrumb, BreadcrumbItem as CarbonBreadcrumbItem } from '@carbon/react';

interface ContentBreadcrumbProps {
  breadcrumbs: BreadcrumbItem[];
  locale: 'en' | 'ne';
}

export function ContentBreadcrumb({ breadcrumbs, locale }: ContentBreadcrumbProps) {
  const t = useTranslations('content');

  if (!breadcrumbs || breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <div style={{ margin: '1rem 0', padding: '0.5rem 0' }}>
      <Breadcrumb aria-label={t('breadcrumbNavigation')}>
        {breadcrumbs.map((item, index) => (
          <CarbonBreadcrumbItem key={index} isCurrentPage={!!item.isActive}>
            {item.href && !item.isActive ? (
              <Link href={item.href}>{item.title}</Link>
            ) : (
              item.title
            )}
          </CarbonBreadcrumbItem>
        ))}
      </Breadcrumb>
    </div>
  );
}