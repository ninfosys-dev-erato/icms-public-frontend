import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'
import { locales } from './config'

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate that the incoming `requestLocale` parameter is valid  
  const locale = await requestLocale;
  if (!locale || !locales.includes(locale as any)) notFound()

  return {
    locale,
  messages: (await import(`../../locales/${locale}/common/${locale}.json`)).default,
    timeZone: 'Asia/Kathmandu',
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        },
        long: {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        },
      },
      number: {
        precise: {
          maximumFractionDigits: 5,
        },
        currency: {
          style: 'currency',
          currency: 'NPR',
        },
        nepali: {
          numberingSystem: 'deva',
        },
      },
    },
  }
})
