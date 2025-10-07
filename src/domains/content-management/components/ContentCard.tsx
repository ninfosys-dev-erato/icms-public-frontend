'use client'

import { useLocale, useTranslations } from 'next-intl'
import { 
  Tag,
  Button
} from '@carbon/react'
import { 
  Calendar,
  View,
  Download,
  ArrowRight,
  Document,
  Time
} from '@carbon/icons-react'
import { Link } from '@/i18n/routing'
import { getLocalizedContent, formatLocalizedDate } from '@/lib/i18n-utils'
import type { Locale } from '@/lib/i18n-utils'
import type { ContentResponse } from '@/models'

interface ContentCardProps {
  content: ContentResponse
  variant?: 'default' | 'featured' | 'compact' | 'list'
  showImage?: boolean
  showExcerpt?: boolean
  showMeta?: boolean
  showActions?: boolean
  className?: string
}

export function ContentCard({
  content,
  variant = 'default',
  showImage = true,
  showExcerpt = true,
  showMeta = true,
  showActions = true,
  className = ''
}: ContentCardProps) {
  const locale = useLocale() as Locale
  const t = useTranslations('content')
  const commonT = useTranslations('common')

  const title = getLocalizedContent(content.title, locale)
  const excerpt = content.excerpt ? getLocalizedContent(content.excerpt, locale) : ''
  const category = content.category ? getLocalizedContent(content.category.name, locale) : ''
  
  const publishedDate = content.publishedAt ? new Date(content.publishedAt) : new Date(content.createdAt)
  const formattedDate = formatLocalizedDate(publishedDate, locale)

  const cardClasses = [
    'content-card',
    `content-card--${variant}`,
    content.isFeatured ? 'content-card--featured' : '',
    content.priority === 'HIGH' ? 'content-card--priority' : '',
    className
  ].filter(Boolean).join(' ')

  if (variant === 'compact') {
    return (
      <div className={cardClasses}>
        <div className="card-compact-content">
          {showMeta && (
            <div className="card-meta">
              <span className="meta-date">
                <Calendar size={14} />
                {formattedDate}
              </span>
              {category && (
                <Tag type="blue" size="sm">
                  {category}
                </Tag>
              )}
            </div>
          )}
          
          <h3 className="card-title">
            <Link href={`/${locale}/content/${content.slug}`}>
              {title}
            </Link>
          </h3>
          
          {content.viewCount && (
            <div className="card-stats">
              <View size={14} />
              <span>{content.viewCount}</span>
            </div>
          )}
        </div>
        
        <style jsx>{`
          .card-compact-content {
            padding: 1rem;
          }
          
          .card-meta {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
            font-size: 0.8125rem;
            color: var(--nepal-gray-600);
          }
          
          .meta-date {
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }
          
          .card-title {
            font-size: 1rem;
            font-weight: 600;
            line-height: 1.4;
            margin-bottom: 0.5rem;
          }
          
          .card-title a {
            color: var(--nepal-gray-900);
            text-decoration: none;
          }
          
          .card-title a:hover {
            color: var(--nepal-blue);
          }
          
          .card-stats {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            font-size: 0.75rem;
            color: var(--nepal-gray-500);
          }
        `}</style>
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div className={cardClasses}>
        <div className="card-list-content">
          <div className="card-main">
            {showMeta && (
              <div className="card-meta">
                <span className="meta-date">
                  <Calendar size={14} />
                  {formattedDate}
                </span>
                {category && (
                  <Tag type="blue" size="sm">
                    {category}
                  </Tag>
                )}
                {content.priority === 'HIGH' && (
                  <Tag type="red" size="sm">
                    {locale === 'ne' ? 'महत्वपूर्ण' : 'Important'}
                  </Tag>
                )}
              </div>
            )}
            
            <h3 className="card-title">
              <Link href={`/${locale}/content/${content.slug}`}>
                {title}
              </Link>
            </h3>
            
            {showExcerpt && excerpt && (
              <p className="card-excerpt">{excerpt}</p>
            )}
            
            <div className="card-stats">
              {content.viewCount && (
                <span className="stat-item">
                  <View size={14} />
                  {content.viewCount}
                </span>
              )}
              {content.downloadCount && (
                <span className="stat-item">
                  <Download size={14} />
                  {content.downloadCount}
                </span>
              )}
            </div>
          </div>
          
          {showActions && (
            <div className="card-actions">
              <Button
                kind="ghost"
                size="sm"
                renderIcon={ArrowRight}
                iconDescription={commonT('readMore')}
                as={Link}
                href={`/${locale}/content/${content.slug}`}
              >
                {commonT('readMore')}
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Default and featured variants
  return (
    <div className={cardClasses}>
      {showImage && content.featuredImage && (
        <div className="card-image-container">
          <img
            src={content.featuredImage.url}
            alt={getLocalizedContent(content.featuredImage.alt || content.title, locale)}
            className="card-image"
            loading="lazy"
          />
          {content.isFeatured && (
            <div className="featured-badge">
              {locale === 'ne' ? 'विशेष' : 'Featured'}
            </div>
          )}
        </div>
      )}
      
      <div className="card-content">
        {showMeta && (
          <div className="card-meta">
            <span className="meta-date">
              <Calendar size={16} />
              {formattedDate}
            </span>
            
            {category && (
              <Tag type="blue" size="sm">
                {category}
              </Tag>
            )}
            
            {content.priority === 'HIGH' && (
              <Tag type="red" size="sm">
                {locale === 'ne' ? 'महत्वपूर्ण' : 'Important'}
              </Tag>
            )}
          </div>
        )}
        
        <h3 className="card-title">
          <Link href={`/${locale}/content/${content.slug}`}>
            {title}
          </Link>
        </h3>
        
        {showExcerpt && excerpt && (
          <p className="card-excerpt">{excerpt}</p>
        )}
        
        <div className="card-stats">
          {content.viewCount && (
            <span className="stat-item">
              <View size={16} />
              <span>{content.viewCount}</span>
            </span>
          )}
          
          {content.downloadCount && (
            <span className="stat-item">
              <Download size={16} />
              <span>{content.downloadCount}</span>
            </span>
          )}
          
          {content.attachments && content.attachments.length > 0 && (
            <span className="stat-item">
              <Document size={16} />
              <span>{content.attachments.length}</span>
            </span>
          )}
        </div>
        
        {showActions && (
          <div className="card-actions">
            <Button
              kind="primary"
              size="sm"
              renderIcon={ArrowRight}
              iconDescription={commonT('readMore')}
              as={Link}
              href={`/${locale}/content/${content.slug}`}
            >
              {commonT('readMore')}
            </Button>
            
            {content.attachments && content.attachments.length > 0 && (
              <Button
                kind="secondary"
                size="sm"
                renderIcon={Download}
                iconDescription={commonT('downloadPdf')}
                onClick={() => {
                  // Handle download
                  console.log('Download attachments:', content.attachments)
                }}
              >
                {commonT('downloadPdf')}
              </Button>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .content-card {
          background: white;
          border: 1px solid var(--nepal-gray-200);
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .content-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }

        .content-card--featured {
          border-left: 4px solid var(--nepal-blue);
          background: linear-gradient(135deg, rgba(0, 56, 147, 0.02) 0%, rgba(0, 56, 147, 0.05) 100%);
        }

        .content-card--priority {
          border-left: 4px solid var(--nepal-red);
        }

        .content-card--list {
          flex-direction: row;
          height: auto;
        }

        .card-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .content-card:hover .card-image {
          transform: scale(1.05);
        }

        .featured-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: var(--nepal-blue);
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .card-content {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .card-list-content {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 16px 20px;
          gap: 20px;
        }

        .card-main {
          flex: 1;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          font-size: 0.875rem;
          color: var(--nepal-gray-600);
          flex-wrap: wrap;
        }

        .meta-date {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.4;
          margin-bottom: 12px;
          color: var(--nepal-gray-900);
        }

        .card-title a {
          color: inherit;
          text-decoration: none;
        }

        .card-title a:hover {
          color: var(--nepal-blue);
        }

        .card-excerpt {
          color: var(--nepal-gray-700);
          line-height: 1.6;
          margin-bottom: 16px;
          flex: 1;
          
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-stats {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
          font-size: 0.875rem;
          color: var(--nepal-gray-500);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .card-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: auto;
        }

        @media (max-width: 768px) {
          .card-content {
            padding: 16px;
          }

          .card-title {
            font-size: 1.125rem;
          }

          .card-actions {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }

          .card-list-content {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  )
}