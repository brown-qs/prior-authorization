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

// Embedded patient data to avoid external file dependencies
const patientData: PatientData = {
  patients: [
    {
      patient_id: "AR-2024-001",
      demographics: {
        name: "Sarah Mitchell",
        dob: "1985-03-15",
        member_id: "BCB789456123",
        address: "Little Rock, AR"
      },
      clinical_records: [
        {
          date: "2024-12-28",
          type: "psychiatric_evaluation",
          provider: "Dr. James Wilson, MD",
          content: "43-year-old female presenting for evaluation after discharge from inpatient detox 3 days ago. Completed 7-day medical detox for alcohol and benzodiazepine dependence. Patient reports drinking 750ml vodka daily for past 2 years, escalating from social drinking after divorce. Also taking non-prescribed Xanax 4-6mg daily obtained from various sources. Last use was 10 days ago prior to detox admission.\n\nWithdrawal Assessment: CIWA-Ar score of 15 indicating moderate-severe withdrawal risk. History of grand mal seizure during previous self-attempted withdrawal 6 months ago. Tremulous, diaphoretic, tachycardic (HR 110). Reports severe anxiety, insomnia despite comfort meds.\n\nPsychiatric History: Diagnosed with Major Depressive Disorder, Severe, F33.2 and Generalized Anxiety Disorder F41.1. Previous suicide attempt via overdose 8 months ago. Currently endorses passive suicidal ideation without plan. PHQ-9 score: 22 (severe depression). GAD-7 score: 19 (severe anxiety).\n\nFunctional Assessment: Unable to work for past 4 months, on FMLA. Behind on mortgage payments. Children (ages 8 and 10) currently staying with ex-husband due to patient's condition. Lost driving privileges due to DUI. Severe impairment in occupational, social, and family domains.\n\nPrevious Treatment: Failed IOP level care twice in past year (discharged for relapse). Most recent IOP attempt 3 months ago, relapsed after 2 weeks.\n\nRecommendation: Patient meets criteria for PHP level of care given failed IOP attempts, severe withdrawal risk with seizure history, co-occurring severe depression with suicide history, and severe functional impairments across multiple domains. Requires minimum 20 hours weekly structured programming with daily psychiatric monitoring."
        },
        {
          date: "2024-12-29",
          type: "nursing_assessment",
          provider: "Jennifer Smith, RN",
          content: "Vital signs: BP 145/92, HR 102, RR 18, Temp 98.6. Patient appears anxious, tremulous. Reports sleeping only 2-3 hours nightly. Appetite poor, lost 15 lbs in past month. Administered COWS: score 14 indicating mild-moderate withdrawal. Patient requesting 'something for nerves.' Educated on PHP program structure. Patient motivated but expressing doubt about ability to maintain sobriety."
        },
        {
          date: "2024-12-30",
          type: "psychosocial_assessment",
          provider: "Michael Brown, LCSW",
          content: "Comprehensive psychosocial completed. Patient reports multiple stressors: pending divorce finalization, custody concerns, financial strain, isolation from support system. Sister willing to provide transportation to PHP program. No stable recovery support. Home environment triggering (lives alone, alcohol readily available nearby). Recommends sober living arrangement post-PHP. Patient agreeable to considering. Identified need for: parenting support, financial counseling, trauma therapy for childhood sexual abuse (previously undisclosed), and vocational rehabilitation."
        }
      ],
      diagnoses: [
        {code: "F10.20", description: "Alcohol Use Disorder, Severe"},
        {code: "F13.20", description: "Sedative, Hypnotic, or Anxiolytic Use Disorder, Severe"},
        {code: "F33.2", description: "Major Depressive Disorder, Recurrent, Severe"},
        {code: "F41.1", description: "Generalized Anxiety Disorder"},
        {code: "Z63.5", description: "Disruption of family by separation and divorce"}
      ],
      medications: [
        "Naltrexone 50mg daily (started during detox)",
        "Sertraline 100mg daily",
        "Hydroxyzine 50mg q6h PRN anxiety",
        "Trazodone 100mg qHS for sleep"
      ],
      lab_results: [
        {date: "2024-12-28", test: "GGT", result: "185 U/L", reference: "9-48 U/L"},
        {date: "2024-12-28", test: "AST", result: "92 U/L", reference: "10-40 U/L"},
        {date: "2024-12-28", test: "MCV", result: "104 fL", reference: "80-100 fL"}
      ]
    },
    {
      patient_id: "AR-2024-002",
      demographics: {
        name: "Marcus Thompson",
        dob: "1992-07-22",
        member_id: "BCB321654987",
        address: "Fayetteville, AR"
      },
      clinical_records: [
        {
          date: "2024-12-30",
          type: "intake_assessment",
          provider: "Dr. Lisa Chen, PhD",
          content: "31-year-old male self-referred following relapse 2 weeks ago after 6 months sobriety. Patient had been active in AA, working with sponsor, employed full-time as software developer (remote work). Relapsed on methamphetamine after encountering former dealer at gas station. Used for 3 consecutive days before self-reporting to sponsor and seeking treatment.\n\nSubstance Use History: Methamphetamine use disorder, previously severe, now moderate given recent period of sustained sobriety. Started using at age 22, progressed to daily use by age 28. Previous IV use, now insufflation only. Last use 11 days ago. Also reports cannabis use 2-3 times weekly for sleep, wishes to abstain completely.\n\nWithdrawal Assessment: Minimal physical withdrawal. COWS score: 3. Reports primarily psychological cravings, anhedonia, hypersomnia (sleeping 12+ hours), increased appetite. No seizure history, no DTs.\n\nMental Status: Alert, oriented x4, cooperative. Mood 'disappointed and ashamed.' Affect congruent. No SI/HI. No psychosis. PHQ-9 score: 12 (moderate depression). GAD-7: 8 (mild anxiety). Strong insight into triggers and relapse process.\n\nFunctional Status: Maintained employment, disclosed relapse to supervisor who is supportive of treatment. Relationship strain with partner but still cohabitating. Continues to pay bills, maintain apartment. Moderate impairment primarily in social/interpersonal domain.\n\nProtective Factors: Stable housing, employment, one supportive relationship, previous sustained sobriety, engaged with sponsor, motivation high.\n\nRecommendation: Appropriate for IOP level of care. Has stable environment, moderate impairment, recent relapse after period of sobriety. Can benefit from 9-12 hours weekly programming while maintaining employment."
        },
        {
          date: "2024-12-31",
          type: "group_therapy_note",
          provider: "Robert Hayes, LAC",
          content: "Patient attended first IOP group session. Engaged appropriately, shared relapse story with group. Identified triggers: job stress, isolation during holidays, overconfidence in recovery. Developed initial relapse prevention plan focusing on increasing meeting attendance, daily sponsor contact, and removing dealer's contact information. Patient committed to 90 meetings in 90 days alongside IOP."
        },
        {
          date: "2025-01-02",
          type: "individual_therapy",
          provider: "Dr. Lisa Chen, PhD",
          content: "Explored shame and guilt regarding relapse. Patient able to identify cognitive distortions ('I threw everything away,' 'I'm back to square one'). Reframed relapse as learning opportunity. Discussed PAWS symptoms and timeline. Patient reports cravings 6/10 intensity, using HALT technique and urge surfing. Assigned homework: daily gratitude journal and tracking triggers/cravings."
        }
      ],
      diagnoses: [
        {code: "F15.20", description: "Stimulant Use Disorder, Moderate (Methamphetamine)"},
        {code: "F12.10", description: "Cannabis Use Disorder, Mild"},
        {code: "F32.1", description: "Major Depressive Disorder, Single Episode, Moderate"},
        {code: "Z91.19", description: "Patient's noncompliance with medical treatment, NEC"}
      ],
      medications: [
        "Wellbutrin XL 300mg daily (started 3 months ago)",
        "Melatonin 5mg qHS PRN"
      ],
      lab_results: [
        {date: "2024-12-30", test: "UDS", result: "Negative for all substances"},
        {date: "2024-12-30", test: "CBC", result: "Within normal limits"},
        {date: "2024-12-30", test: "CMP", result: "Within normal limits"}
      ]
    },
    {
      patient_id: "AR-2024-003",
      demographics: {
        name: "Jessica Rodriguez",
        dob: "1998-11-30",
        member_id: "BCB147258369",
        address: "Fort Smith, AR"
      },
      clinical_records: [
        {
          date: "2025-01-03",
          type: "transfer_summary",
          provider: "Pine Ridge Hospital",
          content: "26-year-old female transferred from inpatient psychiatric unit after 5-day stay for stabilization. Admitted via ED after overdose on opioids and benzodiazepines, required Narcan x2. States it was intentional overdose attempt following rape by dealer 2 weeks prior. Has not reported assault to authorities.\n\nDuring inpatient stay: Stabilized on Suboxone induction, currently on 16mg daily. Started on psychiatric medications. Attended groups but minimal participation. Nightmares nightly, hypervigilant, dissociative episodes observed by nursing staff."
        },
        {
          date: "2025-01-04",
          type: "psychiatric_evaluation",
          provider: "Dr. Amanda Foster, MD",
          content: "First outpatient appointment post-discharge. Patient presents with flat affect, poor eye contact, speaking in whispers. Reports using fentanyl and pressed Xanax bars daily for past 8 months following chronic pain from car accident. Escalated dramatically after sexual assault.\n\nTrauma History: Recent sexual assault (2 weeks ago). Childhood physical abuse by stepfather. Witnessed domestic violence. Motor vehicle accident 1 year ago with chronic back pain.\n\nCurrent Symptoms: Severe PTSD symptoms - intrusive thoughts of assault hourly, avoiding all men except necessary medical providers, nightmares nightly with only 2-3 hours sleep, exaggerated startle, dissociation ('watching myself from outside'). CAPS-5 score: 68 (severe PTSD).\n\nWithdrawal Risk: COWS score: 11 on Suboxone. History of precipitated withdrawal, requires careful monitoring. No seizure history but high-dose benzodiazepine use creates risk.\n\nSuicide Risk: Current SI with plan (overdose), means available (saving medications), intent uncertain. Safety plan created but limited protective factors. No family support (estranged due to addiction). Contracts for safety through next appointment.\n\nFunctional Assessment: Not left apartment in 2 weeks except for medical appointments. Unable to work (was server at restaurant). Behind on all bills, facing eviction. No social contacts. Severe impairment all domains.\n\nRecommendation: Requires PHP level care for dual diagnosis treatment. Needs daily monitoring for suicide risk, PTSD symptoms, and complex medication management. Integrated trauma-informed care essential."
        },
        {
          date: "2025-01-05",
          type: "case_management_note",
          provider: "Sandra White, Case Manager",
          content: "Assisted with benefits application for disability. Connected with local DV/SA advocacy center for victim services. Patient declined rape kit but accepted advocate support. Arranged medical transportation as patient cannot drive (license suspended, too anxious to drive anyway). Applied for emergency housing assistance to prevent eviction. Patient tearful throughout meeting, required multiple breaks for grounding exercises."
        }
      ],
      diagnoses: [
        {code: "F11.20", description: "Opioid Use Disorder, Severe"},
        {code: "F13.20", description: "Sedative, Hypnotic, or Anxiolytic Use Disorder, Severe"},
        {code: "F43.10", description: "Post-Traumatic Stress Disorder"},
        {code: "F33.3", description: "Major Depressive Disorder, Recurrent, Severe with psychotic features"},
        {code: "T74.21XA", description: "Adult sexual abuse, confirmed, initial encounter"},
        {code: "M54.5", description: "Low back pain"}
      ],
      medications: [
        "Suboxone 16mg daily",
        "Prazosin 5mg qHS for nightmares",
        "Seroquel 200mg qHS",
        "Celexa 40mg daily",
        "Gabapentin 600mg TID for pain and anxiety"
      ],
      lab_results: [
        {date: "2025-01-03", test: "UDS", result: "Positive for buprenorphine only"},
        {date: "2025-01-03", test: "Pregnancy test", result: "Negative"},
        {date: "2025-01-03", test: "HIV/HCV", result: "Negative/Negative"}
      ]
    }
  ]
};

export async function POST(request: NextRequest) {
  try {
    console.log('API route called');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { patientId, serviceType } = body;

    if (!patientId || !serviceType) {
      console.log('Missing required parameters');
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters: patientId and serviceType'
      }, { status: 400 });
    }

    console.log('Looking for patient:', patientId);
    console.log('Available patients:', patientData.patients.map(p => p.patient_id));

    // Use embedded patient data instead of fetching from external file
    const patient = patientData.patients.find((p: Patient) => p.patient_id === patientId);

    if (!patient) {
      console.log('Patient not found:', patientId);
      return NextResponse.json({
        success: false,
        error: 'Patient not found'
      }, { status: 404 });
    }

    console.log('Patient found:', patient.demographics.name);

    // Extract clinical information
    const clinicalInfo = extractClinicalInfo(patient);
    console.log('Clinical info extracted');
    
    // Generate the PA form
    const paForm = generatePAForm(patient, clinicalInfo, serviceType);
    console.log('PA form generated');

    return NextResponse.json({
      success: true,
      form: paForm
    });

  } catch (error) {
    console.error('Error generating PA form:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
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
