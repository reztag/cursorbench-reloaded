"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  METRIC_META,
  buildScoreAxis,
  buildXAxis,
  chartX,
  chartY,
  metricValue,
  seriesByModelKey,
  CHART_HEIGHT,
  CHART_WIDTH,
  CHART_PADDING,
} from "@/lib/chart-math";
import type { XMetric } from "@/lib/types";
import { pointFill, seriesColor } from "@/lib/colors";
import type { LeaderboardEntry } from "@/lib/types";

const CHART_STYLES = `
  .cursorbench-chart {
    --cb-bg: #ffffff;
    --cb-axis: rgba(0, 0, 0, 0.6);
    --cb-grid: rgba(0, 0, 0, 0.12);
    --cb-label-muted: rgba(0, 0, 0, 0.42);
    --cb-label-halo: #ffffff;
    --cb-point-stroke: #ffffff;
    --cb-series-fable: 212 138 0;
    --cb-series-sol: 220 38 38;
    --cb-series-terra: 120 66 30;
    --cb-series-sonnet: 22 163 74;
    --cb-series-gemini: 79 70 229;
    --cb-series-muse: 8 102 255;
    --cb-series-grok: 0 0 0;
    --cb-deemphasis-scale: 1;
  }
  .dark .cursorbench-chart {
    --cb-bg: #000000;
    --cb-axis: rgba(255, 255, 255, 0.6);
    --cb-grid: rgba(255, 255, 255, 0.12);
    --cb-label-muted: rgba(255, 255, 255, 0.42);
    --cb-label-halo: #000000;
    --cb-point-stroke: #000000;
    --cb-series-fable: 251 191 36;
    --cb-series-sol: 255 82 82;
    --cb-series-terra: 201 124 60;
    --cb-series-sonnet: 74 222 128;
    --cb-series-gemini: 110 92 255;
    --cb-series-muse: 30 136 255;
    --cb-series-grok: 255 255 255;
    --cb-deemphasis-scale: 1.55;
  }
  .cursorbench-chart__point { transition: fill 140ms ease; }
  .cursorbench-chart__point-group {
    transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1), opacity 120ms ease-out;
  }
`;

type Props = {
  entries: LeaderboardEntry[];
  metric: XMetric;
  onMetricChange: (m: XMetric) => void;
  showTabs?: boolean;
  className?: string;
};

export function CursorBenchChart({
  entries,
  metric,
  onMetricChange,
  showTabs = true,
  className,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const scoreAxis = useMemo(() => buildScoreAxis(entries), [entries]);
  const xAxis = useMemo(() => buildXAxis(entries, metric), [entries, metric]);
  const seriesMap = useMemo(() => seriesByModelKey(entries), [entries]);
  const meta = METRIC_META[metric];
  const hovered = entries.find((e) => e.id === hoveredId) ?? null;

  const plotBottom = CHART_HEIGHT - CHART_PADDING.bottom;

  return (
    <div className={className}>
      {showTabs && (
        <div
          role="tablist"
          aria-label="Chart x-axis metric"
          className="mb-3 flex justify-center gap-1"
        >
          {(["cost", "tokens", "steps"] as XMetric[]).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={metric === m}
              onClick={() => onMetricChange(m)}
              className={cn(
                "rounded-full px-2 py-0.5 text-xs transition-colors",
                metric === m
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {METRIC_META[m].label}
            </button>
          ))}
        </div>
      )}

      <figure
        className="cursorbench-chart relative mx-auto max-w-5xl overflow-hidden border border-border bg-[var(--cb-bg)] p-4 md:p-6"
        aria-label={`CursorBench 4.0 score by ${meta.axisLabel.toLowerCase()}`}
      >
        <style>{CHART_STYLES}</style>
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="w-full"
          role="img"
          aria-label={`Score vs ${meta.axisLabel}`}
        >
          {/* Y grid */}
          {scoreAxis.ticks.map((tick) => {
            const y = chartY(tick, scoreAxis);
            return (
              <g key={`y-${tick}`}>
                <line
                  x1={CHART_PADDING.left}
                  x2={CHART_WIDTH - CHART_PADDING.right}
                  y1={y}
                  y2={y}
                  stroke="var(--cb-grid)"
                  strokeWidth={1}
                />
                <text
                  x={CHART_PADDING.left - 12}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={22}
                  fill="var(--cb-axis)"
                >
                  {tick}%
                </text>
              </g>
            );
          })}

          {/* X grid */}
          {xAxis.ticks.map((tick) => {
            const x = chartX(tick, xAxis.max);
            return (
              <g key={`x-${tick}`}>
                <line
                  x1={x}
                  x2={x}
                  y1={CHART_PADDING.top}
                  y2={plotBottom}
                  stroke="var(--cb-grid)"
                  strokeWidth={1}
                />
                <text
                  x={x}
                  y={plotBottom + 36}
                  textAnchor="middle"
                  fontSize={22}
                  fill="var(--cb-axis)"
                >
                  {meta.formatTick(tick)}
                </text>
              </g>
            );
          })}

          <text
            x={CHART_WIDTH / 2}
            y={56}
            textAnchor="middle"
            fontSize={28}
            fill="var(--cb-axis)"
          >
            CursorBench 4.0 score
          </text>
          <text
            x={CHART_WIDTH / 2}
            y={plotBottom + 88}
            textAnchor="middle"
            fontSize={24}
            fill="var(--cb-axis)"
          >
            {meta.axisLabel}
          </text>

          {/* Effort curves per model variant */}
          {Array.from(seriesMap.entries()).map(([modelKey, group]) => {
            if (group.length < 2) return null;
            const color = seriesColor(group[0], 0.45, false);
            const d = group
              .map((e) => {
                const x = chartX(metricValue(e, metric), xAxis.max);
                const y = chartY(e.score, scoreAxis);
                return `${x},${y}`;
              })
              .join(" L ");
            return (
              <path
                key={modelKey}
                d={`M ${d}`}
                fill="none"
                stroke={color}
                strokeWidth={3}
                className="cursorbench-chart__series"
              />
            );
          })}

          {/* Points */}
          {entries.map((entry) => {
            const x = chartX(metricValue(entry, metric), xAxis.max);
            const y = chartY(entry.score, scoreAxis);
            const isHovered = hoveredId === entry.id;
            const dimmed = hoveredId !== null && !isHovered;
            return (
              <g
                key={entry.id}
                className="cursorbench-chart__point-group cursor-pointer"
                transform={`translate(${x} ${y})`}
                style={{ opacity: dimmed ? 0.35 : 1 }}
                onPointerEnter={() => setHoveredId(entry.id)}
                onPointerLeave={() => setHoveredId(null)}
                role="button"
                tabIndex={0}
                aria-label={`${entry.name}: ${entry.score.toFixed(1)}%`}
              >
                <circle r={18} fill="transparent" />
                <circle
                  className="cursorbench-chart__point"
                  r={isHovered ? 10 : 7}
                  fill={pointFill(entry, isHovered)}
                  stroke="var(--cb-point-stroke)"
                  strokeWidth={2}
                />
              </g>
            );
          })}

          {/* Hover guides */}
          {hovered && (
            <g aria-hidden="true" pointerEvents="none">
              <line
                x1={chartX(metricValue(hovered, metric), xAxis.max)}
                x2={chartX(metricValue(hovered, metric), xAxis.max)}
                y1={CHART_PADDING.top}
                y2={plotBottom}
                stroke={seriesColor(hovered, 1)}
                strokeWidth={2}
                strokeDasharray="10 10"
              />
              <line
                x1={CHART_PADDING.left}
                x2={CHART_WIDTH - CHART_PADDING.right}
                y1={chartY(hovered.score, scoreAxis)}
                y2={chartY(hovered.score, scoreAxis)}
                stroke={seriesColor(hovered, 1)}
                strokeWidth={2}
                strokeDasharray="10 10"
              />
              <text
                x={CHART_PADDING.left - 12}
                y={chartY(hovered.score, scoreAxis) - 8}
                textAnchor="end"
                fontSize={22}
                fill={seriesColor(hovered, 1)}
                stroke="var(--cb-label-halo)"
                strokeWidth={4}
                paintOrder="stroke fill"
              >
                {hovered.score.toFixed(1)}%
              </text>
              <text
                x={chartX(metricValue(hovered, metric), xAxis.max)}
                y={plotBottom + 64}
                textAnchor="middle"
                fontSize={22}
                fill={seriesColor(hovered, 1)}
                stroke="var(--cb-label-halo)"
                strokeWidth={4}
                paintOrder="stroke fill"
              >
                {meta.formatValue(metricValue(hovered, metric))}
              </text>
            </g>
          )}

          {/* Default-effort family labels when few points */}
          {entries.length <= 18 &&
            entries
              .filter((e) => e.isDefaultEffort)
              .map((entry) => {
                const x = chartX(metricValue(entry, metric), xAxis.max);
                const y = chartY(entry.score, scoreAxis);
                return (
                  <text
                    key={`label-${entry.id}`}
                    x={x}
                    y={y - 18}
                    textAnchor="middle"
                    fontSize={20}
                    fill={seriesColor(entry, 1)}
                    stroke="var(--cb-label-halo)"
                    strokeWidth={4}
                    paintOrder="stroke fill"
                  >
                    {entry.familyLabel}
                  </text>
                );
              })}
        </svg>

        {hovered && (
          <figcaption className="mt-2 text-center text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{hovered.name}</span>
            {" · "}
            {hovered.score.toFixed(1)}% · {meta.formatValue(metricValue(hovered, metric))}{" "}
            per task
          </figcaption>
        )}
      </figure>
    </div>
  );
}
