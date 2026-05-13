import { z } from "zod";

const requiredString = (message: string) => z.string().min(1, message);
const requiredArray = (message: string) => z.array(z.string()).min(1, message);

export const companyProfileSchema = z.object({
  companyName: requiredString("Add the company name."),
  website: z.string().optional(),
  companyStage: requiredString("Choose the closest company stage."),
  teamSize: requiredString("Choose the closest team size."),
  primaryCustomer: requiredString("Choose the primary customer type."),
});

export const productTypeSchema = z.object({
  productType: requiredString("Choose the closest product type."),
  productDescription: z.string().min(20, "Add a short product description."),
  decisionReliance: requiredString("Choose how users rely on product decisions."),
});

export const aiUsageSchema = z.object({
  aiUsage: requiredArray("Select at least one AI usage pattern."),
  customerFacingOutputs: requiredString("Choose whether outputs are shown to customers."),
  automatedActions: requiredString("Choose the closest action model."),
  humanReview: requiredString("Choose the closest human review pattern."),
});

export const dataExposureSchema = z.object({
  processedData: requiredArray("Select at least one data type."),
  storesCustomerData: requiredString("Choose how customer data is stored."),
  customerDataTraining: requiredString("Choose how customer data is used for training."),
  securityControls: z.array(z.string()).default([]),
});

export const customersContractsSchema = z.object({
  insuranceRequirements: requiredString("Choose whether customers ask for insurance requirements."),
  appearedRequirements: z.array(z.string()).default([]),
  enterpriseSales: requiredString("Choose whether the company sells to enterprise customers."),
  vendorSecurityReviews: requiredString("Choose the closest vendor review pattern."),
});

export const riskContextSchema = z.object({
  financialLoss: requiredString("Choose whether wrong outputs could cause financial loss."),
  regulatedDecisions: requiredString("Choose whether wrong outputs could affect regulated decisions."),
  ipQuestions: requiredString("Choose whether IP or content questions may arise."),
  thirdPartyDependencies: requiredString("Choose whether third-party data or services are involved."),
  priorIncidents: requiredString("Choose the closest incident history option."),
});

export const currentInsuranceSchema = z.object({
  currentCoverage: z.array(z.string()).default([]),
  exploringReasons: requiredArray("Select at least one reason for exploring insurance."),
  timeline: requiredString("Choose the closest timeline."),
  internalNotes: z.string().optional().default(""),
});

export const intakeSchema = companyProfileSchema
  .merge(productTypeSchema)
  .merge(aiUsageSchema)
  .merge(dataExposureSchema)
  .merge(customersContractsSchema)
  .merge(riskContextSchema)
  .merge(currentInsuranceSchema);

export type IntakeAnswers = z.infer<typeof intakeSchema>;

export const defaultIntakeValues: IntakeAnswers = {
  companyName: "",
  website: "",
  companyStage: "",
  teamSize: "",
  primaryCustomer: "",
  productType: "",
  productDescription: "",
  decisionReliance: "",
  aiUsage: [],
  customerFacingOutputs: "",
  automatedActions: "",
  humanReview: "",
  processedData: [],
  storesCustomerData: "",
  customerDataTraining: "",
  securityControls: [],
  insuranceRequirements: "",
  appearedRequirements: [],
  enterpriseSales: "",
  vendorSecurityReviews: "",
  financialLoss: "",
  regulatedDecisions: "",
  ipQuestions: "",
  thirdPartyDependencies: "",
  priorIncidents: "",
  currentCoverage: [],
  exploringReasons: [],
  timeline: "",
  internalNotes: "",
};

export type IntakeStepKey =
  | "company"
  | "product"
  | "ai"
  | "data"
  | "contracts"
  | "risk"
  | "insurance"
  | "review";

export const intakeSteps: Array<{
  key: IntakeStepKey;
  title: string;
  eyebrow: string;
  description: string;
  fields: Array<keyof IntakeAnswers>;
  schema?: z.ZodTypeAny;
}> = [
  {
    key: "company",
    title: "Company profile",
    eyebrow: "Step 1",
    description: "Basic company context helps frame buyer urgency and expected insurance conversations.",
    fields: ["companyName", "website", "companyStage", "teamSize", "primaryCustomer"],
    schema: companyProfileSchema,
  },
  {
    key: "product",
    title: "Product type",
    eyebrow: "Step 2",
    description: "Describe what the AI product does and how much users may rely on its recommendations.",
    fields: ["productType", "productDescription", "decisionReliance"],
    schema: productTypeSchema,
  },
  {
    key: "ai",
    title: "AI usage",
    eyebrow: "Step 3",
    description: "Map the core AI behavior, customer-facing output, action model, and review controls.",
    fields: ["aiUsage", "customerFacingOutputs", "automatedActions", "humanReview"],
    schema: aiUsageSchema,
  },
  {
    key: "data",
    title: "Data exposure",
    eyebrow: "Step 4",
    description: "Identify what data flows through the product and what controls are already in place.",
    fields: ["processedData", "storesCustomerData", "customerDataTraining", "securityControls"],
    schema: dataExposureSchema,
  },
  {
    key: "contracts",
    title: "Customers and contracts",
    eyebrow: "Step 5",
    description: "Capture enterprise sales pressure, contract requirements, and security review patterns.",
    fields: ["insuranceRequirements", "appearedRequirements", "enterpriseSales", "vendorSecurityReviews"],
    schema: customersContractsSchema,
  },
  {
    key: "risk",
    title: "Risk context",
    eyebrow: "Step 6",
    description: "Surface product contexts that may draw closer insurance, legal, or security review.",
    fields: ["financialLoss", "regulatedDecisions", "ipQuestions", "thirdPartyDependencies", "priorIncidents"],
    schema: riskContextSchema,
  },
  {
    key: "insurance",
    title: "Current insurance status",
    eyebrow: "Step 7",
    description: "Understand what is already in place and why the company is exploring coverage now.",
    fields: ["currentCoverage", "exploringReasons", "timeline", "internalNotes"],
    schema: currentInsuranceSchema,
  },
  {
    key: "review",
    title: "Review answers",
    eyebrow: "Step 8",
    description: "Confirm the intake before generating discussion areas and the internal handoff summary.",
    fields: [],
  },
];
