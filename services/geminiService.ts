import { GoogleGenAI } from "@google/genai";
import { AgentType, RoutingResult } from "../types";
import { NAVIGATOR_SYSTEM_INSTRUCTION, NAVIGATOR_TOOLS, AGENT_SYSTEM_INSTRUCTIONS } from "../constants";

export class GeminiService {
  private client: GoogleGenAI;
  private apiKey: string;

  constructor() {
    // According to instructions, we strictly use process.env.API_KEY
    // Note: In a real client-side only demo, this requires the build tool to inject it or a proxy.
    // Ideally, for a secure medical app, this happens server-side.
    const key = process.env.API_KEY || '';
    if (!key) {
      console.warn("API Key not found in environment variables.");
    }
    this.apiKey = key;
    this.client = new GoogleGenAI({ apiKey: key });
  }

  /**
   * Step 1: Send user message to the Navigator (Router).
   * It will analyze intent and return a FunctionCall if delegation is needed.
   */
  async processNavigatorRequest(userMessage: string): Promise<RoutingResult> {
    if (!this.apiKey) throw new Error("API Key is missing.");

    try {
      const response = await this.client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }]
          }
        ],
        config: {
          systemInstruction: NAVIGATOR_SYSTEM_INSTRUCTION,
          tools: [{ functionDeclarations: NAVIGATOR_TOOLS }],
          // We let the model decide if it needs to call a tool or just chat (e.g., for "Hi")
        },
      });

      // Check for tool calls
      const toolCalls = response.candidates?.[0]?.content?.parts?.[0]?.functionCall;

      if (toolCalls) {
        const fnName = toolCalls.name;
        const args = toolCalls.args as any;

        let targetAgent: AgentType | null = null;
        let delegatedQuery = "";

        // Map function names to AgentTypes
        switch (fnName) {
          case "MedicalRecordsAgent":
            targetAgent = AgentType.MEDICAL_RECORDS;
            delegatedQuery = args.patient_records_inquiry;
            break;
          case "BillingAndInsuranceAgent":
            targetAgent = AgentType.BILLING_INSURANCE;
            delegatedQuery = args.financial_and_insurance_query;
            break;
          case "PatientInformationAgent":
            targetAgent = AgentType.PATIENT_INFO;
            delegatedQuery = args.administrative_info_request;
            break;
          case "AppointmentScheduler":
            targetAgent = AgentType.APPOINTMENT_SCHEDULER;
            delegatedQuery = args.appointment_logistics_query;
            break;
        }

        return {
          targetAgent,
          delegatedQuery,
          reasoning: `Intent verified. Routing to ${fnName}.`,
        };
      } else {
        // Model didn't call a tool (likely general chit-chat or refusal)
        return {
          targetAgent: null,
          delegatedQuery: response.text || "I am the Hospital Navigator. How can I direct you?",
          reasoning: "General Interaction",
        };
      }

    } catch (error) {
      console.error("Navigator Error:", error);
      throw error;
    }
  }

  /**
   * Step 2: Execute the specialized agent.
   * This simulates the "Sub-Agent" processing the delegated query.
   */
  async executeSpecialistAgent(agentType: AgentType, query: string): Promise<string> {
    if (!this.apiKey) throw new Error("API Key is missing.");

    try {
      const response = await this.client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: query }]
          }
        ],
        config: {
          systemInstruction: AGENT_SYSTEM_INSTRUCTIONS[agentType],
          // Sub-agents don't have tools in this demo, they produce the final output mandate.
          // In a full system, they might have their own tools (database access, etc.)
        },
      });

      return response.text || "Agent processed the request but returned no content.";

    } catch (error) {
      console.error(`Agent ${agentType} Error:`, error);
      return "An error occurred within the specialist module.";
    }
  }
}
