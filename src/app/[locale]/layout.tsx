// // import { ReactNode } from "react";
// // import { Metadata } from "next";
// // import { NextIntlClientProvider } from "next-intl";
// // import { getMessages } from "next-intl/server";
// // import { notFound } from "next/navigation";
// // import { locales } from "@/i18n/config";
// // import { getTextDirection } from "@/lib/i18n-utils";
// // import "@/app/globals.css";
// // import styles from "./layout.module.css";
// // import { HeaderTop } from "@/domains/header/components/HeaderTop";
// // import { HeaderMain } from "@/domains/header/components/HeaderMain";
// // import { HeaderService } from "@/domains/header/services/HeaderService";
// // import { FooterContainer } from "@/domains/footer";
// // import HideOn404 from '@/components/HideOn404';



// // interface RootLayoutProps {
// //   children: ReactNode;
// //   params: Promise<{ locale: string }>;
// // }

// // export function generateStaticParams() {
// //   return locales.map((locale) => ({ locale }));
// // }

// // export async function generateMetadata({
// //   params,
// // }: {
// //   params: Promise<{ locale: string }>;
// // }): Promise<Metadata> {
// //   const { locale } = await params;
  
// //   return {
// //     title: {
// //       template: locale === "ne" 
// //         ? "%s | नेपाल सरकार पोर्टल" 
// //         : "%s | Nepal Government Portal",
// //       default: locale === "ne" 
// //         ? "नेपाल सरकार पोर्टल" 
// //         : "Nepal Government Portal",
// //     },
// //     description: locale === "ne"
// //       ? "नेपाल सरकारको आधिकारिक पोर्टल - सूचनाहरू, सेवाहरू, र दस्तावेजहरू"
// //       : "Official Portal of Government of Nepal - Notices, Services, and Documents",
// //     keywords: locale === "ne"
// //       ? ["नेपाल सरकार", "सूचना", "सेवा", "दस्तावेज", "निविदा", "भर्ना"]
// //       : ["nepal government", "notices", "services", "documents", "tender", "vacancy"],
// //     authors: [{ name: "Government of Nepal" }],
// //     creator: "Government of Nepal",
// //     publisher: "Government of Nepal",
// //     formatDetection: {
// //       email: false,
// //       address: false,
// //       telephone: false,
// //     },
// //     metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
// //     alternates: {
// //       canonical: `/${locale}`,
// //       languages: {
// //         "ne": "/ne",
// //         "en": "/en",
// //       },
// //     },
// //     icons: {
// //       icon: [
// //         { url: '/icons/favicon.svg', type: 'image/svg+xml' }
// //       ],
// //       shortcut: '/icons/favicon.svg'
// //     },
// //     manifest: '/manifest.json',
// //     openGraph: {
// //       type: "website",
// //       locale: locale === "ne" ? "ne_NP" : "en_US",
// //       url: `/${locale}`,
// //       title: locale === "ne" 
// //         ? "नेपाल सरकार पोर्टल" 
// //         : "Nepal Government Portal",
// //       description: locale === "ne"
// //         ? "नेपाल सरकारको आधिकारिक पोर्टल"
// //         : "Official Portal of Government of Nepal",
// //       siteName: locale === "ne" 
// //         ? "नेपाल सरकार पोर्टल" 
// //         : "Nepal Government Portal",
// //     },
// //     twitter: {
// //       card: "summary_large_image",
// //       title: locale === "ne" 
// //         ? "नेपाल सरकार पोर्टल" 
// //         : "Nepal Government Portal",
// //       description: locale === "ne"
// //         ? "नेपाल सरकारको आधिकारिक पोर्टल"
// //         : "Official Portal of Government of Nepal",
// //     },
// //     robots: {
// //       index: true,
// //       follow: true,
// //       googleBot: {
// //         index: true,
// //         follow: true,
// //         "max-video-preview": -1,
// //         "max-image-preview": "large",
// //         "max-snippet": -1,
// //       },
// //     },
// //   };
// // }

// // export default async function RootLayout({
// //   children,
// //   params,
// // }: RootLayoutProps) {
// //   const { locale } = await params;
  
// //   // Ensure that the incoming `locale` is valid
// //   if (!locales.includes(locale as any)) {
// //     notFound();
// //   }

// //   // Prefer loading our curated `src/messages/<locale>.json` which contains
// //   // domain-specific namespaces (e.g. `hr`, `hr.filters`, etc). Fall back to
// //   // the framework loader `getMessages()` if the file isn't available.
// //   let messages: Record<string, any> = {};
// //   try {
// //     // Dynamic import of the compiled JSON message bundles located under src/messages
// //     // This ensures domain keys like `hr.filters` and `hr.employees` are available.
// //     // Use a relative import path that Vite/Next will handle at build time.
// //     // eslint-disable-next-line @typescript-eslint/no-var-requires
// //     // Note: `await import()` with a template literal is not statically analyzable by some
// //     // bundlers; keep the explicit paths for the supported locales only.
// //     if (locale === 'en') {
// //       // eslint-disable-next-line @typescript-eslint/no-var-requires
// //       messages = (await import('@/messages/en.json')).default as any;
// //     } else if (locale === 'ne') {
// //       // eslint-disable-next-line @typescript-eslint/no-var-requires
// //       messages = (await import('@/messages/ne.json')).default as any;
// //     }
// //   } catch (err) {
// //     // If our curated messages can't be loaded for any reason, fall back to the
// //     // runtime message loader which reads from the /locales directory.
// //     console.warn('Could not load src/messages bundle for locale', locale, err);
// //     messages = await getMessages();
// //   }
// //   const textDirection = getTextDirection(locale as 'ne' | 'en');
// //   // Fetch header data server-side for SSR/SSG hydration
// //   const headerData = await HeaderService.getHeaderData(locale as 'ne' | 'en');

// //   return (
// //     <NextIntlClientProvider messages={messages} locale={locale as 'ne' | 'en'}>
// //       <a href="#main-content" className={styles.skipToContent}>
// //         {locale === "ne" ? "मुख्य सामग्रीमा जानुहोस्" : "Skip to main content"}
// //       </a>
// //       <div className={styles.appLayout}>
// //         {/* Header component - SSR/SSG hydrated */}
// //         <header>
// //           <HeaderTop data={headerData} locale={locale as 'ne' | 'en'} />
// //           <div className={styles.headerMainResponsive}>
// //             <HeaderMain data={headerData} locale={locale as 'ne' | 'en'} />
// //           </div>
// //         </header>
        
// //         {/* Simple Navigation - temporary for testing */}
        
// //         <main className={styles.appMain} id="main-content">
// //           {children}
// //         </main>
        
// //         {/* Footer component */}
// //         <FooterContainer locale={locale as 'ne' | 'en'} />
// //       </div>
// //     </NextIntlClientProvider>
// //   );
// // }



// import { ReactNode } from "react";
// import { Metadata } from "next";
// import { NextIntlClientProvider } from "next-intl";
// import { getMessages } from "next-intl/server";
// import { notFound } from "next/navigation";
// import { locales } from "@/i18n/config";
// import { getTextDirection } from "@/lib/i18n-utils";
// import "@/app/globals.css";
// import styles from "./layout.module.css";
// import { HeaderTop } from "@/domains/header/components/HeaderTop";
// import { HeaderMain } from "@/domains/header/components/HeaderMain";
// import { HeaderService } from "@/domains/header/services/HeaderService";
// import { FooterContainer } from "@/domains/footer";
// import HideOn404 from "@/components/HideOn404";

// interface RootLayoutProps {
//   children: ReactNode;
//   params: Promise<{ locale: string }>;
// }

// export function generateStaticParams() {
//   return locales.map((locale) => ({ locale }));
// }

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ locale: string }>;
// }): Promise<Metadata> {
//   const { locale } = await params;

//   return {
//     title: {
//       template:
//         locale === "ne" ? "%s | नेपाल सरकार पोर्टल" : "%s | Nepal Government Portal",
//       default: locale === "ne" ? "नेपाल सरकार पोर्टल" : "Nepal Government Portal",
//     },
//     description:
//       locale === "ne"
//         ? "नेपाल सरकारको आधिकारिक पोर्टल - सूचनाहरू, सेवाहरू, र दस्तावेजहरू"
//         : "Official Portal of Government of Nepal - Notices, Services, and Documents",
//     keywords:
//       locale === "ne"
//         ? ["नेपाल सरकार", "सूचना", "सेवा", "दस्तावेज", "निविदा", "भर्ना"]
//         : ["nepal government", "notices", "services", "documents", "tender", "vacancy"],
//     authors: [{ name: "Government of Nepal" }],
//     creator: "Government of Nepal",
//     publisher: "Government of Nepal",
//     formatDetection: { email: false, address: false, telephone: false },
//     metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
//     alternates: {
//       canonical: `/${locale}`,
//       languages: { ne: "/ne", en: "/en" },
//     },
//     icons: { icon: [{ url: "/icons/favicon.svg", type: "image/svg+xml" }], shortcut: "/icons/favicon.svg" },
//     manifest: "/manifest.json",
//     openGraph: {
//       type: "website",
//       locale: locale === "ne" ? "ne_NP" : "en_US",
//       url: `/${locale}`,
//       title: locale === "ne" ? "नेपाल सरकार पोर्टल" : "Nepal Government Portal",
//       description: locale === "ne" ? "नेपाल सरकारको आधिकारिक पोर्टल" : "Official Portal of Government of Nepal",
//       siteName: locale === "ne" ? "नेपाल सरकार पोर्टल" : "Nepal Government Portal",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: locale === "ne" ? "नेपाल सरकार पोर्टल" : "Nepal Government Portal",
//       description: locale === "ne" ? "नेपाल सरकारको आधिकारिक पोर्टल" : "Official Portal of Government of Nepal",
//     },
//     robots: {
//       index: true,
//       follow: true,
//       googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
//     },
//   };
// }

// export default async function RootLayout({ children, params }: RootLayoutProps) {
//   const { locale } = await params;

//   if (!locales.includes(locale as any)) {
//     notFound();
//   }

//   let messages: Record<string, any> = {};
//   try {
//     if (locale === "en") {
//       messages = (await import("@/messages/en.json")).default as any;
//     } else if (locale === "ne") {
//       messages = (await import("@/messages/ne.json")).default as any;
//     }
//   } catch (err) {
//     console.warn("Could not load src/messages bundle for locale", locale, err);
//     messages = await getMessages();
//   }

//   const textDirection = getTextDirection(locale as "ne" | "en");
//   const headerData = await HeaderService.getHeaderData(locale as "ne" | "en");

//   return (
//     <NextIntlClientProvider messages={messages} locale={locale as "ne" | "en"}>
//       <a href="#main-content" className={styles.skipToContent}>
//         {locale === "ne" ? "मुख्य सामग्रीमा जानुहोस्" : "Skip to main content"}
//       </a>

//       <div className={styles.appLayout}>
//         {/* Header (hidden on 404) */}
//         <HideOn404>
//           <header>
//             <HeaderTop data={headerData} locale={locale as "ne" | "en"} />
//             <div className={styles.headerMainResponsive}>
//               <HeaderMain data={headerData} locale={locale as "ne" | "en"} />
//             </div>
//           </header>
//         </HideOn404>

//         {/* Page content */}
//         <main className={styles.appMain} id="main-content">
//           {children}
//         </main>

//         {/* Footer (hidden on 404) */}
//         <HideOn404>
//           <FooterContainer locale={locale as "ne" | "en"} />
//         </HideOn404>
//       </div>
//     </NextIntlClientProvider>
//   );
// }



import { ReactNode } from "react";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { getTextDirection } from "@/lib/i18n-utils";
import "@/app/globals.css";
import styles from "./layout.module.css";
import { HeaderTop } from "@/domains/header/components/HeaderTop";
import { HeaderMain } from "@/domains/header/components/HeaderMain";
import { HeaderService } from "@/domains/header/services/HeaderService";
import { FooterContainer } from "@/domains/footer";

// 👇 new: provider + gate
import { ChromeProvider, ChromeGate } from "@/components/ChromeController";

interface RootLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // ... your existing metadata (unchanged)
  return {
    title: {
      template: locale === "ne" ? "%s | नेपाल सरकार पोर्टल" : "%s | Nepal Government Portal",
      default: locale === "ne" ? "नेपाल सरकार पोर्टल" : "Nepal Government Portal",
    },
    description:
      locale === "ne"
        ? "नेपाल सरकारको आधिकारिक पोर्टल - सूचनाहरू, सेवाहरू, र दस्तावेजहरू"
        : "Official Portal of Government of Nepal - Notices, Services, and Documents",
    keywords:
      locale === "ne"
        ? ["नेपाल सरकार", "सूचना", "सेवा", "दस्तावेज", "निविदा", "भर्ना"]
        : ["nepal government", "notices", "services", "documents", "tender", "vacancy"],
    authors: [{ name: "Government of Nepal" }],
    creator: "Government of Nepal",
    publisher: "Government of Nepal",
    formatDetection: { email: false, address: false, telephone: false },
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
    alternates: { canonical: `/${locale}`, languages: { ne: "/ne", en: "/en" } },
    icons: { icon: [{ url: "/icons/favicon.svg", type: "image/svg+xml" }], shortcut: "/icons/favicon.svg" },
    manifest: "/manifest.json",
    openGraph: {
      type: "website",
      locale: locale === "ne" ? "ne_NP" : "en_US",
      url: `/${locale}`,
      title: locale === "ne" ? "नेपाल सरकार पोर्टल" : "Nepal Government Portal",
      description: locale === "ne" ? "नेपाल सरकारको आधिकारिक पोर्टल" : "Official Portal of Government of Nepal",
      siteName: locale === "ne" ? "नेपाल सरकार पोर्टल" : "Nepal Government Portal",
    },
    twitter: {
      card: "summary_large_image",
      title: locale === "ne" ? "नेपाल सरकार पोर्टल" : "Nepal Government Portal",
      description: locale === "ne" ? "नेपाल सरकारको आधिकारिक पोर्टल" : "Official Portal of Government of Nepal",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  let messages: Record<string, any> = {};
  try {
    // Dynamic import of the compiled JSON message bundles located under src/messages
    // This ensures domain keys like `hr.filters` and `hr.employees` are available.
    // Use a relative import path that Vite/Next will handle at build time.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // Note: `await import()` with a template literal is not statically analyzable by some
    // bundlers; keep the explicit paths for the supported locales only.
    if (locale === 'en') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      messages = (await import('../../../locales/en/common/en.json')).default as any;
    } else if (locale === 'ne') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
    messages = (await import('../../../locales/ne/common/ne.json')).default as any;
    }
  } catch (err) {
    console.warn("Could not load src/messages bundle for locale", locale, err);
    messages = await getMessages();
  }

  const textDirection = getTextDirection(locale as "ne" | "en");
  const headerData = await HeaderService.getHeaderData(locale as "ne" | "en");

  return (
    <NextIntlClientProvider messages={messages} locale={locale as "ne" | "en"}>
      {/* 👇 Provide chrome visibility state to the tree */}
      <ChromeProvider>
        <a href="#main-content" className={styles.skipToContent}>
          {locale === "ne" ? "मुख्य सामग्रीमा जानुहोस्" : "Skip to main content"}
        </a>

        <div className={styles.appLayout}>
          {/* Header (hidden when 404 page requests it) */}
          <ChromeGate>
            <header>
              <HeaderTop data={headerData} locale={locale as "ne" | "en"} />
              <div className={styles.headerMainResponsive}>
                <HeaderMain data={headerData} locale={locale as "ne" | "en"} />
              </div>
            </header>
          </ChromeGate>

          {/* Page content */}
          <main className={styles.appMain} id="main-content">
            {children}
          </main>

          {/* Footer (hidden when 404 page requests it) */}
          <ChromeGate>
            <FooterContainer locale={locale as "ne" | "en"} />
          </ChromeGate>
        </div>
      </ChromeProvider>
    </NextIntlClientProvider>
  );
}
