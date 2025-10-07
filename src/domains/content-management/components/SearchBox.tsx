'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import { 
  Search as CarbonSearch,
  Button,
  Loading,
  ComboBox,
  TextInput
} from '@carbon/react'
import { Search, Close, Filter } from '@carbon/icons-react'
import type { Locale } from '@/lib/i18n-utils'

interface SearchSuggestion {
  id: string
  text: string
  type: 'content' | 'document' | 'notice' | 'service'
  url: string
}

interface SearchBoxProps {
  variant?: 'default' | 'compact' | 'hero'
  placeholder?: string
  className?: string
  onSearch?: (query: string) => void
  showSuggestions?: boolean
  showFilters?: boolean
  autoFocus?: boolean
}

export function SearchBox({
  variant = 'default',
  placeholder,
  className = '',
  onSearch,
  showSuggestions = true,
  showFilters = false,
  autoFocus = false
}: SearchBoxProps) {
  const locale = useLocale() as Locale
  const t = useTranslations('search')
  const router = useRouter()
  
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestionsList, setShowSuggestionsList] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const searchPlaceholder = placeholder || t('placeholder')

  // Mock suggestions - in real implementation, this would call PublicSearchRepository
  const mockSuggestions: SearchSuggestion[] = [
    {
      id: '1',
      text: locale === 'ne' ? 'नागरिकता प्रमाणपत्र' : 'Citizenship Certificate',
      type: 'document',
      url: '/documents/citizenship-certificate'
    },
    {
      id: '2', 
      text: locale === 'ne' ? 'जन्म दर्ता' : 'Birth Registration',
      type: 'service',
      url: '/services/birth-registration'
    },
    {
      id: '3',
      text: locale === 'ne' ? 'कर भुक्तानी' : 'Tax Payment',
      type: 'service', 
      url: '/services/tax-payment'
    }
  ]

  // Fetch suggestions when query changes
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      setShowSuggestionsList(false)
      return
    }

    const timeoutId = setTimeout(() => {
      if (showSuggestions) {
        setIsLoading(true)
        // Mock API call - replace with actual search service
        setTimeout(() => {
          const filteredSuggestions = mockSuggestions.filter(suggestion =>
            suggestion.text.toLowerCase().includes(query.toLowerCase())
          )
          setSuggestions(filteredSuggestions)
          setShowSuggestionsList(true)
          setIsLoading(false)
        }, 300)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, showSuggestions])

  // Handle search submission
  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return

    setShowSuggestionsList(false)
    
    if (onSearch) {
      onSearch(searchQuery.trim())
    } else {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestionsList || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedSuggestionIndex >= 0) {
          const suggestion = suggestions[selectedSuggestionIndex]
          router.push(suggestion.url)
        } else {
          handleSearch()
        }
        break
      case 'Escape':
        setShowSuggestionsList(false)
        setSelectedSuggestionIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setShowSuggestionsList(false)
    router.push(suggestion.url)
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestionsList(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const searchBoxClasses = [
    'search-box',
    `search-box--${variant}`,
    className
  ].filter(Boolean).join(' ')

  if (variant === 'hero') {
    return (
      <div className={searchBoxClasses}>
        <div className="search-hero-container">
          <h2 className="search-hero-title">
            {locale === 'ne' 
              ? 'तपाईं के खोजिरहनुभएको छ?'
              : 'What are you looking for?'
            }
          </h2>
          <div className="search-input-container">
            <TextInput
              ref={inputRef}
              id="hero-search"
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => query.length >= 2 && setShowSuggestionsList(true)}
              autoFocus={autoFocus}
              labelText=""
              hideLabel
              size="lg"
              className="search-input search-input--hero"
            />
            <Button
              kind="primary"
              size="lg"
              renderIcon={Search}
              iconDescription={t('search')}
              onClick={() => handleSearch()}
              className="search-button search-button--hero"
            >
              {t('search')}
            </Button>
          </div>
          
          {showSuggestions && showSuggestionsList && (
            <div ref={suggestionsRef} className="search-suggestions">
              {isLoading ? (
                <div className="suggestion-loading">
                  <Loading size="sm" />
                  <span>{locale === 'ne' ? 'खोजिँदै...' : 'Searching...'}</span>
                </div>
              ) : suggestions.length > 0 ? (
                <ul className="suggestion-list">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={suggestion.id}
                      className={`suggestion-item ${
                        index === selectedSuggestionIndex ? 'suggestion-item--selected' : ''
                      }`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      onMouseEnter={() => setSelectedSuggestionIndex(index)}
                    >
                      <div className="suggestion-content">
                        <span className="suggestion-text">{suggestion.text}</span>
                        <span className="suggestion-type">
                          {locale === 'ne' 
                            ? getSuggestionTypeLabel(suggestion.type, 'ne')
                            : getSuggestionTypeLabel(suggestion.type, 'en')
                          }
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : query.length >= 2 ? (
                <div className="no-suggestions">
                  {t('noResults')}
                </div>
              ) : null}
            </div>
          )}
        </div>

        <style jsx>{`
          .search-hero-container {
            position: relative;
            max-width: 600px;
            margin: 0 auto;
            text-align: center;
          }

          .search-hero-title {
            font-size: 2rem;
            font-weight: 600;
            color: white;
            margin-bottom: 2rem;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }

          .search-input-container {
            display: flex;
            gap: 0;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            overflow: hidden;
          }

          :global(.search-input--hero .cds--text-input) {
            border: none;
            border-radius: 8px 0 0 8px;
            min-height: 56px;
            font-size: 1.125rem;
          }

          :global(.search-button--hero) {
            border-radius: 0 8px 8px 0;
            min-height: 56px;
            padding: 0 2rem;
          }

          @media (max-width: 768px) {
            .search-hero-title {
              font-size: 1.5rem;
              margin-bottom: 1.5rem;
            }

            .search-input-container {
              flex-direction: column;
            }

            :global(.search-input--hero .cds--text-input) {
              border-radius: 8px 8px 0 0;
            }

            :global(.search-button--hero) {
              border-radius: 0 0 8px 8px;
            }
          }
        `}</style>
      </div>
    )
  }

  // Default and compact variants
  return (
    <div className={searchBoxClasses}>
      <div className="search-input-container">
        <TextInput
          ref={inputRef}
          id="search-input"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setShowSuggestionsList(true)}
          autoFocus={autoFocus}
          labelText=""
          hideLabel
          size={variant === 'compact' ? 'sm' : 'md'}
          className="search-input"
        />
        
        {query && (
          <Button
            kind="ghost"
            size={variant === 'compact' ? 'sm' : 'md'}
            renderIcon={Close}
            iconDescription={locale === 'ne' ? 'खाली गर्नुहोस्' : 'Clear'}
            onClick={() => {
              setQuery('')
              setSuggestions([])
              setShowSuggestionsList(false)
              inputRef.current?.focus()
            }}
            className="search-clear"
          />
        )}
        
        <Button
          kind="primary"
          size={variant === 'compact' ? 'sm' : 'md'}
          renderIcon={Search}
          iconDescription={t('search')}
          onClick={() => handleSearch()}
          className="search-button"
        >
          {variant === 'compact' ? '' : t('search')}
        </Button>
        
        {showFilters && (
          <Button
            kind="secondary"
            size={variant === 'compact' ? 'sm' : 'md'}
            renderIcon={Filter}
            iconDescription={t('filters')}
            onClick={() => {
              // Handle filters
              console.log('Show filters')
            }}
            className="search-filters"
          >
            {variant === 'compact' ? '' : t('filters')}
          </Button>
        )}
      </div>

      {showSuggestions && showSuggestionsList && (
        <div ref={suggestionsRef} className="search-suggestions">
          {isLoading ? (
            <div className="suggestion-loading">
              <Loading size="sm" />
              <span>{locale === 'ne' ? 'खोजिँदै...' : 'Searching...'}</span>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="suggestion-list">
              {suggestions.map((suggestion, index) => (
                <li
                  key={suggestion.id}
                  className={`suggestion-item ${
                    index === selectedSuggestionIndex ? 'suggestion-item--selected' : ''
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                >
                  <div className="suggestion-content">
                    <span className="suggestion-text">{suggestion.text}</span>
                    <span className="suggestion-type">
                      {locale === 'ne' 
                        ? getSuggestionTypeLabel(suggestion.type, 'ne')
                        : getSuggestionTypeLabel(suggestion.type, 'en')
                      }
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 ? (
            <div className="no-suggestions">
              {t('noResults')}
            </div>
          ) : null}
        </div>
      )}

      <style jsx>{`
        .search-box {
          position: relative;
          width: 100%;
        }

        .search-input-container {
          display: flex;
          align-items: center;
          gap: 0;
          background: white;
          border: 2px solid var(--nepal-gray-300);
          border-radius: 8px;
          overflow: hidden;
          transition: border-color 0.2s ease;
        }

        .search-input-container:focus-within {
          border-color: var(--nepal-blue);
          box-shadow: 0 0 0 2px rgba(0, 56, 147, 0.1);
        }

        :global(.search-input .cds--text-input) {
          border: none;
          border-radius: 0;
          background: transparent;
          flex: 1;
        }

        :global(.search-button) {
          border-radius: 0;
          margin-left: auto;
        }

        :global(.search-clear) {
          margin-left: auto;
        }

        :global(.search-filters) {
          border-radius: 0;
        }

        .search-suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid var(--nepal-gray-300);
          border-top: none;
          border-radius: 0 0 8px 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          max-height: 300px;
          overflow-y: auto;
        }

        .suggestion-loading {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px;
          color: var(--nepal-gray-600);
        }

        .suggestion-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .suggestion-item {
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid var(--nepal-gray-200);
          transition: background-color 0.2s ease;
        }

        .suggestion-item:hover,
        .suggestion-item--selected {
          background: var(--nepal-gray-50);
        }

        .suggestion-item:last-child {
          border-bottom: none;
        }

        .suggestion-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .suggestion-text {
          font-weight: 500;
          color: var(--nepal-gray-900);
        }

        .suggestion-type {
          font-size: 0.75rem;
          color: var(--nepal-gray-500);
          background: var(--nepal-gray-100);
          padding: 2px 8px;
          border-radius: 12px;
        }

        .no-suggestions {
          padding: 16px;
          text-align: center;
          color: var(--nepal-gray-600);
          font-style: italic;
        }

        .search-box--compact .search-input-container {
          border-radius: 4px;
        }

        .search-box--compact .search-suggestions {
          border-radius: 0 0 4px 4px;
        }

        @media (max-width: 768px) {
          .search-input-container {
            flex-wrap: wrap;
          }

          :global(.search-button),
          :global(.search-filters) {
            min-width: 100px;
          }
        }
      `}</style>
    </div>
  )
}

// Helper function to get localized suggestion type labels
function getSuggestionTypeLabel(type: string, locale: 'ne' | 'en'): string {
  const labels = {
    content: { ne: 'सामग्री', en: 'Content' },
    document: { ne: 'कागजात', en: 'Document' },
    notice: { ne: 'सूचना', en: 'Notice' },
    service: { ne: 'सेवा', en: 'Service' }
  }
  
  return labels[type as keyof typeof labels]?.[locale] || type
}