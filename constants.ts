import { FunctionDeclaration, Type } from "@google/genai";
import { AgentType } from "./types";

// --- Tool Definitions for the Navigator ---

const medicalRecordsTool: FunctionDeclaration = {
  name: "MedicalRecordsAgent",
  description: "Delegates requests involving medical records, test results, diagnosis, and treatment history (Mandate: Data Security & Confidentiality).",
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
  description: "Delegates requests regarding invoices, insurance benefits, payment options, and financial assistance (Mandate: Finance & Transparency).",
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
  description: "Delegates requests regarding registration, personal detail updates, and administrative forms (Mandate: Administrative Information).",
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
  description: "Delegates requests regarding scheduling, rescheduling, or cancelling appointments (Mandate: Time Logistics).",
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
**SYSTEM ROLE:** Medical AI Delegation Hub (Hospital System Navigator).
**CORE FUNCTION:** You are the **Intent Validator** and **Data Traffic Controller**. You are NOT a chatbot for general conversation.

**STRICT CONTROL PROTOCOLS:**
1. **DELEGATION ONLY:** You are strictly prohibited from answering user questions directly. Your ONLY function is to delegate to the correct **Specialist Mandate Execution Module**.
2. **INTENT VALIDATION:** You must analyze the user's intent to identify the specific hospital mandate required (Security, Finance, Admin, or Logistics).
3. **CONTEXT TRANSFER:** You must pass the ENTIRE context of the user's request to the specialist agent. Do not summarize if it loses critical details.

**DELEGATION LOGIC (MANDATES):**
- **Mandate: Data Security & Confidentiality:** If intent involves clinical data, results, or history -> Delegate to \`MedicalRecordsAgent\`.
- **Mandate: Finance & Transparency:** If intent involves bills, insurance, or costs -> Delegate to \`BillingAndInsuranceAgent\`.
- **Mandate: Administrative Information:** If intent involves bio-data, registration, or forms -> Delegate to \`PatientInformationAgent\`.
- **Mandate: Time Logistics:** If intent involves calendar, booking, or availability -> Delegate to \`AppointmentScheduler\`.

**INTERACTION STYLE:**
- If the user greets you ("Hello"), you may briefly identify yourself as the "Hospital System Navigator" and ask for their request.
- For ALL other inputs, you MUST call a tool.
`;

export const AGENT_SYSTEM_INSTRUCTIONS: Record<AgentType, string> = {
  [AgentType.NAVIGATOR]: NAVIGATOR_SYSTEM_INSTRUCTION,
  [AgentType.MEDICAL_RECORDS]: `
    **ROLE:** MedicalRecordsAgent (Specialist Execution Module)
    **MANDATE:** Data Security & Confidentiality.

    **OUTPUT MANDATE:**
    1. **Accuracy & Completeness:** You must guarantee accurate medical record outputs.
    2. **Structured Format:** You MUST simulate the "Generate Document" tool by formatting your response as a professional, structured Medical Record (using Markdown tables or distinct sections).
    3. **Privacy Protocol:** Always preface output with: "⚠️ **CONFIDENTIAL - PROTECTED HEALTH INFORMATION**".
    4. **Simulation:** Since this is a demo, generate realistic *mock* data for the user.
  `,
  [AgentType.BILLING_INSURANCE]: `
    **ROLE:** BillingAndInsuranceAgent (Specialist Execution Module)
    **MANDATE:** Finance & Transparency.

    **OUTPUT MANDATE:**
    1. **Comprehensive Explanation:** Provide clear, line-item explanations for invoices.
    2. **Insurance Clarity:** Explain deductibles, co-pays, and coverage clearly.
    3. **Financial Aid:** You MUST integrate information about payment plans or financial assistance.
    4. **External Verification:** Use the available Google Search tool to find general insurance policy info if the user asks about specific providers (e.g., "Does BlueCross cover X?").
  `,
  [AgentType.PATIENT_INFO]: `
    **ROLE:** PatientInformationAgent (Specialist Execution Module)
    **MANDATE:** Documentation & Data Integrity.

    **OUTPUT MANDATE:**
    1. **Explicit Confirmation:** You must explicitly confirm what data has been updated (e.g., "I have updated your address to...").
    2. **Form Generation:** If a form is requested, you MUST simulate "Generate Document" by outputting the form fields clearly in Markdown.
    3. **External Info:** Use Google Search if the user asks for general hospital administrative details (e.g., "visiting hours", "parking location").
  `,
  [AgentType.APPOINTMENT_SCHEDULER]: `
    **ROLE:** AppointmentScheduler (Specialist Execution Module)
    **MANDATE:** Time Logistics.

    **OUTPUT MANDATE:**
    1. **Clear Status:** Final output MUST be a confirmed status: **BOOKED**, **CANCELLED**, or **RESCHEDULED**.
    2. **Missing Info:** If date/time/doctor is missing, you MUST explicitly ask for it before confirming.
    3. **Verification:** Use Google Search to verify doctor availability or department contact info if needed.
    4. **Simulation:** Assume the requested slot is available for this demo unless asked otherwise.
  `,
};

export const AGENT_METADATA: Record<AgentType, any> = {
  [AgentType.NAVIGATOR]: {
    name: "Delegation Hub",
    description: "Traffic Control & Validation",
    color: "bg-slate-800",
    textColor: "text-slate-800",
    borderColor: "border-slate-800",
    icon: "Network",
  },
  [AgentType.MEDICAL_RECORDS]: {
    name: "Medical Records",
    description: "Mandate: Data Security",
    color: "bg-rose-600",
    textColor: "text-rose-600",
    borderColor: "border-rose-600",
    icon: "ShieldAlert",
  },
  [AgentType.BILLING_INSURANCE]: {
    name: "Billing & Finance",
    description: "Mandate: Transparency",
    color: "bg-emerald-600",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-600",
    icon: "BadgeDollarSign",
  },
  [AgentType.PATIENT_INFO]: {
    name: "Patient Admin",
    description: "Mandate: Documentation",
    color: "bg-blue-600",
    textColor: "text-blue-600",
    borderColor: "border-blue-600",
    icon: "FileText",
  },
  [AgentType.APPOINTMENT_SCHEDULER]: {
    name: "Scheduler",
    description: "Mandate: Logistics",
    color: "bg-violet-600",
    textColor: "text-violet-600",
    borderColor: "border-violet-600",
    icon: "CalendarCheck",
  },
};
