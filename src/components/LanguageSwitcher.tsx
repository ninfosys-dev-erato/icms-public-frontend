'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useRouter } from '@/i18n/routing'
import { getAlternateLocale } from '@/lib/i18n-utils'
import type { Locale } from '@/lib/i18n-utils'

interface LanguageSwitcherProps {
  className?: string
  variant?: 'button' | 'dropdown'
}

export function LanguageSwitcher({ 
  className = '', 
  variant = 'button' 
}: LanguageSwitcherProps) {
  const t = useTranslations('header')
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const router = useRouter()

  const handleLanguageSwitch = (newLocale: Locale) => {
    router.push(pathname, { locale: newLocale })
  }

  const alternateLocale = getAlternateLocale(locale)

  if (variant === 'dropdown') {
    const items = [
      {
        id: 'ne',
        text: 'नेपाली',
        onClick: () => handleLanguageSwitch('ne')
      },
      {
        id: 'en', 
        text: 'English',
        onClick: () => handleLanguageSwitch('en')
      }
    ]

    return (
      <div className={className}>
        <select
          id="language-switcher"
          className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={locale}
          onChange={(e) => handleLanguageSwitch(e.target.value as Locale)}
          title={t('languageSwitch')}
        >
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.text}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <button
      className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      onClick={() => handleLanguageSwitch(alternateLocale)}
      title={t('languageSwitch')}
    >
      {locale === 'ne' ? 'English' : 'नेपाली'}
    </button>
  )
}