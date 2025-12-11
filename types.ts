export enum AgentType {
  NAVIGATOR = 'NAVIGATOR',
  MEDICAL_RECORDS = 'MEDICAL_RECORDS',
  BILLING_INSURANCE = 'BILLING_INSURANCE',
  PATIENT_INFO = 'PATIENT_INFO',
  APPOINTMENT_SCHEDULER = 'APPOINTMENT_SCHEDULER',
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  agent?: AgentType;
  timestamp: number;
  isDelegationLog?: boolean; // To style delegation messages differently
}

export interface AgentConfig {
  id: AgentType;
  name: string;
  description: string;
  color: string;
  icon: string;
}

// Router/Delegation Response
export interface RoutingResult {
  targetAgent: AgentType | null;
  delegatedQuery: string;
  reasoning: string;
}
