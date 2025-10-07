"use client";

import React, { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useDebounce } from '@/hooks/useDebounce';
import styles from './gallery.module.css';

interface GalleryFiltersProps {
  search: string;
  onSearch: (search: string) => void;
  selectedTags: string[];
  onTagSelection: (tags: string[]) => void;
  allTags: string[];
  totalPhotos: number;
  locale: 'en' | 'ne';
}

export const GalleryFilters: React.FC<GalleryFiltersProps> = ({
  search,
  onSearch,
  selectedTags,
  onTagSelection,
  allTags,
  totalPhotos,
  locale
}) => {
  const t = useTranslations('media.gallery');
  const [localSearch, setLocalSearch] = useState(search);
  
  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(localSearch, 300);

  // Update search when debounced value changes
  React.useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  // Handle tag toggle
  const handleTagToggle = useCallback((tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onTagSelection(newTags);
  }, [selectedTags, onTagSelection]);

  // Handle reset filters
  const handleResetFilters = useCallback(() => {
    setLocalSearch('');
    onSearch('');
    onTagSelection([]);
  }, [onSearch, onTagSelection]);

  return (
    <div className={styles.filtersSection}>
      <div className={styles.filtersHeader}>
        <h2 className={styles.filtersTitle}>{t('filtersTitle')}</h2>
        <span className={styles.photoCount}>
          {t('photoCount', { count: totalPhotos })}
        </span>
      </div>

      <div className={styles.filtersContent}>
        {/* Search Filter */}
        <div className={styles.searchFilter}>
          <label htmlFor="search" className={styles.searchLabel}>
            {t('search')}
          </label>
          <input
            id="search"
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className={styles.searchInput}
          />
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className={styles.tagsFilter}>
            <label className={styles.tagsLabel}>
              {t('tags')}
            </label>
            <div className={styles.tagsContainer}>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`${styles.tagButton} ${
                    selectedTags.includes(tag) ? styles.tagButtonActive : ''
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reset Filters */}
        {(localSearch || selectedTags.length > 0) && (
          <div className={styles.resetFilters}>
            <button
              type="button"
              onClick={handleResetFilters}
              className={styles.resetButton}
            >
              {t('reset')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
