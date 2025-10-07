'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ContentResponse, Category } from '@/domains/content-management/types/content';
import { publicContentService } from '@/domains/content-management/services/PublicContentService';
import styles from './ContentSidebar.module.css';

interface ContentSidebarProps {
  category: Category;
  categoryPath: Category[];
  currentContent: ContentResponse;
  locale: 'en' | 'ne';
}

export function ContentSidebar({ 
  category, 
  categoryPath, 
  currentContent, 
  locale 
}: ContentSidebarProps) {
  const t = useTranslations('content.sidebar');
  const [relatedContent, setRelatedContent] = useState<ContentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedContent = async () => {
      try {
        const response = await publicContentService.getContentByCategory(category.slug, {
          page: 1,
          limit: 5,
        });
        
        // Filter out current content
        if (response.data && Array.isArray(response.data)) {
          const related = response.data.filter((item: ContentResponse) => item.id !== currentContent.id);
          setRelatedContent(related.slice(0, 4)); // Show max 4 related items
        } else {
          setRelatedContent([]);
        }
        
      } catch (error) {
        console.error('Failed to fetch related content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedContent();
  }, [category.slug, currentContent.id]);

  return (
    <aside className={styles.sidebarContainer}>
      {/* Category Info */}
      <div className={styles.sidebarSection}>
        <div className={styles.sidebarSectionHeader}>
          <h3 className={styles.sidebarSectionTitle}>
            {t('category')}
          </h3>
        </div>
        
        <div className={styles.sidebarSectionContent}>
          <Link
            href={`/${locale}/content/${category.slug}`}
            className={styles.categoryLink}
          >
            {category.name[locale] || category.name.en}
          </Link>
          
          {category.description && (
            <p className={styles.categoryDescription}>
              {category.description[locale] || category.description.en}
            </p>
          )}
          
          {/* Parent Categories */}
          {categoryPath.length > 1 && (
            <div className={styles.categoryPathSection}>
              <h4 className={styles.categoryPathTitle}>
                {t('categoryPath')}
              </h4>
              <div className={styles.categoryPathList}>
                {categoryPath.slice(0, -1).map((pathCategory) => (
                  <Link
                    key={pathCategory.id}
                    href={`/${locale}/content/${pathCategory.slug}`}
                    className={styles.categoryPathItem}
                  >
                    {pathCategory.name[locale] || pathCategory.name.en}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Content */}
      <div className={styles.sidebarSection}>
        <div className={styles.sidebarSectionHeader}>
          <h3 className={styles.sidebarSectionTitle}>
            {t('relatedContent')}
          </h3>
        </div>
        
        <div className={styles.sidebarSectionContent}>
          {isLoading ? (
            <div className={styles.loadingSkeleton}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className={styles.skeletonItem}></div>
              ))}
            </div>
          ) : relatedContent.length > 0 ? (
            <div className={styles.relatedContentList}>
              {relatedContent.map((content) => (
                <article key={content.id} className={styles.relatedContentItem}>
                  <Link
                    href={`/${locale}/content/${content.category.slug}/${content.slug}`}
                    className={styles.relatedContentLink}
                  >
                    <h4 className={styles.relatedContentTitle}>
                      {content.title[locale] || content.title.en}
                    </h4>
                    
                    {content.excerpt && (
                      <p className={styles.relatedContentExcerpt}>
                        {content.excerpt[locale] || content.excerpt.en}
                      </p>
                    )}
                    
                    <div className={styles.relatedContentMeta}>
                      {content.publishedAt && (
                        <time dateTime={content.publishedAt} className={styles.relatedContentDate}>
                          {new Date(content.publishedAt).toLocaleDateString(
                            locale === 'ne' ? 'ne-NP' : 'en-US',
                            { month: 'short', day: 'numeric' }
                          )}
                        </time>
                      )}
                      
                      {content.featured && (
                        <span className={styles.relatedContentFeatured}>
                          {t('featured')}
                        </span>
                      )}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className={styles.noRelatedContent}>
              {t('noRelatedContent')}
            </p>
          )}
          
          {relatedContent.length > 0 && (
            <div className={styles.categoryPathSection}>
              <Link
                href={`/${locale}/content/${category.slug}`}
                className={styles.viewAllLink}
              >
                {t('viewAllInCategory')}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.sidebarSection}>
        <div className={styles.sidebarSectionHeader}>
          <h3 className={styles.sidebarSectionTitle}>
            {t('quickActions')}
          </h3>
        </div>
        
        <div className={styles.sidebarSectionContent}>
          <div className={styles.quickActionsList}>
            <button
              onClick={() => window.print()}
              className={styles.quickActionButton}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              {t('actions.print')}
            </button>
            
            <button
              onClick={() => {
                const title = currentContent.title[locale] || currentContent.title.en;
                const text = currentContent.excerpt?.[locale] || currentContent.excerpt?.en || '';
                
                if (navigator.share) {
                  navigator.share({
                    title,
                    text,
                    url: window.location.href
                  });
                } else if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  // You might want to show a toast notification here
                }
              }}
              className={styles.quickActionButton}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              {t('actions.share')}
            </button>
            
            <button
              onClick={() => window.history.back()}
              className={styles.quickActionButton}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('actions.back')}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}