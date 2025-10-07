'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import styles from '../styles/homepage.module.css';

interface SlideItem {
  id: string;
  title: { en: string; ne: string };
  description: { en: string; ne: string };
  image: string;
}

interface SimpleSliderProps {
  locale?: 'ne' | 'en';
  height?: string;
  className?: string;
}

// Static slider data
const slidersData: SlideItem[] = [
  {
    id: '1',
    title: { en: 'Welcome to Nepal', ne: 'नेपालमा स्वागत' },
    description: { en: 'Official Government Portal', ne: 'आधिकारिक सरकारी पोर्टल' },
    image: '/images/slider/slide1.jpg',
  },
  {
    id: '2', 
    title: { en: 'Digital Nepal', ne: 'डिजिटल नेपाल' },
    description: { en: 'Modern Digital Services', ne: 'आधुनिक डिजिटल सेवाहरू' },
    image: '/images/slider/slide2.jpg',
  },
  {
    id: '3',
    title: { en: 'Prosperous Nepal', ne: 'समृद्ध नेपाल' },
    description: { en: 'Building a Better Future', ne: 'राम्रो भविष्य निर्माण' },
    image: '/images/slider/slide3.jpg',
  }
];

export const SimpleSlider = ({ locale = 'en', height = '800px', className = '' }: SimpleSliderProps) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const t = useTranslations('slider');

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidersData.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlider = slidersData[currentSlide];

  return (
    <div className={`${styles.simpleSlider} ${className}`} style={{ height }}>
      <div className={styles.slideContainer}>
        <div 
          className={styles.slide}
          style={{
            backgroundImage: `url(${currentSlider.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className={styles.slideOverlay}>
            <div className={styles.slideContent}>
              <h1 className={styles.slideTitle}>
                {currentSlider.title[locale] || currentSlider.title.en}
              </h1>
              <p className={styles.slideDescription}>
                {currentSlider.description[locale] || currentSlider.description.en}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      <div className={styles.sliderIndicators}>
        {slidersData.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        className={`${styles.sliderArrow} ${styles.prevArrow}`}
        onClick={() => goToSlide((currentSlide - 1 + slidersData.length) % slidersData.length)}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        className={`${styles.sliderArrow} ${styles.nextArrow}`}
        onClick={() => goToSlide((currentSlide + 1) % slidersData.length)}
        aria-label="Next slide"
      >
        ›
      </button>
    </div>
  );
};