'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Breadcrumb as CarbonBreadcrumb, BreadcrumbItem } from '@carbon/react'
import { Home, ChevronRight } from '@carbon/icons-react'
import { Link } from '@/i18n/routing'
import { getLocalizedContent } from '@/lib/i18n-utils'
import type { Locale } from '@/lib/i18n-utils'
import type { BreadcrumbItem as BreadcrumbItemType } from '@/models'

interface BreadcrumbProps {
  items: BreadcrumbItemType[]
  className?: string
  showHomeIcon?: boolean
}

export function Breadcrumb({ 
  items, 
  className = '',
  showHomeIcon = true 
}: BreadcrumbProps) {
  const locale = useLocale() as Locale
  const t = useTranslations('navigation')

  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className={`breadcrumb-container ${className}`}>
      <div className="container mx-auto px-4">
        <CarbonBreadcrumb 
          className="breadcrumb"
          aria-label={locale === 'ne' ? 'ब्रेडक्रम्ब नेभिगेशन' : 'Breadcrumb navigation'}
        >
          {items.map((item, index) => {
            const isActive = item.isActive || index === items.length - 1
            const isHome = index === 0
            const title = getLocalizedContent(item.title, locale)

            return (
              <BreadcrumbItem
                key={`breadcrumb-${index}`}
                isCurrentPage={isActive}
                className={isActive ? 'breadcrumb-item--active' : ''}
              >
                {!isActive && !item.isExternal ? (
                  <Link 
                    href={item.url}
                    className="breadcrumb-link"
                  >
                    {isHome && showHomeIcon && (
                      <Home size={16} className="breadcrumb-home-icon" />
                    )}
                    {title}
                  </Link>
                ) : !isActive && item.isExternal ? (
                  <a 
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="breadcrumb-link breadcrumb-link--external"
                  >
                    {isHome && showHomeIcon && (
                      <Home size={16} className="breadcrumb-home-icon" />
                    )}
                    {title}
                  </a>
                ) : (
                  <span className="breadcrumb-current">
                    {isHome && showHomeIcon && (
                      <Home size={16} className="breadcrumb-home-icon" />
                    )}
                    {title}
                  </span>
                )}
              </BreadcrumbItem>
            )
          })}
        </CarbonBreadcrumb>
      </div>

      <style jsx>{`
        .breadcrumb-container {
          background: var(--nepal-gray-50);
          border-bottom: 1px solid var(--nepal-gray-200);
          padding: 0.75rem 0;
          font-size: 0.875rem;
        }

        :global(.breadcrumb) {
          margin: 0;
          padding: 0;
        }

        :global(.breadcrumb-link) {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          color: var(--nepal-blue);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        :global(.breadcrumb-link:hover) {
          color: var(--nepal-blue-dark);
          text-decoration: underline;
        }

        :global(.breadcrumb-link--external) {
          position: relative;
        }

        :global(.breadcrumb-link--external::after) {
          content: '↗';
          font-size: 0.75rem;
          margin-left: 0.25rem;
        }

        :global(.breadcrumb-current) {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          color: var(--nepal-gray-700);
          font-weight: 500;
        }

        :global(.breadcrumb-home-icon) {
          color: var(--nepal-blue);
        }

        :global(.breadcrumb-item--active .breadcrumb-home-icon) {
          color: var(--nepal-gray-600);
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .breadcrumb-container {
            padding: 0.5rem 0;
            font-size: 0.8125rem;
          }

          :global(.breadcrumb) {
            flex-wrap: wrap;
          }

          :global(.breadcrumb-home-icon) {
            display: none;
          }
        }

        /* Print styles */
        @media print {
          .breadcrumb-container {
            background: white;
            border-bottom: 1px solid black;
          }

          :global(.breadcrumb-link) {
            color: black !important;
          }

          :global(.breadcrumb-current) {
            color: black !important;
            font-weight: bold;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .breadcrumb-container {
            background: white;
            border-bottom: 2px solid black;
          }

          :global(.breadcrumb-link) {
            color: blue;
          }

          :global(.breadcrumb-current) {
            color: black;
          }
        }

        /* Focus management */
        :global(.breadcrumb-link:focus) {
          outline: 2px solid var(--cds-focus);
          outline-offset: 2px;
          border-radius: 2px;
        }
      `}</style>
    </div>
  )
}

// Helper function to generate breadcrumbs from pathname
export function generateBreadcrumbsFromPath(
  pathname: string,
  currentTitle: { ne: string; en: string },
  locale: Locale
): BreadcrumbItemType[] {
  const breadcrumbs: BreadcrumbItemType[] = [
    {
      title: { ne: 'गृह पृष्ठ', en: 'Home' },
      url: '/',
      isActive: false,
      isExternal: false
    }
  ]

  // Remove locale from pathname
  const cleanPath = pathname.replace(/^\/(ne|en)/, '') || '/'
  
  if (cleanPath === '/') {
    breadcrumbs[0].isActive = true
    return breadcrumbs
  }

  const pathSegments = cleanPath.split('/').filter(segment => segment.length > 0)
  
  let cumulativePath = ''
  pathSegments.forEach((segment, index) => {
    cumulativePath += `/${segment}`
    
    const isLast = index === pathSegments.length - 1
    
    if (isLast) {
      // Current page
      breadcrumbs.push({
        title: currentTitle,
        url: cumulativePath,
        isActive: true,
        isExternal: false
      })
    } else {
      // Parent pages - you might want to fetch actual titles
      const segmentTitle = formatSegmentTitle(segment)
      breadcrumbs.push({
        title: segmentTitle,
        url: cumulativePath,
        isActive: false,
        isExternal: false
      })
    }
  })

  return breadcrumbs
}

function formatSegmentTitle(segment: string): { ne: string; en: string } {
  // Convert URL segment to readable title
  const formatted = segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
  
  // Simple mapping - in real implementation, you'd fetch from navigation data
  const segmentTitleMap: Record<string, { ne: string; en: string }> = {
    'about': { ne: 'हाम्रो बारेमा', en: 'About Us' },
    'news': { ne: 'समाचार', en: 'News' },
    'notices': { ne: 'सूचना', en: 'Notices' },
    'documents': { ne: 'कागजातहरू', en: 'Documents' },
    'services': { ne: 'सेवाहरू', en: 'Services' },
    'contact': { ne: 'सम्पर्क', en: 'Contact' },
    'search': { ne: 'खोज', en: 'Search' }
  }
  
  return segmentTitleMap[segment] || { ne: formatted, en: formatted }
}