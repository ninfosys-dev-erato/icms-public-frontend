"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Notice } from '../types';
import { noticeService } from '../services';
import styles from './notices.module.css';

interface NoticeGridProps {
  notices: Notice[];
  locale: 'en' | 'ne';
}

export const NoticeGrid: React.FC<NoticeGridProps> = ({ notices, locale }) => {
  const t = useTranslations('notices');

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

  // Helper function to get notice priority with fallback
  const getNoticePriority = (priority: any): string => {
    if (!priority || typeof priority !== 'string') {
      return 'normal'; // default fallback
    }
    // Validate that the priority exists in translations
    const validPriorities = ['normal', 'high', 'urgent'];
    return validPriorities.includes(priority) ? priority : 'normal';
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

  const handleDownload = (notice: Notice) => {
    if (notice.attachments && notice.attachments && notice.attachments.length > 0) {
      // Download first attachment
      const attachment = notice.attachments[0];
      const link = document.createElement('a');
      link.href = attachment.url || attachment.downloadUrl || '#';
      link.download = attachment.originalName || attachment.fileName || 'notice';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async (notice: Notice) => {
    const title = getLocalizedText(notice.title, locale === 'ne' ? 'शीर्षकहीन' : 'Untitled');
    const summary = getLocalizedText(notice.summary);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: summary || '',
          url: notice.permalink,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(notice.permalink);
        // You could show a toast notification here
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <div className={styles.noticeGrid}>
      {notices && notices.map((notice, index) => (
        <article key={notice.id || `notice-${index}`} className={styles.noticeCard}>
          <div className={styles.noticeHeader}>
            <div className={styles.noticeBadges}>
              <span 
                className={styles.typeBadge}
                style={{ 
                  backgroundColor: noticeService.getPriorityColor(getNoticePriority(notice.priority)) 
                }}
              >
                {t(`type.${getNoticeType(notice.type)}`)}
              </span>
              {getNoticePriority(notice.priority) !== 'normal' && (
                <span 
                  className={styles.priorityBadge}
                  style={{ 
                    backgroundColor: noticeService.getPriorityColor(getNoticePriority(notice.priority)) 
                  }}
                >
                  {t(`priority.${getNoticePriority(notice.priority)}`)}
                </span>
              )}
            </div>
            <div className={styles.noticeDate}>
              {formatDate(notice.publishedAt, notice.bsDate)}
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
            {notice.content && (
              <div className={styles.noticeContentPreview}>
                <p>
                  {getLocalizedText(notice.content)}
                </p>
              </div>
            )}
          </div>

          <div className={styles.noticeFooter}>
            <div className={styles.noticeActions}>
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
              {notice.attachments && notice.attachments.length > 0 && (
                <button
                  className={styles.downloadButton}
                  onClick={() => handleDownload(notice)}
                  aria-label={`${t('download')} - ${getLocalizedText(notice.title)}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M3 17v3a2 2 0 002 2h10a2 2 0 002-2v-3M10 11l4-4m0 0l-4-4m4 4H2"/>
                  </svg>
                  {t('download')}
                </button>
              )}
              <button
                className={styles.shareButton}
                onClick={() => handleShare(notice)}
                aria-label={`${t('share')} - ${getLocalizedText(notice.title)}`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                </svg>
                {t('share')}
              </button>
            </div>

            <div className={styles.noticeStats}>
              <span className={styles.statItem} aria-label={`${notice.viewCount || 0} views`}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                </svg>
                <span className="sr-only">Views: </span>
                {notice.viewCount || 0}
              </span>
              {notice.attachments && notice.attachments.length > 0 && (
                <span className={styles.statItem} aria-label={`${notice.attachments.length} attachments`}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1z"/>
                  </svg>
                  <span className="sr-only">Attachments: </span>
                  {notice.attachments.length}
                </span>
              )}
              {notice.downloadCount && notice.downloadCount > 0 && (
                <span className={styles.statItem} aria-label={`${notice.downloadCount} downloads`}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M3 17v3a2 2 0 002 2h10a2 2 0 002-2v-3M10 11l4-4m0 0l-4-4m4 4H2"/>
                  </svg>
                  <span className="sr-only">Downloads: </span>
                  {notice.downloadCount}
                </span>
              )}
            </div>
          </div>

          {notice.tags && notice.tags.length > 0 && (
            <div className={styles.noticeTags}>
              {notice.tags.slice(0, 5).map((tag, tagIndex) => (
                <span key={tagIndex} className={styles.noticeTag}>
                  {getLocalizedText(tag)}
                </span>
              ))}
              {notice.tags.length > 5 && (
                <span className={styles.noticeTagMore}>
                  +{notice.tags.length - 5}
                </span>
              )}
            </div>
          )}
        </article>
      ))}
    </div>
  );
};