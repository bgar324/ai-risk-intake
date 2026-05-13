"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Copy, FileText } from "lucide-react";
import { toast } from "sonner";
import { CoverageAreas } from "@/components/results/coverage-areas";
import { InternalSummary } from "@/components/results/internal-summary";
import { QuestionsToPrepare } from "@/components/results/questions-to-prepare";
import { RiskBreakdown } from "@/components/results/risk-breakdown";
import { PrintSummaryButton, RestartIntakeButton } from "@/components/results/results-actions";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateRiskResults } from "@/lib/risk-rules";
import { hasCompleteIntake, loadIntakeAnswers } from "@/lib/storage";
import type { RiskResults } from "@/lib/types";

export default function ResultsPage() {
  const [state, setState] = useState<{ loaded: boolean; results: RiskResults | null }>({
    loaded: false,
    results: null,
  });

  useEffect(() => {
    queueMicrotask(() => {
      const answers = loadIntakeAnswers();
      setState({
        loaded: true,
        results: hasCompleteIntake(answers) ? generateRiskResults(answers) : null,
      });
    });
  }, []);

  const { loaded, results } = state;
  const internalJson = useMemo(() => (results ? JSON.stringify(results.internalSummary, null, 2) : ""), [results]);

  async function copyFounderSummary() {
    if (!results) return;
    await navigator.clipboard.writeText(results.founderSummary);
    toast.success("Founder summary copied");
  }

  async function copyInternalJson() {
    if (!internalJson) return;
    await navigator.clipboard.writeText(internalJson);
    toast.success("Internal JSON copied");
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-9rem)] product-surface print-surface">
        <div className="container-shell py-8">
          {!loaded ? null : !results ? (
            <Card className="mx-auto max-w-2xl bg-white">
              <CardContent className="p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border bg-zinc-50">
                  <FileText className="h-5 w-5" />
                </div>
                <h1 className="mt-5 text-2xl font-semibold">No completed intake found</h1>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Complete the intake flow first so the prototype can generate risk signals from your answers.
                </p>
                <Button asChild className="mt-6">
                  <Link href="/intake">Start intake</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="overflow-hidden rounded-lg border border-zinc-300 bg-white">
                <div className="flex flex-col gap-5 border-b bg-zinc-950 p-5 text-white lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-[11px] font-medium uppercase tracking-normal text-zinc-400">Results packet</p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight">Your AI risk intake summary</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">
                    Based on your answers, these are the main areas to discuss with an insurance provider.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 no-print">
                  <PrintSummaryButton className="border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800" />
                  <Button type="button" variant="outline" className="border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800" onClick={copyFounderSummary}>
                    <Copy className="h-4 w-4" /> Copy founder summary
                  </Button>
                  <Button type="button" variant="outline" className="border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800" onClick={copyInternalJson}>
                    <Copy className="h-4 w-4" /> Copy internal JSON
                  </Button>
                </div>
              </div>

              <div className="grid divide-y md:grid-cols-4 md:divide-x md:divide-y-0">
                <SummaryMetric label="Top risk area" value={results.topSignals[0]?.category ?? "No strong signal"} />
                <SummaryMetric label="Coverage areas" value={`${results.coverageConversationAreas.length} topics`} />
                <SummaryMetric label="Buyer urgency" value={results.buyerUrgency} />
                <SummaryMetric label="Data sensitivity" value={results.dataSensitivity} />
              </div>
              </div>

              <Card className="border-zinc-300 bg-white shadow-none">
                <CardContent className="p-0">
                  <div className="border-b px-5 py-3">
                    <p className="metric-label">Founder-facing summary</p>
                  </div>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="p-5">
                      <div className="mb-4 flex flex-wrap gap-2">
                        {results.topSignals.map((signal) => (
                          <Badge key={signal.category} variant="outline">
                            {signal.category}
                          </Badge>
                        ))}
                      </div>
                      <p className="max-w-4xl text-sm leading-7 text-zinc-700">{results.founderSummary}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <p className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-xs leading-5 text-muted-foreground">
                Independent prototype. Outputs are discussion prompts based on user-provided answers and do not provide insurance, legal, financial, underwriting, or coverage advice.
              </p>

              <Tabs defaultValue="risk" className="space-y-5">
                <TabsList className="grid h-auto w-full grid-cols-2 lg:w-auto lg:grid-cols-4">
                  <TabsTrigger value="risk">Risk areas</TabsTrigger>
                  <TabsTrigger value="coverage">Conversation areas</TabsTrigger>
                  <TabsTrigger value="questions">Questions</TabsTrigger>
                  <TabsTrigger value="handoff">Internal summary</TabsTrigger>
                </TabsList>
                <TabsContent value="risk">
                  <RiskBreakdown signals={results.signals} />
                </TabsContent>
                <TabsContent value="coverage">
                  <CoverageAreas areas={results.coverageConversationAreas} />
                </TabsContent>
                <TabsContent value="questions">
                  <QuestionsToPrepare questions={results.questionsToAsk} />
                </TabsContent>
                <TabsContent value="handoff">
                  <InternalSummary summary={results.internalSummary} />
                </TabsContent>
              </Tabs>

              <Separator />
              <div className="flex flex-col gap-3 sm:flex-row no-print">
                <Button asChild variant="outline">
                  <Link href="/intake">
                    <ArrowLeft className="h-4 w-4" /> Edit answers
                  </Link>
                </Button>
                <RestartIntakeButton />
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-4">
      <p className="metric-label">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-5 text-zinc-950">{value}</p>
    </div>
  );
}
