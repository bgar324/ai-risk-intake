import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { categoryMethodology } from "@/lib/risk-copy";

const items = [
  {
    title: "Deterministic rules, not underwriting judgment",
    body: "The prototype maps selected answers to risk signal scores using fixed local rules. It does not evaluate actual insurability, pricing, limits, exclusions, or carrier appetite.",
  },
  {
    title: "Scores represent signal strength",
    body: "A higher score means the answer pattern is more likely to be a useful discussion topic. It is not a prediction of loss, quote outcome, or appropriate coverage.",
  },
  {
    title: "Coverage areas are discussion topics",
    body: "The results phrase coverage as possible conversation areas. A licensed provider would need more information before advising on any insurance product.",
  },
  {
    title: "Built to clean up the first conversation",
    body: "The goal is to help founders prepare plain-English answers and give an internal team a structured handoff for qualification.",
  },
];

export default function MethodologyPage() {
  return (
    <>
      <SiteHeader />
      <main className="product-surface">
        <section className="container-shell py-12">
          <div className="max-w-3xl">
            <p className="metric-label">Methodology</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">How this prototype maps intake answers to risk signals.</h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              AI Risk Intake uses transparent rules to organize the first insurance conversation. It is an independent product prototype and does not provide insurance, legal, financial, underwriting, or coverage advice.
            </p>
          </div>
          <section className="mt-8 max-w-4xl rounded-lg border border-zinc-300 bg-white p-6">
            <p className="metric-label">Why this exists</p>
            <p className="mt-3 text-sm leading-6 text-zinc-700">
              This prototype explores how AI startups could describe complex product and data risks in a structured way before an insurance quote conversation. The goal is to reduce ambiguity for founders and create a cleaner handoff for insurance teams evaluating AI-related risk signals.
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              AI founders tend to describe risk in product language. Insurance teams need structured signals about data, customers, contracts, model behavior, and operational maturity. This tool translates between those two worlds as a product experiment, not as an underwriting system.
            </p>
          </section>
          <Card className="mt-8 max-w-4xl border-zinc-300 bg-white shadow-none">
            <CardContent className="p-6">
              <Accordion type="single" collapsible defaultValue="item-0">
                {items.map((item, index) => (
                  <AccordionItem key={item.title} value={`item-${index}`}>
                    <AccordionTrigger>{item.title}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{item.body}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
          <section className="mt-8 max-w-5xl">
            <div className="border-b pb-4">
              <p className="metric-label">Score drivers</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">What moves each risk signal</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Each category uses the same 0-100 signal scale. The notes below explain what the prototype looks for and where the scoring stops.
              </p>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {Object.entries(categoryMethodology).map(([category, detail]) => (
                <article key={category} className="rounded-lg border border-zinc-300 bg-white p-5 shadow-none">
                  <p className="metric-label">{category}</p>
                  <p className="mt-3 text-sm leading-6 text-zinc-700">{detail.signal}</p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {detail.scoreDrivers.map((driver) => (
                      <li key={driver} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                        {driver}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 border-t pt-3 text-xs leading-5 text-muted-foreground">{detail.limits}</p>
                </article>
              ))}
            </div>
          </section>
          <Button asChild className="mt-8">
            <Link href="/intake">
              Start intake <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
