import { Pathnames, LocalePrefix } from 'next-intl/routing'

export const defaultLocale = 'ne' as const
export const locales = ['ne', 'en'] as const

export const pathnames: Pathnames<typeof locales> = {
  '/': '/',
  '/about': {
    ne: '/hamro-bare-ma',
    en: '/about'
  },
  '/news': {
    ne: '/samachar',
    en: '/news'
  },
  '/documents': {
    ne: '/karyalaha-bibaranaru',
    en: '/documents'
  },
  '/services': {
    ne: '/sewaharu',
    en: '/services'
  },
  '/contact': {
    ne: '/sampark',
    en: '/contact'
  },
  '/search': {
    ne: '/khoja',
    en: '/search'
  },
  '/gallery': {
    ne: '/gallery',
    en: '/gallery'
  },
  '/gallery/:path*': {
    ne: '/gallery/:path*',
    en: '/gallery/:path*'
  },
  '/hr': {
    ne: '/hr',
    en: '/hr'
  },
  '/faq': {
    ne: '/bara-bara-prasnaharu',
    en: '/faq'
  },
  // Add content routes for internationalization
  '/content/:slug': {
    ne: '/content/:slug',
    en: '/content/:slug'
  }
} satisfies Pathnames<typeof locales>

export const localePrefix: LocalePrefix<typeof locales> = 'always'

export const port = process.env.PORT || 3000
export const host = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:${port}`