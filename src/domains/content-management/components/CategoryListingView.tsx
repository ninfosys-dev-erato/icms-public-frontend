"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Search, Pagination, Button, Tag } from "@carbon/react";
import { ContentResponse } from "@/domains/content-management/types/content";
import styles from "./CategoryListingView.module.css";
import { 
  Search as SearchIcon, 
  Close as CloseIcon,
  DocumentPdf,
  Image,
  Document,
  Video,
  Music,
  Archive,
  ChartLineData,
  Filter, 
  SortAscending } from "@carbon/icons-react";

interface CategoryListingViewProps {
  contents: ContentResponse[];
  category: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function CategoryListingView({
  contents,
  category,
  pagination,
}: CategoryListingViewProps) {
  const t = useTranslations("content");
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = params.locale as string;
  const [query, setQuery] = React.useState("");
  const [dateFrom, setDateFrom] = React.useState<string>("");
  const [dateTo, setDateTo] = React.useState<string>("");
  const [page, setPage] = React.useState(pagination?.page || 1);
  const [pageSize, setPageSize] = React.useState(10);
  const [previewDocument, setPreviewDocument] = React.useState<any>(null);
  const [showFilters, setShowFilters] = React.useState(true);
  const [sortAlpha, setSortAlpha] = React.useState<'none' | 'asc' | 'desc'>('none');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // Handle document preview
  const handleDocumentPreview = React.useCallback((attachment: any, event: React.MouseEvent) => {
    event.preventDefault(); // Prevent the parent Link from navigating
    event.stopPropagation(); // Stop event bubbling
    
    console.log('Opening document preview for:', attachment);
    
    // Check if the attachment has a downloadUrl or presignedUrl
    const documentUrl = attachment.presignedUrl || attachment.downloadUrl || attachment.filePath;
    
    if (documentUrl) {
      // Open document in a new tab/window for preview
      window.open(documentUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.error('No valid URL found for document preview:', attachment);
    }
  }, []);

  // Detect mobile screen size
  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close mobile sidebar when switching to desktop
      if (window.innerWidth >= 768) {
        setIsMobileSidebarOpen(false);
      }
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Handle mobile sidebar toggle
  const toggleMobileSidebar = React.useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev);
  }, []);

  // Close mobile sidebar
  const closeMobileSidebar = React.useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  // Handle backdrop click to close sidebar
  const handleBackdropClick = React.useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeMobileSidebar();
    }
  }, [closeMobileSidebar]);

  // Prevent body scroll when mobile sidebar is open
  React.useEffect(() => {
    if (isMobile && isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isMobileSidebarOpen]);

  // Get file icon based on file type/extension
  const getFileIcon = React.useCallback((attachment: any) => {
    const fileName = (attachment as any).fileName || attachment.fileName || "";
    const mimeType = attachment.mimeType || "";
    const extension = fileName.toLowerCase().split('.').pop() || "";

    // Check by MIME type first, then by file extension
    if (mimeType.includes('pdf') || extension === 'pdf') {
      return DocumentPdf;
    }
    
    if (mimeType.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension)) {
      return Image;
    }
    
    if (mimeType.includes('video') || ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(extension)) {
      return Video;
    }
    
    if (mimeType.includes('audio') || ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'].includes(extension)) {
      return Music;
    }
    
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
      return Archive;
    }
    
    if (['xlsx', 'xls', 'csv'].includes(extension)) {
      return ChartLineData;
    }
    
    // Default document icon for other file types
    return Document;
  }, []);

  // handleSearch and resetFilters are declared after pagination constants

  // decide whether pagination is server-side (prop provided) or client-side
  const isServerPaged =
    typeof pagination?.page === "number" &&
    typeof pagination?.limit === "number";

  // For server-side pagination, use props values directly
  // For client-side pagination, use local state
  const currentPage = isServerPaged ? pagination?.page || 1 : page;
  const currentPageSize = isServerPaged
    ? pagination?.limit || pageSize
    : pageSize;

  // total items for pagination control
  const totalItems = pagination?.total ?? contents.length;

  const handleSearch = React.useCallback(() => {
    // If server-paged, update URL params so server returns filtered data
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set("q", query);
    else params.delete("q");
    if (dateFrom) params.set("dateFrom", dateFrom);
    else params.delete("dateFrom");
    if (dateTo) params.set("dateTo", dateTo);
    else params.delete("dateTo");

    if (isServerPaged) {
      // reset to first page when filters change
      params.set("page", "1");
      params.set("limit", String(currentPageSize));
      const categorySlug = category?.slug || "unknown";
      const newUrl = `/${locale}/content/${categorySlug}?${params.toString()}`;
      router.push(newUrl, { scroll: false });
      return;
    }

    // For client-side, we simply trigger filtering by updating local state (filtering occurs during render)
    console.log("client-side search applied", { query, dateFrom, dateTo });
  }, [
    query,
    dateFrom,
    dateTo,
    isServerPaged,
    currentPageSize,
    category?.slug,
    locale,
    router,
    searchParams,
  ]);

  const resetFilters = React.useCallback(() => {
    setQuery("");
    setDateFrom("");
    setDateTo("");

    if (isServerPaged) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("q");
      params.delete("dateFrom");
      params.delete("dateTo");
      params.set("page", "1");
      params.set("limit", String(currentPageSize));
      const categorySlug = category?.slug || "unknown";
      const newUrl = `/${locale}/content/${categorySlug}?${params.toString()}`;
      router.push(newUrl, { scroll: false });
    }
  }, [
    isServerPaged,
    searchParams,
    currentPageSize,
    category?.slug,
    locale,
    router,
  ]);

  // Debug logging to understand what's happening
  React.useEffect(() => {
    console.log("🔍 CategoryListingView Debug:", {
      contentsLength: contents.length,
      pagination: pagination,
      isServerPaged:
        typeof pagination?.page === "number" &&
        typeof pagination?.limit === "number",
      localPage: page,
      localPageSize: pageSize,
      currentPage: currentPage,
      currentPageSize: currentPageSize,
      totalItems: pagination?.total ?? contents.length,
    });
  }, [contents, pagination, page, pageSize, currentPage, currentPageSize]);

  // Initialize local state from server pagination on first load
  React.useEffect(() => {
    if (isServerPaged && pagination) {
      if (pagination.page && page !== pagination.page) {
        console.log("🔧 Initializing page from server:", pagination.page);
        setPage(pagination.page);
      }
      // Note: We're not setting pageSize from server anymore, always use 10
    }
  }, [isServerPaged, pagination, page, pageSize]);

  // Ensure URL has proper pagination parameters on initial load
  React.useEffect(() => {
    // Only redirect if we're missing essential pagination parameters
    const currentParams = new URLSearchParams(searchParams.toString());
    const currentPage = currentParams.get("page");
    const currentLimit = currentParams.get("limit");

    // Only redirect if both parameters are completely missing
    if (!currentPage && !currentLimit) {
      const defaultPage = pagination?.page || 1;
      const defaultLimit = pageSize || 10; // Use current pageSize or fallback to 10

      currentParams.set("page", defaultPage.toString());
      currentParams.set("limit", defaultLimit.toString());

      const categorySlug = category?.slug || "notice-board";
      const newUrl = `/${locale}/content/${categorySlug}?${currentParams.toString()}`;

      console.log("🔄 Redirecting to URL with pagination params:", newUrl);
      router.replace(newUrl);
    }
  }, [searchParams, category?.slug, locale, router, pagination]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);

      // Use consistent formatting that won't cause hydration mismatch
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const getContentTitle = (content: ContentResponse) => {
    if (typeof content.title === "object" && content.title !== null) {
      return (
        (content.title as Record<string, string>)[locale] ||
        (content.title as Record<string, string>).en ||
        "Untitled"
      );
    }
    return content.title || "Untitled";
  };

  const getContentExcerpt = (content: ContentResponse) => {
    if (typeof content.excerpt === "object" && content.excerpt !== null) {
      return (
        (content.excerpt as Record<string, string>)[locale] ||
        (content.excerpt as Record<string, string>).en ||
        ""
      );
    }
    return content.excerpt || "";
  };

  const getCategoryName = (category: any) => {
    if (typeof category.name === "object" && category.name !== null) {
      return (
        (category.name as Record<string, string>)[locale] ||
        (category.name as Record<string, string>).en ||
        "Unknown Category"
      );
    }
    return category.name || "Unknown Category";
  };

  // helper to apply client-side filters
  const applyClientFilters = (items: ContentResponse[]) => {
    return items.filter((item) => {
      const q = query.trim().toLowerCase();
      if (q) {
        const title = getContentTitle(item).toLowerCase();
        const excerpt = getContentExcerpt(item).toLowerCase();
        if (!title.includes(q) && !excerpt.includes(q)) return false;
      }

      if (dateFrom) {
        const from = new Date(dateFrom);
        const created = new Date(item.createdAt);
        if (created < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        const created = new Date(item.createdAt);
        if (created > to) return false;
      }

      return true;
    });
  };

  // if server provides paged content, render as-is; otherwise slice client-side
  let visibleContents: ContentResponse[];
  let startIndex = 0;
  if (isServerPaged) {
    // Server-paged: contents should already contain only the items for current page
    // But if the server sent more data than expected, we need to slice it
    const expectedMaxItems = currentPageSize;

    if (contents.length > expectedMaxItems) {
      // Server sent more data than expected for this page, slice it
      console.warn(
        "🚨 Server sent more data than expected, applying client-side slicing as fallback",
        {
          received: contents.length,
          expected: expectedMaxItems,
          currentPage,
          currentPageSize,
        }
      );
      startIndex = 0; // For server-paged data, always start from 0 since it should be pre-filtered
      visibleContents = contents.slice(0, currentPageSize);
    } else {
      // Server correctly sent only the page data
      visibleContents = contents;
      startIndex = (currentPage - 1) * currentPageSize;
    }

    console.log("🔍 Server-paged mode:", {
      totalContents: contents.length,
      expectedPageSize: currentPageSize,
      currentPage: currentPage,
      startIndex,
      willShow: visibleContents.length,
      serverSentCorrectAmount: contents.length <= currentPageSize,
    });
  } else {
    // Client-paged: apply client-side filters then slice
    const filtered = applyClientFilters(contents);
    // Apply alphabetical sorting when requested (client-side only)
    let sorted = filtered;
    if (sortAlpha === 'asc') {
      sorted = filtered.slice().sort((a, b) =>
        getContentTitle(a).localeCompare(getContentTitle(b), locale, { sensitivity: 'base' })
      );
    } else if (sortAlpha === 'desc') {
      sorted = filtered.slice().sort((a, b) =>
        getContentTitle(b).localeCompare(getContentTitle(a), locale, { sensitivity: 'base' })
      );
    }
    
    startIndex = (currentPage - 1) * currentPageSize;
    const endIndex = startIndex + currentPageSize;
    visibleContents = sorted.slice(startIndex, endIndex);
    console.log("🔍 Client-paged mode:", {
      totalContents: contents.length,
      filteredCount: filtered.length,
      currentPage: currentPage,
      pageSize: currentPageSize,
      startIndex,
      endIndex,
      willShow: visibleContents.length,
    });
  }

  // sync page/pageSize from pagination prop when server-paged
  React.useEffect(() => {
    if (isServerPaged) {
      if (pagination?.page && pagination.page !== page)
        setPage(pagination.page);
      if (pagination?.limit && pagination.limit !== pageSize)
        setPageSize(pagination.limit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination?.page, pagination?.limit]);

  // clamp page if pageSize or contents length changes (client-side only)
  React.useEffect(() => {
    if (isServerPaged) return;
    const maxPage = Math.max(1, Math.ceil(totalItems / currentPageSize));
    if (currentPage > maxPage) setPage(maxPage);
  }, [currentPageSize, totalItems, currentPage, isServerPaged]);

  // Update URL when pagination changes for server-side pagination
  const updateURL = React.useCallback(
    (newPage: number, newPageSize: number) => {
      if (!isServerPaged) return; // Only update URL for server-side pagination

      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      params.set("limit", newPageSize.toString());

      const categorySlug = category?.slug || "unknown";
      const newUrl = `/${locale}/content/${categorySlug}?${params.toString()}`;
      router.push(newUrl, { scroll: false });
    },
    [isServerPaged, searchParams, category?.slug, locale, router]
  );

  // Note: don't early-return when there are no contents; render the page
  // with sidebar/filters visible and show an in-article empty message instead.

  return (
    <div className={styles.categoryListingContainer}>
      {/* Mobile backdrop */}
      {isMobile && isMobileSidebarOpen && (
        <div 
          className={styles.mobileBackdrop} 
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}
      
      <div className={`${styles.layout} ${isMobile ? styles.mobileLayout : ''}`} style={{ gridTemplateColumns: showFilters && !isMobile ? '320px 1fr' : '1fr' }}>
        {/* Sidebar */}
        {(showFilters || (isMobile && isMobileSidebarOpen)) && (
          <aside className={`${styles.sidebar} ${isMobile ? styles.mobileSidebar : ''} ${isMobile && isMobileSidebarOpen ? styles.mobileSidebarOpen : ''}`}>
            {/* Mobile close button */}
            {isMobile && (
              <div className={styles.mobileCloseButton}>
                <Button
                  size="sm"
                  kind="ghost"
                  hasIconOnly
                  renderIcon={CloseIcon}
                  onClick={closeMobileSidebar}
                  aria-label={locale === "ne" ? "फिल्टर बन्द गर्नुहोस्" : "Close filters"}
                />
              </div>
            )}
            
            <div className={styles.filtersCard}>
              <div className={styles.filtersTitle}>
                <Button
                  size="sm"
                  kind="ghost"
                  onClick={resetFilters}
                  className={styles.resetButton}
                  aria-label={locale === "ne" ? "रिसेट" : "Reset filters"}
                  style={{ paddingLeft: 0 }}
                >
                  {locale === "ne" ? "रिसेट" : "Reset"}
                </Button>
              </div>
              <div className={styles.filterSection}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <label className={styles.filterLabel}>{locale === "ne" ? "प्रकाशित मिति" : "Published Date "}</label>
                  <Button size="sm" kind="ghost" onClick={resetFilters}>{locale === "ne" ? "खाली गर्नुहोस्" : "Clear"}</Button>
                </div>
                <div
                  style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
                >
                  <input
                    type="date"
                    className={styles.input}
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                  <input
                    type="date"
                    className={styles.input}
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
                <div
                  style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}
                >
                  <Button size="sm" kind="primary" onClick={handleSearch}>
                    {locale === "ne" ? "लागू गर्नुहोस्" : "Apply"}
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Main content */}
        <main className={styles.mainContent}>
          <div className={styles.scrollArea}>
            <div className={styles.searchBar}>
              <div className={styles.searchWrapper}>
                <Search
                  size="lg"
                  labelText=""
                  placeholder={locale === "ne" ? "खोज..." : "Search..."}
                  value={query}
                  onChange={(e: any) => setQuery(e.target.value)}
                  onKeyDown={(e: any) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  className={styles.searchInput}
                  closeButtonLabelText=""
                />

                <div className={styles.searchControls}>
                  {query && (
                    <>
                      <Button
                        size="sm"
                        kind="ghost"
                        hasIconOnly
                        renderIcon={CloseIcon}
                        tooltipAlignment="center"
                        onClick={() => setQuery("")}
                      />

                      <span className={styles.separator} aria-hidden="true">
                        |
                      </span>

                      <Button
                        size="sm"
                        kind="ghost"
                        hasIconOnly
                        renderIcon={SearchIcon}
                        tooltipAlignment="center"
                        onClick={handleSearch}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Controls row: left = toggle filters, right = sort */}
            <div className={styles.controlsRow}>
              <div className={styles.controlsLeft} aria-label="Toggle filters">
                <Button 
                  size="sm" 
                  kind="ghost" 
                  onClick={isMobile ? toggleMobileSidebar : () => setShowFilters(s => !s)} 
                  hasIconOnly  
                  renderIcon={Filter} 
                  title={isMobile 
                    ? (isMobileSidebarOpen ? (locale === "ne" ? "फिल्टर बन्द गर्नुहोस्" : "Close filters") : (locale === "ne" ? "फिल्टर खोल्नुहोस्" : "Open filters"))
                    : (showFilters ? (locale === "ne" ? "फिल्टर लुकाउनुहोस्" : "Hide filters") : (locale === "ne" ? "फिल्टर देखाउनुहोस्" : "Show filters"))
                  } 
                />
              </div>
              <div className={styles.controlsRight}>
                <Button size="sm" kind="ghost" onClick={() => setSortAlpha(s => (s === 'none' ? 'asc' : s === 'asc' ? 'desc' : 'none'))} hasIconOnly renderIcon={SortAscending} title={sortAlpha === 'none' ? 'Sort A→Z' : sortAlpha === 'asc' ? 'Sort Z→A' : 'Clear sorting'} />
              </div>
            </div>

            <div className={styles.listContainer}>
              {visibleContents.length === 0 ? (
                <div className={styles.emptyStateInline}>
                  <div className={styles.emptyStateIcon}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className={styles.emptyStateTitle}>
                    {category?.slug === 'notices' 
                      ? (locale === "ne" ? "कुनै सूचना फेला परेन" : "No Notices Found")
                      : t("category.noContent")
                    }
                  </h3>
                  <p className={styles.emptyStateDescription}>
                    {category?.slug === 'notices' 
                      ? (locale === "ne" ? "फिल्टरहरू खाली गर्नुहोस् वा खोज शब्दहरू परिवर्तन गर्नुहोस्" : "Try clearing the filters or modifying the search terms")
                      : t("category.noContentDescription")
                    }
                  </p>
                </div>
              ) : (
                visibleContents.map((content, idx) => {
                const index = startIndex + idx;
                return (
                  <Link
                    key={content.id}
                    href={`/${locale}/content/${content.category?.slug || "unknown"}/${content.slug}`}
                    className={styles.listItemLink}
                  >
                    <article className={styles.listItem}>
                      <div className={styles.listItemHeader}>
                        <h3 className={styles.listItemTitle}>
                          {getContentTitle(content)}
                        </h3>
                        <span
                          className={styles.dateText}
                          suppressHydrationWarning
                        >
                          {formatDate(content.createdAt)}
                        </span>
                      </div>
                      <p className={styles.listItemExcerpt}>
                        {getContentExcerpt(content)}
                      </p>

                      <div className={styles.listItemMeta}>
                        <div className={styles.tagList}>
                          {(content as any).tags
                            ?.slice(0, 3)
                            ?.map((tag: string, i: number) => (
                              <Tag key={i} size="sm">
                                {tag}
                              </Tag>
                            ))}
                        </div>

                        <div className={styles.attachmentList}>
                          {((content.attachments as any[]) || []).slice(0, 2).map((attachment: any, i: number) => {
                            const FileIcon = getFileIcon(attachment);
                            const resolvedFileName: string = (attachment?.fileName as string) || (attachment?.name as string) || "document";

                            return (
                              <Button
                                key={i}
                                kind="primary"
                                size="sm"
                                onClick={(event: React.MouseEvent) => handleDocumentPreview(attachment, event)}
                                className={styles.attachmentButton}
                                title={`Preview ${resolvedFileName}`}
                              >
                                {FileIcon ? <FileIcon className={styles.attachmentIcon} /> : null}
                                {resolvedFileName}
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Separator: only render if there are 2+ items and not the last global item */}
                      {totalItems > 1 && index < totalItems - 1 && (
                        <div
                          className={styles.itemDivider}
                          role="separator"
                          aria-hidden="true"
                        />
                      )}
                    </article>
                  </Link>
                );
                })
              )}
            </div>
          </div>

          {/* Footer pagination bar (Carbon) */}
          <div className={`${styles.footerBar} ${isMobile ? styles.mobileFooterBar : ''}`}>
            <div className={styles.paginationWrapper}>
              <Pagination
                page={currentPage}
                pageSize={currentPageSize}
                pageSizes={isMobile ? [10, 20] : [10, 20, 50]}
                totalItems={totalItems}
                onChange={({ page: newPage, pageSize: newPageSize }) => {
                  if (isServerPaged) {
                    // For server-side pagination, update URL
                    if (newPageSize !== currentPageSize) {
                      // Page size changed, reset to first page
                      updateURL(1, newPageSize);
                    } else {
                      // Only page changed
                      updateURL(newPage, newPageSize);
                    }
                  } else {
                    // For client-side pagination, update local state
                    if (newPageSize !== pageSize) {
                      setPage(1);
                      setPageSize(newPageSize);
                    } else {
                      setPage(newPage);
                    }
                  }
                }}
                backwardText={locale === "ne" ? "अघिल्लो" : "Previous"}
                forwardText={locale === "ne" ? "अर्को" : "Next"}
                itemsPerPageText={
                  locale === "ne" ? "प्रति पृष्ठ" : "Items per page"
                }
                pageNumberText={locale === "ne" ? "पृष्ठ" : "Page"}
                className={`carbon-pagination-custom ${isMobile ? 'mobile-pagination' : ''}`}
              />
            </div>
          </div>
        </main>
      </div>
      <style>{`
        .carbon-pagination-custom svg {
          width: 16px !important;
          height: 16px !important;
        }
        
        /* Mobile pagination styles */
        .mobile-pagination .cds--pagination__text {
          font-size: 0.75rem !important;
        }
        
        .mobile-pagination .cds--pagination__button {
          min-width: 32px !important;
          min-height: 32px !important;
        }
        
        .mobile-pagination .cds--select__wrapper {
          min-width: 80px !important;
        }
        
        .mobile-pagination .cds--pagination__left,
        .mobile-pagination .cds--pagination__right {
          flex-wrap: wrap !important;
          gap: 0.5rem !important;
        }
        
        @media (max-width: 480px) {
          .mobile-pagination .cds--pagination {
            flex-direction: column !important;
            gap: 0.75rem !important;
            align-items: stretch !important;
          }
          
          .mobile-pagination .cds--pagination__left,
          .mobile-pagination .cds--pagination__right {
            justify-content: center !important;
          }
          
          .mobile-pagination .cds--pagination__text {
            text-align: center !important;
          }
        }
      `}</style>
    </div>
  );
}
