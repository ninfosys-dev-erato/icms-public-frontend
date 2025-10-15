"use client";

import React from "react";
import { Grid, Column, Link } from "@carbon/react";
import { FooterMainProps } from "../types/footer";
import { useFooterLocalization } from "../hooks/useFooter";
import styles from "../styles/footer.module.css";

export function FooterMain({ data, locale }: FooterMainProps) {
  const { getText } = useFooterLocalization(locale);

  if (!data) return null;

  const { officeHours, importantLinks } = data;
  const officeInfo = data.officeInfo || null;
  // mapIframe may exist on backend OfficeSettings but not declared in FooterData.officeInfo
  const mapIframe: string | undefined = (officeInfo as any)?.mapIframe;
  // Try to extract an iframe src from the provided HTML snippet (or accept a raw URL)
  const iframeSrc: string | undefined = (() => {
    if (!mapIframe) return undefined;

    // Normalize common encodings that can appear when JSON/string-escaped
    let normalized = String(mapIframe);

    // Convert unicode-escaped characters like \u003C and \u003E to < and >
    normalized = normalized.replace(/\\u003C/g, '<').replace(/\\u003E/g, '>');

    // Convert HTML entities if present
    normalized = normalized.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');

    // Remove backslash-escapes for quotes (e.g. \" -> ") which can happen when the string was double-escaped
    normalized = normalized.replace(/\\"/g, '"').replace(/\\'/g, "'");

    // Try to extract src attribute from normalized HTML
    const srcMatch = normalized.match(/src=["']([^"']+)["']/i);
    if (srcMatch) return srcMatch[1];

    // If the backend returned just a URL string, accept it
    if (/^https?:\/\//i.test(normalized.trim())) return normalized.trim();

    return undefined;
  })();

  // Debug: log iframe data so we can inspect at runtime (remove in production)
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug('Footer mapIframe debug:', { mapIframe, iframeSrc });
  }

  // Helper function to render links in columns
  // const renderLinksColumn = (links: any[], title: string) => {
  const renderLinksColumn = (links: any[]) => {
    if (!links || links.length === 0) return null;
    return (
      <div className={styles.footerLinksColumn}>
        {/* <h3 className={styles.footerLinksTitle}>{title}</h3> */}
        <ul className={styles.footerLinksList}>
          {links
            .filter((link) => link.isActive)
            .sort((a, b) => a.order - b.order)
            .map((link) => (
              <li key={link.id} className={styles.footerLinksItem}>
                <Link
                  href={link.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerLink}
                >
                  {getText(link.linkTitle)}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    );
  };

  return (
    <div className={styles.footerMain}>
      <Grid className={styles.footerMainContainer}>
        {/* Office Hours Section */}
        <Column className={styles.footerOfficeHours}>
          <h3 className={styles.footerSectionTitle}>
            {locale === "ne" ? "कार्यालय समय" : "Office Hours"}
          </h3>
          <div className={styles.footerOfficeHoursGrid}>
            {/* Winter Schedule */}
            <div className={styles.footerOfficeHoursSeason}>
              <h4 className={styles.footerOfficeHoursSeasonTitle}>
                {locale === "ne"
                  ? "जाडो (कार्तिक १६ देखि माघ १५)"
                  : "Winter (Kartik 16 - Magh 15)"}
              </h4>
              <div className={styles.footerOfficeHoursSchedule}>
                <div className={styles.footerOfficeHoursDay}>
                  <span className={styles.footerOfficeHoursDayName}>
                    {locale === "ne" ? "आइतबार - बिहीबार" : "Sunday - Thursday"}
                  </span>
                  <span className={styles.footerOfficeHoursTime}>
                    {officeHours.winter.sundayToThursday}
                  </span>
                </div>
                <div className={styles.footerOfficeHoursDay}>
                  <span className={styles.footerOfficeHoursDayName}>
                    {locale === "ne" ? "शुक्रबार" : "Friday"}
                  </span>
                  <span className={styles.footerOfficeHoursTime}>
                    {officeHours.winter.friday}
                  </span>
                </div>
              </div>
            </div>
            {/* Summer Schedule */}
            <div className={styles.footerOfficeHoursSeason}>
              <h4 className={styles.footerOfficeHoursSeasonTitle}>
                {locale === "ne"
                  ? "गर्मी (माघ १६ देखि कार्तिक १५)"
                  : "Summer (Magh 16 - Kartik 15)"}
              </h4>
              <div className={styles.footerOfficeHoursSchedule}>
                <div className={styles.footerOfficeHoursDay}>
                  <span className={styles.footerOfficeHoursDayName}>
                    {locale === "ne" ? "आइतबार - बिहीबार" : "Sunday - Thursday"}
                  </span>
                  <span className={styles.footerOfficeHoursTime}>
                    {officeHours.summer.sundayToThursday}
                  </span>
                </div>
                <div className={styles.footerOfficeHoursDay}>
                  <span className={styles.footerOfficeHoursDayName}>
                    {locale === "ne" ? "शुक्रबार" : "Friday"}
                  </span>
                  <span className={styles.footerOfficeHoursTime}>
                    {officeHours.summer.friday}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Column>
        {/* Important Links Section */}
        <Column className={styles.footerImportantLinks}>
          <h3 className={styles.footerSectionTitle}>
            {locale === "ne" ? "महत्त्वपूर्ण लिङ्कहरू" : "Important Links"}
          </h3>
          <div className={styles.footerLinksGrid}>
            {renderLinksColumn(
              importantLinks.governmentLinks,
              // locale === "ne" ? "सरकारी मन्त्रालयहरू" : "Government Ministries"
            )}
            {renderLinksColumn(importantLinks.quickLinks)}
          </div>
        </Column>
        {/* Map / Location Section */}
        <Column className={styles.footerMapLocation}>
          <h3 className={styles.footerSectionTitle}>
            {locale === 'ne' ? 'स्थान' : 'Location'}
          </h3>
          <div className={styles.footerMapWrapper}>
            {iframeSrc ? (
              <div className={styles.footerMapIframe}>
                <iframe
                  src={iframeSrc}
                  title={locale === 'ne' ? 'कार्यालय नक्सा' : 'Office map'}
                  width="100%"
                  height={250}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ border: 0 }}
                />
              </div>
            ) : mapIframe ? (
              // As a last resort, if mapIframe exists but we couldn't extract a src,
              // render the provided HTML snippet (keeps previous behavior).
              // eslint-disable-next-line @next/next/no-danger
              <div
                className={styles.footerMapIframe}
                dangerouslySetInnerHTML={{ __html: mapIframe }}
              />
            ) : officeInfo?.address ? (
              // Embed Google Maps iframe using the office address (fallback when backend iframe not provided)
              <div className={styles.footerMapIframe}>
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    locale === 'ne' ? officeInfo.address.ne : officeInfo.address.en
                  )}&output=embed`}
                  title={locale === 'ne' ? 'कार्यालय नक्सा' : 'Office map'}
                  width="100%"
                  height={360}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ border: 0 }}
                />
              </div>
            ) : (
              <p className={styles.footerNoMap}>
                {locale === 'ne' ? 'नक्सा उपलब्ध छैन' : 'Map not available'}
              </p>
            )}
          </div>
        </Column>
      </Grid>
    </div>
  );
}
