import { IntakeWizard } from "@/components/intake/intake-wizard";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function IntakePage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-9rem)] product-surface">
        <IntakeWizard />
      </main>
      <SiteFooter />
    </>
  );
}
