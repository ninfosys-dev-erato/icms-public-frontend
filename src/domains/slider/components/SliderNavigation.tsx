"use client";

import React from 'react';
import { SliderNavigationProps } from '../types/slider';
import styles from '../styles/slider.module.css';

export function SliderNavigation({ 
  totalSlides, 
  currentIndex, 
  onNavigate, 
  className = '' 
}: SliderNavigationProps) {
  
  const handlePrevious = () => {
    const prevIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
    onNavigate(prevIndex);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % totalSlides;
    onNavigate(nextIndex);
  };

  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === totalSlides - 1;

  return (
    <div className={`${styles.sliderNavigation} ${className}`}>
      {/* Previous Button */}
      <button
        className={`${styles.sliderNavButton} ${styles.sliderNavButtonPrevious} ${isFirstSlide ? styles.sliderNavButtonDisabled : ''}`}
        onClick={handlePrevious}
        disabled={isFirstSlide}
        aria-label="Previous Slide"
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      {/* Next Button */}
      <button
        className={`${styles.sliderNavButton} ${styles.sliderNavButtonNext} ${isLastSlide ? styles.sliderNavButtonDisabled : ''}`}
        onClick={handleNext}
        disabled={isLastSlide}
        aria-label="Next Slide"
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
      </button>

      {/* Slide Counter */}
      <div className={styles.sliderNavCounter}>
        <span className={styles.sliderNavCounterCurrent}>
          {currentIndex + 1}
        </span>
        <span className={styles.sliderNavCounterSeparator}>
          of
        </span>
        <span className={styles.sliderNavCounterTotal}>
          {totalSlides}
        </span>
      </div>
    </div>
  );
}
