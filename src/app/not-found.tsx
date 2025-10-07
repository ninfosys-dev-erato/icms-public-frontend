'use client';

import Link from 'next/link';
import styles from './not-found.module.css';

export default function GlobalNotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundContent}>
        
        <div className={styles.notFoundIcon}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.578M15 9.75a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>


      {/* Main Message */}
        <div className={styles.notFoundMessage}>
          <h1 className={styles.notFoundTitle}>
            Page Not Found
          </h1>
          <p className={styles.notFoundDescription}>
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Button */}
        <div className={styles.actionButton}>
          <Link href="/" className={styles.primaryButton}>
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}