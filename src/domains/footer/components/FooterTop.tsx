"use client";

import React from 'react';
import { FooterTopProps } from '../types/footer';
import { useFooterLocalization } from '../hooks/useFooter';
import styles from '../styles/footer.module.css';

export function FooterTop({ data, locale }: FooterTopProps) {
  const { getText } = useFooterLocalization(locale);

  if (!data) return null;

  const { officeInfo } = data;

  // Helper function to get logo URL with fallback
  const getLogoUrl = (logoUrl?: string) => {
    return logoUrl || '/icons/nepal-emblem.svg';
  };

  return (
    <div className={styles.footerTop}>
      <div className={styles.footerTopContainer}>
        {/* Office Branding */}
        <div className={styles.footerTopBranding}>
          {/* Left Logo container (logo hidden per design; backdrop used instead) */}
          <div className={styles.footerTopLogo} aria-hidden="true" />
          
          <div className={styles.footerTopText}>
            {/* Show directorate */}
            {officeInfo.directorate && (
              <p className={styles.footerTopSubtitle}>
                {getText(officeInfo.directorate)}
              </p>
            )}
            
            {/* Show office name */}
            <h1 className={styles.footerTopTitle}>
              {officeInfo.officeName ? getText(officeInfo.officeName) : 'Office Name'}
            </h1>
            
            {/* Show address/location */}
            {officeInfo.address && (
              <p className={styles.footerTopAddress}>
                {getText(officeInfo.address)}
              </p>
            )}
          </div>
          
          {/* Right Logo container (logo hidden per design; backdrop used instead) */}
          <div className={styles.footerTopLogo} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
