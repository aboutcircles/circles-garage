import type { ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";

type CheckProps = {
  on?: boolean;
  label: ReactNode;
  hint?: ReactNode;
  /**
   * When set, renders an ascii-style inline form: `[x] label · hint`.
   * Default is a square checkbox + label row with dotted bottom border.
   */
  line?: boolean;
};

export function Check({ on, label, hint, line }: CheckProps) {
  if (line) {
    return (
      <div
        className={cn(
          "font-mono text-[13px] leading-[1.9]",
          on ? "text-ink" : "text-faint",
        )}
      >
        [{on ? "x" : " "}] {label}{" "}
        {hint && <span className="ml-1.5 text-faint">· {hint}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 border-b border-dotted border-hair py-2.5 font-mono text-[13px]">
      <span
        className={cn(
          "relative inline-block h-3.5 w-3.5 shrink-0 border-[1.5px] border-ink",
          on ? "bg-ink" : "bg-transparent",
        )}
      >
        {on && (
          <span className="absolute top-[-4px] left-px font-bold text-[13px] text-paper">
            ✓
          </span>
        )}
      </span>
      <span className="flex-1">{label}</span>
      {hint && <span className="text-[11px] text-faint">{hint}</span>}
    </div>
  );
}
