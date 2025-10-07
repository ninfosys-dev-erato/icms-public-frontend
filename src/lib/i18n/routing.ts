/**
 * i18n routing utilities
 */

export const locales = ['ne', 'en'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'ne';

export function getPathname(href: string, locale: Locale): string {
  return `/${locale}${href}`;
}

export function redirect(href: string, locale?: Locale): string {
  const targetLocale = locale || defaultLocale;
  return getPathname(href, targetLocale);
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}