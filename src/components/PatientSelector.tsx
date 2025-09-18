'use client';

import { useState, useEffect } from 'react';
import { Patient, PatientData } from '@/types';

interface PatientSelectorProps {
  onPatientSelect: (patient: Patient) => void;
  selectedPatient: Patient | null;
}

export default function PatientSelector({ onPatientSelect, selectedPatient }: PatientSelectorProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatients() {
      try {
        const response = await fetch('/patient-mock-data.json');
        const data: PatientData = await response.json();
        setPatients(data.patients);
      } catch (error) {
        console.error('Error loading patients:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPatients();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading patients...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Select Patient</h2>
      <div className="space-y-3">
        {patients.map((patient) => (
          <div
            key={patient.patient_id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedPatient?.patient_id === patient.patient_id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onPatientSelect(patient)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{patient.demographics.name}</h3>
                <p className="text-sm text-gray-600">ID: {patient.patient_id}</p>
                <p className="text-sm text-gray-600">DOB: {patient.demographics.dob}</p>
                <p className="text-sm text-gray-600">Member ID: {patient.demographics.member_id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {patient.diagnoses[0]?.description}
                </p>
                <p className="text-xs text-gray-500">
                  {patient.clinical_records.length} clinical records
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
