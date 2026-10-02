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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
    <div className="relative z-20 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="w-full max-w-md justify-between font-normal"
              aria-expanded={open}
            />
          }
        >
          <span className="truncate">{label}</span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </DialogTrigger>
        <DialogContent className="flex max-h-[min(85vh,32rem)] flex-col gap-0 p-0 sm:max-w-lg">
          <DialogHeader className="border-b border-border px-4 py-3 text-left">
            <DialogTitle>Choose models</DialogTitle>
            <DialogDescription>
              Toggle which variants appear on the charts and table.
            </DialogDescription>
          </DialogHeader>
          <Command className="min-h-0 flex-1 rounded-none border-0">
            <CommandInput placeholder="Search models…" className="h-10" />
            <CommandList className="max-h-[min(60vh,24rem)]">
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
          <div className="flex justify-end gap-2 border-t border-border px-4 py-3">
            <Button type="button" variant="ghost" size="sm" onClick={selectAll}>
              Select all
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={clearAll}>
              Hide all
            </Button>
            <Button type="button" size="sm" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
