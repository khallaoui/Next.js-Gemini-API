// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Types matching the Spring Boot backend
export interface Pensioner {
  id?: number;
  name: string;
  city: string;
  monthlyPayment: number;
  paymentMethod: 'BANK_TRANSFER' | 'CHECK' | 'CASH' | 'DIGITAL_WALLET';
  lastPaymentDate?: string;
  birthDate?: string;
  phoneNumber?: string;
}

export interface Operation {
  id?: number;
  pensioner?: Pensioner;
  pensionerId?: number;
  amount: number;
  type: 'PAYMENT' | 'ADJUSTMENT' | 'BONUS' | 'DEDUCTION';
  timestamp: string;
  description?: string;
}

export interface Group {
  id?: number;
  name: string;
  description?: string;
  pensioners?: Pensioner[];
}

export interface DashboardStats {
  totalPensioners: number;
  pensionersByCity: Array<[string, number]>;
  pensionersByPaymentMethod: Array<[string, number]>;
  totalOperations: number;
}

export interface Demande {
  id: string;
  pensionerId: number;
  type: string;
  status: 'En cours' | 'Approuvée' | 'Rejetée';
  submissionDate: string;
  decisionDate?: string;
}

export interface BankingInfo {
  id?: number;
  pensionerId: number;
  accountNumber: string;
  accountHolderName: string;
  bankAddress: string;
}

export interface CompanyGroup {
  id: number;
  companyName: string;
  sector: string;
  memberCount: number;
  totalContribution: number;
  city: string;
}

export interface Affilie {
  idAffilie: number;
  matricule: string;
  nom: string;
  prenom: string;
  actif: boolean;
  ayantDroit: boolean;
  adherentId: number;
}

export interface Allocataire {
  idAllocataire: number;
  numeroDossier: string;
  nom: string;
  prenom: string;
  affilieId: number;
}

// Generic API request function with Spring Security session support
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include', // Include cookies for Spring Security session
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Don't interfere with authentication - let the auth context handle it
      // Just log the error for debugging
      if (response.status === 401 || response.status === 403) {
        console.log(`API: Authentication error ${response.status} for ${endpoint}`);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Pensioner API functions
export const pensionerApi = {
  // Get all pensioners
  getAll: (): Promise<Pensioner[]> => 
    apiRequest<Pensioner[]>('/pensioners'),

  // Get pensioner by ID
  getById: (id: number): Promise<Pensioner> => 
    apiRequest<Pensioner>(`/pensioners/${id}`),

  // Create new pensioner
  create: (pensioner: Omit<Pensioner, 'id'>): Promise<Pensioner> => 
    apiRequest<Pensioner>('/pensioners', {
      method: 'POST',
      body: JSON.stringify(pensioner),
    }),

  // Update pensioner
  update: (id: number, pensioner: Omit<Pensioner, 'id'>): Promise<Pensioner> => 
    apiRequest<Pensioner>(`/pensioners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pensioner),
    }),

  // Delete pensioner
  delete: (id: number): Promise<void> => 
    apiRequest<void>(`/pensioners/${id}`, {
      method: 'DELETE',
    }),

  // Get pensioners by city
  getByCity: (city: string): Promise<Pensioner[]> => 
    apiRequest<Pensioner[]>(`/pensioners/city/${city}`),
};

// Operation API functions
export const operationApi = {
  // Get all operations
  getAll: (): Promise<Operation[]> => 
    apiRequest<Operation[]>('/operations'),

  // Get operation by ID
  getById: (id: number): Promise<Operation> => 
    apiRequest<Operation>(`/operations/${id}`),

  // Create new operation
  create: (operation: Omit<Operation, 'id'>): Promise<Operation> => 
    apiRequest<Operation>('/operations', {
      method: 'POST',
      body: JSON.stringify(operation),
    }),

  // Update operation
  update: (id: number, operation: Omit<Operation, 'id'>): Promise<Operation> => 
    apiRequest<Operation>(`/operations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(operation),
    }),

  // Delete operation
  delete: (id: number): Promise<void> => 
    apiRequest<void>(`/operations/${id}`, {
      method: 'DELETE',
    }),

  // Get operations by pensioner ID
  getByPensionerId: (pensionerId: number): Promise<Operation[]> => 
    apiRequest<Operation[]>(`/operations/pensioner/${pensionerId}`),

  // Get operations by type
  getByType: (type: Operation['type']): Promise<Operation[]> => 
    apiRequest<Operation[]>(`/operations/type/${type}`),

  // Get recent operations (last N operations)
  getRecent: (limit: number = 10): Promise<Operation[]> => 
    apiRequest<Operation[]>(`/operations/recent?limit=${limit}`),
};

// Group API functions
export const groupApi = {
  // Get all groups
  getAll: (): Promise<Group[]> => 
    apiRequest<Group[]>('/groups'),

  // Get group by ID
  getById: (id: number): Promise<Group> => 
    apiRequest<Group>(`/groups/${id}`),

  // Create new group
  create: (group: Omit<Group, 'id'>): Promise<Group> => 
    apiRequest<Group>('/groups', {
      method: 'POST',
      body: JSON.stringify(group),
    }),

  // Update group
  update: (id: number, group: Omit<Group, 'id'>): Promise<Group> => 
    apiRequest<Group>(`/groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(group),
    }),

  // Delete group
  delete: (id: number): Promise<void> => 
    apiRequest<void>(`/groups/${id}`, {
      method: 'DELETE',
    }),

  // Add pensioner to group
  addPensioner: (groupId: number, pensionerId: number): Promise<void> => 
    apiRequest<void>(`/groups/${groupId}/pensioners/${pensionerId}`, {
      method: 'POST',
    }),

  // Remove pensioner from group
  removePensioner: (groupId: number, pensionerId: number): Promise<void> => 
    apiRequest<void>(`/groups/${groupId}/pensioners/${pensionerId}`, {
      method: 'DELETE',
    }),
};

// Dashboard API functions
export const dashboardApi = {
  // Get dashboard statistics
  getStats: (): Promise<DashboardStats> => 
    apiRequest<DashboardStats>('/dashboard/stats'),
};

// Demande API functions (for pension requests/claims)
export const demandeApi = {
  // Get all demandes
  getAll: (): Promise<Demande[]> => 
    apiRequest<Demande[]>('/demandes'),

  // Get demande by ID
  getById: (id: string): Promise<Demande> => 
    apiRequest<Demande>(`/demandes/${id}`),

  // Get demandes by pensioner ID
  getByPensionerId: (pensionerId: number): Promise<Demande[]> => 
    apiRequest<Demande[]>(`/demandes/pensioner/${pensionerId}`),

  // Create new demande
  create: (demande: Omit<Demande, 'id'>): Promise<Demande> => 
    apiRequest<Demande>('/demandes', {
      method: 'POST',
      body: JSON.stringify(demande),
    }),

  // Update demande
  update: (id: string, demande: Omit<Demande, 'id'>): Promise<Demande> => 
    apiRequest<Demande>(`/demandes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(demande),
    }),

  // Delete demande
  delete: (id: string): Promise<void> => 
    apiRequest<void>(`/demandes/${id}`, {
      method: 'DELETE',
    }),
};

// Banking API functions
export const bankingApi = {
  // Get all banking info
  getAll: (): Promise<BankingInfo[]> => 
    apiRequest<BankingInfo[]>('/banking'),

  // Get banking info by pensioner ID
  getByPensionerId: (pensionerId: number): Promise<BankingInfo> => 
    apiRequest<BankingInfo>(`/banking/pensioner/${pensionerId}`),

  // Create banking info
  create: (bankingInfo: Omit<BankingInfo, 'id'>): Promise<BankingInfo> => 
    apiRequest<BankingInfo>('/banking', {
      method: 'POST',
      body: JSON.stringify(bankingInfo),
    }),

  // Update banking info
  update: (id: number, bankingInfo: Omit<BankingInfo, 'id'>): Promise<BankingInfo> => 
    apiRequest<BankingInfo>(`/banking/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bankingInfo),
    }),

  // Delete banking info
  delete: (id: number): Promise<void> => 
    apiRequest<void>(`/banking/${id}`, {
      method: 'DELETE',
    }),
};

// Company Groups API functions (for corporate groups)
export const companyGroupApi = {
  // Get all company groups
  getAll: (): Promise<CompanyGroup[]> => 
    apiRequest<CompanyGroup[]>('/company-groups'),

  // Get company group by ID
  getById: (id: number): Promise<CompanyGroup> => 
    apiRequest<CompanyGroup>(`/company-groups/${id}`),

  // Get company groups by city
  getByCity: (city: string): Promise<CompanyGroup[]> => 
    apiRequest<CompanyGroup[]>(`/company-groups/city/${city}`),

  // Get company groups by sector
  getBySector: (sector: string): Promise<CompanyGroup[]> => 
    apiRequest<CompanyGroup[]>(`/company-groups/sector/${sector}`),

  // Create company group
  create: (group: Omit<CompanyGroup, 'id'>): Promise<CompanyGroup> => 
    apiRequest<CompanyGroup>('/company-groups', {
      method: 'POST',
      body: JSON.stringify(group),
    }),

  // Update company group
  update: (id: number, group: Omit<CompanyGroup, 'id'>): Promise<CompanyGroup> => 
    apiRequest<CompanyGroup>(`/company-groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(group),
    }),

  // Delete company group
  delete: (id: number): Promise<void> => 
    apiRequest<void>(`/company-groups/${id}`, {
      method: 'DELETE',
    }),
};

// Affilie API functions
export const affilieApi = {
  // Get all affilies
  getAll: (): Promise<Affilie[]> => 
    apiRequest<Affilie[]>('/affilies'),

  // Get affilie by ID
  getById: (id: number): Promise<Affilie> => 
    apiRequest<Affilie>(`/affilies/${id}`),

  // Create new affilie
  create: (affilie: Omit<Affilie, 'idAffilie'>): Promise<Affilie> => 
    apiRequest<Affilie>('/affilies', {
      method: 'POST',
      body: JSON.stringify(affilie),
    }),

  // Update affilie
  update: (id: number, affilie: Omit<Affilie, 'idAffilie'>): Promise<Affilie> => 
    apiRequest<Affilie>(`/affilies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(affilie),
    }),

  // Delete affilie
  delete: (id: number): Promise<void> => 
    apiRequest<void>(`/affilies/${id}`, {
      method: 'DELETE',
    }),
};

// Allocataire API functions
export const allocataireApi = {
  // Get all allocataires
  getAll: (): Promise<Allocataire[]> => 
    apiRequest<Allocataire[]>('/allocataires'),

  // Get allocataire by ID
  getById: (id: number): Promise<Allocataire> => 
    apiRequest<Allocataire>(`/allocataires/${id}`),

  // Create new allocataire
  create: (allocataire: Omit<Allocataire, 'idAllocataire'>): Promise<Allocataire> => 
    apiRequest<Allocataire>('/allocataires', {
      method: 'POST',
      body: JSON.stringify(allocataire),
    }),

  // Update allocataire
  update: (id: number, allocataire: Omit<Allocataire, 'idAllocataire'>): Promise<Allocataire> => 
    apiRequest<Allocataire>(`/allocataires/${id}`, {
      method: 'PUT',
      body: JSON.stringify(allocataire),
    }),

  // Delete allocataire
  delete: (id: number): Promise<void> => 
    apiRequest<void>(`/allocataires/${id}`, {
      method: 'DELETE',
    }),

  // Get allocataires by affilie ID
  getByAffilieId: (affilieId: number): Promise<Allocataire[]> => 
    apiRequest<Allocataire[]>(`/allocataires/affilie/${affilieId}`),
};

// Legacy function for backward compatibility
export async function getTotalAmountByPensioner(id: number): Promise<number> {
  try {
    const operations = await operationApi.getByPensionerId(id);
    return operations.reduce((total, operation) => {
      if (operation.type === 'PAYMENT' || operation.type === 'BONUS') {
        return total + operation.amount;
      } else if (operation.type === 'DEDUCTION') {
        return total - operation.amount;
      }
      return total;
    }, 0);
  } catch (error) {
    console.error('Failed to calculate total amount for pensioner:', error);
    throw error;
  }
}

// Utility functions for data transformation
export const transformers = {
  // Transform legacy pensioner data to new format
  legacyPensionerToNew: (legacyPensioner: any): Pensioner => ({
    id: legacyPensioner.SCPTE,
    name: `${legacyPensioner.personalInfo?.firstName || ''} ${legacyPensioner.personalInfo?.lastName || ''}`.trim(),
    city: legacyPensioner.personalInfo?.ville || '',
    monthlyPayment: legacyPensioner.netPaid || 0,
    paymentMethod: legacyPensioner.paymentMethod === 'Virement' ? 'BANK_TRANSFER' : 
                   legacyPensioner.paymentMethod === 'Chèque' ? 'CHECK' : 'CASH',
    birthDate: legacyPensioner.personalInfo?.dateOfBirth,
    phoneNumber: legacyPensioner.personalInfo?.phone,
  }),

  // Transform legacy operation data to new format
  legacyOperationToNew: (legacyOperation: any): Operation => ({
    id: legacyOperation.id,
    pensionerId: legacyOperation.FNDP,
    amount: legacyOperation.FMTCR || 0,
    type: legacyOperation.FCDMVT === 'C' ? 'PAYMENT' : 
          legacyOperation.FCDMVT === 'D' ? 'DEDUCTION' : 'ADJUSTMENT',
    timestamp: new Date().toISOString(), // You might want to construct this from FJJCR, FMMCR, FAACR
    description: `${legacyOperation.FORD || ''} - ${legacyOperation.FCOD2 || ''}`,
  }),
};