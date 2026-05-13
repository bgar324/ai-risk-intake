"use client";

import { defaultIntakeValues, intakeSchema, type IntakeAnswers } from "@/lib/intake-schema";

const STORAGE_KEY = "ai-risk-intake.answers.v1";
const SUBMISSIONS_KEY = "ai-risk-intake.submissions.v1";

export type StoredSubmission = {
  id: string;
  createdAt: string;
  answers: IntakeAnswers;
};

export function loadIntakeAnswers(): IntakeAnswers | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<IntakeAnswers>;
    return { ...defaultIntakeValues, ...parsed };
  } catch {
    return null;
  }
}

export function saveIntakeAnswers(answers: IntakeAnswers) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
}

export function clearIntakeAnswers() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function loadCompletedSubmissions(): StoredSubmission[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(SUBMISSIONS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as StoredSubmission[];
    return parsed
      .map((submission) => ({
        ...submission,
        answers: { ...defaultIntakeValues, ...submission.answers },
      }))
      .filter((submission) => intakeSchema.safeParse(submission.answers).success)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export function saveCompletedSubmission(answers: IntakeAnswers) {
  if (typeof window === "undefined") return;
  const submissions = loadCompletedSubmissions();
  const createdAt = new Date().toISOString();
  const id = `${createdAt}-${answers.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "intake"}`;
  const next = [{ id, createdAt, answers }, ...submissions].slice(0, 25);
  window.localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(next));
}

export function hasCompleteIntake(answers: IntakeAnswers | null): answers is IntakeAnswers {
  if (!answers) return false;
  return intakeSchema.safeParse(answers).success;
}
