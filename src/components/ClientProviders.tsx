"use client";

import { type ReactNode } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { QueryProviderMinimal } from "@/components/QueryProviderMinimal";

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryProviderMinimal>{children}</QueryProviderMinimal>
    </ErrorBoundary>
  );
}
