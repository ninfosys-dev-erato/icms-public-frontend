"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import styles from './notices.module.css';

interface NoticePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  locale: 'en' | 'ne';
}

export const NoticePagination: React.FC<NoticePaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onLimitChange,
  locale
}) => {
  const t = useTranslations('notices');

  // Calculate pagination info
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show current page with context
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Available page sizes
  const pageSizeOptions = [12, 20, 40, 60];

  return (
    <div className={styles.paginationSection}>
      <div className={styles.paginationInfo}>
        <span className={styles.paginationText}>
          {t('showing', { 
            from: startItem, 
            to: endItem, 
            total: totalItems 
          })}
        </span>
        
        <div className={styles.pageSizeSelector}>
          <label htmlFor="pageSize" className={styles.pageSizeLabel}>
            {t('itemsPerPage')}:
          </label>
          <select
            id="pageSize"
            value={itemsPerPage}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className={styles.pageSizeSelect}
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {totalPages > 1 && (
        <div className={styles.paginationControls}>
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${styles.paginationButton} ${styles.previousButton}`}
            aria-label={t('previous')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M10.5 12.5L5.5 8l5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
            {t('previous')}
          </button>

          {/* Page Numbers */}
          <div className={styles.pageNumbers}>
            {pageNumbers.map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className={styles.pageEllipsis}>...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(page as number)}
                    className={`${styles.pageButton} ${
                      page === currentPage ? styles.pageButtonActive : ''
                    }`}
                    aria-label={`${t('page')} ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${styles.paginationButton} ${styles.nextButton}`}
            aria-label={t('next')}
          >
            {t('next')}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5.5 3.5l5 4.5-5 4.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
          </button>
        </div>
      )}

      <div className={styles.paginationSummary}>
        <span className={styles.pageSummary}>
          {t('page', { page: currentPage, total: totalPages })}
        </span>
      </div>
    </div>
  );
};
