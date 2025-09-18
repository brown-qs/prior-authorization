# Prior Authorization Automation

A Next.js application that automates the completion of Prior Authorization (PA) forms for Intensive Outpatient Program (IOP) or Partial Hospitalization Program (PHP) substance use services.

## Features

- **Patient Selection**: Choose from mock patient data with clinical records
- **Service Type Selection**: Select between IOP (9-19 hours/week) or PHP (20+ hours/week)
- **Automated Form Generation**: Automatically populate PA forms based on patient data and clinical guidelines
- **Medical Necessity Justification**: Generate evidence-based justifications for treatment authorization
- **Clinical Data Extraction**: Parse clinical records to extract relevant information like CIWA-Ar scores, COWS scores, and treatment history

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Next.js API Routes
- **Data**: JSON-based patient mock data
- **Styling**: Tailwind CSS for responsive design

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

1. **Select a Patient**: Choose from the available mock patients with their clinical records
2. **Select Service Type**: Choose between IOP or PHP based on patient needs
3. **Generate PA Form**: Click the generate button to automatically populate the Prior Authorization form
4. **Review Results**: View the completed form with all sections filled based on clinical data

## Clinical Guidelines Integration

The application uses clinical guidelines to determine medical necessity:

- **IOP Criteria**: Moderate functional impairment, stable environment, recent relapse
- **PHP Criteria**: Severe functional impairment, withdrawal risk, failed IOP, co-occurring conditions

## Data Sources

- Patient mock data from `public/patient-mock-data.json`
- Clinical guidelines for IOP/PHP admission criteria
- Prior Authorization form template structure

## API Endpoints

- `POST /api/generate-pa`: Generates a Prior Authorization form based on patient ID and service type

## Future Enhancements

- Integration with OpenAI API for enhanced medical necessity justification
- PDF export functionality
- Integration with actual EHR systems
- Real-time clinical data updates
- Provider authentication and authorization

## Security Considerations

This is a demonstration application. In a production environment, consider:
- HIPAA compliance for PHI handling
- Secure authentication and authorization
- Data encryption in transit and at rest
- Audit logging for all data access
