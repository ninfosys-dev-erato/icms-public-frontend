/**
 * Translation utilities for domain-specific translations
 */

import { useTranslations } from 'next-intl';

/**
 * Custom hook for domain-specific translations with fallbacks
 * @param domain - The translation domain (e.g., 'hr', 'news', 'content')
 * @returns Translation function with error handling
 */
export function useDomainTranslations(domain: string) {
  const t = useTranslations(domain);
  
  /**
   * Get translation with fallback support
   * @param key - Translation key
   * @param fallback - Fallback text if translation is missing
   * @returns Translated text or fallback
   */
  const getDomainTranslation = (key: string, fallback?: string) => {
    try {
      return t(key);
    } catch (error) {
      console.warn(`Missing translation for key: ${domain}.${key}`);
      return fallback || key;
    }
  };

  return {
    t: getDomainTranslation,
    raw: t // Access to raw translation function if needed
  };
}

/**
 * Safe translation function that handles missing keys gracefully
 * @param translationFn - The translation function from useTranslations
 * @param key - Translation key
 * @param fallback - Fallback text
 * @param locale - Current locale for locale-specific fallbacks
 * @returns Translated text or fallback
 */
export function safeTranslate(
  translationFn: (key: string) => string,
  key: string,
  fallback?: string,
  locale?: 'en' | 'ne'
): string {
  try {
    return translationFn(key);
  } catch (error) {
    console.warn(`Missing translation for key: ${key}`);
    
    // Return locale-specific fallback if provided
    if (fallback) {
      return fallback;
    }
    
    // Return the key itself as last resort
    return key;
  }
}

/**
 * Helper to get nested translation keys safely
 * @param translationFn - The translation function
 * @param keyPath - Dot-separated key path (e.g., 'employees.name')
 * @param fallback - Fallback text
 * @returns Translated text or fallback
 */
export function getNestedTranslation(
  translationFn: (key: string) => string,
  keyPath: string,
  fallback?: string
): string {
  try {
    return translationFn(keyPath);
  } catch (error) {
    console.warn(`Missing nested translation for key: ${keyPath}`);
    return fallback || keyPath.split('.').pop() || keyPath;
  }
}
