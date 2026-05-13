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
    "Do customer contracts ask for specific cyber coverage limits or security controls?",
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

export const categoryMethodology: Record<
  RiskCategory,
  {
    signal: string;
    scoreDrivers: string[];
    limits: string;
  }
> = {
  "Model output liability": {
    signal: "Looks for customer-facing AI output, automated action, business-critical reliance, and human review patterns.",
    scoreDrivers: [
      "Customer-facing outputs and agentic actions increase the signal.",
      "Business-critical or high-impact recommendations increase the signal further.",
      "Rare or missing human review increases process concern.",
    ],
    limits: "The score does not judge model quality, safety performance, actual liability, or coverage fit.",
  },
  "Data privacy and security": {
    signal: "Looks for confidential, personal, sensitive, health, financial, student, source code, or legal data exposure.",
    scoreDrivers: [
      "Sensitive data categories carry more weight than public data.",
      "Persistent storage and customer-data training increase the signal.",
      "Missing security controls adds a follow-up driver.",
    ],
    limits: "The score does not verify compliance, security posture, or breach likelihood.",
  },
  "Enterprise contract requirements": {
    signal: "Looks for enterprise sales motion, customer insurance requests, specific limits, and vendor security reviews.",
    scoreDrivers: [
      "Frequent customer insurance requests materially increase the signal.",
      "Enterprise sales and vendor reviews add qualification pressure.",
      "Security review activity suggests more evidence may be needed during handoff.",
    ],
    limits: "The score does not interpret contracts or determine whether a requirement applies.",
  },
  "Technology errors and omissions": {
    signal: "Looks for customer-facing product behavior where downtime, inaccurate output, or failed automation could affect customers.",
    scoreDrivers: [
      "Automated workflows and external actions increase the signal.",
      "Business-critical reliance and possible customer financial loss increase the signal.",
      "Agentic workflows add execution and service delivery questions.",
    ],
    limits: "The score is not advice and does not estimate claim likelihood.",
  },
  "Directors and officers exposure": {
    signal: "Looks for company stage, investor requirements, board formation, and governance-related buying reasons.",
    scoreDrivers: [
      "Seed stage or later increases the governance signal.",
      "Investor requirements and board formation increase relevance.",
      "The signal is intentionally lower for very early companies unless those triggers appear.",
    ],
    limits: "The score does not assess securities risk, governance quality, or board exposure.",
  },
  "Employment practices exposure": {
    signal: "Looks for team size and hiring-related insurance exploration.",
    scoreDrivers: [
      "Teams above 15 employees increase the signal.",
      "Hiring employees as a stated buying reason adds relevance.",
      "The prototype treats employment signal as operational context, not HR advice.",
    ],
    limits: "The score does not review policies, employee classification, or jurisdiction-specific obligations.",
  },
  "Media / IP / content exposure": {
    signal: "Looks for content generation, training or fine-tuning, customer-data training, and IP or ownership uncertainty.",
    scoreDrivers: [
      "Content generation and explicit IP questions increase the signal.",
      "Training on customer data or model fine-tuning adds provenance and permission questions.",
      "Possible IP issues are weighted lower than confirmed issues.",
    ],
    limits: "The score does not determine copyright status, IP ownership, or licensing adequacy.",
  },
  "Regulatory or high-impact decision exposure": {
    signal: "Looks for healthcare, finance, legal, hiring, education, safety, government, or other regulated decision contexts.",
    scoreDrivers: [
      "Regulated or safety-sensitive recommendations are high-signal inputs.",
      "Sensitive data categories add related regulatory follow-up.",
      "Possible regulated use cases are flagged without assuming they apply.",
    ],
    limits: "The score does not provide legal classification, regulatory advice, or compliance conclusions.",
  },
  "Third-party dependency risk": {
    signal: "Looks for third-party LLM APIs, open-source models, external APIs, datasets, uploaded files, or other critical vendors.",
    scoreDrivers: [
      "External model, API, dataset, or infrastructure dependency increases the signal.",
      "Open-source model use can add provenance and operational dependency questions.",
      "The prototype does not distinguish vendor quality or contract terms.",
    ],
    limits: "The score does not assess vendor resilience, indemnity, or contractual allocation of risk.",
  },
  "Operational maturity gaps": {
    signal: "Looks for missing security controls, persistent storage, vendor review pressure, prior incidents, and immature review processes.",
    scoreDrivers: [
      "No selected controls is the strongest maturity driver.",
      "Persistent storage, SOC 2 in progress, and vendor reviews add evidence questions.",
      "Prior incidents or disputes increase follow-up needs.",
    ],
    limits: "The score does not audit controls or determine readiness for underwriting.",
  },
};

export const plainCategoryName = (category: RiskCategory) => category.toLowerCase();
