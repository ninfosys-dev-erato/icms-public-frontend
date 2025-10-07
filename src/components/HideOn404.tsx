// 'use client';

// import { ReactNode } from 'react';
// import { usePathname } from 'next/navigation';

// export default function HideOn404({ children }: { children: ReactNode }) {
//   const pathname = usePathname();
//   const is404 = pathname.includes('/not-found') || pathname.includes('/404');
//   if (is404) return null;        // Don’t render header/footer on 404
//   return <>{children}</>;
// }


"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function HideOn404({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Works for /[locale]/404 and /[locale]/not-found
  const is404 = pathname?.includes("/404") || pathname?.includes("/not-found");
  if (is404) return null;
  return <>{children}</>;
}
