


// // src/components/AppFrame.tsx
// 'use client';

// import React from 'react';
// import dynamic from 'next/dynamic';

// // Lazy so these never load on 404 when hidden
// const UiShell = dynamic(() => import('@/components/UiShell').then(m => m.UiShell), { ssr: false });
// const ProductFooter = dynamic(() => import('@/components/ProductFooter').then(m => m.default), { ssr: false });

// export default function AppFrame({ children }: { children: React.ReactNode }) {
//   // Primary signal (from ChromeProvider) if available:
//   let hideChrome = false;
//   try {
//     // Optional import to avoid hard dependency if provider isn't mounted above
//     // eslint-disable-next-line @typescript-eslint/no-var-requires
//     const { useChrome } = require('@/components/ChromeController');
//     const chrome = useChrome?.();
//     hideChrome = chrome?.hideChrome ?? false;
//   } catch {
//     // no provider above us – fall back to window flag
//   }

//   // Fallback: global flag set by the 404 page
//   if (!hideChrome && typeof window !== 'undefined') {
//     hideChrome = (window as any).__HIDE_CHROME__ === true;
//   }

//   if (hideChrome) return <>{children}</>;

//   return (
//     <>
//       <UiShell />
//       {children}
//       <ProductFooter />
//     </>
//   );
// }






// src/components/AppFrame.tsx
'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Lazy so these never load on 404 when hidden
const UiShell = dynamic(() => import('@/components/UiShell').then(m => m.UiShell), { ssr: false });
// ⛔️ Remove ProductFooter import (this was causing the duplicate)
// const ProductFooter = dynamic(() => import('@/components/ProductFooter').then(m => m.default), { ssr: false });

export default function AppFrame({ children }: { children: React.ReactNode }) {
  // Primary signal (from ChromeProvider) if available:
  let hideChrome = false;

  try {
    // optional import to avoid hard dependency if provider isn't mounted above
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useChrome } = require('@/components/ChromeController');
    const chrome = useChrome?.();
    hideChrome = chrome?.hideChrome ?? false;
  } catch {}

  // Fallback: global flag set by the 404 page
  if (!hideChrome && typeof window !== 'undefined') {
    hideChrome = (window as any).__HIDE_CHROME__ === true;
  }

  if (hideChrome) return <>{children}</>;

  return (
    <>
      <UiShell />
      {children}
      {/* ⛔️ Removed global ProductFooter to prevent duplicate footers */}
      {/* <ProductFooter /> */}
    </>
  );
}
