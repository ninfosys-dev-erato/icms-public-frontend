import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const withNextIntl = createNextIntlPlugin();

/** -------- Env plumbing & safety -------- */
const PUBLIC_API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
// Optional: allow a server-only API_BASE_URL, else reuse public
const PROXY_API = (process.env.API_BASE_URL || PUBLIC_API || "").replace(
  /\/$/,
  ""
);

if (process.env.NODE_ENV === "production" && !PUBLIC_API) {
  throw new Error(
    "❌ NEXT_PUBLIC_API_BASE_URL is required at build time for production."
  );
}

/** -------- Config -------- */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Make sure values are baked into the client bundle during build
  env: {
    NEXT_PUBLIC_API_BASE_URL: PUBLIC_API,
    NEXT_PUBLIC_DEBUG: process.env.NEXT_PUBLIC_DEBUG ?? "false",
  },

  // Performance & DX
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    optimizePackageImports: ["@carbon/react", "@carbon/icons-react"],
    optimizeCss: true,
  },

  // Server externals
  serverExternalPackages: ["@prisma/client"],

  // Output for Docker (standalone)
  output: "standalone",

  // Image optimization (Backblaze B2)
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: "f003.backblazeb2.com",
        port: "",
        pathname: "/file/iCMS-bucket/**",
      },
      // Wildcard subdomains (supported by Next) for other B2 endpoints
      {
        protocol: "https",
        hostname: "**.backblazeb2.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "backblazeb2.com",
        port: "",
        pathname: "/**",
      },
      // Cloudflare R2 storage
      {
        protocol: "https",
        hostname: "069326688ed055ed59d015f75a9710fa.r2.cloudflarestorage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // Compression & caching headers
  compress: true,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, stale-while-revalidate=600",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Rewrite browser calls to Next → external API (avoids CORS)
  async rewrites() {
    // If PROXY_API is unset (e.g., during local dev), don't add rewrites
    if (!PROXY_API) return [];

    return [
      // Your client can call /api/v1/* and Next will proxy to the real base
      {
        source: "/api/v1/:path*",
        destination: `${PROXY_API}/:path*`,
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      { source: "/", destination: "/ne", permanent: true },
      { source: "/homepage", destination: "/", permanent: true },
    ];
  },

  // Optional bundle analyzer
  ...(process.env.ANALYZE === "true" && {
    webpack: (config) => {
      config.plugins.push(
        new (require("@next/bundle-analyzer"))({ enabled: true })
      );
      return config;
    },
  }),
};

export default withNextIntl(nextConfig);
