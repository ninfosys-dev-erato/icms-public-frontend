export interface Employee {
  id: string;
  name: {
    en: string;
    ne: string;
  };
  departmentId: string;
  position: {
    en: string;
    ne: string;
  };
  order: number;
  mobileNumber: string;
  telephone: string;
  email: string;
  roomNumber: string;
  photoMediaId: string;
  photo: {
    id: string;
    fileName: string;
    originalName: string;
    url: string;
    fileId: string;
    size: number;
    contentType: string;
    uploadedBy: string;
    folder: string;
    category: string;
    altText: string;
    title: string;
    description: string;
    tags: string[];
    isPublic: boolean;
    isActive: boolean;
    metadata: {
      depth: string;
      space: string;
      width: number;
      format: string;
      height: number;
      density: number;
      channels: number;
      hasAlpha: boolean;
      hasProfile: boolean;
    };
    createdAt: string;
    updatedAt: string;
    presignedUrl: string;
  };
  isActive: boolean;
  showUpInHomepage: boolean;
  showDownInHomepage: boolean;
  department: {
    id: string;
    departmentName: {
      en: string;
      ne: string;
    };
    parentId: string | null;
    departmentHeadId: string | null;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EmployeesResponse {
  success: boolean;
  data: Employee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  meta: {
    timestamp: string;
    version: string;
    requestId: string;
    processingTime: number;
  };
}