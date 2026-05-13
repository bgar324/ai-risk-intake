"use client";

import type { IntakeAnswers } from "@/lib/intake-schema";
import { intakeSteps } from "@/lib/intake-schema";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const labels: Record<keyof IntakeAnswers, string> = {
  companyName: "Company name",
  website: "Website",
  companyStage: "Company stage",
  teamSize: "Team size",
  primaryCustomer: "Primary customer",
  productType: "Product type",
  productDescription: "Product description",
  decisionReliance: "Decision reliance",
  aiUsage: "AI usage",
  customerFacingOutputs: "Customer-facing outputs",
  automatedActions: "Automated actions",
  humanReview: "Human review",
  processedData: "Processed data",
  storesCustomerData: "Stores customer data",
  customerDataTraining: "Customer data for training",
  securityControls: "Security controls",
  insuranceRequirements: "Insurance requirements",
  appearedRequirements: "Requirements seen",
  enterpriseSales: "Enterprise sales",
  vendorSecurityReviews: "Vendor security reviews",
  financialLoss: "Financial loss potential",
  regulatedDecisions: "Regulated decisions",
  ipQuestions: "IP/content questions",
  thirdPartyDependencies: "Third-party dependencies",
  priorIncidents: "Prior incidents",
  currentCoverage: "Current coverage",
  exploringReasons: "Why exploring",
  timeline: "Timeline",
  internalNotes: "Broker/internal notes",
};

export function ReviewAnswers({
  answers,
  onEdit,
}: {
  answers: IntakeAnswers;
  onEdit: (stepIndex: number) => void;
}) {
  return (
    <div className="space-y-5">
      {intakeSteps.slice(0, -1).map((step, index) => (
        <section key={step.key} className="rounded-lg border bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-semibold">{step.title}</h2>
            <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(index)}>
              Edit
            </Button>
          </div>
          <Separator className="my-4" />
          <dl className="grid gap-4 sm:grid-cols-2">
            {step.fields.map((field) => {
              const value = answers[field];
              const display = Array.isArray(value) ? value.join(", ") || "None selected" : value || "Not provided";
              return (
                <div key={field}>
                  <dt className="text-xs font-medium uppercase tracking-normal text-muted-foreground">{labels[field]}</dt>
                  <dd className="mt-1 text-sm leading-6">{display}</dd>
                </div>
              );
            })}
          </dl>
        </section>
      ))}
    </div>
  );
}
