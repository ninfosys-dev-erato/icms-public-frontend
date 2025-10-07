"use client";

import React from 'react';
import { HRPageContainer } from './HRPageContainer';

interface HRExamplePageProps {
  locale: 'en' | 'ne';
  search?: string;
  department?: string;
}

export const HRExamplePage: React.FC<HRExamplePageProps> = ({
  locale = 'en',
  search = '',
  department = ''
}) => {
  return (
    <HRPageContainer
      locale={locale}
      initialSearch={search}
      initialDepartment={department}
    />
  );
};
