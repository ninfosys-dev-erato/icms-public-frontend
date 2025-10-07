"use client";

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Close, ChevronLeft, ChevronRight } from '@carbon/icons-react';
import { GalleryPhoto } from '../types';
import styles from './gallery.module.css';

interface PhotoModalProps {
  photo: GalleryPhoto;
  photos?: GalleryPhoto[]; // Array of all photos for navigation
  currentIndex?: number; // Current photo index
  onClose: () => void;
  onDownload: () => void;
  onShare: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void; // Navigation callback
  locale: 'en' | 'ne';
}

export const PhotoModal: React.FC<PhotoModalProps> = ({
  photo,
  photos,
  currentIndex,
  onClose,
  onDownload,
  onShare,
  onNavigate,
  locale
}) => {
  const t = useTranslations('media.gallery');

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (onNavigate) {
            onNavigate('prev');
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (onNavigate) {
            onNavigate('next');
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNavigate]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Check if navigation is available
  const hasNavigation = photos && photos.length > 1 && currentIndex !== undefined;
  const canGoToPrev = hasNavigation && currentIndex > 0;
  const canGoToNext = hasNavigation && currentIndex < photos.length - 1;

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        {/* Close Button */}
        <button
          className={styles.modalCloseButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <Close size={30} />
        </button>

        {/* Navigation Arrows */}
        {hasNavigation && (
          <>
            <button
              className={`${styles.modalNavButton} ${styles.modalNavButtonLeft}`}
              onClick={() => onNavigate && onNavigate('prev')}
              disabled={!canGoToPrev}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              className={`${styles.modalNavButton} ${styles.modalNavButtonRight}`}
              onClick={() => onNavigate && onNavigate('next')}
              disabled={!canGoToNext}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Image Container */}
        <div className={styles.modalImageContainer}>
          <img
            src={photo.presignedUrl}
            alt={photo.altText || photo.originalName}
            className={styles.modalImage}
          />
        </div>

        {/* Photo Counter */}
        {hasNavigation && (
          <div className={styles.modalCounter}>
            {currentIndex + 1} / {photos.length}
          </div>
        )}

        {/* <div className={styles.modalInfo}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>
              {photo.title || photo.originalName}
            </h2>
            <div className={styles.modalActions}>
              <button
                className={styles.modalActionButton}
                onClick={onDownload}
                aria-label={t('download')}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M3 17v3a2 2 0 002 2h10a2 2 0 002-2v-3M10 11l4-4m0 0l-4-4m4 4H2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t('download')}
              </button>
              <button
                className={styles.modalActionButton}
                onClick={onShare}
                aria-label={t('share')}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t('share')}
              </button>
            </div>
          </div>

          {photo.description && (
            <div className={styles.modalDescription}>
              <p>{photo.description}</p>
            </div>
          )} */}

          {/* {photo.tags.length > 0 && (
            <div className={styles.modalTags}>
              <h4>Tags:</h4>
              <div className={styles.modalTagList}>
                {photo.tags.map((tag, index) => (
                  <span key={index} className={styles.modalTag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )} */}

          {/* <div className={styles.modalMetadata}>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>File Name:</span>
              <span className={styles.metadataValue}>{photo.originalName}</span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Size:</span>
              <span className={styles.metadataValue}>
                {(photo.size / 1024 / 1024).toFixed(1)} MB
              </span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Type:</span>
              <span className={styles.metadataValue}>{photo.contentType}</span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Created:</span>
              <span className={styles.metadataValue}>
                {new Date(photo.createdAt).toLocaleDateString(
                  locale === 'ne' ? 'ne-NP' : 'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }
                )}
              </span>
            </div>
          </div> */}
        {/* </div> */}
      </div>
    </div>
  );
};
