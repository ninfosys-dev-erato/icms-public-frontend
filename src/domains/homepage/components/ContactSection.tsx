"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import styles from '../styles/homepage.module.css';

interface ContactSectionProps {
  locale?: 'ne' | 'en';
}

export const ContactSection: React.FC<ContactSectionProps> = ({ locale = 'en' }) => {
  const t = useTranslations('homepage.contact');
  
  return (
    <section className={styles.contactSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {t('title')}
          </h2>
          <p className={styles.sectionDescription}>
            {t('description')}
          </p>
        </div>

        <div className={styles.contactGrid}>
          <div className={styles.contactCard}>
            <div className={styles.contactIcon}>📍</div>
            <h3 className={styles.contactCardTitle}>
              {t('office_address')}
            </h3>
            <div className={styles.contactCardContent}>
              <p>कुटीर तथा साना उद्योग कार्यालय</p>
              <p>डडेल्धुरा, नेपाल</p>
              <p>सुदूरपश्चिम प्रदेश</p>
            </div>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.contactIcon}>📞</div>
            <h3 className={styles.contactCardTitle}>
              {t('phone_numbers')}
            </h3>
            <div className={styles.contactCardContent}>
              <p>संपर्क नम्बर: ०९१-५२०६७५</p>
              <p>फ्याक्स: ०९१-५२०६७६</p>
              <p>मोबाइल: +९७७-९८४३२१०९८७</p>
            </div>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.contactIcon}>✉️</div>
            <h3 className={styles.contactCardTitle}>
              {t('email_address')}
            </h3>
            <div className={styles.contactCardContent}>
              <p>pcggbanke@gmail.com</p>
              <p>info@csiodadeldhura.gov.np</p>
            </div>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.contactIcon}>⏰</div>
            <h3 className={styles.contactCardTitle}>
              {t('office_hours')}
            </h3>
            <div className={styles.contactCardContent}>
              <p>आइतबार - बिहिबार: १०:०० - १७:००</p>
              <p>शुक्रबार: १०:०० - १५:००</p>
              <p>शनिबार: बन्द</p>
            </div>
          </div>
        </div>

        <div className={styles.sectionFooter}>
          <button className={styles.primaryButton}>
            {t('get_directions')}
          </button>
        </div>
      </div>
    </section>
  );
};