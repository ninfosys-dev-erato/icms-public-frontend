'use client';

import * as React from 'react';
import { Breadcrumb, BreadcrumbItem, Link as CarbonLink } from '@carbon/react';
import NextLink from 'next/link';

export default function Breadcrumbs({ className }: { className?: string }) {
  return (
    <Breadcrumb className={className} noTrailingSlash>
      <BreadcrumbItem>
        <NextLink href="/" passHref legacyBehavior>
          <CarbonLink>Link 0</CarbonLink>
        </NextLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <CarbonLink href="#">Link 1</CarbonLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <CarbonLink href="#">Link 2</CarbonLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <CarbonLink href="#">Link 3</CarbonLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}
