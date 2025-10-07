"use client";

import React, { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useDebounce } from '@/hooks/useDebounce';
import { DepartmentWithEmployees } from '../types';
import styles from './hr.module.css';
import { Search, TextInput, Dropdown, Button, Tag } from '@carbon/react';

interface HRFiltersProps {
  search: string;
  onSearch: (search: string) => void;
  selectedDepartment: string;
  onDepartmentSelection: (departmentId: string) => void;
  position?: string;
  onPositionChange?: (position: string) => void;
  departments: DepartmentWithEmployees[];
  totalEmployees: number;
  locale: 'en' | 'ne';
}

export const HRFilters: React.FC<HRFiltersProps> = ({
  search,
  onSearch,
  selectedDepartment,
  onDepartmentSelection,
  position,
  onPositionChange,
  departments,
  totalEmployees,
  locale
}) => {
  const t = useTranslations('hr.filters');
  const [localSearch, setLocalSearch] = useState(search);
  const [localPosition, setLocalPosition] = useState(position || '');
  
  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(localSearch, 300);

  // Update search when debounced value changes
  React.useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  // Sync position changes when calling parent
  React.useEffect(() => {
    if (onPositionChange) onPositionChange(localPosition);
  }, [localPosition, onPositionChange]);

  // Handle department selection
  const handleDepartmentChange = useCallback((departmentId: string) => {
    onDepartmentSelection(departmentId);
  }, [onDepartmentSelection]);

  // Handle reset filters
  const handleResetFilters = useCallback(() => {
    setLocalSearch('');
    onSearch('');
    onDepartmentSelection('');
  setLocalPosition('');
  if (onPositionChange) onPositionChange('');
  }, [onSearch, onDepartmentSelection]);

  const getDisplayName = (department: DepartmentWithEmployees) => {
    return locale === 'ne' ? department.departmentName.ne : department.departmentName.en;
  };

  // Prepare position dropdown items and selected item
  // Build unique positions list from departments (aggregate counts)
  const positionMap = React.useMemo(() => {
    const map = new Map<string, { en: string; ne: string; count: number }>();
    departments.forEach((dept) => {
      (dept.employees || []).forEach((emp: any) => {
        const en = (emp.position?.en || '').toString().trim();
        const ne = (emp.position?.ne || '').toString().trim();
        const key = en || ne; // prefer english, fallback to nepali
        if (!key) return;
        const existing = map.get(key);
        if (existing) {
          existing.count += 1;
        } else {
          map.set(key, { en: en || ne, ne: ne || en, count: 1 });
        }
      });
    });
    return map;
  }, [departments]);

  const positionItems = React.useMemo(() => {
    const items: { id: string; label: string }[] = [];
    items.push({ id: '', label: (t('allPositions') as string) || (locale === 'ne' ? 'सबै' : 'All') });

    // add discovered positions sorted by localized label
    const positionsArray = Array.from(positionMap.entries()).map(([key, v]) => ({ id: key, label: locale === 'ne' ? v.ne : v.en, count: v.count }));
    positionsArray.sort((a, b) => a.label.localeCompare(b.label));
    positionsArray.forEach((p) => items.push({ id: p.id, label: `${p.label} (${p.count})` }));

    // custom option at the end
    items.push({ id: 'custom', label: (t('enterCustom') as string) || (locale === 'ne' ? 'अन्य दर्ज गर्नुहोस्' : 'Enter custom') });

    // If the user has typed a custom position that's not in the list, make sure it's selectable
    if (localPosition && localPosition.trim() !== '' && !items.some((it) => it.id === localPosition)) {
      items.splice(items.length - 1, 0, { id: localPosition, label: localPosition });
    }

    return items;
  }, [positionMap, localPosition, locale, t]);

  const selectedPositionItem = React.useMemo(() => {
    if (!localPosition) return positionItems[0];
    const found = positionItems.find((it) => it.id === localPosition);
    if (found) return found;
    return positionItems.find((it) => it.id === 'custom') || positionItems[0];
  }, [localPosition, positionItems]);

  return (
    <div className={styles.filtersSection}>
      <div className={styles.filtersContent}>
        {/* First row: large Carbon Search input */}
        <div className={styles.searchWrapper}>
          <Search size="lg" labelText="" placeholder="Search" value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} />
        </div>

        {/* Second row: right aligned compact filters */}
        <div className={styles.filtersRowRight}>
          {departments.length > 0 && (
              <Dropdown
                id="department-dropdown"
                size="md"
                titleText=""
                label=""
                items={[
                  { id: '', label: t('allDepartments') as string },
                  ...departments.map((department) => ({
                    id: department.id,
                    label: `${getDisplayName(department)} (${department.employees.length})`
                  }))
                ]}
                selectedItem={(() => {
                  const all = { id: '', label: t('allDepartments') as string };
                  if (!selectedDepartment) return all;
                  const found = departments.find(d => d.id === selectedDepartment);
                  return found
                    ? { id: found.id, label: `${getDisplayName(found)} (${found.employees.length})` }
                    : all;
                })()}
                itemToString={(item) => (item ? item.label : '')}
                onChange={({ selectedItem }) => handleDepartmentChange((selectedItem?.id || '') as string)}
                className={styles.departmentSelect}
              />
          )}

          <>
              <Dropdown
                id="position-dropdown"
                size="md"
                titleText=""
                label=""
                items={positionItems}
                selectedItem={selectedPositionItem}
                itemToString={(item) => (item ? item.label : '')}
                onChange={({ selectedItem }) => {
                  const id = (selectedItem?.id || '') as string;
                  if (id === 'custom') {
                    // reveal input, keep current localPosition
                    setLocalPosition(localPosition);
                  } else {
                    setLocalPosition(id);
                    if (onPositionChange) onPositionChange(id);
                  }
                }}
                className={styles.departmentSelect}
              />

            {/* Show inline TextInput when user selects custom or when typed position is not one of the discovered positions */}
            {((selectedPositionItem && selectedPositionItem.id === 'custom') || (localPosition && localPosition.trim() !== '' && !positionMap.has(localPosition))) && (
              <div style={{ marginTop: '0.5rem' }}>
                <TextInput
                  id="position"
                  labelText=""
                  value={localPosition}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalPosition(e.target.value)}
                  placeholder={t('positionPlaceholder') as string || (locale === 'ne' ? 'पद' : 'Position')}
                  size="sm"
                />
              </div>
            )}
          </>

          {( selectedDepartment || localPosition) && (
            <div className={styles.resetWrap}>
              <Button kind="ghost" onClick={handleResetFilters} className={styles.resetButton} size="md">
                {t('reset')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
