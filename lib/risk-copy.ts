import type { CoverageArea, RiskBand, RiskCategory } from "@/lib/types";

export function getRiskBand(score: number): RiskBand {
  if (score >= 75) return "High signal";
  if (score >= 50) return "Strong signal";
  if (score >= 25) return "Moderate signal";
  return "Low signal";
}

export function bandBadgeVariant(band: RiskBand) {
  if (band === "High signal") return "red" as const;
  if (band === "Strong signal") return "amber" as const;
  if (band === "Moderate signal") return "gray" as const;
  return "green" as const;
}

export const categoryQuestions: Record<RiskCategory, string[]> = {
  "Model output liability": [
    "What outputs are shown to customers or end users?",
    "When is human review required before a customer relies on the output?",
    "How do you monitor and correct inaccurate or unsafe outputs?",
  ],
  "Data privacy and security": [
    "What data is collected, stored, and retained?",
    "Is customer data encrypted at rest and in transit?",
    "Do contracts require specific cyber coverage limits or security controls?",
  ],
  "Enterprise contract requirements": [
    "Which customers have requested insurance requirements or coverage limits?",
    "Are requirements standardized across contracts or negotiated case by case?",
    "Do vendor reviews ask for SOC 2, SSO, audit logs, or incident response details?",
  ],
  "Technology errors and omissions": [
    "What workflows depend on the product working correctly?",
    "Could downtime, integration failures, or inaccurate outputs create customer loss?",
    "How are limitations and customer responsibilities described in contracts?",
  ],
  "Directors and officers exposure": [
    "Are investors, board members, or financing milestones changing governance expectations?",
    "Has the company raised institutional capital or formed a board?",
    "Are there investor or customer requirements tied to D&O coverage?",
  ],
  "Employment practices exposure": [
    "How many employees and contractors are currently engaged?",
    "Is the company hiring across states or countries?",
    "Are HR policies and complaint processes documented?",
  ],
  "Media / IP / content exposure": [
    "Does the product generate, transform, or publish content for users?",
    "What datasets, prompts, or customer uploads influence generated content?",
    "How are IP ownership and acceptable use handled in customer terms?",
  ],
  "Regulatory or high-impact decision exposure": [
    "Could the product affect healthcare, finance, legal, hiring, education, safety, or government decisions?",
    "Who reviews high-impact recommendations before they are used?",
    "What documentation exists for model limitations and intended use?",
  ],
  "Third-party dependency risk": [
    "Which external APIs, models, datasets, or infrastructure providers are critical?",
    "What happens if a provider has downtime, changes terms, or returns bad data?",
    "Are vendor dependencies disclosed in customer contracts or security reviews?",
  ],
  "Operational maturity gaps": [
    "Which security controls are implemented today versus planned?",
    "Is there a documented incident response process?",
    "What evidence can be shared during vendor or insurer review?",
  ],
};

export const categoryCoverage: Record<RiskCategory, CoverageArea[]> = {
  "Model output liability": ["Tech E&O", "AI-specific liability discussion"],
  "Data privacy and security": ["Cyber", "Tech E&O"],
  "Enterprise contract requirements": ["Tech E&O", "Cyber", "General Liability"],
  "Technology errors and omissions": ["Tech E&O"],
  "Directors and officers exposure": ["D&O"],
  "Employment practices exposure": ["EPLI", "Workers' Comp"],
  "Media / IP / content exposure": ["Media Liability", "Tech E&O"],
  "Regulatory or high-impact decision exposure": ["Tech E&O", "AI-specific liability discussion"],
  "Third-party dependency risk": ["Tech E&O", "Cyber"],
  "Operational maturity gaps": ["Cyber", "Tech E&O"],
};

export const plainCategoryName = (category: RiskCategory) => category.toLowerCase();
