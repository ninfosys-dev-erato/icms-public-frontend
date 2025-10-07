"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { DepartmentWithEmployees } from '../types';
import { EmployeeCard } from './EmployeeCard';
import styles from './hr.module.css';

interface DepartmentSectionProps {
  department: DepartmentWithEmployees;
  locale: 'en' | 'ne';
}

export const DepartmentSection: React.FC<DepartmentSectionProps> = ({ 
  department, 
  locale 
}) => {
  const t = useTranslations('hr.departments');

  const getDisplayName = () => {
    return locale === 'ne' ? department.departmentName.ne : department.departmentName.en;
  };

  return (
    <div className={styles.departmentSection}>
      <div className={styles.departmentHeader}>
        <h2 className={styles.departmentTitle}>
          {getDisplayName()}
        </h2>
      </div>

      <div className={styles.departmentContent}>
        <div className={styles.employeeGrid}>
          {department.employees.map(employee => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              locale={locale}
              departmentName={department.departmentName}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
