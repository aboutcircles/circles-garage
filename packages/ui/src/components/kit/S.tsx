import type { ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";

type SProps = {
  k: ReactNode;
  v: ReactNode;
  accent?: boolean;
};

/**
 * Key/value pair used inside <StatusBar>. `k` renders faint; `v` is bold when
 * `accent` is set.
 */
export function S({ k, v, accent }: SProps) {
  return (
    <span>
      <span className="mr-1.5 opacity-[0.55]">{k}</span>
      <span className={cn(accent ? "font-bold" : "font-normal")}>{v}</span>
    </span>
  );
}
