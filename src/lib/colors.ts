import type { LeaderboardEntry } from "@/lib/types";

const SERIES_RGB: Record<string, string> = {
  fable: "var(--cb-series-fable)",
  opus: "14 165 233",
  grok: "var(--cb-series-grok)",
  sol: "var(--cb-series-sol)",
  terra: "var(--cb-series-terra)",
  luna: "100 116 139",
  sonnet: "var(--cb-series-sonnet)",
  gemini: "var(--cb-series-gemini)",
  muse: "var(--cb-series-muse)",
  glm: "168 85 247",
  composer: "244 78 0",
};

function channels(colorFamily: string): string {
  return SERIES_RGB[colorFamily] ?? "120 120 120";
}

export function seriesColor(
  entry: LeaderboardEntry,
  alpha = 1,
  muted = false,
): string {
  const ch = channels(entry.colorFamily);
  const a = muted ? 0.45 : alpha;
  if (ch.includes("var(")) {
    return `rgb(${ch} / ${a})`;
  }
  return `rgb(${ch} / ${a})`;
}

export function pointFill(entry: LeaderboardEntry, hovered: boolean): string {
  if (hovered) {
    return seriesColor(entry, 1, false);
  }
  if (entry.isDefaultEffort) {
    return seriesColor(entry, 1, false);
  }
  return seriesColor(entry, 0.45, true);
}
