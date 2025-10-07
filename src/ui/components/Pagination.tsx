"use client";

import React from 'react';
import { Pagination as CarbonPagination } from '@carbon/react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  page: number;
  totalPages: number;
  pageSize: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function Pagination({
  page,
  totalPages,
  pageSize,
  total,
  hasNext,
  hasPrev,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <CarbonPagination
        page={page}
        pageSize={pageSize}
        pageSizes={[10, 20, 50, 100]}
        totalItems={total}
        onChange={({ page: newPage, pageSize: newPageSize }) => {
          if (newPage !== page) {
            handlePageChange(newPage);
          }
          // Note: pageSize change would need additional handling
        }}
        size="md"
        pageSizeInputDisabled
      />
      
      <style jsx>{`
        .pagination {
          display: flex;
          justify-content: center;
          margin: 2rem 0;
        }
      `}</style>
    </div>
  );
}
