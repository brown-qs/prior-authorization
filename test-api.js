// Test script for PA Automation API
const testPatients = [
  { id: "AR-2024-001", name: "Sarah Mitchell", service: "IOP" },
  { id: "AR-2024-002", name: "Marcus Thompson", service: "PHP" },
  { id: "AR-2024-003", name: "Jessica Rodriguez", service: "IOP" }
];

async function testPA() {
  console.log("Testing Prior Authorization API...\n");
  
  for (const patient of testPatients) {
    try {
      const response = await fetch('http://localhost:3000/api/generate-pa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: patient.id,
          serviceType: patient.service
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ ${patient.name} (${patient.service}):`);
        console.log(`   Primary Diagnosis: ${result.form.primaryDiagnosis}`);
        console.log(`   CIWA-Ar Score: ${result.form.withdrawalRisk.ciwaArScore}`);
        console.log(`   COWS Score: ${result.form.withdrawalRisk.cowsScore}`);
        console.log(`   Medical Necessity: ${result.form.medicalNecessityJustification.substring(0, 100)}...`);
        console.log("");
      } else {
        console.log(`❌ ${patient.name}: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ ${patient.name}: ${error.message}`);
    }
  }
}

testPA();
