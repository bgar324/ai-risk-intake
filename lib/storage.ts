"use client";

import { defaultIntakeValues, intakeSchema, type IntakeAnswers } from "@/lib/intake-schema";

const STORAGE_KEY = "ai-risk-intake.answers.v1";

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

export function hasCompleteIntake(answers: IntakeAnswers | null): answers is IntakeAnswers {
  if (!answers) return false;
  return intakeSchema.safeParse(answers).success;
}
