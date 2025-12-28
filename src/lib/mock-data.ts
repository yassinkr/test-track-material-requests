import { MaterialRequest, User, Project } from '@/types/material-request';

const STORAGE_KEY = 'material_requests';
const USER_KEY = 'current_user';

// Mock user for demo
export const MOCK_USER: User = {
  id: 'user-1',
  name: 'John Builder',
  email: 'john@construction.co',
  company_id: 'company-1',
  company_name: 'BuildRight Construction',
};

// Mock projects
export const MOCK_PROJECTS = [
  { id: 'd624ca41-9a5e-4678-8624-c34b3a9c1d4f', name: 'Main Building Renovation' },
  { id: '9944617c-00e4-41d6-af7a-2becc1c3c399', name: 'New Warehouse' },
  { id: 'd24b7c4f-2aa8-4852-81e3-2830f9d4b086', name: 'Bridge Construction' },
  { id: '5830cb8d-c387-4f88-a368-5c9f193f8a86', name: 'Parking Lot Expansion' },
  { id: 'e2ddc3c1-873f-4be3-80ee-d094ab6b750b', name: 'Office Interior Renovation' },
  { id: 'cfc14371-1dc9-4bdc-8787-f9ad214b31ac', name: 'New Factory' },
  { id: '760a2da7-f4e5-4c9e-9898-1cc8058e5b9b', name: 'Road Paving' },
  { id: '800125f5-8039-4e2b-8e93-e8f733a93b37', name: 'Bridge Maintenance' },
  { id: 'c315109c-276d-4cf0-80bf-bae545ed9735', name: 'Warehouse Extension' },
  { id: 'f29967e9-bf0b-437b-8495-f719a97680e3', name: 'Main Building Renovation Phase 2' },
  { id: '1b97b57d-5402-486d-9c7a-4d4615b38e1e', name: 'Site Survey' },
  { id: '74698385-7fba-454e-be5b-aee24ab25e84', name: 'Equipment Installation' },
];

// Initial mock data
const INITIAL_REQUESTS: MaterialRequest[] = [
  {
    id: 'req-1',
    project_id: 'project-1',
    material_name: 'Portland Cement',
    quantity: 500,
    unit: 'bags',
    status: 'pending',
    priority: 'high',
    requested_by: 'user-1',
    requested_by_name: 'John Builder',
    requested_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Needed for foundation work on floors 15-20',
    company_id: 'company-1',
  },
  {
    id: 'req-2',
    project_id: 'project-1',
    material_name: 'Steel Rebar #5',
    quantity: 2000,
    unit: 'm',
    status: 'approved',
    priority: 'urgent',
    requested_by: 'user-1',
    requested_by_name: 'John Builder',
    requested_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Structural reinforcement - critical path item',
    company_id: 'company-1',
  },
  {
    id: 'req-3',
    project_id: 'project-2',
    material_name: 'Drywall Sheets 4x8',
    quantity: 350,
    unit: 'sheets',
    status: 'fulfilled',
    priority: 'medium',
    requested_by: 'user-1',
    requested_by_name: 'John Builder',
    requested_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Interior walls for units 101-115',
    company_id: 'company-1',
  },
  {
    id: 'req-4',
    project_id: 'project-3',
    material_name: 'Waterproof Membrane',
    quantity: 150,
    unit: 'rolls',
    status: 'rejected',
    priority: 'low',
    requested_by: 'user-1',
    requested_by_name: 'John Builder',
    requested_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Wrong specification - need to resubmit',
    company_id: 'company-1',
  },
  {
    id: 'req-5',
    project_id: 'project-1',
    material_name: 'Electrical Conduit 1"',
    quantity: 500,
    unit: 'm',
    status: 'pending',
    priority: 'medium',
    requested_by: 'user-1',
    requested_by_name: 'John Builder',
    requested_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'For main electrical runs floors 1-10',
    company_id: 'company-1',
  },
];

export function getStoredRequests(): MaterialRequest[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize with mock data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REQUESTS));
  return INITIAL_REQUESTS;
}

export function saveRequests(requests: MaterialRequest[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export function getCurrentUser(): User {
  const stored = localStorage.getItem(USER_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(USER_KEY, JSON.stringify(MOCK_USER));
  return MOCK_USER;
}

export function generateId(): string {
  return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
