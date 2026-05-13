import { AlertTriangle, FileText, Handshake, Lock, Scale, ServerCog, Shield, SlidersHorizontal, Users } from "lucide-react";

const props = [
  {
    title: "Founder-friendly",
    body: "Explain insurance risk without burying users in jargon.",
    icon: Users,
  },
  {
    title: "Structured for handoff",
    body: "Convert messy product details into a clean qualification summary.",
    icon: FileText,
  },
  {
    title: "Careful by design",
    body: "Identifies discussion areas, not definitive coverage advice.",
    icon: Scale,
  },
];

const realities = [
  ["Model output risk", AlertTriangle],
  ["Customer data exposure", Lock],
  ["Enterprise contract requirements", Handshake],
  ["Training data and IP questions", FileText],
  ["Regulated use cases", Shield],
  ["Security and privacy expectations", ServerCog],
];

export function ValueProps() {
  return (
    <section className="bg-white py-14">
      <div className="container-shell">
        <div className="grid divide-y rounded-lg border bg-white md:grid-cols-3 md:divide-x md:divide-y-0">
          {props.map((item) => (
            <div key={item.title} className="p-5">
              <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-md border bg-zinc-50">
                <item.icon className="h-4 w-4 text-zinc-700" />
              </div>
              <h2 className="text-sm font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.72fr_1fr]">
          <div>
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md border bg-zinc-50">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Built for AI startup realities</h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              The intake maps product, data, customer, and operating context into the questions a provider is likely to need before quoting or qualifying a lead.
            </p>
          </div>
          <div className="grid overflow-hidden rounded-lg border sm:grid-cols-2">
            {realities.map(([label, Icon]) => (
              <div key={label as string} className="flex items-center gap-3 border-b border-r bg-white p-4 last:border-b-0 even:border-r-0">
                <Icon className="h-4 w-4 text-zinc-700" />
                <span className="text-sm font-medium">{label as string}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
