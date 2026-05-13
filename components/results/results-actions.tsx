"use client";

import { useRouter } from "next/navigation";
import { Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearIntakeAnswers } from "@/lib/storage";
import { cn } from "@/lib/utils";

export function RestartIntakeButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => {
        clearIntakeAnswers();
        router.push("/intake");
      }}
    >
      <RotateCcw className="h-4 w-4" /> Restart intake
    </Button>
  );
}

export function PrintSummaryButton({ className }: { className?: string }) {
  return (
    <Button type="button" variant="outline" className={cn(className)} onClick={() => window.print()}>
      <Download className="h-4 w-4" /> Export PDF
    </Button>
  );
}
