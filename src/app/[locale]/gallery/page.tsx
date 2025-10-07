import React from "react";
import { getTranslations } from "next-intl/server";
import { GalleryPageContainer } from "@/domains/media/components/GalleryPageContainer";

interface GalleryPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    tags?: string;
  }>;
}

export async function generateMetadata({ params }: GalleryPageProps) {
  const resolvedParams = await params;
  const t = await getTranslations("media.gallery");

  // Helper function to safely extract text values that might be objects with {en, ne} keys
  const getLocalizedText = (text: any, fallback: string = ""): string => {
    if (typeof text === "string") {
      return text;
    }
    if (text && typeof text === "object") {
      // Handle case where text is {en: "...", ne: "..."}
      const locale = resolvedParams.locale;
      if (locale === "ne" && text.ne) {
        return text.ne;
      }
      if (locale === "en" && text.en) {
        return text.en;
      }
      // Fallback to any available text
      return text.ne || text.en || fallback;
    }
    return fallback;
  };

  return {
    title: getLocalizedText(t("title")),
    description: getLocalizedText(t("description")),
  };
}

export default async function GalleryPage({
  params,
  searchParams,
}: GalleryPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const page = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page)
    : 1;
  const limit = resolvedSearchParams.limit
    ? parseInt(resolvedSearchParams.limit)
    : 20;
  const search = resolvedSearchParams.search || "";
  const tags = resolvedSearchParams.tags || "";

  return (
    <GalleryPageContainer
      locale={resolvedParams.locale as "en" | "ne"}
      initialPage={page}
      initialLimit={limit}
      initialSearch={search}
      initialTags={tags}
    />
  );
}
