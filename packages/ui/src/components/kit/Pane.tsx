import type { CSSProperties, ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";

type PaneProps = {
  title?: ReactNode;
  hint?: ReactNode;
  headRight?: ReactNode;
  span?: number;
  rowSpan?: number;
  dense?: boolean;
  flush?: boolean;
  children?: ReactNode;
  className?: string;
};

/**
 * Bordered, titled box — the workhorse of every screen. Title strip renders
 * the `┌─ TITLE ─┐` ASCII chrome and a right-side hint slot. `dense` reduces
 * inner padding, `flush` removes it. `span` and `rowSpan` expand the pane
 * across the parent <Grid>.
 */
export function Pane({
  title,
  hint,
  headRight,
  span,
  rowSpan,
  dense,
  flush,
  children,
  className,
}: PaneProps) {
  const gridStyle: CSSProperties = {};
  if (span) gridStyle.gridColumn = `span ${span}`;
  if (rowSpan) gridStyle.gridRow = `span ${rowSpan}`;

  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden border border-ink",
        className,
      )}
      style={gridStyle}
    >
      {title && (
        <header className="flex items-center justify-between bg-ink px-2.5 py-[5px] font-mono text-[11px] uppercase tracking-[0.08em] text-paper">
          <span>
            <span className="opacity-[0.55]">┌─</span> {title}{" "}
            <span className="opacity-[0.55]">─┐</span>
          </span>
          {(headRight ?? hint) && (
            <span className="text-[10px] tracking-normal normal-case opacity-70">
              {headRight ?? hint}
            </span>
          )}
        </header>
      )}
      <div
        className={cn(
          "relative flex-1 overflow-hidden",
          flush ? "p-0" : dense ? "p-3" : "p-4",
        )}
      >
        {children}
      </div>
    </section>
  );
}
