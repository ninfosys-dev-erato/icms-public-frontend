import { EmployeeRepository } from '../repositories/EmployeeRepository';
import type { Employee, EmployeeFilter, EmployeePhotosResponse, EmployeeSearchResponse, EmployeeStatistics } from '../types/employee';

export class EmployeeService {
  private employeeRepository: EmployeeRepository;

  constructor() {
    this.employeeRepository = new EmployeeRepository();
  }

  /**
   * Get all employee photos
   */
  async getEmployeePhotos(params?: EmployeeFilter): Promise<EmployeePhotosResponse> {
    return this.employeeRepository.getEmployeePhotos(params);
  }

  /**
   * Search employee photos
   */
  async searchEmployeePhotos(query: string, params?: Omit<EmployeeFilter, 'search'>): Promise<EmployeeSearchResponse> {
    return this.employeeRepository.searchEmployeePhotos(query, params);
  }

  /**
   * Get employee statistics
   */
  async getEmployeeStatistics(): Promise<EmployeeStatistics> {
    return this.employeeRepository.getEmployeeStatistics();
  }

  /**
   * Get photos by department
   */
  async getPhotosByDepartment(departmentId: string): Promise<Employee[]> {
    return this.employeeRepository.getPhotosByDepartment(departmentId);
  }

  /**
   * Get photos by position
   */
  async getPhotosByPosition(position: string): Promise<Employee[]> {
    return this.employeeRepository.getPhotosByPosition(position);
  }

  /**
   * Get specific employee photo
   */
  async getEmployeePhoto(employeeId: string): Promise<Employee | null> {
    return this.employeeRepository.getEmployeePhoto(employeeId);
  }

  /**
   * Get key officers for the slider sidebar
   */
  async getKeyOfficers(locale: 'ne' | 'en' = 'en'): Promise<Employee[]> {
    return this.employeeRepository.getKeyOfficers(locale);
  }

  /**
   * Get localized text for employee
   */
  getLocalizedText(entity: { ne: string; en: string }, locale: 'ne' | 'en'): string {
    return entity[locale] || entity.en || entity.ne || 'N/A';
  }

  /**
   * Format employee contact information
   */
  formatContactInfo(employee: Employee): {
    primary: string;
    secondary?: string;
  } {
    const contact = {
      primary: '',
      secondary: ''
    };

    if (employee.mobileNumber) {
      contact.primary = employee.mobileNumber;
      if (employee.telephone) {
        contact.secondary = employee.telephone;
      }
    } else if (employee.telephone) {
      contact.primary = employee.telephone;
    }

    if (employee.roomNumber && contact.primary) {
      contact.primary += ` (Room: ${employee.roomNumber})`;
    }

    return contact;
  }

  /**
   * Get employee photo URL with fallback
   */
  getEmployeePhotoUrl(employee: Employee): string | null {
    if (employee.photo?.url) {
      return employee.photo.url;
    }
    return null;
  }

  /**
   * Validate employee data
   */
  validateEmployee(employee: Employee): boolean {
    return !!(
      employee.id &&
      employee.name &&
      employee.position &&
      employee.isActive
    );
  }

  /**
   * Sort employees by order and activity
   */
  sortEmployees(employees: Employee[]): Employee[] {
    return employees
      .filter(emp => this.validateEmployee(emp))
      .sort((a, b) => {
        // First sort by active status
        if (a.isActive !== b.isActive) {
          return a.isActive ? -1 : 1;
        }
        // Then by order
        return (b.order || 0) - (a.order || 0);
      });
  }
}

// Export singleton instance for easier importing
export const employeeService = new EmployeeService();
