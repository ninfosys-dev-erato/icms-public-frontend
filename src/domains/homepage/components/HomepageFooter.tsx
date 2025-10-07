"use client";

import React from 'react';
import { Grid, Column, Tile } from '@carbon/react';
import { Location, Phone, Email, Chat } from '@carbon/icons-react';
import { FooterData } from '../types/homepage';
import '../styles/homepage.css';

interface HomepageFooterProps {
  data: FooterData;
  currentLanguage: string;
}

export const HomepageFooter: React.FC<HomepageFooterProps> = ({
  data,
  currentLanguage
}) => {
  return (
    <footer className="homepage-footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Office Information */}
          <div className="footer-section">
            <h3>
              {currentLanguage === 'ne' ? 'कार्यालयको जानकारी' : 'Office Information'}
            </h3>
            
            <div className="footer-office-info">
              <div className="footer-office-name">
                {currentLanguage === 'ne' ? data.officeInfo.name.ne : data.officeInfo.name.en}
              </div>
              <div className="footer-office-address">
                {currentLanguage === 'ne' ? data.officeInfo.address.ne : data.officeInfo.address.en}
              </div>
            </div>

            <div className="footer-office-hours">
              <div className="office-hours-period">
                {currentLanguage === 'ne' ? data.officeInfo.officeHours.winter.period.ne : data.officeInfo.officeHours.winter.period.en}
              </div>
              <div className="office-hours-times">
                {currentLanguage === 'ne' ? 'आइतबार - बिहीबार' : 'Sunday - Thursday'}: {data.officeInfo.officeHours.winter.sundayToThursday}
              </div>
              <div className="office-hours-times">
                {currentLanguage === 'ne' ? 'शुक्रबार' : 'Friday'}: {data.officeInfo.officeHours.winter.friday}
              </div>
            </div>

            <div className="footer-office-hours">
              <div className="office-hours-period">
                {currentLanguage === 'ne' ? data.officeInfo.officeHours.summer.period.ne : data.officeInfo.officeHours.summer.period.en}
              </div>
              <div className="office-hours-times">
                {currentLanguage === 'ne' ? 'आइतबार - बिहीबार' : 'Sunday - Thursday'}: {data.officeInfo.officeHours.summer.sundayToThursday}
              </div>
              <div className="office-hours-times">
                {currentLanguage === 'ne' ? 'शुक्रबार' : 'Friday'}: {data.officeInfo.officeHours.summer.friday}
              </div>
            </div>
          </div>

          {/* Important Links */}
          <div className="footer-section">
            <h3>
              {currentLanguage === 'ne' ? 'महत्त्वपूर्ण लिङ्कहरू' : 'Important Links'}
            </h3>
            
            <ul className="footer-important-links">
              {data.importantLinks
                .filter(link => link.isActive)
                .sort((a, b) => a.order - b.order)
                .map(link => (
                  <li key={link.id} className="footer-link-item">
                    <a 
                      href={link.url} 
                      className="footer-link"
                      target={link.target || '_self'}
                      rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                    >
                      {currentLanguage === 'ne' ? link.title.ne : link.title.en}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-contact-info">
            <div className="footer-contact-item">
              <Location size={16} className="footer-contact-icon" />
              <span>
                {currentLanguage === 'ne' ? data.contactInfo.address.ne : data.contactInfo.address.en}
              </span>
            </div>
            
            <div className="footer-contact-item">
              <Email size={16} className="footer-contact-icon" />
              <a href={`mailto:${data.contactInfo.email}`} className="footer-contact-link">
                {data.contactInfo.email}
              </a>
            </div>
            
            <div className="footer-contact-item">
              <Phone size={16} className="footer-contact-icon" />
              <span>{data.contactInfo.phone}</span>
            </div>
          </div>

          <div className="footer-social-media">
            <a 
              href="https://facebook.com/doitnepal" 
              className="footer-social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Chat size={16} />
            </a>
            
            <a 
              href="https://twitter.com/doitnepal" 
              className="footer-social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <Chat size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
