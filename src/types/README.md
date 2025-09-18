# Type Definitions

This directory contains TypeScript interfaces for the Prior Authorization Automation application.

## Core Types

### Patient Data Types
- `Demographics`: Basic patient information (name, DOB, member ID, address)
- `ClinicalRecord`: Individual clinical notes with date, type, provider, and content
- `Diagnosis`: Medical diagnosis with ICD-10 code and description
- `LabResult`: Laboratory test results with date, test name, result, and reference range
- `Patient`: Complete patient record combining all above types
- `PatientData`: Container for multiple patients

### Service Types
- `ServiceType`: Union type for 'IOP' | 'PHP' service levels

### Prior Authorization Form
- `PriorAuthorizationForm`: Complete PA form structure with all required sections:
  - Member Information
  - Provider Information
  - Service Requested
  - Clinical Information
  - Treatment History
  - Medical Necessity Justification
  - Provider Attestation

### API Types
- `GeneratePARequest`: Input for PA generation API
- `GeneratePAResponse`: Output from PA generation API

## Usage

```typescript
import { Patient, ServiceType, PriorAuthorizationForm } from '@/types';

// Type-safe patient handling
const patient: Patient = await loadPatientData();
const serviceType: ServiceType = 'IOP';
const paForm: PriorAuthorizationForm = generatePAForm(patient, serviceType);
```

## Clinical Data Structure

The patient data structure is designed to support:
- Multiple clinical records with timestamps
- Comprehensive diagnosis tracking
- Medication history
- Laboratory results
- Structured clinical information extraction
