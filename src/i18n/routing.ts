import { createSharedPathnamesNavigation } from 'next-intl/navigation'
import { locales, defaultLocale, pathnames, localePrefix } from './config'

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({
    locales,
    defaultLocale,
    localePrefix
  })

// Export the routing configuration for use in other parts of the app
export const routing = {
  locales,
  defaultLocale,
  pathnames,
  localePrefix
}