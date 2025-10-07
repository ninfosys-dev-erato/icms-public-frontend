"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { InlineLoading, Pagination, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableContainer } from '@carbon/react';
import { User } from '@carbon/icons-react';
import { useTranslations, useLocale } from 'next-intl';
import { useEmployees } from '../hooks';
import { useEmployeeSearchQuery } from '@/domains/slider/hooks/useEmployeesQuery';

interface EmployeeResponseDto {
  id: string;
  name?: {
    en?: string;
    ne?: string;
  } | null;
  photo?: {
    presignedUrl?: string;
  } | null;
  mobileNumber?: string | null;
  telephone?: string | null;
  email?: string | null;
  department?: {
    id?: string;
    departmentName?: {
      en?: string;
      ne?: string;
    } | null;
  } | null;
  position?: {
    en?: string;
    ne?: string;
  } | null;
}

interface EmployeeQueryDto {
  page?: number;
  limit?: number;
  departmentId?: string;
}

interface EmployeeListProps {
  departmentId?: string;
  queryOverrides?: Partial<EmployeeQueryDto>;
  position?: string;
  search?: string;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({ departmentId, queryOverrides = {}, position, search }) => {
  const tr = useTranslations('hr');
  const locale = useLocale();
  const [query, setQuery] = useState<Partial<EmployeeQueryDto>>({ page: 1, limit: 12, ...(departmentId ? { departmentId } : {}), ...queryOverrides });
  const queryResult = useEmployees();
  // server-side live search query (TanStack)
  const searchQuery = useEmployeeSearchQuery(search || '', {
    departmentId: departmentId || undefined,
    position: position || undefined,
    page: query.page,
    limit: query.limit,
  });
  // admin actions (edit/delete) are removed for the public frontend view

  useEffect(() => {
    setQuery((prev: Partial<EmployeeQueryDto>) => {
      const nextDept = departmentId || undefined;
      if (prev.departmentId === nextDept && prev.page === 1) return prev;
      return { ...prev, page: 1, ...(nextDept ? { departmentId: nextDept } : { departmentId: undefined }) };
    });
  }, [departmentId]);

  // Reset to first page when search term or department/position changes
  useEffect(() => {
    setQuery((prev) => ({ ...prev, page: 1 }));
  }, [search, departmentId, position]);

  useEffect(() => {
    setQuery((prev: Partial<EmployeeQueryDto>) => {
      const next = { ...prev, page: 1, ...queryOverrides };
      const changed = JSON.stringify({ ...prev, page: 1 }) !== JSON.stringify(next);
      return changed ? next : prev;
    });
  }, [JSON.stringify(queryOverrides)]);

  const data = queryResult.data;
  const allEmployees = (data?.data ?? []) as EmployeeResponseDto[];

  // Choose data source: server-side search when `search` is present; otherwise local employees
  const { employees, pagination } = useMemo(() => {
    const page = (query.page && Number(query.page) > 0) ? Number(query.page) : 1;
    const limit = (query.limit && Number(query.limit) > 0) ? Number(query.limit) : 12;

    if (search && search.trim().length > 0) {
      const resp = searchQuery.data;
      const items = (resp?.employees || []) as any[];
      const total = resp?.total ?? items.length;
      const current = resp?.page ? Math.max(1, resp.page) : page;
      const pLimit = resp?.pageSize ?? limit;

      // If server returned results, use them
      if (items && items.length > 0) {
        return { employees: items, pagination: { page: current, limit: pLimit, total } } as any;
      }

      // Server returned no results — perform a client-side fuzzy fallback so queries like
      // "Yub", "Yubraj", "Yubraj B.k" match "Yubraj B.K" even when backend search
      // doesn't normalize punctuation/casing.
      const normalize = (s?: string | null) =>
        (s || '')
          .toString()
          .toLowerCase()
          .replace(/[\.\/,\-_|\(\)\[\]']/g, '') // remove common punctuation
          .replace(/\s+/g, ' ')
          .trim();

      const qNorm = normalize(search);

      const fallbackFiltered = allEmployees.filter((emp) => {
        // build searchable string from multiple fields
        const pieces = [emp.name?.en, emp.name?.ne, emp.position?.en, emp.position?.ne, emp.email, emp.mobileNumber, emp.telephone];
        const hay = normalize(pieces.filter(Boolean).join(' '));
        return hay.includes(qNorm) || qNorm.split(' ').every(part => part && hay.includes(part));
      });

      const totalFallback = fallbackFiltered.length;
      const pagesFallback = Math.max(1, Math.ceil(totalFallback / limit));
      const currentFallback = Math.min(Math.max(1, page), pagesFallback);
      const startFallback = (currentFallback - 1) * limit;
      const pageItemsFallback = fallbackFiltered.slice(startFallback, startFallback + limit);

      return {
        employees: pageItemsFallback,
        pagination: { page: currentFallback, limit, total: totalFallback },
      } as any;
    }

    // Client-side fallback/listing
    let filtered = departmentId ? allEmployees.filter(e => e.department?.id === departmentId) : allEmployees;

    // Apply position filter when provided (use explicit prop `position`)
    if (position && typeof position === 'string' && position.trim() !== '') {
      const posTerm = position.toLowerCase();
      filtered = filtered.filter((emp) => {
        return (
          (emp.position?.en || '').toLowerCase().includes(posTerm) ||
          (emp.position?.ne || '').toLowerCase().includes(posTerm)
        );
      });
    }

    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / limit));
    const current = Math.min(Math.max(1, page), pages);
    const start = (current - 1) * limit;
    const end = start + limit;
    const pageItems = filtered.slice(start, end);

    return {
      employees: pageItems,
      pagination: { page: current, limit, total },
    } as { employees: EmployeeResponseDto[]; pagination: { page: number; limit: number; total: number } };
  }, [allEmployees, query.page, query.limit, departmentId, position, search, searchQuery.data]);

  const isSearchLoading = Boolean(search && search.trim().length > 0 && searchQuery.isLoading);

  if ((queryResult.isLoading || isSearchLoading) && employees.length === 0) {
    return (
      <div className="loading-container">
  <InlineLoading description={tr('loading')} />
      </div>
    );
  }

  return (
    <div className="employee-list">
      {employees.length > 0 ? (
        <TableContainer>
          <Table size="md" useZebraStyles>
            <TableHead>
              <TableRow>
                <TableHeader className="col-photo">{tr('employees.photo')}</TableHeader>
                <TableHeader>{tr('employees.name')}</TableHeader>
                <TableHeader>{tr('employees.phone')}</TableHeader>
                <TableHeader>{tr('employees.department')}</TableHeader>
                <TableHeader className="col-position">{tr('employees.position')}</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((emp: EmployeeResponseDto) => (
                <TableRow key={emp.id}>
                  <TableCell className="col-photo">
                    <div className="employee-photo-wrapper">
                      {emp.photo?.presignedUrl ? (
                        // show direct image when available
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={emp.photo.presignedUrl}
                          alt={`${emp.name?.en || emp.name?.ne || ''} photo`}
                          className="employee-photo-table"
                        />
                      ) : (
                        // fallback placeholder
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                          <rect width="24" height="24" rx="4" fill="#E0E0E0" />
                          <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-4 0-6 2-6 4v1h12v-1c0-2-2-4-6-4z" fill="#9E9E9E" />
                        </svg>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="font-en">{emp.name?.en || emp.name?.ne || ''}</TableCell>

                  <TableCell className="font-en">{emp.mobileNumber || emp.telephone || emp.email || ''}</TableCell>

                  <TableCell className="font-en">{emp.department?.departmentName?.en || emp.department?.departmentName?.ne || ''}</TableCell>

                  <TableCell className="font-en col-position">{emp.position?.en || emp.position?.ne || ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className="empty-state">
          <div className="empty-state-content">
            <div className="empty-state-icon">
              <User size={48} />
            </div>
            <h3 className="empty-state-title">{tr('noEmployees')}</h3>
            <p className="empty-state-description">{tr('noEmployeesDescription')}</p>
          </div>
        </div>
      )}

      {!!pagination && employees.length > 0 && (
        <div className="pagination-container" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <Pagination
            page={pagination.page}
            pageSize={pagination.limit}
            pageSizes={[10, 20, 50, 100]}
            totalItems={pagination.total}
            onChange={({ page, pageSize }) => {
              if (page !== undefined) setQuery((prev: Partial<EmployeeQueryDto>) => ({ ...prev, page }));
              if (pageSize !== undefined) setQuery((prev: Partial<EmployeeQueryDto>) => ({ ...prev, limit: pageSize, page: 1 }));
            }}
            backwardText={locale === "ne" ? "अघिल्लो" : "Previous"}
            forwardText={locale === "ne" ? "अर्को" : "Next"}
            itemsPerPageText={
              locale === "ne" ? "प्रति पृष्ठ" : "Items per page"
            }
            pageNumberText={locale === "ne" ? "पृष्ठ" : "Page"}
            className="carbon-pagination-custom"
          />
        </div>
      )}

      <style>{`
        .carbon-pagination-custom svg {
          width: 16px !important;
          height: 16px !important;
        }

        /* Image sizing using classes so we can override for small screens */
        .employee-photo-wrapper {
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .employee-photo-table {
          width: 100px;
          height: 100px;
          object-fit: cover;
        }

        /* Smaller images and text on small devices */
        @media (max-width: 640px) {
          .employee-photo-wrapper {
            width: 56px;
            height: 56px;
          }

          .employee-photo-table {
            width: 56px;
            height: 56px;
          }

          /* slightly smaller table text on small screens */
          .employee-list .font-en {
            font-size: 13px;
          }

          /* reduce header font a bit */
          .employee-list th {
            font-size: 13px;
          }

          /* hide photo and position columns on small screens */
          .employee-list .col-photo,
          .employee-list .col-position {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};


