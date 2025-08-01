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
  SCPTE: number; // Unique ID from mcretrai, references accounts.account_id
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
  FNDP: number; // Corresponds to SCPTE, references accounts.account_id
  FCDMVT: 'C' | 'D'; // C for Credit, D for Debit
  FMTREG: number;
  FJJREG: number; // Day
  FMMREG: number; // Month
  FAAREG: number; // Year
  FMDREG: string;
  FCHQBD: string;
}

export interface Banking {
  ALLOC: number; // Corresponds to SCPTE, references accounts.account_id
  VMAT: number; // References mcretrai.MATRIC
  VCPTE: string;
  VNOM1: string;
  VADR1: string;
}
