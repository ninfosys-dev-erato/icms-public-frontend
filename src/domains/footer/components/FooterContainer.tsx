"use client";

import { useTranslations } from "next-intl";
import { FooterProps } from "../types/footer";
import { useFooterDataQuery } from "../hooks/useFooterQuery";
import { FooterTop } from "./FooterTop";
import { FooterMain } from "./FooterMain";
import { FooterBottom } from "./FooterBottom";
import styles from "../styles/footer.module.css";

export function FooterContainer({ locale, className = "" }: FooterProps) {
  const { data, isLoading, error } = useFooterDataQuery(locale);

  // Show loading state
  if (isLoading || !data) {
    return (
      <footer className={`${styles.footerContainer} ${className}`}>
        <div style={{ padding: "2rem", textAlign: "center", color: "#ffffff" }}>
          Loading footer...
        </div>
      </footer>
    );
  }

  // Error state - show minimal footer
  if (error) {
    console.error("Footer error:", error);
    return (
      <footer className={`${styles.footerContainer} ${className}`}>
        <div className={styles.footerTop}>
          <div className={styles.footerTopContainer}>
            <div className={styles.footerTopBranding}>
              <div className={styles.footerTopLogo} aria-hidden="true" />
              <div className={styles.footerTopText}>
                <h1 className={styles.footerTopTitle}>
                  {locale === "ne"
                    ? "सूचना प्रविधि विभाग"
                    : "Department of Information Technology"}
                </h1>
              </div>
              <div className={styles.footerTopLogo} aria-hidden="true" />
            </div>
          </div>
        </div>
        
      </footer>
    );
  }

  return (
    <footer className={`${styles.footerContainer} ${className}`}>
      <FooterMain data={data} locale={locale} />
      <FooterBottom data={data} locale={locale} />
    </footer>
  );
}
