"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { useServicesCache } from '@/hooks/useHomepageCaching';
import styles from '../styles/homepage.module.css';

interface ServiceItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  link?: string;
}

interface ServicesSectionProps {
  locale?: 'ne' | 'en';
  limit?: number;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ locale = 'en', limit = 6 }) => {
  const t = useTranslations('homepage.services');
  const { data: services = [], isLoading, isError } = useServicesCache();

  // Helper function to safely extract text values that might be objects with {en, ne} keys
  const getLocalizedText = (text: any, fallback: string = ''): string => {
    if (typeof text === 'string') {
      return text;
    }
    if (text && typeof text === 'object') {
      // Handle case where text is {en: "...", ne: "..."}
      if (locale === 'ne' && text.ne) {
        return text.ne;
      }
      if (locale === 'en' && text.en) {
        return text.en;
      }
      // Fallback to any available text
      return text.ne || text.en || fallback;
    }
    return fallback;
  };

  if (isLoading) {
    return (
      <section className={styles.servicesSection} suppressHydrationWarning>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{getLocalizedText(t('title'))}</h2>
            <p className={styles.sectionDescription} suppressHydrationWarning>{getLocalizedText(t('loading'))}</p>
          </div>
          <div className={styles.servicesGrid}>
            {[...Array(limit)].map((_, index) => (
              <div key={index} className={styles.serviceCardSkeleton}>
                <div className={styles.serviceIconSkeleton}></div>
                <div className={styles.serviceTitleSkeleton}></div>
                <div className={styles.serviceDescriptionSkeleton}></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || !services.length) {
    return (
      <section className={styles.servicesSection} suppressHydrationWarning>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{getLocalizedText(t('title'))}</h2>
            <p className={styles.sectionDescription} suppressHydrationWarning>Unable to load services</p>
          </div>
        </div>
      </section>
    );
  }

  const displayServices = services.slice(0, limit);

  return (
    <section className={styles.servicesSection} suppressHydrationWarning>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {getLocalizedText(t('title'))}
          </h2>
          <p className={styles.sectionDescription} suppressHydrationWarning>
            {getLocalizedText(t('description'))}
          </p>
        </div>
        
        <div className={styles.servicesGrid} suppressHydrationWarning>
          {displayServices.map((service) => (
            <div key={service.id} className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                {service.icon}
              </div>
              <h3 className={styles.serviceTitle}>
                {service.title[locale] || service.title.en}
              </h3>
              <p className={styles.serviceDescription}>
                {service.description[locale] || service.description.en}
              </p>
              <button className={styles.serviceButton}>
                {getLocalizedText(t('learn_more'))}
              </button>
            </div>
          ))}
        </div>
        
        <div className={styles.sectionFooter}>
          <button className={styles.viewAllButton}>
            {getLocalizedText(t('view_all'))}
          </button>
        </div>
      </div>
    </section>
  );
};