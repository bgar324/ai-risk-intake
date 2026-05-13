import { RiskScoreCard } from "@/components/results/risk-score-card";
import type { RiskSignal } from "@/lib/types";

export function RiskBreakdown({ signals }: { signals: RiskSignal[] }) {
  return (
    <section className="overflow-hidden rounded-lg border border-zinc-300 bg-white">
      <div className="border-b bg-zinc-50 px-5 py-4">
        <h2 className="text-base font-semibold tracking-tight">Risk areas ranked by signal</h2>
        <p className="mt-1 text-sm text-muted-foreground">Scores show signal strength from the intake answers, not actual insurability or price.</p>
      </div>
      <div className="divide-y">
        {signals.map((signal, index) => (
          <RiskScoreCard key={signal.category} signal={signal} rank={index + 1} />
        ))}
      </div>
    </section>
  );
}
