const ENTRIES = [
  {
    date: "Sep 10, 2026",
    items: [
      {
        kind: "Tasks",
        title: "CursorBench 4.0",
        body:
          "Introduced new long-horizon problems focused on edit, refactor, investigation, intent understanding, managing jobs, and design adherence.",
      },
      {
        kind: "Reporting",
        body: "Updated Sonnet 5 results to account for adjusted pricing.",
      },
      {
        kind: "Reporting",
        body: "Updated GPT-5.6 Terra and Luna results to account for adjusted pricing.",
      },
      {
        kind: "Reporting",
        body:
          "Updated GPT-5.6 Sol, Terra, and Luna results to account for cache write costs.",
      },
    ],
  },
  {
    date: "Aug 11, 2026",
    items: [
      {
        kind: "Tasks",
        title: "CursorBench 3.2",
        body: "Introduced instruction following and advanced tool use problems.",
      },
    ],
  },
  {
    date: "Jul 30, 2026",
    items: [
      {
        kind: "Tasks",
        title: "CursorBench 3.1",
        body:
          "Introduced problems focused on codebase understanding, bugfinding, planning, and code review. Improved grading criteria for some edit tasks.",
      },
    ],
  },
  {
    date: "Jul 9, 2026",
    items: [
      {
        kind: "Tasks",
        title: "CursorBench 3.0",
        body: "Initial set of tasks focused on edit, refactor, and bugfix problems.",
      },
    ],
  },
];

export function ChangelogSection() {
  return (
    <section className="mx-auto mt-16 max-w-2xl border-t border-border pt-10">
      <h2 className="mb-8 text-center text-lg font-medium">Benchmark history</h2>
      <ol className="space-y-10">
        {ENTRIES.map((block) => (
          <li key={block.date}>
            <h3 className="text-sm font-medium text-muted-foreground">{block.date}</h3>
            <ul className="mt-3 space-y-4">
              {block.items.map((item, i) => (
                <li key={i} className="text-sm">
                  <span className="text-muted-foreground">{item.kind}</span>
                  {item.title && (
                    <p className="mt-0.5 font-medium">{item.title}</p>
                  )}
                  <p className="mt-1 text-muted-foreground">{item.body}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
