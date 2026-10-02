import type { LeaderboardEntry } from "@/lib/types";

type Props = {
  entries: LeaderboardEntry[];
};

function formatMoney(n: number) {
  return `$${n.toFixed(2)}`;
}

export function LeaderboardTable({ entries }: Props) {
  return (
    <div className="mx-auto max-w-5xl overflow-x-auto">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground md:text-sm">
            <th className="w-10 py-3 pl-3 md:pl-4" scope="col" />
            <th className="py-3 pr-2" scope="col">Model</th>
            <th className="py-3 pr-2 text-right" scope="col">Score</th>
            <th className="py-3 pr-2 text-right whitespace-nowrap" scope="col">
              <span className="block">Cost</span>
              <span className="font-normal text-muted-foreground">Cost / task</span>
            </th>
            <th className="py-3 pr-2 text-right whitespace-nowrap" scope="col">
              <span className="block">Tokens</span>
              <span className="font-normal text-muted-foreground">Tokens / task</span>
            </th>
            <th className="py-3 pr-2 text-right whitespace-nowrap" scope="col">
              <span className="block">Steps</span>
              <span className="font-normal text-muted-foreground">Steps / task</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr
              key={entry.id}
              className="border-t border-border transition-colors hover:bg-muted/40"
            >
              <td className="py-3 pl-3 text-xs text-muted-foreground tabular-nums md:pl-4 md:text-sm">
                {index + 1}
              </td>
              <td className="py-3 pr-2 text-xs md:text-sm">{entry.name}</td>
              <td className="py-3 pr-2 text-right text-xs tabular-nums md:text-sm">
                {entry.score.toFixed(1)}%
              </td>
              <td className="py-3 pr-2 text-right text-xs tabular-nums whitespace-nowrap md:text-sm">
                {formatMoney(entry.cost)}
              </td>
              <td className="py-3 pr-2 text-right text-xs tabular-nums md:text-sm">
                {entry.tokens.toLocaleString("en-US")}
              </td>
              <td className="py-3 pr-2 text-right text-xs tabular-nums md:text-sm">
                {entry.steps}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
