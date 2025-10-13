"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { OfficeDescriptionService } from "@/domains/office-description/services/OfficeDescriptionService";
import {
  OfficeDescriptionResponse,
  TranslatableEntity,
} from "@/domains/header/types/header";
import { Grid, Row, Column, Tile, Button, SkeletonText, FlexGrid } from "@carbon/react";
import styles from "../styles/homepage.module.css";
import { NoticesSidebar } from "@/domains/notices";

interface IntroductionSectionProps {
  locale?: "ne" | "en";
  className?: string;
}

export const IntroductionSection: React.FC<IntroductionSectionProps> = ({
  locale,
  className = "",
}) => {
  const currentLocale = useLocale() as "ne" | "en";
  const effectiveLocale = locale || currentLocale;
  const router = useRouter();
  const t = useTranslations("homepage.introduction");

  const [introduction, setIntroduction] = React.useState<OfficeDescriptionResponse | null>(null);
  const [objectives, setObjectives] = React.useState<OfficeDescriptionResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const handleReadMore = () => {
    router.push(`/${effectiveLocale}/content/about/introduction`);
  };

  const handleObjectivesReadMore = () => {
    router.push(`/${effectiveLocale}/content/about/objectives`);
  };

  React.useEffect(() => {
    const fetchOfficeDescriptions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [introRes] = await Promise.allSettled([
          OfficeDescriptionService.getOfficeIntroduction(effectiveLocale),
        ]);

        if (introRes.status === "fulfilled") {
          setIntroduction(introRes.value);
        } else {
          console.error("Failed to fetch introduction:", introRes.reason);
          const message = introRes.reason instanceof Error ? introRes.reason.message : String(introRes.reason);
          setError(message || "Failed to load content");
        }
      } catch (err) {
        console.error("Unexpected error fetching office descriptions:", err);
        const message = err instanceof Error ? err.message : String(err);
        setError(message || "Failed to load content");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOfficeDescriptions();
  }, [effectiveLocale]);

  const getLocalizedText = (entity: TranslatableEntity): string => {
    return entity[effectiveLocale] || entity.en || entity.ne || "";
  };

  // Helper function to safely extract text values that might be translation objects with {en, ne} keys
  const getLocalizedTranslation = (
    text: any,
    fallback: string = ""
  ): string => {
    if (typeof text === "string") {
      return text;
    }
    if (text && typeof text === "object") {
      // Handle case where text is {en: "...", ne: "..."}
      if (effectiveLocale === "ne" && text.ne) {
        return text.ne;
      }
      if (effectiveLocale === "en" && text.en) {
        return text.en;
      }
      // Fallback to any available text
      return text.ne || text.en || fallback;
    }
    return fallback;
  };

  const formatContent = (content: string): string => {
    // Remove excessive whitespace and format for display
    return content.trim().replace(/\n{3,}/g, "\n\n");
  };

  // Avoid rendering on server to prevent hydration mismatches
  if (typeof window === "undefined") {
    return null;
  }

  // Loading state: show skeletons
  if (isLoading) {
    return (
      <Grid>
        <Column lg={8} md={8} sm={16}>
          <Tile
            style={{
              padding: "2rem",
              minHeight: "220px",
              height: "100%",
            }}
          >
            <SkeletonText heading width="60%" />
            <SkeletonText paragraph width="100%" lineCount={3} />
          </Tile>
        </Column>
        <Column lg={8} md={8} sm={16}>
          <Tile
            style={{
              minHeight: "220px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SkeletonText width="80%" lineCount={2} />
          </Tile>
        </Column>
      </Grid>
    );
  }

  // Error state: show a helpful message so user sees why nothing is displayed
  if (error) {
    return (
      <Grid fullWidth className={styles.introductionSection}>
        <Column lg={8} md={8} sm={8}>
          <Tile style={{ padding: "2rem", minHeight: "220px", height: "100%" }}>
            <h2 style={{ fontWeight: 600, fontSize: "1.5rem", marginBottom: "1rem" }}>
              {effectiveLocale === "ne" ? "हाम्रो बारेमा" : "About Us"}
            </h2>
            <p style={{ color: "#b00020" }}>{error}</p>
          </Tile>
        </Column>
        <Column lg={8} md={8} sm={8}>
          <Tile style={{ minHeight: "220px" }}>
            <NoticesSidebar locale={effectiveLocale} />
          </Tile>
        </Column>
      </Grid>
    );
  }

  // No data available: show placeholder to indicate missing introduction
  if (!introduction) {
    return (
      <Grid fullWidth className={styles.introductionSection}>
        <Column lg={8} md={8} sm={8}>
          <Tile style={{ padding: "2rem", minHeight: "220px", height: "100%" }}>
            <h2 style={{ fontWeight: 600, fontSize: "1.5rem", marginBottom: "1rem" }}>
              {effectiveLocale === "ne" ? "हाम्रो बारेमा" : "About Us"}
            </h2>
            <p style={{ color: "#525252" }}>{effectiveLocale === "ne" ? "प्रस्तुति उपलब्ध छैन" : "Introduction not available"}</p>
          </Tile>
        </Column>
        <Column lg={8} md={8} sm={8}>
          <Tile style={{ minHeight: "220px" }}>
            <NoticesSidebar locale={effectiveLocale} />
          </Tile>
        </Column>
      </Grid>
    );
  }

  const contentText = getLocalizedText(introduction.content);
  const objectivesText = objectives ? getLocalizedText(objectives.content) : "";

  // Helper function to extract first few objectives
  const getObjectivesList = (text: string): string[] => {
    if (!text) return [];
    const lines = text.split("\n").filter((line) => line.trim());
    return lines
      .slice(0, 4)
      .map((line) => line.replace(/^\d+\.\s*/, "").trim());
  };

  return (
        <Grid fullWidth className={styles.introductionSection}>
            {/* About Us Section */}
            <Column lg={8} md={8} sm={8}>
              <Tile
                style={{ padding: "2rem", minHeight: "220px", height: "100%" }}
              >
                <h2
                  style={{
                    fontWeight: 600,
                    fontSize: "1.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  {effectiveLocale === "ne" ? "हाम्रो बारेमा" : "About Us"}
                </h2>

                <h3
                  style={{
                    fontWeight: 500,
                    fontSize: "1.1rem",
                    marginBottom: "0.75rem",
                    color: "#198038",
                  }}
                >
                  {effectiveLocale === "ne" ? "परिचय" : "Introduction"}
                </h3>

                {formatContent(contentText)
                  .split("\n\n")
                  .slice(0, 2)
                  .map((paragraph, index) => (
                    <p
                      key={index}
                      style={{
                        marginBottom: "0.75rem",
                        color: "#525252",
                        fontSize: "1rem",
                      }}
                    >
                      {paragraph}
                    </p>
                  ))}

                <Button
                  kind="ghost"
                  size="sm"
                  style={{
                    marginTop: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                  }}
                  onClick={handleReadMore}
                >
                  {getLocalizedTranslation(t("read_more"))}
                </Button>
              </Tile>
            </Column>

            {/* Objectives Section */}
            <Column lg={8} md={8} sm={8}>
              
              <NoticesSidebar locale={effectiveLocale} />
            </Column>
        </Grid>
  );
};
