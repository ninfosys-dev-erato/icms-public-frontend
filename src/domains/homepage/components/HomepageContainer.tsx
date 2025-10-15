"use client";

import React, { Suspense } from "react";
import { useLocale, useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import {
  HeroSection,
  GallerySection,
  ContactSection,
} from "./";
import { EmployeeSection, useHomepageEmployees } from '@/domains/employees';
import styles from "../styles/homepage.module.css";

// Dynamically import notices section to prevent SSR hydration issues
const NoticesSection = dynamic(
  () => import("@/domains/notices/components/NoticesSection").then((mod) => ({ default: mod.NoticesSection })),
  { 
    ssr: false,
    loading: () => {
      const LoadingNotices = () => {
        const t = useTranslations('notices');
        return (
          <section style={{ 
            background: '#f4f4f4', 
            padding: '4rem 0', 
            textAlign: 'center', 
            color: '#161616',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{t('title')}</h2>
              <p>{t('loading')}</p>
            </div>
          </section>
        );
      };
      return <LoadingNotices />;
    }
  }
);

  // Dynamically import IntroductionSection as a client-only component to avoid
  // hydration mismatches coming from third-party UI libraries that render
  // different markup between server and client (e.g. Carbon Grid).
  const IntroductionSection = dynamic(
    () => import("./IntroductionSection").then((mod) => ({ default: mod.IntroductionSection })),
    {
      ssr: false,
      loading: () => (
        <section style={{ minHeight: 220 }} aria-hidden>
          {/* minimal placeholder while client loads */}
        </section>
      ),
    }
  );

interface HomepageContainerProps {
  // No props needed - components now fetch their own data
}

export const HomepageContainer: React.FC<HomepageContainerProps> = () => {
  // Use Next.js locale hook
  const locale = useLocale() as "en" | "ne";
  const { data: homepageEmployees, isLoading } = useHomepageEmployees();

  return (
    <div className={styles.homepage}>
      {/* Hero Section with Slider and Employee Cards */}
      <HeroSection locale={locale} />

      {/* Introduction Section */}
      <IntroductionSection locale={locale} />

      {/* Gallery Section - Replaces Services Section */}
      <GallerySection locale={locale} limit={6} />


      {/* Employees Section Above Footer */}
      {!isLoading && homepageEmployees.showDownInHomepage.length > 0 && (
        <EmployeeSection
          employees={homepageEmployees.showDownInHomepage}
          locale={locale}
        />
      )}

      {/* Contact Section
      <ContactSection locale={locale} /> */}
    </div>
  );
};
