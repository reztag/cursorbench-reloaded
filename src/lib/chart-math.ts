import type { LeaderboardEntry, XMetric } from "@/lib/types";

export const CHART_WIDTH = 2400;
export const CHART_HEIGHT = 1500;
export const CHART_PADDING = { top: 120, right: 80, bottom: 200, left: 96 };

const EFFORT_ORDER = ["max", "xhigh", "high", "medium", "low", "minimal"] as const;

export function metricValue(entry: LeaderboardEntry, metric: XMetric): number {
  if (metric === "cost") return entry.cost;
  if (metric === "tokens") return entry.tokens;
  return entry.steps;
}

function niceMax(value: number, metric: XMetric): number {
  if (value <= 0) return 1;
  if (metric === "cost") {
    const step = value <= 3 ? 0.5 : value <= 12 ? 3 : 6;
    return Math.ceil(value / step) * step;
  }
  if (metric === "tokens") {
    const step = value <= 50_000 ? 10_000 : value <= 150_000 ? 50_000 : 100_000;
    return Math.ceil(value / step) * step;
  }
  const step = value <= 50 ? 10 : value <= 150 ? 25 : 50;
  return Math.ceil(value / step) * step;
}

export function buildXAxis(entries: LeaderboardEntry[], metric: XMetric) {
  const maxVal = Math.max(...entries.map((e) => metricValue(e, metric)), 0.01);
  const max = niceMax(maxVal, metric);
  const tickCount = 6;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => (max / tickCount) * i);
  return { max, ticks };
}

export function buildScoreAxis(entries: LeaderboardEntry[]) {
  const minScore = Math.min(...entries.map((e) => e.score), 20);
  const maxScore = Math.max(...entries.map((e) => e.score), 60);
  const min = Math.floor(minScore / 5) * 5;
  const max = Math.ceil(maxScore / 5) * 5;
  const ticks: number[] = [];
  for (let t = min; t <= max; t += 5) ticks.push(t);
  return { min, max, ticks };
}

export function chartX(value: number, max: number): number {
  const plotWidth = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
  return CHART_PADDING.left + (value / max) * plotWidth;
}

export function chartY(score: number, axis: { min: number; max: number }): number {
  const plotHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;
  const t = (score - axis.min) / (axis.max - axis.min);
  return CHART_PADDING.top + plotHeight * (1 - t);
}

export function effortRank(effort: string | null): number {
  if (!effort) return EFFORT_ORDER.length;
  const idx = EFFORT_ORDER.indexOf(effort as (typeof EFFORT_ORDER)[number]);
  return idx === -1 ? EFFORT_ORDER.length : idx;
}

export function seriesByModelKey(entries: LeaderboardEntry[]): Map<string, LeaderboardEntry[]> {
  const map = new Map<string, LeaderboardEntry[]>();
  for (const entry of entries) {
    const list = map.get(entry.modelKey) ?? [];
    list.push(entry);
    map.set(entry.modelKey, list);
  }
  for (const list of map.values()) {
    list.sort((a, b) => effortRank(a.effort) - effortRank(b.effort));
  }
  return map;
}

export const METRIC_META: Record<
  XMetric,
  {
    label: string;
    axisLabel: string;
    formatTick: (n: number) => string;
    formatValue: (n: number) => string;
  }
> = {
  cost: {
    label: "Cost",
    axisLabel: "Average cost per task",
    formatTick: (n) => `$${n % 1 === 0 ? n : n.toFixed(1)}`,
    formatValue: (n) => `$${n.toFixed(2)}`,
  },
  tokens: {
    label: "Tokens",
    axisLabel: "Average output tokens per task",
    formatTick: (n) => {
      if (n === 0) return "0";
      if (n >= 1_000_000) return `${n / 1_000_000}M`;
      if (n >= 1000) return `${n / 1000}k`;
      return `${n}`;
    },
    formatValue: (n) => Math.round(n).toLocaleString("en-US"),
  },
  steps: {
    label: "Steps",
    axisLabel: "Average steps per task",
    formatTick: (n) => `${Math.round(n)}`,
    formatValue: (n) => `${Math.round(n)}`,
  },
};
