"use client";

import React from 'react';
import Image from 'next/image';
import { Tile, Grid, Row, Column } from '@carbon/react';
import { Employee } from '../types/employee';

interface EmployeeCardProps {
  employee: Employee;
  locale: 'ne' | 'en';
  className?: string;
}

export function EmployeeCard({ employee, locale, className = '' }: EmployeeCardProps) {
  const safeLocale = (locale === 'ne' ? 'ne' : 'en') as 'ne' | 'en';
  
  const getLocalizedText = (entity: { ne: string; en: string }): string => {
    if (!entity) {
      return 'N/A';
    }
    if (safeLocale === 'ne' && entity.ne) {
      return entity.ne;
    }
    if (safeLocale === 'en' && entity.en) {
      return entity.en;
    }
    return entity.en || entity.ne || 'N/A';
  };

  const getPhotoUrl = (): string | null => {
    if (employee.photo?.presignedUrl) {
      return employee.photo.presignedUrl;
    }
    if (employee.photo?.url) {
      return employee.photo.url;
    }
    return null;
  };

  const photoUrl = getPhotoUrl();

  return (
    <Tile className={className} style={{ maxWidth: '350px', margin: 'auto', padding: '1rem', backgroundColor: '#0447AF' }}>
      <Grid fullWidth>
  <Row style={{ alignItems: 'center', display: 'flex', flexWrap: 'nowrap', gap: '1.5rem', minHeight: '80px' }}>
          <Column sm={2} md={2} lg={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flex: '0 0 auto', paddingLeft: 0 }}>
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={getLocalizedText(employee.name)}
                width={60}
                height={60}
                sizes="60px"
              />
            ) : (
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#161616'
              }}>
                {getLocalizedText(employee.name)
                  .split(' ')
                  .map(name => name.charAt(0))
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            )}
          </Column>
          <Column sm={2} md={6} lg={9} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '250px', minHeight: '60px', gap:'0.5rem', paddingLeft: 0}}>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff', marginBottom: '2px', lineHeight: 1 }}>
              {getLocalizedText(employee.name)}
            </span>
            <span style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 400, lineHeight: 1 }}>
              {employee.position ? getLocalizedText(employee.position) : 'Employee'}
            </span>
            <span style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 400, lineHeight: 1 }}>
              {employee.mobileNumber}
            </span>
          </Column>
        </Row>
      </Grid>
    </Tile>
  );
}