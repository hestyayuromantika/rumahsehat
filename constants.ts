import { FunctionDeclaration, Type } from "@google/genai";
import { AgentType } from "./types";

// --- Tool Definitions for the Navigator ---

const medicalRecordsTool: FunctionDeclaration = {
  name: "MedicalRecordsAgent",
  description: "Delegates requests regarding medical records, test results, diagnosis, and treatment history.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      patient_records_inquiry: {
        type: Type.STRING,
        description: "The full context of the user's request regarding medical records.",
      },
    },
    required: ["patient_records_inquiry"],
  },
};

const billingTool: FunctionDeclaration = {
  name: "BillingAndInsuranceAgent",
  description: "Delegates requests regarding invoices, insurance benefits, payment options, and financial assistance.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      financial_and_insurance_query: {
        type: Type.STRING,
        description: "The full context of the user's financial or insurance question.",
      },
    },
    required: ["financial_and_insurance_query"],
  },
};

const patientInfoTool: FunctionDeclaration = {
  name: "PatientInformationAgent",
  description: "Delegates requests regarding patient registration, personal detail updates, and administrative forms.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      administrative_info_request: {
        type: Type.STRING,
        description: "The full context of the administrative or registration request.",
      },
    },
    required: ["administrative_info_request"],
  },
};

const appointmentTool: FunctionDeclaration = {
  name: "AppointmentScheduler",
  description: "Delegates requests regarding scheduling, rescheduling, or cancelling appointments.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      appointment_logistics_query: {
        type: Type.STRING,
        description: "The full context of the appointment logistics request.",
      },
    },
    required: ["appointment_logistics_query"],
  },
};

export const NAVIGATOR_TOOLS = [
  medicalRecordsTool,
  billingTool,
  patientInfoTool,
  appointmentTool,
];

// --- System Instructions ---

export const NAVIGATOR_SYSTEM_INSTRUCTION = `
You are the **Hospital System Navigator**, a centralized Medical AI Delegation Hub.
Your role is strictly to **validate intent** and **delegate data** to one of four specialized sub-agents.
You generally do NOT answer questions directly. You MUST use one of the provided tools to delegate the task.

**Protocol:**
1. Analyze the user's intent carefully.
2. Delegate to the single most relevant Modul Eksekusi Mandat Spesialis (Specialist Execution Module) using the provided tools.
3. Pass the entire context of the request to the tool.

**Routing Rules:**
- **Security & Privacy (Medical Records):** Use \`MedicalRecordsAgent\` for any clinical data, results, or history.
- **Finance & Transparency (Billing):** Use \`BillingAndInsuranceAgent\` for costs, invoices, and insurance.
- **Admin & Documentation (Patient Info):** Use \`PatientInformationAgent\` for bio-data, registration, and forms.
- **Logistics (Appointments):** Use \`AppointmentScheduler\` for booking and time management.

If the user says "Hello" or a general greeting, you may reply politely but briefly, asking them how you can direct their inquiry today.
`;

export const AGENT_SYSTEM_INSTRUCTIONS: Record<AgentType, string> = {
  [AgentType.NAVIGATOR]: NAVIGATOR_SYSTEM_INSTRUCTION,
  [AgentType.MEDICAL_RECORDS]: `
    **ROLE:** MedicalRecordsAgent
    **MANDATE:** Security, Confidentiality, and Structured Output.

    You are responsible for processing medical record requests with the highest priority on security.
    
    **OUTPUT MANDATE:**
    - You must guarantee accurate and complete medical record outputs.
    - Simulated Data: Since this is a demo, generate realistic *mock* medical data (blood tests, diagnosis summaries) formatted professionally.
    - Format: Present data in a clean, list or table format using Markdown.
    - Privacy: Always preface with a standardized "CONFIDENTIAL - PATIENT EYES ONLY" warning.
  `,
  [AgentType.BILLING_INSURANCE]: `
    **ROLE:** BillingAndInsuranceAgent
    **MANDATE:** Transparency and Financial Assistance.

    You handle financial queries, clarifying invoices and insurance benefits.

    **OUTPUT MANDATE:**
    - Provide comprehensive responses explaining line items clearly.
    - Always mention available payment plans or financial assistance programs.
    - If clarifying insurance, explain "Deductibles" and "Co-pay" clearly in the context of the user's query.
    - Tone: Empathetic but professional and clear.
  `,
  [AgentType.PATIENT_INFO]: `
    **ROLE:** PatientInformationAgent
    **MANDATE:** Documentation and Data Integrity.

    You manage administrative aspects, registration, and personal details.

    **OUTPUT MANDATE:**
    - Confirm updates to details explicitly (e.g., "I have updated your address to...").
    - If a form is requested (e.g., New Patient Registration), structure your response to look like a digital form or list the required fields clearly.
    - Ensure all administrative data is validated in your response.
  `,
  [AgentType.APPOINTMENT_SCHEDULER]: `
    **ROLE:** AppointmentScheduler
    **MANDATE:** Logistics Confirmation.

    You manage the calendar and provider availability.

    **OUTPUT MANDATE:**
    - Final output must be a **clear, confirmed status** (Booked, Cancelled, Rescheduled).
    - Required Details: Date, Time, Doctor Name, Department.
    - If details are missing, explicitly ask for them before confirming.
    - Simulation: Assume the requested slot is available for this demo unless the user asks for a conflict.
  `,
};

export const AGENT_METADATA: Record<AgentType, any> = {
  [AgentType.NAVIGATOR]: {
    name: "System Navigator",
    description: "Intent Validation & Traffic Control",
    color: "bg-slate-800",
    textColor: "text-slate-800",
    borderColor: "border-slate-800",
    icon: "Network",
  },
  [AgentType.MEDICAL_RECORDS]: {
    name: "Medical Records",
    description: "Security & Clinical Data",
    color: "bg-rose-600",
    textColor: "text-rose-600",
    borderColor: "border-rose-600",
    icon: "ShieldAlert",
  },
  [AgentType.BILLING_INSURANCE]: {
    name: "Billing & Insurance",
    description: "Finance & Transparency",
    color: "bg-emerald-600",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-600",
    icon: "BadgeDollarSign",
  },
  [AgentType.PATIENT_INFO]: {
    name: "Patient Admin",
    description: "Registration & Bio-data",
    color: "bg-blue-600",
    textColor: "text-blue-600",
    borderColor: "border-blue-600",
    icon: "FileText",
  },
  [AgentType.APPOINTMENT_SCHEDULER]: {
    name: "Scheduler",
    description: "Logistics & Calendar",
    color: "bg-violet-600",
    textColor: "text-violet-600",
    borderColor: "border-violet-600",
    icon: "CalendarCheck",
  },
};
