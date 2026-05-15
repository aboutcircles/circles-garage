import type { CSSProperties, ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";

type GridProps = {
  cols?: number | string;
  rows?: string;
  gap?: number;
  fill?: boolean;
  collapseAt?: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * Thin wrapper over `display: grid`. `cols` accepts a number (expanded to
 * `repeat(N, 1fr)`) or a raw template string (e.g. "1.6fr 1fr"). Inline
 * styles are used here because `gridTemplateColumns/Rows` and gap are
 * dynamic per call site — these are the kit's blessed exception to the
 * "no inline styles" rule. `collapseAt` (px) forces a single column below
 * that width; defaults to 768 when `cols` is a string template.
 */
export function Grid({
  cols = 1,
  rows,
  gap = 12,
  fill,
  collapseAt,
  children,
  className,
  style,
}: GridProps) {
  const gridTemplateColumns =
    typeof cols === "number" ? `repeat(${cols}, 1fr)` : cols;
  const shouldCollapse =
    collapseAt !== undefined || typeof cols === "string";

  return (
    <div
      className={cn(
        "grid",
        fill ? "min-h-full" : "h-auto",
        shouldCollapse && "grid-collapse-md",
        className,
      )}
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
