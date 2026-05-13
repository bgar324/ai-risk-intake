import { Badge } from "@/components/ui/badge";
import type { CoverageArea } from "@/lib/types";

export function CoverageAreas({ areas }: { areas: CoverageArea[] }) {
  return (
    <section className="overflow-hidden rounded-lg border border-zinc-300 bg-white">
      <div className="border-b bg-zinc-50 px-5 py-4">
        <h2 className="text-base font-semibold">Coverage conversation areas</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          These are topics to discuss with an insurance provider. They are not coverage recommendations.
        </p>
      </div>
      <div className="grid gap-0 p-5 sm:grid-cols-2 lg:grid-cols-3">
        {areas.length ? (
          areas.map((area) => (
            <div key={area} className="flex items-center justify-between border-b px-0 py-3 sm:odd:pr-5 sm:even:pl-5 lg:px-4">
              <span className="text-sm font-medium">{area}</span>
              <Badge variant="outline">Discuss</Badge>
            </div>
          ))
        ) : (
          <Badge variant="outline">No strong coverage signal yet</Badge>
        )}
      </div>
    </section>
  );
}
