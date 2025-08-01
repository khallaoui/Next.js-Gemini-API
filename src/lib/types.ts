export type StatutAdherent = 'ACTIF' | 'INACTIF' | 'EN_ATTENTE';
export type StatutRemboursement = 'EN_COURS' | 'COMPLETE' | 'REJETE';
export type TypePrestation = 'RETRAITE' | 'ALLOCATION' | 'REMBOURSEMENT';

export type StatutDemande = 'Approuvée' | 'Rejetée' | 'En cours' | 'En attente';
export type TypeDemande = 'Liquidation de pension' | 'Réclamation' | 'Mise à jour du dossier';

export interface Demande {
  id: string;
  pensionerId: number;
  type: TypeDemande;
  status: StatutDemande;
  submissionDate: string; // ISO 8601 date string
  decisionDate?: string; // ISO 8601 date string
}

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
  FCDMVT: string;     // CHAR(1)
  FCDRET: number;     // DECIMAL(1, 0)
  FNDP: number;       // DECIMAL(7, 0)
  FJJCR: number;      // DECIMAL(2, 0)
  FMMCR: number;      // DECIMAL(2, 0)
  FAACR: number;      // DECIMAL(4, 0)
  FMMECH: number;     // DECIMAL(2, 0)
  FAAECH: number;     // DECIMAL(4, 0)
  FMDREG: string;     // CHAR(1)
  FJLCR: number;      // DECIMAL(2, 0)
  FSJLCR: string;     // CHAR(3)
  FMTCR: number;      // DECIMAL(8, 2)
  FMTREG: number;     // DECIMAL(8, 2)
  FJJREG: number;     // DECIMAL(2, 0)
  FMMREG: number;     // DECIMAL(2, 0)
  FAAREG: number;     // DECIMAL(4, 0)
  FJLREG: number;     // DECIMAL(2, 0)
  FSJREG: string;     // CHAR(3)
  FCHQBD: string;     // CHAR(7)
  FORD: string;       // CHAR(1)
  FCOD1: number;      // DECIMAL(2, 0)
  FCOD2: string;      // CHAR(2)
  FMONT1: number;     // DECIMAL(9, 2)
  FMONT2: number;     // DECIMAL(9, 2)
}

export interface Banking {
  ALLOC: number; // Corresponds to SCPTE, references accounts.account_id
  VMAT: number; // References mcretrai.MATRIC
  VCPTE: string;
  VNOM1: string;
  VADR1: string;
}
