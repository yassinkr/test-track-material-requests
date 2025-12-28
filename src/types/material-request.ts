export type MaterialRequestStatus = 'pending' | 'approved' | 'rejected' | 'fulfilled';
export type MaterialRequestPriority = 'low' | 'medium' | 'high' | 'urgent';
export type MaterialUnit = 'kg' | 'm' | 'pieces' | 'liters' | 'bags' | 'boxes' | 'sheets' | 'rolls';

export interface MaterialRequest {
  id: string;
  project_id: string | null;
  material_name: string;
  quantity: number;
  unit: MaterialUnit;
  status: MaterialRequestStatus;
  priority: MaterialRequestPriority;
  requested_by: string;
  requested_by_name: string;
  requested_at: string;
  notes: string | null;
  company_id: string;
}

export interface CreateMaterialRequestInput {
  material_name: string;
  quantity: number;
  unit: MaterialUnit;
  priority: MaterialRequestPriority;
  notes?: string;
  project_id?: string;
}

export interface UpdateMaterialRequestInput extends Partial<CreateMaterialRequestInput> {
  status?: MaterialRequestStatus;
}

export interface User {
  id: string;
  name: string;
  email: string;
  company_id: string;
  company_name: string;
}

export interface Project {
  id: string;
  name: string;
  company_id: string;
}

export const UNITS: { value: MaterialUnit; label: string }[] = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'm', label: 'Meters (m)' },
  { value: 'pieces', label: 'Pieces' },
  { value: 'liters', label: 'Liters (L)' },
  { value: 'bags', label: 'Bags' },
  { value: 'boxes', label: 'Boxes' },
  { value: 'sheets', label: 'Sheets' },
  { value: 'rolls', label: 'Rolls' },
];

export const PRIORITIES: { value: MaterialRequestPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export const STATUSES: { value: MaterialRequestStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'fulfilled', label: 'Fulfilled' },
];
