import { locales, defaultLocale } from '@/i18n/config'
import type { TranslatableEntity } from '@/models/shared'

export type Locale = (typeof locales)[number]

// Helper function to get localized content from TranslatableEntity
export function getLocalizedContent(content: TranslatableEntity, locale: Locale): string {
  if (locale === 'ne' && content.ne) {
    return content.ne
  }
  if (locale === 'en' && content.en) {
    return content.en
  }
  // Fallback to the other language if current locale is not available
  return content.ne || content.en || ''
}

// Helper function to validate locale
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

// Helper function to get the other locale
export function getAlternateLocale(currentLocale: Locale): Locale {
  return currentLocale === 'ne' ? 'en' : 'ne'
}

// Helper function to format dates based on locale
export function formatLocalizedDate(
  date: string | Date,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Kathmandu'
  }

  const formatOptions = { ...defaultOptions, ...options }

  if (locale === 'ne') {
    // Use Devanagari numerals for Nepali
    return new Intl.DateTimeFormat('ne-NP', {
      ...formatOptions,
      numberingSystem: 'deva'
    }).format(dateObj)
  }

  return new Intl.DateTimeFormat('en-US', formatOptions).format(dateObj)
}

// Helper function to format numbers based on locale
export function formatLocalizedNumber(
  number: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string {
  if (locale === 'ne') {
    return new Intl.NumberFormat('ne-NP', {
      numberingSystem: 'deva',
      ...options
    }).format(number)
  }

  return new Intl.NumberFormat('en-US', options).format(number)
}

// Helper function to get locale from pathname
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/')
  const localeSegment = segments[1]
  
  if (isValidLocale(localeSegment)) {
    return localeSegment
  }
  
  return defaultLocale
}

// Helper function to remove locale from pathname
export function removeLocaleFromPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname)
  if (pathname.startsWith(`/${locale}`)) {
    return pathname.slice(`/${locale}`.length) || '/'
  }
  return pathname
}

// Helper function for creating localized URLs
export function createLocalizedUrl(pathname: string, locale: Locale): string {
  const cleanPathname = removeLocaleFromPathname(pathname)
  return `/${locale}${cleanPathname === '/' ? '' : cleanPathname}`
}

// Helper function to get browser's preferred locale
export function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale
  
  const browserLang = navigator.language.split('-')[0]
  return isValidLocale(browserLang) ? browserLang : defaultLocale
}

// RTL support (Nepali is LTR, but useful for future languages)
export function getTextDirection(locale: Locale): 'ltr' | 'rtl' {
  // Nepali and English are both LTR
  return 'ltr'
}

// Helper for creating translatable entities
export function createTranslatableEntity(ne: string, en: string): TranslatableEntity {
  return { ne, en }
}

// Helper to check if translatable entity has content in specific language
export function hasContentInLocale(content: TranslatableEntity, locale: Locale): boolean {
  return Boolean(content[locale])
}

// Helper to get fallback content if preferred locale is not available
export function getContentWithFallback(
  content: TranslatableEntity,
  preferredLocale: Locale,
  fallbackLocale?: Locale
): string {
  if (hasContentInLocale(content, preferredLocale)) {
    return content[preferredLocale]
  }
  
  const fallback = fallbackLocale || getAlternateLocale(preferredLocale)
  return content[fallback] || ''
}

// Calendar utilities for Bikram Sambat (BS) and Gregorian (AD)
export function formatBikramSambatDate(date: Date): string {
  // This would integrate with a BS calendar library
  // For now, return a placeholder
  const year = date.getFullYear() + 57 // Approximate BS year
  return `${year} साल`
}

export function formatGregorianDate(date: Date, locale: Locale): string {
  return formatLocalizedDate(date, locale)
}

// Helper for pluralization in different languages
export function pluralize(
  count: number,
  singular: { ne: string; en: string },
  plural: { ne: string; en: string },
  locale: Locale
): string {
  const isPlural = count !== 1
  const text = isPlural ? plural : singular
  return getLocalizedContent(text, locale)
}