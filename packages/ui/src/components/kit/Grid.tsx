import type { CSSProperties, ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";

type GridProps = {
  cols?: number | string;
  rows?: string;
  gap?: number;
  fill?: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * Thin wrapper over `display: grid`. `cols` accepts a number (expanded to
 * `repeat(N, 1fr)`) or a raw template string (e.g. "1.6fr 1fr"). Inline
 * styles are used here because `gridTemplateColumns/Rows` and gap are
 * dynamic per call site — these are the kit's blessed exception to the
 * "no inline styles" rule.
 */
export function Grid({
  cols = 1,
  rows,
  gap = 12,
  fill,
  children,
  className,
  style,
}: GridProps) {
  const gridTemplateColumns =
    typeof cols === "number" ? `repeat(${cols}, 1fr)` : cols;

  return (
    <div
      className={cn("grid", fill ? "h-full" : "h-auto", className)}
      style={{
        gridTemplateColumns,
        gridTemplateRows: rows,
        gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
