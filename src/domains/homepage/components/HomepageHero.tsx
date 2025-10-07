"use client";

import React from 'react';
import { Button, Grid, Column, Tile } from '@carbon/react';
import { ArrowRight } from '@carbon/icons-react';
import { HeroData, HeroStatistic } from '../types/homepage';
import '../styles/homepage.css';

interface HomepageHeroProps {
  data: HeroData;
  currentLanguage: string;
}

export const HomepageHero: React.FC<HomepageHeroProps> = ({
  data,
  currentLanguage
}) => {
  const renderStatistic = (stat: HeroStatistic) => (
    <Column key={stat.id} lg={3} md={6} sm={4}>
      <Tile className="hero-statistic">
        <span 
          className="hero-statistic-icon"
          style={{ color: stat.color }}
        >
          {stat.icon}
        </span>
        <div className="hero-statistic-value">
          {stat.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </div>
        <div className="hero-statistic-label">
          {currentLanguage === 'ne' ? stat.label.ne : stat.label.en}
        </div>
      </Tile>
    </Column>
  );

  return (
    <section className="homepage-hero">
      {/* Background Pattern */}
      <div className="hero-background-pattern" />
      
      <div className="hero-content">
        {/* Hero Text */}
        <div className="hero-text">
          <h1 className="hero-title">
            {currentLanguage === 'ne' ? data.title.ne : data.title.en}
          </h1>
          <p className="hero-subtitle">
            {currentLanguage === 'ne' ? data.subtitle.ne : data.subtitle.en}
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="hero-statistics">
          <Grid fullWidth>
            {data.statistics.map(renderStatistic)}
          </Grid>
        </div>

        {/* Fiscal Year Information */}
        <div className="hero-fiscal-info">
          <div className="fiscal-info-left">
            {currentLanguage === 'ne' ? data.fiscalYearInfo.ne : data.fiscalYearInfo.en}
          </div>
          <div className="fiscal-info-right">
            {currentLanguage === 'ne' ? data.fiscalYearInfo.ne : data.fiscalYearInfo.en}
          </div>
        </div>

        {/* Call to Action */}
        {data.callToAction && (
          <div className="hero-call-to-action">
            <Button
              as="a"
              href={data.callToAction.url}
              size="lg"
              kind="primary"
              renderIcon={ArrowRight}
              className="hero-cta-button"
            >
              {currentLanguage === 'ne' ? data.callToAction.text.ne : data.callToAction.text.en}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
