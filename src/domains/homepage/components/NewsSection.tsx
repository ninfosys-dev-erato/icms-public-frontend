"use client";

import { NoticeCard } from '@/domains/content-management';
import { useRecentNotices } from '@/domains/content-management/hooks/useNotices';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import styles from '../styles/homepage.module.css';

interface NewsSectionProps {
  locale?: 'ne' | 'en';
  limit?: number;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ 
  locale = 'en', 
  limit = 3
}) => {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('homepage.news');
  const tCommon = useTranslations('common');
  
  // Use TanStack Query hook for notices
  const { data: notices = [], isLoading, isError, error } = useRecentNotices(limit);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Server-side fallback
    return (
      <section className={styles.newsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {t('title')}
            </h2>
            <p className={styles.sectionDescription}>
              {tCommon('loading')}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (isError) {
    return (
      <section className={styles.newsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {t('title')}
            </h2>
            <p className={styles.sectionDescription}>
              {error?.message || 'Failed to load news'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <section className={styles.newsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {t('title')}
            </h2>
            <p className={styles.sectionDescription}>
              {tCommon('loading')}
            </p>
          </div>
          <div className={styles.newsGrid}>
            {[...Array(limit)].map((_, index) => (
              <div key={index} className={styles.newsSkeleton}>
                <div className={styles.skeletonHeader}></div>
                <div className={styles.skeletonContent}>
                  <div className={styles.skeletonLine}></div>
                  <div className={styles.skeletonLine}></div>
                  <div className={styles.skeletonLineShort}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.newsSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {t('title')}
          </h2>
          <p className={styles.sectionDescription}>
            {t('description')}
          </p>
        </div>
        
        <div className={styles.newsGrid}>
          {notices.slice(0, limit).map((notice) => (
            <NoticeCard 
              key={notice.id} 
              notice={notice} 
              locale={locale}
            />
          ))}
        </div>
        
        {notices.length > limit && (
          <div className={styles.viewAllContainer}>
            <a href={`/${locale}/content/notice-board`} className={styles.viewAllLink}>
              {t('view_all')}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};