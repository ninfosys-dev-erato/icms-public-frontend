"use client";

import React from "react";
import { Grid, Row, Column, Tile, SkeletonText, SkeletonIcon, Button } from '@carbon/react';
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useGallery } from "@/hooks/useGallery";
import styles from "../styles/homepage.module.css";

interface GallerySectionProps {
  locale?: "ne" | "en";
  limit?: number;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  locale = "en",
  limit = 6,
}) => {
  const t = useTranslations("media.gallery");
  const { data: photos = [], isLoading, isError } = useGallery();

  // Helper function to safely extract text values that might be objects with {en, ne} keys
  const getLocalizedText = (text: any, fallback: string = ''): string => {
    if (typeof text === 'string') {
      return text;
    }
    if (text && typeof text === 'object') {
      // Handle case where text is {en: "...", ne: "..."}
      if (locale === 'ne' && text.ne) {
        return text.ne;
      }
      if (locale === 'en' && text.en) {
        return text.en;
      }
      // Fallback to any available text
      return text.ne || text.en || fallback;
    }
    return fallback;
  };

  const displayPhotos = photos.slice(0, 6);

  if (isLoading) {
    return (
      <section style={{ padding: '2rem 0' }}>
        <Grid>
          <Row>
            <Column lg={16} md={8} sm={4}>
              <h2 style={{ fontWeight: 600, fontSize: '1.5rem', marginBottom: '1rem' }}>{getLocalizedText(t("title"))}</h2>
              <SkeletonText paragraph width="100%" lineCount={1} />
            </Column>
          </Row>
          <Row>
            {[...Array(limit)].map((_, index) => (
              <Column key={index} lg={3} md={3} sm={3}>
                <Tile style={{ minHeight: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                  <SkeletonIcon />
                  <SkeletonText width="80%" lineCount={2} />
                </Tile>
              </Column>
            ))}
          </Row>
        </Grid>
      </section>
    );
  }

  if (isError || displayPhotos.length === 0) {
    return (
      <section style={{ padding: '2rem 0' }}>
        <Grid>
          <Row>
            <Column lg={16} md={8} sm={4}>
              <h2 style={{ fontWeight: 600, fontSize: '1.5rem', marginBottom: '1rem' }}>{getLocalizedText(t("title"))}</h2>
              <p style={{ color: '#8d8d8d' }}>{isError ? t("error") : t("noPhotos")}</p>
            </Column>
          </Row>
        </Grid>
      </section>
    );
  }

  return (
  <section style={{ padding: '2rem 0' }}>
      <Grid>
        <Row>
          <Column lg={16} md={8} sm={4}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: '1rem',
              // flexWrap: 'wrap',
              // gap: '0.5rem',
              padding: ' 0 1.8rem'
            }}>
              <h2 style={{ 
                fontWeight: 600, 
                fontSize: '1.5rem', 
                margin: 0,
                // flex: '1 1 auto'
              }}>
                {getLocalizedText(t("title"))}
              </h2>
              <Button kind="ghost" href={`/${locale}/gallery`} size="sm" style={{ flexShrink: 0 }}>
                {getLocalizedText(t("viewAll"))}
              </Button>
            </div>
          </Column>
        </Row>
  <div 
    className="homepage-gallery-grid"
    style={{
      display:'grid', 
      gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', 
      gap:'1rem',
      paddingLeft: '1.8rem',
      paddingRight: '1.8rem'
    }}
  >
    {displayPhotos.length > 0
      ? displayPhotos.map((photo) => (
          <div key={photo.id} style={{width:'100%'}}>
            <Tile style={{ 
              minHeight: '250px', 
              width: '100%', 
              margin: '0 0 1rem 0', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start', 
              justifyContent: 'flex-start', 
              padding: '0', 
              gap: '0.75rem', 
              background: 'transparent',
            }}
            >
              <div style={{ 
                width: '100%', 
                aspectRatio: '1/1', 
                display: 'flex', 
                alignItems: 'ce5nter', 
                justifyContent: 'center', 
                overflow: 'hidden',
              }}>
                <img
                  src={photo.presignedUrl}
                  alt={photo.title || photo.originalName}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  loading="lazy"
                />
              </div>
              <h3 style={{ 
                fontWeight: 500, 
                fontSize: '1.05rem', 
                margin: '0.5rem 0 0.25rem 0', 
                textAlign: 'left',
                lineHeight: '1.3',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {photo.title || photo.originalName}
              </h3>
              {photo.description && (
                <p style={{ 
                  color: '#6f6f6f', 
                  fontSize: '0.875rem', 
                  textAlign: 'left', 
                  margin: 0,
                  lineHeight: '1.3',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {photo.description}
                </p>
              )}
              {photo.tags && photo.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
                  {photo.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} style={{ background: '#e0e0e0', borderRadius: '12px', padding: '0.2rem 0.75rem', fontSize: '0.85rem', color: '#198038' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Tile>
          </div>
        ))
      : [1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{width:'100%'}}>
            <Tile style={{ 
              minHeight: '250px', 
              width: '100%', 
              margin: '0 auto', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '1rem', 
              padding: '1rem', 
              background: 'transparent' 
            }}>
              {/* Empty placeholder for consistent grid */}
            </Tile>
          </div>
        ))}
  </div>
  {/* Removed bottom row button, now shown beside heading */}
      </Grid>
      <style>{`
        /* Homepage Gallery Header Responsive Styles */
        @media (max-width: 480px) {
          .gallery-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          
          .gallery-header h2 {
            font-size: 1.25rem !important;
          }
        }
        
        @media (min-width: 481px) and (max-width: 768px) {
          .gallery-header h2 {
            font-size: 1.375rem !important;
          }
        }
        
        /* Homepage Gallery Grid Responsive Styles */
        @media (max-width: 480px) {
          .homepage-gallery-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
            gap: 0.75rem !important;
          }
        }
        
        @media (min-width: 481px) and (max-width: 768px) {
          .homepage-gallery-grid {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)) !important;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          .homepage-gallery-grid {
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)) !important;
          }
        }
        
        @media (min-width: 1025px) {
          .homepage-gallery-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
          }
        }
        
        /* Limit to 5 items per row on large screens */
        @media (min-width: 1400px) {
          .homepage-gallery-grid {
            grid-template-columns: repeat(6, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );  
}