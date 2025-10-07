"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useAllGalleryPhotos } from "../hooks";
import { Breadcrumb as CarbonBreadcrumb, BreadcrumbItem, Grid, Column, Button, Loading, InlineNotification } from "@carbon/react";
import { useLocale } from "next-intl";
import { GalleryFilters } from "./GalleryFilters";
import { GalleryGrid } from "./GalleryGrid";
import { GalleryPagination } from "./GalleryPagination";
import styles from "./gallery.module.css";

interface GalleryPageContainerProps {
  locale: "en" | "ne";
  initialPage: number;
  initialLimit: number;
  initialSearch: string;
  initialTags: string;
}

export const GalleryPageContainer: React.FC<GalleryPageContainerProps> = ({
  locale,
  initialPage,
  initialLimit,
  initialSearch,
  initialTags,
}) => {
  const t = useTranslations("media.gallery");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState(initialSearch);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialTags ? initialTags.split(",").filter(Boolean) : []
  );

  const { data, isLoading, isError, error } = useAllGalleryPhotos(page, limit);

  // Debug logging
  console.log("🔍 GalleryPageContainer: Hook result:", {
    data,
    isLoading,
    isError,
    error,
  });
  console.log("🔍 GalleryPageContainer: Data structure:", data);
  console.log("🔍 GalleryPageContainer: Photos array:", data?.data);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (limit !== 20) params.set("limit", limit.toString());
    if (search) params.set("search", search);
    if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));

    const queryString = params.toString();
    const newUrl = queryString ? `/gallery?${queryString}` : "/gallery";
    router.push(newUrl, { scroll: false });
  }, [page, limit, search, selectedTags, router]);

  // Handle search
  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    setPage(1); // Reset to first page when searching
  };

  // Handle tag selection
  const handleTagSelection = (tags: string[]) => {
    setSelectedTags(tags);
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

  // Filter photos based on search and tags
  const filteredPhotos = React.useMemo(() => {
    if (!data?.data) return [];

    let filtered = data.data;

    // Apply search filter
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (photo) =>
          photo.title?.toLowerCase().includes(term) ||
          photo.description?.toLowerCase().includes(term) ||
          photo.originalName.toLowerCase().includes(term) ||
          photo.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((photo) =>
        selectedTags.some((tag) => photo.tags.includes(tag))
      );
    }

    return filtered;
  }, [data?.data, search, selectedTags]);

  // Get all unique tags from photos
  const allTags = React.useMemo(() => {
    if (!data?.data) return [];
    const tags = new Set<string>();
    data.data.forEach((photo) => {
      photo.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [data?.data]);

  if (isError) {
    return (
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <h1 style={{ marginBottom: "1rem" }}>{t("title")}</h1>
          <InlineNotification
            kind="error"
            title={t("error")}
            subtitle={error?.message || ""}
            // actions={<Button size="sm" onClick={() => window.location.reload()}>{locale === 'ne' ? 'फेरि प्रयास गर्नुहोस्' : 'Try Again'}</Button>}
          />
        </Column>
      </Grid>
    );
  }

  return (
    <Grid >
      <Column sm={4} md={8} lg={16} className={styles.galleryPage}>
        <CarbonBreadcrumb aria-label={t('breadcrumbNavigation') || 'Breadcrumb navigation'} style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          <BreadcrumbItem>
            <a href={`/${locale}`}>{locale === 'ne' ? 'गृहपृष्ठ' : 'Home'}</a>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            {locale === 'ne' ? 'ग्यालरी' : 'Gallery'}
          </BreadcrumbItem>
        </CarbonBreadcrumb>
        <header style={{ margin: "2rem 0 2rem 0", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>{t("title")}</h1>
          <Button kind="ghost" size="sm" href="/gallery/photo">
            {locale === 'ne' ? 'सबै फोटो हेर्नुहोस्' : 'View All Photos'}
          </Button>
        </header>
        {/* Uncomment and refactor GalleryFilters to use Carbon UI if needed */}
        {/* <GalleryFilters
          search={search}
          onSearch={handleSearch}
          selectedTags={selectedTags}
          onTagSelection={handleTagSelection}
          allTags={allTags}
          totalPhotos={filteredPhotos.length}
          locale={locale}
        /> */}

        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "2rem 0" }}>
            <Loading description={t("loading") || "Loading"} withOverlay={false} />
            <p style={{ marginTop: "1rem" }}>{t("loading")}</p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <InlineNotification
            kind="info"
            title={t("noPhotos")}
            subtitle={t("noPhotosDescription")}
            style={{ margin: "2rem 0" }}
          />
        ) : (
          <>
            <GalleryGrid photos={filteredPhotos} locale={locale} />
            {/* {data && (
              <GalleryPagination
                currentPage={page}
                totalPages={Math.ceil(filteredPhotos.length / limit)}
                totalItems={filteredPhotos.length}
                itemsPerPage={limit}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                locale={locale}
              />
            )} */}
          </>
        )}
      </Column>
    </Grid>
  );

};

// ...existing code...

