import { AlertCircle, CheckCircle2, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const previewRows = [
  { label: "Model output liability", value: 78, band: "High signal" },
  { label: "Data privacy and security", value: 66, band: "Strong signal" },
  { label: "Enterprise requirements", value: 52, band: "Strong signal" },
];

export function ProductPreview() {
  return (
    <Card className="relative overflow-hidden border-zinc-300 bg-white shadow-[0_20px_60px_-42px_rgb(24_24_27/0.65)]">
      <CardHeader className="border-b bg-zinc-950 p-4 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-normal text-zinc-400">Founder packet</p>
            <CardTitle className="text-base">Risk intake summary</CardTitle>
          </div>
          <Badge className="border-zinc-700 bg-zinc-900 text-zinc-200">Draft</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-0 p-0">
        <div className="grid grid-cols-3 divide-x border-b text-sm">
          <div className="p-4">
            <p className="metric-label">Top signal</p>
            <p className="mt-1.5 text-sm font-medium">Output liability</p>
          </div>
          <div className="p-4">
            <p className="metric-label">Urgency</p>
            <p className="mt-1.5 text-sm font-medium">Near term</p>
          </div>
          <div className="p-4">
            <p className="metric-label">Data</p>
            <p className="mt-1.5 text-sm font-medium">Elevated</p>
          </div>
        </div>
        <div className="space-y-4 p-5">
          {previewRows.map((row) => (
            <div key={row.label} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">{row.label}</span>
                <span className="text-xs text-muted-foreground">{row.band}</span>
              </div>
              <Progress value={row.value} />
            </div>
          ))}
        </div>
        <Separator />
        <div className="grid gap-0 divide-y">
          <div className="flex items-center gap-3 px-5 py-3">
            <ClipboardList className="h-4 w-4 text-zinc-500" />
            <span className="text-sm font-medium">Provider follow-up queue</span>
          </div>
          <ul className="divide-y text-sm text-muted-foreground">
            <li className="flex gap-3 px-5 py-3"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />How are customer-facing outputs reviewed?</li>
            <li className="flex gap-3 px-5 py-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />What customer data is stored and retained?</li>
            <li className="flex gap-3 px-5 py-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />Do contracts require specific coverage limits?</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
