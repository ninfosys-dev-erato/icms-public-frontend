"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useHomepageNotices } from "../hooks";
import styles from "./notices.module.css";

interface NoticesSectionProps {
  locale?: "ne" | "en";
  limit?: number;
}

export const NoticesSection: React.FC<NoticesSectionProps> = ({
  locale = "en",
  limit = 6,
}) => {
  const t = useTranslations("notices");
  const { data: notices = [], isLoading, isError } = useHomepageNotices(limit);

  // Helper function to safely extract text values that might be objects with {en, ne} keys
  const getLocalizedText = (text: any, fallback: string = ''): string => {
    if (typeof text === 'string') {
      return text;
    }
    if (text && typeof text === 'object') {
      // Handle case where text is {en: "...", ne: "..."}
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

  // Helper function to get notice type with fallback
  const getNoticeType = (type: any): string => {
    if (!type || typeof type !== 'string') {
      return 'notice'; // default fallback
    }
    // Validate that the type exists in translations
    const validTypes = ['notice', 'circular', 'tender', 'vacancy', 'result'];
    return validTypes.includes(type) ? type : 'notice';
  };

  // Helper function to get notice type color (Carbon Design colors)
  const getTypeColor = (type: string): string => {
    const validType = getNoticeType(type);
    switch (validType) {
      case 'tender':
        return '#198038'; // Green  
      case 'vacancy':
        return '#8a3ffc'; // Purple
      case 'circular':
        return '#f1c21b'; // Yellow
      case 'result':
        return '#0f62fe'; // Blue
      case 'notice':
      default:
        return '#525252'; // Gray
    }
  };

  // Helper function to get notice priority with fallback
  const getNoticePriority = (priority: any): string => {
    if (!priority || typeof priority !== 'string') {
      return 'normal'; // default fallback
    }
    // Validate that the priority exists in translations
    const validPriorities = ['normal', 'high', 'urgent'];
    return validPriorities.includes(priority) ? priority : 'normal';
  };

  // Helper function to get priority color (Carbon Design colors)
  const getPriorityColor = (priority: string): string => {
    const validPriority = getNoticePriority(priority);
    switch (validPriority) {
      case 'urgent':
        return '#da1e28'; // Red
      case 'high':
        return '#f1c21b'; // Yellow
      case 'normal':
      default:
        return '#0f62fe'; // Blue
    }
  };

  // Helper function to format date consistently
  const formatDate = (dateString: string, bsDate?: string): string => {
    try {
      if (locale === 'ne' && bsDate) {
        return bsDate;
      }
      if (dateString) {
        // Use a consistent date format that won't cause hydration mismatch
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      }
      return 'N/A';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  if (isLoading) {
    return (
      <section className={styles.noticesSection} suppressHydrationWarning>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t("title")}</h2>
            <p className={styles.sectionDescription}>{t("loading")}</p>
          </div>
          <div className={styles.noticesGrid}>
            {[...Array(limit)].map((_, index) => (
              <div key={index} className={styles.noticeCardSkeleton}>
                <div className={styles.noticeHeaderSkeleton}>
                  <div className={styles.typeBadgeSkeleton}></div>
                  <div className={styles.dateSkeleton}></div>
                </div>
                <div className={styles.noticeContentSkeleton}>
                  <div className={styles.titleSkeleton}></div>
                  <div className={styles.summarySkeleton}></div>
                  <div className={styles.referenceSkeleton}></div>
                </div>
                <div className={styles.noticeFooterSkeleton}>
                  <div className={styles.linkSkeleton}></div>
                  <div className={styles.statsSkeleton}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || notices.length === 0) {
    return (
      <section className={styles.noticesSection} suppressHydrationWarning>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t("title")}</h2>
            <p className={styles.sectionDescription}>
              {isError ? t("error") : t("noNotices")}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.noticesSection} suppressHydrationWarning>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t("title")}</h2>
          <p className={styles.sectionDescription} suppressHydrationWarning>
            {t("description")}
          </p>
        </div>

        <div className={styles.noticesGrid} suppressHydrationWarning>
          {notices.map((notice) => (
            <article key={notice.id} className={styles.noticeCard}>
              <div className={styles.noticeHeader}>
                <div className={styles.noticeDate}>
                  {formatDate(notice.createdAt, notice.bsDate)}
                </div>
              </div>

              <div className={styles.noticeContent}>
                <h3 className={styles.noticeTitle}>
                  {getLocalizedText(notice.title, locale === 'ne' ? 'शीर्षकहीन' : 'Untitled')}
                </h3>
                {notice.summary && (
                  <p className={styles.noticeSummary}>
                    {getLocalizedText(notice.summary)}
                  </p>
                )}
                {notice.referenceNo && (
                  <p className={styles.noticeReference}>
                    {t('reference')}: {notice.referenceNo}
                  </p>
                )}
              </div>

              <div className={styles.noticeFooter}>
                <Link
                  href={`/${locale}/content/notice-board/${notice.slug || notice.id}`}
                  className={styles.readMoreLink}
                  aria-label={`${t('readMore')} - ${getLocalizedText(notice.title)}`}
                >
                  {t('readMore')}
                  <svg
                    className={styles.externalIcon}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M13 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 12.146a.5.5 0 0 0 .708.708L12 3.707V8.5a.5.5 0 0 0 1 0v-6z"/>
                  </svg>
                </Link>
                <div className={styles.noticeStats}>
                  <span className={styles.statItem} aria-label={`${notice.viewCount || 0} views`}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                    </svg>
                    <span className="sr-only">Views: </span>
                    {notice.viewCount || 0}
                  </span>
                  {notice.attachments && Array.isArray(notice.attachments) && notice.attachments.length > 0 && (
                    <span className={styles.statItem} aria-label={`${notice.attachments.length} attachments`}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                        <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1z"/>
                      </svg>
                      <span className="sr-only">Attachments: </span>
                      {notice.attachments.length}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.sectionFooter}>
          <Link href={`/${locale}/content/notice-board`} className={styles.viewAllButton}>
            {t("viewAll")}
            <svg
              className={styles.arrowIcon}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};