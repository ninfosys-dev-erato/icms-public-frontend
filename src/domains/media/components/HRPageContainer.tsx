"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useDepartmentsWithEmployees } from "../hooks";
import { hrService } from "../services/HRService";
import { HRFilters } from "./HRFilters";
import styles from "./hr.module.css";
import { Breadcrumb, BreadcrumbItem } from '@carbon/react';
import Link from 'next/link';
import { EmployeeList } from '@/domains/employees/components/EmployeeList';

interface HRPageContainerProps {
  locale: "en" | "ne";
  initialSearch: string;
  initialDepartment: string;
  initialPosition?: string;
}

export const HRPageContainer: React.FC<HRPageContainerProps> = ({
  locale,
  initialSearch,
  initialDepartment,
  initialPosition,
}) => {
  const t = useTranslations("hr");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [selectedDepartment, setSelectedDepartment] = useState(initialDepartment);
  const [position, setPosition] = useState(initialPosition || "");

  const { data, isLoading, isError, error } = useDepartmentsWithEmployees();

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (selectedDepartment) params.set("department", selectedDepartment);
    if (position) params.set("position", position);

    const queryString = params.toString();
    const newUrl = queryString ? `/hr?${queryString}` : "/hr";
    router.push(newUrl, { scroll: false });
  }, [search, selectedDepartment, position, router]);

  // Handle search
  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
  };

  // Handle department selection
  const handleDepartmentSelection = (departmentId: string) => {
    setSelectedDepartment(departmentId);
  };

  // Handle position selection
  const handlePositionChange = (pos: string) => {
    setPosition(pos);
  };

  // Filter and sort departments based on search and selection
  const filteredDepartments = useMemo(() => {
    if (!data?.data?.data) return [];

    let filtered = data.data.data;

    // Apply department filter
    if (selectedDepartment) {
      filtered = filtered.filter((dept: any) => dept.id === selectedDepartment);
    }

    // Apply search filter
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered
        .map((dept: any) => ({
          ...dept,
          employees: (dept.employees || []).filter((emp: any) => {
            return (
              (emp.name?.en || "").toLowerCase().includes(term) ||
              (emp.name?.ne || "").toLowerCase().includes(term) ||
              (emp.position?.en || "").toLowerCase().includes(term) ||
              (emp.position?.ne || "").toLowerCase().includes(term) ||
              (emp.email || "").toLowerCase().includes(term) ||
              (emp.mobileNumber || "").includes(term) ||
              (emp.telephone || "").includes(term)
            );
          }),
        }))
        .filter((dept: any) => dept.employees.length > 0);
    }

    // Apply position filter
    if (position) {
      const posTerm = position.toLowerCase();
      filtered = filtered
        .map((dept: any) => ({
          ...dept,
          employees: (dept.employees || []).filter((emp: any) => {
            return (
              (emp.position?.en || "").toLowerCase().includes(posTerm) ||
              (emp.position?.ne || "").toLowerCase().includes(posTerm)
            );
          }),
        }))
        .filter((dept: any) => dept.employees.length > 0);
    }

    // Sort departments by order
    return hrService.sortDepartmentsByOrder(filtered);
  }, [data?.data?.data, search, selectedDepartment, position]);

  // Get all unique departments for filter dropdown
  const allDepartments = useMemo(() => {
    if (!data?.data?.data) return [];
    return hrService.sortDepartmentsByOrder(data.data.data);
  }, [data?.data?.data]);

  // Get total employee count
  const totalEmployees = useMemo(() => {
    return filteredDepartments.reduce((sum: number, dept: any) => sum + (dept.employees?.length || 0), 0);
  }, [filteredDepartments]);

  // Read pagination from URL params (passed into EmployeeList)
  const page = useMemo(() => {
    const p = Number(searchParams?.get?.("page") || 1);
    return isNaN(p) || p < 1 ? 1 : p;
  }, [searchParams]);

  const pageSize = useMemo(() => {
    const ps = Number(searchParams?.get?.("pageSize") || 12);
    return isNaN(ps) || ps <= 0 ? 12 : ps;
  }, [searchParams]);

  // Get employee statistics
  const statistics = useMemo(() => {
    if (!data?.data?.data) return null;
    return hrService.getEmployeeStatistics(data.data.data);
  }, [data?.data?.data]);

  if (isError) {
    return (
      <div className={styles.errorContainer}>
        <h1>{t("title")}</h1>
        <div className={styles.errorMessage}>
          <p>{t("error")}</p>
          <button
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.hrPage}>
          <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
            <Breadcrumb noTrailingSlash>
              <BreadcrumbItem>
                <Link href="/">Home</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link href="/hr">HR</Link>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>{t('title')}</BreadcrumbItem>
            </Breadcrumb>
          </div>
        <header style={{ margin: "2rem 0 1rem 0" }}>
          <h1 className={styles.pageTitle}>{t("title")}</h1>
        </header>

        <HRFilters
          search={search}
          onSearch={handleSearch}
          selectedDepartment={selectedDepartment}
          onDepartmentSelection={handleDepartmentSelection}
          position={position}
          onPositionChange={handlePositionChange}
          departments={allDepartments}
          totalEmployees={totalEmployees}
          locale={locale}
        />

        <main className={styles.mainContent}>
          {isLoading ? (
            <div className={styles.loading}>{t('loading') || 'Loading...'}</div>
          ) : (
            // Render the table-based employee list which handles its own pagination
            <EmployeeList
              departmentId={selectedDepartment || undefined}
              position={position}
              search={search}
              queryOverrides={{ page, limit: pageSize }}
            />
          )}
        </main>
    </div>
  );
};
