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
      </Grid>
    </div>
  );
}
