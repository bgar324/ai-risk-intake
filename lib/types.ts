import type { IntakeAnswers } from "@/lib/intake-schema";

export type RiskCategory =
  | "Model output liability"
  | "Data privacy and security"
  | "Enterprise contract requirements"
  | "Technology errors and omissions"
  | "Directors and officers exposure"
  | "Employment practices exposure"
  | "Media / IP / content exposure"
  | "Regulatory or high-impact decision exposure"
  | "Third-party dependency risk"
  | "Operational maturity gaps";

export type CoverageArea =
  | "Tech E&O"
  | "Cyber"
  | "D&O"
  | "EPLI"
  | "General Liability"
  | "Media Liability"
  | "Workers' Comp"
  | "AI-specific liability discussion";

export type RiskBand = "Low signal" | "Moderate signal" | "Strong signal" | "High signal";

export type RiskSignal = {
  category: RiskCategory;
  score: number;
  band: RiskBand;
  drivers: string[];
  questions: string[];
  conversationAreas: CoverageArea[];
};

export type RiskResults = {
  answers: IntakeAnswers;
  signals: RiskSignal[];
  topSignals: RiskSignal[];
  coverageConversationAreas: CoverageArea[];
  questionsToAsk: string[];
  founderSummary: string;
  buyerUrgency: "Exploring" | "Near term" | "Immediate";
  dataSensitivity: "Low" | "Moderate" | "Elevated" | "High";
  internalSummary: InternalSummary;
};

export type InternalSummary = {
  company: {
    name: string;
    stage: string;
    teamSize: string;
    primaryCustomer: string;
  };
  product: {
    type: string;
    description: string;
    aiUsage: string[];
    customerFacingOutputs: boolean | "not_sure";
    automatedActions: string;
  };
  riskSignals: Array<{
    category: RiskCategory;
    score: number;
    band: RiskBand;
    drivers: string[];
  }>;
  coverageConversationAreas: CoverageArea[];
  questionsToAsk: string[];
  disclaimer: string;
};
