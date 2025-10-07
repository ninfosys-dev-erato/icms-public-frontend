import { hrRepository } from '../repositories/HRRepository'
import { 
  HRResponse,
  DepartmentWithEmployees,
  Employee
} from '../types'

/**
 * HR Service - Handles HR business logic
 */
export class HRService {
  // Get departments with employees ordered by department and employee order
  async getDepartmentsWithEmployees(): Promise<HRResponse> {
    try {
      console.log('🔍 HRService: Fetching departments with employees');
      const response = await hrRepository.getDepartmentsWithEmployees()
      console.log('🔍 HRService: Raw API response:', response);
      
      if (response.success) {
        console.log('🔍 HRService: API response successful, departments count:', response.data.data.length);
        return response
      }
      console.error('🔍 HRService: API response not successful:', response.error || 'Unknown error');
      throw new Error(response.error || 'Failed to fetch departments with employees')
    } catch (error) {
      console.error('❌ HRService: Error fetching departments with employees:', error)
      throw error
    }
  }

  // Get all departments
  async getAllDepartments(): Promise<any> {
    try {
      const response = await hrRepository.getAllDepartments()
      return response
    } catch (error) {
      console.error('Error fetching all departments:', error)
      throw error
    }
  }

  // Get all employees
  async getAllEmployees(): Promise<any> {
    try {
      const response = await hrRepository.getAllEmployees()
      return response
    } catch (error) {
      console.error('Error fetching all employees:', error)
      throw error
    }
  }

  // Get employees by department
  async getEmployeesByDepartment(departmentId: string): Promise<any> {
    try {
      const response = await hrRepository.getEmployeesByDepartment(departmentId)
      return response
    } catch (error) {
      console.error('Error fetching employees by department:', error)
      throw error
    }
  }

  // Sort departments by order
  sortDepartmentsByOrder(departments: DepartmentWithEmployees[]): DepartmentWithEmployees[] {
    return departments.sort((a, b) => a.order - b.order)
  }

  // Sort employees by order within a department
  sortEmployeesByOrder(employees: Employee[]): Employee[] {
    return employees.sort((a, b) => a.order - b.order)
  }

  // Get all employees flattened across departments
  getAllEmployeesFlattened(departments: DepartmentWithEmployees[]): (Employee & { departmentName: any })[] {
    const allEmployees: (Employee & { departmentName: any })[] = []
    departments.forEach(dept => {
      dept.employees.forEach(emp => {
        allEmployees.push({
          ...emp,
          departmentName: dept.departmentName
        })
      })
    })
    return allEmployees
  }

  // Filter employees by search term
  filterEmployeesBySearch(employees: Employee[], searchTerm: string): Employee[] {
    if (!searchTerm) return employees
    const term = searchTerm.toLowerCase()
    return employees.filter(emp => 
      emp.name.en.toLowerCase().includes(term) ||
      emp.name.ne.toLowerCase().includes(term) ||
      emp.position.en.toLowerCase().includes(term) ||
      emp.position.ne.toLowerCase().includes(term) ||
      emp.email?.toLowerCase().includes(term) ||
      emp.mobileNumber?.includes(term) ||
      emp.telephone?.includes(term)
    )
  }

  // Filter employees by department
  filterEmployeesByDepartment(employees: (Employee & { departmentId?: string })[], departmentId: string): Employee[] {
    if (!departmentId) return employees
    return employees.filter(emp => emp.departmentId === departmentId)
  }

  // Get employee statistics
  getEmployeeStatistics(departments: DepartmentWithEmployees[]): {
    totalDepartments: number
    totalEmployees: number
    employeesWithPhotos: number
    employeesWithoutPhotos: number
    departmentsWithEmployees: number
    departmentsWithoutEmployees: number
  } {
    const totalDepartments = departments.length
    const totalEmployees = departments.reduce((sum, dept) => sum + dept.employees.length, 0)
    const employeesWithPhotos = departments.reduce((sum, dept) => 
      sum + dept.employees.filter(emp => emp.photoMediaId).length, 0
    )
    const employeesWithoutPhotos = totalEmployees - employeesWithPhotos
    const departmentsWithEmployees = departments.filter(dept => dept.employees.length > 0).length
    const departmentsWithoutEmployees = totalDepartments - departmentsWithEmployees

    return {
      totalDepartments,
      totalEmployees,
      employeesWithPhotos,
      employeesWithoutPhotos,
      departmentsWithEmployees,
      departmentsWithoutEmployees
    }
  }
}

// Export singleton instance
export const hrService = new HRService()
