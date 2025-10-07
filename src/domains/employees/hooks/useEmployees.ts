"use client";

import { useQuery } from '@tanstack/react-query';
import { employeeService } from '../services';
import { Employee } from '../types';

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeService.getEmployees(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useHomepageEmployees() {
  const { data, isLoading, error } = useEmployees();

  const homepageEmployees = {
    showUpInHomepage: [] as Employee[],
    showDownInHomepage: [] as Employee[],
  };

  if (data?.success && data.data) {
    homepageEmployees.showUpInHomepage = data.data
      .filter(employee => employee.showUpInHomepage && employee.isActive)
      .sort((a, b) => a.order - b.order)
      .slice(0, 5);

    homepageEmployees.showDownInHomepage = data.data
      .filter(employee => employee.showDownInHomepage && employee.isActive)
      .sort((a, b) => a.order - b.order)
      .slice(0, 5);
  }

  return {
    data: homepageEmployees,
    isLoading,
    error,
  };
}