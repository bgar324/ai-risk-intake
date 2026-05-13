import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductPreview } from "@/components/landing/product-preview";

export function Hero() {
  return (
    <section className="border-b product-surface">
      <div className="container-shell grid min-h-[560px] items-center gap-10 py-12 lg:grid-cols-[0.9fr_1fr] lg:py-16">
        <div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            Turn AI product risk into a cleaner insurance conversation.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            Answer a few structured questions about your AI product, data, customers, and deployment model. Get a plain-English risk summary you can use to prepare for an insurance quote conversation.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/intake">
                Start intake <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/methodology">View methodology</Link>
            </Button>
          </div>
          <p className="mt-4 max-w-xl text-xs leading-5 text-muted-foreground">
            Identifies discussion areas. Does not provide insurance, legal, or financial advice.
          </p>
        </div>
        <ProductPreview />
      </div>
    </section>
  );
}
