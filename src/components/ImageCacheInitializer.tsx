"use client";

import { useEffect } from 'react';
import { registerServiceWorker, preloadCriticalImages } from '@/utils/serviceWorkerRegistration';

const CRITICAL_IMAGES = [
  '/icons/nepal-emblem.svg',
  '/images/slider/slide1.jpg',
  '/images/slider/slide2.jpg', 
  '/images/slider/slide3.jpg',
  '/images/employees/chief-secretary.jpg',
  '/images/employees/joint-secretary.jpg'
];

export function ImageCacheInitializer() {
  useEffect(() => {
    // Register service worker for image caching
    registerServiceWorker();
    
    // Preload critical images
    preloadCriticalImages(CRITICAL_IMAGES);
    
    // Create invisible images to force browser cache
    const preloadImages = () => {
      CRITICAL_IMAGES.forEach((src, index) => {
        setTimeout(() => {
          const img = new Image();
          img.src = src;
          img.style.display = 'none';
          img.loading = 'eager';
          img.fetchPriority = index === 0 ? 'high' : 'medium';
          
          // Add to DOM briefly then remove
          document.body.appendChild(img);
          setTimeout(() => {
            document.body.removeChild(img);
          }, 100);
        }, index * 20);
      });
    };
    
    // Start preloading after a short delay
    setTimeout(preloadImages, 500);
  }, []);

  return null;
}