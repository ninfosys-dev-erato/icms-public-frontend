export interface ServiceApplication {
  id: string;
  serviceId: string;
  applicantId: string;
  formData: Record<string, unknown>;
  status: ApplicationStatus;
  submittedAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  trackingNumber: string;
  assignedTo?: string;
  documents: ApplicationDocument[];
  paymentId?: string;
  notes: ApplicationNote[];
}

export type ApplicationStatus = 
  | 'submitted'
  | 'under_review'
  | 'pending_documents'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'cancelled';

export interface ApplicationDocument {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
  uploadedAt: Date;
  verified: boolean;
  verifiedBy?: string;
}

export interface ApplicationNote {
  id: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  isPublic: boolean;
}

export interface Payment {
  id: string;
  applicationId: string;
  amount: number;
  currency: 'NPR';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  method: 'online' | 'bank_transfer' | 'cash';
  transactionId?: string;
  paidAt?: Date;
}