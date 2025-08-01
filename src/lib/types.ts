export type StatutAdherent = 'ACTIF' | 'INACTIF' | 'EN_ATTENTE';
export type StatutRemboursement = 'EN_COURS' | 'COMPLETE' | 'REJETE';
export type TypePrestation = 'RETRAITE' | 'ALLOCATION' | 'REMBOURSEMENT';

export interface Pensioner {
  SCPTE: number;
  MATRIC: number;
  ADHRT: number;
  NOM1: string;
  NOM2: string;
  SEXE: 'M' | 'F';
  SITFAM: string;
  JJNSP: number;
  MMNSP: number;
  AANSP: number;
  CIN: string;
  ADRESA: string;
  ADRESB: string;
  CODVIL: string;
  VILLE: string;
  PAYS: string;
  CODPEN: string;
  PTS: number;
  NETCAL: number;
  NETRGT: number;
  MODREG: string;
  statut?: StatutAdherent;
}

export interface Operation {
  FNDP: number;
  FCDMVT: 'C' | 'D';
  FMTCR: number;
  FMTREG: number;
  FJJCR: number;
  FMMCR: number;
  FAACR: number;
  FJJREG: number;
  FMMREG: number;
  FAAREG: number;
  FMDREG: string;
  FCHQBD: string;
  type?: TypePrestation;
}

export interface Banking {
  ALLOC: number;
  VMAT: number;
  VCPTE: string;
  VNOM1: string;
  VNOM2: string;
  VADR1: string;
  VADR2: string;
  VADR3: string;
  VVILL: string;
  VPAYS: string;
}
