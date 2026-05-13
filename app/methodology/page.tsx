import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
              AI Risk Intake uses transparent rules to organize the first insurance conversation. It is deliberately conservative about language and does not provide insurance, legal, or financial advice.
            </p>
          </div>
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
