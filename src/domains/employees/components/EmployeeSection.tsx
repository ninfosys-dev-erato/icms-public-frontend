"use client";

import React from 'react';
import { Employee } from '../types/employee';
import { EmployeeCard } from './EmployeeCard';

interface EmployeeSectionProps {
  employees: Employee[];
  locale: 'ne' | 'en';
  title?: string;
  className?: string;
}

export function EmployeeSection({ 
  employees, 
  locale, 
  title,
  className = '' 
}: EmployeeSectionProps) {
  if (employees.length === 0) {
    return null;
  }

  return (
    <section className={className} style={{
      minHeight: '100% !important',
      backgroundColor: '#0447AF',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
      }}>
        {title && (
          <h2 style={{
            // textAlign: 'center',
            fontSize: '2rem',
            fontWeight: '600',
            color: '#161616',
            marginBottom: '2rem'
          }}>
            {title}
          </h2>
        )}
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          // gap: '1.5rem',
          // justifyItems: 'center'
        }}
        className="cds--grid--no-gutter"
        >
          {employees.slice(0, 5).map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              locale={locale}
              className="employee-card"
            />
          ))}
        </div>
      </div>
    </section>
  );
}