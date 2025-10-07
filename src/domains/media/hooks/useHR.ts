import { useQuery } from '@tanstack/react-query'
import { hrService } from '../services/HRService'
import { DepartmentWithEmployees } from '../types'

// Query keys for HR
export const hrKeys = {
  all: ['hr'] as const,
  departments: () => [...hrKeys.all, 'departments'] as const,
  departmentsWithEmployees: () => [...hrKeys.all, 'departmentsWithEmployees'] as const,
  employees: () => [...hrKeys.all, 'employees'] as const,
  employeesByDepartment: (departmentId: string) => [...hrKeys.all, 'employeesByDepartment', departmentId] as const,
}

// Hook for departments with employees (main HR page)
export const useDepartmentsWithEmployees = () => {
  return useQuery({
    queryKey: hrKeys.departmentsWithEmployees(),
    queryFn: async () => {
      console.log('🔍 useDepartmentsWithEmployees: Executing query function');
      const result = await hrService.getDepartmentsWithEmployees();
      console.log('🔍 useDepartmentsWithEmployees: Query result:', result);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook for all departments
export const useAllDepartments = () => {
  return useQuery({
    queryKey: hrKeys.departments(),
    queryFn: () => hrService.getAllDepartments(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook for all employees
export const useAllEmployees = () => {
  return useQuery({
    queryKey: hrKeys.employees(),
    queryFn: () => hrService.getAllEmployees(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook for employees by department
export const useEmployeesByDepartment = (departmentId: string) => {
  return useQuery({
    queryKey: hrKeys.employeesByDepartment(departmentId),
    queryFn: () => hrService.getEmployeesByDepartment(departmentId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!departmentId,
  })
}
