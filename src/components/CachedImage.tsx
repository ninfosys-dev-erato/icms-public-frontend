"use client";

import React from 'react';
import Image from 'next/image';
import { useBackblazeImage } from '@/utils/backblazeImageCache';

interface CachedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export function CachedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  priority = false,
  fill = false,
  sizes,
  style,
  onLoad,
  onError,
  placeholder = 'empty',
  blurDataURL
}: CachedImageProps) {
  const { cachedUrl, isLoading, error } = useBackblazeImage(src);

  // Show loading placeholder
  if (isLoading) {
    return (
      <div 
        className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}
        style={{ width, height, ...style }}
      >
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  // Show error state
  if (error || !cachedUrl) {
    return (
      <div 
        className={`${className} bg-gray-100 flex items-center justify-center border border-gray-300`}
        style={{ width, height, ...style }}
      >
        <div className="text-gray-500 text-sm">Image unavailable</div>
      </div>
    );
  }

  // Render optimized image
  const imageProps: any = {
    src: cachedUrl,
    alt,
    className,
    priority,
    style,
    onLoad,
    onError,
    placeholder,
    blurDataURL,
  };

  if (fill) {
    imageProps.fill = true;
    if (sizes) imageProps.sizes = sizes;
  } else {
    imageProps.width = width;
    imageProps.height = height;
  }

  return <Image {...imageProps} />;
}

// HOC for wrapping existing img elements
export function withCachedImage<T extends { src?: string; [key: string]: any }>(
  Component: React.ComponentType<T>
) {
  return function CachedImageWrapper(props: T) {
    const { cachedUrl } = useBackblazeImage(props.src || null);
    
    return <Component {...props} src={cachedUrl || props.src} />;
  };
}