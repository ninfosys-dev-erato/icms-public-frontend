'use client';


import { useTranslations } from 'next-intl';
import { ContentAttachment } from '@/domains/content-management/types/content';
import styles from './AttachmentList.module.css';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Download } from '@carbon/icons-react';
import { Button, Tag, InlineLoading, SkeletonText } from '@carbon/react';
// import { Download } from '@carbon/icons-react';
const PDFPreview = dynamic(() => import('./PDFPreview'), { ssr: false });


// Dynamically import react-pdf for SSR compatibility
import type { FC } from 'react';
interface PDFPreviewProps {
  fileUrl: string;
}

interface AttachmentListProps {
  attachments: ContentAttachment[];
  locale: 'en' | 'ne';
}

export function AttachmentList({ attachments, locale }: AttachmentListProps) {
  const t = useTranslations('content');

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return (
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    
    if (mimeType.startsWith('video/')) {
      return (
        <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    }
    
    if (mimeType.startsWith('audio/')) {
      return (
        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      );
    }
    
    if (mimeType === 'application/pdf') {
      return (
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
    
    if (mimeType.includes('word') || mimeType.includes('document')) {
      return (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
    
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
      return (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
    }
    
    // Default file icon
    return (
      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = (attachment: ContentAttachment) => {
    if (attachment.presignedUrl) {
      // Use presigned URL for direct access
      window.open(attachment.presignedUrl, '_blank');
    } else if (attachment.downloadUrl) {
      // Use download URL as fallback
      window.open(attachment.downloadUrl, '_blank');
    }
  };

  const handlePreview = (attachment: ContentAttachment) => {
    if (attachment.presignedUrl) {
      // For images, PDFs, and some documents, we can preview
      if (attachment.mimeType.startsWith('image/') || 
          attachment.mimeType === 'application/pdf' ||
          attachment.mimeType.includes('text/')) {
        window.open(attachment.presignedUrl, '_blank');
      } else {
        // For other files, download them
        handleDownload(attachment);
      }
    } else {
      handleDownload(attachment);
    }
  };



  return (
    <div>
      {attachments.length === 0 ? (
        <InlineLoading description={t('attachments.noAttachments')} status="inactive" />
      ) : (
        attachments.map((attachment) => (
          <div key={attachment.id} style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '2rem' }}>
            {/* File Info & Preview */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600, fontSize: '1.1rem', flex: 1 }}>{attachment.fileName}</span>
              <Button
                kind="ghost"
                hasIconOnly
                iconDescription={t('attachments.download')}
                onClick={() => handleDownload(attachment)}
                style={{ marginLeft: 'auto' }}
                size="md"
                renderIcon={Download}
              />
            </div>
           
            {/* Preview Area */}
            <div style={{ margin: '8px 0' }}>
              {attachment.mimeType === 'application/pdf' ? (
                (attachment.presignedUrl || attachment.downloadUrl) ? (
                  <PDFPreview fileUrl={attachment.presignedUrl || attachment.downloadUrl} />
                ) : (
                  <Tag size="md">PDF URL missing for preview</Tag>
                )
              ) : (
                <>
                  {/* Image Preview */}
                  {attachment.mimeType.startsWith('image/') && attachment.presignedUrl && (
                    <img
                      src={attachment.presignedUrl}
                      alt={attachment.fileName}
                      style={{ maxWidth: '300px', maxHeight: '300px', marginTop: '8px', borderRadius: '4px' }}
                    />
                  )}
                  {/* Text Preview (first 500 chars) */}
                  {attachment.mimeType.startsWith('text/') && attachment.presignedUrl && (
                    <iframe
                      src={attachment.presignedUrl}
                      title={attachment.fileName}
                      style={{ maxWidth: '300px', maxHeight: '300px', marginTop: '8px', borderRadius: '4px', border: '1px solid #eee' }}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}