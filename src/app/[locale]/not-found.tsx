// // src/app/[locale]/not-found.tsx
// 'use client';

// import { useTranslations } from 'next-intl';
// import Link from 'next/link';
// import { useParams } from 'next/navigation';
// import styles from './not-found.module.css';

// import { FullPageError } from '@carbon/ibm-products';
// import { Button } from '@carbon/react';

// export default function LocaleNotFound() {
//   const t = useTranslations('content.notFound');
//   const params = useParams();
//   const locale = params.locale as string;

//   return (
//     <FullPageError
//       title={t('title') || 'Page not found'}
//       label="Error 404"
//       description={t('description') || 'The page you requested has moved or is unavailable, or the specified URL is not valid. Please check the URL or search the site for the requested content.'}
//       kind="404"
//     >
//       <Button as={Link} href={`/${locale}`} size="lg" kind="primary">
//         {t('actions.backToHome') || 'Back to Home'}
//       </Button>
//     </FullPageError>
//   );
// }



// 'use client';

// import { useEffect } from 'react';
// import { useTranslations } from 'next-intl';
// import Link from 'next/link';
// import { useParams } from 'next/navigation';
// import styles from './not-found.modules.css';

// import { FullPageError } from '@carbon/ibm-products';
// import { Button } from '@carbon/react';

// // ✅ import the chrome controller hook
// import { useChrome } from '@/components/ChromeController';

// export default function LocaleNotFound() {
//   const t = useTranslations('content.notFound');
//   const params = useParams();
//   const locale = params.locale as string;

//   // ✅ hide header/footer while this page is mounted
//   const { setHideChrome } = useChrome();
//   useEffect(() => {
//     setHideChrome(true);
//     return () => setHideChrome(false);
//   }, [setHideChrome]);

//   return (
//     <FullPageError
//       title={t('title') || 'Page not found'}
//       label="Error 404"
//       description={
//         t('description') ||
//         'The page you requested has moved or is unavailable, or the specified URL is not valid. Please check the URL or search the site for the requested content.'
//       }
//       kind="404"
//     >
//       <Button as={Link} href={`/${locale}`} size="lg" kind="primary">
//         {t('actions.backToHome') || 'Back to Home'}
//       </Button>
//     </FullPageError>
//   );
// }


// 'use client';

// import { useEffect } from 'react';
// import Link from 'next/link';
// import { useParams } from 'next/navigation';
// import { useTranslations } from 'next-intl';
// import { useChrome } from '@/components/chrome/ChromeController';

// import Breadcrumbs from '@/components/Breadcrumbs';
// import ProductFooter from '@/components/ProductFooter';

// // ⬇️ Import YOUR local wrapper (alias it so we don't shadow Carbon's name)
// import LocalFullPageError from '@/components/FullPageError';

// import styles from './not-found.module.css';

// export default function LocaleNotFound() {
//   // hide global header/footer from layout
//   const { setHideChrome } = useChrome();
//   useEffect(() => {
//     setHideChrome(true);
//     return () => setHideChrome(false);
//   }, [setHideChrome]);

//   const t = useTranslations('content.notFound');
//   const locale = (useParams()?.locale as string) || 'en';

//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.crumbsBar}>
//         <Breadcrumbs />
//       </div>

//       {/* 2-column layout: left = YOUR FullPageError wrapper, right = illustration */}
//       <section className={styles.panel}>
//         <div className={styles.leftCol}>
//           {/* Renders your src/components/FullPageError.tsx */}
//           <LocalFullPageError />
//         </div>
//         <div className={styles.rightArt} aria-hidden="true" />
//       </section>

//       <ProductFooter />
//     </div>
//   );
// }


// 'use client';

// import { useEffect } from 'react';
// import Link from 'next/link';
// import { useParams } from 'next/navigation';
// import { useTranslations } from 'next-intl';
// import { useChrome } from '@/components/ChromeController';
// import Breadcrumbs from '@/components/Breadcrumbs';
// import ProductFooter from '@/components/ProductFooter';

// import { FullPageError } from '@carbon/ibm-products';
// import styles from './not-found.module.css'; // ← make sure file name matches

// export default function LocaleNotFound() {
//   // hide global header/footer from the main layout
//   const { setHideChrome } = useChrome();
//   useEffect(() => {
//     setHideChrome(true);
//     return () => setHideChrome(false);
//   }, [setHideChrome]);

//   const t = useTranslations('content.notFound');
//   const locale = (useParams()?.locale as string) || 'en';

//   return (
//     <div className={styles.wrapper}>
//       {/* breadcrumb bar */}
//       <div className={styles.crumbsBar}>
//         <Breadcrumbs />
//       </div>

//       {/* main panel (we let Carbon's FullPageError keep its own right-side illustration) */}
//       <div className={styles.panel}>
//         <FullPageError
//           className={styles.fullPageError}   // scoped tweaks to the LEFT side only
//           title={t('title') || 'Page not found'}
//           label="↳ Error 404"                 // we’ll color & size this via CSS
//           description={
//             t('description') ||
//             'The page you requested has moved or is unavailable, or the specified URL is not valid. Please check the URL or search the site for the requested content.'
//           }
//           kind="404"
//         >
//           <ul className={styles.forwardList}>
//             <li><Link href={`/${locale}`}>– Forwarding Link 1</Link></li>
//             <li><Link href={`/${locale}`}>– Forwarding Link 1</Link></li>
//           </ul>
//         </FullPageError>
//       </div>

//       <ProductFooter />
//     </div>
//   );
// }




// // src/app/[locale]/not-found.tsx
// 'use client';

// import { useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import { useChrome } from '@/components/ChromeController';
// import Breadcrumbs from '@/components/Breadcrumbs';
// import ProductFooter from '@/components/ProductFooter';

// import LocalFullPageError from '@/components/FullPageError'; // your fixed component
// import styles from './not-found.module.css';

// export default function LocaleNotFound() {
//   const { setHideChrome } = useChrome();
//   useEffect(() => {
//     setHideChrome(true);          // hide layout header/footer
//     return () => setHideChrome(false);
//   }, [setHideChrome]);

//   // If you still want locale in links, LocalFullPageError already links to "/".
//   // You can customize that component if needed.

//   return (
//     <div className={styles.wrapper}>
//       {/* breadcrumb bar */}
//       <div className={styles.crumbsBar}>
//         <Breadcrumbs />
//       </div>

//       {/* main light-gray section with error content (right art comes from Carbon) */}
//       <div className={styles.panel}>
//         <LocalFullPageError />
//       </div>

//       {/* the single slim footer */}
//       <ProductFooter />
//     </div>
//   );
// }




// 'use client';

// import { useEffect } from 'react';
// import { useChrome } from '@/components/ChromeController';
// import Breadcrumbs from '@/components/Breadcrumbs';
// import ProductFooter from '@/components/ProductFooter';
// import FullPageErrorBlock from '@/components/FullPageError';
// import styles from './not-found.module.css';

// export default function LocaleNotFound() {
//   // Hide the app chrome (layout header/footer + any UiShell) while this page is mounted
//   const { setHideChrome } = useChrome();
//   useEffect(() => {
//     setHideChrome(true);
//     return () => setHideChrome(false);
//   }, [setHideChrome]);

//   return (
//     <div className={styles.wrapper}>
//       {/* Breadcrumb strip */}
//       <div className={styles.crumbsBar}>
//         <Breadcrumbs />
//       </div>

//       {/* Main panel: Carbon’s FullPageError keeps the right illustration */}
//       <div className={styles.panel}>
//         <FullPageErrorBlock className={styles.fullPageError} />
//       </div>

//       {/* The single slim footer shown on the 404 page */}
//       <ProductFooter />
//     </div>
//   );
// }




// // src/app/[locale]/not-found.tsx
// 'use client';

// import { useEffect } from 'react';
// import { useChrome } from '@/components/ChromeController';
// import Breadcrumbs from '@/components/Breadcrumbs';
// import ProductFooter from '@/components/ProductFooter';
// import FullPageErrorBlock from '@/components/FullPageError';
// import styles from './not-found.module.css';

// export default function LocaleNotFound() {
//   const { setHideChrome } = useChrome();

//   useEffect(() => {
//     setHideChrome(true);
//     (window as any).__HIDE_CHROME__ = true;   // <- fallback so AppFrame can see it
//     return () => {
//       setHideChrome(false);
//       (window as any).__HIDE_CHROME__ = false;
//     };
//   }, [setHideChrome]);

//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.crumbsBar}>
//         <Breadcrumbs />
//       </div>

//       <div className={styles.panel}>
//         <FullPageErrorBlock className={styles.fullPageError} />
//       </div>

//       {/* Only one footer on 404 */}
//       <ProductFooter />
//     </div>
//   );
// }






// // src/app/[locale]/not-found.tsx
// 'use client';

// import { useEffect } from 'react';
// import { useChrome } from '@/components/ChromeController';
// import Breadcrumbs from '@/components/Breadcrumbs';
// import ProductFooter from '@/components/ProductFooter';
// import FullPageErrorBlock from '@/components/FullPageError';
// import styles from './not-found.module.css';

// export default function LocaleNotFound() {
//   // still set the signal for any components that listen to it
//   let setHideChrome: (v: boolean) => void = () => {};
//   try {
//     setHideChrome = useChrome().setHideChrome;
//   } catch {}

//   useEffect(() => {
//     setHideChrome?.(true);
//     (window as any).__HIDE_CHROME__ = true;
//     return () => {
//       setHideChrome?.(false);
//       (window as any).__HIDE_CHROME__ = false;
//     };
//   }, [setHideChrome]);

//   return (
//     <div className={styles.wrapper}>
//       {/* Hard override to remove UiShell title/header and extra footers on THIS page */}
//       <style jsx global>{`
//         /* hide Carbon UiShell header bar (IBM Product) */
//         header, .cds--header, .ibm-product-header { display: none !important; }

//         /* keep only ONE footer (the last one rendered on the page) */
//         footer:not(:last-of-type) { display: none !important; }
//       `}</style>

//       <div className={styles.crumbsBar}>
//         <Breadcrumbs />
//       </div>

//       <div className={styles.panel}>
//         {/* Keep single arrow in TSX label; CSS no longer injects one */}
//         <FullPageErrorBlock className={styles.fullPageError} />
//         {/* Spacing for links is handled inside not-found.module.css via .nf-links */}
//       </div>

//       {/* This is the single footer we keep */}
//       <ProductFooter />
//     </div>
//   );
// }


//0 footer 
// // src/app/[locale]/not-found.tsx
// 'use client';

// import { useEffect } from 'react';
// import { useChrome } from '@/components/ChromeController';
// import Breadcrumbs from '@/components/Breadcrumbs';
// import ProductFooter from '@/components/ProductFooter';
// import FullPageErrorBlock from '@/components/FullPageError';
// import styles from './not-found.module.css';

// export default function LocaleNotFound() {
//   // Try to set context flag for AppFrame
//   let setHideChrome: (v: boolean) => void = () => {};
//   try {
//     setHideChrome = useChrome().setHideChrome;
//   } catch {}

//   useEffect(() => {
//     setHideChrome?.(true);
//     (window as any).__HIDE_CHROME__ = true; // fallback that AppFrame reads
//     return () => {
//       setHideChrome?.(false);
//       (window as any).__HIDE_CHROME__ = false;
//     };
//   }, [setHideChrome]);

//   return (
//     <div className={styles.wrapper}>
//       {/* HARD OVERRIDES for this page only */}
//       <style jsx global>{`
//         /* Hide any Carbon/UiShell header ("IBM Product") on this page */
//         header, .cds--header, .ibm-product-header { display: none !important; }

//         /* If anything else renders a footer, hide it. We'll keep only #nf-footer. */
//         footer:not(#nf-footer) { display: none !important; }
//       `}</style>

//       {/* Breadcrumb strip */}
//       <div className={styles.crumbsBar}>
//         <Breadcrumbs />
//       </div>

//       {/* Main panel with the Carbon FullPageError */}
//       <div className={styles.panel}>
//         <div className={styles.fullPageError}>
//           <FullPageErrorBlock />
//           {/* spacing and single-arrow behavior handled in CSS */}
          
//         </div>
//       </div>

//       {/* The single footer we keep */}
//       <footer id="nf-footer">
//         <ProductFooter />
//       </footer>
//     </div>
//   );
// }

//2 footer 

// // src/app/[locale]/not-found.tsx
// 'use client';

// import { useEffect } from 'react';
// import { useChrome } from '@/components/ChromeController';
// import Breadcrumbs from '@/components/Breadcrumbs';
// import ProductFooter from '@/components/ProductFooter';
// import FullPageErrorBlock from '@/components/FullPageError';
// import styles from './not-found.module.css';

// export default function LocaleNotFound() {
//   let setHideChrome: (v: boolean) => void = () => {};
//   try {
//     setHideChrome = useChrome().setHideChrome;
//   } catch {}

//   useEffect(() => {
//     setHideChrome?.(true);
//     (window as any).__HIDE_CHROME__ = true;
//     return () => {
//       setHideChrome?.(false);
//       (window as any).__HIDE_CHROME__ = false;
//     };
//   }, [setHideChrome]);

//   return (
//     <div className={styles.wrapper}>
//       {/* HARD OVERRIDES just for this page */}
//       <style jsx global>{`
//         /* Hide any Carbon/UiShell header ("IBM Product") on this page */
//         header, .cds--header, .ibm-product-header { display: none !important; }

//         /* Keep ONLY our footer with id nf-footer; hide any others */
//         footer:not(#nf-footer) { display: none !important; }
//       `}</style>

//       {/* Breadcrumb strip */}
//       <div className={styles.crumbsBar}>
//         <Breadcrumbs />
//       </div>

//       {/* Main panel with the error block */}
//       <div className={styles.panel}>
//         <div className={styles.fullPageError}>
//           <FullPageErrorBlock />
//           {/* links spacing handled in not-found.module.css via .nf-links if you use it */}
//         </div>
//       </div>

//       {/* Single footer we keep (no wrapper; id lives on the component) */}
//       <ProductFooter id="nf-footer" />
//     </div>
//   );
// }



// src/app/[locale]/not-found.tsx
'use client';

import { useEffect } from 'react';
import { useChrome } from '@/components/ChromeController';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductFooter from '@/components/ProductFooter';
import FullPageErrorBlock from '@/components/FullPageError';
import styles from './not-found.module.css';

export default function LocaleNotFound() {
  // Best effort: set the hide flag for layouts that read it
  let setHideChrome: (v: boolean) => void = () => {};
  try { setHideChrome = useChrome().setHideChrome; } catch {}

  useEffect(() => {
    setHideChrome?.(true);
    (window as any).__HIDE_CHROME__ = true;
    return () => {
      setHideChrome?.(false);
      (window as any).__HIDE_CHROME__ = false;
    };
  }, [setHideChrome]);

  return (
    <div id="nf-root" className={styles.wrapper}>
      {/* PAGE-SCOPED HARD OVERRIDES */}
      <style jsx global>{`
        /* ===== HEADERS: hide ANY UiShell/Carbon header on this page ===== */
        header,
        .cds--header,
        .ibm-product-header,
        .c4p--header,
        .c4p--productive-header,
        .app-header,
        [role="banner"] {
          display: none !important;
        }

        /* If some apps accidentally render multiple headers, hide any siblings too */
        .cds--header ~ .cds--header,
        .ibm-product-header ~ .ibm-product-header,
        .c4p--header ~ .c4p--header {
          display: none !important;
        }

        /* ===== FOOTERS: keep ONLY our footer with id="nf-footer" ===== */
        footer:not(#nf-footer),
        .ibm-footer,
        .c4p--footer {
          display: none !important;
        }
      `}</style>

      {/* Breadcrumb strip */}
      <div className={styles.crumbsBar}>
        <Breadcrumbs />
      </div>

      {/* Error section */}
      <div className={styles.panel}>
        <div className={styles.fullPageError}>
          <FullPageErrorBlock />
        </div>
      </div>

      {/* Our single footer (must have id="nf-footer") */}
      <ProductFooter id="nf-footer" />
    </div>
  );
}
