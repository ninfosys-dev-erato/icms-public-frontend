"use client";

import { ReactNode, useEffect, useState } from "react";

interface HydrationSafeWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A wrapper component that prevents hydration mismatches by ensuring
 * content only renders on the client side after hydration is complete.
 *
 * IMPORTANT: Only use this for components that:
 * - Use browser APIs (localStorage, window, etc.)
 * - Have different server vs client rendering
 * - Use dynamic content that changes between renders
 *
 * DO NOT wrap providers or components that other components depend on
 * during the initial render, as this can cause dependency issues.
 */
export function HydrationSafeWrapper({
  children,
  fallback = null,
}: HydrationSafeWrapperProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // During SSR and initial hydration, show fallback or nothing
  if (!isHydrated) {
    return <>{fallback}</>;
  }

  // After hydration, render the actual content
  return <>{children}</>;
}

/**
 * Hook to check if hydration is complete
 * Use this for components that need to know when they can safely
 * access browser APIs or perform client-side operations
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
