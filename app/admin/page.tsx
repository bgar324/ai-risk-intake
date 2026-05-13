"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ClipboardList, Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { bandBadgeVariant } from "@/lib/risk-copy";
import { generateRiskResults } from "@/lib/risk-rules";
import { loadCompletedSubmissions, saveIntakeAnswers, type StoredSubmission } from "@/lib/storage";

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<StoredSubmission[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      setSubmissions(loadCompletedSubmissions());
    });
  }, []);

  const rows = useMemo(
    () =>
      submissions.map((submission) => ({
        submission,
        results: generateRiskResults(submission.answers),
      })),
    [submissions],
  );

  async function copyLead(submission: StoredSubmission) {
    const results = generateRiskResults(submission.answers);
    await navigator.clipboard.writeText(JSON.stringify(results.internalSummary, null, 2));
    toast.success("Lead handoff copied");
  }

  function reopenIntake(submission: StoredSubmission) {
    saveIntakeAnswers(submission.answers);
    toast.success("Intake restored for editing");
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-9rem)] product-surface">
        <section className="container-shell py-8">
          <div className="flex flex-col gap-5 border-b pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="metric-label">Local admin</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight">Completed intake history</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                A local-only lead list for demo handoff. Completed intakes are stored in this browser and are not sent to a backend.
              </p>
            </div>
            <Button asChild>
              <Link href="/intake">
                New intake <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {rows.length === 0 ? (
            <Card className="mx-auto mt-10 max-w-2xl border-zinc-300 bg-white shadow-none">
              <CardContent className="p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border bg-zinc-50">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-xl font-semibold">No completed intakes yet</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Generate results from the intake flow to add a lead-style record here.
                </p>
                <Button asChild className="mt-6">
                  <Link href="/intake">Start intake</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="mt-6 overflow-hidden rounded-lg border border-zinc-300 bg-white">
              <div className="grid grid-cols-12 gap-4 border-b bg-zinc-50 px-5 py-3 text-xs font-medium text-muted-foreground">
                <div className="col-span-5">Company</div>
                <div className="col-span-2 hidden md:block">Urgency</div>
                <div className="col-span-3 hidden lg:block">Top signal</div>
                <div className="col-span-7 md:col-span-5 lg:col-span-2">Actions</div>
              </div>
              <div className="divide-y">
                {rows.map(({ submission, results }) => {
                  const topSignal = results.topSignals[0];
                  return (
                    <article key={submission.id} className="grid grid-cols-12 gap-4 px-5 py-4">
                      <div className="col-span-12 min-w-0 md:col-span-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="truncate text-sm font-semibold">{submission.answers.companyName}</h2>
                          <Badge variant="outline">{submission.answers.companyStage}</Badge>
                          <Badge variant="outline">{submission.answers.primaryCustomer}</Badge>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {new Intl.DateTimeFormat(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          }).format(new Date(submission.createdAt))}
                        </p>
                        {submission.answers.internalNotes ? (
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-700">{submission.answers.internalNotes}</p>
                        ) : null}
                      </div>
                      <div className="col-span-6 hidden items-start md:col-span-2 md:flex">
                        <Badge variant={results.buyerUrgency === "Immediate" ? "red" : results.buyerUrgency === "Near term" ? "amber" : "gray"}>
                          {results.buyerUrgency}
                        </Badge>
                      </div>
                      <div className="col-span-3 hidden lg:block">
                        <p className="text-sm font-medium">{topSignal?.category ?? "No signal"}</p>
                        {topSignal ? (
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant={bandBadgeVariant(topSignal.band)}>{topSignal.band}</Badge>
                            <span className="text-xs font-semibold tabular-nums text-muted-foreground">{topSignal.score}</span>
                          </div>
                        ) : null}
                      </div>
                      <div className="col-span-12 flex flex-wrap gap-2 md:col-span-5 lg:col-span-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => copyLead(submission)}>
                          <Copy className="h-4 w-4" /> Copy
                        </Button>
                        <Button asChild size="sm" variant="ghost" onClick={() => reopenIntake(submission)}>
                          <Link href="/results">
                            <RotateCcw className="h-4 w-4" /> Open
                          </Link>
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          <Separator className="my-6" />
          <p className="max-w-3xl text-xs leading-5 text-muted-foreground">
            Prototype only. This admin view uses localStorage to demonstrate handoff workflow shape; it is not a production lead database.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
