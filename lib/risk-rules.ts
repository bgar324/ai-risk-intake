import type { IntakeAnswers } from "@/lib/intake-schema";
import { categoryCoverage, categoryQuestions, getRiskBand, plainCategoryName } from "@/lib/risk-copy";
import type { CoverageArea, RiskCategory, RiskResults, RiskSignal } from "@/lib/types";

type RiskDraft = {
  score: number;
  drivers: string[];
};

const categories: RiskCategory[] = [
  "Model output liability",
  "Data privacy and security",
  "Enterprise contract requirements",
  "Technology errors and omissions",
  "Directors and officers exposure",
  "Employment practices exposure",
  "Media / IP / content exposure",
  "Regulatory or high-impact decision exposure",
  "Third-party dependency risk",
  "Operational maturity gaps",
];

function createDrafts(): Record<RiskCategory, RiskDraft> {
  return categories.reduce(
    (acc, category) => {
      acc[category] = { score: 0, drivers: [] };
      return acc;
    },
    {} as Record<RiskCategory, RiskDraft>,
  );
}

function add(drafts: Record<RiskCategory, RiskDraft>, category: RiskCategory, score: number, driver: string) {
  drafts[category].score += score;
  if (!drafts[category].drivers.includes(driver)) drafts[category].drivers.push(driver);
}

const includesAny = (values: string[], candidates: string[]) => values.some((value) => candidates.includes(value));

export function generateRiskResults(answers: IntakeAnswers): RiskResults {
  const drafts = createDrafts();

  if (answers.customerFacingOutputs === "Yes") {
    add(drafts, "Model output liability", 22, "The product shows AI-generated outputs to customers or end users.");
    add(drafts, "Technology errors and omissions", 12, "Customer-facing outputs may create service reliability or accuracy questions.");
  }

  if (answers.automatedActions === "Yes, within limited workflows") {
    add(drafts, "Model output liability", 18, "The AI system can take action within defined workflows.");
    add(drafts, "Technology errors and omissions", 15, "Automated workflow actions can affect customer operations.");
  }

  if (answers.automatedActions === "Yes, can trigger external actions") {
    add(drafts, "Model output liability", 28, "The AI system can trigger external actions.");
    add(drafts, "Technology errors and omissions", 22, "External automated actions may create customer impact if the system fails or misfires.");
  }

  if (answers.decisionReliance.includes("business-critical")) {
    add(drafts, "Model output liability", 22, "Users may rely on the product for business-critical recommendations.");
    add(drafts, "Technology errors and omissions", 20, "Business-critical recommendations can create downstream customer loss questions.");
  }

  if (answers.decisionReliance.includes("regulated") || answers.regulatedDecisions === "Yes") {
    add(drafts, "Regulatory or high-impact decision exposure", 38, "The product may affect regulated or safety-sensitive decisions.");
    add(drafts, "Model output liability", 18, "High-impact recommendations tend to receive closer review.");
  }

  if (answers.regulatedDecisions === "Possibly") {
    add(drafts, "Regulatory or high-impact decision exposure", 24, "The product may touch regulated or high-impact decision contexts.");
  }

  if (answers.humanReview === "Rarely" || answers.humanReview === "Never") {
    add(drafts, "Model output liability", 18, "High-impact output or action may not receive consistent human review.");
    add(drafts, "Operational maturity gaps", 10, "Limited review controls may raise process maturity questions.");
  }

  const sensitiveData = ["Personal data", "Sensitive personal data", "Health data", "Financial data", "Children/student data"];
  if (includesAny(answers.processedData, ["Customer business data", "Source code", "Legal documents"])) {
    add(drafts, "Data privacy and security", 18, "The product handles confidential customer business or operational data.");
  }
  if (includesAny(answers.processedData, sensitiveData)) {
    add(drafts, "Data privacy and security", 32, "The product processes personal, sensitive, health, financial, or student data.");
    add(drafts, "Regulatory or high-impact decision exposure", 12, "Sensitive data types may bring additional regulatory questions.");
  }

  if (answers.storesCustomerData === "Yes, temporarily") {
    add(drafts, "Data privacy and security", 12, "Customer data is stored temporarily.");
  }
  if (answers.storesCustomerData === "Yes, persistently") {
    add(drafts, "Data privacy and security", 22, "Customer data is stored persistently.");
    add(drafts, "Operational maturity gaps", 8, "Persistent storage increases the need to evidence controls and retention practices.");
  }

  if (answers.customerDataTraining === "Yes, with explicit permission") {
    add(drafts, "Data privacy and security", 10, "Customer data may be used for training or fine-tuning with permission.");
    add(drafts, "Media / IP / content exposure", 10, "Training or fine-tuning on customer data can raise ownership and usage questions.");
  }
  if (answers.customerDataTraining === "Yes, by default") {
    add(drafts, "Data privacy and security", 22, "Customer data is used for training or fine-tuning by default.");
    add(drafts, "Media / IP / content exposure", 22, "Default training on customer data can raise IP and customer permission questions.");
  }

  if (answers.securityControls.length === 0 || answers.securityControls.includes("None yet")) {
    add(drafts, "Operational maturity gaps", 34, "No formal security controls were selected.");
    add(drafts, "Data privacy and security", 16, "Limited current controls may be a key follow-up topic.");
  }

  if (answers.securityControls.includes("SOC 2 in progress")) {
    add(drafts, "Operational maturity gaps", 8, "SOC 2 is in progress, which may come up during enterprise or insurer review.");
  }

  if (answers.enterpriseSales === "In progress" || answers.enterpriseSales === "Yes") {
    add(drafts, "Enterprise contract requirements", 24, "The company sells or is moving into enterprise customers.");
  }
  if (answers.insuranceRequirements === "Yes, occasionally") {
    add(drafts, "Enterprise contract requirements", 22, "Customers occasionally ask for insurance requirements.");
  }
  if (answers.insuranceRequirements === "Yes, frequently") {
    add(drafts, "Enterprise contract requirements", 34, "Customers frequently ask for insurance requirements.");
  }
  if (answers.vendorSecurityReviews === "Occasionally" || answers.vendorSecurityReviews === "Frequently") {
    add(drafts, "Enterprise contract requirements", 14, "The company handles vendor security reviews.");
    add(drafts, "Operational maturity gaps", 10, "Vendor reviews may require documented security evidence.");
  }

  if (["Seed", "Series A", "Series B+"].includes(answers.companyStage)) {
    add(drafts, "Directors and officers exposure", 22, "The company is Seed stage or later, which can increase governance and investor-related discussion.");
  }
  if (answers.exploringReasons.includes("Investor requirement") || answers.exploringReasons.includes("Board formation")) {
    add(drafts, "Directors and officers exposure", 24, "Investor or board-related reasons are part of the insurance conversation.");
  }

  if (["16–50", "51–200", "200+"].includes(answers.teamSize)) {
    add(drafts, "Employment practices exposure", 26, "The team size suggests employment practices may be relevant.");
  }
  if (answers.exploringReasons.includes("Hiring employees")) {
    add(drafts, "Employment practices exposure", 18, "Hiring employees is a stated reason for exploring insurance.");
  }

  if (answers.productType === "AI content generation tool" || answers.ipQuestions === "Yes") {
    add(drafts, "Media / IP / content exposure", 32, "The product may create IP, copyright, or content ownership questions.");
  }
  if (answers.ipQuestions === "Possibly") {
    add(drafts, "Media / IP / content exposure", 20, "IP, copyright, or content ownership questions may arise.");
  }

  if (includesAny(answers.aiUsage, ["Uses third-party LLM APIs", "Runs open-source models"]) || answers.thirdPartyDependencies === "Yes") {
    add(drafts, "Third-party dependency risk", 24, "The product depends on third-party models, APIs, datasets, or external services.");
  }
  if (includesAny(answers.aiUsage, ["Fine-tunes models", "Trains proprietary models"])) {
    add(drafts, "Media / IP / content exposure", 14, "Model training or fine-tuning can raise dataset provenance questions.");
    add(drafts, "Operational maturity gaps", 8, "Model development practices may require documentation.");
  }
  if (answers.aiUsage.includes("Builds agents that take actions")) {
    add(drafts, "Model output liability", 16, "The product includes agents that can take actions.");
    add(drafts, "Technology errors and omissions", 16, "Agentic workflows can create service execution questions.");
  }

  if (answers.financialLoss === "Possibly") {
    add(drafts, "Technology errors and omissions", 18, "A wrong output could possibly cause customer financial loss.");
  }
  if (answers.financialLoss === "Yes") {
    add(drafts, "Technology errors and omissions", 30, "A wrong output could cause customer financial loss.");
    add(drafts, "Model output liability", 18, "Customer financial loss potential increases output liability discussion.");
  }

  if (answers.priorIncidents === "Yes") {
    add(drafts, "Operational maturity gaps", 22, "Prior incidents, disputes, claims, or security events may require follow-up.");
  }

  const signals: RiskSignal[] = categories
    .map((category) => {
      const score = Math.min(100, Math.max(0, Math.round(drafts[category].score)));
      return {
        category,
        score,
        band: getRiskBand(score),
        drivers: drafts[category].drivers.filter(Boolean).slice(0, 4),
        questions: categoryQuestions[category].slice(0, 3),
        conversationAreas: categoryCoverage[category],
      };
    })
    .sort((a, b) => b.score - a.score);

  const coverageConversationAreas = uniqueCoverage(signals.filter((signal) => signal.score >= 25));
  const topSignals = signals.slice(0, 3);
  const questionsToAsk = Array.from(new Set(topSignals.flatMap((signal) => signal.questions))).slice(0, 8);
  const founderSummary = buildFounderSummary(answers, topSignals);

  return {
    answers,
    signals,
    topSignals,
    coverageConversationAreas,
    questionsToAsk,
    founderSummary,
    buyerUrgency: getBuyerUrgency(answers),
    dataSensitivity: getDataSensitivity(answers),
    internalSummary: {
      company: {
        name: answers.companyName,
        stage: answers.companyStage,
        teamSize: answers.teamSize,
        primaryCustomer: answers.primaryCustomer,
      },
      product: {
        type: answers.productType,
        description: answers.productDescription,
        aiUsage: answers.aiUsage,
        customerFacingOutputs: answers.customerFacingOutputs === "Not sure" ? "not_sure" : answers.customerFacingOutputs === "Yes",
        automatedActions: answers.automatedActions,
      },
      riskSignals: signals
        .filter((signal) => signal.score >= 25)
        .map((signal) => ({
          category: signal.category,
          score: signal.score,
          band: signal.band,
          drivers: signal.drivers,
        })),
      coverageConversationAreas,
      questionsToAsk,
      internalNotes: answers.internalNotes?.trim() || undefined,
      disclaimer:
        "This is an independent product prototype. It is not affiliated with Corgi and does not provide insurance, legal, financial, underwriting, or coverage advice. Outputs are discussion prompts based on user-provided answers.",
    },
  };
}

function uniqueCoverage(signals: RiskSignal[]): CoverageArea[] {
  return Array.from(new Set(signals.flatMap((signal) => signal.conversationAreas)));
}

function getBuyerUrgency(answers: IntakeAnswers): RiskResults["buyerUrgency"] {
  if (answers.timeline === "Immediately" || answers.insuranceRequirements === "Yes, frequently") return "Immediate";
  if (answers.timeline === "This month" || answers.timeline === "This quarter") return "Near term";
  return "Exploring";
}

function getDataSensitivity(answers: IntakeAnswers): RiskResults["dataSensitivity"] {
  if (includesAny(answers.processedData, ["Health data", "Financial data", "Sensitive personal data", "Children/student data"])) return "High";
  if (includesAny(answers.processedData, ["Personal data", "Source code", "Legal documents"])) return "Elevated";
  if (includesAny(answers.processedData, ["Customer business data"])) return "Moderate";
  return "Low";
}

function buildFounderSummary(answers: IntakeAnswers, topSignals: RiskSignal[]) {
  const categoriesText = topSignals.map((signal) => plainCategoryName(signal.category)).join(", ");
  const reasons = [
    answers.aiUsage.length ? `relies on ${answers.aiUsage.slice(0, 2).map(formatAiUsageReason).join(" and ")}` : "",
    answers.customerFacingOutputs === "Yes" ? "shows outputs to customers" : "",
    answers.processedData.length ? `handles ${answers.processedData.slice(0, 2).join(" and ").toLowerCase()}` : "",
    answers.enterpriseSales === "Yes" || answers.enterpriseSales === "In progress" ? "sells to or is pursuing enterprise customers" : "",
  ].filter(Boolean);

  const reasonText = reasons.length ? reasons.join(", ") : "has several details that may need review during an insurance conversation";
  return `Based on your answers, your strongest discussion areas are ${categoriesText}. This is mainly because your product ${reasonText}. An insurance provider may ask how outputs are reviewed, what data is stored, what security controls are in place, and whether customer contracts require specific coverage limits.`;
}

function formatAiUsageReason(value: string) {
  const labels: Record<string, string> = {
    "Uses third-party LLM APIs": "third-party LLM APIs",
    "Builds agents that take actions": "agents that take actions",
    "Runs open-source models": "open-source models",
    "Trains proprietary models": "proprietary model training",
    "Fine-tunes models": "fine-tuned models",
    "Uses AI internally only": "internal AI workflows",
  };

  return labels[value] ?? value.toLowerCase();
}
