"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { SliderContainer } from "@/domains/slider";
import { EmployeeSection, useHomepageEmployees } from "@/domains/employees";
import { Grid, Row, Column } from "@carbon/react";
import styles from "../styles/homepage.module.css";

interface HeroSectionProps {
  locale?: "ne" | "en";
}

export const HeroSection = ({ locale = "en" }: HeroSectionProps) => {
  const t = useTranslations("homepage.hero");
  const { data: homepageEmployees, isLoading } = useHomepageEmployees();

  return (
    <Grid className={styles.heroSection}>
      <Row className={styles.heroGridLayout}>
        {/* Slider - wider column */}
        <Column sm={4} md={6} lg={8} className={styles.sliderContainer}>
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <SliderContainer
              locale={locale}
              height="600px"
              autoPlay={true}
              showNavigation={true}
              showIndicators={true}
              showTitle={true}
            />
          </div>
        </Column>
        {/* Notices - smaller column */}
        <Column sm={4} md={2} lg={4} className={styles.noticesContainer}>
          {!isLoading && homepageEmployees.showUpInHomepage.length > 0 && (
            <EmployeeSection
              employees={homepageEmployees.showUpInHomepage}
              locale={locale}
            />
          )}
        </Column>
      </Row>
    </Grid>
  );
};
