import { PublicApiClient } from '@/repositories/http/PublicApiClient';
import type { 
  Employee, 
  EmployeeFilter, 
  EmployeePhotosResponse, 
  EmployeeSearchResponse, 
  EmployeeStatistics
} from '../types/employee';
import type { ApiResponse } from '../types/slider';

export class EmployeeRepository {
  private apiClient: PublicApiClient;

  constructor() {
    console.log('🏗️ EmployeeRepository constructor called');
    this.apiClient = new PublicApiClient();
    console.log('✅ EmployeeRepository initialized with API client');
    console.log('🔍 API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
  }

  /**
   * Get all employee photos with pagination and filtering
   */
  async getEmployeePhotos(params?: EmployeeFilter): Promise<EmployeePhotosResponse> {
    try {
      console.log('🔍 Calling API: /employees/photos with params:', params);
      const response = await this.apiClient.get<ApiResponse<EmployeePhotosResponse>>('/employees/photos', params);
      console.log('📡 API Response for all employees:', response);
      
      const result = this.apiClient.unwrapResponse(response);
      console.log('✅ Unwrapped result for all employees:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Failed to fetch employee photos:', error);
      throw error;
    }
  }

  /**
   * Search employee photos
   */
  async searchEmployeePhotos(query: string, params?: Omit<EmployeeFilter, 'search'>): Promise<EmployeeSearchResponse> {
    try {
      const response = await this.apiClient.get<ApiResponse<EmployeeSearchResponse>>('/employees/photos/search', {
        q: query,
        ...params
      });
      return this.apiClient.unwrapResponse(response);
    } catch (error) {
      console.error('Failed to search employee photos:', error);
      throw error;
    }
  }

  /**
   * Get employee photo statistics
   */
  async getEmployeeStatistics(): Promise<EmployeeStatistics> {
    try {
      const response = await this.apiClient.get<ApiResponse<EmployeeStatistics>>('/employees/photos/statistics');
      return this.apiClient.unwrapResponse(response);
    } catch (error) {
      console.error('Failed to fetch employee statistics:', error);
      throw error;
    }
  }

  /**
   * Get photos by department
   */
  async getPhotosByDepartment(departmentId: string): Promise<Employee[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<Employee[]>>(`/employees/department/${departmentId}/photos`);
      return this.apiClient.unwrapResponse(response);
    } catch (error) {
      console.error('Failed to fetch photos by department:', error);
      throw error;
    }
  }

  /**
   * Get photos by position
   */
  async getPhotosByPosition(position: string): Promise<Employee[]> {
    try {
      // Properly encode the position name for the URL
      const encodedPosition = encodeURIComponent(position);
      console.log(`🔍 Calling API: /employees/position/${encodedPosition}/photos`);
      
      // The backend returns the array directly, not wrapped in ApiResponse
      const response = await this.apiClient.get<Employee[]>(`/employees/position/${encodedPosition}/photos`);
      console.log(`📡 Raw API Response for position ${position}:`, response);
      
      // The response is already the array, no need to unwrap
      const result = response;
      console.log(`✅ Result for position ${position}:`, result);
      console.log(`🔍 Result type:`, typeof result);
      console.log(`🔍 Result is array:`, Array.isArray(result));
      console.log(`🔍 Result length:`, Array.isArray(result) ? result.length : 'Not an array');
      
      // Ensure we return an array
      if (Array.isArray(result)) {
        return result;
      } else if (result && typeof result === 'object' && 'data' in result) {
        // Handle case where response might be wrapped
        const wrappedResult = result as any;
        return Array.isArray(wrappedResult.data) ? wrappedResult.data : [];
      } else {
        console.warn(`⚠️ Unexpected response format for position ${position}:`, result);
        return [];
      }
    } catch (error) {
      console.error(`❌ Failed to fetch photos by position ${position}:`, error);
      throw error;
    }
  }

  /**
   * Get detailed employee information by position with photos
   */
  async getEmployeesByPositionWithDetails(position: string, locale: 'ne' | 'en' = 'en'): Promise<Employee[]> {
    try {
      // Properly encode the position name for the URL
      const encodedPosition = encodeURIComponent(position);
      console.log(`🔍 Calling API: /employees/position/${encodedPosition}/with-details-and-photos`);
      
      // This endpoint returns detailed employee data with photos
      const response = await this.apiClient.get<any>(`/employees/position/${encodedPosition}/with-details-and-photos`, { locale });
      console.log(`📡 Raw API Response for details ${position}:`, response);
      
      // Handle the API response structure: { success: true, data: [...], pagination: {...} }
      if (response && response.success && response.data && Array.isArray(response.data)) {
        const result = response.data;
        console.log(`✅ Result for details ${position}:`, result);
        console.log(`🔍 Result type:`, typeof result);
        console.log(`🔍 Result is array:`, Array.isArray(result));
        console.log(`🔍 Result length:`, Array.isArray(result) ? result.length : 'Not an array');
        
        return result;
      } else if (response && response.data && Array.isArray(response.data)) {
        // Fallback: direct data array
        return response.data;
      } else {
        console.warn(`⚠️ Unexpected response format for details ${position}:`, response);
        return [];
      }
    } catch (error) {
      console.error(`❌ Failed to fetch details by position ${position}:`, error);
      throw error;
    }
  }

  /**
   * Get specific employee photo
   */
  async getEmployeePhoto(employeeId: string): Promise<Employee | null> {
    try {
      const response = await this.apiClient.get<ApiResponse<Employee>>(`/employees/${employeeId}/photo`);
      return this.apiClient.unwrapResponse(response);
    } catch (error) {
      console.error('Failed to fetch employee photo:', error);
      return null;
    }
  }

  /**
   * Get key officers (Executive Director and Information Officer)
   */
  async getKeyOfficers(locale: 'ne' | 'en' = 'en'): Promise<Employee[]> {
    try {
      console.log('🔍 Fetching key officers...', { locale });
      
      // Define the exact case-sensitive position names we need
      const targetPositions = [
        'Executive Director',
        'Information Officer'
      ];

      let employees: Employee[] = [];
      
      // Try each position and collect results using the new endpoint
      for (const position of targetPositions) {
        try {
          console.log(`🔍 Trying position: ${position}`);
          
          // Get detailed employee information with photos using the new endpoint
          // Include locale in the query parameters
          const detailedResult = await this.getEmployeesByPositionWithDetails(position, locale);
          console.log(`📋 Position ${position} returned ${detailedResult.length} employees with details:`, detailedResult);
          
          if (detailedResult && detailedResult.length > 0) {
            // Add to our collection
            employees = [...employees, ...detailedResult];
          }
        } catch (error) {
          console.log(`❌ Position ${position} failed:`, error);
          // Continue to next position if this one fails
          continue;
        }
      }

      console.log(`📊 Total employees found: ${employees.length}`);

      // If we still don't have employees, try getting all employees and filtering
      if (employees.length === 0) {
        console.log('🔍 No employees found by position, trying to get all employees...');
        try {
          const allEmployees = await this.getEmployeePhotos({ limit: 20, isActive: true, locale });
          console.log(`📊 All employees response:`, allEmployees);
          
          if (allEmployees.data && allEmployees.data.length > 0) {
            // Filter active employees and sort by order
            employees = allEmployees.data
              .filter(emp => emp.isActive)
              .sort((a, b) => (b.order || 0) - (a.order || 0))
              .slice(0, 2);
            
            console.log(`✅ Found ${employees.length} employees from all employees`);
          }
        } catch (error) {
          console.error('❌ Failed to get all employees:', error);
        }
      }

      // Remove duplicates and return top 2 employees
      const uniqueEmployees = employees.filter((emp, index, self) => 
        index === self.findIndex(e => e.id === emp.id)
      );

      console.log(`🎯 Final result: ${uniqueEmployees.length} unique employees`);
      console.log(`🔍 Final employees data:`, uniqueEmployees);
      return uniqueEmployees.slice(0, 2);
    } catch (error) {
      console.error('❌ Failed to fetch key officers:', error);
      return [];
    }
  }
}
