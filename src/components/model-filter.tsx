"use client";

import { useMemo, useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LEADERBOARD } from "@/data";
import { cn } from "@/lib/utils";

type Props = {
  selectedIds: Set<string>;
  onChange: (ids: Set<string>) => void;
};

export function ModelFilter({ selectedIds, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const families = useMemo(() => {
    const map = new Map<string, typeof LEADERBOARD>();
    for (const entry of LEADERBOARD) {
      const list = map.get(entry.familyLabel) ?? [];
      list.push(entry);
      map.set(entry.familyLabel, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, []);

  const toggle = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(next);
  };

  const selectAll = () => onChange(new Set(LEADERBOARD.map((e) => e.id)));
  const clearAll = () => onChange(new Set());

  const label =
    selectedIds.size === LEADERBOARD.length
      ? "All models (63)"
      : `${selectedIds.size} of ${LEADERBOARD.length} models`;

  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className="inline-flex h-9 w-full max-w-md items-center justify-between rounded-lg border border-border bg-background px-3 text-sm font-normal hover:bg-muted"
          role="combobox"
          aria-expanded={open}
        >
          {label}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-[min(100vw-2rem,28rem)] p-0" align="center">
          <Command>
            <CommandInput placeholder="Search models…" />
            <CommandList>
              <CommandEmpty>No model found.</CommandEmpty>
              {families.map(([family, entries]) => (
                <CommandGroup key={family} heading={family}>
                  {entries.map((entry) => (
                    <CommandItem
                      key={entry.id}
                      value={entry.name}
                      onSelect={() => toggle(entry.id)}
                      className="gap-2"
                    >
                      <Checkbox
                        checked={selectedIds.has(entry.id)}
                        className="pointer-events-none"
                      />
                      <span className="flex-1 truncate">{entry.name}</span>
                      <span className="text-muted-foreground tabular-nums">
                        {entry.score.toFixed(1)}%
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="flex gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={selectAll}>
          Select all
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={clearAll}>
          Hide all
        </Button>
      </div>
    </div>
  );
}

export function ModelFilterChips({
  selectedIds,
  onChange,
}: Props) {
  if (selectedIds.size === LEADERBOARD.length) return null;
  return (
    <p className="text-center text-xs text-muted-foreground">
      Chart and table filtered to {selectedIds.size} models.{" "}
      <button
        type="button"
        className={cn("underline-offset-2 hover:underline")}
        onClick={() => onChange(new Set(LEADERBOARD.map((e) => e.id)))}
      >
        Reset to all
      </button>
    </p>
  );
}
