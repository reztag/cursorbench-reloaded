import raw from "@/data/leaderboard.json";
import type { LeaderboardEntry } from "@/lib/types";

export const LEADERBOARD: LeaderboardEntry[] = raw as LeaderboardEntry[];

export const ALL_MODEL_IDS = LEADERBOARD.map((e) => e.id);

export const FAMILY_GROUPS = Array.from(
  new Map(LEADERBOARD.map((e) => [e.familyLabel, e.familyLabel])).values(),
).sort();
