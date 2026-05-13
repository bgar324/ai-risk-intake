import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultIntakeValues, intakeSchema, type IntakeAnswers } from "@/lib/intake-schema";
import { generateRiskResults } from "@/lib/risk-rules";

function makeAnswers(overrides: Partial<IntakeAnswers> = {}) {
  return intakeSchema.parse({
    ...defaultIntakeValues,
    companyName: "Northstar AI",
    companyStage: "Seed",
    teamSize: "16–50",
    primaryCustomer: "Enterprise",
    productType: "AI agent / workflow automation",
    productDescription:
      "Enterprise operations agent for support routing and workflow automation using customer business data.",
    decisionReliance: "Yes, business-critical recommendations",
    aiUsage: ["Uses third-party LLM APIs", "Builds agents that take actions"],
    customerFacingOutputs: "Yes",
    automatedActions: "Yes, within limited workflows",
    humanReview: "Sometimes",
    processedData: ["Customer business data", "Personal data"],
    storesCustomerData: "Yes, persistently",
    customerDataTraining: "Yes, with explicit permission",
    securityControls: ["Encryption at rest", "Encryption in transit", "SOC 2 in progress"],
    insuranceRequirements: "Yes, frequently",
    appearedRequirements: ["Technology E&O", "Cyber", "Specific limits"],
    enterpriseSales: "Yes",
    vendorSecurityReviews: "Frequently",
    financialLoss: "Possibly",
    regulatedDecisions: "No",
    ipQuestions: "Possibly",
    thirdPartyDependencies: "Yes",
    priorIncidents: "No",
    currentCoverage: ["Cyber"],
    exploringReasons: ["Investor requirement", "Enterprise sales", "Customer contract requirement"],
    timeline: "This month",
    ...overrides,
  });
}

describe("generateRiskResults", () => {
  it("ranks high-signal AI enterprise intake risks deterministically", () => {
    const results = generateRiskResults(makeAnswers());

    assert.deepEqual(
      results.topSignals.map((signal) => [signal.category, signal.score, signal.band]),
      [
        ["Data privacy and security", 82, "High signal"],
        ["Technology errors and omissions", 81, "High signal"],
        ["Model output liability", 78, "High signal"],
      ],
    );
  });

  it("deduplicates coverage conversation areas", () => {
    const results = generateRiskResults(makeAnswers());
    const uniqueAreas = new Set(results.coverageConversationAreas);

    assert.equal(results.coverageConversationAreas.length, uniqueAreas.size);
    assert.ok(results.coverageConversationAreas.includes("Cyber"));
    assert.ok(results.coverageConversationAreas.includes("Tech E&O"));
  });

  it("keeps scores inside the documented 0 to 100 range", () => {
    const results = generateRiskResults(
      makeAnswers({
        productType: "AI healthcare / life sciences tool",
        decisionReliance: "Yes, regulated or safety-sensitive recommendations",
        automatedActions: "Yes, can trigger external actions",
        humanReview: "Never",
        processedData: ["Health data", "Financial data", "Sensitive personal data"],
        customerDataTraining: "Yes, by default",
        securityControls: ["None yet"],
        financialLoss: "Yes",
        regulatedDecisions: "Yes",
        priorIncidents: "Yes",
      }),
    );

    for (const signal of results.signals) {
      assert.ok(signal.score >= 0, `${signal.category} should not be below 0`);
      assert.ok(signal.score <= 100, `${signal.category} should not exceed 100`);
    }
  });

  it("builds an internal handoff summary from the intake answers", () => {
    const results = generateRiskResults(makeAnswers());

    assert.equal(results.internalSummary.company.name, "Northstar AI");
    assert.equal(results.internalSummary.product.customerFacingOutputs, true);
    assert.deepEqual(results.internalSummary.product.aiUsage, [
      "Uses third-party LLM APIs",
      "Builds agents that take actions",
    ]);
    assert.equal(results.internalSummary.disclaimer, "This is not insurance, legal, or financial advice.");
  });

  it("keeps low-exposure intakes low signal", () => {
    const results = generateRiskResults(
      makeAnswers({
        companyStage: "Idea",
        teamSize: "1–5",
        primaryCustomer: "Consumers",
        productType: "Other",
        decisionReliance: "No",
        aiUsage: ["Uses AI internally only"],
        customerFacingOutputs: "No",
        automatedActions: "No, user must approve",
        humanReview: "Not applicable",
        processedData: ["Public data"],
        storesCustomerData: "No",
        customerDataTraining: "No",
        securityControls: ["Basic access control"],
        insuranceRequirements: "No",
        appearedRequirements: [],
        enterpriseSales: "No",
        vendorSecurityReviews: "No",
        financialLoss: "No",
        regulatedDecisions: "No",
        ipQuestions: "No",
        thirdPartyDependencies: "No",
        priorIncidents: "No",
        currentCoverage: [],
        exploringReasons: ["General risk management"],
        timeline: "Exploring only",
      }),
    );

    assert.equal(results.topSignals[0]?.band, "Low signal");
    assert.deepEqual(results.coverageConversationAreas, []);
  });
});
