"use client";

import React from 'react';
import { SliderItemProps } from '../types/slider';
import { useSliderLocalization } from '../hooks/useSlider';
import styles from '../styles/slider.module.css';

export function SliderItem({ 
  slider, 
  locale, 
  isActive, 
  isTransitioning, 
  onClick
}: SliderItemProps) {
  const { getText } = useSliderLocalization(locale);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback to a placeholder image if the main image fails to load
    event.currentTarget.src = '/images/fallback/slider-placeholder.jpg';
  };

  return (
    <div 
      className={`${styles.sliderItem} ${isActive ? styles.sliderItemActive : ''} ${isTransitioning ? styles.sliderItemTransitioning : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={isActive ? 0 : -1}
      aria-label={slider.title ? getText(slider.title) : `Slider ${slider.position}`}
      aria-hidden={!isActive}
    >
      {/* Background Image */}
      <div className={styles.sliderItemImage}>
        <img
          src={slider.media.presignedUrl}
          alt={slider.title ? getText(slider.title) : `Slider image ${slider.position}`}
          className={styles.sliderItemImg}
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Image Overlay */}
        <div className={styles.sliderItemOverlay} />
      </div>

      {/* Content Overlay */}
      <div className={styles.sliderItemContent}>
        {/* Title */}
        {slider.title && (
          <div className={styles.sliderItemTitle}>
            <h2 className={styles.sliderItemTitleText}>
              {getText(slider.title)}
            </h2>
          </div>
        )}

        {/* Click Indicator */}
        <div className={styles.sliderItemClickIndicator}>
          <div className={styles.sliderItemClickIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path 
                d="M7 17L17 7M17 7H7M17 7H7M17 7V17" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isTransitioning && (
        <div className={styles.sliderItemLoading}>
          <div className={styles.sliderItemLoadingSpinner} />
        </div>
      )}
    </div>
  );
}
