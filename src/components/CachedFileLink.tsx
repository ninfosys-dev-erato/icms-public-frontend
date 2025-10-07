"use client";

import React from 'react';
import { useCachedFile } from '@/utils/fileCacheService';

interface CachedFileLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  download?: boolean;
  target?: '_blank' | '_self';
  onClick?: () => void;
}

export function CachedFileLink({ 
  href, 
  children, 
  className = '',
  download = false,
  target = '_blank',
  onClick
}: CachedFileLinkProps) {
  const { cachedUrl, isLoading, error, fileId, isFromiCMS } = useCachedFile(href);

  // Show loading state for iCMS files
  if (isLoading && isFromiCMS) {
    return (
      <span className={`${className} opacity-50 cursor-wait`}>
        {children} (Loading...)
      </span>
    );
  }

  // Show error state
  if (error) {
    return (
      <span className={`${className} text-red-500`} title={error.message}>
        {children} (Error)
      </span>
    );
  }

  // Render the link with cached URL
  return (
    <a
      href={cachedUrl || href}
      className={className}
      target={target}
      download={download}
      onClick={onClick}
      title={fileId ? `File ID: ${fileId}` : undefined}
    >
      {children}
    </a>
  );
}

// Component for PDF preview with caching
export function CachedPDFViewer({ 
  src, 
  width = '100%', 
  height = '600px',
  className = ''
}: {
  src: string;
  width?: string;
  height?: string;
  className?: string;
}) {
  const { cachedUrl, isLoading, error } = useCachedFile(src);

  if (isLoading) {
    return (
      <div 
        className={`${className} flex items-center justify-center bg-gray-100 border border-gray-300`}
        style={{ width, height }}
      >
        <div className="text-gray-500">Loading PDF...</div>
      </div>
    );
  }

  if (error || !cachedUrl) {
    return (
      <div 
        className={`${className} flex items-center justify-center bg-red-50 border border-red-300`}
        style={{ width, height }}
      >
        <div className="text-red-500">Failed to load PDF</div>
      </div>
    );
  }

  return (
    <iframe
      src={cachedUrl}
      width={width}
      height={height}
      className={className}
      title="PDF Viewer"
      style={{ border: '1px solid #ccc' }}
    />
  );
}