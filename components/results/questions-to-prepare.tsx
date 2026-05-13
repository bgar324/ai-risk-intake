export function QuestionsToPrepare({ questions }: { questions: string[] }) {
  return (
    <section className="overflow-hidden rounded-lg border border-zinc-300 bg-white">
      <div className="border-b bg-zinc-50 px-5 py-4">
        <h2 className="text-base font-semibold">Questions to prepare for</h2>
        <p className="mt-1 text-sm text-muted-foreground">A practical checklist for the next provider conversation.</p>
      </div>
      <ol className="divide-y text-sm text-muted-foreground">
        {questions.map((question, index) => (
          <li key={question} className="flex gap-4 px-5 py-4">
            <span className="flex h-6 w-8 shrink-0 items-center justify-center rounded-md border bg-zinc-50 text-xs font-medium text-foreground tabular-nums">{index + 1}</span>
            <span className="pt-0.5 leading-6">{question}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
