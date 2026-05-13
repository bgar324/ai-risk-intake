"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { InternalSummary as InternalSummaryType } from "@/lib/types";

export function InternalSummary({ summary }: { summary: InternalSummaryType }) {
  const json = JSON.stringify(summary, null, 2);

  async function copyJson() {
    await navigator.clipboard.writeText(json);
    toast.success("Internal JSON copied");
  }

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-300 bg-white">
      <div className="flex items-center justify-between gap-4 border-b bg-zinc-50 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold">Internal handoff summary</h2>
          <p className="mt-1 text-sm text-muted-foreground">Structured data Corgi could use for qualification or underwriting handoff.</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={copyJson}>
          <Copy className="h-4 w-4" /> Copy JSON
        </Button>
      </div>
      <pre className="max-h-[520px] overflow-auto bg-zinc-950 p-5 text-xs leading-6 text-zinc-100">
        <code>{json}</code>
      </pre>
    </section>
  );
}
