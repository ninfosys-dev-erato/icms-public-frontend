import React from 'react';
import { render, screen } from '@testing-library/react';
import { EmployeeCard } from '../components/EmployeeCard';
import type { Employee } from '../types/employee';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

const mockEmployee: Employee = {
  id: '1',
  name: {
    en: 'John Doe',
    ne: 'जोन डो'
  },
  position: {
    en: 'Executive Director',
    ne: 'कार्यकारी निर्देशक'
  },
  department: {
    id: 'dept1',
    departmentName: {
      en: 'Management',
      ne: 'प्रबन्धन'
    },
    parentId: null,
    departmentHeadId: null,
    order: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  photo: {
    id: 'photo1',
    fileName: 'john-doe.jpg',
    originalName: 'john-doe.jpg',
    url: 'https://example.com/john-doe.jpg',
    fileId: 'file123',
    size: 1024,
    contentType: 'image/jpeg',
    uploadedBy: 'user1',
    folder: 'employees',
    category: 'image',
    altText: 'John Doe photo',
    title: 'Employee Photo',
    description: 'Photo for John Doe',
    tags: ['employee', 'photo'],
    isPublic: true,
    isActive: true,
    metadata: {
      depth: 'uchar',
      space: 'srgb',
      width: 200,
      format: 'jpeg',
      height: 200,
      density: 72,
      channels: 3,
      hasAlpha: false,
      hasProfile: false
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  presignedUrl: 'https://example.com/john-doe.jpg?token=abc123',
  email: 'john.doe@example.com',
  telephone: '123-456-7890',
  mobileNumber: '098-765-4321',
  roomNumber: '101',
  isActive: true,
  order: 1,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

describe('EmployeeCard', () => {
  it('renders employee information correctly', () => {
    render(<EmployeeCard employee={mockEmployee} locale="en" />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Executive Director')).toBeInTheDocument();
    expect(screen.getByText('Management')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('098-765-4321 (Ext: 101)')).toBeInTheDocument();
  });

  it('renders in Nepali locale correctly', () => {
    render(<EmployeeCard employee={mockEmployee} locale="ne" />);
    
    expect(screen.getByText('जोन डो')).toBeInTheDocument();
    expect(screen.getByText('कार्यकारी निर्देशक')).toBeInTheDocument();
    expect(screen.getByText('प्रबन्धन')).toBeInTheDocument();
  });

  it('shows fallback initials when no photo is available', () => {
    const employeeWithoutPhoto = { ...mockEmployee, photo: undefined };
    render(<EmployeeCard employee={employeeWithoutPhoto} locale="en" />);
    
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('handles missing contact information gracefully', () => {
    const employeeWithoutContact = {
      ...mockEmployee,
      email: undefined,
      phone: undefined,
      mobile: undefined,
      extension: undefined
    };
    
    render(<EmployeeCard employee={employeeWithoutContact} locale="en" />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Executive Director')).toBeInTheDocument();
    // Should not show contact information
    expect(screen.queryByText(/📞/)).not.toBeInTheDocument();
    expect(screen.queryByText(/✉️/)).not.toBeInTheDocument();
  });
});
