"use client";

import React from 'react';
import { Tile } from '@carbon/react';
import { HighlightData } from '../types/homepage';
import '../styles/homepage.css';

interface HomepageHighlightsProps {
  highlights: HighlightData[];
  currentLanguage: string;
}

export const HomepageHighlights: React.FC<HomepageHighlightsProps> = ({
  highlights,
  currentLanguage
}) => {

  if (!highlights || highlights.length === 0) {
    return null;
  }

  return (
    <div className="content-section">
      <h3 className="content-section-title">
        {currentLanguage === 'ne' ? 'हाइलाइटहरू' : 'Highlights'}
      </h3>
      
      <ul className="highlights-list">
        {highlights
          .filter(highlight => highlight.isActive)
          .sort((a, b) => a.order - b.order)
          .map(highlight => (
            <li key={highlight.id} className="highlight-item">
              <div className="highlight-indicator" />
              <div className="highlight-content">
                {highlight.url ? (
                  <a 
                    href={highlight.url} 
                    className="highlight-title"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {currentLanguage === 'ne' ? highlight.title.ne : highlight.title.en}
                  </a>
                ) : (
                  <span className="highlight-title">
                    {currentLanguage === 'ne' ? highlight.title.ne : highlight.title.en}
                  </span>
                )}
                <p className="highlight-date">{highlight.date}</p>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};
