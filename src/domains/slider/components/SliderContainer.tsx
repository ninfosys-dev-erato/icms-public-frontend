"use client";

import React from 'react';
import { SliderProps } from '../types/slider';
import { useSlider, useSliderControl, useSliderAutoPlay, useSliderAnalytics } from '../hooks/useSlider';
import { SliderItem } from './SliderItem';
import { SliderNavigation } from './SliderNavigation';
import { SliderIndicators } from './SliderIndicators';
import styles from '../styles/slider.module.css';

export function SliderContainer({ 
  locale, 
  className = '', 
  autoPlay = true,
  showNavigation = true,
  showIndicators = true,
  showTitle = true,
  height = '400px',
  width = '100%'
}: SliderProps) {
  
  // All hooks must be called at the top level, unconditionally
  const { data, isLoading, error, isReady } = useSlider(locale);
  const { currentSlider, totalSlides, navigateToSlide } = useSliderControl();
  const { handleMouseEnter, handleMouseLeave } = useSliderAutoPlay(autoPlay, 5000, locale);
  const { trackView, trackClick } = useSliderAnalytics();

  // Ensure currentIndex is valid - calculate this once
  const validCurrentIndex = React.useMemo(() => {
    if (!data?.sliders || data.sliders.length === 0) return 0;
    return data.currentIndex >= 0 && data.currentIndex < data.sliders.length 
      ? data.currentIndex 
      : 0;
  }, [data?.currentIndex, data?.sliders]);

  // Track view when slider changes
  React.useEffect(() => {
    if (currentSlider) {
      trackView(currentSlider.id);
    }
  }, [currentSlider, trackView]);

  // Handle slide click
  const handleSlideClick = React.useCallback((sliderId: string) => {
    trackClick(sliderId);
  }, [trackClick]);

  // Show skeleton during loading
  if (isLoading || !isReady) {
    return (
      <div className={`${styles.sliderSkeleton} ${className}`} style={{ height, width }} suppressHydrationWarning>
        <div className={styles.sliderSkeletonContent}></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    console.error('Slider error:', error);
    return (
      <div className={`${styles.sliderError} ${className}`} style={{ height, width }}>
        <div className={styles.sliderErrorContent}>
          <p>Failed to load slider content</p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!data?.sliders || data.sliders.length === 0) {
    return (
      <div className={`${styles.sliderEmpty} ${className}`} style={{ height, width }}>
        <div className={styles.sliderEmptyContent}>
          <p>No slider content available</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${styles.sliderContainer} ${className}`}
      style={{ height, width }}
      suppressHydrationWarning
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="Image slider"
    >
      {/* Main Slider Content */}
      <div className={styles.sliderContent}>
        {data.sliders.map((slider: any, index: number) => (
          <SliderItem
            key={slider.id}
            slider={slider}
            locale={locale}
            isActive={index === validCurrentIndex}
            isTransitioning={data.isTransitioning}
            onClick={() => handleSlideClick(slider.id)}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      {showNavigation && totalSlides > 1 && (
        <SliderNavigation
          totalSlides={totalSlides}
          currentIndex={validCurrentIndex}
          onNavigate={navigateToSlide}
          className={styles.sliderNavigation}
        />
      )}

      {/* Indicators/Dots */}
      {showIndicators && totalSlides > 1 && (
        <SliderIndicators
          totalSlides={totalSlides}
          currentIndex={validCurrentIndex}
          onNavigate={navigateToSlide}
          className={styles.sliderIndicators}
        />
      )}

      {/* Progress Bar */}
      {autoPlay && totalSlides > 1 && (
        <div className={styles.sliderProgress}>
          <div 
            className={styles.sliderProgressBar}
            style={{ 
              width: `${((validCurrentIndex + 1) / totalSlides) * 100}%` 
            }}
          />
        </div>
      )}
    </div>
  );
}
