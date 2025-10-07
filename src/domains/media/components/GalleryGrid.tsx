"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { GalleryPhoto } from '../types';
import { PhotoModal } from './PhotoModal';
import { Grid, Column, Tile, Button, Tag } from '@carbon/react';


interface GalleryGridProps {
  photos: GalleryPhoto[];
  locale: 'en' | 'ne';
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ photos, locale }) => {
  const t = useTranslations('media.gallery');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePhotoClick = (photo: GalleryPhoto) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  const handleDownload = (photo: GalleryPhoto) => {
    const link = document.createElement('a');
    link.href = photo.presignedUrl;
    link.download = photo.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  // Only show up to 5 photos per row
  const displayPhotos = photos.slice(0, 6);
  return (
    <div>
      <div 
        className="gallery-grid"
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          width: '100%' 
        }}
      >
        {displayPhotos.length === 0 ? (
          [1, 2, 3, 4, 5,6].map((i) => (
            <div key={i} style={{ width: '100%' }}>
              <Tile style={{ 
                minHeight: '250px', 
                width: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '1rem', 
                padding: '0', 
                background: '#f4f4f4' 
              }}>
                {/* Empty placeholder for consistent grid */}
              </Tile>
            </div>
          ))
        ) : (
          displayPhotos.map((photo) => (
            <div key={photo.id} style={{ width: '100%' }}>
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
                background: '#f4f4f4',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              >
              <div style={{ 
                width: '100%', 
                aspectRatio: '1/1', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                overflow: 'hidden'
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
              <h5 style={{ 
                fontWeight: 400, 
                fontSize: '1.05rem', 
                margin: '0 0 0.25rem 0', 
                textAlign: 'left',
                lineHeight: '1.3',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {photo.title || photo.originalName}
              </h5>
            </Tile>
            </div>
          ))
        )}
      </div>
      <style>{`
        /* Gallery Grid Responsive Styles */
        @media (max-width: 480px) {
          .gallery-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
            gap: 0.75rem !important;
          }
        }
        
        @media (min-width: 481px) and (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)) !important;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          .gallery-grid {
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)) !important;
          }
        }
        
        @media (min-width: 1025px) {
          .gallery-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
          }
        }
        
        /* Limit to 5 items per row on large screens */
        @media (min-width: 1400px) {
          .gallery-grid {
            grid-template-columns: repeat(6, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};
