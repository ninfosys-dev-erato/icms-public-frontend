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
                contactInfo.emails.length > 0 &&
                <div className={styles.footerContactItem}>
                  <Email size={18} className={styles.footerContactIcon} />
                  <span className={styles.footerContactText}>
                    {(contactInfo.emails)}
                  </span>
                </div>
              }
              {/* Phone Numbers */}
              {contactInfo.phones &&
                contactInfo.phones.length > 0 &&
                <div className={styles.footerContactItem}>
                  <Phone size={18} className={styles.footerContactIcon} />
                  <span className={styles.footerContactText}>
                    {(contactInfo.phones)}
                  </span>
                </div>
                }
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
          </div>
        </Column>
      </Grid>
    </div>
  );
}
