export type XMetric = "cost" | "tokens" | "steps";

export type LeaderboardEntry = {
  id: string;
  modelKey: string;
  familyKey: string;
  familyLabel: string;
  effort: string | null;
  name: string;
  score: number;
  cost: number;
  tokens: number;
  steps: number;
  colorFamily: string;
  isDefaultEffort: boolean;
};
