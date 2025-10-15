"use client";

import React from "react";
import { FooterBottomProps } from "../types/footer";
import { useFooterLocalization } from "../hooks/useFooter";
import {
  Location,
  Email,
  Phone,
  LogoFacebook,
  LogoTwitter,
  Chat,
} from "@carbon/icons-react";
import { Button, Grid, Column } from "@carbon/react";
import styles from "../styles/footer.module.css";

export function FooterBottom({ data, locale }: FooterBottomProps) {
  const { getText } = useFooterLocalization(locale);

  if (!data) return null;

  const { contactInfo } = data;

  const currentYear = new Date().getFullYear();
  const displayYear = isNepaliLocale(locale)
    ? toNepaliDigits(String(currentYear))
    : String(currentYear);

  // Helper function to render contact items
  const renderContactItem = (
    icon: React.ReactNode,
    content: string | string[],
    className?: string
  ) => {
    if (Array.isArray(content)) {
      return content.map((item, index) => (
        <div
          key={index}
          className={`${styles.footerContactItem} ${className || ""}`}
        >
          <span className={styles.footerContactIcon}>{icon}</span>
          <span className={styles.footerContactText}>{item}</span>
        </div>
      ));
    }

    return (
      <div className={`${styles.footerContactItem} ${className || ""}`}>
        <span className={styles.footerContactIcon}>{icon}</span>
        <span className={styles.footerContactText}>{content}</span>
      </div>
    );
  };

  return (
    <div className={styles.footerBottom}>
      {/* Top: existing contact and social content */}
      <div className={styles.footerBottomTop}>
        <Grid className={styles.footerBottomContainer}>
          <Column sm={4} md={8} lg={12} className={styles.footerBottomContent}>
            <div className={styles.footerInfoRow}>
              <div className={styles.footerContactInfoInline}>
                {/* Address */}
                {contactInfo.address && (
                  <div className={styles.footerContactItem}>
                    <Location size={18} className={styles.footerContactIcon} />
                    <span className={styles.footerContactText}>
                      {getText(contactInfo.address)}
                    </span>
                  </div>
                )}
                {/* Email Addresses */}
                {contactInfo.emails &&
                  contactInfo.emails.length > 0 && (
                    <div className={styles.footerContactItem}>
                      <Email size={18} className={styles.footerContactIcon} />
                      <span className={styles.footerContactText}>
                        {contactInfo.emails.join(", ")}
                      </span>
                    </div>
                  )}
                {/* Phone Numbers */}
                {contactInfo.phones &&
                  contactInfo.phones.length > 0 && (
                    <div className={styles.footerContactItem}>
                      <Phone size={18} className={styles.footerContactIcon} />
                      <span className={styles.footerContactText}>
                        {isNepaliLocale(locale)
                          ? toNepaliDigits(contactInfo.phones.join(", "))
                          : contactInfo.phones.join(", ")}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </Column>
          <Column className={styles.footerContactInfoInline}>
            <div className={styles.footerSocialMediaRight}>
              {contactInfo.socialMedia.facebook && (
                <a
                  href={contactInfo.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerSocialLink}
                  aria-label="Facebook"
                >
                  <LogoFacebook size={20} />
                </a>
              )}
              {contactInfo.socialMedia.twitter && (
                <a
                  href={contactInfo.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerSocialLink}
                  aria-label="Twitter"
                >
                  <LogoTwitter size={20} />
                </a>
              )}
              {contactInfo.socialMedia.twitter && (
                <a
                  href={contactInfo.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerSocialLink}
                  aria-label="Twitter"
                >
                  <LogoTwitter size={20} />
                </a>
              )}
            </div>
          </Column>
        </Grid>
      </div>

      {/* Bottom: copyright, last updated, developed by */}
      <div className={styles.footerBottomBar}>
        <div className={styles.footerBottomContainer}>
          <div className={styles.footerBottomLeft}>
            <div className={styles.footerCopyright}>
              © {displayYear} {getText(data.officeInfo.officeName || { en: "", ne: "" })}
            </div>

            {/* Static 'Last updated' date: use today's date (static) and show Nepali date too */}
            <div className={styles.footerLastUpdated}>
              {/* {`Last updated: 14 Oct 2025`}
              <span className={styles.footerLastUpdatedNepali}>
                {` (पछिल्लो अपडेट: ${toNepaliDate(new Date(2025, 9, 14))})`}
              </span> */}
              {isNepaliLocale(locale) ? (
                <>
                  <span className={styles.footerLastUpdatedNepali}>
                {` पछिल्लो अपडेट: ${toNepaliDate(new Date(2025, 9, 14))}`}
              </span> 
                </>
              ) : (
                <>
                  {`Last updated: 14 Oct 2025`}
                </>
              )}
            </div>

            <div className={styles.footerDevelopedBy}>
              {isNepaliLocale(locale) ? (
                <>
                  <span>{"निन्जा इन्फोसिस द्वारा विकसित"}</span>
                </>
              ) : (
                <>
                  <span>{"Developed by Ninja Infosys"}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function toNepaliDate(date: Date) {
  if (
    date.getFullYear() === 2025 &&
    date.getMonth() === 9 && // October (0-based)
    date.getDate() === 14
  ) {
    // Return Nepali date with Nepali digits
    return `${toNepaliDigits("28")} आश्विन ${toNepaliDigits("2082")}`;
  }

  const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  const dd = String(date.getDate())
    .split("")
    .map((d) => nepaliDigits[Number(d)])
    .join("");
  const mm = String(date.getMonth() + 1)
    .split("")
    .map((d) => nepaliDigits[Number(d)])
    .join("");
  const yyyy = String(date.getFullYear())
    .split("")
    .map((d) => nepaliDigits[Number(d)])
    .join("");
  return `${dd}/${mm}/${yyyy}`;
}

function isNepaliLocale(locale?: string) {
  if (!locale) return false;
  const normalized = locale.trim().toLowerCase();
  return normalized === "ne" || normalized === "/ne" || normalized === "ne-np";
}

// Convert ASCII digits in a string to Nepali digits
function toNepaliDigits(input: string) {
  const map: Record<string, string> = {
    "0": "०",
    "1": "१",
    "2": "२",
    "3": "३",
    "4": "४",
    "5": "५",
    "6": "६",
    "7": "७",
    "8": "८",
    "9": "९",
  };

  return input.replace(/[0-9]/g, (d) => map[d] || d);
}
