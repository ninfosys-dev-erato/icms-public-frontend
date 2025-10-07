import { 
  officeRepository,
  type OfficeSettings,
  type OfficeDescription,
  type Department,
  type Employee,
  type EmployeeListResponse,
  type DepartmentFilter,
  type EmployeeFilter
} from '@/repositories'

/**
 * Office Service - Business logic for office information management
 * Handles caching, orchestration, and business rules for office data
 */
export class OfficeService {
  // Office Settings methods
  async getOfficeSettings(): Promise<OfficeSettings | null> {
    return officeRepository.getOfficeSettings()
  }

  async getOfficeSettingsForSEO(): Promise<OfficeSettings | null> {
    return officeRepository.getOfficeSettingsForSEO()
  }

  // Office Descriptions methods
  async getAllOfficeDescriptions(): Promise<OfficeDescription[]> {
    return officeRepository.getAllOfficeDescriptions()
  }

  async getOfficeDescriptionByType(type: string): Promise<OfficeDescription | null> {
    return officeRepository.getOfficeDescriptionByType(type)
  }

  async getOfficeIntroduction(): Promise<OfficeDescription | null> {
    return officeRepository.getOfficeIntroduction()
  }

  async getOfficeObjective(): Promise<OfficeDescription | null> {
    return officeRepository.getOfficeObjective()
  }

  async getOfficeWorkDetails(): Promise<OfficeDescription | null> {
    return officeRepository.getOfficeWorkDetails()
  }

  async getOrganizationalStructure(): Promise<OfficeDescription | null> {
    return officeRepository.getOrganizationalStructure()
  }

  async getDigitalCharter(): Promise<OfficeDescription | null> {
    return officeRepository.getDigitalCharter()
  }

  async getEmployeeSanctions(): Promise<OfficeDescription | null> {
    return officeRepository.getEmployeeSanctions()
  }

  // Department methods
  async getAllDepartments(filters?: DepartmentFilter): Promise<Department[]> {
    return officeRepository.getAllDepartments(filters)
  }

  async getDepartmentHierarchy(): Promise<Department[]> {
    return officeRepository.getDepartmentHierarchy()
  }

  async searchDepartments(query: string): Promise<Department[]> {
    return officeRepository.searchDepartments(query)
  }

  async getDepartmentById(id: string): Promise<Department | null> {
    return officeRepository.getDepartmentById(id)
  }

  // Employee methods
  async getAllEmployees(filters?: EmployeeFilter): Promise<EmployeeListResponse> {
    return officeRepository.getAllEmployees(filters)
  }

  async searchEmployees(query: string, filters?: Omit<EmployeeFilter, 'q'>): Promise<EmployeeListResponse> {
    return officeRepository.searchEmployees(query, filters)
  }

  async getEmployeesByDepartment(departmentId: string, filters?: Omit<EmployeeFilter, 'departmentId'>): Promise<EmployeeListResponse> {
    return officeRepository.getEmployeesByDepartment(departmentId, filters)
  }

  async getEmployeesByPosition(position: string, filters?: Omit<EmployeeFilter, 'position'>): Promise<EmployeeListResponse> {
    return officeRepository.getEmployeesByPosition(position, filters)
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    return officeRepository.getEmployeeById(id)
  }

  // Convenience methods
  async getCompleteOfficeInfo(): Promise<{
    settings: OfficeSettings | null
    descriptions: OfficeDescription[]
    departments: Department[]
  }> {
    return officeRepository.getCompleteOfficeInfo()
  }

  async getKeyOfficeDescriptions(): Promise<{
    introduction: OfficeDescription | null
    objective: OfficeDescription | null
    workDetails: OfficeDescription | null
    structure: OfficeDescription | null
  }> {
    return officeRepository.getKeyOfficeDescriptions()
  }

  // Get leadership/key personnel
  async getKeyPersonnel(): Promise<Employee[]> {
    try {
      // Get employees with key positions
      const keyPositions = ['chief', 'director', 'secretary', 'head', 'manager']
      const employees: Employee[] = []

      for (const position of keyPositions) {
        const response = await this.getEmployeesByPosition(position, { 
          page: 1, 
          pageSize: 10,
          sortBy: 'name',
          sortOrder: 'asc' 
        })
        employees.push(...response.items)
      }

      // Remove duplicates and sort by name
      const uniqueEmployees = employees.filter((employee, index, array) => 
        array.findIndex(e => e.id === employee.id) === index
      )

      return uniqueEmployees.sort((a, b) => a.name.localeCompare(b.name))
    } catch (error) {
      console.warn('Failed to fetch key personnel:', error)
      return []
    }
  }

  // Get department heads
  async getDepartmentHeads(): Promise<Employee[]> {
    try {
      const departments = await this.getAllDepartments()
      const heads: Employee[] = []

      for (const dept of departments) {
        if (dept.headId) {
          const head = await this.getEmployeeById(dept.headId)
          if (head) {
            heads.push(head)
          }
        }
      }

      return heads
    } catch (error) {
      console.warn('Failed to fetch department heads:', error)
      return []
    }
  }

  // Build organizational chart data
  async getOrganizationalChart(): Promise<{
    departments: Department[]
    employees: Employee[]
    structure: OfficeDescription | null
  }> {
    const [departments, keyPersonnel, structure] = await Promise.all([
      this.getDepartmentHierarchy(),
      this.getKeyPersonnel(),
      this.getOrganizationalStructure()
    ])

    return {
      departments,
      employees: keyPersonnel,
      structure
    }
  }
}

// Export singleton instance
export const officeService = new OfficeService()

// React hooks for components
