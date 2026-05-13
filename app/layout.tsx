import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Risk Intake | Startup Insurance Prototype",
  description:
    "A structured intake prototype that helps AI startups translate product, data, and deployment context into insurance-relevant risk signals for a cleaner quote conversation.",
  openGraph: {
    title: "AI Risk Intake",
    description: "Turn AI startup context into structured risk signals, founder-facing summaries, and internal handoff notes.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI Risk Intake",
    description: "Turn AI startup context into structured risk signals, founder-facing summaries, and internal handoff notes.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
