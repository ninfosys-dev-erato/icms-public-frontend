"use client";

import { NewsTicker } from "@/domains/news";
import LocaleSwitcher from "@/shared/components/LocaleSwitcher";
import {
  Header,
  HeaderContainer,
  HeaderGlobalBar,
  HeaderMenuButton,
  HeaderName,
  SideNav,
  SideNavItems,
  SideNavMenuItem
  , Button
} from "@carbon/react";
import { ADToBS } from "bikram-sambat-js";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";
import { useHeaderLocalization } from "../hooks/useHeader";
import styles from "../styles/header.module.css";
import { HeaderTopProps } from "../types/header";

export function HeaderTop({ data, locale }: HeaderTopProps) {
  const { getText } = useHeaderLocalization(locale);
  const t = useTranslations("navigation");

  // State for sidebar dropdown management
  const [openSideNavDropdown, setOpenSideNavDropdown] = React.useState<
    string | null
  >(null);

  // Fallback function for missing translations
  const getTranslation = (key: string, fallback: string) => {
    try {
      return t(key);
    } catch (error) {
      console.warn(`Missing translation for key: navigation.${key}`);
      return fallback;
    }
  };

  if (!data) return null;

  // Navigation data handling (same as HeaderMain)
  const navigation = data?.navigation || [];
  const getMaxBackendOrder = (items: any[]): number => {
    return items.reduce((max, item) => Math.max(max, item.order), 0);
  };

  const maxBackendOrder = getMaxBackendOrder(navigation);
  const hardcodedNavigation = [
    {
      id: "gallery",
      title: { en: "Gallery", ne: "ग्यालेरी" },
      href: "/gallery",
      order: maxBackendOrder + 1,
    },
    {
      id: "employees",
      title: { en: "Employees", ne: "कर्मचारीहरू" },
      href: "/hr",
      order: maxBackendOrder + 2,
    },
  ];

  const allNavigation = [...hardcodedNavigation, ...navigation];
  const sortedNavigation = allNavigation.sort((a, b) => a.order - b.order);

  // Simple function to check if navigation item is active
  const isItemActive = (item: any): boolean => {
    if (typeof window === "undefined") return false;
    const currentPath = window.location.pathname;
    if (item.href === currentPath) return true;
    if (item.href !== "/" && currentPath.startsWith(item.href)) return true;
    return false;
  };

  // Function to handle sidebar dropdown toggle - only one dropdown open at a time
  const handleSideNavDropdownToggle = (itemId: string) => {
    setOpenSideNavDropdown((prevOpen) => (prevOpen === itemId ? null : itemId));
  };

  const { config, contactInfo } = data;

  // Get current date in a consistent format to prevent hydration mismatch
  const currentDate = new Date();

  // Helper function to convert English numerals to Nepali numerals
  const toNepaliNumerals = (str: string) => {
    const englishToNepali: { [key: string]: string } = {
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
    return str.replace(/[0-9]/g, (digit) => englishToNepali[digit] || digit);
  };

  const formatDate = () => {
    if (locale === "ne") {
      // Convert to Nepali date (Bikram Sambat) - returns "YYYY-MM-DD" format
      return ADToBS(currentDate);
    } else {
      // English date (Gregorian calendar)
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  };

  // Function to get formatted date for display (with proper formatting)
  const getDisplayDate = () => {
    if (locale === "ne") {
      // Convert to Nepali date (Bikram Sambat) for display with "/" separator and Nepali numerals
      const nepaliDateStr = ADToBS(currentDate);
      const formattedDate = nepaliDateStr.replace(/-/g, "/");
      return `वि.सं: ${toNepaliNumerals(formattedDate)}`;
    } else {
      // English date for display
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      return `AD: ${year}/${month}/${day}`;
    }
  };

  // Helper function to get logo URL
  const getLogoUrl = (logoConfig: any) => {
    if (!logoConfig) return null;

    // Check for presigned URL first, then fallback to regular URL
    if (logoConfig.media?.presignedUrl) {
      return logoConfig.media.presignedUrl;
    }
    if (logoConfig.media?.url) {
      return logoConfig.media.url;
    }
    if (logoConfig.presignedUrl) {
      return logoConfig.presignedUrl;
    }
    if (logoConfig.url) {
      return logoConfig.url;
    }

    return null;
  };

  // Helper function to split directorate text at '|' characters and render each part separately
  const formatDirectorate = (text: string) => {
    if (!text) return null;

    // Clean the text by removing extra quotes and trimming
    let cleanText = text.trim();
    if (cleanText.startsWith('"') && cleanText.endsWith('"')) {
      cleanText = cleanText.slice(1, -1).trim();
    }

    // Split by '|' and filter out empty strings
    const parts = cleanText
      .split("|")
      .map((part) => part.trim())
      .filter((part) => part.length > 0);

    if (parts.length <= 1) {
      // No '|' found, return as single line
      return <span>{cleanText}</span>;
    }

    // Return each part on a separate line
    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && <br />}
          </React.Fragment>
        ))}
      </>
    );
  };

  // Get left logo from config first, then fallback to contactInfo
  const leftLogoUrl =
    getLogoUrl(config?.logoConfiguration?.leftLogo) ||
    getLogoUrl(contactInfo?.leftLogo);

  // Get right logo from config first, then fallback to contactInfo
  const rightLogoUrl =
    getLogoUrl(config?.logoConfiguration?.rightLogo) ||
    getLogoUrl(contactInfo?.rightLogo);

  return (
    <HeaderContainer
      render={({
        isSideNavExpanded,
        onClickSideNavExpand,
      }: {
        isSideNavExpanded: boolean;
        onClickSideNavExpand: () => void;
      }) => (
        <>
          <Header
            className={`${styles.headerTop} cds--header`}
            data-testid="government-header"
          >
            <div className={styles.headerTopContainer}>
              {/* Left Section - Government Branding */}
              <div className={`${styles.headerLeftSection} cds--header__brand`}>
                {/* Mobile Navigation Controls - Only visible on smaller screens */}

                {/* Left Logo */}
                {leftLogoUrl ? (
                  <div className={styles.headerTopLogo}>
                    <img
                      src={leftLogoUrl}
                      alt={(() => {
                        const altText =
                          config?.logoConfiguration?.leftLogo?.altText ||
                          contactInfo?.leftLogo?.altText;
                        return altText ? getText(altText) : "Left Logo";
                      })()}
                      className={`${styles.headerTopEmblem} cds--header__logo`}
                      onError={(e) =>
                        console.error(
                          "Left logo failed to load:",
                          leftLogoUrl,
                          e
                        )
                      }
                      role="img"
                      aria-label="Government Logo"
                    />
                  </div>
                ) : (
                  <div className={styles.headerTopLogo}>
                    <img
                      src="/icons/nepal-emblem.svg"
                      alt="Nepal Emblem"
                      className={`${styles.headerTopEmblem} cds--header__logo`}
                      role="img"
                      aria-label="Nepal Government Emblem"
                    />
                  </div>
                )}

                <div className={styles.headerTopText}>
                  {/* Show directorate from office settings first - this will be the headers split by '|' */}
                  {data.officeInfo?.directorate ? (
                    <p
                      className={`${styles.headerTopSubtitle} cds--type-body-02`}
                      role="text"
                      aria-label="Directorate"
                    >
                      {(() => {
                        const directorateText = getText(
                          data.officeInfo.directorate
                        );
                        const formatted = formatDirectorate(directorateText);
                        return formatted;
                      })()}
                    </p>
                  ) : (
                    config?.description && (
                      <p
                        className={`${styles.headerTopSubtitle} cds--type-body-02`}
                        role="text"
                        aria-label="Description"
                      >
                        {getText(config.description)}
                      </p>
                    )
                  )}

                  {/* Show office name from office settings second */}
                  <HeaderName prefix="" className={`${styles.headerTopTitle} `}>
                    {data.officeInfo?.officeName
                      ? getText(data.officeInfo.officeName)
                      : config?.name
                        ? getText(config.name)
                        : "Office Name"}
                  </HeaderName>

                  {/* Show address/location at the bottom */}
                  {contactInfo?.address && (
                    <p
                      className={`${styles.headerTopAddress} cds--type-body-01`}
                      role="text"
                      aria-label="Office Address"
                    >
                      {getText(contactInfo.address)}
                    </p>
                  )}
                </div>
                <div className={styles.mobileControls}>
                  <LocaleSwitcher currentLocale={locale} isInHeaderTop={true} />
                  <HeaderMenuButton
                    style={{ fill: "#ffffff" }}
                    className={styles.headerMenuButton}
                    aria-label={getTranslation("openMenu", "Open Menu")}
                    onClick={onClickSideNavExpand}
                    isActive={isSideNavExpanded}
                  />
                </div>
              </div>

              {/* Right Section - News Ticker, Logo and Date */}
              <div
                className={`${styles.headerRightSection} cds--header__content`}
              >
                {/* News Ticker */}
                <div
                  className={`${styles.headerNews} cds--header__content`}
                  role="complementary"
                  aria-label="News Updates"
                >
                  <NewsTicker locale={locale} />
                </div>

                {/* Date and Right Logo Info */}
                <HeaderGlobalBar
                  className={`${styles.headerTopInfo} cds--header__actions`}
                >
                  {rightLogoUrl ? (
                    <div className={styles.headerTopLogoRight}>
                      <img
                        src={rightLogoUrl}
                        alt={(() => {
                          const altText =
                            config?.logoConfiguration?.rightLogo?.altText ||
                            contactInfo?.rightLogo?.altText;
                          return altText ? getText(altText) : "Right Logo";
                        })()}
                        className={`${styles.headerTopEmblemRight} cds--header__logo`}
                        onError={(e) =>
                          console.error(
                            "Right logo failed to load:",
                            rightLogoUrl,
                            e
                          )
                        }
                        role="img"
                        aria-label="Secondary Logo"
                      />
                    </div>
                  ) : (
                    <div className={styles.headerTopLogoRight}>
                      <img
                        src="/icons/nepal-emblem.svg"
                        alt="Nepal Emblem"
                        className={`${styles.headerTopEmblemRight} cds--header__logo`}
                        role="img"
                        aria-label="Nepal Government Emblem"
                      />
                    </div>
                  )}
                  <div className={styles.headerTopDate}>
                    <time
                      dateTime={formatDate()}
                      suppressHydrationWarning
                      className="cds--type-body-01"
                      role="text"
                      aria-label={`Current date: ${getDisplayDate()}`}
                    >
                      {getDisplayDate()}
                    </time>

                    {/* Carbon-compliant Login button for admin dashboard */}
                    <div className={styles.headerTopLogin}>
                      {/* Always open admin/login in a new tab (hot login URL from env or fallback) */}
                      {(() => {
                        const adminUrl = (process as any)?.env?.NEXT_PUBLIC_API_BASE_URL || "/admin";
                        const url = new URL(adminUrl)
                        if (!url.hostname.startsWith('admin.')){
                          url.hostname = 'admin.' + url.hostname
                        }

                        url.pathname = url.pathname.replace(/\/api\/v1.*$/, '/admin');
                        const admin = url.toString()


                        return (
                          <Button
                            size="sm"
                            kind="primary"
                            href={admin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={locale === "ne" ? "प्रशासन लगइन" : "Admin Login"}
                          >
                            {locale === "ne" ? "लगइन" : "Login"}
                          </Button>
                        );
                      })()}
                    </div>
                  </div>
                </HeaderGlobalBar>
              </div>
            </div>
          </Header>

          {/* Mobile Side Navigation */}
          <SideNav
            aria-label={getTranslation("sideNavigation", "Side Navigation")}
            expanded={isSideNavExpanded}
            isPersistent={false}
            className={styles.rightSideNav}
          >
            {/* Close Button Header */}
            {isSideNavExpanded && (
              <div
                className={styles.sideNavHeader}
                onClick={onClickSideNavExpand}
                role="button"
                tabIndex={0}
                aria-label={getTranslation("closeMenu", "Close Menu")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onClickSideNavExpand();
                  }
                }}
              >
                <span className={styles.sideNavCloseIcon}>×</span>
              </div>
            )}

            <SideNavItems>
              {sortedNavigation.length > 0 ? (
                sortedNavigation.map((item: any) =>
                  item.submenu && item.submenu.length > 0 ? (
                    <div key={item.id} className={styles.sideNavMenuWrapper}>
                      <div
                        className={`${styles.sideNavMenuTitle} ${openSideNavDropdown === item.id ? styles.sideNavMenuExpanded : ""}`}
                        onClick={() => handleSideNavDropdownToggle(item.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSideNavDropdownToggle(item.id);
                          }
                        }}
                      >
                        <span>{item.title[locale] || item.title.en}</span>
                        <span
                          className={`${styles.sideNavMenuChevron} ${openSideNavDropdown === item.id ? styles.sideNavMenuChevronExpanded : ""}`}
                        >
                          ▼
                        </span>
                      </div>
                      {openSideNavDropdown === item.id && (
                        <div className={styles.sideNavSubmenu}>
                          {item.submenu
                            .sort((a: any, b: any) => a.order - b.order)
                            .map((subItem: any) => (
                              <SideNavMenuItem
                                key={subItem.id}
                                as={Link}
                                href={`/${locale}${subItem.href}`}
                                isActive={isItemActive(subItem)}
                                onClick={onClickSideNavExpand}
                              >
                                {subItem.title[locale] || subItem.title.en}
                              </SideNavMenuItem>
                            ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <SideNavMenuItem
                      key={item.id}
                      as={Link}
                      href={`/${locale}${item.href}`}
                      isActive={isItemActive(item)}
                      onClick={onClickSideNavExpand}
                    >
                      {item.title[locale] || item.title.en}
                    </SideNavMenuItem>
                  )
                )
              ) : (
                <div
                  style={{
                    padding: "1rem",
                    color: "#666",
                    textAlign: "center",
                  }}
                >
                  Navigation not available
                </div>
              )}
            </SideNavItems>
          </SideNav>
        </>
      )}
    />
  );
}
