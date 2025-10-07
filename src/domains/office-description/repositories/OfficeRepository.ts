import { publicApiClient } from '@/repositories/http/PublicApiClient'
import { 
  OfficeSettingsResponse,
  OfficeSettingsApiResponse,
  OfficeDescriptionResponse,
  OfficeDescriptionListResponse,
  OfficeDescriptionSingleResponse,
  DepartmentResponse,
  DepartmentListResponse,
  EmployeeResponse,
  EmployeeListResponse,
  DepartmentQuery,
  EmployeeQuery,
  OfficeDescriptionType
} from '@/models'

/**
 * Office Repository - Handles office information API calls
 * Maps to backend endpoints: /office-settings, /office-descriptions, /departments, /employees
 * Updated to match exact backend API structure
 */
export class OfficeRepository {
  // Office Settings endpoints (/office-settings)
  async getOfficeSettings(): Promise<OfficeSettingsResponse | null> {
    try {
      const response = await publicApiClient.get('/office-settings')
      const apiResponse = response as OfficeSettingsApiResponse
      if (apiResponse.success) {
        return apiResponse.data
      }
      return null
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  async getOfficeSettingsForSEO(): Promise<OfficeSettingsResponse | null> {
    try {
      const response = await publicApiClient.get('/office-settings/seo')
      const apiResponse = response as OfficeSettingsApiResponse
      if (apiResponse.success) {
        return apiResponse.data
      }
      return null
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  // Office Descriptions endpoints (/office-descriptions)
  async getAllOfficeDescriptions(): Promise<OfficeDescriptionResponse[]> {
    const response = await publicApiClient.get('/office-descriptions')
    const apiResponse = response as OfficeDescriptionListResponse
    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.error || 'Failed to fetch office descriptions')
  }

  async getOfficeDescriptionTypes(): Promise<OfficeDescriptionType[]> {
    try {
      const response = await publicApiClient.get('/office-descriptions/types')
      if (response.success) {
        return response.data as OfficeDescriptionType[]
      }
      // Fallback to known types
      return ['INTRODUCTION', 'OBJECTIVE', 'WORK_DETAILS', 'ORGANIZATIONAL_STRUCTURE', 'DIGITAL_CHARTER', 'EMPLOYEE_SANCTIONS']
    } catch (error) {
      console.warn('Failed to fetch office description types:', error)
      return ['INTRODUCTION', 'OBJECTIVE', 'WORK_DETAILS', 'ORGANIZATIONAL_STRUCTURE', 'DIGITAL_CHARTER', 'EMPLOYEE_SANCTIONS']
    }
  }

  async getOfficeDescriptionByType(type: OfficeDescriptionType): Promise<OfficeDescriptionResponse | null> {
    try {
      const response = await publicApiClient.get(`/office-descriptions/type/${type}`)
      const apiResponse = response as OfficeDescriptionSingleResponse
      if (apiResponse.success) {
        return apiResponse.data
      }
      return null
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  // Convenience methods for specific office description types
  async getOfficeIntroduction(): Promise<OfficeDescriptionResponse | null> {
    const response = await publicApiClient.get('/office-descriptions/introduction')
    const apiResponse = response as OfficeDescriptionSingleResponse
    return apiResponse.success ? apiResponse.data : null
  }

  async getOfficeObjective(): Promise<OfficeDescriptionResponse | null> {
    const response = await publicApiClient.get('/office-descriptions/objective')
    const apiResponse = response as OfficeDescriptionSingleResponse
    return apiResponse.success ? apiResponse.data : null
  }

  async getOfficeWorkDetails(): Promise<OfficeDescriptionResponse | null> {
    const response = await publicApiClient.get('/office-descriptions/work-details')
    const apiResponse = response as OfficeDescriptionSingleResponse
    return apiResponse.success ? apiResponse.data : null
  }

  async getOrganizationalStructure(): Promise<OfficeDescriptionResponse | null> {
    const response = await publicApiClient.get('/office-descriptions/organizational-structure')
    const apiResponse = response as OfficeDescriptionSingleResponse
    return apiResponse.success ? apiResponse.data : null
  }

  async getDigitalCharter(): Promise<OfficeDescriptionResponse | null> {
    const response = await publicApiClient.get('/office-descriptions/digital-charter')
    const apiResponse = response as OfficeDescriptionSingleResponse
    return apiResponse.success ? apiResponse.data : null
  }

  async getEmployeeSanctions(): Promise<OfficeDescriptionResponse | null> {
    const response = await publicApiClient.get('/office-descriptions/employee-sanctions')
    const apiResponse = response as OfficeDescriptionSingleResponse
    return apiResponse.success ? apiResponse.data : null
  }

  async getOfficeDescriptionById(id: string): Promise<OfficeDescriptionResponse | null> {
    try {
      const response = await publicApiClient.get(`/office-descriptions/${id}`)
      const apiResponse = response as OfficeDescriptionSingleResponse
      if (apiResponse.success) {
        return apiResponse.data
      }
      return null
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  // Department endpoints (/departments)
  async getAllDepartments(query?: DepartmentQuery): Promise<DepartmentResponse[]> {
    const response = await publicApiClient.get('/departments', query)
    const apiResponse = response as DepartmentListResponse
    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.error || 'Failed to fetch departments')
  }

  async getDepartmentHierarchy(): Promise<DepartmentResponse[]> {
    const response = await publicApiClient.get('/departments/hierarchy')
    const apiResponse = response as DepartmentListResponse
    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.error || 'Failed to fetch department hierarchy')
  }

  async searchDepartments(searchTerm: string): Promise<DepartmentResponse[]> {
    const response = await publicApiClient.get('/departments/search', { q: searchTerm })
    const apiResponse = response as DepartmentListResponse
    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.error || 'Failed to search departments')
  }

  async getDepartmentById(id: string): Promise<DepartmentResponse | null> {
    try {
      const response = await publicApiClient.get(`/departments/${id}`)
      if (response.success) {
        return response.data as DepartmentResponse
      }
      return null
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  // Employee endpoints (/employees)
  async getAllEmployees(query?: EmployeeQuery): Promise<EmployeeListResponse> {
    const response = await publicApiClient.get('/employees', query)
    return response as EmployeeListResponse
  }

  async searchEmployees(searchTerm: string, query?: Omit<EmployeeQuery, 'search'>): Promise<EmployeeListResponse> {
    const response = await publicApiClient.get('/employees/search', { q: searchTerm, ...query })
    return response as EmployeeListResponse
  }

  async getEmployeesByDepartment(departmentId: string, query?: Omit<EmployeeQuery, 'departmentId'>): Promise<EmployeeListResponse> {
    const response = await publicApiClient.get(`/employees/department/${departmentId}`, query)
    return response as EmployeeListResponse
  }

  async getEmployeesByPosition(position: string, query?: Omit<EmployeeQuery, 'position'>): Promise<EmployeeListResponse> {
    const response = await publicApiClient.get(`/employees/position/${position}`, query)
    return response as EmployeeListResponse
  }

  async getEmployeeById(id: string): Promise<EmployeeResponse | null> {
    try {
      const response = await publicApiClient.get(`/employees/${id}`)
      if (response.success) {
        return response.data as EmployeeResponse
      }
      return null
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  // Convenience methods for common office information needs
  async getCompleteOfficeInfo(): Promise<{
    settings: OfficeSettingsResponse | null
    descriptions: OfficeDescriptionResponse[]
    departments: DepartmentResponse[]
  }> {
    const [settings, descriptions, departments] = await Promise.all([
      this.getOfficeSettings(),
      this.getAllOfficeDescriptions(),
      this.getDepartmentHierarchy()
    ])

    return { settings, descriptions, departments }
  }

  async getKeyOfficeDescriptions(): Promise<{
    introduction: OfficeDescriptionResponse | null
    objective: OfficeDescriptionResponse | null
    workDetails: OfficeDescriptionResponse | null
    structure: OfficeDescriptionResponse | null
  }> {
    const [introduction, objective, workDetails, structure] = await Promise.all([
      this.getOfficeIntroduction(),
      this.getOfficeObjective(),
      this.getOfficeWorkDetails(),
      this.getOrganizationalStructure()
    ])

    return { introduction, objective, workDetails, structure }
  }

  // Helper methods for organizational chart
  async getKeyPersonnel(): Promise<EmployeeResponse[]> {
    try {
      // Get employees with leadership positions
      const leadershipPositions = ['director', 'chief', 'head', 'manager', 'secretary']
      const employees: EmployeeResponse[] = []

      for (const position of leadershipPositions) {
        const response = await this.getEmployeesByPosition(position, { 
          page: 1, 
          limit: 5,
          isActive: true
        })
        if (response.success) {
          employees.push(...response.data)
        }
      }

      // Remove duplicates and sort by name
      const uniqueEmployees = employees.filter((employee, index, array) => 
        array.findIndex(e => e.id === employee.id) === index
      )

      return uniqueEmployees
    } catch (error) {
      console.warn('Failed to fetch key personnel:', error)
      return []
    }
  }
}

// Export singleton instance
export const officeRepository = new OfficeRepository()