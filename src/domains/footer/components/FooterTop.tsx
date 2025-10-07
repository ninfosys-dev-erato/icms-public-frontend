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
          {/* Left Logo */}
          <div className={styles.footerTopLogo}>
            <img 
              src={getLogoUrl(officeInfo.leftLogo)} 
              alt="Left Logo"
              className={styles.footerTopEmblem}
              onError={(e) => console.error('Left logo failed to load:', officeInfo.leftLogo, e)}
            />
          </div>
          
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
          
          {/* Right Logo */}
          <div className={styles.footerTopLogo}>
            <img 
              src={getLogoUrl(officeInfo.rightLogo)} 
              alt="Right Logo"
              className={styles.footerTopEmblem}
              onError={(e) => console.error('Right logo failed to load:', officeInfo.rightLogo, e)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
