"use client";

import React, { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useDebounce } from '@/hooks/useDebounce';
import styles from './notices.module.css';

interface NoticeFiltersProps {
  search: string;
  onSearch: (search: string) => void;
  selectedTypes: string[];
  onTypeSelection: (types: string[]) => void;
  selectedPriorities: string[];
  onPrioritySelection: (priorities: string[]) => void;
  allTypes: string[];
  allPriorities: string[];
  totalNotices: number;
  locale: 'en' | 'ne';
}

export const NoticeFilters: React.FC<NoticeFiltersProps> = ({
  search,
  onSearch,
  selectedTypes,
  onTypeSelection,
  selectedPriorities,
  onPrioritySelection,
  allTypes,
  allPriorities,
  totalNotices,
  locale
}) => {
  const t = useTranslations('notices');
  const [localSearch, setLocalSearch] = useState(search);

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(localSearch, 300);

  // Update search when debounced value changes
  React.useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  // Handle type toggle
  const handleTypeToggle = useCallback((type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    onTypeSelection(newTypes);
  }, [selectedTypes, onTypeSelection]);

  // Handle priority toggle
  const handlePriorityToggle = useCallback((priority: string) => {
    const newPriorities = selectedPriorities.includes(priority)
      ? selectedPriorities.filter(p => p !== priority)
      : [...selectedPriorities, priority];
    onPrioritySelection(newPriorities);
  }, [selectedPriorities, onPrioritySelection]);

  // Handle reset filters
  const handleResetFilters = useCallback(() => {
    setLocalSearch('');
    onSearch('');
    onTypeSelection([]);
    onPrioritySelection([]);
  }, [onSearch, onTypeSelection, onPrioritySelection]);

  return (
    <div className={styles.filtersSection}>
      <div className={styles.filtersHeader}>
        <h2 className={styles.filtersTitle}>{t('filtersTitle')}</h2>
        <span className={styles.noticeCount}>
          {t('noticeCount', { count: totalNotices })}
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

        {/* Types Filter */}
        {allTypes.length > 0 && (
          <div className={styles.typesFilter}>
            <label className={styles.typesLabel}>
              {t('types')}
            </label>
            <div className={styles.typesContainer}>
              {allTypes.map((type, index) => (
                <button
                  key={type || `type-${index}`}
                  type="button"
                  onClick={() => handleTypeToggle(type)}
                  className={`${styles.typeButton} ${
                    selectedTypes.includes(type) ? styles.typeButtonActive : ''
                  }`}
                >
                  {type ? t(`type.${type}`) : type || 'Unknown'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Priorities Filter */}
        {allPriorities.length > 0 && (
          <div className={styles.prioritiesFilter}>
            <label className={styles.prioritiesLabel}>
              {t('priorities')}
            </label>
            <div className={styles.prioritiesContainer}>
              {allPriorities.map((priority, index) => (
                <button
                  key={priority || `priority-${index}`}
                  type="button"
                  onClick={() => handlePriorityToggle(priority)}
                  className={`${styles.priorityButton} ${
                    selectedPriorities.includes(priority) ? styles.priorityButtonActive : ''
                  }`}
                >
                  {priority ? t(`priority.${priority}`) : priority || 'Normal'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reset Filters */}
        {(localSearch || selectedTypes.length > 0 || selectedPriorities.length > 0) && (
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
