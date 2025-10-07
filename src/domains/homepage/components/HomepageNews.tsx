"use client";

import React from 'react';
import { Button } from '@carbon/react';
import { Download } from '@carbon/icons-react';
import { NewsData } from '../types/homepage';
import '../styles/homepage.css';

interface HomepageNewsProps {
  news: NewsData[];
  currentLanguage: string;
}

export const HomepageNews: React.FC<HomepageNewsProps> = ({
  news,
  currentLanguage
}) => {
  if (!news || news.length === 0) {
    return null;
  }

  return (
    <div className="content-section">
      <h3 className="content-section-title">
        {currentLanguage === 'ne' ? 'ताजा समाचार' : 'Latest News'}
      </h3>
      
      <ul className="news-list">
        {news
          .filter(item => item.isActive)
          .sort((a, b) => a.order - b.order)
          .map(item => (
            <li key={item.id} className="news-item">
              {item.imageUrl && (
                <img 
                  src={item.imageUrl} 
                  alt={currentLanguage === 'ne' ? item.title.ne : item.title.en}
                  className="news-image"
                />
              )}
              
              <div className="news-content">
                <h4 className="news-title">
                  {currentLanguage === 'ne' ? item.title.ne : item.title.en}
                </h4>
                
                {item.excerpt && (
                  <p className="news-excerpt">
                    {currentLanguage === 'ne' ? item.excerpt.ne : item.excerpt.en}
                  </p>
                )}
                
                <div className="news-meta">
                  <span className="news-date">{item.date}</span>
                  
                  {item.downloadUrl && (
                    <Button
                      as="a"
                      href={item.downloadUrl}
                      size="sm"
                      kind="primary"
                      renderIcon={Download}
                      className="news-download"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {currentLanguage === 'ne' ? 'डाउनलोड' : 'Download'}
                    </Button>
                  )}
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};
