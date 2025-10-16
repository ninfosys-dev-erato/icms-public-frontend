"use client";

import React from "react";
// ...existing code...
import { Button, InlineLoading, InlineNotification, Tile } from '@carbon/react';
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useHomepageNotices } from "../hooks";

interface NoticesSidebarProps {
  locale?: "ne" | "en";
  limit?: number;
}

export const NoticesSidebar: React.FC<NoticesSidebarProps> = ({
  locale = "en",
  limit = 4,
}) => {
  const t = useTranslations("notices");
  const { data: notices = [], isLoading, isError } = useHomepageNotices(limit);

  const getLocalizedText = (text: any, fallback: string = ''): string => {
    if (typeof text === 'string') {
      return text;
    }
    if (text && typeof text === 'object') {
      if (locale === 'ne' && text.ne) {
        return text.ne;
      }
      if (locale === 'en' && text.en) {
        return text.en;
      }
      return text.ne || text.en || fallback;
    }
    return fallback;
  };

  const formatDate = (dateString: string, bsDate?: string): string => {
    try {
      if (locale === 'ne' && bsDate) {
        return bsDate;
      }
      if (dateString) {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      }
      return 'N/A';
    } catch (error) {
      return 'N/A';
    }
  };

    // Download logic for attachments
    const handleDownload = (notice: any) => {
      if (notice.attachments && Array.isArray(notice.attachments) && notice.attachments.length > 0) {
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

  if (isLoading) {
    return (
      <div style={{ height: '100%' }}>
        <div style={{
          borderBottom: '2px solid #0f62fe',
          paddingBottom: '1rem',
          marginBottom: '1rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#161616',
            margin: 0
          }}>
            {locale === 'ne' ? 'सूचनाहरू' : 'Notices'}
          </h2>
        </div>
        <InlineLoading description={t("loading")} />
      </div>
    );
  }

  if (isError || notices.length === 0) {
    return (
      <div style={{ height: '100%' }}>
        <div style={{
          borderBottom: '2px solid #0f62fe',
          paddingBottom: '1rem',
          marginBottom: '1rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#161616',
            margin: 0
          }}>
            {locale === 'ne' ? 'सूचनाहरू' : 'Notices'}
          </h2>
        </div>
        <InlineNotification
          kind={isError ? 'error' : 'info'}
          title={isError ? t("error") : t("noNotices")}
          hideCloseButton
        />
      </div>
    );
  }

  return (
    <Tile style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        borderBottom: '2px solid #0f62fe',
        paddingBottom: '1rem',
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#161616',
          margin: 0
        }}>
          {locale === 'ne' ? 'सूचनाहरू' : 'Notices'}
        </h2>
        <div style={{
          fontSize: '0.875rem',
          color: '#0f62fe',
          fontWeight: '500'
        }}>
          {locale === 'ne' ? 'ताजा अपडेट' : 'Latest'}
        </div>
      </div>

      {/* Notices List */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.75rem', 
        flex: 1, 
        overflowY: 'auto',
        paddingRight: '0.5rem'
      }}>
        {notices.map((notice, index) => (
          <Link
            key={notice.id}
            href={`/${locale}/content/notice-board/${notice.slug || notice.id}`}
            style={{
              display: 'flex',
              padding: '0.75rem',
              border: '1px solid #e0e0e0',
              backgroundColor: '#f4f4f4',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e0e0e0';
              e.currentTarget.style.transform = 'translateX(2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f4f4f4';
              e.currentTarget.style.transform = 'translateX(0px)';
            }}
          >
            {/* Notice indicator */}
            <div style={{
              position: 'absolute',
              display: 'flex',
              left: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              backgroundColor: index < 2 ? '#da1e28' : '#0f62fe',
            }} />
            
            <div style={{ marginLeft: '0.5rem' }}>
              <div style={{
                fontSize: '0.8rem',
                color: '#6f6f6f',
                marginBottom: '0.25rem'
              }}>
                {formatDate(notice.createdAt, notice.bsDate)}
              </div>
              
              <h3 style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#161616',
                margin: '0 0 0.25rem 0',
                lineHeight: '1.3',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {getLocalizedText(notice.title, locale === 'ne' ? 'शीर्षकहीन' : 'Untitled')}
              </h3>
              
              {notice.summary && (
                <p style={{
                  fontSize: '0.8rem',
                  color: '#525252',
                  margin: 0,
                  lineHeight: '1.2',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {getLocalizedText(notice.summary)}
                </p>
              )}
                {/* Download button for attachments */}
                {notice.attachments && Array.isArray(notice.attachments) && notice.attachments.length > 0 && (
                  <Button
                    size="sm"
                    kind="primary"
                    style={{ marginTop: '0.5rem'}}
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      handleDownload(notice);
                    }}
                    aria-label={locale === 'ne' ? 'फाइल डाउनलोड गर्नुहोस्' : 'Download file'}
                  >
                    {locale === 'ne' ? 'डाउनलोड' : 'Download'}
                  </Button>
                )}
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
        <Link href={`/${locale}/content/notice-board`} style={{ textDecoration: 'none' }}>
          <Button
            kind="ghost"
            size="sm"
            renderIcon={require('@carbon/icons-react').ArrowRight}
            iconDescription={locale === 'ne' ? 'अगाडि' : 'Arrow right'}
            style={{ color: '#0f62fe', fontWeight: 500, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
          >
            {locale === 'ne' ? 'सबै सूचनाहरू हेर्नुहोस्' : 'View All Notices'}
          </Button>
        </Link>
    </Tile>
  );
};