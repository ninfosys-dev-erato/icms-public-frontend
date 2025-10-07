import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale, localePrefix } from './i18n/config'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix
})

export const config = {
  // Match internationalized pathnames only
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}