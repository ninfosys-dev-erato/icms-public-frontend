"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically load Carbon components on the client only so importing this file
// doesn't pull Carbon's global side-effects into pages that don't render it.
const CarbonFullPageError = dynamic(
  () => import('@carbon/ibm-products').then((mod) => mod.FullPageError),
  { ssr: false }
);
const CarbonLink = dynamic(() => import('@carbon/react').then((mod) => mod.Link), { ssr: false });

export default function FullPageErrorBlock() {
  const storyClass = 'full-page-error-stories';

  return (
    <div className={`${storyClass}__viewport`}>
      <div className={`${storyClass}__offset`}>
        <div className={`${storyClass}__breadcrumb-container`} />

        <CarbonFullPageError
          title="Page not found"
          label="Error 404"
          description={`The page you requested has moved or is unavailable, or the specified URL is not valid. Please check the URL or search the site for the requested content.`}
          kind="404"
        >
          <CarbonLink size="lg" href={'/'}>
            – Forwarding Link 1
          </CarbonLink>
          <br />
          <CarbonLink size="lg" href={'/'}>
            – Forwarding Link 1
          </CarbonLink>
        </CarbonFullPageError>
      </div>
    </div>
  );
}
