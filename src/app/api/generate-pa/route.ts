import { NextRequest, NextResponse } from 'next/server';

// Type definitions for patient data
interface Demographics {
  name: string;
  dob: string;
  member_id: string;
  address: string;
}

interface ClinicalRecord {
  date: string;
  type: string;
  provider: string;
  content: string;
}

interface Diagnosis {
  code: string;
  description: string;
}

interface LabResult {
  date: string;
  test: string;
  result: string;
  reference: string;
}

interface Patient {
  patient_id: string;
  demographics: Demographics;
  clinical_records: ClinicalRecord[];
  diagnoses: Diagnosis[];
  medications: string[];
  lab_results: LabResult[];
}

interface PatientData {
  patients: Patient[];
}

interface ClinicalInfo {
  latestRecord?: ClinicalRecord;
  primaryDiagnosis?: Diagnosis;
  ciwaArScore: number;
  cowsScore: number;
  hasSeizureHistory: boolean;
  hasDTHistory: boolean;
  allDiagnoses: Diagnosis[];
  medications: string[];
  labResults: LabResult[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientId, serviceType } = body;

    // Load patient data from the public folder
    const patientData: PatientData = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/patient-mock-data.json`).then(res => res.json());
    const patient = patientData.patients.find((p: Patient) => p.patient_id === patientId);

    if (!patient) {
      return NextResponse.json({
        success: false,
        error: 'Patient not found'
      });
    }

    // Extract clinical information
   const clinicalInfo = extractClinicalInfo(patient);
    
    // Generate the PA form
    const paForm = generatePAForm(patient, clinicalInfo, serviceType);

    return NextResponse.json({
      success: true,
      form: paForm
    });

  } catch (error) {
    console.error('Error generating PA form:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    });
  }
}

function extractClinicalInfo(patient: Patient): ClinicalInfo {
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

function generatePAForm(patient: Patient, clinicalInfo: ClinicalInfo, serviceType: string) {
  const today = new Date();
  const startDate = today.toISOString().split('T')[0];
  const endDate = new Date(today.getTime() + (serviceType === 'PHP' ? 14 : 30) * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

  return {
    // Section 1: Member Information
    memberName: patient.demographics.name,
    dob: patient.demographics.dob,
    memberId: patient.demographics.member_id,
    diagnosisDate: clinicalInfo.latestRecord?.date || startDate,
    authStartDate: startDate,
    authEndDate: endDate,
    
    // Section 2: Provider Information
    facilityName: "Arkansas Behavioral Health Center",
    npi: "1234567890",
    contactPerson: "Dr. Sarah Johnson, MD",
    phone: "(501) 555-0123",
    fax: "(501) 555-0124",
    
    // Section 3: Service Requested
    serviceType,
    initialRequestDuration: serviceType === 'PHP' ? '14 days' : '30 days',
    
    // Section 4: Clinical Information
    primaryDiagnosis: clinicalInfo.primaryDiagnosis?.code || '',
    additionalDiagnoses: clinicalInfo.allDiagnoses.slice(1).map(d => d.code),
    substanceUse: {
      lastUseDate: extractLastUseDate(patient),
      frequency: extractSubstanceFrequency(patient),
      amount: extractSubstanceAmount(patient),
      route: extractSubstanceRoute(patient)
    },
    currentSymptoms: generateCurrentSymptoms(patient, clinicalInfo),
    withdrawalRisk: {
      ciwaArScore: clinicalInfo.ciwaArScore,
      cowsScore: clinicalInfo.cowsScore,
      historyOfSeizures: clinicalInfo.hasSeizureHistory,
      historyOfDTs: clinicalInfo.hasDTHistory
    },
    
    // Section 5: Treatment History
    previousTreatment: generatePreviousTreatment(patient),
    relapseHistory: generateRelapseHistory(patient),
    
    // Section 6: Medical Necessity Justification
    medicalNecessityJustification: generateMedicalNecessityJustification(patient, clinicalInfo, serviceType),
    treatmentGoals: generateTreatmentGoals(patient, serviceType),
    dischargePlanning: generateDischargePlanning(patient, serviceType),
    
    // Section 7: Provider Attestation
    providerSignature: "",
    date: today.toISOString().split('T')[0],
    providerName: "Dr. Sarah Johnson, MD",
    licenseNumber: "MD12345"
  };
}

function generateMedicalNecessityJustification(patient: Patient, clinicalInfo: ClinicalInfo, serviceType: string): string {
  const baseCriteria = `Patient meets criteria for ${serviceType} level of care based on the following:`;
  
  if (serviceType === 'PHP') {
    const criteria = [];
    
    // Check for failed IOP
    if (clinicalInfo.latestRecord?.content.toLowerCase().includes('failed iop')) {
      criteria.push('Failed IOP treatment within past 12 months');
    }
    
    // Check withdrawal risk
    if (clinicalInfo.ciwaArScore >= 10 || clinicalInfo.cowsScore >= 12 || clinicalInfo.hasSeizureHistory) {
      criteria.push(`Moderate to severe withdrawal risk with CIWA-Ar score of ${clinicalInfo.ciwaArScore} and COWS score of ${clinicalInfo.cowsScore}`);
    }
    
    // Check for co-occurring psychiatric conditions
    const hasDepression = patient.diagnoses.some(d => d.description.toLowerCase().includes('depression'));
    const hasAnxiety = patient.diagnoses.some(d => d.description.toLowerCase().includes('anxiety'));
    const hasPTSD = patient.diagnoses.some(d => d.description.toLowerCase().includes('ptsd'));
    
    if (hasDepression || hasAnxiety || hasPTSD) {
      criteria.push('Co-occurring psychiatric conditions requiring intensive treatment');
    }
    
    // Check for severe functional impairment
    const hasFunctionalImpairment = clinicalInfo.latestRecord?.content.toLowerCase().includes('severe impairment') ||
                                   clinicalInfo.latestRecord?.content.toLowerCase().includes('unable to work') ||
                                   clinicalInfo.latestRecord?.content.toLowerCase().includes('job loss');
    
    if (hasFunctionalImpairment) {
      criteria.push('Severe functional impairment in multiple domains');
    }
    
    return baseCriteria + ' ' + criteria.join(', ') + '. Patient requires minimum 20 hours weekly structured programming with daily psychiatric monitoring.';
  } else {
    // IOP criteria
    const criteria = [];
    
    // Check for recent relapse
    if (clinicalInfo.latestRecord?.content.toLowerCase().includes('relapse')) {
      criteria.push('Recent relapse after period of sobriety');
    }
    
    // Check for moderate functional impairment
    const hasModerateImpairment = clinicalInfo.latestRecord?.content.toLowerCase().includes('moderate impairment') ||
                                 clinicalInfo.latestRecord?.content.toLowerCase().includes('relationship strain');
    
    if (hasModerateImpairment) {
      criteria.push('Moderate functional impairment');
    }
    
    // Check for stable environment
    const hasStableEnvironment = clinicalInfo.latestRecord?.content.toLowerCase().includes('stable') ||
                                clinicalInfo.latestRecord?.content.toLowerCase().includes('employment') ||
                                clinicalInfo.latestRecord?.content.toLowerCase().includes('supportive');
    
    if (hasStableEnvironment) {
      criteria.push('Stable environment with protective factors');
    }
    
    return baseCriteria + ' ' + criteria.join(', ') + '. Patient can benefit from 9-19 hours weekly programming while maintaining employment and stable environment.';
  }
}

function generateTreatmentGoals(patient: Patient, serviceType: string): string {
  const baseGoals = [
    'Achieve and maintain sobriety',
    'Develop effective coping strategies',
    'Improve functional status',
    'Address co-occurring mental health conditions'
  ];
  
  if (serviceType === 'PHP') {
    baseGoals.push('Stabilize withdrawal symptoms', 'Address severe functional impairments');
  } else {
    baseGoals.push('Prevent relapse escalation', 'Maintain employment and relationships');
  }
  
  return baseGoals.join(', ') + '.';
}

function generateDischargePlanning(patient: Patient, serviceType: string): string {
  const planning = [
    'Step down to less intensive level of care',
    'Establish ongoing outpatient treatment',
    'Connect with community support resources',
    'Develop relapse prevention plan'
  ];
  
  if (serviceType === 'PHP') {
    planning.push('Consider IOP as next step', 'Address housing and employment needs');
  } else {
    planning.push('Maintain current employment', 'Strengthen support system');
  }
  
  return planning.join(', ') + '.';
}

function extractLastUseDate(patient: Patient): string {
  const content = patient.clinical_records.map(r => r.content).join(' ').toLowerCase();
  const lastUseMatch = content.match(/last use[:\s]*(\d+)\s*days?\s*ago/i);
  if (lastUseMatch) {
    const daysAgo = parseInt(lastUseMatch[1]);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  }
  return new Date().toISOString().split('T')[0];
}

function extractSubstanceFrequency(patient: Patient): string {
  const content = patient.clinical_records.map(r => r.content).join(' ').toLowerCase();
  if (content.includes('daily')) return 'Daily';
  if (content.includes('weekly')) return 'Weekly';
  if (content.includes('monthly')) return 'Monthly';
  return 'Unknown';
}

function extractSubstanceAmount(patient: Patient): string {
  const content = patient.clinical_records.map(r => r.content).join(' ').toLowerCase();
  const amountMatch = content.match(/(\d+)\s*(ml|mg|g|oz)/i);
  if (amountMatch) {
    return amountMatch[0];
  }
  return 'Unknown';
}

function extractSubstanceRoute(patient: Patient): string {
  const content = patient.clinical_records.map(r => r.content).join(' ').toLowerCase();
  if (content.includes('iv') || content.includes('intravenous')) return 'IV';
  if (content.includes('oral') || content.includes('po')) return 'Oral';
  if (content.includes('insufflation') || content.includes('snort')) return 'Insufflation';
  if (content.includes('smoke') || content.includes('inhalation')) return 'Inhalation';
  return 'Unknown';
}

function generateCurrentSymptoms(patient: Patient, _clinicalInfo: ClinicalInfo): string {
  const symptoms = [];
  const content = patient.clinical_records.map(r => r.content).join(' ').toLowerCase();
  
  if (content.includes('anxiety')) symptoms.push('Anxiety');
  if (content.includes('depression')) symptoms.push('Depression');
  if (content.includes('insomnia')) symptoms.push('Insomnia');
  if (content.includes('tremor') || content.includes('tremulous')) symptoms.push('Tremors');
  if (content.includes('sweat') || content.includes('diaphoretic')) symptoms.push('Diaphoresis');
  if (content.includes('tachycardia') || content.includes('hr 1')) symptoms.push('Tachycardia');
  
  return symptoms.length > 0 ? symptoms.join(', ') : 'Various withdrawal and psychiatric symptoms';
}

function generatePreviousTreatment(patient: Patient): string {
  const content = patient.clinical_records.map(r => r.content).join(' ').toLowerCase();
  const treatments = [];
  
  if (content.includes('iop')) treatments.push('IOP');
  if (content.includes('php')) treatments.push('PHP');
  if (content.includes('inpatient')) treatments.push('Inpatient');
  if (content.includes('detox')) treatments.push('Detox');
  
  return treatments.length > 0 ? treatments.join(', ') : 'No previous treatment documented';
}

function generateRelapseHistory(patient: Patient): string {
  const content = patient.clinical_records.map(r => r.content).join(' ').toLowerCase();
  if (content.includes('relapse')) {
    return 'History of relapse documented in clinical records';
  }
  return 'No documented relapse history';
}
