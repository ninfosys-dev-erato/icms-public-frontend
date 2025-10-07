
import type { Metadata } from "next";
import { ClientProviders } from "@/components/ClientProviders";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "./globals.css";
import AppFrame from '@/components/AppFrame';

export const metadata: Metadata = {
  title: {
    template: "%s | Nepal Government Portal",
    default: "Nepal Government Portal",
  },
  description:
    "Official government portal providing services, information, and resources for citizens of Nepal.",
  keywords: ["nepal", "government", "services", "portal", "official"],
  authors: [{ name: "Government of Nepal" }],
  creator: "Government of Nepal",
  publisher: "Government of Nepal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      ne: "/ne",
    },
  },
  openGraph: {
    title: "Nepal Government Portal",
    description:
      "Official government portal providing services, information, and resources for citizens of Nepal.",
    type: "website",
    locale: "ne_NP",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepal Government Portal",
    description:
      "Official government portal providing services, information, and resources for citizens of Nepal.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  // This hook only works in client components, so we use a workaround for SSR:
  let is404 = false;
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    is404 = path.includes('/not-found') || path.includes('/404');
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Critical resources only */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//api.example.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('ui-store') ?
                    JSON.parse(localStorage.getItem('ui-store')).state.theme : 'light';
                  var fontSize = localStorage.getItem('ui-store') ?
                    JSON.parse(localStorage.getItem('ui-store')).state.fontSize : 'medium';
                  document.documentElement.setAttribute('data-carbon-theme', theme);
                  document.documentElement.setAttribute('data-font-size', fontSize);
                } catch (e) {
                  document.documentElement.setAttribute('data-carbon-theme', 'light');
                  document.documentElement.setAttribute('data-font-size', 'medium');
                }
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ClientProviders>
          <ThemeProvider>
            <AppFrame>{children}</AppFrame>
          </ThemeProvider>
        </ClientProviders>
      </body>
    </html>
  );
}






