"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useAllNotices } from "../hooks";
import { NoticeFilters } from "./NoticeFilters";
import { NoticeGrid } from "./NoticeGrid";
import { NoticePagination } from "./NoticePagination";
import styles from "./notices.module.css";

interface NoticesPageContainerProps {
  locale: "en" | "ne";
  initialPage: number;
  initialLimit: number;
  initialSearch: string;
  initialTypes: string;
  initialPriorities: string;
}

export const NoticesPageContainer: React.FC<NoticesPageContainerProps> = ({
  locale,
  initialPage,
  initialLimit,
  initialSearch,
  initialTypes,
  initialPriorities,
}) => {
  const t = useTranslations("notices");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState(initialSearch);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    initialTypes ? initialTypes.split(",").filter(Boolean) : []
  );
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(
    initialPriorities ? initialPriorities.split(",").filter(Boolean) : []
  );

  const { data, isLoading, isError, error } = useAllNotices(page, limit);

  // Debug logging
  console.log("🔍 NoticesPageContainer: Hook result:", {
    data,
    isLoading,
    isError,
    error,
  });
  console.log("🔍 NoticesPageContainer: Data structure:", data);
  console.log("🔍 NoticesPageContainer: Notices array:", data?.data);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (limit !== 20) params.set("limit", limit.toString());
    if (search) params.set("search", search);
    if (selectedTypes.length > 0) params.set("types", selectedTypes.join(","));
    if (selectedPriorities.length > 0) params.set("priorities", selectedPriorities.join(","));

    const queryString = params.toString();
    const newUrl = queryString ? `/content/notice-board?${queryString}` : "/content/notice-board";
    router.push(newUrl, { scroll: false });
  }, [page, limit, search, selectedTypes, selectedPriorities, router]);

  // Handle search
  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    setPage(1); // Reset to first page when searching
  };

  // Handle type selection
  const handleTypeSelection = (types: string[]) => {
    setSelectedTypes(types);
    setPage(1); // Reset to first page when filtering
  };

  // Handle priority selection
  const handlePrioritySelection = (priorities: string[]) => {
    setSelectedPriorities(priorities);
    setPage(1); // Reset to first page when filtering
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle limit change
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  // Filter notices based on search, types, and priorities
  const filteredNotices = React.useMemo(() => {
    if (!data?.data) return [];

    let filtered = data.data;

    // Apply search filter
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (notice) =>
          notice.title?.toLowerCase().includes(term) ||
          notice.title_en?.toLowerCase().includes(term) ||
          notice.summary?.toLowerCase().includes(term) ||
          notice.summary_en?.toLowerCase().includes(term) ||
          notice.content?.toLowerCase().includes(term) ||
          notice.content_en?.toLowerCase().includes(term) ||
          notice.referenceNo?.toLowerCase().includes(term) ||
          (notice.tags && notice.tags.some((tag) => tag.toLowerCase().includes(term)))
      );
    }

    // Apply type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((notice) =>
        selectedTypes.includes(notice.type)
      );
    }

    // Apply priority filter
    if (selectedPriorities.length > 0) {
      filtered = filtered.filter((notice) =>
        selectedPriorities.includes(notice.priority)
      );
    }

    return filtered;
  }, [data?.data, search, selectedTypes, selectedPriorities]);

  // Get all unique types from notices
  const allTypes = React.useMemo(() => {
    if (!data?.data) return [];
    const types = new Set<string>();
    data.data.forEach((notice) => {
      if (notice.type) {
        types.add(notice.type);
      }
    });
    return Array.from(types).sort();
  }, [data?.data]);

  // Get all unique priorities from notices
  const allPriorities = React.useMemo(() => {
    if (!data?.data) return [];
    const priorities = new Set<string>();
    data.data.forEach((notice) => {
      if (notice.priority) {
        priorities.add(notice.priority);
      }
    });
    return Array.from(priorities).sort();
  }, [data?.data]);

  if (isError) {
    return (
      <div className={styles.errorContainer}>
        <h1>{t("title")}</h1>
        <div className={styles.errorMessage}>
          <p>{t("error")}</p>
          <button
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            {t("tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.noticesPage}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{t("title")}</h1>
          <p className={styles.pageDescription}>{t("description")}</p>
        </header>

        <NoticeFilters
          search={search}
          onSearch={handleSearch}
          selectedTypes={selectedTypes}
          onTypeSelection={handleTypeSelection}
          selectedPriorities={selectedPriorities}
          onPrioritySelection={handlePrioritySelection}
          allTypes={allTypes}
          allPriorities={allPriorities}
          totalNotices={filteredNotices.length}
          locale={locale}
        />

        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>{t("loading")}</p>
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>{t("noNotices")}</h3>
            <p>{t("noNoticesDescription")}</p>
          </div>
        ) : (
          <>
            <NoticeGrid notices={filteredNotices} locale={locale} />

            {data && (
              <NoticePagination
                currentPage={page}
                totalPages={Math.ceil(filteredNotices.length / limit)}
                totalItems={filteredNotices.length}
                itemsPerPage={limit}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                locale={locale}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
