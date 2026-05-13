import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="container-shell flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-300 bg-zinc-950 text-white shadow-[0_1px_0_rgb(255_255_255/0.18)_inset]">
            <ShieldCheck className="h-3.5 w-3.5" />
          </span>
          AI Risk Intake
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="/methodology" className="hover:text-foreground">
            Methodology
          </Link>
          <Link href="/intake" className="hover:text-foreground">
            Demo
          </Link>
        </nav>
        <Button asChild size="sm" className="h-8">
          <Link href="/intake">
            Start intake <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
