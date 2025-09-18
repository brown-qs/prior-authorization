# Prior Authorization API

This API endpoint handles the generation of Prior Authorization forms based on patient data and service type selection.

## Endpoint

`POST /api/generate-pa`

## Request Body

```typescript
{
  patientId: string;    // Patient ID (e.g., "AR-2024-001")
  serviceType: "IOP" | "PHP";  // Service level requested
}
```

## Response

```typescript
{
  success: boolean;
  form?: PriorAuthorizationForm;  // Complete PA form if successful
  error?: string;                 // Error message if failed
}
```

## Process Flow

1. **Validation**: Validates required parameters (patientId, serviceType)
2. **Data Loading**: Loads patient data from JSON file
3. **Patient Lookup**: Finds specific patient by ID
4. **Clinical Extraction**: Extracts clinical information from patient records
5. **Form Generation**: Populates PA form with clinical data
6. **Response**: Returns complete form or error message

## Clinical Information Extraction

The API extracts the following clinical data:

### Withdrawal Assessment Scores
- **CIWA-Ar Score**: Clinical Institute Withdrawal Assessment for Alcohol
- **COWS Score**: Clinical Opiate Withdrawal Scale
- **Seizure History**: History of grand mal seizures
- **DT History**: History of delirium tremens

### Mental Health Assessments
- **PHQ-9 Score**: Patient Health Questionnaire (depression)
- **GAD-7 Score**: Generalized Anxiety Disorder scale
- **CAPS-5 Score**: Clinician-Administered PTSD Scale

### Clinical Data
- **Primary Diagnosis**: Main diagnosis from patient record
- **Additional Diagnoses**: Secondary diagnoses
- **Current Symptoms**: Latest clinical presentation
- **Medications**: Current medication list
- **Lab Results**: Recent laboratory findings

## Medical Necessity Justification

The API generates evidence-based justifications using clinical guidelines:

### IOP Criteria
- Moderate functional impairment
- Stable environment with protective factors
- Recent relapse requiring early intervention
- Suitable for 9-19 hours weekly programming

### PHP Criteria
- Severe functional impairment across multiple domains
- Significant withdrawal risk (CIWA-Ar ≥10, COWS ≥12)
- Co-occurring psychiatric disorders
- Failed IOP level care within past 12 months
- High-risk behaviors (overdose, IV drug use)

## Error Handling

The API includes comprehensive error handling:

- **Missing Parameters**: Returns 400 with specific error message
- **Patient Not Found**: Returns 404 with patient lookup error
- **Data Processing Errors**: Returns 500 with internal server error
- **Validation Errors**: Returns 400 with validation details

## Usage Example

```typescript
const response = await fetch('/api/generate-pa', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patientId: 'AR-2024-001',
    serviceType: 'IOP'
  })
});

const result = await response.json();
if (result.success) {
  console.log('Generated PA Form:', result.form);
} else {
  console.error('Error:', result.error);
}
```

## Security Considerations

⚠️ **Production Implementation Required**:
- Input validation and sanitization
- Rate limiting and request throttling
- Authentication and authorization
- Audit logging for PHI access
- Data encryption in transit and at rest
