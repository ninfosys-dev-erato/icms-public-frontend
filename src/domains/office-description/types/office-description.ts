// Define types directly to avoid import conflicts
export enum OfficeDescriptionType {
  INTRODUCTION = 'INTRODUCTION',
  OBJECTIVE = 'OBJECTIVE',
  WORK_DETAILS = 'WORK_DETAILS',
  ORGANIZATIONAL_STRUCTURE = 'ORGANIZATIONAL_STRUCTURE',
  DIGITAL_CHARTER = 'DIGITAL_CHARTER',
  EMPLOYEE_SANCTIONS = 'EMPLOYEE_SANCTIONS',
}

export interface TranslatableEntity {
  ne: string;
  en: string;
}

export interface OfficeDescriptionResponse {
  id: string;
  officeDescriptionType: OfficeDescriptionType;
  content: TranslatableEntity;
  createdAt: string;
  updatedAt: string;
}

export interface OfficeDescriptionQuery {
  type?: OfficeDescriptionType;
  lang?: string;
}