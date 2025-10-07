"use client";

import { useState, useEffect } from 'react';
import { HeaderContainer } from './HeaderContainer';
import { HeaderProps } from '../types/header';
import styles from '../styles/header.module.css';

export function ClientHeaderContainer(props: HeaderProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Show skeleton during SSR and initial client render
  if (!hasMounted) {
    return (
      <div className={`${styles.headerSkeleton} ${props.className || ''}`}>
        <div className={styles.headerSkeletonTop}></div>
        <div className={styles.headerSkeletonMain}></div>
      </div>
    );
  }

  return <HeaderContainer {...props} />;
}