// Patient and Clinical Data Types
export interface Demographics {
  name: string;
  dob: string;
  member_id: string;
  address: string;
}

export interface ClinicalRecord {
  date: string;
  type: string;
  provider: string;
  content: string;
}

export interface Diagnosis {
  code: string;
  description: string;
}

export interface LabResult {
  date: string;
  test: string;
  result: string;
  reference: string;
}

export interface Patient {
  patient_id: string;
  demographics: Demographics;
  clinical_records: ClinicalRecord[];
  diagnoses: Diagnosis[];
  medications: string[];
  lab_results: LabResult[];
}

export interface PatientData {
  patients: Patient[];
}

// Service Types
export type ServiceType = 'IOP' | 'PHP';

// Prior Authorization Form Types
export interface PriorAuthorizationForm {
  // Section 1: Member Information
  memberName: string;
  dob: string;
  memberId: string;
  diagnosisDate: string;
  authStartDate: string;
  authEndDate: string;
  
  // Section 2: Provider Information
  facilityName: string;
  npi: string;
  contactPerson: string;
  phone: string;
  fax: string;
  
  // Section 3: Service Requested
  serviceType: ServiceType;
  initialRequestDuration: string;
  
  // Section 4: Clinical Information
  primaryDiagnosis: string;
  additionalDiagnoses: string[];
  substanceUse: {
    lastUseDate: string;
    frequency: string;
    amount: string;
    route: string;
  };
  currentSymptoms: string;
  withdrawalRisk: {
    ciwaArScore: number;
    cowsScore: number;
    historyOfSeizures: boolean;
    historyOfDTs: boolean;
  };
  
  // Section 5: Treatment History
  previousTreatment: string;
  relapseHistory: string;
  
  // Section 6: Medical Necessity Justification
  medicalNecessityJustification: string;
  treatmentGoals: string;
  dischargePlanning: string;
  
  // Section 7: Provider Attestation
  providerSignature: string;
  date: string;
  providerName: string;
  licenseNumber: string;
}

// API Response Types
export interface GeneratePARequest {
  patientId: string;
  serviceType: ServiceType;
}

export interface GeneratePAResponse {
  success: boolean;
  form?: PriorAuthorizationForm;
  error?: string;
}
