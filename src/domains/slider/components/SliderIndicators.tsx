"use client";

import React from 'react';
import { SliderIndicatorsProps } from '../types/slider';
import styles from '../styles/slider.module.css';

export function SliderIndicators({ 
  totalSlides, 
  currentIndex, 
  onNavigate, 
  className = '' 
}: SliderIndicatorsProps) {
  
  if (totalSlides <= 1) return null;

  return (
    <div className={`${styles.sliderIndicators} ${className}`} role="tablist" aria-label="Slider Region">
      {Array.from({ length: totalSlides }, (_, index) => (
        <button
          key={index}
          className={`${styles.sliderIndicator} ${index === currentIndex ? styles.sliderIndicatorActive : ''}`}
          onClick={() => onNavigate(index)}
          aria-label={`Slide ${index + 1}`}
          aria-selected={index === currentIndex}
          role="tab"
          type="button"
        >
          <span className={styles.sliderIndicatorDot} />
          <span className={styles.sliderIndicatorLabel}>
            {index + 1}
          </span>
        </button>
      ))}
    </div>
  );
}
