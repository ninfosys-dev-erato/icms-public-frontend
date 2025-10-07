"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useNews } from '../hooks/useNews';

interface NewsTickerProps {
  locale: 'ne' | 'en';
}

export function NewsTicker({ locale }: NewsTickerProps) {
  const { data: newsResponse, isLoading, error } = useNews();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const news = newsResponse?.data || [];

  // Auto-rotate news every 5 seconds
  useEffect(() => {
    if (news.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [news.length]);

  // Typing animation effect
  useEffect(() => {
    if (news.length === 0) return;

    const currentNews = news[currentIndex];
    const fullText = getLocalizedText(currentNews.title);
    
    setDisplayText('');
    setIsTyping(true);

    let currentChar = 0;
    const typingInterval = setInterval(() => {
      if (currentChar <= fullText.length) {
        setDisplayText(fullText.slice(0, currentChar));
        currentChar++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [currentIndex, news]);

  const getLocalizedText = (textObj: { en: string; ne: string }): string => {
    return textObj[locale] || textObj.en || '';
  };

  if (isLoading || error || news.length === 0) {
    return (
      <div style={{
        // backgroundColor: '#f4f8ff',
        // color: '#000000',
        // padding: '0.5rem 0',
        // fontSize: '0.875rem',
        // fontWeight: '500'
      }}>
        <div style={{
          // maxWidth: '1200px',
          // margin: '0 auto',
          // padding: '0 1rem',
          // display: 'flex',
          // alignItems: 'center',
          // gap: '1rem'
        }}>
          <div style={{
            // backgroundColor: '#000000',
            // color: '#f4f8ff',
            // padding: '0.25rem 0.75rem',
            // borderRadius: '4px',
            // fontSize: '0.75rem',
            // fontWeight: '600',
            // textTransform: 'uppercase',
            // letterSpacing: '0.5px'
          }}>
            {locale === 'ne' ? 'समाचार' : 'News'}
          </div>
          <div style={{ flex: 1 }}>
            {isLoading ? (
              locale === 'ne' ? 'समाचार लोड हुँदैछ...' : 'Loading news...'
            ) : (
              locale === 'ne' ? 'कुनै समाचार उपलब्ध छैन' : 'No news available'
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentNews = news[currentIndex];

  return (
    <div style={{
      color: '#ffffff',
      padding: 0,
      fontSize: '0.95rem',
      fontWeight: '500',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        minHeight: '48px',
        height: 'auto',
        maxWidth: '100vw',
        margin: 0
      }}>
        {/* Breaking News Label */}
        <div style={{
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          fontSize: '1rem',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          flexShrink: 0,
          minWidth: '100px',
          justifyContent: 'center'
        }}>
          {locale === 'ne' ? 'समाचार' : 'NEWS'}
        </div>
        
        {/* Separator Bar */}
        <div style={{
          width: '2px',
          height: '25px',
          backgroundColor: '#ffffff',
          flexShrink: 0,
          margin: '0 1rem 0 0',
          alignSelf: 'center'
        }}></div>
        
        {/* Scrolling News Content */}
        <div style={{ 
          flex: 1, 
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-start',
          padding: '12px 1rem 12px 0.5rem',
          minHeight: '48px'
        }}>
          <Link
            href={`/${locale}/content/news/${currentNews.slug}`}
            style={{
              color: '#ffffff',
              textDecoration: 'none',
              display: 'block',
              cursor: 'pointer',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              fontSize: '0.9rem',
              fontWeight: '500',
              letterSpacing: '0.3px',
              width: '100%',
              lineHeight: '1.4'
            }}
            onMouseEnter={(e) => {
              // e.currentTarget.style.color = '#ffcdd2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#ffffff';
            }}
          >
            {displayText}
            {isTyping && (
              <span style={{
                animation: 'blink 1s infinite',
                marginLeft: '2px'
              }}>|</span>
            )}
          </Link>
        </div>

        {/* Progress Dots */}
        {/* {news.length > 1 && (
          <div style={{
            display: 'flex',
            gap: '0.4rem',
            alignItems: 'center',
            padding: '0 1rem',
            flexShrink: 0
          }}>
            {news.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: index === currentIndex ? '#000000' : 'rgba(0, 0, 0, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: index === currentIndex ? 'none' : '1px solid rgba(0, 0, 0, 0.3)'
                }}
                onClick={() => setCurrentIndex(index)}
                onMouseEnter={(e) => {
                  if (index !== currentIndex) {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== currentIndex) {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                  }
                }}
              />
            ))}
          </div>
        )} */}
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

