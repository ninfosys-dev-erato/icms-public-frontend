"use client";

import React from 'react';
import { Tile } from '@carbon/react';
import { Phone, Email } from '@carbon/icons-react';
import { ContactData, ContactPerson } from '../types/homepage';
import '../styles/homepage.css';

interface HomepageContactProps {
  data: ContactData;
  currentLanguage: string;
}

export const HomepageContact: React.FC<HomepageContactProps> = ({
  data,
  currentLanguage
}) => {
  const renderContactPerson = (person: ContactPerson) => (
    <div key={person.id} className="contact-person">
      {person.imageUrl && (
        <img 
          src={person.imageUrl} 
          alt={currentLanguage === 'ne' ? person.name.ne : person.name.en}
          className="contact-avatar"
        />
      )}
      
      <div className="contact-info">
        <h4 className="contact-name">
          {currentLanguage === 'ne' ? person.name.ne : person.name.en}
        </h4>
        <p className="contact-title">
          {currentLanguage === 'ne' ? person.title.ne : person.title.en}
        </p>
        
        <div className="contact-details">
          <div className="contact-detail">
            <Phone size={16} className="contact-detail-icon" />
            <span>{person.phone}</span>
          </div>
          <div className="contact-detail">
            <Email size={16} className="contact-detail-icon" />
            <a href={`mailto:${person.email}`} className="contact-email">
              {person.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="contact-sidebar">
      {/* Director General */}
      <Tile className="contact-card">
        {renderContactPerson(data.directorGeneral)}
      </Tile>

      {/* Information Officer */}
      <Tile className="contact-card">
        {renderContactPerson(data.informationOfficer)}
      </Tile>
    </div>
  );
};
