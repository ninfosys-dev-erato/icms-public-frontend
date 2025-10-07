"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

interface QueryProviderMinimalProps {
  children: React.ReactNode;
}

export function QueryProviderMinimal({ children }: QueryProviderMinimalProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Default settings for most data
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 30, // 30 minutes
            retry: 2,
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 10000),
            refetchOnWindowFocus: false, // Prevent unnecessary refetches
            refetchOnReconnect: true,
            // CRITICAL: Set initial data state for SSR consistency
            initialData: undefined, // Ensure consistent loading state
            placeholderData: undefined, // No placeholder data to prevent mismatch
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
