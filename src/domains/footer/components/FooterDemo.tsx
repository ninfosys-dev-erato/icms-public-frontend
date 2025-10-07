"use client";

import React from 'react';
import { FooterContainer } from './FooterContainer';

export function FooterDemo() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '2rem', background: '#f5f5f5' }}>
        <h1>Footer Demo</h1>
        <p>This is a demo page to test the footer component.</p>
        <p>Scroll down to see the footer at the bottom.</p>
      </div>
      <FooterContainer locale="en" />
    </div>
  );
}
