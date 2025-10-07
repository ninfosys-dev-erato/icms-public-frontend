"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { Employee } from '../types';
import styles from './hr.module.css';

interface EmployeeCardProps {
  employee: Employee;
  locale: 'en' | 'ne';
  departmentName: any;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ 
  employee, 
  locale, 
  departmentName 
}) => {
  const getDisplayName = () => {
    return locale === 'ne' ? employee.name.ne : employee.name.en;
  };

  const getDisplayPosition = () => {
    return locale === 'ne' ? employee.position.ne : employee.position.en;
  };

  return (
    <div className={styles.employeeCard}>
      <div className={styles.employeePhotoContainer}>
        {employee.photoPresignedUrl ? (
          <img
            src={employee.photoPresignedUrl}
            alt={getDisplayName()}
            className={styles.employeePhoto}
            loading="lazy"
          />
        ) : (
          <div className={styles.employeePhotoPlaceholder}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        )}
      </div>
      
      <div className={styles.employeeInfo}>
        <h3 className={styles.employeeName}>
          {getDisplayName()}
        </h3>
        <p className={styles.employeePosition}>
          {getDisplayPosition()}
        </p>
      </div>
    </div>
  );
};
