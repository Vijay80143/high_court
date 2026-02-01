
export enum CourtType {
  SUPREME_COURT = 'Supreme Court',
  HIGH_COURT = 'High Court',
  DISTRICT_COURT = 'District Court'
}

export enum CourtState {
  TELANGANA = 'Telangana',
  ANDHRA_PRADESH = 'Andhra Pradesh',
  ALL = 'National'
}

export interface CaseStatus {
  id: string;
  caseNumber: string;
  petitioner: string;
  respondent: string;
  advocate: string;
  judge: string;
  court: string;
  state: CourtState;
  nextHearing: string;
  status: string;
  lastOrder?: string;
}

export interface FirmCase {
  caseNumber: string;
  advocate: string;
  parties: string;
  status: string;
  nextDate: string;
  courtLocation: string;
  todayUpdate: string;
  portalLink: string;
}

export interface DisplayBoardItem {
  courtNumber: string;
  judgeName: string;
  serialRunning: number;
  yourItems: number[];
  nextItemEstimatedTime?: string;
  totalItems: number;
}

export interface FirmProfile {
  names: string[];
  firmName: string;
}

export interface SearchResult {
  title: string;
  uri: string;
}
