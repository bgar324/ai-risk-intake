export function SiteFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="container-shell flex flex-col gap-2 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>AI Risk Intake</p>
        <p className="max-w-3xl md:text-right">
          Independent prototype. Not affiliated with Corgi. Does not provide insurance, legal, financial, underwriting, or coverage advice.
        </p>
      </div>
    </footer>
  );
}
