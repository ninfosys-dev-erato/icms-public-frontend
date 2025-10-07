"use client";

import React, { useState, useEffect } from 'react';
import { SliderContainer } from './SliderContainer';
import { SliderProps } from '../types/slider';
import styles from '../styles/slider.module.css';

export function ClientSliderContainer(props: SliderProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Show skeleton during SSR and initial client render
  if (!hasMounted) {
    return (
      <div className={`${styles.sliderSkeleton} ${props.className || ''}`}>
        <div className={styles.sliderSkeletonContent}></div>
      </div>
    );
  }

  return <SliderContainer {...props} />;
}
