import { publicApiClient } from '@/repositories/http/PublicApiClient'
import { HRResponse } from '../types'

/**
 * HR Repository - Handles HR-related API calls
 * Maps to backend endpoints: /departments, /employees
 */
export class HRRepository {
  // Get departments with employees ordered by department and employee order
  async getDepartmentsWithEmployees(): Promise<HRResponse> {
    try {
      console.log('🔍 HRRepository: Making API call to /departments/with-employees');
      const response = await publicApiClient.get('/departments/with-employees');
      console.log('🔍 HRRepository: API response received:', response);
      
      // Validate the response structure
      if (!response || typeof response !== 'object') {
        console.error('❌ HRRepository: Invalid response structure:', response);
        throw new Error('Invalid API response structure');
      }
      
      const typedResponse = response as any;
      
      if (!typedResponse.success) {
        console.error('❌ HRRepository: API response not successful:', typedResponse.error);
        throw new Error(typedResponse.error || 'API request failed');
      }
      
      if (!typedResponse.data || !Array.isArray(typedResponse.data.data)) {
        console.error('❌ HRRepository: Data is not an array:', typedResponse.data);
        throw new Error('Invalid data structure: expected array');
      }
      
      console.log('🔍 HRRepository: Response validation successful, departments count:', typedResponse.data.data.length);
      return response as HRResponse
    } catch (error) {
      console.error('❌ HRRepository: Error in getDepartmentsWithEmployees:', error);
      throw error;
    }
  }

  // Get all departments
  async getAllDepartments(): Promise<any> {
    const response = await publicApiClient.get('/departments')
    return response
  }

  // Get all employees
  async getAllEmployees(): Promise<any> {
    const response = await publicApiClient.get('/employees')
    return response
  }

  // Get employees by department
  async getEmployeesByDepartment(departmentId: string): Promise<any> {
    const response = await publicApiClient.get(`/employees/department/${departmentId}`)
    return response
  }
}

// Export singleton instance
export const hrRepository = new HRRepository()
