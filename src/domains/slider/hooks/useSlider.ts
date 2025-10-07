"use client";

import { useEffect, useRef, useCallback } from 'react';
import { 
  useSliderStore,
  useSliderData,
  useSliderLoading,
  useSliderError,
  useSliderFetchData,
  useSliderClearError,
  useIsSliderReady,
  useSliderSetCurrentIndex,
  useSliderNextSlide,
  useSliderPreviousSlide,
  useSliderPlay,
  useSliderPause,
  useSliderSetTransitioning,
  useCurrentSlider,
  useTotalSlides
} from '../stores/slider-store';
import { SliderService } from '../services/SliderService';

const sliderService = new SliderService();

/**
 * Main hook for slider functionality
 * Uses Zustand implementation for consistent hook ordering
 */
export function useSlider(locale: 'ne' | 'en') {
  const data = useSliderData();
  const isLoading = useSliderLoading();
  const error = useSliderError();
  const isReady = useIsSliderReady();
  const fetchSliderData = useSliderFetchData();
  const clearError = useSliderClearError();
  const hasFetched = useRef(false);

  // Fetch data when needed
  useEffect(() => {
    if (!isLoading && !data && !hasFetched.current) {
      hasFetched.current = true;
      fetchSliderData(locale);
    }
  }, [locale, isLoading, data, fetchSliderData]);

  // Reset fetch flag when locale changes
  useEffect(() => {
    hasFetched.current = false;
  }, [locale]);

  return {
    data,
    isLoading,
    error,
    isReady,
    refetch: () => fetchSliderData(locale),
    clearError,
  };
}

/**
 * Hook for slider control functionality
 */
export function useSliderControl() {
  const setCurrentIndex = useSliderSetCurrentIndex();
  const nextSlide = useSliderNextSlide();
  const previousSlide = useSliderPreviousSlide();
  const play = useSliderPlay();
  const pause = useSliderPause();
  const setTransitioning = useSliderSetTransitioning();
  const currentSlider = useCurrentSlider();
  const totalSlides = useTotalSlides();

  const navigateToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentIndex(index);
    }
  }, [setCurrentIndex, totalSlides]);

  const goToNext = useCallback(() => {
    nextSlide();
  }, [nextSlide]);

  const goToPrevious = useCallback(() => {
    previousSlide();
  }, [previousSlide]);

  const startPlaying = useCallback(() => {
    play();
  }, [play]);

  const stopPlaying = useCallback(() => {
    pause();
  }, [pause]);

  const setTransitionState = useCallback((isTransitioning: boolean) => {
    setTransitioning(isTransitioning);
  }, [setTransitioning]);

  return {
    currentSlider,
    totalSlides,
    navigateToSlide,
    goToNext,
    goToPrevious,
    startPlaying,
    stopPlaying,
    setTransitionState,
  };
}

/**
 * Hook for slider auto-play functionality
 */
export function useSliderAutoPlay(autoPlay: boolean = true, interval: number = 5000, locale: 'ne' | 'en' = 'en') {
  const { data, isReady } = useSlider(locale);
  const { goToNext, startPlaying, stopPlaying } = useSliderControl();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start auto-play
  const startAutoPlay = useCallback(() => {
    if (!autoPlay || !isReady || !data?.sliders || data.sliders.length <= 1) {
      return;
    }

    stopAutoPlay();
    
    intervalRef.current = setInterval(() => {
      goToNext();
    }, interval);
  }, [autoPlay, isReady, data?.sliders, goToNext, interval]);

  // Stop auto-play
  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Pause auto-play
  const pauseAutoPlay = useCallback(() => {
    stopAutoPlay();
    stopPlaying();
  }, [stopAutoPlay, stopPlaying]);

  // Resume auto-play
  const resumeAutoPlay = useCallback(() => {
    startAutoPlay();
    startPlaying();
  }, [startAutoPlay, startPlaying]);

  // Auto-play effect
  useEffect(() => {
    if (autoPlay && isReady) {
      startAutoPlay();
    }

    return () => {
      stopAutoPlay();
    };
  }, [autoPlay, isReady, startAutoPlay, stopAutoPlay]);

  // Pause on hover (optional)
  const handleMouseEnter = useCallback(() => {
    if (autoPlay) {
      pauseAutoPlay();
    }
  }, [autoPlay, pauseAutoPlay]);

  const handleMouseLeave = useCallback(() => {
    if (autoPlay) {
      resumeAutoPlay();
    }
  }, [autoPlay, resumeAutoPlay]);

  return {
    startAutoPlay,
    stopAutoPlay,
    pauseAutoPlay,
    resumeAutoPlay,
    handleMouseEnter,
    handleMouseLeave,
  };
}

/**
 * Hook for getting localized text
 */
export function useSliderLocalization(locale: 'ne' | 'en') {
  const getText = (entity: { ne: string; en: string }) => {
    return sliderService.getLocalizedText(entity, locale);
  };

  return { getText };
}

/**
 * Hook for slider analytics
 */
export function useSliderAnalytics() {
  const trackView = useCallback(async (sliderId: string) => {
    try {
      await sliderService.trackSliderView(sliderId);
    } catch (error) {
      console.warn('Failed to track slider view:', error);
    }
  }, []);

  const trackClick = useCallback(async (sliderId: string) => {
    try {
      await sliderService.trackSliderClick(sliderId);
    } catch (error) {
      console.warn('Failed to track slider click:', error);
    }
  }, []);

  return {
    trackView,
    trackClick,
  };
}

/**
 * Hook for slider keyboard navigation
 */
export function useSliderKeyboardNavigation() {
  const { goToNext, goToPrevious, navigateToSlide } = useSliderControl();
  const { totalSlides } = useSliderControl();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        goToPrevious();
        break;
      case 'ArrowRight':
        event.preventDefault();
        goToNext();
        break;
      case 'Home':
        event.preventDefault();
        navigateToSlide(0);
        break;
      case 'End':
        event.preventDefault();
        navigateToSlide(totalSlides - 1);
        break;
      case ' ':
        event.preventDefault();
        // Toggle play/pause
        break;
    }
  }, [goToNext, goToPrevious, navigateToSlide, totalSlides]);

  return { handleKeyDown };
}
