import type { ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";

type StatusRowProps = {
  ok?: boolean;
  label: ReactNode;
};

/** Pass/fail line used in the register screen's review block. */
export function StatusRow({ ok, label }: StatusRowProps) {
  return (
    <div className="flex items-center gap-2.5 border-b border-dotted border-hair py-1.5 font-mono text-xs">
      <span
        className={cn("w-3.5 font-bold", ok ? "text-ink" : "text-faint")}
      >
        {ok ? "✓" : "○"}
      </span>
      <span className={cn("flex-1", ok ? "text-ink" : "text-faint")}>
        {label}
      </span>
    </div>
  );
}
