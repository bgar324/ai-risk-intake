import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-9rem)] product-surface">
        <section className="container-shell py-16">
          <Card className="mx-auto max-w-xl border-zinc-300 bg-white shadow-none">
            <CardContent className="p-8 text-center">
              <p className="metric-label">404</p>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight">Page not found</h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                This prototype route does not exist. Start a new intake or return to the landing page.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/intake">
                    Start intake <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">Back home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
