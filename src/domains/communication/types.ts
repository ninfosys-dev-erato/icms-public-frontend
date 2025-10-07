export interface Contact {
  id: string;
  department: string;
  contactType: 'general' | 'department' | 'emergency' | 'complaint';
  name: Record<string, string>;
  designation: Record<string, string>;
  phone: string[];
  email: string[];
  address: Record<string, ContactAddress>;
  workingHours: WorkingHours;
  isActive: boolean;
}

export interface ContactAddress {
  street: string;
  ward: string;
  municipality: string;
  district: string;
  province: string;
  postalCode?: string;
}

export interface WorkingHours {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface Complaint {
  id: string;
  trackingNumber: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'submitted' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed';
  submittedBy: ContactInfo;
  assignedTo?: string;
  submittedAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  resolution?: string;
  attachments: string[];
}

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}