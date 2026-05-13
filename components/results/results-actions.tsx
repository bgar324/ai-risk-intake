"use client";

import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearIntakeAnswers } from "@/lib/storage";

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
