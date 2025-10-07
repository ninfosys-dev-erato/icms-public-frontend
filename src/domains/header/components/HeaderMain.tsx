"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown } from '@carbon/icons-react';
import { 
  Header, 
  HeaderContainer as CarbonHeaderContainer, 
  HeaderName, 
  HeaderNavigation, 
  HeaderMenuItem, 
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderMenuButton,
  SkipToContent,
  SideNav,
  SideNavItems,
  SideNavMenuItem,
  SideNavMenu
} from '@carbon/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { HeaderMainProps } from '../types/header';
import { useHeaderLocalization } from '../hooks/useHeader';
import { useDynamicMenus } from '../hooks/useDynamicMenus';
import LocaleSwitcher from '@/shared/components/LocaleSwitcher';
import styles from '../styles/header.module.css';

// Define types for the render function parameters
interface CarbonHeaderRenderProps {
  isSideNavExpanded: boolean;
  onClickSideNavExpand: () => void;
}

// Define types for navigation items
interface NavigationItem {
  id: string;
  title: {
    en: string;
    ne: string;
  };
  href: string;
  order: number;
  submenu?: NavigationItem[];
}

export function HeaderMain({ data, locale }: HeaderMainProps) {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const t = useTranslations('navigation');
  
  // Fallback function for missing translations
  const getTranslation = (key: string, fallback: string) => {
    try {
      return t(key);
    } catch (error) {
      console.warn(`Missing translation for key: navigation.${key}`);
      return fallback;
    }
  };
  
  const { getText } = useHeaderLocalization(locale);
  
  // Use navigation data from the HeaderService that's already available
  const navigation: NavigationItem[] = data?.navigation || [];
  const loading = false; // No loading state needed since data comes from props
  
  // Helper function to get the maximum order from backend navigation
  const getMaxBackendOrder = (items: NavigationItem[]): number => {
    return items.reduce((max, item) => Math.max(max, item.order), 0);
  };
  
  // Calculate the next available order numbers for hardcoded items
  const maxBackendOrder = getMaxBackendOrder(navigation);
  
  // Hardcoded navigation items with internationalization
  const hardcodedNavigation: NavigationItem[] = [
    {
      id: 'gallery',
      title: {
        en: 'Gallery',
        ne: 'ग्यालेरी'
      },
      href: '/gallery',
      order: maxBackendOrder + 1 // Place after backend items
    },
    {
      id: 'employees',
      title: {
        en: 'Employees',
        ne: 'कर्मचारीहरू'
      },
      href: '/hr',
      order: maxBackendOrder + 2 // Place after Gallery
    }
  ];
  
  // Merge hardcoded navigation with dynamic navigation from backend
  const allNavigation: NavigationItem[] = [...hardcodedNavigation, ...navigation];
  
  // Sort navigation by backend order field (ascending order)
  const sortedNavigation = allNavigation.sort((a: NavigationItem, b: NavigationItem) => {
    return a.order - b.order;
  });
  
  // Debug logging for navigation data
  console.log('HeaderMain - Navigation data:', {
    backendItems: navigation.length,
    maxBackendOrder: maxBackendOrder,
    hardcoded: hardcodedNavigation,
    dynamic: navigation,
    merged: allNavigation,
    sorted: sortedNavigation,
    navigationLength: sortedNavigation?.length || 0,
    dataKeys: data ? Object.keys(data) : []
  });
  
  // Debug logging for sorted navigation with orders
  console.log('HeaderMain - Sorted navigation with backend orders:', 
    sortedNavigation.map(item => ({
      title: item.title[locale] || item.title.en,
      order: item.order,
      href: item.href,
      isHardcoded: item.id === 'gallery' || item.id === 'employees'
    }))
  );

  // Simple function to check if navigation item is active
  const isItemActive = (item: NavigationItem): boolean => {
    if (typeof window === 'undefined') return false;
    const currentPath = window.location.pathname;
    
    // Check if current path matches the item href
    if (item.href === currentPath) return true;
    
    // Check if current path starts with item href (for nested routes)
    if (item.href !== '/' && currentPath.startsWith(item.href)) return true;
    
    // Check submenu items
    if (item.submenu) {
      return item.submenu.some((subItem: NavigationItem) => isItemActive(subItem));
    }
    
    return false;
  };

  if (!data) return null;

  const { config } = data;


  // If no config is available, show a minimal header
  if (!config) {
    return (
      <div className={styles.headerMain}>
        <CarbonHeaderContainer 
          render={({ isSideNavExpanded, onClickSideNavExpand }: CarbonHeaderRenderProps) => (
            <>
              <Header aria-label="Office Header">
                <SkipToContent />

                <HeaderName as={Link} href="/" prefix="">
                  {data.officeInfo?.officeName ? getText(data.officeInfo.officeName) : 'Office'}
                </HeaderName>

                {/* Desktop Navigation */}
                <HeaderNavigation aria-label={getTranslation('mainNavigation', 'Main Navigation')}>
                  {sortedNavigation.length > 0 ? (
                    sortedNavigation
                      .map((item: NavigationItem) => (
                        <HeaderMenuItem
                          key={item.id}
                          as={Link}
                          href={`/${locale}${item.href}`}
                          isCurrentPage={isItemActive(item)}
                        >
                          {item.title[locale] || item.title.en}
                        </HeaderMenuItem>
                      ))
                  ) : (
                    <div style={{ padding: '0 1rem', color: '#666' }}>
                      Navigation not available
                    </div>
                  )}
                </HeaderNavigation>

                {/* Global Actions */}
                <HeaderGlobalBar>

                  {/* Language Switcher */}
                  <LocaleSwitcher currentLocale={locale} />

                </HeaderGlobalBar>
              </Header>

              {/* Mobile Side Navigation for fallback case */}
              <SideNav
                aria-label={getTranslation('sideNavigation', 'Side Navigation')}
                expanded={isSideNavExpanded}
                isPersistent={false}
              >
                {/* Close Button Header */}
                {isSideNavExpanded && (
                  <div 
                    className={styles.sideNavHeader}
                    onClick={onClickSideNavExpand}
                    role="button"
                    tabIndex={0}
                    aria-label={getTranslation('closeMenu', 'Close Menu')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onClickSideNavExpand();
                      }
                    }}
                  >
                    <span className={styles.sideNavCloseIcon}>×</span>
                  </div>
                )}
                
                <SideNavItems>
                  {sortedNavigation.length > 0 ? (
                    sortedNavigation
                      .map((item: NavigationItem) => (
                        <SideNavMenuItem
                          key={item.id}
                          as={Link}
                          href={`/${locale}${item.href}`}
                          isActive={isItemActive(item)}
                          onClick={onClickSideNavExpand}
                        >
                          {item.title[locale] || item.title.en}
                        </SideNavMenuItem>
                      ))
                  ) : (
                    <div style={{ padding: '1rem', color: '#666', textAlign: 'center' }}>
                      Navigation not available
                    </div>
                  )}
                </SideNavItems>
              </SideNav>
            </>
          )}
        />
      </div>
    );
  }

  return (
    <div className={styles.headerMain}>
      <CarbonHeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }: CarbonHeaderRenderProps) => (
          <>
            <Header aria-label={getText(config.name)}>
              <SkipToContent />

              <HeaderName as={Link} href="/" prefix="">
                {getText(config.name)}
              </HeaderName>

              {/* Desktop Navigation */}
              <HeaderNavigation aria-label={getTranslation('mainNavigation', 'Main Navigation')}>
                {sortedNavigation.length > 0 ? (
                  sortedNavigation
                    .map((item: NavigationItem) => {
                      const hasSubmenu = item.submenu && item.submenu.length > 0;
                      
                      // Debug logging
                      console.log(`Navigation item: ${item.title[locale] || item.title.en}`, {
                        href: item.href,
                        hasSubmenu,
                        submenuCount: item.submenu?.length || 0
                      });
                      
                      return hasSubmenu ? (
                        <div
                          key={item.id}
                          className={styles.headerMenuDropdown}
                          onMouseEnter={() => setOpenDropdown(item.id)}
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          <HeaderMenuItem
                            as="button"
                            isCurrentPage={isItemActive(item)}
                            onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                            className={styles.headerDropdownButton}
                          >
                            <span className={styles.headerDropdownButtonContent}>
                              <span className={styles.headerDropdownButtonText}>
                                {item.title[locale] || item.title.en}
                              </span>
                              <span className={styles.headerDropdownButtonIcon}>
                                <ChevronDown size={16} />
                              </span>
                            </span>
                          </HeaderMenuItem>
                          {openDropdown === item.id && (
                            <div className={styles.headerDropdownMenu}>
                              {item.submenu!
                                .sort((a: NavigationItem, b: NavigationItem) => a.order - b.order)
                                .map((subItem: NavigationItem) => (
                                  <Link
                                    key={subItem.id}
                                    href={`/${locale}${subItem.href}`}
                                    className={styles.headerDropdownMenuItem}
                                  >
                                    {subItem.title[locale] || subItem.title.en}
                                  </Link>
                                ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <HeaderMenuItem
                          key={item.id}
                          as={Link}
                          href={`/${locale}${item.href}`}
                          isCurrentPage={isItemActive(item)}
                        >
                          {item.title[locale] || item.title.en}
                        </HeaderMenuItem>
                      );
                    })
                ) : (
                  // Show loading or fallback navigation
                  <div style={{ padding: '0 1rem', color: '#666' }}>
                    Navigation not available
                  </div>
                )}
              </HeaderNavigation>

              {/* Global Actions */}
              <HeaderGlobalBar>

                {/* Language Switcher */}
                <LocaleSwitcher currentLocale={locale} />

              </HeaderGlobalBar>
            </Header>

            {/* Mobile Side Navigation - MOVED OUTSIDE Header */}
            <SideNav
              aria-label={getTranslation('sideNavigation', 'Side Navigation')}
              expanded={isSideNavExpanded}
              isPersistent={false}
            >
              {/* Close Button Header */}
              {isSideNavExpanded && (
                <div 
                  className={styles.sideNavHeader}
                  onClick={onClickSideNavExpand}
                  role="button"
                  tabIndex={0}
                  aria-label={getTranslation('closeMenu', 'Close Menu')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onClickSideNavExpand();
                    }
                  }}
                >
                  <span className={styles.sideNavCloseIcon}>×</span>
                </div>
              )}
              
              <SideNavItems>
                {sortedNavigation.length > 0 ? (
                  sortedNavigation
                    .map((item: NavigationItem) => (
                      item.submenu && item.submenu.length > 0 ? (
                      <SideNavMenu
                        key={item.id}
                        title={item.title[locale] || item.title.en}
                        isActive={isItemActive(item)}
                      >
                        {item.submenu
                          .sort((a: NavigationItem, b: NavigationItem) => a.order - b.order)
                          .map((subItem: NavigationItem) => (
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
                      </SideNavMenu>
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
                    ))
                ) : (
                  <div style={{ padding: '1rem', color: '#666', textAlign: 'center' }}>
                    Navigation not available
                  </div>
                )}
              </SideNavItems>
            </SideNav>
          </>
        )}
      />
    </div>
  );
}