'use client';

import * as React from 'react';
import {
  Theme,
  Header,
  HeaderName,
  HeaderGlobalBar,
  HeaderMenuButton,
} from '@carbon/react';

type Props = {
  children?: React.ReactNode;
  productName?: string;
  homeHref?: string;
};

export function UiShell({ children, productName = 'IBM Product', homeHref = '/' }: Props) {
  return (
    <>
      {/* Dark top header */}
      <Theme theme="g100">
        <Header aria-label={productName}>
          <HeaderMenuButton aria-label="Open menu" isCollapsible onClick={() => {}} />
          <HeaderName href={homeHref} prefix="">
            {productName}
          </HeaderName>
          <HeaderGlobalBar />
        </Header>
      </Theme>

      {/* White page body */}
      <Theme theme="white">{children}</Theme>
    </>
  );
}
