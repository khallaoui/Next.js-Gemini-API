export type StatutAdherent = 'ACTIF' | 'INACTIF' | 'EN_ATTENTE';
export type StatutRemboursement = 'EN_COURS' | 'COMPLETE' | 'REJETE';
export type TypePrestation = 'RETRAITE' | 'ALLOCATION' | 'REMBOURSEMENT';

export interface PersonalInfo {
  lastName: string;
  firstName: string;
  gender: 'M' | 'F';
  familySituation: string;
  dateOfBirth: string; // ISO 8601 date string
  cin: string;
  address: string;
  ville: string;
}

export interface Pensioner {
  SCPTE: number; // Unique ID from MCRETRAI
  matricule: string;
  status: StatutAdherent;
  points: number;
  netCalculated: number;
  netPaid: number;
  paymentMethod: string;
  pensionCode: string;
  personalInfo: PersonalInfo;
}

export interface Operation {
  FNDP: number; // Corresponds to SCPTE
  type: 'C' | 'D'; // C for Credit, D for Debit
  amount: number;
  date: string; // ISO 8601 date string
  paymentMethod: string;
  reference: string;
}

export interface Banking {
  ALLOC: number; // Corresponds to SCPTE
  matricule: number;
  accountNumber: string;
  accountHolder: string;
  bankAddress: string;
}
