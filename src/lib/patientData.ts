import { PatientData, Patient } from '@/types';

// Load patient data from the JSON file
export async function loadPatientData(): Promise<PatientData> {
  try {
    const response = await fetch('/patient-mock-data.json');
    if (!response.ok) {
      throw new Error('Failed to load patient data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading patient data:', error);
    throw error;
  }
}

// Get a specific patient by ID
export function getPatientById(patients: Patient[], patientId: string): Patient | undefined {
  return patients.find(patient => patient.patient_id === patientId);
}

// Extract key clinical information for PA generation
export function extractClinicalInfo(patient: Patient) {
  const latestRecord = patient.clinical_records[patient.clinical_records.length - 1];
  const primaryDiagnosis = patient.diagnoses[0];
  
  // Extract withdrawal scores from clinical records
  let ciwaArScore = 0;
  let cowsScore = 0;
  let hasSeizureHistory = false;
  let hasDTHistory = false;
  
  patient.clinical_records.forEach(record => {
    const content = record.content.toLowerCase();
    
    // Extract CIWA-Ar score
    const ciwaMatch = content.match(/ciwa-ar score[:\s]*(\d+)/i);
    if (ciwaMatch) {
      ciwaArScore = parseInt(ciwaMatch[1]);
    }
    
    // Extract COWS score
    const cowsMatch = content.match(/cows[:\s]*score[:\s]*(\d+)/i);
    if (cowsMatch) {
      cowsScore = parseInt(cowsMatch[1]);
    }
    
    // Check for seizure history
    if (content.includes('seizure') || content.includes('grand mal')) {
      hasSeizureHistory = true;
    }
    
    // Check for DT history
    if (content.includes('dt') || content.includes('delirium tremens')) {
      hasDTHistory = true;
    }
  });
  
  return {
    latestRecord,
    primaryDiagnosis,
    ciwaArScore,
    cowsScore,
    hasSeizureHistory,
    hasDTHistory,
    allDiagnoses: patient.diagnoses,
    medications: patient.medications,
    labResults: patient.lab_results
  };
}
