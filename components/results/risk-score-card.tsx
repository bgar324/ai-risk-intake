import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { bandBadgeVariant } from "@/lib/risk-copy";
import type { RiskSignal } from "@/lib/types";

export function RiskScoreCard({ signal, rank }: { signal: RiskSignal; rank: number }) {
  return (
    <article className="bg-white p-5">
      <div className="grid gap-5 lg:grid-cols-[0.86fr_1.14fr]">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="metric-label">Risk area {rank}</p>
              <h3 className="mt-2 text-base font-semibold">{signal.category}</h3>
            </div>
            <Badge variant={bandBadgeVariant(signal.band)}>{signal.band}</Badge>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <Progress value={signal.score} className="h-1.5" />
            <span className="w-9 text-right text-sm font-semibold tabular-nums">{signal.score}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {signal.conversationAreas.map((area) => (
              <Badge key={area} variant="outline">
                {area}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
          <p className="text-sm font-medium">Why this was flagged</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {(signal.drivers.length ? signal.drivers : ["Your answers provide a lower but still trackable signal for this category."]).map((driver) => (
              <li key={driver} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />{driver}</li>
            ))}
          </ul>
          </div>
          <div>
          <p className="text-sm font-medium">What an insurer may ask next</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {signal.questions.map((question) => (
              <li key={question} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />{question}</li>
            ))}
          </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
