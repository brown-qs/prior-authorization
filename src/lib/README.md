# Utility Libraries

This directory contains utility functions for data processing and clinical information extraction.

## Files

### `patientData.ts`
Core functions for loading and processing patient data:

#### `loadPatientData(): Promise<PatientData>`
- Loads patient data from the JSON file in the public directory
- Returns parsed patient data with type safety
- Handles file system operations asynchronously

#### `getPatientById(patients: Patient[], patientId: string): Patient | undefined`
- Finds a specific patient by their unique ID
- Returns undefined if patient not found
- Used for patient selection and data retrieval

#### `extractClinicalInfo(patient: Patient)`
- Extracts structured clinical information from patient records
- Parses clinical scores (CIWA-Ar, COWS, PHQ-9, GAD-7, CAPS-5)
- Identifies medical history (seizures, DTs)
- Returns comprehensive clinical summary

## Clinical Information Extraction

The extraction process uses pattern matching to identify:
- **Withdrawal Scores**: CIWA-Ar and COWS scores from clinical notes
- **Mental Health Scores**: PHQ-9, GAD-7, CAPS-5 assessments
- **Medical History**: Seizure history, delirium tremens history
- **Current Symptoms**: From latest clinical records
- **Medications**: Current medication list
- **Lab Results**: Recent laboratory findings

## Usage Example

```typescript
import { loadPatientData, getPatientById, extractClinicalInfo } from '@/lib/patientData';

// Load all patient data
const patientData = await loadPatientData();

// Find specific patient
const patient = getPatientById(patientData.patients, 'AR-2024-001');

// Extract clinical information
const clinicalInfo = extractClinicalInfo(patient);
console.log('CIWA-Ar Score:', clinicalInfo.ciwaArScore);
console.log('Primary Diagnosis:', clinicalInfo.primaryDiagnosis);
```

## Error Handling

All functions include proper error handling:
- File system errors are caught and logged
- Missing patients return undefined
- Invalid data is handled gracefully
- Type safety is maintained throughout
