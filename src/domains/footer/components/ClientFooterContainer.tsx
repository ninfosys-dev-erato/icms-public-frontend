"use client";

import { FooterContainer } from './FooterContainer';
import { FooterProps } from '../types/footer';

export function ClientFooterContainer(props: FooterProps) {
  // This component is now only rendered on the client side
  // No need for mounting checks since it's dynamically imported with ssr: false
  return <FooterContainer {...props} />;
}
