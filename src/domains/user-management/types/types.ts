export interface UserEntity {
  id: string;
  username: string;
  email: string;
  fullName: Record<string, string>;
  role: UserRole;
  department?: string;
  permissions: Permission[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRole {
  id: string;
  name: string;
  description: Record<string, string>;
  level: 'system_admin' | 'department_admin' | 'content_manager' | 'editor' | 'viewer';
  permissions: Permission[];
}

export interface Permission {
  id: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'publish' | 'approve';
  scope: 'all' | 'department' | 'own';
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  ipAddress?: string;
  userAgent?: string;
}