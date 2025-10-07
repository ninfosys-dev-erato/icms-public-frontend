"use client";

import { useTranslations } from 'next-intl';
import { HeaderProps } from '../types/header';
import { useHeaderDataQuery } from '../hooks/useHeaderQuery';
import { HeaderTop } from './HeaderTop';
import { HeaderMain } from './HeaderMain';
import { NewsTicker } from '@/domains/news';
import styles from '../styles/header.module.css';

export function HeaderContainer({ locale, className = '' }: HeaderProps) {
  const { data, isLoading, error } = useHeaderDataQuery(locale);

  // Always show skeleton on both server and client when loading
  if (isLoading || !data) {
    return (
      <div className={`${styles.headerSkeleton} ${className}`}>
        <div className={styles.headerSkeletonTop}></div>
        <div className={styles.headerSkeletonMain}></div>
      </div>
    );
  }

  // Error state - show minimal header
  if (error) {
    console.error('Header error:', error);
    return (
      <div className={`${styles.headerContainer} ${className}`}>
        <div className={styles.headerTop}>
          <div className={styles.headerTopContainer}>
            <div className={styles.headerTopBranding}>
              <div className={styles.headerTopLogo}>
                <img 
                  src="/icons/nepal-emblem.svg" 
                  alt="Nepal Emblem"
                  className={styles.headerTopEmblem}
                />
              </div>
              <div className={styles.headerTopText}>
                <h1 className={styles.headerTopTitle}>
                  {locale === 'ne' 
                    ? 'सूचना प्रविधि विभाग' 
                    : 'Department of Information Technology'}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <header className={`${styles.headerContainer} ${className}`}>
      <HeaderTop data={data} locale={locale} />
      <div className={styles.headerMainWrapper}>
        <HeaderMain data={data} locale={locale} />
      </div>
    </header>
  );
}