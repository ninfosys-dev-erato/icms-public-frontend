"use client";

import React from 'react';
import { Grid, Column, Tile } from '@carbon/react';
import { ServiceData } from '../types/homepage';
import '../styles/homepage.css';

interface HomepageServicesProps {
  services: ServiceData[];
  currentLanguage: string;
}

export const HomepageServices: React.FC<HomepageServicesProps> = ({
  services,
  currentLanguage
}) => {
  const renderServiceCard = (service: ServiceData) => (
    <Column key={service.id} lg={4} md={6} sm={4}>
      <Tile 
        className="service-card"
        onClick={() => service.url && window.open(service.url, '_blank')}
      >
        <span className="service-icon">
          {service.icon}
        </span>
        <h3 className="service-title">
          {currentLanguage === 'ne' ? service.title.ne : service.title.en}
        </h3>
        {service.description && (
          <p className="service-description">
            {currentLanguage === 'ne' ? service.description.ne : service.description.en}
          </p>
        )}
      </Tile>
    </Column>
  );

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section className="homepage-services">
      <div className="services-container">
        {/* Services Header */}
        <div className="services-header">
          <h2 className="services-title">
            {currentLanguage === 'ne' ? 'हाम्रा सेवाहरू' : 'Our Services'}
          </h2>
          <p className="services-subtitle">
            {currentLanguage === 'ne' 
              ? 'सरकारी डिजिटल सेवाहरू र प्रविधि समाधानहरू' 
              : 'Government digital services and technology solutions'
            }
          </p>
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          <Grid fullWidth>
            {services
              .filter(service => service.isActive)
              .sort((a, b) => a.order - b.order)
              .map(renderServiceCard)
            }
          </Grid>
        </div>
      </div>
    </section>
  );
};
