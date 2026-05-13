"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { IntakeStepLayout } from "@/components/intake/intake-step-layout";
import { ProgressSidebar } from "@/components/intake/progress-sidebar";
import { ReviewAnswers } from "@/components/intake/review-answers";
import { defaultIntakeValues, intakeSchema, intakeSteps, type IntakeAnswers, type IntakeStepKey } from "@/lib/intake-schema";
import { loadIntakeAnswers, saveCompletedSubmission, saveIntakeAnswers } from "@/lib/storage";
import { cn } from "@/lib/utils";

const options = {
  companyStage: ["Idea", "Pre-seed", "Seed", "Series A", "Series B+", "Profitable / bootstrapped"],
  teamSize: ["1–5", "6–15", "16–50", "51–200", "200+"],
  primaryCustomer: ["Consumers", "SMBs", "Mid-market", "Enterprise", "Government / public sector", "Healthcare / life sciences", "Financial services", "Education", "Other"],
  productType: ["AI agent / workflow automation", "AI developer tool", "AI customer support tool", "AI analytics / decision support", "AI healthcare / life sciences tool", "AI finance / risk tool", "AI security tool", "AI content generation tool", "AI infrastructure / model platform", "Other"],
  decisionReliance: ["No", "Yes, low-stakes recommendations", "Yes, business-critical recommendations", "Yes, regulated or safety-sensitive recommendations", "Not sure"],
  aiUsage: ["Uses third-party LLM APIs", "Fine-tunes models", "Trains proprietary models", "Runs open-source models", "Builds agents that take actions", "Uses AI internally only", "Other"],
  customerFacingOutputs: ["Yes", "No", "Not sure"],
  automatedActions: ["No, user must approve", "Yes, within limited workflows", "Yes, can trigger external actions", "Not sure"],
  humanReview: ["Always", "Sometimes", "Rarely", "Never", "Not applicable"],
  processedData: ["Public data", "Customer business data", "Personal data", "Sensitive personal data", "Health data", "Financial data", "Children/student data", "Source code", "Legal documents", "Other"],
  storesCustomerData: ["No", "Yes, temporarily", "Yes, persistently", "Not sure"],
  customerDataTraining: ["No", "Yes, with explicit permission", "Yes, by default", "Not sure"],
  securityControls: ["Basic access control", "Encryption at rest", "Encryption in transit", "Audit logs", "SSO/SAML", "SOC 2 completed", "SOC 2 in progress", "Incident response plan", "None yet"],
  insuranceRequirements: ["No", "Yes, occasionally", "Yes, frequently", "Not sure"],
  appearedRequirements: ["General Liability", "Professional Liability / E&O", "Technology E&O", "Cyber", "D&O", "EPLI", "Media Liability", "Workers’ Comp", "Specific limits", "Not sure"],
  enterpriseSales: ["No", "In progress", "Yes"],
  vendorSecurityReviews: ["No", "Occasionally", "Frequently", "Not sure"],
  yesPossibly: ["No", "Possibly", "Yes", "Not sure"],
  priorIncidents: ["No", "Yes", "Prefer not to say"],
  currentCoverage: ["None", "General Liability", "Cyber", "Tech E&O", "D&O", "EPLI", "Workers’ Comp", "Not sure"],
  exploringReasons: ["Investor requirement", "Customer contract requirement", "Enterprise sales", "General risk management", "Hiring employees", "Board formation", "AI-specific risk concern", "Not sure"],
  timeline: ["Immediately", "This month", "This quarter", "Exploring only"],
};

type FieldName = keyof IntakeAnswers;

export function IntakeWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const hydratedRef = useRef(false);
  const form = useForm<IntakeAnswers>({ defaultValues: defaultIntakeValues, mode: "onChange" });
  const { register, control, setValue, formState, setError, clearErrors, getValues, reset } = form;
  const values = useWatch({ control }) as IntakeAnswers;
  const step = intakeSteps[currentStep];

  useEffect(() => {
    queueMicrotask(() => {
      const stored = loadIntakeAnswers();
      if (stored) reset(stored);
      hydratedRef.current = true;
    });
  }, [reset]);

  useEffect(() => {
    if (hydratedRef.current) saveIntakeAnswers(values);
  }, [values]);

  const completed = (() => {
    const done = new Set<IntakeStepKey>();
    for (const item of intakeSteps) {
      if (!item.schema) continue;
      const picked = pickValues(getValues(), item.fields);
      if (item.schema.safeParse(picked).success) done.add(item.key);
    }
    return done;
  })();

  function validateStep(index = currentStep) {
    const current = intakeSteps[index];
    clearErrors();
    if (!current.schema) {
      const result = intakeSchema.safeParse(getValues());
      if (result.success) return true;
      applyZodErrors(result.error, setError);
      return false;
    }

    const result = current.schema.safeParse(pickValues(getValues(), current.fields));
    if (result.success) return true;
    applyZodErrors(result.error, setError);
    return false;
  }

  function goNext() {
    if (!validateStep()) return;
    if (currentStep === intakeSteps.length - 1) {
      const nextValues = getValues();
      saveIntakeAnswers(nextValues);
      saveCompletedSubmission(nextValues);
      router.push("/results");
      return;
    }
    setCurrentStep((stepIndex) => Math.min(stepIndex + 1, intakeSteps.length - 1));
  }

  function goPrevious() {
    setCurrentStep((stepIndex) => Math.max(stepIndex - 1, 0));
  }

  function selectStep(index: number) {
    if (index <= currentStep || completed.has(intakeSteps[index - 1]?.key)) {
      setCurrentStep(index);
    }
  }

  const progress = ((currentStep + 1) / intakeSteps.length) * 100;

  return (
    <div className="container-shell py-6 lg:py-8">
      <div className="mb-5 rounded-lg border border-zinc-300 bg-white p-4 lg:hidden">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-medium">{step.title}</span>
          <span className="text-muted-foreground">{currentStep + 1} of {intakeSteps.length}</span>
        </div>
        <Progress value={progress} />
      </div>

      <div className="flex items-start gap-8">
        <ProgressSidebar currentStep={currentStep} completed={completed} onSelect={selectStep} />
        <main className="min-w-0 flex-1 overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-[0_18px_50px_-42px_rgb(24_24_27/0.65)]">
          <div className="border-b bg-zinc-950 px-5 py-4 text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-normal text-zinc-400">AI Risk Intake</p>
                <p className="mt-1 text-sm font-medium">{step.title}</p>
              </div>
              <p className="rounded-md border border-zinc-700 px-2 py-1 text-xs font-medium text-zinc-200">{Math.round(progress)}%</p>
            </div>
            <Progress value={progress} className="mt-3 hidden bg-zinc-800 lg:block [&>div]:bg-white" />
          </div>

          <form
            className="p-5 sm:p-7"
            onSubmit={(event) => {
              event.preventDefault();
              goNext();
            }}
          >
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <IntakeStepLayout eyebrow={step.eyebrow} title={step.title} description={step.description}>
                {renderStep(currentStep, {
                  values,
                  register,
                  setValue,
                  errors: formState.errors,
                  onEdit: setCurrentStep,
                })}
              </IntakeStepLayout>
            </motion.div>

            <Separator className="my-6" />
            {currentStep === intakeSteps.length - 1 && (
              <Alert variant="warning" className="mb-6">
                <AlertCircle className="text-amber-700" />
                <AlertTitle>Before generating results</AlertTitle>
                <AlertDescription>
                  This prototype identifies possible risk areas for discussion. It does not provide insurance, legal, or financial advice.
                </AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="outline" onClick={goPrevious} disabled={currentStep === 0}>
                <ArrowLeft className="h-4 w-4" /> Previous
              </Button>
              <Button type="submit">
                {currentStep === intakeSteps.length - 1 ? (
                  <>
                    Generate results <CheckCircle2 className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

function renderStep(
  currentStep: number,
  context: {
    values: IntakeAnswers;
    register: ReturnType<typeof useForm<IntakeAnswers>>["register"];
    setValue: ReturnType<typeof useForm<IntakeAnswers>>["setValue"];
    errors: ReturnType<typeof useForm<IntakeAnswers>>["formState"]["errors"];
    onEdit: (index: number) => void;
  },
) {
  const { values, register, setValue, errors, onEdit } = context;

  if (currentStep === 0) {
    return (
      <>
        <TextField label="Company name" field="companyName" register={register} error={errors.companyName?.message} placeholder="Corgi Labs" />
        <TextField label="Website optional" field="website" register={register} error={errors.website?.message} placeholder="https://example.com" />
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField label="Company stage" field="companyStage" value={values.companyStage} setValue={setValue} options={options.companyStage} error={errors.companyStage?.message} />
          <SelectField label="Team size" field="teamSize" value={values.teamSize} setValue={setValue} options={options.teamSize} error={errors.teamSize?.message} />
        </div>
        <SelectField label="Primary customer" field="primaryCustomer" value={values.primaryCustomer} setValue={setValue} options={options.primaryCustomer} error={errors.primaryCustomer?.message} />
      </>
    );
  }

  if (currentStep === 1) {
    return (
      <>
        <SelectField label="What best describes the product?" field="productType" value={values.productType} setValue={setValue} options={options.productType} error={errors.productType?.message} />
        <TextAreaField label="Short product description" field="productDescription" register={register} error={errors.productDescription?.message} placeholder="Describe what the product does, who uses it, and what the AI system contributes." />
        <RadioField label="Does the product make or recommend decisions that users may rely on?" field="decisionReliance" value={values.decisionReliance} setValue={setValue} options={options.decisionReliance} error={errors.decisionReliance?.message} />
      </>
    );
  }

  if (currentStep === 2) {
    return (
      <>
        <CheckboxField label="How does the company use AI?" field="aiUsage" values={values.aiUsage} setValue={setValue} options={options.aiUsage} error={errors.aiUsage?.message} />
        <RadioField label="Does the product generate outputs shown to customers or end users?" field="customerFacingOutputs" value={values.customerFacingOutputs} setValue={setValue} options={options.customerFacingOutputs} error={errors.customerFacingOutputs?.message} />
        <RadioField label="Can the AI system take actions automatically?" field="automatedActions" value={values.automatedActions} setValue={setValue} options={options.automatedActions} error={errors.automatedActions?.message} />
        <SelectField label="Is there human review before high-impact output/action?" field="humanReview" value={values.humanReview} setValue={setValue} options={options.humanReview} error={errors.humanReview?.message} />
      </>
    );
  }

  if (currentStep === 3) {
    return (
      <>
        <CheckboxField label="What data does the product process?" field="processedData" values={values.processedData} setValue={setValue} options={options.processedData} error={errors.processedData?.message} />
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField label="Does the company store customer data?" field="storesCustomerData" value={values.storesCustomerData} setValue={setValue} options={options.storesCustomerData} error={errors.storesCustomerData?.message} />
          <SelectField label="Use customer data for training or fine-tuning?" field="customerDataTraining" value={values.customerDataTraining} setValue={setValue} options={options.customerDataTraining} error={errors.customerDataTraining?.message} />
        </div>
        <CheckboxField label="Does the company have security controls?" field="securityControls" values={values.securityControls} setValue={setValue} options={options.securityControls} error={errors.securityControls?.message} />
      </>
    );
  }

  if (currentStep === 4) {
    return (
      <>
        <RadioField label="Are customers asking for insurance requirements?" field="insuranceRequirements" value={values.insuranceRequirements} setValue={setValue} options={options.insuranceRequirements} error={errors.insuranceRequirements?.message} />
        <CheckboxField label="Which requirements have appeared?" field="appearedRequirements" values={values.appearedRequirements} setValue={setValue} options={options.appearedRequirements} error={errors.appearedRequirements?.message} />
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField label="Does the company sell to enterprise customers?" field="enterpriseSales" value={values.enterpriseSales} setValue={setValue} options={options.enterpriseSales} error={errors.enterpriseSales?.message} />
          <SelectField label="Does the company handle vendor security reviews?" field="vendorSecurityReviews" value={values.vendorSecurityReviews} setValue={setValue} options={options.vendorSecurityReviews} error={errors.vendorSecurityReviews?.message} />
        </div>
      </>
    );
  }

  if (currentStep === 5) {
    return (
      <>
        <RadioField label="Could a wrong output cause customer financial loss?" field="financialLoss" value={values.financialLoss} setValue={setValue} options={options.yesPossibly} error={errors.financialLoss?.message} />
        <RadioField label="Could a wrong output affect healthcare, legal, hiring, lending, housing, safety, or other regulated decisions?" field="regulatedDecisions" value={values.regulatedDecisions} setValue={setValue} options={options.yesPossibly} error={errors.regulatedDecisions?.message} />
        <RadioField label="Could the product create IP, copyright, or content ownership questions?" field="ipQuestions" value={values.ipQuestions} setValue={setValue} options={options.yesPossibly} error={errors.ipQuestions?.message} />
        <RadioField label="Does the product depend on third-party datasets, scraped data, uploaded customer files, or external APIs?" field="thirdPartyDependencies" value={values.thirdPartyDependencies} setValue={setValue} options={["No", "Yes", "Not sure"]} error={errors.thirdPartyDependencies?.message} />
        <RadioField label="Has the company had prior incidents, disputes, claims, or security events?" field="priorIncidents" value={values.priorIncidents} setValue={setValue} options={options.priorIncidents} error={errors.priorIncidents?.message} />
      </>
    );
  }

  if (currentStep === 6) {
    return (
      <>
        <CheckboxField label="Current coverage" field="currentCoverage" values={values.currentCoverage} setValue={setValue} options={options.currentCoverage} error={errors.currentCoverage?.message} />
        <CheckboxField label="Why are you exploring insurance?" field="exploringReasons" values={values.exploringReasons} setValue={setValue} options={options.exploringReasons} error={errors.exploringReasons?.message} />
        <SelectField label="Timeline" field="timeline" value={values.timeline} setValue={setValue} options={options.timeline} error={errors.timeline?.message} />
        <TextAreaField label="Optional broker/internal notes" field="internalNotes" register={register} error={errors.internalNotes?.message} placeholder="Add context for handoff, contract notes, pending questions, or founder preferences. This stays local in the prototype." />
      </>
    );
  }

  return <ReviewAnswers answers={values} onEdit={onEdit} />;
}

function FieldShell({
  id,
  label,
  error,
  children,
}: {
  id?: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  const errorId = id ? `${id}-error` : undefined;

  return (
    <fieldset className="rounded-lg border border-zinc-200 bg-zinc-50/45 p-4" aria-describedby={error ? errorId : undefined}>
      {id ? (
        <label htmlFor={id} className="text-sm font-semibold text-zinc-900">
          {label}
        </label>
      ) : (
        <legend className="text-sm font-semibold text-zinc-900">{label}</legend>
      )}
      <div className="mt-3">{children}</div>
      {error && (
        <p id={errorId} className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </fieldset>
  );
}

function TextField({ label, field, register, error, placeholder }: { label: string; field: FieldName; register: ReturnType<typeof useForm<IntakeAnswers>>["register"]; error?: string; placeholder?: string }) {
  const id = String(field);
  return (
    <FieldShell id={id} label={label} error={error}>
      <Input id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...register(field)} placeholder={placeholder} />
    </FieldShell>
  );
}

function TextAreaField({ label, field, register, error, placeholder }: { label: string; field: FieldName; register: ReturnType<typeof useForm<IntakeAnswers>>["register"]; error?: string; placeholder?: string }) {
  const id = String(field);
  return (
    <FieldShell id={id} label={label} error={error}>
      <Textarea id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...register(field)} placeholder={placeholder} />
    </FieldShell>
  );
}

function SelectField({ label, field, value, setValue, options: fieldOptions, error }: { label: string; field: FieldName; value: string; setValue: ReturnType<typeof useForm<IntakeAnswers>>["setValue"]; options: string[]; error?: string }) {
  const id = String(field);
  return (
    <FieldShell id={id} label={label} error={error}>
      <Select value={value} onValueChange={(next) => setValue(field, next, { shouldDirty: true, shouldValidate: true })}>
        <SelectTrigger id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined}>
          <SelectValue placeholder="Select one" />
        </SelectTrigger>
        <SelectContent>
          {fieldOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldShell>
  );
}

function RadioField({ label, field, value, setValue, options: fieldOptions, error }: { label: string; field: FieldName; value: string; setValue: ReturnType<typeof useForm<IntakeAnswers>>["setValue"]; options: string[]; error?: string }) {
  return (
    <FieldShell label={label} error={error}>
      <RadioGroup value={value} onValueChange={(next) => setValue(field, next, { shouldDirty: true, shouldValidate: true })} aria-invalid={Boolean(error)} className="grid gap-2 sm:grid-cols-2">
        {fieldOptions.map((option) => (
          <label key={option} className={cn("flex min-h-11 cursor-pointer items-center gap-3 rounded-md border bg-white px-3 py-2 text-sm transition-colors hover:border-zinc-400 hover:bg-white", value === option && "border-primary bg-white shadow-[0_0_0_1px_rgb(24_24_27)_inset]")}>
            <RadioGroupItem value={option} />
            <span>{option}</span>
          </label>
        ))}
      </RadioGroup>
    </FieldShell>
  );
}

function CheckboxField({ label, field, values, setValue, options: fieldOptions, error }: { label: string; field: FieldName; values: string[]; setValue: ReturnType<typeof useForm<IntakeAnswers>>["setValue"]; options: string[]; error?: string }) {
  function toggle(option: string, checked: boolean) {
    let next = checked ? Array.from(new Set([...values, option])) : values.filter((item) => item !== option);
    if (option === "None" && checked) next = ["None"];
    if (option !== "None") next = next.filter((item) => item !== "None");
    setValue(field, next, { shouldDirty: true, shouldValidate: true });
  }

  return (
    <FieldShell label={label} error={error}>
      <div className="grid gap-2 sm:grid-cols-2" aria-invalid={Boolean(error)}>
        {fieldOptions.map((option) => {
          const checked = values.includes(option);
          return (
            <label key={option} className={cn("flex min-h-11 cursor-pointer items-center gap-3 rounded-md border bg-white px-3 py-2 text-sm transition-colors hover:border-zinc-400 hover:bg-white", checked && "border-primary bg-white shadow-[0_0_0_1px_rgb(24_24_27)_inset]")}>
              <Checkbox checked={checked} onCheckedChange={(next) => toggle(option, Boolean(next))} />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
    </FieldShell>
  );
}

function pickValues(values: IntakeAnswers, fields: Array<keyof IntakeAnswers>) {
  return fields.reduce(
    (acc, field) => {
      acc[field] = values[field] as never;
      return acc;
    },
    {} as Partial<IntakeAnswers>,
  );
}

function applyZodErrors(error: z.ZodError, setError: ReturnType<typeof useForm<IntakeAnswers>>["setError"]) {
  for (const issue of error.issues) {
    const field = issue.path[0] as keyof IntakeAnswers | undefined;
    if (field) setError(field, { type: "manual", message: issue.message });
  }
}
