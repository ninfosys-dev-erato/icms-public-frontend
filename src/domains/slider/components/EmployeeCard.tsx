"use client";

import React from 'react';
import Image from 'next/image';
import { Employee } from '../types/employee';
import styles from '../styles/slider.module.css';

interface EmployeeCardProps {
  employee: Employee;
  locale: 'ne' | 'en';
  className?: string;
}

export function EmployeeCard({ employee, locale, className = '' }: EmployeeCardProps) {
  // Ensure locale has a valid value
  const safeLocale = (locale === 'ne' ? 'ne' : 'en') as 'ne' | 'en';
  
  const getLocalizedText = (entity: { ne: string; en: string }): string => {
    if (!entity) {
      return 'N/A';
    }
    // First try the requested locale, then fallback to the other locale
    if (safeLocale === 'ne' && entity.ne) {
      return entity.ne;
    }
    if (safeLocale === 'en' && entity.en) {
      return entity.en;
    }
    // Final fallback
    return entity.en || entity.ne || 'N/A';
  };

  const formatContactInfo = (): {
    primary: string;
    secondary?: string;
  } => {
    const contact = {
      primary: '',
      secondary: ''
    };

    // Check if the employee has contact information
    if (employee.mobileNumber) {
      contact.primary = employee.mobileNumber;
      if (employee.telephone) {
        contact.secondary = employee.telephone;
      }
    } else if (employee.telephone) {
      contact.primary = employee.telephone;
    }

    if (employee.roomNumber && contact.primary) {
      contact.primary += ` (Room: ${employee.roomNumber})`;
    }

    return contact;
  };

  const getPhotoUrl = (): string | null => {
    // Use the presignedUrl from the employee object (not from photo)
    if (employee.presignedUrl) {
      return employee.presignedUrl;
    }
    if (employee.photo?.url) {
      return employee.photo.url;
    }
    return null;
  };

  const contactInfo = formatContactInfo();
  const photoUrl = getPhotoUrl();

  return (
    <div className={`${styles.employeeCard} ${className}`}>
      <div className={styles.employeeCardContent}>
        {/* Employee Avatar - Centered */}
        <div className={styles.employeeCardAvatar}>
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={getLocalizedText(employee.name)}
              width={80}
              height={80}
              className={styles.employeeCardImage}
              sizes="(max-width: 768px) 50px, (max-width: 1024px) 70px, 80px"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove(styles.hidden);
              }}
            />
          ) : null}
          {/* Fallback placeholder */}
          <div className={`${styles.employeeCardPlaceholderAvatar} ${photoUrl ? styles.hidden : ''}`}>
            <div className={styles.employeeCardInitials}>
              {getLocalizedText(employee.name)
                .split(' ')
                .map(name => name.charAt(0))
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </div>
          </div>
        </div>

        {/* Employee Information - Centered below photo */}
        <div className={styles.employeeCardInfo}>
          <div className={styles.employeeCardName}>
            {getLocalizedText(employee.name)}
          </div>
          <div className={styles.employeeCardTitle}>
            {employee.position ? getLocalizedText(employee.position) : 'Employee'}
          </div>
          {employee.department && (
            <div className={styles.employeeCardDepartment}>
              {getLocalizedText(employee.department.departmentName)}
            </div>
          )}
          
          {/* Contact Information - Left-aligned within centered container */}
          <div className={styles.employeeCardContactSection}>
            {contactInfo.primary && (
              <div className={styles.employeeCardContact}>
                <svg className={styles.employeeCardContactIcon} width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M26 29h-2v-3a7.0081 7.0081 0 0 0-7-7H9a7.0081 7.0081 0 0 0-7 7v3H0V26a9.01 9.01 0 0 1 9-9h8a9.01 9.01 0 0 1 9 9zM13 8a5 5 0 1 1-5 5A5 5 0 0 1 13 8m0-2a7 7 0 1 0 7 7A7 7 0 0 0 13 6z"/>
                  <circle cx="24" cy="8" r="2"/>
                  <path d="m30 12.76l-6-2v4.48l6-2z"/>
                </svg>
                <span className={styles.employeeCardContactText}>{contactInfo.primary}</span>
              </div>
            )}
            {contactInfo.secondary && (
              <div className={styles.employeeCardContactSecondary}>
                <svg className={styles.employeeCardContactIcon} width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M26 29h-2v-3a7.0081 7.0081 0 0 0-7-7H9a7.0081 7.0081 0 0 0-7 7v3H0V26a9.01 9.01 0 0 1 9-9h8a9.01 9.01 0 0 1 9 9zM13 8a5 5 0 1 1-5 5A5 5 0 0 1 13 8m0-2a7 7 0 1 0 7 7A7 7 0 0 0 13 6z"/>
                  <circle cx="24" cy="8" r="2"/>
                  <path d="m30 12.76l-6-2v4.48l6-2z"/>
                </svg>
                <span className={styles.employeeCardContactText}>{contactInfo.secondary}</span>
              </div>
            )}
            {employee.email && (
              <div className={styles.employeeCardEmail}>
                <svg className={styles.employeeCardContactIcon} width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M28 6H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm-2.2 2L16 14.78 6.2 8zM4 24V9.91l11.43 7.91a1 1 0 0 0 1.14 0L28 9.91V24z"/>
                </svg>
                <span className={styles.employeeCardContactText}>{employee.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
