import type { ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";

type PillProps = {
  children: ReactNode;
  /**
   * Reserved for future filled variant. Currently the wireframe renders both
   * states with a transparent background; the prop is preserved so screens
   * can pass it without TypeScript errors.
   */
  hollow?: boolean;
  className?: string;
};

/** Small uppercase chip. Used for tags like `LIVE`, `DRAFT`, `payments`. */
export function Pill({ children, className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-block border border-ink bg-transparent px-[7px] pt-px pb-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}
