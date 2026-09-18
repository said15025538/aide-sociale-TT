export type UserRole = 'employee' | 'social_worker' | 'social_manager' | 'admin';

export type Language = 'fr' | 'ar' | 'en';

export type ApplicationStatus = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'info_requested'
  | 'complete'
  | 'pending_validation'
  | 'approved'
  | 'rejected'
  | 'closed';

export interface User {
  id: string;
  matricule: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  regionalDirection: string; // Ex: Tunis, Sfax, Sousse, Bizerte, Gabes
  grade: string;
  hireDate: string;
  familyStatus: 'single' | 'married' | 'divorced' | 'widowed';
  childrenCount: number;
  avatarUrl?: string;
}

export interface RequiredDocumentDef {
  id: string;
  code: string;
  name: string;
  description: string;
  isMandatory: boolean;
  acceptedFormats: string[]; // e.g. ['pdf', 'jpg', 'png']
  maxSizeMB: number;
}

export interface AssistanceCategory {
  id: string;
  code: string;
  title: string;
  titleAr: string;
  description: string;
  iconName: string;
  ceilingAmountTND: number;
  requiresCommission: boolean;
  slaDays: number;
  requiredDocuments: RequiredDocumentDef[];
  customFields?: {
    id: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select';
    options?: string[];
    required: boolean;
  }[];
  active: boolean;
}

export interface UploadedDocument {
  id: string;
  documentDefId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  status: 'pending_check' | 'approved' | 'rejected';
  rejectionReason?: string;
  fileUrl?: string;
}

export interface ApplicationComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  isInternalNote: boolean; // if true, only social worker & manager can view
  content: string;
  createdAt: string;
}

export interface StatusHistoryEntry {
  id: string;
  fromStatus: ApplicationStatus;
  toStatus: ApplicationStatus;
  changedBy: string;
  changedByName: string;
  changedByRole: UserRole;
  timestamp: string;
  comment?: string;
}

export interface DecisionRecord {
  id: string;
  applicationId: string;
  decidedBy: string;
  decidedByName: string;
  decision: 'approved' | 'rejected' | 'modified';
  approvedAmountTND?: number;
  motivation: string;
  decisionDate: string;
  pvNumber?: string;
  officialDocumentGenerated: boolean;
}

export interface AssistanceApplication {
  id: string;
  referenceNumber: string; // Ex: TT-SOC-2025-0842
  employeeId: string;
  employeeName: string;
  employeeMatricule: string;
  employeeDepartment: string;
  employeeRegion: string;
  employeePhone: string;
  categoryId: string;
  categoryCode: string;
  categoryTitle: string;
  requestedAmountTND?: number;
  proposedAmountTND?: number;
  finalAmountTND?: number;
  subject: string;
  situationDescription: string;
  customFieldValues?: Record<string, string | number>;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  documents: UploadedDocument[];
  comments: ApplicationComment[];
  statusHistory: StatusHistoryEntry[];
  decision?: DecisionRecord;
  missingItemsNote?: string;
  dueDate?: string;
  priority: 'normal' | 'urgent' | 'high';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  details: string;
  severity: 'info' | 'warning' | 'security';
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'status_change' | 'doc_request' | 'approval' | 'message' | 'system';
  applicationId?: string;
}
