"use client";

import { useMemo, useState } from "react";
import { CursorBenchChart } from "@/components/cursorbench-chart";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { ModelFilter, ModelFilterChips } from "@/components/model-filter";
import { ChangelogSection } from "@/components/changelog-section";
import { LEADERBOARD } from "@/data";

const DEFAULT_SELECTED = new Set(LEADERBOARD.map((e) => e.id));

export function CursorBenchPage() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(DEFAULT_SELECTED);

  const visibleEntries = useMemo(
    () => LEADERBOARD.filter((e) => selectedIds.has(e.id)),
    [selectedIds],
  );

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 md:pt-14">
      <header className="mx-auto mb-10 max-w-lg text-center">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          CursorBench 4.0
        </h1>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          We evaluate agents on ambiguous, multi-file tasks from real Cursor sessions.
          Higher scores are better.
        </p>
        <a
          href="https://cursor.com/blog/cursorbench"
          className="mt-3 inline-flex items-center gap-1 text-sm text-orange-600 hover:opacity-80 dark:text-orange-400"
          target="_blank"
          rel="noopener noreferrer"
        >
          More about CursorBench ↗
        </a>
      </header>

      <section aria-label="Model visibility" className="mb-8 space-y-2">
        <ModelFilter selectedIds={selectedIds} onChange={setSelectedIds} />
        <ModelFilterChips selectedIds={selectedIds} onChange={setSelectedIds} />
      </section>

      <section aria-label="CursorBench 4.0 charts" className="space-y-10">
        <CursorBenchChart
          entries={visibleEntries}
          metric="cost"
          onMetricChange={() => {}}
          showTabs={false}
        />
        <CursorBenchChart
          entries={visibleEntries}
          metric="tokens"
          onMetricChange={() => {}}
          showTabs={false}
        />
        <CursorBenchChart
          entries={visibleEntries}
          metric="steps"
          onMetricChange={() => {}}
          showTabs={false}
        />
      </section>

      <section aria-label="Leaderboard table" className="mt-16">
        <LeaderboardTable entries={visibleEntries} />
      </section>

      <ChangelogSection />

      <p className="mt-12 text-center text-xs text-muted-foreground">
        Data sourced from{" "}
        <a
          href="https://cursor.com/cursorbench"
          className="underline-offset-2 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          cursor.com/cursorbench
        </a>
        . All {LEADERBOARD.length} model variants are plotted; use the filter to compare subsets.
      </p>
    </main>
  );
}
