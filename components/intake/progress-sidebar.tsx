import { Check } from "lucide-react";
import { intakeSteps, type IntakeStepKey } from "@/lib/intake-schema";
import { cn } from "@/lib/utils";

export function ProgressSidebar({
  currentStep,
  completed,
  onSelect,
}: {
  currentStep: number;
  completed: Set<IntakeStepKey>;
  onSelect: (index: number) => void;
}) {
  return (
    <aside className="hidden w-72 shrink-0 lg:block">
      <div className="sticky top-20 overflow-hidden rounded-lg border border-zinc-300 bg-white">
        <div className="border-b bg-zinc-950 px-4 py-3 text-white">
          <p className="text-[11px] font-medium uppercase tracking-normal text-zinc-400">Intake sections</p>
          <p className="mt-1 text-sm font-medium">Qualification packet</p>
        </div>
        <div className="p-2">
        {intakeSteps.map((step, index) => {
          const isActive = currentStep === index;
          const isComplete = completed.has(step.key);
          return (
            <button
              key={step.key}
              type="button"
              onClick={() => onSelect(index)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                isActive ? "bg-zinc-100 text-foreground shadow-[0_0_0_1px_rgb(39_39_42/0.06)_inset]" : "text-muted-foreground hover:bg-zinc-50 hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[11px]",
                  isComplete ? "border-primary bg-primary text-primary-foreground" : "border-zinc-300 bg-white",
                )}
              >
                {isComplete ? <Check className="h-3 w-3" /> : index + 1}
              </span>
              <span className="font-medium">{step.title}</span>
            </button>
          );
        })}
        </div>
      </div>
    </aside>
  );
}
