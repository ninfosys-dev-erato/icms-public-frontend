"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useAllGalleryPhotos } from "../hooks";
import { PhotoModal } from "./PhotoModal";
import { GalleryPhoto } from "../types";
// import styles from "./gallery.module.css";

import {
  Grid,
  Column,
  Tile,
  Tag,
  Loading,
  InlineNotification,
  Breadcrumb as CarbonBreadcrumb,
  BreadcrumbItem,
  Pagination,
  Row,
} from "@carbon/react";

export const PhotoPage: React.FC<{ locale: "en" | "ne" }> = ({ locale }) => {
  const t = useTranslations("media.gallery");
  // Pagination state
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20); // Default page size
  
  // Modal state
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data, isLoading, isError, error } = useAllGalleryPhotos(
    page,
    pageSize
  ); // Fetch paginated photos

  const photos = data?.data || [];
  const totalPhotos = data?.pagination?.total || photos.length;

  // Photo click handler
  const handlePhotoClick = (photo: GalleryPhoto) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  // Modal close handler
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  // Navigation handler
  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!selectedPhoto || !photos.length) return;
    
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
    } else {
      newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : currentIndex;
    }
    
    if (newIndex !== currentIndex) {
      setSelectedPhoto(photos[newIndex]);
    }
  };

  // Download handler
  const handleDownload = (photo: GalleryPhoto) => {
    const link = document.createElement('a');
    link.href = photo.presignedUrl;
    link.download = photo.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Share handler
  const handleShare = async (photo: GalleryPhoto) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.title || photo.originalName,
          text: photo.description || '',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // You could show a toast notification here
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <>
      <Grid>
        <Column sm={4} md={8} lg={16} style={{ marginBottom: "2rem" }}>
          <CarbonBreadcrumb
            aria-label={t("breadcrumbNavigation") || "Breadcrumb navigation"}
            style={{
              padding: "1rem 0 0 1.8rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <BreadcrumbItem>
              <a href={`/${locale}`}>{locale === "ne" ? "गृहपृष्ठ" : "Home"}</a>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <a href={`/${locale}/gallery`}>
                {locale === "ne" ? "ग्यालरी" : "Gallery"}
              </a>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              {locale === "ne" ? "सबै फोटोहरू" : "Photos"}
            </BreadcrumbItem>
          </CarbonBreadcrumb>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              margin: "2rem 0 2rem 0",
              paddingLeft: "1.8rem",
              paddingRight: "1.8rem",
            }}
          >
            {locale === "ne" ? "फोटोहरू" : "Photos"}
          </h1>
          {isLoading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "200px",
              }}
            >
              <Loading
                description={t("loading") || "Loading"}
                withOverlay={false}
              />
              <p style={{ marginTop: "1rem" }}>{t("loading")}</p>
            </div>
          ) : isError ? (
            <InlineNotification
              kind="error"
              title={t("error")}
              subtitle={error?.message || ""}
            />
          ) : (
            <>
              <Row>
                <Column lg={16} md={8} sm={4}>
                  <div
                    className="photo-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "1rem",
                      paddingLeft: "1.8rem",
                      paddingRight: "1.8rem",
                    }}
                  >
                    {photos.length === 0 ? (
                      <InlineNotification
                        kind="info"
                        title={t("noPhotos")}
                        subtitle={t("noPhotosDescription")}
                        style={{ margin: "2rem 0", gridColumn: "1 / -1" }}
                      />
                    ) : (
                      photos.map((photo) => (
                        <Tile
                          key={photo.id}
                          onClick={() => handlePhotoClick(photo)}
                          style={{
                            minHeight: "250px",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            gap: "0.75rem",
                            padding: "0",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                        >
                          <div
                            style={{
                              width: "100%",
                              aspectRatio: "1/1",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={photo.presignedUrl}
                              alt={photo.title || photo.originalName}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                              }}
                              loading="lazy"
                            />
                          </div>
                          <h5
                            style={{
                              fontWeight: 400,
                              fontSize: "1.05rem",
                              margin: "0.5rem 0 0.25rem 0",
                              textAlign: "left",
                              lineHeight: "1.3",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {photo.title || photo.originalName}
                          </h5>
                          {photo.description && (
                            <p
                              style={{
                                marginBottom: "0.5rem",
                                color: "#6f6f6f",
                                fontSize: "0.875rem",
                                textAlign: "left",
                                margin: 0,
                                lineHeight: "1.3",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {photo.description}
                            </p>
                          )}
                          {photo.tags.length > 0 && (
                            <div
                              style={{
                                marginBottom: "0.5rem",
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "0.25rem",
                                justifyContent: "flex-start",
                              }}
                            >
                              {photo.tags.slice(0, 5).map((tag, index) => (
                                <Tag key={index}>{tag}</Tag>
                              ))}
                              {photo.tags.length > 5 && (
                                <Tag type="gray">+{photo.tags.length - 5}</Tag>
                              )}
                            </div>
                          )}
                        </Tile>
                      ))
                    )}
                  </div>
                </Column>
              </Row>
              {totalPhotos > 0 && (
                <Row>
                  <Column lg={16} md={8} sm={4}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        margin: "2rem 1.8rem",
                      }}
                    >
                      <Pagination
                        page={page}
                        pageSize={pageSize}
                        pageSizes={[10, 20, 50, 100]}
                        totalItems={totalPhotos}
                        onChange={({ page, pageSize }) => {
                          setPage(page);
                          setPageSize(pageSize);
                        }}
                        backwardText={locale === "ne" ? "अघिल्लो" : "Previous"}
                        forwardText={locale === "ne" ? "अर्को" : "Next"}
                        itemsPerPageText={
                          locale === "ne" ? "प्रति पृष्ठ" : "Items per page"
                        }
                        pageNumberText={locale === "ne" ? "पृष्ठ" : "Page"}
                        className="carbon-pagination-custom"
                      />
                    </div>
                  </Column>
                </Row>
              )}
            </>
          )}
        </Column>
      </Grid>
      
      <style>{`
        .carbon-pagination-custom svg {
          width: 16px !important;
          height: 16px !important;
        }
        
        /* Responsive grid adjustments */
        @media (max-width: 480px) {
          .photo-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
            gap: 0.75rem !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
        }
        
        @media (min-width: 481px) and (max-width: 768px) {
          .photo-grid {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)) !important;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          .photo-grid {
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)) !important;
          }
        }
        
        @media (min-width: 1025px) {
          .photo-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
          }
        }
      `}</style>

      {isModalOpen && selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto as GalleryPhoto}
          photos={photos}
          currentIndex={photos.findIndex(p => p.id === selectedPhoto.id)}
          onClose={handleCloseModal}
          onDownload={() => selectedPhoto && handleDownload(selectedPhoto)}
          onShare={() => selectedPhoto && handleShare(selectedPhoto)}
          onNavigate={handleNavigate}
          locale={locale}
        />
      )}
    </>
  );
};
