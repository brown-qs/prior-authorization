'use client';

import { useState } from 'react';

// Type definitions
interface Patient {
  id: string;
  name: string;
  dob: string;
  memberId: string;
  diagnosis: string;
}

type ServiceType = 'IOP' | 'PHP' | null;

interface PAForm {
  memberName: string;
  dob: string;
  memberId: string;
  diagnosisDate: string;
  authStartDate: string;
  authEndDate: string;
  facilityName: string;
  npi: string;
  contactPerson: string;
  phone: string;
  fax: string;
  serviceType: string;
  initialRequestDuration: string;
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
  previousTreatment: string;
  relapseHistory: string;
  medicalNecessityJustification: string;
  treatmentGoals: string;
  dischargePlanning: string;
  providerSignature: string;
  date: string;
  providerName: string;
  licenseNumber: string;
}

export default function Home() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceType>(null);
  const [paForm, setPaForm] = useState<PAForm | null>(null);
  const [loading, setLoading] = useState(false);

  const patients: Patient[] = [
    {
      id: "AR-2024-001",
      name: "Sarah Mitchell",
      dob: "1985-03-15",
      memberId: "BCB789456123",
      diagnosis: "Alcohol Use Disorder, Severe"
    },
    {
      id: "AR-2024-002", 
      name: "Marcus Thompson",
      dob: "1992-07-22",
      memberId: "BCB321654987",
      diagnosis: "Stimulant Use Disorder, Moderate"
    },
    {
      id: "AR-2024-003",
      name: "Jessica Rodriguez", 
      dob: "1998-11-30",
      memberId: "BCB147258369",
      diagnosis: "Opioid Use Disorder, Severe"
    }
  ];

  const generatePA = async () => {
    if (!selectedPatient || !selectedService) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/generate-pa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatient.id,
          serviceType: selectedService
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setPaForm(result.form);
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      console.error('Error generating PA form:', err);
      alert("Error generating PA form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Prior Authorization Automation
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Patient Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Select Patient</h2>
            <div className="space-y-3">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPatient?.id === patient.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <h3 className="font-medium">{patient.name}</h3>
                  <p className="text-sm text-gray-600">ID: {patient.id}</p>
                  <p className="text-sm text-gray-600">{patient.diagnosis}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Service Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Select Service Type</h2>
            <div className="space-y-3">
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedService === "IOP"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedService("IOP")}
              >
                <h3 className="font-medium">Intensive Outpatient Program (IOP)</h3>
                <p className="text-sm text-gray-600">9-19 hours/week</p>
              </div>
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedService === "PHP"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedService("PHP")}
              >
                <h3 className="font-medium">Partial Hospitalization Program (PHP)</h3>
                <p className="text-sm text-gray-600">20+ hours/week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center mt-8">
          <button
            onClick={generatePA}
            disabled={!selectedPatient || !selectedService || loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Generating..." : "Generate Prior Authorization Form"}
          </button>
        </div>

        {/* PA Form Display */}
        {paForm && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Generated Prior Authorization Form</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Member Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Name:</strong> {paForm.memberName}</div>
                  <div><strong>DOB:</strong> {paForm.dob}</div>
                  <div><strong>Member ID:</strong> {paForm.memberId}</div>
                  <div><strong>Service Type:</strong> {paForm.serviceType}</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Clinical Information</h3>
                <div className="text-sm space-y-2">
                  <div><strong>Primary Diagnosis:</strong> {paForm.primaryDiagnosis}</div>
                  <div><strong>Current Symptoms:</strong> {paForm.currentSymptoms}</div>
                  <div><strong>CIWA-Ar Score:</strong> {paForm.withdrawalRisk.ciwaArScore}</div>
                  <div><strong>COWS Score:</strong> {paForm.withdrawalRisk.cowsScore}</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Medical Necessity Justification</h3>
                <div className="text-sm bg-gray-50 p-4 rounded">
                  {paForm.medicalNecessityJustification}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Treatment Goals</h3>
                <div className="text-sm bg-gray-50 p-4 rounded">
                  {paForm.treatmentGoals}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
