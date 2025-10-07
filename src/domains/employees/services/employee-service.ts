import { publicApiClient } from '@/repositories/http/PublicApiClient';
import { EmployeesResponse } from '../types/employee';

export class EmployeeService {
  async getEmployees(): Promise<EmployeesResponse> {
    try {
      const response = await publicApiClient.get('/employees');
      return response as EmployeesResponse;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  async getEmployeesForHomepage(): Promise<EmployeesResponse> {
    try {
      const response = await this.getEmployees();
      return response;
    } catch (error) {
      console.error('Error fetching employees for homepage:', error);
      throw error;
    }
  }
}

export const employeeService = new EmployeeService();